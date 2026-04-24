const { Telegraf } = require('telegraf');
const http = require('http');
const axios = require('axios');

// تأكد أن الكلمة الأولى هي const وليست Const (حساسة لحالة الأحرف)
const bot = new Telegraf(process.env.BOT_TOKEN);
const MY_ID = "7013389864";

// 1. تحسين السيرفر ليرد على Cron-job بشكل أسرع
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Fenntale Status: Active and Online");
    console.log("Ping received: Keeping the bot awake!"); // ستظهر في الـ Logs لتتأكد
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// 2. نظام الإيقاظ الذاتي (المحسن)
setInterval(() => {
    // نستخدم الرابط المباشر الخاص بك لضمان الدقة
    const appUrl = `https://fenntal.onrender.com`; // استبدل 'fenntal' باسم مشروعك الحقيقي على Render إذا كان مختلفاً
    axios.get(appUrl)
        .then(() => console.log("Self-ping successful"))
        .catch((err) => console.log("Self-ping failed, but server is still up"));
}, 180000); // كل 3 دقائق بدلاً من 10 لضمان عدم النوم

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
    }).catch(e => console.log(e));

    // نظام المتابعة (تم تحسينه ليعمل بشكل مستقل)
    setupFollowUp(ctx);
});

// وظيفة منفصلة للمتابعة لضمان عدم تداخل الكود
function setupFollowUp(ctx) {
    setTimeout(() => {
        ctx.reply("☕️ **How is the reading going?**\nEvery great story deserves a perfect atmosphere. Have you prepared your coffee yet?").catch(() => {});
    }, 3600000);

    setTimeout(() => {
        ctx.reply("🔍 **Did you know?**\nThe mystery deepens in **Book Two**. Check it out now!").catch(() => {});
    }, 7200000);
}

bot.action('send_free', (ctx) => {
    ctx.reply('Preparing your free gift... 🎁');
    ctx.replyWithDocument({ source: 'book1.pdf' }).catch((err) => {
        console.log(err);
        ctx.reply('Error: File unavailable. Contact @Mohamedlebah.');
    });
});

bot.action('buy_premium', (ctx) => {
    const paymentMsg = `💳 **Payment Details**\n\nTo purchase **Book Two**, transfer **$12.79** to:\n\n🏦 **Grey (IBAN):**\n\`GB64CLJU04130741739018\`\n\n⚠️ Send screenshot to @Mohamedlebah.`;
    ctx.reply(paymentMsg, { parse_mode: 'Markdown' });
});

bot.launch().then(() => console.log("Bot is running..."));

// معالجة الأخطاء لعدم توقف البوت
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
