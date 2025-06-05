const { DatabaseTransaction } = require("../module/mysql")
const { normalSend } = require("../module/send")

async function start(bot,msg,status){
    const chatId = msg.chat.id
    try{
        const db = new DatabaseTransaction()
        await db.executeQuery('UPDATE groupList SET start = ? WHERE id = ?',[status,chatId],false)   
        if(status){
            normalSend(bot,'机器人继续记账，如需暂停请发送“暂停”',chatId)
        }else{
            normalSend(bot,'机器人暂停记账，如需继续请发送“继续”')
        }
    }catch(err){
         console.log(err);
         return
    }
}

module.exports = start