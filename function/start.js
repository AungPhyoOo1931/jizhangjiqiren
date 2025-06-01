const {DatabaseTransaction} = require('../module/mysql')
async function start(bot,msg){
    const chatId = msg.chat.id
    bot.sendMessage(chatId,'Hello World')
}

module.exports = start
