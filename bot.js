require('dotenv').config()
const token = process.env.BOT_TOKEN
const TelegramBot = require('node-telegram-bot-api')
const start = require('./function/start')
const tryOut = require('./function/tryOut')
const info = require('./function/info')
const datail = require('./function/detail')
const {isPrivate,isGroup,isAdmin} = require('./module/checkers')
const startbot = require('./function/startbot')
const lock = require('./function/lock')
const bot = new TelegramBot(token,{polling:true})

bot.onText(/^\/start$/,(msg) => {
    isPrivate(start)(bot, msg);
})

bot.onText(/^申请试用$/,(msg) => {
    isPrivate(tryOut)(bot,msg)
})

bot.onText(/^个人信息$/,(msg) => {
    isPrivate(info)(bot,msg)
})

bot.onText(/^详细说明$/,(msg) => {
    isPrivate(datail)(bot,msg)
})

bot.onText(/^开始记账\+$/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '点击开始记账',
                        url: 'https://t.me/teastreBot?startgroup=true'
                    }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, '点击按钮开始记账', options);
});

bot.onText(/^开始$/,(msg) => {
    isGroup(startbot)(bot,msg)
})

bot.onText(/^上课$/,(msg) => {
    isAdmin(lock)(bot,msg,true)
})

bot.onText(/^下课$/,(msg) => {
    isAdmin(lock)(bot,msg,false)
})



