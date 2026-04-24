const { Telegraf } = require('telegraf');
const http = require('http');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
const MY_ID = "7013389864";

// 1. نظام الحماية من النوم
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Fenntale Engine: Online");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);

setInterval(() => {
    const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}.onrender.com`;
    axios.get(url).catch(() => {});
}, 120000); 

bot.start((ctx) => {
    const user = ctx.from;
    bot.telegram.sendMessage(MY_ID, `🔔 New Visitor: ${user.first_name}`).catch(() => {});

    // --- جملتك المفضلة في الترحيب ---
    const welcomeMsg = `🌟 **Welcome to Fenntale** 🌟
"Fenntale: Your sanctuary of coffee, melodies, and great reads."

Explore our collection of digital books designed to inspire your journey.

👇 **Please choose an option:**`;

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

    // --- نظام التذكير التلقائي (Scheduled Reminders) ---
    
    // التذكير الأول: بعد ساعة واحدة
    setTimeout(() => {
        ctx.reply("📖 **Quick Check-in:**\nYou've taken the first step to kill the inner critic. How does it feel to breathe in a cleaner internal OS? Remember, the tools to build your *External Reality* are waiting in Book 2.").catch(() => {});
    }, 3600000); 

    // التذكير الثاني: بعد 3 ساعات
    setTimeout(() => {
        ctx.reply("⚡️ **Identity is fixed. Now, Reality.**\nDon't let the momentum slide. The Blueprint for your new life (Relationships, Income, Discipline) is only one click away.\n\n[Grab Book 2 Now — $12.79]").catch(() => {});
    }, 10800000);
});

bot.action('send_free', async (ctx) => {
    try {
        await ctx.reply('Unlocking your internal freedom... 🎁');
        await ctx.replyWithDocument({ source: 'book1.pdf' });

        // الرسالة القوية التي طلبتها
        setTimeout(() => {
            const promoMsg = `
Congratulations.
You’ve just killed the inner critic. You’ve decoded your behavior. For the first time, the "weight" is gone and your internal OS is clean.

But here is the cold truth:
A powerful engine is useless if the car has no wheels.

**Book 1 gave you Internal Freedom (The Mind).**
**Book 2 gives you External Dominance (The Life).**

You’ve fixed your identity—now it’s time to fix your reality. Income, Relationships, and Discipline systems don't work if your mind is broken. But now that you are "Unbeatable" inside...

It's time to become "Unbeatable" outside.

The Blueprint for your new life is ready.

[Grab Book 2: Build Your External Life — $12.79]

Don't stop at feeling better. Start living better.
            `;
            ctx.reply(promoMsg, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🚀 Grab Book 2 Now — $12.79", callback_data: "buy_premium" }]
                    ]
                }
            });
        }, 3000);

    } catch (err) {
        ctx.reply('Error: File unavailable. Contact @Mohamedlebah');
    }
});

bot.action('buy_premium', (ctx) => {
    const paymentMsg = `💳 **Payment Details**\n\nTo purchase **Book Two**, transfer **$12.79** to:\n\n🏦 **Grey (IBAN):**\n\`GB64CLJU04130741739018\`\n\n⚠️ Send screenshot to @Mohamedlebah.`;
    ctx.reply(paymentMsg, { parse_mode: 'Markdown' });
});

bot.launch();
