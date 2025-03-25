const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

const app = express();
const startTime = Date.now();

function formatUptime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return `${days} days, ${hours}h:${minutes}m:${seconds}s`;
}

app.get("/", (req, res) => {
    res.status(200).json({
        server_status: "Bot is running",
        uptime: formatUptime(Date.now() - startTime)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function connectWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { qr, connection } = update;

        if (qr) {
            console.log("Scan the QR Code below with WhatsApp:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Bot Connected!");
        } else if (connection === "close") {
            console.log("❌ Connection closed! Restarting...");
            connectWhatsApp();
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        const message = m.messages[0];

        if (!message.key.fromMe && message.message?.conversation) {
            const text = message.message.conversation.toLowerCase();

            if (text.includes("eid") || text.includes("mubarak") || text.includes("eid mubarak")) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: "Eid Mubarak Bhai! 🌙✨\n May Allah accept (good deeds) from us and from you.💫"
                });
            }
        }
    });

    return sock;
}

connectWhatsApp();
