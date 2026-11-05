/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { getRegisteredGroup } = require("../module/group")
const { normalSend } = require("../module/send")

async function exchange(bot,msg,cmd){
    const chatId = msg.chat.id
    const exchangeRate = Number(cmd && (cmd.value != null ? cmd.value : cmd[1]))
    if(isNaN(exchangeRate) || exchangeRate <= 0){ 
        normalSend(bot,'请输入正确的汇率如：7.20',chatId)
        return
    }
    try{
        const registered = await getRegisteredGroup(bot, chatId)
        if (!registered) return
        const { db } = registered
        await db.executeQuery('UPDATE groupList SET echange = ? WHERE id = ?',[exchangeRate,chatId],false)
        normalSend(bot,`汇率设置成功！当前汇率<b>【${exchangeRate}】</b>`,chatId)
    }catch(err){
        console.log(err);
        normalSend(bot,'出现未知错误，请重试',chatId)
        return
    }
}
module.exports = exchange
