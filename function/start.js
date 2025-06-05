/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const {DatabaseTransaction} = require('../module/mysql')
const {sendMessage} = require('../module/send')
async function start(bot,msg){
    console.log(msg);
    const chatId = msg.chat.id
    const userId = msg.from.id
    const nickName = (msg.from.first_name || "") + (msg.from.last_name || "")
    const username = msg.from.username || ""
    const db = new DatabaseTransaction()//开启数据库连接实例
    try{
        const result = await db.executeQuery('SELECT * FROM users WHERE id = ?',[userId],false)
        if(result.length !== 0){
            sendMessage(bot,'欢迎回来',chatId)
            return
        }
        const time = new Date()
        const insertUser = await db.executeQuery('INSERT INTO users (id,username,nickname,end) VALUE (?,?,?,?)',[userId,username,nickName,time],false)
        sendMessage(bot,'欢迎使用XX机器人',chatId)
    }catch(err){
        // sendMessage(bot,'出现未知错误,删除后重试',chatId)
        console.log(err);
        return
    }
}


module.exports = start
 