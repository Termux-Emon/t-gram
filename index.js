const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = '7736869978:AAH8wpYSHwAz1ulFEGftx7giGqDWrFnub4s'; // আপনার টোকেন এখানে দিন
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Telegram Webhook Endpoint
app.post(`/webhook`, async (req, res) => {
    const message = req.body.message;

    if (message) {
        const chatId = message.chat.id;
        const command = message.text;

        // কমান্ড চেক করা
        const commandHandler = getCommandHandler(command);
        if (commandHandler) {
            await commandHandler(chatId);
        } else {
            await sendMessage(chatId, 'আপনার কমান্ডটি চিনতে পারি না। /help ব্যবহার করুন।');
        }
    }
    res.sendStatus(200);
});

// Message Sending Function
async function sendMessage(chatId, text) {
    await fetch(`${TELEGRAM_URL}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Command Handler Function
function getCommandHandler(command) {
    const commandFile = command.replace('/', '') + '.js'; // কমান্ডের সাথে ".js" যুক্ত করা
    const commandPath = path.join(__dirname, 'commands', commandFile);

    if (fs.existsSync(commandPath)) {
        const commandModule = require(commandPath);
        return commandModule.execute; // execute ফাংশন কল করা
    }
    return null;
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
