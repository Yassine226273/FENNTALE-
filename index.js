bot.start((ctx) => {
    const user = ctx.from;
    
    // تجميع بيانات الزائر الجديد
    const firstName = user.first_name || "لا يوجد اسم";
    const userId = user.id;
    const username = user.username ? `@${user.username}` : "@None";

    // صياغة الرسالة التفصيلية التي تصلك أنت
    const reportMsg = `🔔 **New Visitor!**\n👤 Name: ${firstName}\n🆔 ID: ${userId}\n🔗 ${username}`;

    // إرسال التقرير إليك مع تفعيل الماركداون لتنسيق الخط
    bot.telegram.sendMessage(MY_ID, reportMsg, { parse_mode: 'Markdown' }).catch(() => {});

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
