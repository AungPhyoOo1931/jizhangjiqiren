/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { getRegisteredGroup } = require("./group")
const { replySend } = require("./send")
const { escapeHtml } = require("./html")
const { ms, ysmc } = require("./time")

function toMoney(value) {
    return Number(value || 0).toFixed(2)
}

function memberLink(chatId, item, label) {
    const groupid = String(chatId).replace('-100','')
    return `<b><a href="https://t.me/c/${groupid}/${item.messageid}">${escapeHtml(label)}</a></b>`
}

function shiftWhere(shiftId) {
    if (shiftId) {
        return { sql: 'groupid = ? AND shift_id = ? AND isrecordding = 1', params: (chatId) => [chatId, shiftId] }
    }
    return { sql: 'groupid = ? AND isrecordding = 1', params: (chatId) => [chatId] }
}

function personWhere(shiftId, userid, name, nameColumn) {
    const base = shiftWhere(shiftId)
    if (userid && name) {
        return {
            sql: `${base.sql} AND (userid = ? OR (${nameColumn} = ? AND userid IS NULL))`,
            params: (chatId) => [...base.params(chatId), userid, name],
        }
    }
    if (userid) {
        return {
            sql: `${base.sql} AND userid = ?`,
            params: (chatId) => [...base.params(chatId), userid],
        }
    }
    return {
        sql: `${base.sql} AND ${nameColumn} = ?`,
        params: (chatId) => [...base.params(chatId), name],
    }
}

function buildBillText({ title, inCount, outCount, inn, outt, intotal, inUSDTtotal, outtotal, chatId, shiftLabel }) {
    const inText = inn.map(item => {
        return `
${memberLink(chatId, item, item.name)} ${ms(item.join_in)} ${item.amount} / ${item.exchange} = ${item.usdt}U`
    }).join('')
    const outText = outt.map(item => {
        return `
${memberLink(chatId, item, item.nickname)} ${ms(item.join_in)} ${item.amount} U`
    }).join('')
    const unpaid = toMoney(Number(inUSDTtotal || 0) - Number(outtotal || 0))
    const head = title ? `【${escapeHtml(title)}】\n` : ''
    return `
${head}${shiftLabel}
本班入款（${inCount}）笔
${inText}

本班下发（${outCount}）笔
${outText}

总入款：${toMoney(intotal)}
应下发：${toMoney(inUSDTtotal)}
已下发：${toMoney(outtotal)}
未下发：${unpaid}
`
}

function shiftLabel(group) {
    if (!group || !group.shift_id) return '当前账单'
    const started = group.shift_started ? ysmc(group.shift_started) : ''
    if (group.shift_ended) {
        return `本班已下课${started ? `（${started} 开班）` : ''}`
    }
    return `本班进行中${started ? `（${started} 开班）` : ''}`
}

async function sendOrEditBill(bot, chatId, text, db, group) {
    if (group && group.bill_message_id) {
        try {
            await bot.editMessageText(text, {
                chat_id: chatId,
                message_id: group.bill_message_id,
                parse_mode: 'HTML',
            })
            return
        } catch (err) {
            const desc = err.response && err.response.body && err.response.body.description
            if (desc && /message is not modified/i.test(desc)) return
        }
    }
    const sent = await bot.sendMessage(chatId, text, { parse_mode: 'HTML' })
    if (db && group) {
        await db.executeQuery(
            'UPDATE groupList SET bill_message_id = ? WHERE id = ?',
            [sent.message_id, chatId],
            false
        )
        group.bill_message_id = sent.message_id
    }
}

async function showAll(bot, msg, ready) {
    const chatId = msg.chat.id
    try {
        const ctx = ready || await getRegisteredGroup(bot, chatId)
        if (!ctx) return
        const { db, group } = ctx
        const where = shiftWhere(group.shift_id)
        const p = where.params(chatId)
        const totaSql = `SELECT
  (SELECT COUNT(id) FROM recording WHERE ${where.sql}) AS 'in',
  (SELECT SUM(amount) FROM recording WHERE ${where.sql}) AS 'intotal',
  (SELECT SUM(usdt) FROM recording WHERE ${where.sql}) AS 'inUSDTtotal',
  (SELECT COUNT(id) FROM outusdt WHERE ${where.sql}) AS 'out',
  (SELECT SUM(amount) FROM outusdt WHERE ${where.sql}) AS 'outtotal'
`
        const count = await db.executeQuery(totaSql, [...p, ...p, ...p, ...p, ...p], false)
        const inn = await db.executeQuery(
            `SELECT name,username,amount,exchange,usdt,join_in,messageid FROM recording WHERE ${where.sql} ORDER BY id DESC`,
            p,
            false
        )
        const outt = await db.executeQuery(
            `SELECT username,nickname,amount,join_in,messageid FROM outusdt WHERE ${where.sql} ORDER BY id DESC`,
            p,
            false
        )
        const text = buildBillText({
            inCount: count[0].in,
            outCount: count[0].out,
            inn,
            outt,
            intotal: count[0].intotal,
            inUSDTtotal: count[0].inUSDTtotal,
            outtotal: count[0].outtotal,
            chatId,
            shiftLabel: shiftLabel(group),
        })
        await sendOrEditBill(bot, chatId, text, db, group)
    } catch (err) {
        console.log('出错了：', err)
        return
    }
}

async function showMe(bot, msg, target) {
    const chatId = msg.chat.id
    const messageId = msg.message_id
    const name = target && target.name
    const userid = target && target.userid
    if (!name && !userid) return
    try {
        const ctx = await getRegisteredGroup(bot, chatId)
        if (!ctx) return
        const { db, group } = ctx
        const inWhere = personWhere(group.shift_id, userid, name, 'name')
        const outWhere = personWhere(group.shift_id, userid, name, 'nickname')
        const inP = inWhere.params(chatId)
        const outP = outWhere.params(chatId)
        const total = `SELECT
      (SELECT COUNT(id) FROM recording WHERE ${inWhere.sql}) AS 'in',
      (SELECT SUM(amount) FROM recording WHERE ${inWhere.sql}) AS 'intotal',
      (SELECT SUM(usdt) FROM recording WHERE ${inWhere.sql}) AS 'inUSDTtotal',
      (SELECT COUNT(id) FROM outusdt WHERE ${outWhere.sql}) AS 'out',
      (SELECT SUM(amount) FROM outusdt WHERE ${outWhere.sql}) AS 'outtotal'
    `
        const count = await db.executeQuery(total, [...inP, ...inP, ...inP, ...outP, ...outP], false)
        const inn = await db.executeQuery(
            `SELECT name,username,amount,exchange,usdt,join_in,messageid FROM recording WHERE ${inWhere.sql} ORDER BY id DESC`,
            inP,
            false
        )
        const outt = await db.executeQuery(
            `SELECT username,nickname,amount,join_in,messageid FROM outusdt WHERE ${outWhere.sql} ORDER BY id DESC`,
            outP,
            false
        )
        const text = buildBillText({
            title: name || String(userid),
            inCount: count[0].in,
            outCount: count[0].out,
            inn,
            outt,
            intotal: count[0].intotal,
            inUSDTtotal: count[0].inUSDTtotal,
            outtotal: count[0].outtotal,
            chatId,
            shiftLabel: shiftLabel(group),
        })
        replySend(bot, text, chatId, messageId)
    } catch (err) {
        console.log(err)
        return
    }
}

module.exports = {
    showAll,
    showMe,
}
