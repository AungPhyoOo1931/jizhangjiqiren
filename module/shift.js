/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

async function ensureOpenShift(db, chatId, userId) {
    const rows = await db.executeQuery(
        `SELECT g.shift_id, s.ended_at
         FROM groupList g
         LEFT JOIN shifts s ON s.id = g.shift_id
         WHERE g.id = ?`,
        [chatId],
        false
    )
    if (!rows.length) return null

    const row = rows[0]
    if (row.shift_id && !row.ended_at) {
        return row.shift_id
    }

    const inserted = await db.executeQuery(
        'INSERT INTO shifts (groupid, started_by) VALUE (?, ?)',
        [chatId, userId || null],
        false
    )
    const shiftId = inserted.insertId
    await db.executeQuery(
        'UPDATE groupList SET shift_id = ?, bill_message_id = NULL WHERE id = ?',
        [shiftId, chatId],
        false
    )
    return shiftId
}

async function closeShift(db, chatId) {
    const rows = await db.executeQuery(
        'SELECT shift_id FROM groupList WHERE id = ?',
        [chatId],
        false
    )
    const shiftId = rows[0] && rows[0].shift_id
    if (!shiftId) return null
    await db.executeQuery(
        'UPDATE shifts SET ended_at = NOW() WHERE id = ? AND ended_at IS NULL',
        [shiftId],
        false
    )
    return shiftId
}

module.exports = {
    ensureOpenShift,
    closeShift,
}
