/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

//发送消息函数
function sendMessage(bot,text,chatId){
    const options = {
        parse_mode:'HTML',
        reply_markup:{
            keyboard:[
                ['开始记账+','申请试用','个人信息'],
                ['详细说明','联系客服','自助续费']
            ],
            resize_keyboard:true,
            one_time_keyboard:false
        }
    }
    bot.sendMessage(chatId,text,options)
}

function normalSend(bot,text,chatId){
    const options = {
        parse_mode:'HTML'
    }
    bot.sendMessage(chatId,text,options)
}


function replySend(bot,text,chatId,message_id){
    const options = {
        parse_mode:'HTML',
        reply_to_message_id:message_id
    }
    bot.sendMessage(chatId,text,options)
}



module.exports = {
    sendMessage,
    replySend,
    normalSend
}