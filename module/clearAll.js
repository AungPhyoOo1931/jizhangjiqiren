/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */
const { DatabaseTransaction } = require("./mysql")
const { getRegisteredGroup } = require("./group")
const { normalSend } = require("./send")
const { showAll } = require("./show")

async function clearAll(bot,msg){
    const chatId = msg.chat.id
    const db = new DatabaseTransaction()
    try{
        const registered = await getRegisteredGroup(bot, chatId)
        if (!registered) return
        const shiftId = registered.group.shift_id
        const where = shiftId ? 'groupid = ? AND shift_id = ? AND isrecordding = 1' : 'groupid = ? AND isrecordding = 1'
        const params = shiftId ? [chatId, shiftId] : [chatId]
        await db.beginTransaction()
        await db.executeQuery(`UPDATE outusdt SET isrecordding = 0 WHERE ${where}`, params, true)
        await db.executeQuery(`UPDATE recording SET isrecordding = 0 WHERE ${where}`, params, true)
        await db.commitTransaction()
        normalSend(bot,'本班账单已重置',chatId)
        await showAll(bot, msg, registered)
    }catch(err){
        console.log(err);
        await db.rollbackTransaction()
        normalSend(bot,'清除账单失败，请稍后重试',chatId)
        return
    }
}

module.exports = clearAll
