const { Telegraf } = require('telegraf');
const http = require('http');
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN);

const MY_ID = "7013389864";

// إنشاء سيرفر بسيط لـ Render
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Fenntale Store is Online");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);

// نظام الإيقاظ الذاتي
setInterval(() => {
    if (process.env.RENDER_EXTERNAL_HOSTNAME) {
        const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}.onrender.com`;
        axios.get(url).catch(() => {});
    }
}, 600000);

bot.start((ctx) => {
    const user = ctx.from;
    const alertMsg = `🔔 **New Visitor!**\n👤 Name: ${user.first_name}\n🆔 ID: ${user.id}\n🔗 @${user.username || 'None'}`;
    bot.telegram.sendMessage(MY_ID, alertMsg).catch(() => {});

    const welcomeMsg = `🌟 **Welcome to Fenntale** 🌟\n"Your sanctuary of coffee, melodies, and great reads."\n\n👇 **Choose an option:**`;

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

    // --- نظام المتابعة الآلي (كل ساعة رسالة) ---

    // رسالة بعد ساعة واحدة (3600000 ميلي ثانية)
    setTimeout(() => {
        ctx.reply("☕️ **How is the reading going?**\nEvery great story deserves a perfect atmosphere. Have you prepared your coffee yet?").catch(() => {});
    }, 3600000);

    // رسالة بعد ساعتين
    setTimeout(() => {
        ctx.reply("🔍 **Did you know?**\nThe mystery deepens in **Book Two**. A secret is hidden in the first chapter that changes everything... Check it out now!").catch(() => {});
    }, 7200000);

    // رسالة بعد ثلاث ساعات
    setTimeout(() => {
        ctx.reply("🎁 **Special Offer!**\nGet the Premium Edition now and receive a personalized digital bookmark with your name. Contact @Mohamedlebah for details.").catch(() => {});
    }, 10800000);
});

bot.action('send_free', (ctx) => {
    ctx.reply('Preparing your free gift... 🎁');
    ctx.replyWithDocument({ source: 'book1.pdf' }).catch(() => {
        ctx.reply('Error: File unavailable. Contact @Mohamedlebah.');
    });
});

bot.action('buy_premium', (ctx) => {
    const paymentMsg = `💳 **Payment Details**\n\nTo purchase **Book Two**, transfer **$12.79** to:\n\n🏦 **Grey (IBAN):**\n\`GB64CLJU04130741739018\`\n\n⚠️ Send screenshot to @Mohamedlebah.`;
    ctx.reply(paymentMsg, { parse_mode: 'Markdown' });
});

bot.launch();
