/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

require('dotenv').config()
const { pool } = require('./module/mysql')

async function tableName(name) {
    const [rows] = await pool.query(
        `SELECT TABLE_NAME AS name
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = LOWER(?)`,
        [name]
    )
    return rows[0] ? rows[0].name : null
}

async function hasColumn(table, column) {
    const [rows] = await pool.query(
        `SELECT 1
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND LOWER(TABLE_NAME) = LOWER(?)
           AND LOWER(COLUMN_NAME) = LOWER(?)`,
        [table, column]
    )
    return rows.length > 0
}

async function hasTable(name) {
    return Boolean(await tableName(name))
}

async function addColumn(table, column, ddl) {
    if (await hasColumn(table, column)) {
        console.log(`skip column ${table}.${column}`)
        return
    }
    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN ${ddl}`)
    console.log(`added column ${table}.${column}`)
}

async function migrate() {
    const groupTable = (await tableName('grouplist')) || 'grouplist'
    const recordingTable = (await tableName('recording')) || 'recording'
    const outTable = (await tableName('outusdt')) || 'outusdt'

    if (!(await hasTable('shifts'))) {
        await pool.query(`
            CREATE TABLE shifts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                groupid VARCHAR(255) NOT NULL,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                ended_at TIMESTAMP NULL,
                started_by BIGINT NULL,
                CONSTRAINT shifts_grouplist_id_fk
                    FOREIGN KEY (groupid) REFERENCES \`${groupTable}\` (id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            )
        `)
        console.log('created table shifts')
    } else {
        console.log('skip table shifts')
    }

    await addColumn(groupTable, 'shift_id', 'INT NULL')
    await addColumn(groupTable, 'bill_message_id', 'INT NULL')
    await addColumn(recordingTable, 'userid', 'BIGINT NULL')
    await addColumn(recordingTable, 'shift_id', 'INT NULL')
    await addColumn(outTable, 'userid', 'BIGINT NULL')
    await addColumn(outTable, 'shift_id', 'INT NULL')

    const [groups] = await pool.query(`SELECT id, shift_id FROM \`${groupTable}\``)
    for (const group of groups) {
        if (group.shift_id) continue
        const [result] = await pool.query(
            'INSERT INTO shifts (groupid) VALUE (?)',
            [group.id]
        )
        const shiftId = result.insertId
        await pool.query(
            `UPDATE \`${groupTable}\` SET shift_id = ? WHERE id = ?`,
            [shiftId, group.id]
        )
        await pool.query(
            `UPDATE \`${recordingTable}\` SET shift_id = ? WHERE groupid = ? AND shift_id IS NULL AND isrecordding = 1`,
            [shiftId, group.id]
        )
        await pool.query(
            `UPDATE \`${outTable}\` SET shift_id = ? WHERE groupid = ? AND shift_id IS NULL AND isrecordding = 1`,
            [shiftId, group.id]
        )
        console.log(`backfilled shift ${shiftId} for group ${group.id}`)
    }

    console.log('migrate done')
}

module.exports = { migrate }

if (require.main === module) {
    migrate()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('migrate failed', err)
            process.exit(1)
        })
}
