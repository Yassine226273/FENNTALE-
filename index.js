const { Telegraf } = require('telegraf'); // تم تصحيح Const إلى const
const http = require('http');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ضع ID حسابك هنا
const MY_ID = "7013389864";

// =========================
// KEEP RENDER AWAKE
// =========================
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Fenntale Engine Online');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

setInterval(() => {
    if (process.env.RENDER_EXTERNAL_HOSTNAME) {
        axios
            .get(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}.onrender.com`)
            .catch(() => {});
    }
}, 120000);

// =========================
// START
// =========================
bot.start(async (ctx) => {
    try {
        const user = ctx.from;

        const firstName = user.first_name || 'No Name';
        const userId = user.id;
        const username = user.username
            ? `@${user.username}`
            : 'No Username';

        // إشعار لك
        const reportMsg = `
🔔 NEW VISITOR

👤 Name: ${firstName}
🆔 ID: ${userId}
🔗 Username: ${username}
`;

        bot.telegram.sendMessage(MY_ID, reportMsg).catch(() => {});

        const welcomeMsg = `
🔐 HIDDEN VAULT UNLOCKED

You didn't stumble here by accident.

You have just unlocked a hidden vault.

A sanctuary built for those who refuse to let their minds be governed by default settings.

Inside FENNTALE, you are not a consumer.

You are an architect ready to dismantle your old psychological limits and upgrade your Internal OS.

🎁 The treasure chest is open.

Choose your path below.
`;

        await ctx.reply(welcomeMsg, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '📖 Unlock Blueprint One',
                            callback_data: 'send_free'
                        }
                    ], // تم إغلاق الصف الأول هنا بشكل صحيح
                    [
                        { 
                            text: "📞 Contact Support", 
                            url: "https://t.me/Mohamedlebah" 
                        }
                    ] // تم وضع الصف الثاني هنا بشكل صحيح
                ]
            }
        });
    } catch (error) {
        console.error(error);
    }
});

// =========================
// BOOK DOWNLOAD
// =========================
bot.action('send_free', async (ctx) => {
    try {
        const user = ctx.from;

        const firstName = user.first_name || 'No Name';
        const userId = user.id;
        const username = user.username
            ? `@${user.username}`
            : 'No Username';

        // إشعار عند التحميل
        const downloadMsg = `
📖 BLUEPRINT DOWNLOADED

👤 Name: ${firstName}
🆔 ID: ${userId}
🔗 Username: ${username}
`;

        bot.telegram.sendMessage(MY_ID, downloadMsg).catch(() => {});

        await ctx.answerCbQuery();

        await ctx.reply(`
🔓 Vault Opening...

The first blueprint has been released.

Read it carefully.

Most people collect information.

Few people transform because of it.
`);

        await ctx.replyWithDocument({
            source: 'book1.pdf' // تأكد أن ملف الكود والملف book1.pdf في نفس المجلد
        });

    } catch (error) {
        console.error(error);

        await ctx.reply(
            'The blueprint is currently unavailable. Please contact @Mohamedlebah'
        );
    }
});

// =========================
// LAUNCH
// =========================
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
