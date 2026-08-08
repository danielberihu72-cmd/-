const TelegramBot = require("node-telegram-bot-api");

// ===============================
// BOT TOKEN
// ===============================

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ BOT_TOKEN is missing!");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, {
  polling: true
});


// ===============================
// START
// ===============================

bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(
      chatId,
      `🎉 ወደ ዳን ላዝ ቢንጎ በደህና መጡ!

📝 ለመመዝገብ ከታች ያለውን Register ይጫኑ።`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📝 Register",
                callback_data: "register"
              }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error("❌ Start error:", error);
  }
});


// ===============================
// REGISTER BUTTON
// ===============================

bot.on("callback_query", async (query) => {
  if (query.data !== "register") {
    return;
  }

  const chatId = query.message.chat.id;

  try {
    await bot.answerCallbackQuery(query.id);

    await bot.sendMessage(
      chatId,
      `📱 ለመመዝገብ እባክዎ የራስዎን Contact ያጋሩ።

👇 Share Contact የሚለውን ይጫኑ።`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "📱 Share Contact",
                request_contact: true
              }
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      }
    );
  } catch (error) {
    console.error("❌ Register error:", error);
  }
});


// ===============================
// CONTACT SHARED
// ===============================

bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  const firstName =
    msg.contact.first_name ||
    msg.from.first_name ||
    "Player";

  const phone = msg.contact.phone_number;

  try {

    // Make sure the user shared their own contact
    if (
      msg.contact.user_id &&
      msg.contact.user_id !== telegramId
    ) {
      await bot.sendMessage(
        chatId,
        "❌ እባክዎ የራስዎን Contact ብቻ ያጋሩ።"
      );

      return;
    }


    // ===============================
    // AUTOMATIC REGISTRATION
    // ===============================

    console.log("=================================");
    console.log("✅ NEW REGISTRATION");
    console.log("Telegram ID:", telegramId);
    console.log("Name:", firstName);
    console.log("Phone:", phone);
    console.log("=================================");


    // Remove Share Contact keyboard
    await bot.sendMessage(
      chatId,
      `✅ በትክክል ተመዝግበዋል!

👤 ስም: ${firstName}
📱 ስልክ: ${phone}`,
      {
        reply_markup: {
          remove_keyboard: true
        }
      }
    );

  } catch (error) {
    console.error("❌ Contact error:", error);

    await bot.sendMessage(
      chatId,
      "❌ ምዝገባው አልተሳካም። እባክዎ እንደገና ይሞክሩ።"
    );
  }
});


// ===============================
// POLLING ERROR
// ===============================

bot.on("polling_error", (error) => {
  console.error("❌ Polling error:", error.message);
});


// ===============================
// BOT STARTED
// ===============================

console.log("=================================");
console.log("🤖 DAN LAZ BINGO BOT");
console.log("✅ Bot is running...");
console.log("=================================");
