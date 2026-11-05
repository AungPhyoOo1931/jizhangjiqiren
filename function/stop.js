/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { getRegisteredGroup } = require("../module/group")
const { normalSend } = require("../module/send")

async function start(bot,msg,status){
    const chatId = msg.chat.id 
    try{
        const registered = await getRegisteredGroup(bot, chatId)
        if (!registered) return
        const { db } = registered
        await db.executeQuery('UPDATE groupList SET start = ? WHERE id = ?',[status,chatId],false)   
        if(status){
            normalSend(bot,'机器人继续记账，如需暂停请发送「暂停」',chatId)
        }else{
            normalSend(bot,'机器人暂停记账，如需继续请发送「继续」',chatId)
        }
    }catch(err){
         console.log(err);
         normalSend(bot,'操作失败，请稍后重试',chatId)
         return
    }
}

module.exports = start
