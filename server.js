require('dotenv').config()
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const QR_PIN = process.env.QR_PIN;
let latestQR = null;

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
            latestQR = qr;
            console.log(`✅ QR Code generated. Visit: http://localhost:${PORT}/qr-code?pin=${QR_PIN} to scan.`);
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Bot Connected!");
            latestQR = null;
        } else if (connection === "close") {
            console.log("❌ Connection closed! Restarting...");
            latestQR = null;
            setTimeout(connectWhatsApp, 10000);
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        const message = m.messages[0];
        if (!message.key.fromMe && message.message?.conversation) {
            const text = message.message.conversation.toLowerCase();
            if (text.includes("eid") || text.includes("mubarak")) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: "Eid Mubarak Bhai! 🌙✨\nMay Allah accept (good deeds) from us and from you.💫"
                });
            }
        }
    });

    return sock;
}

// Express Routes

// Status Route
app.get("/", (req, res) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    res.json({
        status: "Bot is running",
        uptime: `${days} days, ${hours}h: ${minutes}m: ${seconds}s`
    });
});

// QR Code Route (Protected with PIN)
app.get("/qr-code", async (req, res) => {
    const userPin = req.query.pin;
    if (userPin !== QR_PIN) {
        return res.status(403).send("Access Denied: Invalid PIN");
    }

    if (!latestQR) {
        console.log("⚠️ No QR Code available at the moment.");
        return res.status(404).send("QR Code not available. Wait for it to generate.");
    }

    try {
        const qrImage = await qrcode.toDataURL(latestQR);
        res.send(`<img src="${qrImage}" alt="Scan this QR code to connect to WhatsApp"/>`);
    } catch (err) {
        console.error("⚠️ Error generating QR Code:", err);
        res.status(500).send("Error generating QR Code.");
    }
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`🌍 Server is running on port ${PORT}`);
});

connectWhatsApp();
