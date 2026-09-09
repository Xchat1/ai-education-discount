# 🎓 AI 学生折扣站 · AI Student Deals

> 2026 年全球 AI 学生福利与学生折扣聚合站 —— 收录 **40 条**正在生效的权益，涵盖 AI 大模型、AI 编程、云与算力、开发者礼包、搜索研究、办公生产力、设计视频、学习数据八大品类，并单独提供 **🇨🇳 中国大陆专区**。

![总价值](https://img.shields.io/badge/年度可薅价值-%242%2C502%2B-8b7cff?style=flat-square)
![条目](https://img.shields.io/badge/福利条目-40-4fc3ff?style=flat-square)
![更新](https://img.shields.io/badge/数据核验-2026--09--09-3ddc97?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-ff7ab6?style=flat-square)

## ✨ 特性

- **状态可视化**：🟢 强烈建议 · 🟡 有条件/地区限制 · 🔵 学生折扣 · ⚪ 免费教育版 · 🔴 暂无稳定学生计划
- **🌐 国际化支持 (i18n)**：默认中文 (`zh-CN`)，支持一键无刷新无感切换至英文 (`EN`)，本地存储记忆用户首选语言
- **多维筛选**：品类 / 优先级（S·A·B）/ 中国大陆可用性 / 关键词搜索 / 四种排序
- **🇨🇳 大陆专区**：一键筛出无需 SheerID、无需海外网络、校园邮箱或学生认证即可申请的福利
- **动态倒计时**：自动取最近 3 个截止日期，临期活动优先预警
- **组合路线图**：AI → Coding → Cloud → 学习 → 设计 → 大陆专线，六条路线照着申请
- **价值测算**：环形图 + 条形图拆解年度可薅价值构成
- **支持提交**：可在站内提交新发现的福利，本地保存并支持导出 JSON
- **纯静态**：零依赖、零构建，双击 `index.html` 即可运行

## 🚀 部署与运行方式

本项目同时支持 **纯静态本地运行**、**Docker 容器化部署** 以及 **Cloudflare (CF Pages + D1) 边缘无服务化部署**，并内置了完整的**管理审核后台**。

### 方式一：Docker 一键部署（推荐自建服务器 / NAS）

项目内置了轻量 Node 22 镜像与内置持久化 SQLite 数据库，无任何复杂构建依赖：

```bash
# 启动服务（默认端口 3000，后台运行）
docker compose up -d

# 查看运行日志
docker compose logs -f
```

* **前台网址**：`http://localhost:3000`
* **管理审核后台**：`http://localhost:3000/admin.html`（或 `http://localhost:3000/admin`）
* **默认管理员密码**：`admin123456`（请在 `docker-compose.yml` 中通过环境变量 `ADMIN_PASSWORD` 修改）
* **数据持久化**：数据库自动保存在宿主机 `./data/deals.db`，容器销毁更新数据不丢失。

---

### 方式二：Cloudflare Pages + D1 边缘部署（推荐全托管 0 成本）

利用 Cloudflare Pages Functions + D1 边缘数据库，享受全球毫秒级 CDN 分发与永久免费额度：

1. **创建 D1 数据库**：
   ```bash
   npx wrangler d1 create ai_deals_db
   ```
   复制终端输出的 `database_id`，粘贴到项目 [`wrangler.toml`](file:///Users/admin/AllProjects/ai-education-discount/wrangler.toml) 的 `database_id` 处。

2. **初始化 D1 数据库表结构与预置 40 条数据**：
   ```bash
   npx wrangler d1 execute ai_deals_db --file=schema.sql --remote
   ```

3. **部署至 Cloudflare Pages**：
   ```bash
   npx wrangler pages deploy .
   ```

4. **配置管理员密码**：
   在 Cloudflare 控制台 -> **Workers & Pages** -> 你的项目 -> **Settings** -> **Environment variables** 中添加：
   * 变量名：`ADMIN_PASSWORD`
   * 变量值：你的专属管理员强密码

---

### 方式三：本地纯静态开发 / 离线模式

无需任何后端与数据库，直接打开即可：
```bash
open index.html
# 或启动简单 HTTP 服务
python3 -m http.server 8848
```

---

## ⚙️ 管理审核系统与工作流

1. **用户前台提交**：访问前台底部的「提交福利」表单填报新福利，数据将通过 `/api/submit` 异步推入待审核队列（离线模式下自动降级为保存在用户本地浏览器）。
2. **管理员登录**：进入 `/admin.html`，输入管理员密码完成鉴权。
3. **审核与管理**：
   * ⏳ **待审核队列**：查看提交人联系方式、申请链接与权益说明，支持 **一键通过上线**、**编辑并发布**、**驳回** 或 **删除**。
   * 🟢 **已上线福利**：支持检索、编辑修改已有字段、随时下线。
   * ➕ **手动直录**：点击右上角「手动录入新福利」即可绕过审核直接发布。
   * 🔄 **前台全自动热同步**：一旦审核通过，前台页面无需重新编译，动态无缝同步展示最新福利！

---

## 📁 目录结构

```
ai-education-discount/
├── index.html              # 前台页面结构
├── admin.html              # ⭐ 专属管理审核后台
├── server.js               # ⭐ Node.js / Docker 核心服务端（内置 SQLite 与 API）
├── Dockerfile              # Docker 容器构建文件
├── docker-compose.yml      # Docker 编排配置（含持久化卷挂载）
├── wrangler.toml           # Cloudflare Pages 配置文件
├── schema.sql              # D1 / SQLite 数据库建表与 40+ 条初始种子数据
├── functions/              # ⭐ Cloudflare Pages Functions 边缘 API
│   ├── _utils.js           # 鉴权、响应、格式化公共函数
│   └── api/
│       ├── deals.js        # 公开接口：获取已审核上线福利
│       ├── submit.js       # 公开接口：用户提交福利
│       └── admin/          # 管理员接口：login, deals, review
├── assets/
│   ├── css/
│   │   ├── style.css       # 前台视觉样式（深色玻璃拟态 + 极光背景）
│   │   └── admin.css       # 管理审核后台专用样式
│   └── js/
│       ├── data.js         # 前端预置兜底数据（40 条全量福利）
│       ├── deals-en.js     # 🌐 全量 40 条福利的英文翻译字典
│       ├── i18n.js         # 🌐 国际化多语言核心模块（双语字典与切换引擎）
│       ├── app.js          # 前台交互：渲染、筛选、图表、异步提交
│       └── admin.js        # 后台逻辑：鉴权、KPI 统计、列表过滤、审核操作
├── LICENSE                 # MIT
└── README.md
```

## 📝 新增或修改一条福利

所有内容集中在 `assets/js/data.js` 的 `DEALS` 数组，按下面结构追加即可，页面会自动渲染：

```js
{
  id: 'unique-id',            // 唯一标识
  name: '平台名称',
  vendor: '厂商',
  letter: 'BR',               // 品牌字母块显示文字
  brand: ['#色1', '#色2'],       // 品牌渐变色
  category: 'ai',             // all/china/ai/coding/cloud/devpack/search/office/design/learn
  cnNative: false,            // 是否中国大陆可直接申请（决定是否在「大陆专区」出现）
  tier: 'S',                  // S / A / B 优先级
  status: 'hot',              // hot/conditional/discount/free/none
  value: '$120',              // 展示用价值文案
  valueNum: 120,              // 参与排序与图表折算的数字
  duration: '免费 12 个月',
  deadline: '2026-12-31',     // 无截止则留空字符串
  cn: 'ok',                   // ok / partial / hard / no
  difficulty: 2,              // 申请难度 1-5
  tags: ['标签1', '标签2'],
  summary: '一句话说明',
  highlights: ['权益点1', '权益点2'],
  notes: '注意事项与风险提示',
  need: { edu: true, sheerid: true, card: false, vpn: true },
  url: 'https://官方入口'
}
```

> 站点顶部的统计数字、倒计时卡片、价值图表均由 `DEALS` 自动推导，改动数据后会同步更新，无需手改。

## ⚠️ 免责声明

- 学生权益属于**高频变动政策**，本站信息整理自各平台官方页面与公开报道，申请前请务必以官方页面为准。
- 部分条目存在**官方说法与第三方评测冲突**的情况（已在卡片详情中标注），例如 ChatGPT Plus 学生优惠、Cursor 学生计划。
- **切勿在第三方渠道购买学生认证、学校邮箱或 SheerID 代认证**，存在封号与资金风险；腾讯、阿里、百度、字节、智谱、月之暗面、MiniMax 等厂商从未发放过通用兑换码，凡要求填手机号或先付费的均为诈骗风险。
- 本站不代申请、不售卖任何账号，仅做信息聚合。

## 📄 License

[MIT](./LICENSE) © 2026 Xchat1

基于 MIT 协议自由使用、修改与分发，保留版权声明即可。
