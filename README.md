# WhatsApp Bot with Baileys & Express

This WhatsApp bot is built using [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) for handling WhatsApp Web connections and Express.js for managing a web interface.

## Features
✅ Automatically responds to messages containing "Eid Mubarak" with a festive greeting.  
✅ Generates a QR Code for WhatsApp Web login.  
✅ Provides an Express server with useful API routes.  
✅ Protected QR Code endpoint with PIN authentication.  
✅ Displays bot uptime and status.  
✅ Automatically reconnects if the connection is lost.

## Installation & Setup
### 1. Clone the Repository
```sh
git clone https://github.com/Denisery/eid.git
cd eid
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment
1. in root directory copy variables from file .env.sample to .env file
2. Set the `PORT` and `QR_PIN`.

### 5. Start the Bot
```sh
npm run dev
```
#### Go to `http://localhost:3000/qr-code?pin=your-qr-pin` to scan the QR code.

## API Endpoints
### 1. Check Bot Status
**GET /**  
Returns the bot’s running status and uptime.

### 2. Get QR Code for Login
**GET /qr-code?pin=your-qr-pin**  
Displays the WhatsApp login QR Code. Requires a valid PIN for access.


## Notes
- The bot automatically retries connection if it gets disconnected.
- The QR code is only available when required; once connected, it disappears.
- Keep the `auth_info` folder secure to maintain your WhatsApp session.

## License
This project is open-source and available for modifications.

