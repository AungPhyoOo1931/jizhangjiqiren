/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { DatabaseTransaction } = require("../module/mysql")
const { sendMessage, normalSend } = require("../module/send")

async function exchange(bot,msg,match){
    const chatId = msg.chat.id
    const temp = match[1]
    const exchange = parseFloat(temp)
    if(isNaN(exchange)){ 
        normalSend(bot,'请输入正确的汇率如：7.20',chatId)
        return
    }
    try{
        const db = new DatabaseTransaction()
        await db.executeQuery('UPDATE groupList SET echange = ? WHERE id = ?',[exchange,chatId],false)
        normalSend(bot,`汇率设置成功！当前汇率<b>【${exchange}】</b>`,chatId)
    }catch(err){
        console.log(err);
        normalSend(bot,'出现未知错误，请重试',chatId)
        return
    }
}
module.exports = exchange