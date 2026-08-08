const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();

// 1. የቴሌግራም ቦት ቅንብር
const TOKEN = '8989868624:AAGTuazoUV7NvEFcMhpIxIqz-TJBb41WJcg';
const bot = new TelegramBot(TOKEN, { polling: true });
const WEB_APP_URL = 'https://vercel.app';

// 2. የSupabase ግንኙነት ማዋቀር
const SUPABASE_URL = 'እዚህ ጋ የባለፈውን የSupabase URL ያስገቡ';
const SUPABASE_ANON_KEY = 'sb_publishable_YZHcP8wEIx1KCv1-afd3jA_yKadAGEh';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. /start ትዕዛዝ
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🎰 ወደ ላኪ ቢንጎ እንኳን በደህና መጡ! 👋\n\n👇 ጨዋታውን ለመጀመር መጀመሪያ በቦቱ ላይ ይገንቡ ወይም /register የሚለውን ትዕዛዝ ይጫኑ።");
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

// 5. ስልክ ቁጥር ሲላክ (Contact Sharing) - የተስተካከለው ክፍል
bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.contact.first_name || msg.from.first_name;
  const phone = msg.contact.phone_number;
  const telegramId = msg.from.id;

  try {
    // እዚህ ጋ 'users' በሚለው ትክክለኛ የሰንጠረዥ ስም ተተክቷል
    const { error } = await supabase
      .from('users') 
      .insert([{ telegram_id: telegramId, first_name: firstName, phone: phone }]);

    if (error) throw error;

    bot.sendMessage(chatId, `✅ ማረጋገጫው ተጠናቋል ${firstName}! መረጃዎ በSupabase ተመዝግቧል።`, {
      parse_mode: 'HTML',
      reply_markup: { remove_keyboard: true }
    });

  } catch (err) {
    console.error("የዳታቤዝ ስህተት:", err.message || err);
    bot.sendMessage(chatId, `❌ ስህተት አጋጥሟል፦\n${err.message || err}`, {
      parse_mode: 'HTML'
    });
  }
});

// 6. ለኤክስፕረስ ሰርቨር (አማራጭ ፖርት)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ሰርቨሩ በፖርት ${PORT} ላይ እየሰራ ነው`);
});
