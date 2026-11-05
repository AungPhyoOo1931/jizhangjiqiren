/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const EXACT = {
    '开始': { type: 'register', admin: false },
    '暂停': { type: 'recording', on: false },
    '停止': { type: 'recording', on: false },
    '继续': { type: 'recording', on: true },
    '上课': { type: 'classOn' },
    '下课': { type: 'classOff' },
    '清除账单': { type: 'clear' },
    '账单': { type: 'bill', admin: false },
    '撤销入款': { type: 'voidIn' },
    '撤销下发': { type: 'voidOut' },
    '撤销': { type: 'void' },
}

function parseGroupCommand(text) {
    if (!text) return null
    const raw = String(text).trim()
    if (EXACT[raw]) {
        return { admin: true, ...EXACT[raw] }
    }

    let m = raw.match(/^(?:设置汇率|汇率)\s*\+?(\d+(?:\.\d+)?)$/)
    if (m) {
        return { type: 'rate', admin: true, value: Number(m[1]) }
    }

    m = raw.match(/^(?:(.+?)下发|下发)\s*\+?(-?\d+(?:\.\d+)?)U?$/u)
    if (m) {
        return {
            type: 'out',
            admin: true,
            name: m[1] ? m[1].trim() : null,
            amount: Number(m[2]),
        }
    }

    m = raw.match(/^-(\d+(?:\.\d+)?)$/)
    if (m) {
        return { type: 'in', admin: true, name: null, amount: -Number(m[1]), exchange: null }
    }

    m = raw.match(/^(?:([^\d+\/\s]+)\s*\+|\+)\s*(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?$/)
    if (m) {
        return {
            type: 'in',
            admin: true,
            name: m[1] || null,
            amount: Number(m[2]),
            exchange: m[3] ? Number(m[3]) : null,
        }
    }

    return null
}

function displayName(from) {
    if (!from) return null
    const name = `${from.first_name || ''}${from.last_name || ''}`
    return name || from.username || null
}

function replyUser(msg) {
    const from = msg.reply_to_message && msg.reply_to_message.from
    if (!from || from.is_bot) return { name: null, username: null, userid: null }
    return {
        name: displayName(from),
        username: from.username || null,
        userid: from.id || null,
    }
}

module.exports = {
    parseGroupCommand,
    displayName,
    replyUser,
}

if (require.main === module) {
    const cases = [
        ['开始', { type: 'register' }],
        ['停止', { type: 'recording', on: false }],
        ['暂停', { type: 'recording', on: false }],
        ['继续', { type: 'recording', on: true }],
        ['上课', { type: 'classOn' }],
        ['下课', { type: 'classOff' }],
        ['设置汇率7.2', { type: 'rate', value: 7.2 }],
        ['汇率6.8', { type: 'rate', value: 6.8 }],
        ['+100', { type: 'in', name: null, amount: 100, exchange: null }],
        ['+100/6.8', { type: 'in', amount: 100, exchange: 6.8 }],
        ['张三+100', { type: 'in', name: '张三', amount: 100 }],
        ['张三+100/6.9', { type: 'in', name: '张三', amount: 100, exchange: 6.9 }],
        ['-80', { type: 'in', amount: -80 }],
        ['下发100', { type: 'out', name: null, amount: 100 }],
        ['下发100U', { type: 'out', amount: 100 }],
        ['下发-50', { type: 'out', amount: -50 }],
        ['张三下发80.5', { type: 'out', name: '张三', amount: 80.5 }],
        ['张三下发+80', { type: 'out', name: '张三', amount: 80 }],
        ['账单', { type: 'bill' }],
        ['撤销', { type: 'void' }],
        ['撤销入款', { type: 'voidIn' }],
        ['100', null],
        ['hello', null],
    ]
    let failed = 0
    for (const [text, expected] of cases) {
        const got = parseGroupCommand(text)
        const ok = expected == null
            ? got == null
            : got && Object.keys(expected).every((key) => got[key] === expected[key])
        if (!ok) {
            failed += 1
            console.error('FAIL', text, got)
        }
    }
    if (failed) {
        process.exit(1)
    }
    console.log(`parse ok (${cases.length})`)
}
