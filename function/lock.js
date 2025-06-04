const { normalSend, replySend } = require("../module/send")

async function lock(bot,msg,status){
    const messageId = msg.message_id
    const chatId = msg.chat.id
    try{
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
            normalSend(bot,'禁言已开启',chatId)
        }
    }catch(err){
        if (err.response && err.response.body && err.response.body.description === 'Bad Request: CHAT_NOT_MODIFIED') {
            return replySend(bot,'无法重复执行相同命令，如果此时已经上课，请执行下课',chatId,messageId) 
          } else {
            return replySend(bot,'出现未知错误，请检查机器人是否已是管理员并拥有管理权限',chatId,messageId) 
          }       
    }
}

module.exports = lock