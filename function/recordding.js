const { DatabaseTransaction } = require("../module/mysql");
const { sendMessage } = require("../module/send");

async function recordding(bot,msg,match){
    const groups = match.groups;
    const chatId = msg.chat.id
    let name = groups.text || null;
    const amount = groups.num1;
    let exchange = groups.num2 || null;
    const username = msg.reply_to_message?.from?.username || null
    const AdminId = msg.from.id
    const tempname = ((msg.reply_to_message?.from?.first_name || '') + (msg.reply_to_message?.from?.last_name || '')) || null
    const db = new DatabaseTransaction()
    const tempexchange = await db.executeQuery('SELECT echange,active FROM groupList WHERE id = ?',[chatId])
    if(tempexchange.length === 0){
        sendMessage(bot,'当前群组未注册，请机器人拥有者发送‘开始’来注册并使用',chatId)
        return
    }
    if(tempexchange[0].active !== 1){
        sendMessage(bot,'机器人已过期，请续费',chatId)
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

    const recordSql = 'INSERT INTO recording (name,username,groupid,adminid,amount,exchange,usdt) VALUE (?,?,?,?,?,?,?)'

    await db.executeQuery(recordSql,[name,username,chatId,AdminId,amount,exchange,(amount / exchange)],false)

}

module.exports = recordding