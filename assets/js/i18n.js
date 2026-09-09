/**
 * AI 学生折扣站 · 国际化多语言支持 (i18n)
 * 默认语言：中文 (zh-CN)，支持随时一键无刷新切换至英文 (EN)
 */

const LANG_KEY = 'ai_deals_preferred_lang';

const I18N = {
  zh: {
    // 品牌与全局文档
    'logo.title': 'AI 学生折扣站',
    'logo.sub': 'AI Student Deals',
    'doc.title': '2026 全球 AI 学生福利汇总 · AI Student Deals',
    'doc.desc': '2026 全球在校学生 AI 专属特权、大模型优惠与算力礼包聚合平台。信息整理自各大官方页面，助力每一位在校学生以 0 成本探索前沿 AI 科技。',

    // 导航
    'nav.deadlines': '截止倒计时',
    'nav.deals': '全部福利',
    'nav.roadmap': '组合路线',
    'nav.value': '价值测算',
    'nav.submit': '提交福利',
    'nav.submitBtn': '+ 提交新福利',
    'nav.github': 'GitHub',
    'nav.admin': '管理后台',
    'nav.langToggle': '🌐 EN',

    // Hero 区域
    'hero.pillLive': '全网检索核验于',
    'hero.pillNew': '本次新增 12 条（AWS Kiro、豆包、千问、火山方舟等）',
    'hero.title1': '2026 全球',
    'hero.titleGrad': 'AI 学生福利',
    'hero.title2': '一次薅干净',
    'hero.lead': '学生党最值钱的组合已经不是单独买一个 ChatGPT 或 Gemini，而是把 <b>GitHub Student Pack、Gemini 学生计划、ChatGPT 学生优惠、Microsoft / Azure 学生计划</b> 全部拿下。这里按官方页面核对状态，标注价值、截止时间、申请难度与中国大陆可用性。',
    'hero.statValue': '年度可薅总价值',
    'hero.statCount': '已收录福利条目',
    'hero.statCats': '覆盖品类',
    'hero.statLeft': '最近截止剩余',
    'hero.btnStart': '⚡ 开始薅羊毛',
    'hero.btnRoadmap': '🗺 看申请顺序',
    'hero.btnSubmit': '✎ 提交新福利',
    'hero.btnGithub': '⭐ GitHub 开源',

    // 倒计时
    'cd.urgentNote': '临期活动：逾期后不再补发，看到就尽快用',
    'cd.normalNote': '请在截止日期前完成领取',

    // 筛选与控制
    'filter.searchPlaceholder': '搜索平台、权益关键词…',
    'filter.allTiers': '全部优先级 (Tier)',
    'filter.tierS': 'Tier S · 必申神券',
    'filter.tierA': 'Tier A · 推荐申请',
    'filter.tierB': 'Tier B · 备选/一般',
    'filter.allCn': '全部地区',
    'filter.cnOk': '大陆直接可申',
    'filter.cnPartial': '有条件限制',
    'filter.cnHard': '难度较高',
    'filter.cnNo': '暂不可用',
    'filter.sortTier': '按优先级排序',
    'filter.sortVal': '按价值降序',
    'filter.sortDiff': '按难度升序',
    'filter.sortDue': '按截止时间',
    'filter.mineToggle': '✎ 计入我的提交',
    'filter.mineToggleTitle': '把我提交的福利也纳入列表、搜索与筛选',
    'filter.resCount': '匹配 <b>{n}</b> / {total} 条',
    'filter.noResult': '没有匹配的福利，试试换个关键词或放宽筛选条件。',
    'filter.reset': '重置筛选条件',

    // 分类
    'cat.all': '全部',
    'cat.china': '大陆专区',
    'cat.ai': 'AI 大模型',
    'cat.coding': 'AI 编程',
    'cat.cloud': '云与算力',
    'cat.devpack': '开发者礼包',
    'cat.search': '搜索研究',
    'cat.office': '办公生产力',
    'cat.design': '设计视频',
    'cat.learn': '学习数据',

    // 状态与区域
    'status.hot': '强烈建议申请',
    'status.conditional': '有条件 / 地区限制',
    'status.discount': '学生折扣',
    'status.free': '免费教育版',
    'status.none': '暂无稳定学生计划',
    'cn.ok': '大陆可申',
    'cn.partial': '有条件',
    'cn.hard': '难度高',
    'cn.no': '暂不可',

    // 卡片与详情
    'card.value': '预估价值',
    'card.duration': '权益周期',
    'card.diff': '申请难度',
    'card.deadline': '剩余时间',
    'card.noDeadline': '长期 / 无截止',
    'card.needEdu': '学校邮箱 / 学生身份',
    'card.needSheerid': 'SheerID 认证',
    'card.needCard': '国际信用卡',
    'card.needVpn': '海外网络环境',
    'card.btnApply': '去申请 →',
    'card.btnDetail': '查看详情',
    'card.leftDays': '剩 {n} 天',
    'card.expired': '已截止',
    'card.today': '今天截止',
    'card.stars': '星',
    'card.isMine': '✎ 我提交',
    'card.pending': '待核实',
    'modal.perks': '包含权益',
    'modal.reqs': '申请要求',
    'modal.needed': '需要 · ',
    'modal.notNeeded': '不需要 · ',
    'modal.btnGo': '前往官方页面申请 →',
    'modal.notesTitle': '注意：',
    'modal.noteMine': '由你提交的条目，尚未核实，请以官方页面为准。',
    'modal.contact': '提交者联系方式：',

    // 板块标题
    'sec.dealsTag': 'All Deals',
    'sec.dealsTitle': '全部 AI 学生福利',
    'sec.dealsDesc': '按状态标记：🟢 强烈建议 · 🟡 有条件 / 地区限制 · 🔵 学生折扣 · ⚪ 免费教育版 · 🔴 暂无稳定学生计划。点击卡片查看完整权益与申请要求；中国大陆学生可点「🇨🇳 大陆专区」看无需 SheerID 与海外网络的福利。',
    'sec.roadmapTag': 'Roadmap',
    'sec.roadmapTitle': '六条组合路线，照着顺序申请',
    'sec.roadmapDesc': '不想一个一个研究？按 AI → Coding → Cloud → 学习 → 设计 的顺序走，中国大陆学生可直接走「🇨🇳 大陆专线」，最终形成一套完整的学生 AI 工作站。',
    'sec.treeTitle': '🎓 一个学生账号，把全球 AI 福利吃干净',
    'sec.treeDesc': '学生身份是唯一入口，向下分叉出 AI / Coding / Cloud 三条主线，最终汇聚成完整工作站',
    'sec.valueTag': 'Value Breakdown',
    'sec.valueTitle': '到底能薅多少？',
    'sec.valueDesc': '下方为按各服务正常商业价格折算的年化价值（保守估计，未计入大量教育权益的隐性价值）。',
    'sec.warnTag': 'Warnings',
    'sec.warnTitle': '申请前必看的坑',
    'sec.submitTitle': '✎ 提交你发现的 AI 学生福利',
    'sec.submitDesc': '发现新的学生折扣、活动或政策变化？提交后会加入下方「我提交的福利」列表并进入审核队列。',

    // 图表与结构树
    'tree.student': '🎓 学生身份',
    'tree.workstation': '🎓 学生 AI 超级工作站',
    'value.donutLabel': '可折算年价值',

    // 表单
    'form.fName': '平台名称',
    'form.fVendor': '厂商 / 品牌',
    'form.fCat': '福利分类',
    'form.fValue': '预估年价值',
    'form.fStatus': '福利状态',
    'form.fCn': '中国大陆可用性',
    'form.fDeadline': '截止日期',
    'form.fUrl': '官方申请入口',
    'form.fDesc': '权益说明',
    'form.fContact': '你的联系方式（选填）',
    'form.phName': '例：Runway 学生计划',
    'form.phVendor': '例：Runway',
    'form.phValue': '例：$120 / 年 或 80+ 权益',
    'form.phDesc': '一句话说明这个福利包含什么、面向谁、有什么限制…',
    'form.phContact': '邮箱或社交账号，便于后续核实（不会公开）',
    'form.hint': '提交内容将同步进入管理员审核队列，审核通过后正式发布至全站。',
    'form.ok': '提交成功！已进入管理员审核队列，审核通过后将同步至全网 🎉',
    'form.btnSubmit': '提交福利',
    'form.btnReset': '清空表单',
    'form.mineCount': '共 <b id="mineCount">{n}</b> 条我提交的福利',
    'form.mineTitle': '📌 我提交的福利',
    'form.btnExport': '导出 JSON',
    'form.btnClear': '清空全部',
    'form.emptyMine': '还没有提交记录。发现新的 AI 学生福利？用上方表单提交一条吧。',

    // 页脚
    'footer.desc': '2026 全球在校学生 AI 专属特权、大模型优惠与算力礼包聚合平台。信息整理自各大官方页面，助力每一位在校学生以 0 成本探索前沿 AI 科技。',
    'footer.badgeGh': 'GitHub 开源',
    'footer.badgeCn': '🇨🇳 大陆专区直连',
    'footer.badgeCount': '40+ 项收录',
    'footer.badgeDate': '数据核验: ',
    'footer.colNav': '快速导航',
    'footer.colData': '开源与数据 (GEO)',
    'footer.colSys': '系统与合规',
    'footer.linkDeals': '全部福利列表',
    'footer.linkCountdowns': '临期活动倒计时',
    'footer.linkRoadmap': '组合申领路线图',
    'footer.linkValue': '可薅年化价值测算',
    'footer.linkSubmit': '提交发现的新福利',
    'footer.linkGhSource': 'GitHub 仓库源码 ↗',
    'footer.linkIssues': '反馈建议 / Issue ↗',
    'footer.linkLlms': 'LLMs.txt 知识索引',
    'footer.linkLlmsFull': 'LLMs 完整全量文档',
    'footer.linkSitemap': 'XML 站点地图',
    'footer.linkAdmin': '⚙️ 审核管理后台',
    'footer.linkCert': '学信网 / SheerID 认证',
    'footer.linkVerify': '官方入口安全核验',
    'footer.linkLicense': 'MIT 授权协议',
    'footer.disclaimer': '免责声明：本站信息整理自各官方公开页面，学生权益属于高频变动政策，申请前请务必以官方页面为准；切勿在第三方渠道买卖学生认证、校园邮箱或账号，存在严重封号与资金风险。本站不代申请、不售卖任何账号，仅供公益信息聚合。',

    // Toast 消息
    'toast.reqFields': '请填写带 * 的必填项',
    'toast.invalidUrl': '官方入口需以 http:// 或 https:// 开头',
    'toast.submitOk': '提交成功！已进入管理员审核队列 🎉',
    'toast.submitOffline': '已保存在本地浏览器（当前处于离线模式）',
    'toast.formReset': '表单已清空',
    'toast.mineEmpty': '列表已经是空的',
    'toast.clearConfirm': '确定清空全部已提交的福利？此操作不可恢复。',
    'toast.cleared': '已清空',
    'toast.exportEmpty': '暂无可导出的内容',
    'toast.exportOk': '已导出 JSON',
    'toast.filterReset': '筛选条件已重置',
    'toast.mineIncluded': '已把我提交的福利计入列表',
    'toast.mineExcluded': '已隐藏我提交的福利',
    'toast.deleted': '已删除',

    // 管理审核后台
    'admin.title': 'AI 学生折扣站 · 管理审核后台',
    'admin.badge': '⚙️ 审核管理后台',
    'admin.kpiPending': '⏳ 待审核提交',
    'admin.kpiApproved': '🟢 已上线福利',
    'admin.kpiRejected': '🔴 已驳回记录',
    'admin.kpiTotal': '📊 全部条目',
    'admin.backToSite': '← 返回前台',
    'admin.logout': '退出登录',
    'admin.tabPending': '⏳ 待审核',
    'admin.tabApproved': '🟢 已上线',
    'admin.tabRejected': '🔴 已驳回',
    'admin.tabAll': '🌐 全部',
    'admin.addNew': '+ 手动录入新福利',
    'admin.searchPlaceholder': '搜索平台、厂商或内容…',
    'admin.allCats': '全部类别',
    'admin.loading': '正在加载审核数据…',
    'admin.emptyPending': '当前没有待审核的福利提交 🎉',
    'admin.emptyList': '没有匹配的福利记录',
    'admin.btnApprove': '通过上线',
    'admin.btnEdit': '编辑修改',
    'admin.btnReject': '驳回',
    'admin.btnDelete': '删除',
    'admin.metaVendor': '厂商：',
    'admin.metaValue': '预估价值：',
    'admin.metaDuration': '时长：',
    'admin.metaDeadline': '截止：',
    'admin.metaStatus': '状态标签：',
    'admin.metaCreated': '创建时间：',
    'admin.descTitle': '权益说明：',
    'admin.notesTitle': '审核避坑备注：',
    'admin.contactTitle': '👤 提交者联系方式：',
    'admin.contactSuffix': '（前台已隐藏）',
    'admin.btnOpenPortal': '打开官方入口 ↗',
    'admin.btnApproveOnline': '✅ 审核通过并上线',
    'admin.btnUnpublish': '⏸️ 下线转为待审',
    'admin.btnRejectDeal': '❌ 驳回',
    'admin.btnDeleteForever': '🗑️ 彻底删除',
    'admin.loginTitle': '管理审核系统登录',
    'admin.loginDesc': '请输入管理员密码以进入审核控制台',
    'admin.loginPwd': '管理员密码',
    'admin.loginBtn': '进入控制台',
    'admin.loginPh': '输入管理员密码',
    'admin.modalTitle': '编辑福利条目',
    'admin.lblPlatformName': '平台 / 福利名称 *',
    'admin.lblVendor': '厂商 / 品牌 *',
    'admin.lblCategory': '所属分类 *',
    'admin.lblTier': '申请优先级 (Tier)',
    'admin.lblStatus': '福利状态标签',
    'admin.lblValue': '预估价值',
    'admin.lblDuration': '权益时长',
    'admin.lblDeadline': '截止日期',
    'admin.lblCn': '中国大陆可用性',
    'admin.lblDifficulty': '申请难度 (1-5)',
    'admin.lblUrl': '官方申请入口 URL *',
    'admin.lblTags': '核心标签 (以英文逗号分隔)',
    'admin.lblSummary': '一句话摘要说明 *',
    'admin.lblHighlights': '权益亮点 (每行一条)',
    'admin.lblNotes': '认证注意与避坑指南',
    'admin.btnCancel': '取消',
    'admin.btnSave': '保存并上线'
  },

  en: {
    // Brand & Document
    'logo.title': 'AI Student Deals',
    'logo.sub': 'Global Student Perks',
    'doc.title': '2026 Global AI Student Deals & Perks Guide',
    'doc.desc': 'Comprehensive 2026 directory of AI student discounts, free LLM tiers, compute credits, and developer tools for verified students worldwide.',

    // Nav
    'nav.deadlines': 'Deadlines',
    'nav.deals': 'All Deals',
    'nav.roadmap': 'Roadmap',
    'nav.value': 'Value Calc',
    'nav.submit': 'Submit',
    'nav.submitBtn': '+ Submit Deal',
    'nav.github': 'GitHub',
    'nav.admin': 'Admin',
    'nav.langToggle': '🇨🇳 中文',

    // Hero Section
    'hero.pillLive': 'Verified from official sources on',
    'hero.pillNew': '12 new deals added (AWS Kiro, Doubao, Qwen, etc.)',
    'hero.title1': '2026 Global',
    'hero.titleGrad': 'AI Student Deals',
    'hero.title2': 'The Ultimate Guide',
    'hero.lead': 'The smartest AI strategy for students is not paying for ChatGPT or Gemini individually, but leveraging <b>GitHub Student Pack, Gemini for Students, ChatGPT Plus, and Azure Education</b> all at once. Verified with value, deadlines, and requirements.',
    'hero.statValue': 'Est. Annual Value',
    'hero.statCount': 'Curated Deals',
    'hero.statCats': 'Categories',
    'hero.statLeft': 'Earliest Deadline',
    'hero.btnStart': '⚡ Explore Deals',
    'hero.btnRoadmap': '🗺 View Roadmap',
    'hero.btnSubmit': '✎ Submit Deal',
    'hero.btnGithub': '⭐ GitHub Open Source',

    // Countdowns
    'cd.urgentNote': 'Limited-time deal: Expiring soon, claim before it ends!',
    'cd.normalNote': 'Please claim before the deadline',

    // Filters
    'filter.searchPlaceholder': 'Search deals, vendors, perks...',
    'filter.allTiers': 'All Priorities (Tier)',
    'filter.tierS': 'Tier S · Must-Have',
    'filter.tierA': 'Tier A · Recommended',
    'filter.tierB': 'Tier B · Optional',
    'filter.allCn': 'All Regions',
    'filter.cnOk': 'Available in CN',
    'filter.cnPartial': 'Conditional',
    'filter.cnHard': 'High Difficulty',
    'filter.cnNo': 'Blocked in CN',
    'filter.sortTier': 'Sort by Priority',
    'filter.sortVal': 'Sort by Value (High to Low)',
    'filter.sortDiff': 'Sort by Difficulty (Easy First)',
    'filter.sortDue': 'Sort by Deadline',
    'filter.mineToggle': '✎ Include My Submissions',
    'filter.mineToggleTitle': 'Include your local submissions in the deal list',
    'filter.resCount': 'Matched <b>{n}</b> / {total} deals',
    'filter.noResult': 'No matching deals found. Try relaxing filters or search terms.',
    'filter.reset': 'Reset Filters',

    // Categories
    'cat.all': 'All',
    'cat.china': 'China Direct',
    'cat.ai': 'LLMs & AI',
    'cat.coding': 'AI Coding',
    'cat.cloud': 'Cloud & Compute',
    'cat.devpack': 'Developer Packs',
    'cat.search': 'Search & Research',
    'cat.office': 'Productivity',
    'cat.design': 'Design & Media',
    'cat.learn': 'Learning & Data',

    // Status & Availability
    'status.hot': 'Highly Recommended',
    'status.conditional': 'Conditional / Regional',
    'status.discount': 'Student Discount',
    'status.free': 'Free Education Edition',
    'status.none': 'No Stable Student Plan',
    'cn.ok': 'CN Available',
    'cn.partial': 'Conditional',
    'cn.hard': 'Hard',
    'cn.no': 'Blocked',

    // Cards & Details
    'card.value': 'Est. Value',
    'card.duration': 'Duration',
    'card.diff': 'Difficulty',
    'card.deadline': 'Time Left',
    'card.noDeadline': 'Perpetual / Ongoing',
    'card.needEdu': 'Edu Email Req.',
    'card.needSheerid': 'SheerID Verification',
    'card.needCard': 'Credit Card Req.',
    'card.needVpn': 'VPN Req.',
    'card.btnApply': 'Apply Now →',
    'card.btnDetail': 'Details',
    'card.leftDays': '{n}d left',
    'card.expired': 'Expired',
    'card.today': 'Ends today',
    'card.stars': '★',
    'card.isMine': '✎ My Submission',
    'card.pending': 'Unverified',
    'modal.perks': 'Included Perks',
    'modal.reqs': 'Application Requirements',
    'modal.needed': 'Required · ',
    'modal.notNeeded': 'Not Required · ',
    'modal.btnGo': 'Go to Official Application Portal →',
    'modal.notesTitle': 'Note: ',
    'modal.noteMine': 'Submitted by you; unverified, please check the official portal.',
    'modal.contact': 'Submitter Contact: ',

    // Section Titles
    'sec.dealsTag': 'All Deals',
    'sec.dealsTitle': 'All AI Student Deals',
    'sec.dealsDesc': 'Status indicators: 🟢 Highly Recommended · 🟡 Conditional / Regional · 🔵 Student Discount · ⚪ Free Education · 🔴 No Stable Plan. Click any card for detailed requirements.',
    'sec.roadmapTag': 'Roadmap',
    'sec.roadmapTitle': '6 Strategic Application Tracks',
    'sec.roadmapDesc': 'Follow the sequence: AI → Coding → Cloud → Study → Design to build your complete AI workstation.',
    'sec.treeTitle': '🎓 One Student ID to Unlock Global AI Perks',
    'sec.treeDesc': 'Your student identity is the single master key that unlocks AI, Coding, and Cloud tracks.',
    'sec.valueTag': 'Value Breakdown',
    'sec.valueTitle': 'How Much Can You Save?',
    'sec.valueDesc': 'Annual value estimated based on regular commercial pricing (excluding hidden educational benefits).',
    'sec.warnTag': 'Warnings',
    'sec.warnTitle': 'Important Pitfalls to Avoid',
    'sec.submitTitle': '✎ Submit a New AI Student Deal',
    'sec.submitDesc': 'Discovered a new discount, promotion, or policy change? Submit it here to enter the review queue.',

    // Tree & Charts
    'tree.student': '🎓 Student ID',
    'tree.workstation': '🎓 Student AI Super Workstation',
    'value.donutLabel': 'Est. Annual Value',

    // Form
    'form.fName': 'Platform Name',
    'form.fVendor': 'Vendor / Brand',
    'form.fCat': 'Category',
    'form.fValue': 'Estimated Value',
    'form.fStatus': 'Deal Status',
    'form.fCn': 'China Availability',
    'form.fDeadline': 'Deadline',
    'form.fUrl': 'Official Portal URL',
    'form.fDesc': 'Perks Description',
    'form.fContact': 'Your Contact (Optional)',
    'form.phName': 'e.g., Runway Student Program',
    'form.phVendor': 'e.g., Runway',
    'form.phValue': 'e.g., $120 / yr or 80+ perks',
    'form.phDesc': 'Briefly describe perks, eligibility, and limitations...',
    'form.phContact': 'Email or social handle for verification (not public)',
    'form.hint': 'Submissions will enter the admin review queue before going live.',
    'form.ok': 'Submitted successfully! It is now in the review queue 🎉',
    'form.btnSubmit': 'Submit Deal',
    'form.btnReset': 'Clear Form',
    'form.mineCount': '<b id="mineCount">{n}</b> submissions in total',
    'form.mineTitle': '📌 My Submissions',
    'form.btnExport': 'Export JSON',
    'form.btnClear': 'Clear All',
    'form.emptyMine': 'No submissions yet. Discovered a new AI discount? Submit one above.',

    // Footer
    'footer.desc': 'Curated global AI student discounts, LLM subsidies, and cloud computing benefits for students in 2026. Verified from official sources to empower learning at zero cost.',
    'footer.badgeGh': 'GitHub Open Source',
    'footer.badgeCn': '🇨🇳 CN Direct Access',
    'footer.badgeCount': '40+ Deals Curated',
    'footer.badgeDate': 'Verified: ',
    'footer.colNav': 'Navigation',
    'footer.colData': 'Open Source & GEO',
    'footer.colSys': 'System & Trust',
    'footer.linkDeals': 'All Curated Deals',
    'footer.linkCountdowns': 'Expiring Deals Countdown',
    'footer.linkRoadmap': 'Application Roadmaps',
    'footer.linkValue': 'Annual Savings Calculator',
    'footer.linkSubmit': 'Submit a New Deal',
    'footer.linkGhSource': 'GitHub Source Code ↗',
    'footer.linkIssues': 'Feedback & Issues ↗',
    'footer.linkLlms': 'LLMs.txt Context Index',
    'footer.linkLlmsFull': 'LLMs Full Documentation',
    'footer.linkSitemap': 'XML Sitemap',
    'footer.linkAdmin': '⚙️ Admin Review Console',
    'footer.linkCert': 'CHSI / SheerID Guide',
    'footer.linkVerify': 'Official URL Verification',
    'footer.linkLicense': 'MIT License',
    'footer.disclaimer': 'Disclaimer: All information is compiled from official pages. Student benefits change frequently; always verify on official portals. Never buy or sell student accounts or emails. This site does not broker applications or sell accounts.',

    // Toast Messages
    'toast.reqFields': 'Please fill in all required fields (*)',
    'toast.invalidUrl': 'Official URL must start with http:// or https://',
    'toast.submitOk': 'Submitted successfully! In review queue 🎉',
    'toast.submitOffline': 'Saved locally in browser (offline mode)',
    'toast.formReset': 'Form cleared',
    'toast.mineEmpty': 'Submission list is already empty',
    'toast.clearConfirm': 'Clear all submitted deals? This cannot be undone.',
    'toast.cleared': 'Cleared',
    'toast.exportEmpty': 'No submissions to export',
    'toast.exportOk': 'Exported JSON',
    'toast.filterReset': 'Filters reset',
    'toast.mineIncluded': 'Included your submissions in deal list',
    'toast.mineExcluded': 'Hidden your submissions',
    'toast.deleted': 'Deleted',

    // Admin Console
    'admin.title': 'AI Student Deals · Admin Console',
    'admin.badge': '⚙️ Admin Review Console',
    'admin.kpiPending': '⏳ Pending Submissions',
    'admin.kpiApproved': '🟢 Approved Deals',
    'admin.kpiRejected': '🔴 Rejected Submissions',
    'admin.kpiTotal': '📊 Total Deals',
    'admin.backToSite': '← Back to Site',
    'admin.logout': 'Logout',
    'admin.tabPending': '⏳ Pending',
    'admin.tabApproved': '🟢 Approved',
    'admin.tabRejected': '🔴 Rejected',
    'admin.tabAll': '🌐 All',
    'admin.addNew': '+ Add New Deal',
    'admin.searchPlaceholder': 'Search deals, vendors, perks...',
    'admin.allCats': 'All Categories',
    'admin.loading': 'Loading review data...',
    'admin.emptyPending': 'No pending submissions at the moment 🎉',
    'admin.emptyList': 'No matching deal records found',
    'admin.btnApprove': 'Approve & Publish',
    'admin.btnEdit': 'Edit',
    'admin.btnReject': 'Reject',
    'admin.btnDelete': 'Delete',
    'admin.metaVendor': 'Vendor: ',
    'admin.metaValue': 'Est. Value: ',
    'admin.metaDuration': 'Duration: ',
    'admin.metaDeadline': 'Deadline: ',
    'admin.metaStatus': 'Status: ',
    'admin.metaCreated': 'Created: ',
    'admin.descTitle': 'Description: ',
    'admin.notesTitle': 'Review Notes & Pitfalls: ',
    'admin.contactTitle': '👤 Submitter Contact: ',
    'admin.contactSuffix': ' (Hidden on site)',
    'admin.btnOpenPortal': 'Open Official Portal ↗',
    'admin.btnApproveOnline': '✅ Approve & Publish',
    'admin.btnUnpublish': '⏸️ Unpublish to Pending',
    'admin.btnRejectDeal': '❌ Reject',
    'admin.btnDeleteForever': '🗑️ Delete Forever',
    'admin.loginTitle': 'Admin Review Console Login',
    'admin.loginDesc': 'Please enter the admin password to access the review console',
    'admin.loginPwd': 'Admin Password',
    'admin.loginBtn': 'Enter Console',
    'admin.loginPh': 'Enter admin password',
    'admin.modalTitle': 'Edit Deal Item',
    'admin.lblPlatformName': 'Platform / Deal Name *',
    'admin.lblVendor': 'Vendor / Brand *',
    'admin.lblCategory': 'Category *',
    'admin.lblTier': 'Priority (Tier)',
    'admin.lblStatus': 'Status Tag',
    'admin.lblValue': 'Estimated Value',
    'admin.lblDuration': 'Duration',
    'admin.lblDeadline': 'Deadline',
    'admin.lblCn': 'China Availability',
    'admin.lblDifficulty': 'Difficulty (1-5)',
    'admin.lblUrl': 'Official Portal URL *',
    'admin.lblTags': 'Core Tags (comma separated)',
    'admin.lblSummary': 'Summary / Description *',
    'admin.lblHighlights': 'Key Highlights (one per line)',
    'admin.lblNotes': 'Verification Notes & Pitfalls',
    'admin.btnCancel': 'Cancel',
    'admin.btnSave': 'Save & Publish'
  }
};

const ROADMAPS_EN = [
  {
    key: 'ai',
    title: '🧠 AI Foundation',
    desc: 'Secure the top 4 flagship models first for maximum AI coverage',
    color: '#7c9cff',
    steps: ['Gemini 12 Months', 'ChatGPT Plus 4 Months', 'Codex $100', 'Claude Promo', 'Perplexity Student']
  },
  {
    key: 'coding',
    title: '💻 AI Coding Suite',
    desc: 'Complete software engineering workstation for students',
    color: '#38e0c8',
    steps: ['GitHub Student', 'Copilot Student', 'Cursor / Kiro Student', 'JetBrains', 'Windsurf']
  },
  {
    key: 'cloud',
    title: '☁️ Cloud & Compute',
    desc: 'AI + GPU + Coding + Cloud Deployment',
    color: '#4fc3ff',
    steps: ['Azure $100', 'AWS Educate', 'Google Cloud Edu', 'GitHub Codespaces']
  },
  {
    key: 'study',
    title: '📚 Study & Research',
    desc: 'Ideal for undergrads, postgrads, PhDs, and academic researchers',
    color: '#9ccc65',
    steps: ['Notion', 'Overleaf', 'Perplexity', 'Gemini', 'ChatGPT', 'Microsoft 365']
  },
  {
    key: 'design',
    title: '🎨 Design & Creative',
    desc: 'UI / Presentation / Posters / Media / Video / Copywriting',
    color: '#ff7ab6',
    steps: ['Figma Education', 'Canva Education', 'Adobe Student', 'Firefly']
  },
  {
    key: 'cn',
    title: '🇨🇳 China Direct Track',
    desc: 'No VPN, no SheerID needed; campus email or student ID is sufficient',
    color: '#ff6b81',
    steps: ['Doubao 3 Months Free', 'Volcengine 100M Tokens', 'Qwen Edu Perks', 'Tongyi Tingwu Pro 1 Year', 'Dify Education']
  }
];

const WARNINGS_EN = [
  {
    title: 'Never Buy "Student Accounts"',
    body: 'Do not buy US university emails, SheerID verifications, or fake student IDs on secondary markets. Most services verify via SheerID, university SSO, or official enrollment records; violators face permanent account termination.'
  },
  {
    title: 'Distinguish "Discounts" vs "Free"',
    body: 'Adobe and Canva offer student discounts (still require payment), while Gemini, Copilot, and JetBrains are 100% free. Do not mistake discounts for free perks when estimating value.'
  },
  {
    title: 'Promotional Perks Change Quickly',
    body: 'Student perks from services like Cursor, Perplexity, and Replit are dynamic promotional campaigns. Third-party articles claiming "lifetime free" are usually outdated; always check official portals.'
  },
  {
    title: 'Automatic Billing After Free Period Ends',
    body: 'Gemini Student automatically renews at the regular rate ($19.99/mo in US) after the free year; Cursor Student similarly recurs at $20/mo. If payment info was required at signup, set calendar reminders to cancel before renewal.'
  },
  {
    title: 'Domestic Vendors Never Issue Generic Redeem Codes',
    body: 'Tencent, Alibaba, Baidu, ByteDance, Zhipu, and MiniMax never issue generic redeem codes or CDKeys. Beware of phishing scams requesting phone numbers or deposit fees. Legitimate benefits credit directly inside official apps/consoles.'
  },
  {
    title: 'Promotion Windows Are Getting Shorter',
    body: 'Current promotional windows are characterized by larger allowances but shorter durations. Use expiring perks immediately and avoid relying on temporary free tiers for production workflows.'
  },
  {
    title: 'GitHub Student Pack Valid for 2 Years',
    body: 'GitHub student status is valid for 2 years and requires re-verification upon expiry. Third-party partner perks cannot be repeatedly redeemed with duplicate accounts.'
  }
];

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || 'zh';
}

function t(key, params = {}) {
  const lang = getCurrentLang();
  let str = (I18N[lang] && I18N[lang][key]) || (I18N.zh && I18N.zh[key]) || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return str;
}

function getLocalizedRoadmaps() {
  return getCurrentLang() === 'en' ? ROADMAPS_EN : (typeof ROADMAPS !== 'undefined' ? ROADMAPS : []);
}

function getLocalizedWarnings() {
  return getCurrentLang() === 'en' ? WARNINGS_EN : (typeof WARNINGS !== 'undefined' ? WARNINGS : []);
}

function localizeDeal(d) {
  if (!d) return d;
  if (getCurrentLang() !== 'en') return d;
  const en = typeof DEALS_EN !== 'undefined' ? DEALS_EN[d.id] : null;
  if (!en) return d;
  return {
    ...d,
    name: en.name || d.name,
    vendor: en.vendor || d.vendor,
    duration: en.duration || d.duration,
    value: en.value || d.value,
    summary: en.summary || d.summary,
    tags: en.tags || d.tags,
    highlights: en.highlights || d.highlights,
    notes: en.notes !== undefined ? en.notes : d.notes
  };
}

function setLang(lang) {
  if (lang !== 'zh' && lang !== 'en') lang = 'zh';
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // 更新页面标题与 Meta 描述
  const isDocAdmin = document.body && document.body.classList.contains('admin-body');
  document.title = isDocAdmin ? t('admin.title') : t('doc.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', t('doc.desc'));
  }

  // 更新所有带有 data-i18n 的静态 DOM 元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translated = t(key);
    if (el.dataset.i18nHtml) {
      el.innerHTML = translated;
    } else {
      el.textContent = translated;
    }
  });

  // 更新占位符 data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    el.setAttribute('placeholder', t(key));
  });

  // 更新导航语言切换按钮文案
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.textContent = lang === 'zh' ? '🌐 EN' : '🇨🇳 中文';
  }

  // 触发全局重绘事件（联动 app.js）
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function toggleLang() {
  const next = getCurrentLang() === 'zh' ? 'en' : 'zh';
  setLang(next);
}
