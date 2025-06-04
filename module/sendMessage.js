//发送消息函数
function sendMessage(bot,text,chatId){
    const options = {
        reply_markup:{
            keyboard:[
                ['开始记账+','申请试用','个人信息'],
                ['私人订制','联系客服','自助续费']
            ],
            resize_keyboard:true,
            one_time_keyboard:false
        }
    }
    bot.sendMessage(chatId,text,options)
}

module.exports = {sendMessage}