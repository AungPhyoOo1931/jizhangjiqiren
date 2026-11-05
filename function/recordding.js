/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { getReadyGroup } = require("../module/group");
const { normalSend } = require("../module/send");
const { showAll } = require("../module/show");
const { replyUser } = require("../module/parse");

async function recordding(bot,msg,cmd){
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const reply = replyUser(msg)
    const name = reply.name || (cmd && cmd.name) || null
    const username = reply.username
    const userid = reply.userid
    const amount = Number(cmd && cmd.amount)
    let exchange = cmd && cmd.exchange
    try{
        if(!Number.isFinite(amount) || amount === 0){
            normalSend(bot,'请输入正确的金额',chatId)
            return
        }
        if(!name){
            normalSend(bot,'请回复对方消息，或使用「张三+金额」指定入款人',chatId)
            return
        }
        const ready = await getReadyGroup(bot, chatId)
        if (!ready) return
        const { db, group } = ready
        if(!exchange){
            exchange = group.echange
        }
        if(!exchange || Number(exchange) === 0){
            normalSend(bot,'汇率无效，请先发送「设置汇率7.20」',chatId)
            return
        }
        await db.executeQuery(
            `INSERT INTO recording (name,username,userid,groupid,adminid,amount,exchange,usdt,messageid,shift_id)
             VALUE (?,?,?,?,?,?,?,ROUND(? / ?, 2),?,?)`,
            [name,username,userid,chatId,msg.from.id,amount,exchange,amount,exchange,messageId,group.shift_id],
            false
        )
        await showAll(bot,msg,ready)
    }catch(err){
        console.log(err);
        normalSend(bot,'记账失败，请稍后重试',chatId)
        return
    }
}

module.exports = recordding
