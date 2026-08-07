const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();

// 1. የቴሌግራም ቦት ቶከን
const TOKEN = '8989868624:AAGTuazoUV7NvEFcMhpIxIqz-TJBb41WJcg';
const bot = new TelegramBot(TOKEN, { polling: true });
const WEB_APP_URL = 'https://vercel.app';

// 2. የSupabase ግንኙነት ማዋቀሪያ
const SUPABASE_URL = 'https://supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_YZHcP8wEIx1KCv1-afd3jA_yKadAGEh';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. /start ትዕዛዝ
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎰 ወደ ላዝ ቢንጎ እንኳን በደህና መጡ!\n\n👇 ጨዋታውን ለመጀመር መጀመሪያ በሜኑው ላይ ያለውን <b>/register</b> የሚለውን ትዕዛዝ ይጫኑ።", { parse_mode: 'HTML' });
});

// 4. /register ትዕዛዝ
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

// 5. ስልክ ሲላክ አውቶማቲክ ዴታቤዝ (Supabase) ላይ መመዝገቢያ
bot.on('contact', async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.contact.first_name;
    const phone = msg.contact.phone_number;
    const telegramId = msg.from.id;

    try {
        const { error } = await supabase
            .from('Users')
            .insert([{ telegram_id: telegramId, first_name: firstName, phone_number: phone }]);

        if (error) throw error;

        bot.sendMessage(chatId, `🎉 ማረጋገጫው ተጠናቋል ${firstName}! መረጃዎ በዴታቤዝ ላይ በተሳካ ሁኔታ ተመዝግቧል።\n\n👇 አሁን ጨዋታውን ለመክፈት በሜኑው ላይ ያለውን <b>/play</b> የሚለውን ትዕዛዝ ይጫኑ።`, {
            parse_mode: 'HTML',
            reply_markup: { remove_keyboard: true }
        });

    } catch (err) {
        console.error("የዴታቤዝ ስህተት:", err.message);
        bot.sendMessage(chatId, `❌ የዴታቤዝ ስህተት አጋጥሟል፦\n<code>${err.message || JSON.stringify(err)}</code>`, { parse_mode: 'HTML' });
    }
});

// 6. /play ትዕዛዝ
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎮 ጨዋታው ዝግጁ ነው! ለመጫወት ከታች ያለውን ቁልፍ ይጫኑ፦", {
        reply_markup: {
            inline_keyboard: [[{ text: "🚀 Play Bingo (ጨዋታውን ጀምር)", web_app: { url: WEB_APP_URL } }]]
        }
    });
});

// 7. /deposit ትዕዛዝ
bot.onText(/\/deposit/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    bot.sendMessage(chatId, `💰 <b>የዴፖዚት ማረጋገጫ (Demo)</b>\n\nእንኳን ደስ አለዎት <b>${firstName}</b>! የ <b>500 ETB</b> ክፍያዎ በተሳካ ሁኔታ ተጠናቋል። አሁን ወደ ጨዋታው ሜዳ በመመለስ መጫወት ይችላሉ።`, { parse_mode: 'HTML' });
});

app.listen(process.env.PORT || 3000, () => console.log("Bot server is running with Supabase..."));
