/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */
const { DatabaseTransaction } = require("../module/mysql")
const { showAll } = require("../module/show")

async function canclein(bot,msg){
    const chatId = msg.chat.id
    try{
        const db = new DatabaseTransaction()
        const maxidSQL = 'SELECT MAX(id) as id FROM recording WHERE groupid = ?'
        const maxid = await db.executeQuery(maxidSQL,[chatId],false)
        const SQL = 'DELETE FROM recording WHERE groupid = ? AND id = ?'
        await db.executeQuery(SQL,[chatId,maxid[0].id])
        showAll(bot,msg)
    }catch(err){
        console.log(err);
        return
    }
}

async function cancleUSDT(bot,msg){
    const chatId = msg.chat.id
    try{
        const db = new DatabaseTransaction()
        const maxidSQL = 'SELECT MAX(id) as id FROM outusdt WHERE groupid = ?'
        const maxid = await db.executeQuery(maxidSQL,[chatId],false)
        const SQL = 'DELETE FROM outusdt WHERE groupid = ? AND id = ?'
        await db.executeQuery(SQL,[chatId,maxid[0].id])
        showAll(bot,msg)
    }catch(err){
        console.log(err);
        return
    }
}

module.exports = {
    canclein,
    cancleUSDT
}