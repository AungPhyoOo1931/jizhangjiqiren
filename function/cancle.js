/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */
const { getRegisteredGroup } = require("../module/group")
const { showAll } = require("../module/show")
const { normalSend } = require("../module/send")

async function voidLatest(bot, msg, table, emptyText) {
    const chatId = msg.chat.id
    const registered = await getRegisteredGroup(bot, chatId)
    if (!registered) return
    const { db, group } = registered
    const params = group.shift_id ? [chatId, group.shift_id] : [chatId]
    const shiftSql = group.shift_id ? 'groupid = ? AND shift_id = ? AND isrecordding = 1' : 'groupid = ? AND isrecordding = 1'
    const maxid = await db.executeQuery(
        `SELECT MAX(id) as id FROM ${table} WHERE ${shiftSql}`,
        params,
        false
    )
    if (!maxid[0] || maxid[0].id == null) {
        normalSend(bot, emptyText, chatId)
        return
    }
    await db.executeQuery(
        `UPDATE ${table} SET isrecordding = 0 WHERE id = ? AND groupid = ?`,
        [maxid[0].id, chatId],
        false
    )
    await showAll(bot, msg, registered)
}

async function canclein(bot, msg) {
    try {
        await voidLatest(bot, msg, 'recording', '没有可撤销的入款记录')
    } catch (err) {
        console.log(err)
        normalSend(bot, '撤销失败，请稍后重试', msg.chat.id)
    }
}

async function cancleUSDT(bot, msg) {
    try {
        await voidLatest(bot, msg, 'outusdt', '没有可撤销的下发记录')
    } catch (err) {
        console.log(err)
        normalSend(bot, '撤销失败，请稍后重试', msg.chat.id)
    }
}

async function cancleReply(bot, msg) {
    const chatId = msg.chat.id
    const replyId = msg.reply_to_message && msg.reply_to_message.message_id
    if (!replyId) {
        normalSend(bot, '请回复要撤销的那条入款或下发消息，或发送「撤销入款」「撤销下发」', chatId)
        return
    }
    try {
        const registered = await getRegisteredGroup(bot, chatId)
        if (!registered) return
        const { db } = registered
        const inResult = await db.executeQuery(
            'UPDATE recording SET isrecordding = 0 WHERE groupid = ? AND messageid = ? AND isrecordding = 1',
            [chatId, replyId],
            false
        )
        if (inResult.affectedRows > 0) {
            await showAll(bot, msg, registered)
            return
        }
        const outResult = await db.executeQuery(
            'UPDATE outusdt SET isrecordding = 0 WHERE groupid = ? AND messageid = ? AND isrecordding = 1',
            [chatId, replyId],
            false
        )
        if (outResult.affectedRows > 0) {
            await showAll(bot, msg, registered)
            return
        }
        normalSend(bot, '没有找到对应的可撤销记录', chatId)
    } catch (err) {
        console.log(err)
        normalSend(bot, '撤销失败，请稍后重试', chatId)
    }
}

module.exports = {
    canclein,
    cancleUSDT,
    cancleReply,
}
