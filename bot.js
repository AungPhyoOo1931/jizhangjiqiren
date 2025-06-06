/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

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
const changEg = require('./function/changeEg')
const recordding = require('./function/recordding')
const stop = require('./function/stop')
const outusdt = require('./function/outusdt')
const clearAll = require('./module/clearAll')
const { showMe } = require('./module/show')
const { canclein, cancleUSDT } = require('./function/cancle')
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

bot.onText(/^联系客服$/,(msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId,'客服飞机号：@caishen8867')
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

const pattern = /^(?:(?<text>[^\d+\/\s]+)\+|\+)?(?<num1>\d+(?:\.\d+)?)(?:\/(?<num2>\d+(?:\.\d+)?))?$/;
bot.onText(pattern, (msg, match) => {
    isAdmin(recordding) (bot,msg,match)
});

bot.onText(/^暂停$/,(msg) => {
    isAdmin(stop)(bot,msg,false)
})

bot.onText(/^继续$/,(msg) => {
    isAdmin(stop)(bot,msg,true)
})

bot.onText(/^设置汇率\+?([\d.]+)$/,(msg,match) => {
    isAdmin(changEg)(bot,msg,match)
})

bot.onText(/^下发\+?([\d.]+)$/,(msg,match) => {
    isAdmin(outusdt)(bot,msg,match)
})

bot.onText(/^清除账单$/,(msg) => {
    isAdmin(clearAll)(bot,msg)
})

bot.onText(/^账单$/,(msg) => {
    const tempname = ((msg.reply_to_message?.from?.first_name || '') + (msg.reply_to_message?.from?.last_name || '')) || null
    if(tempname){
        isAdmin(showMe)(bot,msg,tempname)
    } else{
        const name = (msg.from.first_name || '') + (msg.from.last_name || '')
        isGroup(showMe)(bot,msg,name)
    }
})

bot.onText(/^撤销入款$/,(msg) => {
    isAdmin(canclein)(bot,msg)
})

bot.onText(/^撤销下发$/,(msg) => {
    isAdmin(cancleUSDT)(bot,msg)
})