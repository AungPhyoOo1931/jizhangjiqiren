/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const {DatabaseTransaction} = require('../module/mysql')
const {sendMessage} = require('../module/send')
const info = require('./info')
async function tryOut(bot,msg){
    const chatId = msg.chat.id
    const userId = msg.from.id 
    try{
        const db = new DatabaseTransaction()
        const check = 'SELECT istry FROM users WHERE id = ?'
        const checkSql = await db.executeQuery(check,[userId],false)
        if(checkSql.length === 0){
            sendMessage(bot,'当前账户未注册，请先发送 /start',chatId)
            return
        }
        const isTry = checkSql[0].istry
        if(isTry){
            sendMessage(bot,'此账号已经试用过,无法重复试用',chatId)
            return
        }
        const updateStatusSQL = 'UPDATE users SET end = DATE_ADD(NOW(),INTERVAL 24 HOUR), istry = ?,active = ? WHERE id = ?'
        await db.executeQuery(updateStatusSQL,[true,true,userId],false)
        await db.executeQuery('UPDATE groupList SET active = 1 WHERE userid = ?',[userId],false)
        const text = `
【试用成功】
试用成功！！！`
         sendMessage(bot,text,chatId)
         info(bot,msg)
    }catch(err){
        console.log('出错了:',err);
        sendMessage(bot,'出现未知错误，请稍后重试',chatId)
        return
    }
}

module.exports = tryOut
