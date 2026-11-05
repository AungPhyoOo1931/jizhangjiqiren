/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { getRegisteredGroup, findGroup } = require("../module/group")
const { normalSend, replySend } = require("../module/send")
const { ensureOpenShift, closeShift } = require("../module/shift")
const { showAll } = require("../module/show")

async function setMute(bot, chatId, status) {
    await bot.setChatPermissions(chatId,{
        can_send_messages: status,
        can_send_media_messages: status,
        can_send_polls: status,
        can_send_other_messages: status,
        can_add_web_page_previews: status,
        can_change_info: status,
        can_invite_users: status,
        can_pin_messages: status
    })
}

async function lock(bot,msg,status){
    const messageId = msg.message_id
    const chatId = msg.chat.id
    const registered = await getRegisteredGroup(bot, chatId)
    if (!registered) return
    const { db, group } = registered
    try{
        if(status){
            const openedNew = !group.shift_id || group.shift_ended
            await ensureOpenShift(db, chatId, msg.from.id)
            try {
                await setMute(bot, chatId, true)
            } catch (err) {
                if (!(err.response && err.response.body && err.response.body.description === 'Bad Request: CHAT_NOT_MODIFIED')) {
                    throw err
                }
            }
            normalSend(
                bot,
                openedNew
                    ? '上课：新班已开始，全员可发言'
                    : '上课：全员可发言，本班继续记账',
                chatId
            )
        }else{
            await closeShift(db, chatId)
            try {
                await setMute(bot, chatId, false)
            } catch (err) {
                if (!(err.response && err.response.body && err.response.body.description === 'Bad Request: CHAT_NOT_MODIFIED')) {
                    throw err
                }
            }
            normalSend(bot,'下课：全员禁言，本班账单已冻结。下一班请发「上课」，清账请发「清除账单」',chatId)
        }
        const refreshed = await findGroup(chatId)
        await showAll(bot, msg, refreshed)
    }catch(err){
        console.log(err)
        return replySend(bot,'出现未知错误，请检查机器人是否已是管理员并拥有管理权限',chatId,messageId)
    }
}

module.exports = lock
