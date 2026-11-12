const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bigInt = require('big-integer');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const app = express();

// Full CORS support for cross-origin streaming, Auth API, Range requests and mobile WebKit/ExoPlayer
app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
    allowedHeaders: ['Range', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'X-Cache']
}));
app.use(express.json({ limit: '64kb' }));

const PORT = process.env.PORT || 3001;
const SESSION_FILE = path.join(__dirname, 'session.txt');

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH || '';
const botToken = process.env.BOT_TOKEN || '';
const channelIdRaw = process.env.CHANNEL_ID || '';

// Google Auth + Tek Seferlik Okul Davet Kodu + HMAC Yayın Bileti Ayarları
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const SHEET_AUTH_URL = (process.env.SHEET_AUTH_URL || '').trim();
const INVITE_CODE = (process.env.INVITE_CODE || '').trim();
const TOKEN_SECRET = (process.env.TOKEN_SECRET || '').trim();
const STREAM_TOKEN_TTL_SEC = 7 * 24 * 60 * 60; // 7 gün

if (!GOOGLE_CLIENT_ID || !SHEET_AUTH_URL || !INVITE_CODE || !TOKEN_SECRET) {
    console.warn('[Auth Uyarısı] GOOGLE_CLIENT_ID, SHEET_AUTH_URL, INVITE_CODE veya TOKEN_SECRET eksik. Auth ve korumalı stream istekleri reddedilecektir.');
}

function safeEqualText(a, b) {
    const bufA = Buffer.from(String(a || '').normalize('NFC'), 'utf8');
    const bufB = Buffer.from(String(b || '').normalize('NFC'), 'utf8');
    if (bufA.length === 0 || bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

function signStreamToken(user) {
    if (!TOKEN_SECRET) {
        throw new Error('TOKEN_SECRET tanımlı değil.');
    }
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + STREAM_TOKEN_TTL_SEC;
    const payload = {
        email: String(user.email || '').trim().toLowerCase(),
        name: String(user.name || '').trim(),
        iat: nowSec,
        exp: expSec
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const sigB64 = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url');
    return {
        token: `${payloadB64}.${sigB64}`,
        expiresAt: expSec * 1000
    };
}

function verifyStreamToken(token) {
    if (!TOKEN_SECRET || !token || typeof token !== 'string') return null;
    const dotIdx = token.indexOf('.');
    if (dotIdx <= 0 || dotIdx === token.length - 1 || token.indexOf('.', dotIdx + 1) !== -1) {
        return null;
    }
    const payloadB64 = token.slice(0, dotIdx);
    const sigB64 = token.slice(dotIdx + 1);
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url');
    const sigBuf = Buffer.from(sigB64, 'utf8');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return null;
    }
    try {
        const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
        if (!parsed || typeof parsed.email !== 'string' || !parsed.email) return null;
        if (typeof parsed.exp !== 'number' || parsed.exp <= Math.floor(Date.now() / 1000)) {
            return null;
        }
        return parsed;
    } catch (_) {
        return null;
    }
}

function extractRequestToken(req) {
    if (req.query && typeof req.query.token === 'string' && req.query.token.trim()) {
        return req.query.token.trim();
    }
    const authHeader = req.headers && req.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }
    return '';
}

function requireStreamToken(req, res, next) {
    const token = extractRequestToken(req);
    const verified = verifyStreamToken(token);
    if (!verified) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store');
        if (req.method === 'HEAD') {
            return res.status(401).end();
        }
        return res.status(401).json({ error: 'Yetkisiz erişim. Geçerli bir yayın bileti gerekli.' });
    }
    req.authUser = verified;
    return next();
}

async function verifyGoogleIdToken(credential) {
    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const response = await fetch(tokenInfoUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    if (!data || !data.email) return null;
    if (data.aud !== GOOGLE_CLIENT_ID) return null;
    if (data.email_verified !== true && data.email_verified !== 'true') return null;
    if (data.exp && Number(data.exp) <= Math.floor(Date.now() / 1000)) return null;

    return {
        email: String(data.email).trim().toLowerCase(),
        name: String(data.name || data.email.split('@')[0]).trim(),
        picture: String(data.picture || '').trim()
    };
}

async function querySheetAuth(payload) {
    const response = await fetch(SHEET_AUTH_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000)
    });
    const rawText = await response.text();
    let parsed = null;
    try {
        parsed = JSON.parse(rawText);
    } catch (_) {
        throw new Error(`Apps Script geçersiz JSON döndü (HTTP ${response.status}).`);
    }
    if (!response.ok) {
        throw new Error((parsed && parsed.error) || `Apps Script hatası (HTTP ${response.status}).`);
    }
    return parsed || {};
}

// RAM-bounded caches (Render Free Tier = 512 MB limit)
const messageMetadataCache = new Map();
const metadataInFlight = new Map();
const MAX_META_ENTRIES = 500;
const META_TTL_MS = 20 * 60 * 1000; // 20 minutes

// Initial chunk cache: first 1 MB of up to 30 songs (~30 MB max RAM)
const initialChunkCache = new Map();
const MAX_INITIAL_ENTRIES = 30;
const INITIAL_CACHE_BYTES = 1024 * 1024; // 1 MB

// Tail chunk cache: strictly for MP4/M4A moov atom seeks (up to 12 entries x 4 MB = ~48 MB max RAM)
const tailChunkCache = new Map();
const prefetchInProgress = new Set();
const MAX_TAIL_ENTRIES = 12;
const MAX_TAIL_CHUNK_BYTES = 4 * 1024 * 1024; // 4 MB

function putInCache(map, key, data, maxEntries) {
    if (map.has(key)) {
        map.delete(key);
    } else if (map.size >= maxEntries) {
        const oldestKey = map.keys().next().value;
        map.delete(oldestKey);
    }
    map.set(key, data);
}

function isFatalAuthError(err) {
    const msg = String((err && (err.errorMessage || err.message)) || '');
    return (
        msg.includes('AUTH_KEY_DUPLICATED') ||
        msg.includes('AUTH_KEY_UNREGISTERED') ||
        msg.includes('SESSION_REVOKED') ||
        msg.includes('USER_DEACTIVATED') ||
        msg.includes('AUTH_KEY_INVALID')
    );
}

function isTransientTelegramError(err) {
    const msg = String((err && (err.errorMessage || err.message)) || '');
    return (
        msg.includes('Not connected') ||
        msg.includes('CONNECTION_NOT_INITED') ||
        msg.includes('TIMEOUT') ||
        msg.includes('ECONNRESET') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('Broken pipe') ||
        msg.includes('Socket closed') ||
        msg.includes('FLOOD_WAIT')
    );
}

function isFileRefError(err) {
    const msg = String((err && (err.errorMessage || err.message)) || '');
    return msg.includes('FILE_REFERENCE_EXPIRED') || msg.includes('FILEREF_UPGRADE_NEEDED');
}

// Load initial session
let savedSession = process.env.SESSION_STRING || '';
if (fs.existsSync(SESSION_FILE)) {
    try {
        const fileContent = fs.readFileSync(SESSION_FILE, 'utf8').trim();
        if (fileContent) {
            savedSession = fileContent;
        }
    } catch (_) {}
}

let stringSession = new StringSession(savedSession);
let client = null;
let telegramReady = false;
let initPromise = null;
let reconnectPromise = null;

async function connectTelegramInternal(forceReset = false) {
    if (!apiId || !apiHash || !botToken) {
        console.warn('[UYARI] .env içindeki API_ID, API_HASH veya BOT_TOKEN eksik! Lütfen .env dosyasını doldurun.');
        return;
    }

    if (client) {
        try {
            await client.disconnect();
        } catch (_) {}
        client = null;
    }

    if (forceReset) {
        stringSession = new StringSession('');
    }

    const nextClient = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        autoReconnect: true,
        retryDelay: 1000,
        floodSleepThreshold: 5, // Do not freeze HTTP requests for 60s on flood wait
    });

    await nextClient.start({
        botAuthToken: botToken,
    });

    client = nextClient;
    telegramReady = true;
    messageMetadataCache.clear();

    const currentSessionString = client.session.save();
    if (currentSessionString) {
        stringSession = new StringSession(currentSessionString);
        try {
            fs.writeFileSync(SESSION_FILE, currentSessionString, 'utf8');
        } catch (_) {}
    }
}

async function initTelegramClient() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            await connectTelegramInternal(false);
            console.log('[Telegram] GramJS istemcisi başarıyla bağlandı ve hazır.');
        } catch (err) {
            console.warn('[Telegram] Kayıtlı oturum ile bağlanırken hata oluştu:', err.message);
            if (isFatalAuthError(err)) {
                console.log('[Telegram] Oturum anahtarı sıfırlanıyor ve yeni temiz oturum oluşturuluyor...');
                await connectTelegramInternal(true);
                console.log('[Telegram] GramJS istemcisi yeni oturumla başarıyla bağlandı ve hazır.');
            } else {
                telegramReady = false;
                throw err;
            }
        } finally {
            initPromise = null;
        }
    })();

    return initPromise;
}

async function reconnectTelegramClient(forceReset = false) {
    if (reconnectPromise) return reconnectPromise;

    telegramReady = false;
    reconnectPromise = (async () => {
        try {
            console.log(`[Telegram] Yeniden bağlanılıyor (forceReset=${forceReset})...`);
            await connectTelegramInternal(forceReset);
            console.log('[Telegram] Yeniden bağlantı başarılı.');
        } catch (err) {
            if (!forceReset && isFatalAuthError(err)) {
                console.log('[Telegram] Oturum çakışması algılandı, temiz oturumla tekrar bağlanılıyor...');
                await connectTelegramInternal(true);
                console.log('[Telegram] Temiz oturumla yeniden bağlantı başarılı.');
            } else {
                console.error('[Telegram] Yeniden bağlantı başarısız:', err.message);
                throw err;
            }
        } finally {
            reconnectPromise = null;
        }
    })();

    return reconnectPromise;
}

async function ensureTelegramReady(timeoutMs = 15000) {
    if (client && client.connected && telegramReady && !reconnectPromise) {
        return true;
    }

    const pending = reconnectPromise || initPromise || initTelegramClient();
    let timer;
    try {
        await Promise.race([
            pending,
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error('TELEGRAM_CONNECT_TIMEOUT')), timeoutMs);
            })
        ]);
    } finally {
        clearTimeout(timer);
    }

    return !!(client && client.connected && telegramReady);
}

async function prefetchTail(messageId, media, start, end) {
    if (tailChunkCache.has(messageId) || prefetchInProgress.has(messageId)) return;
    if (!client || !client.connected || !telegramReady) return;
    const bytesToFetch = end - start + 1;
    if (bytesToFetch <= 0 || bytesToFetch > MAX_TAIL_CHUNK_BYTES) return;

    prefetchInProgress.add(messageId);
    let iter = null;
    try {
        const alignedStart = Math.floor(start / 4096) * 4096;
        const skipBytes = start - alignedStart;
        iter = client.iterDownload({
            file: media,
            offset: bigInt(alignedStart),
            requestSize: 524288,
        });
        const chunks = [];
        let isFirst = true;
        let rem = bytesToFetch;
        for await (const chunk of iter) {
            let buf = Buffer.from(chunk);
            if (isFirst) {
                isFirst = false;
                if (skipBytes > 0) buf = buf.slice(skipBytes);
            }
            if (buf.length > rem) buf = buf.slice(0, rem);
            if (buf.length > 0) {
                chunks.push(buf);
                rem -= buf.length;
            }
            if (rem <= 0) break;
        }
        if (chunks.length > 0 && rem <= 0) {
            const tailBuf = Buffer.concat(chunks);
            putInCache(tailChunkCache, messageId, {
                start: start,
                end: end,
                buffer: tailBuf
            }, MAX_TAIL_ENTRIES);
        }
    } catch (err) {
        console.warn(`[Pre-fetch MOOV Hatası msg ${messageId}]:`, err.message);
    } finally {
        if (iter && typeof iter.return === 'function') {
            try { await iter.return(); } catch (_) {}
        }
        prefetchInProgress.delete(messageId);
    }
}

function resolveChannelPeer(rawId) {
    if (!rawId) return null;
    const trimmed = String(rawId).trim();
    if (/^-?\d+$/.test(trimmed)) {
        return bigInt(trimmed);
    }
    return trimmed;
}

async function fetchMetadataFromTelegram(messageId) {
    const channelPeer = resolveChannelPeer(channelIdRaw);
    if (!channelPeer) throw new Error('CHANNEL_ID yapılandırılmamış.');

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            await ensureTelegramReady(15000);
            const messages = await client.getMessages(channelPeer, { ids: [messageId] });
            if (!messages || messages.length === 0 || !messages[0]) {
                return null;
            }

            const msg = messages[0];
            const media = msg.media;
            const document = media && media.document ? media.document : null;
            if (!document) return null;

            const mimeType = document.mimeType || 'audio/mpeg';
            const metadata = {
                media,
                document,
                fileSize: Number(document.size),
                mimeType: mimeType,
                timestamp: Date.now()
            };
            putInCache(messageMetadataCache, messageId, metadata, MAX_META_ENTRIES);
            return metadata;
        } catch (err) {
            const fatal = isFatalAuthError(err);
            const transient = isTransientTelegramError(err);
            if (attempt === 0 && (fatal || transient)) {
                console.warn(`[getDocumentForMessage] Hata (${err.message}), oturum yenilenip tekrar deneniyor (msg ${messageId})...`);
                await reconnectTelegramClient(fatal);
                continue;
            }
            throw err;
        }
    }
    return null;
}

async function getDocumentForMessage(messageId, forceRefresh = false) {
    if (!forceRefresh) {
        const cached = messageMetadataCache.get(messageId);
        if (cached && (Date.now() - cached.timestamp < META_TTL_MS)) {
            return cached;
        }
        if (metadataInFlight.has(messageId)) {
            return await metadataInFlight.get(messageId);
        }
    } else {
        messageMetadataCache.delete(messageId);
    }

    const promise = fetchMetadataFromTelegram(messageId).finally(() => {
        metadataInFlight.delete(messageId);
    });
    metadataInFlight.set(messageId, promise);
    return await promise;
}

function waitForDrainOrClose(res, req, isClosedRef) {
    return new Promise((resolve) => {
        if (isClosedRef.closed || res.writableEnded || res.destroyed) {
            isClosedRef.closed = true;
            return resolve();
        }
        const cleanup = () => {
            res.off('drain', onDrain);
            res.off('close', onClose);
            req.off('aborted', onClose);
            resolve();
        };
        const onDrain = () => cleanup();
        const onClose = () => {
            isClosedRef.closed = true;
            cleanup();
        };
        res.once('drain', onDrain);
        res.once('close', onClose);
        req.once('aborted', onClose);
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
        status: 'ok',
        telegramConnected: !!(client && client.connected && telegramReady),
        channelConfigured: !!channelIdRaw,
        authConfigured: !!(GOOGLE_CLIENT_ID && SHEET_AUTH_URL && INVITE_CODE && TOKEN_SECRET),
        rssMB: Math.round(mem.rss / (1024 * 1024)),
        caches: {
            meta: messageMetadataCache.size,
            initial: initialChunkCache.size,
            tail: tailChunkCache.size
        },
        timestamp: new Date().toISOString()
    });
});

// Google Sign-In + Tek Seferlik Okul Davet Kodu + Sheet Doğrulama
app.post('/api/auth/google', async (req, res) => {
    try {
        if (!GOOGLE_CLIENT_ID || !SHEET_AUTH_URL || !INVITE_CODE || !TOKEN_SECRET) {
            return res.status(500).json({ error: 'Sunucu kimlik doğrulama ortam değişkenleri eksik.' });
        }

        const credential = req.body && typeof req.body.credential === 'string' ? req.body.credential.trim() : '';
        const inviteCodeRaw = req.body && typeof req.body.inviteCode === 'string' ? req.body.inviteCode.trim() : '';

        if (!credential) {
            return res.status(400).json({ error: 'Google kimlik belirteci (credential) gerekli.' });
        }

        const googleUser = await verifyGoogleIdToken(credential);
        if (!googleUser) {
            return res.status(401).json({ error: 'Google oturumu doğrulanamadı veya süresi doldu.' });
        }

        const checkRes = await querySheetAuth({
            action: 'check',
            email: googleUser.email
        });

        if (checkRes.blocked === true) {
            return res.status(403).json({
                status: 'blocked',
                error: 'Bu hesabın radyo yayınına erişimi kısıtlanmış.'
            });
        }

        if (checkRes.approved === true) {
            const { token, expiresAt } = signStreamToken(googleUser);
            return res.json({
                status: 'ok',
                token,
                expiresAt,
                user: googleUser
            });
        }

        // İlk kez giriş yapan öğrenci: tek seferlik okul davet kodu gerekli
        if (!inviteCodeRaw) {
            return res.json({
                status: 'need_invite_code',
                user: googleUser
            });
        }

        if (!safeEqualText(inviteCodeRaw, INVITE_CODE)) {
            return res.status(403).json({
                status: 'invalid_invite_code',
                error: 'Okul davet kodu hatalı. Lütfen kontrol edip tekrar deneyin.'
            });
        }

        const registerRes = await querySheetAuth({
            action: 'register',
            email: googleUser.email,
            name: googleUser.name
        });

        if (registerRes && registerRes.blocked === true) {
            return res.status(403).json({
                status: 'blocked',
                error: 'Bu hesabın erişimi engellenmiş.'
            });
        }

        const { token, expiresAt } = signStreamToken(googleUser);
        return res.json({
            status: 'ok',
            token,
            expiresAt,
            user: googleUser
        });
    } catch (err) {
        console.error('[Auth /api/auth/google Hatası]:', err.message || err);
        return res.status(502).json({ error: 'Kimlik doğrulama servisine ulaşılamadı. Lütfen tekrar deneyin.' });
    }
});

// Mevcut yayın biletinin sunucu tarafında hızlı kontrolü
app.get('/api/auth/verify', (req, res) => {
    const token = extractRequestToken(req);
    const verified = verifyStreamToken(token);
    if (!verified) {
        return res.status(401).json({ valid: false, error: 'Oturum geçersiz veya süresi dolmuş.' });
    }
    return res.json({
        valid: true,
        user: {
            name: verified.name,
            email: verified.email
        },
        expiresAt: verified.exp * 1000
    });
});

// HEAD endpoint for mobile browsers / AVPlayer probe (token korumalı)
app.head('/stream/:messageId', requireStreamToken, async (req, res) => {
    try {
        const ready = await ensureTelegramReady(15000).catch(() => false);
        if (!ready) {
            res.setHeader('Retry-After', '3');
            return res.status(503).end();
        }

        const messageId = parseInt(req.params.messageId, 10);
        if (isNaN(messageId) || messageId <= 0) {
            return res.status(400).end();
        }

        const data = await getDocumentForMessage(messageId);
        if (!data) {
            return res.status(404).end();
        }

        res.writeHead(200, {
            'Accept-Ranges': 'bytes',
            'Content-Length': data.fileSize,
            'Content-Type': data.mimeType || 'audio/mpeg',
            'Cache-Control': 'private, max-age=3600',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
            'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, X-Cache',
        });
        res.end();
    } catch (err) {
        console.error('[HEAD Hatası]:', err.message || err);
        res.status(500).end();
    }
});

app.get('/stream/:messageId', requireStreamToken, async (req, res) => {
    try {
        const ready = await ensureTelegramReady(15000).catch(() => false);
        if (!ready) {
            res.setHeader('Retry-After', '3');
            return res.status(503).send('Telegram istemcisi bağlanıyor, lütfen birkaç saniye sonra tekrar deneyin.');
        }

        const messageId = parseInt(req.params.messageId, 10);
        if (isNaN(messageId) || messageId <= 0) {
            return res.status(400).send('Geçersiz messageId.');
        }

        let data = await getDocumentForMessage(messageId);
        if (!data) {
            return res.status(404).send('Mesaj veya ses dosyası bulunamadı.');
        }

        const fileSize = data.fileSize;
        const rangeHeader = req.headers.range;

        let start = 0;
        let end = fileSize - 1;
        let isRangeRequest = false;

        // RFC 7233 Range parser (supports iOS Safari suffix range)
        if (rangeHeader) {
            const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
            if (match) {
                isRangeRequest = true;
                const sStr = match[1];
                const eStr = match[2];

                if (!sStr && eStr) {
                    const suffix = parseInt(eStr, 10);
                    start = Math.max(0, fileSize - suffix);
                    end = fileSize - 1;
                } else if (sStr && !eStr) {
                    start = parseInt(sStr, 10);
                    end = fileSize - 1;
                } else if (sStr && eStr) {
                    start = parseInt(sStr, 10);
                    end = Math.min(parseInt(eStr, 10), fileSize - 1);
                }
            }
        }

        if (start >= fileSize || start < 0 || start > end) {
            res.writeHead(416, {
                'Content-Range': `bytes */${fileSize}`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length',
            });
            return res.end();
        }

        const commonHeaders = {
            'Accept-Ranges': 'bytes',
            'Content-Type': data.mimeType || 'audio/mpeg',
            'Cache-Control': 'private, max-age=3600',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
            'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, X-Cache',
        };

        if (req.method === 'HEAD') {
            res.writeHead(200, {
                ...commonHeaders,
                'Content-Length': fileSize,
            });
            return res.end();
        }

        // 1. FAST PATH: Full requested closed range exists in initialChunkCache (e.g. Safari bytes=0-1 or pre-warmed 0-128KB)
        const cachedInitial = initialChunkCache.get(messageId);
        if (cachedInitial && start >= cachedInitial.start && end <= cachedInitial.end) {
            const offsetStart = start - cachedInitial.start;
            const offsetEnd = end - cachedInitial.start;
            const slice = cachedInitial.buffer.subarray(offsetStart, offsetEnd + 1);

            res.writeHead(isRangeRequest ? 206 : 200, {
                ...commonHeaders,
                ...(isRangeRequest ? { 'Content-Range': `bytes ${start}-${end}/${fileSize}` } : {}),
                'Content-Length': slice.length,
                'X-Cache': 'HIT-INITIAL',
            });
            return res.end(slice);
        }

        // 2. FAST PATH: Tail range exists in tailChunkCache (MP4/M4A moov atom)
        const cachedTail = tailChunkCache.get(messageId);
        if (cachedTail && start >= cachedTail.start && end <= cachedTail.end) {
            const offsetStart = start - cachedTail.start;
            const offsetEnd = end - cachedTail.start;
            const slice = cachedTail.buffer.subarray(offsetStart, offsetEnd + 1);

            res.writeHead(isRangeRequest ? 206 : 200, {
                ...commonHeaders,
                ...(isRangeRequest ? { 'Content-Range': `bytes ${start}-${end}/${fileSize}` } : {}),
                'Content-Length': slice.length,
                'X-Cache': 'HIT-TAIL',
            });
            return res.end(slice);
        }

        if (req.socket) {
            req.socket.setTimeout(0);
        }

        const bytesToSend = end - start + 1;
        const closedRef = { closed: false };
        res.on('close', () => {
            if (!res.writableEnded) {
                closedRef.closed = true;
            }
        });
        req.on('aborted', () => {
            closedRef.closed = true;
        });

        let remainingBytes = bytesToSend;
        let streamOffset = start;

        // If starting from 0 and initialChunkCache has a prefix, prepare it to write after headers
        let initialPrefixSlice = null;
        if (start === 0 && cachedInitial && cachedInitial.buffer && cachedInitial.buffer.length > 0) {
            initialPrefixSlice = (cachedInitial.buffer.length > remainingBytes)
                ? cachedInitial.buffer.subarray(0, remainingBytes)
                : cachedInitial.buffer;
            remainingBytes -= initialPrefixSlice.length;
            streamOffset += initialPrefixSlice.length;
        }

        const writeStreamHeaders = (cacheTag = 'MISS') => {
            if (res.headersSent) return;
            res.writeHead(isRangeRequest ? 206 : 200, {
                ...commonHeaders,
                ...(isRangeRequest ? { 'Content-Range': `bytes ${start}-${end}/${fileSize}` } : {}),
                'Content-Length': bytesToSend,
                'X-Cache': cacheTag,
            });
        };

        // If initialPrefixSlice satisfied the entire request
        if (remainingBytes <= 0) {
            writeStreamHeaders('HIT-INITIAL');
            if (!closedRef.closed) {
                if (initialPrefixSlice) res.write(initialPrefixSlice);
                res.end();
            }
            return;
        }

        // Open Telegram download iterator with pre-header retry on stale file_reference or dropped connection
        let asyncIter = null;
        let firstRawChunk = null;
        let alignedStart = Math.floor(streamOffset / 4096) * 4096;
        let skipBytes = streamOffset - alignedStart;

        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                await ensureTelegramReady(15000);
                alignedStart = Math.floor(streamOffset / 4096) * 4096;
                skipBytes = streamOffset - alignedStart;

                const downloadIterable = client.iterDownload({
                    file: data.media,
                    offset: bigInt(alignedStart),
                    requestSize: 524288, // 512 KB
                });
                asyncIter = downloadIterable[Symbol.asyncIterator]();

                const firstStep = await asyncIter.next();
                if (!firstStep.done && firstStep.value) {
                    firstRawChunk = firstStep.value;
                }
                break;
            } catch (iterErr) {
                if (asyncIter && typeof asyncIter.return === 'function') {
                    try { await asyncIter.return(); } catch (_) {}
                }
                asyncIter = null;

                const fileRefExpired = isFileRefError(iterErr);
                const fatalAuth = isFatalAuthError(iterErr);
                const transient = isTransientTelegramError(iterErr);

                if (attempt === 0 && (fileRefExpired || fatalAuth || transient)) {
                    console.warn(`[Stream İlk Parça Kurtarma] msg ${messageId}: ${iterErr.message}`);
                    if (fatalAuth || transient) {
                        await reconnectTelegramClient(fatalAuth);
                    }
                    const refreshed = await getDocumentForMessage(messageId, true);
                    if (refreshed) data = refreshed;
                    continue;
                }
                throw iterErr;
            }
        }

        // Now we know Telegram stream is valid and delivering bytes -> send HTTP headers!
        writeStreamHeaders(initialPrefixSlice ? 'PARTIAL-HIT' : 'MISS');

        if (initialPrefixSlice && !closedRef.closed) {
            const canWritePrefix = res.write(initialPrefixSlice);
            if (!canWritePrefix && !closedRef.closed) {
                await waitForDrainOrClose(res, req, closedRef);
            }
        }

        // Cache accumulators (bounded to prevent OOM on Render 512MB)
        let initialAccumulator = (start === 0 && !cachedInitial) ? [] : null;
        let initialAccumulatorSize = 0;
        const isStrictTailSeek = (start > 0 && start >= fileSize - MAX_TAIL_CHUNK_BYTES && bytesToSend <= MAX_TAIL_CHUNK_BYTES);
        const tailAccumulator = isStrictTailSeek ? [] : null;

        let isFirstChunk = true;

        const commitInitialCache = (chunksList) => {
            if (!chunksList || chunksList.length === 0) return;
            const fullBuf = Buffer.concat(chunksList);
            putInCache(initialChunkCache, messageId, {
                start: 0,
                end: fullBuf.length - 1,
                buffer: fullBuf
            }, MAX_INITIAL_ENTRIES);

            // Only scan for MOOV atom on MP4/M4A containers
            const isMp4Container = (data.mimeType || '').toLowerCase().includes('mp4');
            if (isMp4Container && !tailChunkCache.has(messageId) && fullBuf.length >= 48) {
                try {
                    const headMoovIdx = fullBuf.indexOf(Buffer.from('moov'));
                    if (headMoovIdx === -1) {
                        const mdatIdx = fullBuf.indexOf(Buffer.from('mdat'));
                        if (mdatIdx >= 4) {
                            const mdatSize = fullBuf.readUInt32BE(mdatIdx - 4);
                            if (mdatSize > 0 && mdatSize < fileSize) {
                                const moovStart = (mdatIdx - 4) + mdatSize;
                                if (moovStart < fileSize && (fileSize - moovStart) <= MAX_TAIL_CHUNK_BYTES) {
                                    prefetchTail(messageId, data.media, moovStart, fileSize - 1);
                                }
                            }
                        }
                    }
                } catch (_) {}
            }
        };

        const processChunk = async (rawChunk) => {
            if (closedRef.closed || remainingBytes <= 0) return false;

            const rawBuffer = Buffer.from(rawChunk);

            // Cache full raw Telegram chunks (512KB aligned) from start=0 even on shorter pre-warm range requests
            if (initialAccumulator && rawBuffer.length > 0) {
                initialAccumulator.push(rawBuffer);
                initialAccumulatorSize += rawBuffer.length;
                if (initialAccumulatorSize >= INITIAL_CACHE_BYTES) {
                    commitInitialCache(initialAccumulator);
                    initialAccumulator = null;
                }
            }

            let buffer = rawBuffer;

            if (isFirstChunk) {
                isFirstChunk = false;
                if (skipBytes > 0) {
                    buffer = buffer.subarray(skipBytes);
                }
            }

            if (buffer.length > remainingBytes) {
                buffer = buffer.subarray(0, remainingBytes);
            }

            if (buffer.length > 0) {
                if (tailAccumulator) {
                    tailAccumulator.push(buffer);
                }

                if (!closedRef.closed) {
                    const canWrite = res.write(buffer);
                    remainingBytes -= buffer.length;

                    if (!canWrite && !closedRef.closed) {
                        await waitForDrainOrClose(res, req, closedRef);
                    }
                }
            }

            return !closedRef.closed && remainingBytes > 0;
        };

        try {
            if (firstRawChunk) {
                let shouldContinue = await processChunk(firstRawChunk);
                while (shouldContinue && asyncIter) {
                    const step = await asyncIter.next();
                    if (step.done) break;
                    shouldContinue = await processChunk(step.value);
                }
            }
        } finally {
            if (asyncIter && typeof asyncIter.return === 'function') {
                try { await asyncIter.return(); } catch (_) {}
            }
        }

        // Commit whatever initial bytes (e.g. 512KB first chunk on a 128KB pre-warm) we accumulated
        if (initialAccumulator && initialAccumulator.length > 0 && remainingBytes <= 0) {
            commitInitialCache(initialAccumulator);
            initialAccumulator = null;
        }

        if (tailAccumulator && remainingBytes <= 0 && !closedRef.closed) {
            const fullBuf = Buffer.concat(tailAccumulator);
            putInCache(tailChunkCache, messageId, {
                start: start,
                end: end,
                buffer: fullBuf
            }, MAX_TAIL_ENTRIES);
        }

        if (!closedRef.closed && !res.writableEnded) {
            res.end();
        }
    } catch (error) {
        console.error('[Stream Hatası]:', error.message || error);
        if (!res.headersSent) {
            res.status(500).send('Ses akışı sırasında sunucu hatası oluştu.');
        } else if (!res.writableEnded) {
            res.end();
        }
    }
});

const server = app.listen(PORT, () => {
    console.log(`[Stream Server] http://localhost:${PORT} üzerinde çalışıyor.`);
    initTelegramClient().catch((err) => {
        console.error('[Telegram Başlatma Hatası]:', err.message || err);
    });
});

// Graceful shutdown so Render rolling deploys do not cause AUTH_KEY_DUPLICATED
async function gracefulShutdown(signal) {
    console.log(`[Stream Server] ${signal} sinyali alındı, bağlantılar kapatılıyor...`);
    try {
        if (client) {
            await client.disconnect();
        }
    } catch (_) {}
    server.close(() => {
        process.exit(0);
    });
    setTimeout(() => process.exit(0), 3000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uzun süreli akışlarda Node.js 18+ soket zaman aşımını kaldır
server.requestTimeout = 0;
server.headersTimeout = 65000;
server.keepAliveTimeout = 120000;
