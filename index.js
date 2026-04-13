const { Telegraf } = require('telegraf');
const http = require('http');
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN);

// رقم هويتك الذي حصلت عليه لإرسال التنبيهات لك
const MY_ID = "7013389864";

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Fenntale Store is Online");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);

setInterval(() => {
    if (process.env.RENDER_EXTERNAL_HOSTNAME) {
        const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}.onrender.com`;
        axios.get(url).catch(() => {});
    }
}, 600000);

bot.start((ctx) => {
    // إرسال تنبيه لك باسم الشخص الذي دخل المتجر الآن
    const user = ctx.from;
    const alertMsg = `🔔 **New Visitor!**
👤 Name: ${user.first_name} ${user.last_name || ''}
🆔 ID: ${user.id}
🔗 Username: @${user.username || 'No Username'}`;
    
    bot.telegram.sendMessage(MY_ID, alertMsg).catch(() => {});

    // رسالة الترحيب للعميل
    const welcomeMsg = `
🌟 **Welcome to Fenntale** 🌟
"Fenntale: Your sanctuary of coffee, melodies, and great reads."

Explore our collection of digital books designed to inspire your journey.

👇 **Please choose an option:**
    `;

    ctx.reply(welcomeMsg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "📖 Download FREE Book (One)", callback_data: "send_free" }],
                [{ text: "💎 Buy Premium Book (Two)", callback_data: "buy_premium" }],
                [{ text: "📞 Contact Support", url: "https://t.me/Mohamedlebah" }]
            ]
        }
    });
});

bot.action('send_free', (ctx) => {
    ctx.reply('Preparing your free gift... 🎁');
    ctx.replyWithDocument({ source: 'book1.pdf' }).catch(() => {
        ctx.reply('Error: File unavailable. Contact support.');
    });
});

bot.action('buy_premium', (ctx) => {
    const paymentMsg = `
💳 **Payment Details**

To purchase your copy of the **Premium Edition (Book Two)**, please transfer **$12.79** to:

🏦 **Grey Account (IBAN):**
\`GB64CLJU04130741739018\`

⚠️ **Important:**
After payment, please send a **screenshot** of the receipt to @Mohamedlebah.
Your book will be sent to you personally once the payment is verified.
    `;
    ctx.reply(paymentMsg, { parse_mode: 'Markdown' });
});

bot.launch();
