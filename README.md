

------

# 📒 通用 TG 记账机器人（基础款）

一个适用于 Telegram 群组的记账机器人，具备基本入账、下发、汇率设置、自动记录、群控权限管理等功能。

------

## 💡 功能指令

### ✅ 启用与权限设置

1️⃣ **邀请机器人进群**并**设置为管理员**（若未设为管理员，将无法检测群消息）
 邀请人自动成为管理员，拥有最高权限。

2️⃣ 激活指令：

- `开始` → 激活机器人并开始记录
- `停止` → 暂停机器人记录
- `继续` → 恢复记录

3️⃣ 群权限控制指令：

- `上课` → 全员允许发送消息
- `下课` → 全员禁止发送消息

------

### 💱 汇率与入账

4️⃣ 设置汇率（默认 7.0）：

- `设置汇率7.0` 或 `汇率6.8`

5️⃣ 入账指令（**仅群组管理员可用**）：

- 回复目标成员消息：`+金额` 或 `+金额/汇率`
- 或输入格式：`张三+金额`、`张三+金额/汇率`
- 组合方式：`+金额/汇率 张三 费率`（可独立设置费率/汇率/入款人）

📌 也支持直接回复用户消息进行入账。

------

### 💸 下发与修正

6️⃣ 下发资金（**仅管理员可用**）：

- 回复用户：`下发金额` 或 `下发金额U`
- 直接输入：`张三下发+金额`

7️⃣ 撤销或修正：

- 撤销最近一笔入款：`撤销入款`
- 撤销最近一笔下发：`撤销下发`
- 输入错误可使用：`-金额` 或 `下发-金额` 进行修正

------

### 🧹 账单与试用

8️⃣ 清除账单记录：

- 输入 `清除账单` 即可清除当天所有记录。

9️⃣ 免费试用功能：

- 机器人支持 24 小时免费试用，自激活后开始计时。
- 输入 `个人信息` 可查看账户状态与试用剩余时间。

------

## 🚀 部署机器人

### 第一步：克隆项目并安装依赖

```bash
git clone https://github.com/你的仓库地址.git
cd 项目目录
npm install
```

------

### 第二步：配置环境变量

创建 `.env` 文件，填写以下内容：

```ini
BOT_TOKEN=你的 Telegram Bot Token
DB_HOST=数据库地址
DB_USER=数据库用户名
DB_PASSWORD=数据库密码
DB_DATABASE=数据库名称
```

------

### 第三步：导入数据库结构

项目已提供 `database.sql` 文件，包含所有数据表结构，导入方式如下：

#### 方法一：使用 DataGrip（推荐 GUI 用户）

1. 打开 DataGrip，连接你的数据库。
2. 右键目标数据库 → “运行 SQL 脚本” → 选择 `database.sql` → 执行。

#### 方法二：使用命令行导入（适用于 MySQL/MariaDB）

```bash
mysql -u 用户名 -p 数据库名 < database.sql
```

> 示例：

```bash
mysql -u root -p mydatabase < database.sql
```

#### 方法三：使用 phpMyAdmin

1. 登录 phpMyAdmin，选择目标数据库。
2. 点击“导入” → 选择 `database.sql` 文件 → 点击“执行”。

------

### 第四步：启动机器人

```bash
node bot.js
```

------

## 📝 License

本项目使用 MIT License 开源，你可以自由复制、修改、分发本项目，但请保留原作者署名及许可说明。

```
MIT License

Copyright (c) 2025 Qin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

------

如需进一步协助部署或自定义功能，欢迎联系我 😄
联系方式TG - @caishen8867

微信 - apojie1931