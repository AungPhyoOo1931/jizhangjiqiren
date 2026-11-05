/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { DatabaseTransaction } = require('./mysql')
const { normalSend } = require('./send')

async function findGroup(chatId) {
    const db = new DatabaseTransaction()
    const rows = await db.executeQuery(
        `SELECT g.echange, g.start, g.userid, g.shift_id, g.bill_message_id,
                u.active, u.end, u.istry,
                s.ended_at AS shift_ended,
                s.started_at AS shift_started
         FROM groupList g
         LEFT JOIN users u ON g.userid = u.id
         LEFT JOIN shifts s ON s.id = g.shift_id
         WHERE g.id = ?`,
        [chatId],
        false
    )
    return { db, group: rows[0] || null }
}

async function getRegisteredGroup(bot, chatId) {
    const { db, group } = await findGroup(chatId)
    if (!group) {
        normalSend(bot, '当前群组未注册，请机器人拥有者发送「开始」来注册并使用', chatId)
        return null
    }
    return { db, group }
}

async function expireIfNeeded(db, group) {
    const active = Number(group.active) === 1
    const tried = Number(group.istry) === 1
    const endPassed = group.end && new Date(group.end).getTime() < Date.now()

    if (active && !endPassed) {
        return 'ok'
    }

    if (active && endPassed && group.userid) {
        await db.executeQuery('UPDATE users SET active = 0 WHERE id = ?', [group.userid], false)
        await db.executeQuery('UPDATE groupList SET active = 0 WHERE userid = ?', [group.userid], false)
        return 'expired'
    }

    if (tried) {
        return 'expired'
    }
    return 'inactive'
}

async function getReadyGroup(bot, chatId) {
    const result = await getRegisteredGroup(bot, chatId)
    if (!result) return null

    const { db, group } = result
    if (Number(group.start) === 0) {
        normalSend(bot, '机器人暂停记账中，请先发送「继续」', chatId)
        return null
    }
    const status = await expireIfNeeded(db, group)
    if (status === 'expired') {
        normalSend(bot, '机器人已过期，请续费', chatId)
        return null
    }
    if (status === 'inactive') {
        normalSend(bot, '当前账号未激活，请先私聊发送「申请试用」', chatId)
        return null
    }
    if (!group.shift_id || group.shift_ended) {
        normalSend(bot, '已下课，请先发送「上课」后再记账', chatId)
        return null
    }
    return { db, group }
}

module.exports = {
    findGroup,
    getRegisteredGroup,
    getReadyGroup,
}
