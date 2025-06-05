const { DatabaseTransaction } = require("../module/mysql")
const { replySend } = require("../module/send")
const showAll = require("../module/show")

async function outusdt(bot,msg,match){
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const temp = match[1]
    const amount = parseFloat(temp)
    if(isNaN(amount)){
        normalSend(bot,'请输入正确的下发数量',chatId)
        return
    }
    const name  = ((msg.reply_to_message?.from?.first_name || '') + (msg.reply_to_message?.from?.last_name || '')) || null
    const username = msg.reply_to_message?.from?.username || null
    const adminId = msg.from.id
    if(!name){
        return replySend(bot,'指令错误，请回复下发用户任意一条消息',chatId,messageId)
    }
    try{
        const db = new DatabaseTransaction()
        await db.executeQuery('INSERT INTO outusdt (username,nickname,adminid,groupid,amount,messageid) VALUE (?,?,?,?,?,?)',[username,name,adminId,chatId,amount,messageId],false)
        showAll(bot,msg)
    }catch(err){
        console.log('出现未知错误',err);
        return
    }
    
}
module.exports = outusdt