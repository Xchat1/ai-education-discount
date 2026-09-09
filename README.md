# 🎓 AI 学生折扣站 · AI Student Deals

> 2026 年全球 AI 学生福利与学生折扣聚合站 —— 收录 **40 条**正在生效的权益，涵盖 AI 大模型、AI 编程、云与算力、开发者礼包、搜索研究、办公生产力、设计视频、学习数据八大品类，并单独提供 **🇨🇳 中国大陆专区**。

![总价值](https://img.shields.io/badge/年度可薅价值-%242%2C502%2B-8b7cff?style=flat-square)
![条目](https://img.shields.io/badge/福利条目-40-4fc3ff?style=flat-square)
![更新](https://img.shields.io/badge/数据核验-2026--09--09-3ddc97?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-ff7ab6?style=flat-square)

## ✨ 特性

- **状态可视化**：🟢 强烈建议 · 🟡 有条件/地区限制 · 🔵 学生折扣 · ⚪ 免费教育版 · 🔴 暂无稳定学生计划
- **多维筛选**：品类 / 优先级（S·A·B）/ 中国大陆可用性 / 关键词搜索 / 四种排序
- **🇨🇳 大陆专区**：一键筛出无需 SheerID、无需海外网络、校园邮箱或学生认证即可申请的福利
- **动态倒计时**：自动取最近 3 个截止日期，临期活动优先预警
- **组合路线图**：AI → Coding → Cloud → 学习 → 设计 → 大陆专线，六条路线照着申请
- **价值测算**：环形图 + 条形图拆解年度可薅价值构成
- **支持提交**：可在站内提交新发现的福利，本地保存并支持导出 JSON
- **纯静态**：零依赖、零构建，双击 `index.html` 即可运行

## 🚀 快速开始

```bash
# 方式一：直接打开
open index.html

# 方式二：本地服务（推荐，避免个别浏览器 file:// 限制）
python3 -m http.server 8848
# 然后访问 http://127.0.0.1:8848
```

无需 npm install，无需构建步骤。

## 📁 目录结构

```
ai-education-discount/
├── index.html              # 页面结构
├── assets/
│   ├── css/style.css       # 视觉样式（深色玻璃拟态 + 极光背景）
│   └── js/
│       ├── data.js         # ⭐ 数据层：所有福利、路线图、避坑提醒
│       └── app.js          # 交互逻辑：渲染、筛选、倒计时、图表、提交
├── LICENSE                 # MIT
├── README.md
└── .gitignore
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
