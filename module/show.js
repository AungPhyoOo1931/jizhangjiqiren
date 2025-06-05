/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { DatabaseTransaction } = require("./mysql")
const { normalSend } = require("./send")
const { ms } = require("./time")

async function showAll(bot,msg){
    const chatId = msg.chat.id
    try{
        const db = new DatabaseTransaction()
        const totaSql = `SELECT
  (SELECT COUNT(id) FROM recording WHERE groupid = ? AND isrecordding = 1) AS 'in',
  (SELECT SUM(amount) FROM recording WHERE groupid = ? AND isrecordding = 1) AS 'intotal',
  (SELECT SUM(usdt) FROM recording WHERE groupid = ? AND isrecordding = 1) AS 'inUSDTtotal',
  (SELECT COUNT(id) FROM outusdt WHERE groupid = ? AND isrecordding = 1) AS 'out',
  (SELECT SUM(amount) FROM outusdt WHERE groupid = ? AND isrecordding = 1) AS 'outtotal'
`
        const count = await db.executeQuery(totaSql,[chatId,chatId,chatId,chatId,chatId],false)
        const inCount = count[0].in//今日入款笔数
        const outCount = count[0].out//今日下发总数
        const intotal = count[0].intotal//今日总入款
        const inUSDTtotal = count[0].inUSDTtotal//应下发
        const outtotal = count[0].outtotal//已下发
        const innSQL = 'SELECT name,username,amount,exchange,usdt,join_in,messageid FROM recording WHERE groupid = ? AND isrecordding = 1 ORDER BY id DESC limit 5'
        const inn = await db.executeQuery(innSQL,[chatId],false)
        const outSQL = 'SELECT username,nickname,amount,join_in,messageid FROM outusdt WHERE groupid = ? AND isrecordding = 1 ORDER BY id DESC limit 5'
        const outt = await db.executeQuery(outSQL,[chatId],false)
        const inText = inn.map(item => {
            let groupid = String(chatId).replace('-100','')
            let name = `<b><a href='https://t.me/c/${groupid}/${item.messageid}'>${item.name}</a></b>`
            return `
${name} ${ms(item.join_in)} ${item.amount} / ${item.exchange} = ${item.usdt}U`
        }).join('')
        const outText = outt.map(item => {
            let groupid = String(chatId).replace('-100','')
            let name = `<b><a href='https://t.me/c/${groupid}/${item.messageid}'>${item.nickname}</a></b>`
            return `
${name} ${ms(item.join_in)} ${item.amount} U`
        }).join('')
        const text = `
今日入款（${inCount}）笔
${inText}

今日下发（${outCount}）笔
${outText}
 
总入款：${intotal}
应下发：${inUSDTtotal}
已下发：${outtotal}
未下发：${inUSDTtotal - outtotal}
        `
        
        normalSend(bot,text,chatId)
        
    }catch(err){
        console.log('出错了：',err);
        return
    }
}


module.exports = showAll