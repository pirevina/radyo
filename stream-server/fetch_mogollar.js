const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const bigInt = require('big-integer');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const fs = require('fs');

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH || '';
const channelIdRaw = process.env.CHANNEL_ID || '';

function resolveChannelPeer(rawId) {
    if (!rawId) return null;
    const trimmed = String(rawId).trim();
    if (/^-?\d+$/.test(trimmed)) return bigInt(trimmed);
    return trimmed;
}

async function fetchMogollarSongs() {
    let sessionStr = '';
    const sessionFile = path.join(__dirname, 'session.txt');
    if (fs.existsSync(sessionFile)) {
        sessionStr = fs.readFileSync(sessionFile, 'utf8').trim();
    }
    if (!sessionStr) {
        sessionStr = process.env.SESSION_STRING || '';
    }

    const client = new TelegramClient(new StringSession(sessionStr), apiId, apiHash, { connectionRetries: 3 });
    await client.connect();

    const peer = resolveChannelPeer(channelIdRaw);
    const ids = [];
    for (let i = 230; i <= 277; i++) {
        ids.push(i);
    }

    console.log(`Fetching messages from channel for IDs 230 to 277 (Total: ${ids.length})...`);
    const msgs = await client.getMessages(peer, { ids });
    console.log(`Fetched ${msgs.length} messages.`);

    const songData = [];

    for (const msg of msgs) {
        if (!msg) continue;
        const id = msg.id;
        const text = msg.message || '';
        let fileName = '';
        let title = '';
        let performer = '';
        let duration = 0;
        let mimeType = '';
        let size = 0;

        if (msg.media && msg.media.document) {
            const doc = msg.media.document;
            mimeType = doc.mimeType || '';
            size = Number(doc.size || 0);

            if (doc.attributes) {
                for (const attr of doc.attributes) {
                    if (attr.className === 'DocumentAttributeAudio') {
                        title = attr.title || '';
                        performer = attr.performer || '';
                        duration = attr.duration || 0;
                    } else if (attr.className === 'DocumentAttributeFilename') {
                        fileName = attr.fileName || '';
                    }
                }
            }
        }

        songData.push({
            id,
            title,
            performer,
            fileName,
            duration,
            mimeType,
            size,
            caption: text
        });
    }

    songData.sort((a, b) => a.id - b.id);

    fs.writeFileSync(path.join(__dirname, 'mogollar_fetched.json'), JSON.stringify(songData, null, 2), 'utf8');
    console.log(`Saved ${songData.length} song details to mogollar_fetched.json.`);
    console.log('Sample songs:', JSON.stringify(songData.slice(0, 5), null, 2));

    await client.disconnect();
}

fetchMogollarSongs().catch(err => {
    console.error('Error fetching songs:', err);
    process.exit(1);
});
