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

async function fetchSongs() {
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

    // 1. Teoman: 99 to 132
    const teomanIds = [];
    for (let i = 99; i <= 132; i++) {
        teomanIds.push(i);
    }
    console.log(`Fetching Teoman messages (99 to 132, Total: ${teomanIds.length})...`);
    const teomanMsgs = await client.getMessages(peer, { ids: teomanIds });
    console.log(`Fetched ${teomanMsgs.length} Teoman messages.`);

    // 2. Haluk Levent: 278 to 325
    const halukIds = [];
    for (let i = 278; i <= 325; i++) {
        halukIds.push(i);
    }
    console.log(`Fetching Haluk Levent messages (278 to 325, Total: ${halukIds.length})...`);
    const halukMsgs = await client.getMessages(peer, { ids: halukIds });
    console.log(`Fetched ${halukMsgs.length} Haluk Levent messages.`);

    function processMsgs(msgs) {
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
        return songData;
    }

    const teomanData = processMsgs(teomanMsgs);
    const halukData = processMsgs(halukMsgs);

    fs.writeFileSync(path.join(__dirname, 'teoman_fetched.json'), JSON.stringify(teomanData, null, 2), 'utf8');
    fs.writeFileSync(path.join(__dirname, 'haluk_fetched.json'), JSON.stringify(halukData, null, 2), 'utf8');

    console.log(`Saved ${teomanData.length} Teoman songs to teoman_fetched.json`);
    console.log(`Saved ${halukData.length} Haluk Levent songs to haluk_fetched.json`);

    await client.disconnect();
}

fetchSongs().catch(err => {
    console.error('Error fetching songs:', err);
    process.exit(1);
});
