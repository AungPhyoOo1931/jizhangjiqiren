/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const { sendMessage } = require("../module/send")

async function datail(bot,msg){
    const chatId = msg.chat.id
    const text = `
记账机器人教程

1. 邀请机器人进群并设为管理员。私聊发送 /start 注册，再发「申请试用」。

2. 群里发送「开始」激活本群并开班
 「暂停」暂停记账，「继续」恢复
 「上课」开新班并允许全员发言
 「下课」结束本班并禁言（账单冻结，不会删除）

3. 「设置汇率7.0」或「汇率6.8」设置本群默认汇率

4. 入款（仅群管理员）
  回复对方：+100 或 +100/6.9
  或：张三+100 、张三+100/6.9
  记错了可以发：-100

  下发（仅群管理员）
  回复对方：下发100 或 下发100U
  或：张三下发100
  记错了可以发：下发-50

5. 「账单」查看本班；回复对方再发「账单」可查对方
  「清除账单」重置本班
  「撤销入款」「撤销下发」作废本班最近一条
  回复某条入款/下发消息再发「撤销」，可作废那一笔

6. 免费试用 24 小时。「个人信息」查看到期时间和账户状态
`
    sendMessage(bot,text,chatId)
}

module.exports = datail
