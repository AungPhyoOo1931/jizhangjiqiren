const { DatabaseTransaction } = require("../module/mysql")
const { normalSend, replySend } = require("../module/send")

async function lock(bot,msg,status){
    const messageId = msg.message_id
    const chatId = msg.chat.id
    try{
        const db = new DatabaseTransaction()
        await db.executeQuery('UPDATE groupList SET start = ? WHERE id = ?',[status,chatId],false)
        await bot.setChatPermissions(chatId,{
            can_send_messages: status,
            can_send_media_messages: status,
            can_send_polls: status,
            can_send_other_messages: status,
            can_add_web_page_previews: status,
            can_change_info: status,
            can_invite_users: status,
            can_pin_messages: status
        })
        if(status){
            normalSend(bot,'禁言已关闭',chatId)
        }else{
            await db.executeQuery('UPDATE recording SET isrecordding = 0 WHERE isrecordding = 1 AND groupid = ?',[chatId],false)
            normalSend(bot,'禁言已开启',chatId)
        }
    }catch(err){
        if (err.response && err.response.body && err.response.body.description === 'Bad Request: CHAT_NOT_MODIFIED') {
            return 
          } else {
            return replySend(bot,'出现未知错误，请检查机器人是否已是管理员并拥有管理权限',chatId,messageId) 
          }       
    }
}

module.exports = lock