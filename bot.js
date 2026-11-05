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
const { canclein, cancleUSDT, cancleReply } = require('./function/cancle')
const { parseGroupCommand, displayName, replyUser } = require('./module/parse')
const { migrate } = require('./migrate')

function supportAccount() {
    return String(process.env.SUPPORT_USERNAME || 'caishen8867').replace(/^@/, '')
}

function botUsername() {
    return String(process.env.BOT_USERNAME || 'teastreBot').replace(/^@/, '')
}

function register(bot) {
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
        bot.sendMessage(msg.chat.id, `客服飞机号：@${supportAccount()}`)
    })

    bot.onText(/^开始记账\+$/, (msg) => {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '点击开始记账',
                            url: `https://t.me/${botUsername()}?startgroup=true`
                        }
                    ]
                ]
            }
        };
        bot.sendMessage(msg.chat.id, '点击按钮开始记账', options);
    });

    bot.on('message', (msg) => {
        if (!msg.text || !msg.from || msg.from.is_bot) return
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') return

        const cmd = parseGroupCommand(msg.text)
        if (!cmd) return

        const run = cmd.admin === false ? isGroup : isAdmin

        switch (cmd.type) {
            case 'register':
                return run(startbot)(bot, msg)
            case 'classOn':
                return run(lock)(bot, msg, true)
            case 'classOff':
                return run(lock)(bot, msg, false)
            case 'recording':
                return run(stop)(bot, msg, cmd.on)
            case 'rate':
                return run(changEg)(bot, msg, cmd)
            case 'in':
                return run(recordding)(bot, msg, cmd)
            case 'out':
                return run(outusdt)(bot, msg, cmd)
            case 'clear':
                return run(clearAll)(bot, msg)
            case 'voidIn':
                return run(canclein)(bot, msg)
            case 'voidOut':
                return run(cancleUSDT)(bot, msg)
            case 'void':
                return run(cancleReply)(bot, msg)
            case 'bill': {
                const target = replyUser(msg)
                if (target.userid || target.name) {
                    return isAdmin(showMe)(bot, msg, target)
                }
                return isGroup(showMe)(bot, msg, {
                    name: displayName(msg.from),
                    userid: msg.from.id,
                })
            }
            default:
                return
        }
    })
}

async function main() {
    if (!token) {
        throw new Error('缺少 BOT_TOKEN')
    }
    await migrate()
    const bot = new TelegramBot(token, { polling: true })
    register(bot)
    console.log('bot started')
}

main().catch((err) => {
    console.error('启动失败', err)
    process.exit(1)
})
