const { Telegraf } = require('telegraf');
const http = require('http');
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN);

// 1. إنشاء سيرفر وهمي لإبقاء البوت حياً على Render
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Fenntale Store is Online");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);

// 2. نظام الإنعاش الذاتي لمنع النوم (Keep-Alive)
setInterval(() => {
    if (process.env.RENDER_EXTERNAL_HOSTNAME) {
        const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}.onrender.com`;
        axios.get(url)
            .then(() => console.log("Self-ping successful"))
            .catch(err => console.error("Ping failed"));
    }
}, 600000); // تنبيه كل 10 دقائق

// 3. رسالة الترحيب الإنجليزية
bot.start((ctx) => {
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

// 4. إرسال الكتاب المجاني تلقائياً
bot.action('send_free', (ctx) => {
    ctx.reply('Preparing your free gift... 🎁');
    ctx.replyWithDocument({ source: 'book1.pdf' }).catch((err) => {
        ctx.reply('Error: File currently unavailable. Please contact support.');
    });
});

// 5. عرض بيانات الدفع للكتاب الثاني
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
