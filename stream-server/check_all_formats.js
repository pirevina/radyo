const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bigInt = require('big-integer');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const fs = require('fs');

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH || '';
const botToken = process.env.BOT_TOKEN || '';
const channelIdRaw = process.env.CHANNEL_ID || '';

function resolveChannelPeer(rawId) {
    if (!rawId) return null;
    const trimmed = String(rawId).trim();
    if (/^-?\d+$/.test(trimmed)) return bigInt(trimmed);
    return trimmed;
}

async function checkAll() {
    const sessionStr = fs.readFileSync(path.join(__dirname, 'session.txt'), 'utf8').trim();
    const client = new TelegramClient(new StringSession(sessionStr), apiId, apiHash, { connectionRetries: 3 });
    await client.connect();
    const peer = resolveChannelPeer(channelIdRaw);
    
    // Check all IDs from 3 to 32
    const ids = [];
    for (let i = 3; i <= 32; i++) ids.push(i);
    
    const msgs = await client.getMessages(peer, { ids });
    console.log('Fetched msgs:', msgs.length);
    
    for (const msg of msgs) {
        if (!msg || !msg.media || !msg.media.document) {
            console.log(`Msg ${msg ? msg.id : '?'}: NO MEDIA DOCUMENT`);
            continue;
        }
        
        // Download first 16 bytes only
        try {
            const iter = client.iterDownload({
                file: msg.media,
                offset: bigInt(0),
                requestSize: 4096,
            });
            let firstChunk = null;
            for await (const chunk of iter) {
                firstChunk = chunk;
                break;
            }
            if (!firstChunk) {
                console.log(`Msg ${msg.id}: Empty chunk!`);
                continue;
            }
            const hex = firstChunk.slice(0, 16).toString('hex');
            const ascii = firstChunk.slice(4, 12).toString('ascii');
            let format = 'UNKNOWN';
            if (firstChunk[0] === 0x47) {
                format = 'MPEG-TS (.ts)';
            } else if (firstChunk.slice(0, 4).toString('hex') === '1a45dfa3') {
                format = 'Matroska / MKV (.mkv)';
            } else if (firstChunk.slice(4, 8).toString('ascii') === 'ftyp') {
                format = `MP4 (${firstChunk.slice(8, 12).toString('ascii')})`;
            }
            
            console.log(`Msg ${msg.id}: format=[${format}] | text="${(msg.text || '').replace(/\n/g, ' ')}" | hex=${hex.slice(0, 16)}`);
        } catch (e) {
            console.error(`Msg ${msg.id} error:`, e.message);
        }
    }
    
    await client.disconnect();
}

checkAll().catch(e => console.error(e));
