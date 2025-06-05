/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { DatabaseTransaction } = require("../module/mysql")
const { sendMessage } = require("../module/send")
const { ysmc } = require("../module/time")

async function info(bot,msg){
    try{
        const chatId = msg.chat.id
        const userId = msg.from.id
        const nickName = (msg.from.first_name || "") + (msg.from.last_name || "")
        const username = msg.from.username || ""
        const db = new DatabaseTransaction()
        const sql = 'SELECT * FROM users WHERE id = ?'
        const result = await db.executeQuery(sql,[userId],false)
        if(result.length === 0){
            sendMessage(bot,'当前账户未注册成功请发送/start指',chatId)
            return
        }
        const text = `
<b>【个人信息】</b>
用户名称：【${nickName}】
注册时间：【${ysmc(result[0].start)}】
到期时间：【${ysmc(result[0].end)}】
试用状态：【${result[0].istry ? "不可试用" : "可试用"}】
当前状态：<b>【${result[0].active ? "激活" : "过期"}】</b>
        `
        sendMessage(bot,text,chatId)
    }catch(err){
        console.log('出错了:',err);
        sendMessage(bot,'出现未知错误，请稍后重试',chatId)
        return
    }

}

module.exports = info