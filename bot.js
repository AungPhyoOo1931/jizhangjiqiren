require('dotenv').config()
const token = process.env.BOT_TOKEN
const TelegramBot = require('node-telegram-bot-api')
const start = require('./function/start')
const tryOut = require('./function/tryOut')
const info = require('./function/info')
const {isPrivate,isGroup,isAdmin} = require('./module/checkers')
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