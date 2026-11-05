/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { getReadyGroup } = require("../module/group")
const { replySend, normalSend } = require("../module/send")
const { showAll } = require("../module/show")
const { replyUser } = require("../module/parse")

async function outusdt(bot,msg,cmd){
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const amount = Number(cmd && cmd.amount)
    if(!Number.isFinite(amount) || amount === 0){
        normalSend(bot,'请输入正确的下发数量',chatId)
        return
    }
    const reply = replyUser(msg)
    const name = reply.name || (cmd && cmd.name) || null
    const username = reply.username
    const userid = reply.userid
    const adminId = msg.from.id
    if(!name){
        return replySend(bot,'请回复对方消息，或使用「张三下发100」',chatId,messageId)
    }
    try{
        const ready = await getReadyGroup(bot, chatId)
        if (!ready) return
        const { db, group } = ready
        await db.executeQuery(
            'INSERT INTO outusdt (username,nickname,userid,adminid,groupid,amount,messageid,shift_id) VALUE (?,?,?,?,?,?,?,?)',
            [username,name,userid,adminId,chatId,amount,messageId,group.shift_id],
            false
        )
        await showAll(bot,msg,ready)
    }catch(err){
        console.log('出现未知错误',err);
        replySend(bot,'下发失败，请稍后重试',chatId,messageId)
        return
    }
}
module.exports = outusdt
