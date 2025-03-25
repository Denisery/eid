# WhatsApp Auto-Reply Bot

This is a WhatsApp bot built using [Baileys](https://github.com/WhiskeySockets/Baileys) that automatically replies with **"Eid Mubarak Bhai! 🌙✨"** when someone sends a message containing **"Eid"** or **"Mubarak"**. The bot also runs a web server to show its uptime and status.

## Features
- Automatically replies to messages containing **"Eid"** or **"Mubarak"**
- Displays QR code in the terminal for authentication
- Keeps the session active to avoid re-scanning QR codes frequently
- Provides a `/` route to check bot status and uptime

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/Denisery/eid.git
   cd whatsapp-bot
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the bot:
   ```sh
   npm run dev
   ```
4. Scan the QR code with WhatsApp to authenticate.

## API Route
- **GET /** → Returns bot status and uptime

## Requirements
- Node.js (v16+ recommended)
- A WhatsApp account
- Stable internet connection

## License
This project is open-source and free to use.

