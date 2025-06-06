/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { DatabaseTransaction } = require("../module/mysql");
const { sendMessage, normalSend } = require("../module/send");
const {showAll} = require("../module/show");

async function recordding(bot,msg,match){
    const groups = match.groups;
    const chatId = msg.chat.id
    const messageId = msg.message_id
    let name = groups.text || null;
    const amount = groups.num1;
    let exchange = groups.num2 || null;
    const username = msg.reply_to_message?.from?.username || null
    const AdminId = msg.from.id
    const tempname = ((msg.reply_to_message?.from?.first_name || '') + (msg.reply_to_message?.from?.last_name || '')) || null
    try{
        const db = new DatabaseTransaction()
        const tempexchange = await db.executeQuery('SELECT echange,active,start FROM groupList WHERE id = ?',[chatId],false)
        if(tempexchange.length === 0){
            normalSend(bot,'当前群组未注册，请机器人拥有者发送‘开始’来注册并使用',chatId)
            return 
        }
        if(tempexchange[0].start === 0){
            normalSend(bot,'机器人暂停记账中，请先发送“继续”',chatId)
            return
        }
        
        if(tempexchange[0].active !== 1){
            normalSend(bot,'机器人已过期，请续费',chatId)
            return
        }
    
        if(tempname){
            name = tempname
        }
        if(!exchange){
            exchange = tempexchange[0].echange
        }
    
        if(!name){         
            return
        }
        const recordSql = 'INSERT INTO recording (name,username,groupid,adminid,amount,exchange,usdt,messageid) VALUE (?,?,?,?,?,?,?,?)'
        await db.executeQuery(recordSql,[name,username,chatId,AdminId,amount,exchange,(amount / exchange),messageId],false)
        console.log('成功');
        showAll(bot,msg)
    }catch(err){
        console.log(err);
        return
    }

}

module.exports = recordding