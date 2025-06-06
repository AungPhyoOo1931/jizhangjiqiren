/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */
const { DatabaseTransaction } = require("./mysql")
const { normalSend } = require("./send")

async function clearAll(bot,msg){
    const chatId = msg.chat.id
    try{
        const db = new DatabaseTransaction()
        const usdtSql = 'UPDATE outusdt SET isrecordding = 0 WHERE groupid = ? AND isrecordding = 1'
        await db.beginTransaction()
        await db.executeQuery(usdtSql,[chatId],true)
        const inSql = 'UPDATE recording SET isrecordding = 0 WHERE groupid = ? AND isrecordding = 1 '
        await db.executeQuery(inSql,[chatId],true)
        await db.commitTransaction()
        normalSend(bot,'账单记录已重置',chatId)
    }catch(err){
        console.log(err);
        await db.rollbackTransaction()
        return
    }
}

module.exports = clearAll