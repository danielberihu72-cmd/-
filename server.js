const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// ያንተ ኦፊሴላዊ የቦት ቶከን እና የጨዋታ ሊንክ
const TOKEN = '8994032862:AAHM-hoRiyR6QR9UrnJ4YZjLi7YT27D94y8';
const bot = new TelegramBot(TOKEN, { polling: true });
const WEB_APP_URL = 'https://vercel.app';

// 1. ተጠቃሚው /start ሲጫን
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎰 ወደ ላዝ ቢንጎ እንኳን በደህና መጡ!\n\n👇 ጨዋታውን ለመጀመር መጀመሪያ በሜኑው ላይ ያለውን <b>/register</b> የሚለውን ትዕዛዝ ይጫኑ።", { parse_mode: 'HTML' });
});

// 2. ተጠቃሚው /register ሲጫን (የስልክ ቁጥር ማጋሪያ)
bot.onText(/\/register/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📱 እባክዎ አካውንትዎን ለማረጋገጥ ከታች ያለውን ሰማያዊ ቁልፍ ተጭነው ስልክ ቁጥርዎን ያጋሩ።", {
        reply_markup: {
            keyboard: [[{ text: "📱 ስልክ ቁጥር ያጋሩ (Share Contact)", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

// ስልክ ቁጥር ሲላክ መዝግቦ የ/play መመሪያ መስጫ
bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.contact.first_name;
    const phone = msg.contact.phone_number;

    console.log(`ተመዝጋቢ - ስም: ${firstName}, ስልክ: ${phone}`);

    bot.sendMessage(chatId, `🎉 ማረጋገጫው ተጠናቋል ${firstName}! በተሳካ ሁኔታ ተመዝግበዋል።\n\n👇 አሁን ጨዋታውን ለመክፈት በሜኑው ላይ ያለውን <b>/play</b> የሚለውን ትዕዛዝ ይጫኑ።`, {
        parse_mode: 'HTML',
        reply_markup: { remove_keyboard: true }
    });
});

// 3. ተጠቃሚው /play ሲጫን (ጨዋታውን በWeb App መክፈቻ)
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎮 ጨዋታው ዝግጁ ነው! ለመጫወት ከታች ያለውን ቁልፍ ይጫኑ፦", {
        reply_markup: {
            inline_keyboard: [[{ text: "🚀 Play Bingo (ጨዋታውን ጀምር)", web_app: { url: WEB_APP_URL } }]]
        }
    });
});

app.listen(process.env.PORT || 3000, () => console.log("Bot server is running..."));
