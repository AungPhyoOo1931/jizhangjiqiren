require('dotenv').config()
const token = process.env.BOT_TOKEN
const TelegramBot = require('node-telegram-bot-api')
const start = require('./function/start')
const bot = new TelegramBot(token,{polling:true})

bot.onText(/\/start/,(msg) => {
    start(bot,msg)
})