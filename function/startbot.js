const { DatabaseTransaction } = require("../module/mysql")
const { replySend, sendMessage, normalSend } = require("../module/send")

async function startbot(bot,msg){
    const chatId = msg.chat.id
    const messageId = msg.message_id
    try{
        console.log(msg);
        
        const userId = msg.from.id
        const username = msg.chat.username || null
        const nickname = msg.chat.title || null
        const db = new DatabaseTransaction()
        const checkSql = 'SELECT active,id FROM users WHERE id = ?'
        const check = await db.executeQuery(checkSql,[userId],false)
        if(check.length === 0){
            replySend(bot,'当前账户未注册，此命令只有机器人拥有者可使用',chatId,messageId)
            return
        }
        
        const active = check[0].active
        const checkGroupSql = 'SELECT id FROM groupList WHERE id = ?'
        const checkGroup = await db.executeQuery(checkGroupSql,[chatId],false)
        
        if(checkGroup.length === 0){
            const insertGroupSql = 'INSERT INTO groupList (id,userid,username,nickname,active) VALUE (?,?,?,?,?)'
            const insertGroup = await db.executeQuery(insertGroupSql,[chatId,userId,username,nickname,active],false)
            normalSend(bot,'机器人开始记录此群',chatId)
            return
        }        
        normalSend(bot,'机器人已经记录此群',chatId)
        
    }catch(err){
        console.log(err);
        replySend(bot,'出现未知错误，请联系管理员！！！',chatId,messageId)
        return
    }
}

module.exports = startbot