/* ============================================================
 *  AI Student Deals · 交互层
 * ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LS_KEY = 'ai_student_deals_submissions_v1';

let state = { cat: 'all', tier: 'all', cn: 'all', sort: 'tier', q: '', mine: false };
let allDeals = [...DEALS];

/* ================= 工具 ================= */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const catOf = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
const daysLeft = d => {
  if (!d) return null;
  const t = new Date(d + 'T23:59:59');
  return Math.max(0, Math.ceil((t - new Date()) / 864e5));
};

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}

/* 只允许 http(s) 链接，避免 javascript: 等伪协议 */
const safeUrl = u => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '#');

function gradientOf(brand) {
  const b = Array.isArray(brand) ? brand : ['#8b7cff', '#4fc3ff'];
  return `linear-gradient(135deg, ${b[0]}, ${b[1] || b[0]})`;
}

/* ================= 倒计时 ================= */
function renderCountdowns() {
  // 动态取最近 3 个有截止日期的条目，避免新增临期活动后倒计时区过时
  const list = allDeals.filter(d => d.deadline)
    .sort((a, b) => a.deadline < b.deadline ? -1 : 1)
    .slice(0, 3)
    .map(d => {
      const locD = typeof localizeDeal === 'function' ? localizeDeal(d) : d;
      return {
        label: locD.name,
        date: d.deadline,
        urgent: daysLeft(d.deadline) <= 30,
        start: '2026-09-01'
      };
    });

  $('#countdowns').innerHTML = list.map(c => {
    const left = daysLeft(c.date);
    const total = Math.max(1, Math.ceil((new Date(c.date + 'T23:59:59') - new Date(c.start)) / 864e5));
    const pct = Math.max(2, Math.min(100, (left / total) * 100));
    const d = new Date(c.date);
    return `
      <div class="cd-card ${c.urgent ? 'urgent' : ''}">
        <div class="cd-top">
          <div class="cd-name">${c.urgent ? '🔥' : '⏳'} ${esc(c.label)}</div>
          <div class="cd-date">${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}</div>
        </div>
        <div class="cd-nums">
          <div class="cd-num"><b>${left}</b><span>DAYS</span></div>
          <div class="cd-num"><b>${String(Math.floor(left / 7)).padStart(2, '0')}</b><span>WEEKS</span></div>
          <div class="cd-num"><b>${String(Math.floor(left / 30)).padStart(2, '0')}</b><span>MONTHS</span></div>
        </div>
        <div class="cd-bar"><i style="width:${pct}%"></i></div>
        <div class="cd-note">${c.urgent ? (typeof t === 'function' ? t('cd.urgentNote') : '临期活动：逾期后不再补发，看到就尽快用') : (typeof t === 'function' ? t('cd.normalNote') : '请在截止日期前完成领取')}</div>
      </div>`;
  }).join('');

  // Hero 统计数字与数据层保持自洽
  const nums = $$('.hstat .n');
  const total = allDeals.reduce((s, d) => s + (d.valueNum || 0), 0);
  const deadlines = allDeals.map(d => daysLeft(d.deadline)).filter(x => x !== null);
  if (nums[0]) nums[0].dataset.count = Math.round(total);
  if (nums[1]) nums[1].dataset.count = allDeals.length;
  if (nums[2]) nums[2].dataset.count = CATEGORIES.length - 1;
  if (nums[3]) {
    nums[3].dataset.count = deadlines.length ? Math.min(...deadlines) : daysLeft(SITE_META.hotDeadline.date);
    nums[3].dataset.suffix = (typeof getCurrentLang === 'function' && getCurrentLang() === 'en') ? ' Days' : ' 天';
  }
}

/* ================= 分类 Chips ================= */
function renderChips() {
  const counts = {};
  CATEGORIES.forEach(c => counts[c.id] = 0);
  allDeals.forEach(d => { if (counts[d.category] !== undefined) counts[d.category]++; });
  counts.all = allDeals.length;
  counts.china = allDeals.filter(d => d.cnNative).length;

  $('#catChips').innerHTML = CATEGORIES.map(c => {
    const name = typeof t === 'function' ? t('cat.' + c.id) : c.name;
    return `
      <button class="chip ${c.id === state.cat ? 'on' : ''}" data-cat="${c.id}">
        ${c.icon} ${name}<span class="cnt">${counts[c.id] || 0}</span>
      </button>`;
  }).join('');

  $$('#catChips .chip').forEach(b => b.onclick = () => {
    state.cat = b.dataset.cat;
    renderChips();
    renderCards();
  });
}

/* ================= 卡片 ================= */
function dealScore(d) {
  const t = { S: 0, A: 1, B: 2 }[d.tier] ?? 3;
  return t;
}

function renderCards() {
  const q = state.q.trim().toLowerCase();
  const src = state.mine ? allDeals.concat(mineAsDeals()) : allDeals;
  let list = src.filter(d => {
    // 「大陆专区」是跨分类的视图：只保留中国大陆可直接申请的条目
    if (state.cat === 'china') { if (!d.cnNative) return false; }
    else if (state.cat !== 'all' && d.category !== state.cat) return false;
    if (state.tier !== 'all' && d.tier !== state.tier) return false;
    if (state.cn !== 'all' && d.cn !== state.cn) return false;
    if (q) {
      const en = (typeof DEALS_EN !== 'undefined' && DEALS_EN[d.id]);
      const enHay = en ? [en.name, en.vendor, en.summary, ...(en.tags || []), ...(en.highlights || [])].join(' ') : '';
      const hay = [d.name, d.vendor, d.summary, ...(d.tags || []), ...(d.highlights || []), enHay]
        .join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const cmp = {
    tier:      (a, b) => dealScore(a) - dealScore(b) || b.valueNum - a.valueNum,
    value:     (a, b) => b.valueNum - a.valueNum,
    diff:      (a, b) => a.difficulty - b.difficulty || dealScore(a) - dealScore(b),
    deadline:  (a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    }
  }[state.sort];
  list.sort(cmp);

  $('#noResult').style.display = list.length ? 'none' : 'block';
  $('#resCount').innerHTML = typeof t === 'function'
    ? t('filter.resCount', { n: list.length, total: src.length })
    : `匹配 <b>${list.length}</b> / ${src.length} 条`;

  $('#cardGrid').innerHTML = list.map((rawD, i) => {
    const d = typeof localizeDeal === 'function' ? localizeDeal(rawD) : rawD;
    const st = STATUS_MAP[d.status];
    const cn = CN_MAP[d.cn];
    const c = catOf(d.category);
    const catName = typeof t === 'function' ? t('cat.' + d.category) : c.name;
    const stLabel = typeof t === 'function' ? t('status.' + d.status) : st.label;
    const cnLabel = typeof t === 'function' ? t('cn.' + d.cn) : cn.label;
    const left = daysLeft(d.deadline);
    const applyTxt = typeof t === 'function' ? t('card.btnApply') : '去申请 →';
    const isMineTag = typeof t === 'function' ? t('card.isMine') : '✎ 我提交';
    const leftTag = typeof t === 'function' ? t('card.leftDays', { n: left }) : `剩 ${left} 天`;
    const diffTitle = typeof t === 'function' ? `${t('card.diff')} ${d.difficulty}/5` : `申请难度 ${d.difficulty}/5`;

    return `
    <article class="card t-${d.tier}" data-id="${d.id}" tabindex="0" role="button"
      aria-label="${esc(d.name)}" style="animation-delay:${Math.min(i * 26, 420)}ms">
      <div class="card-top">
        <div class="brand-mark" style="background:${gradientOf(d.brand)}">${esc(d.letter)}</div>
        <div class="card-title">
          <h3>${esc(d.name)}</h3>
          <div class="card-vendor">${esc(d.vendor)} · ${c.icon} ${catName}</div>
        </div>
        <div class="tier-badge tier-${d.tier}" title="${d.tier}">${d.tier}</div>
      </div>

      <div class="card-value">
        <span class="v" style="color:${d.valueNum ? 'var(--txt-1)' : 'var(--txt-3)'}">${esc(d.value)}</span>
        <span class="d">${esc(d.duration)}</span>
      </div>

      <p class="card-desc">${esc(d.summary)}</p>

      <div class="tags">
        ${(d.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
        ${d.isMine ? `<span class="tag" style="color:var(--brand-3);border-color:rgba(255,122,182,.4);background:rgba(255,122,182,.14)">${isMineTag}</span>` : ''}
        ${left !== null && left <= 60 ? `<span class="tag hot">⏳ ${leftTag}</span>` : ''}
      </div>

      <div class="card-foot">
        <div>
          <div class="status-dot" style="color:${st.color}">
            <i style="background:${st.color};box-shadow:0 0 8px ${st.color}"></i>${stLabel}
          </div>
          <div class="card-meta">
            <span class="cn-badge" style="background:${cn.color}1f;color:${cn.color}">${cnLabel}</span>
            <span class="diff" title="${diffTitle}">
              ${[1,2,3,4,5].map(n => `<i class="${n <= d.difficulty ? 'on' : ''}"></i>`).join('')}
            </span>
          </div>
        </div>
        <a class="go-btn" href="${esc(safeUrl(d.url))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
          ${applyTxt}
        </a>
      </div>
    </article>`;
  }).join('');

  bindCards();
}

function bindCards() {
  $$('#cardGrid .card').forEach(card => {
    let raf = 0, px = 0, py = 0;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--mx', px + 'px');
        card.style.setProperty('--my', py + 'px');
        raf = 0;
      });
    });
    card.onclick = () => openModal(card.dataset.id);
    card.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.id); }
    };
  });
}

/* ================= 详情弹窗 ================= */
function openModal(id) {
  const rawD = allDeals.find(x => x.id === id) ||
            (state.mine ? mineAsDeals().find(x => x.id === id) : null);
  if (!rawD) return;
  const d = typeof localizeDeal === 'function' ? localizeDeal(rawD) : rawD;
  const st = STATUS_MAP[d.status], cn = CN_MAP[d.cn], c = catOf(d.category);
  const catName = typeof t === 'function' ? t('cat.' + d.category) : c.name;
  const stLabel = typeof t === 'function' ? t('status.' + d.status) : st.label;
  const cnLabel = typeof t === 'function' ? t('cn.' + d.cn) : cn.label;
  const left = daysLeft(d.deadline);
  const isEn = typeof getCurrentLang === 'function' && getCurrentLang() === 'en';

  const req = [
    [typeof t === 'function' ? t('card.needEdu') : '学校邮箱 / 学生身份', d.need.edu],
    [typeof t === 'function' ? t('card.needSheerid') : 'SheerID 认证', d.need.sheerid],
    [typeof t === 'function' ? t('card.needCard') : '国际信用卡', d.need.card],
    [typeof t === 'function' ? t('card.needVpn') : '海外网络环境', d.need.vpn]
  ];

  const neededPrefix = typeof t === 'function' ? t('modal.needed') : '需要 · ';
  const notNeededPrefix = typeof t === 'function' ? t('modal.notNeeded') : '不需要 · ';
  const valLabel = typeof t === 'function' ? t('card.value') : '预估价值';
  const durLabel = typeof t === 'function' ? t('card.duration') : '权益周期';
  const timeLabel = typeof t === 'function' ? (d.deadline ? t('card.deadline') : t('card.noDeadline')) : (d.deadline ? '剩余时间' : '无截止');
  const timeVal = d.deadline ? (left + (isEn ? ' days' : ' 天')) : (typeof t === 'function' ? t('card.noDeadline') : '长期');
  const cnRegionText = isEn ? `China: ${cnLabel}` : `中国大陆：${cnLabel}`;
  const diffText = typeof t === 'function' ? `${t('card.diff')} ` : '申请难度 ';
  const perksTitle = typeof t === 'function' ? t('modal.perks') : '包含权益';
  const reqsTitle = typeof t === 'function' ? t('modal.reqs') : '申请要求';
  const notesTitle = typeof t === 'function' ? t('modal.notesTitle') : '注意：';
  const goBtnText = typeof t === 'function' ? t('modal.btnGo') : '前往官方页面申请 →';

  $('#modalCard').innerHTML = `
    <button class="modal-close" id="mcClose">×</button>
    <div class="modal-head">
      <div class="brand-mark" style="background:${gradientOf(d.brand)}">${esc(d.letter)}</div>
      <div>
        <h3>${esc(d.name)}</h3>
        <div class="mv">${esc(d.vendor)} · ${c.icon} ${catName} · Tier ${d.tier}</div>
      </div>
    </div>

    <div class="modal-metrics">
      <div class="metric"><b style="color:var(--brand-4)">${esc(d.value)}</b><span>${valLabel}</span></div>
      <div class="metric"><b>${esc(d.duration)}</b><span>${durLabel}</span></div>
      <div class="metric"><b>${timeVal}</b><span>${timeLabel}</span></div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <span class="tag" style="color:${st.color};border-color:${st.color}44;background:${st.color}18">${st.emoji} ${stLabel}</span>
      <span class="tag" style="color:${cn.color};border-color:${cn.color}44;background:${cn.color}18">${cnRegionText}</span>
      <span class="tag">${diffText}${'●'.repeat(d.difficulty)}${'○'.repeat(5 - d.difficulty)}</span>
    </div>

    <div class="modal-h4">${perksTitle}</div>
    <ul class="hl-list">${(d.highlights || []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>

    <div class="modal-h4">${reqsTitle}</div>
    <div class="req-grid">
      ${req.map(([n, v]) => `<span class="req-item ${v ? 'yes' : ''}">${v ? neededPrefix : notNeededPrefix}${n}</span>`).join('')}
    </div>

    ${d.notes ? `<div class="note-box"><b>${notesTitle}</b>${esc(d.notes)}</div>` : ''}

    <a class="modal-go" href="${esc(safeUrl(d.url))}" target="_blank" rel="noopener">${goBtnText}</a>
  `;
  $('#modal').classList.add('show');
  savedScroll = window.scrollY;
  document.body.style.overflow = 'hidden';
  $('#mcClose').onclick = closeModal;
}

let savedScroll = 0;
function closeModal() {
  $('#modal').classList.remove('show');
  document.body.style.overflow = '';
  window.scrollTo(0, savedScroll);
}

/* ================= 路线图 ================= */
function renderRoadmap() {
  const roadmaps = typeof getLocalizedRoadmaps === 'function' ? getLocalizedRoadmaps() : ROADMAPS;
  $('#roadGrid').innerHTML = roadmaps.map(r => `
    <div class="road" style="--c:${r.color}">
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.desc)}</p>
      <div class="flow">
        ${r.steps.map(s => `
          <div class="flow-item">
            <div class="flow-dot"><i></i></div>
            <div class="flow-txt">${esc(s)}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  // 结构树
  const cols = [
    { x: 150, color: '#7c9cff', title: 'AI', items: ['Gemini Pro', 'ChatGPT Plus', 'Codex $100', 'Claude', 'Perplexity'] },
    { x: 450, color: '#38e0c8', title: 'Coding', items: ['GitHub Student', 'Copilot Student', 'Cursor', 'JetBrains', 'Replit'] },
    { x: 750, color: '#4fc3ff', title: 'Cloud', items: ['Azure $100', 'AWS Educate', 'Google Cloud', 'Codespaces'] }
  ];
  const bottoms = ['Notion / Figma / Office', 'Overleaf / Adobe / Canva'];
  const JOIN = 340, H = 512;
  const topNodeText = typeof t === 'function' ? t('tree.student') : '🎓 学生身份';
  const bottomNodeText = typeof t === 'function' ? t('tree.workstation') : '🎓 学生 AI 超级工作站';

  let svg = `<svg viewBox="0 0 900 ${H}" width="100%" style="display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8b7cff"/><stop offset="55%" stop-color="#4fc3ff"/><stop offset="100%" stop-color="#ff7ab6"/>
      </linearGradient>
    </defs>`;

  // 连线：顶部 → 三列
  svg += `<path d="M450 74 L450 96 M150 96 L750 96" stroke="url(#tg)" stroke-width="1.6" fill="none" opacity=".65"/>`;
  cols.forEach(c => {
    svg += `<path d="M${c.x} 96 L${c.x} 128" stroke="${c.color}" stroke-width="1.8" fill="none" opacity=".8"/>`;
  });
  // 连线：三列 → 汇聚
  cols.forEach(c => {
    svg += `<path d="M${c.x} ${JOIN} L${c.x} 352 L450 352 L450 356" stroke="${c.color}" stroke-width="1.4" fill="none" opacity=".45"/>`;
  });

  // 顶部节点
  svg += `<rect x="345" y="42" width="210" height="34" rx="17" fill="url(#tg)" opacity=".95"/>
    <text x="450" y="64" text-anchor="middle" fill="#0a0d1a" font-size="15" font-weight="800">${topNodeText}</text>`;

  // 三列
  cols.forEach(c => {
    svg += `<text x="${c.x}" y="122" text-anchor="middle" fill="${c.color}" font-size="13" font-weight="800">${c.title}</text>`;
    c.items.forEach((it, i) => {
      const y = 132 + i * 38;
      svg += `<rect x="${c.x - 82}" y="${y}" width="164" height="30" rx="10"
        fill="rgba(255,255,255,.05)" stroke="${c.color}" stroke-opacity=".35"/>
        <text x="${c.x}" y="${y + 20}" text-anchor="middle" fill="#dfe5f7" font-size="12.5" font-weight="650">${esc(it)}</text>`;
    });
  });

  // 汇聚层
  bottoms.forEach((b, i) => {
    const yy = 356 + i * 38;
    svg += `<rect x="${450 - 130}" y="${yy}" width="260" height="30" rx="10"
      fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.22)"/>
      <text x="450" y="${yy + 20}" text-anchor="middle" fill="#e8edfb" font-size="12.5" font-weight="700">${esc(b)}</text>`;
  });
  svg += `<path d="M450 386 L450 394" stroke="url(#tg)" stroke-width="1.6" fill="none" opacity=".55"/>`;
  svg += `<path d="M450 424 L450 444" stroke="url(#tg)" stroke-width="1.6" fill="none" opacity=".65"/>`;

  svg += `<rect x="288" y="444" width="324" height="44" rx="22" fill="url(#tg)" opacity=".92"/>
    <text x="450" y="471" text-anchor="middle" fill="#0a0d1a" font-size="15" font-weight="900">${bottomNodeText}</text>`;

  svg += `</svg>`;
  $('#treeSvg').innerHTML = svg;
}

/* ================= 价值分布 ================= */
function renderValue() {
  const top = allDeals.filter(d => d.valueNum > 0)
    .sort((a, b) => b.valueNum - a.valueNum)
    .map(rawD => typeof localizeDeal === 'function' ? localizeDeal(rawD) : rawD);
  const total = top.reduce((s, d) => s + d.valueNum, 0);

  // 环形图
  const R = 110, C = 2 * Math.PI * R;
  let acc = 0;
  const palette = ['#8b7cff', '#4fc3ff', '#38e0c8', '#ffb457', '#ff7ab6', '#c792ea', '#9ccc65', '#5ec8f2', '#ff8a5c'];
  let segs = top.map((d, i) => {
    const frac = d.valueNum / total;
    const seg = `<circle cx="140" cy="140" r="${R}" fill="none" stroke="${palette[i % palette.length]}"
      stroke-width="26" stroke-dasharray="${(frac * C).toFixed(2)} ${C.toFixed(2)}"
      stroke-dashoffset="${(-acc * C).toFixed(2)}" transform="rotate(-90 140 140)"
      style="transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.3,1)"><title>${esc(d.name)} · $${d.valueNum}</title></circle>`;
    acc += frac;
    return seg;
  }).join('');

  $('#donutBox').innerHTML = `
    <svg viewBox="0 0 280 280" width="280" height="280">
      <circle cx="140" cy="140" r="${R}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="26"/>
      ${segs}
    </svg>
    <div class="donut-center">
      <b class="grad">$${Math.round(total).toLocaleString()}</b>
      <span>${typeof t === 'function' ? t('value.donutLabel') : '可折算年价值'}</span>
    </div>`;

  // 条形图
  const max = Math.max(...top.map(d => d.valueNum));
  $('#valueBars').innerHTML = top.map((d, i) => `
    <div class="bar-row">
      <div class="nm" title="${esc(d.name)}">${esc(d.name)}</div>
      <div class="bar-track">
        <div class="bar-fill" data-w="${(d.valueNum / max * 100).toFixed(1)}"
          style="background:linear-gradient(90deg, ${palette[i % palette.length]}, ${palette[(i + 1) % palette.length]})"></div>
      </div>
      <div class="vl">$${d.valueNum}</div>
    </div>`).join('');

  // 触发动画
  setTimeout(() => $$('.bar-fill').forEach(b => b.style.width = b.dataset.w + '%'), 220);
}

/* ================= 提醒 ================= */
function renderWarnings() {
  const warnings = typeof getLocalizedWarnings === 'function' ? getLocalizedWarnings() : WARNINGS;
  $('#warnGrid').innerHTML = warnings.map(w => `
    <div class="warn-card">
      <h4><span>⚠️</span>${esc(w.title)}</h4>
      <p>${esc(w.body)}</p>
    </div>`).join('');
}

/* ================= 数字滚动 ================= */
function animateCounters() {
  $$('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const dur = 1500, t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * e).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ================= 提交表单 ================= */
function initForm() {
  $('#fCategory').innerHTML = CATEGORIES.filter(c => c.id !== 'all')
    .map(c => `<option value="${c.id}">${c.icon} ${typeof t === 'function' ? t('cat.' + c.id) : c.name}</option>`).join('');
  $('#fStatus').innerHTML = Object.entries(STATUS_MAP)
    .map(([k, v]) => `<option value="${k}">${v.emoji} ${typeof t === 'function' ? t('status.' + k) : v.label}</option>`).join('');
  $('#fCn').innerHTML = Object.entries(CN_MAP)
    .map(([k, v]) => `<option value="${k}">${typeof t === 'function' ? t('cn.' + k) : v.label}</option>`).join('');

  renderMine();

  $('#submitForm').onsubmit = async e => {
    e.preventDefault();
    const name = $('#fName').value.trim();
    const vendor = $('#fVendor').value.trim();
    const url = $('#fUrl').value.trim();
    const desc = $('#fDesc').value.trim();

    if (!name || !vendor || !url || !desc) return toast(typeof t === 'function' ? t('toast.reqFields') : '请填写带 * 的必填项');
    if (!/^https?:\/\/.+/i.test(url)) return toast(typeof t === 'function' ? t('toast.invalidUrl') : '官方入口需以 http:// 或 https:// 开头');

    const item = {
      id: 'u_' + Date.now(),
      name, vendor,
      category: $('#fCategory').value,
      value: $('#fValue').value.trim() || '—',
      status: $('#fStatus').value,
      cn: $('#fCn').value,
      deadline: $('#fDeadline').value,
      url, desc,
      contact: $('#fContact').value.trim(),
      createdAt: new Date().toISOString()
    };

    // 尝试提交至服务端审核队列
    let serverOk = false;
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.id) item.id = resData.id;
        serverOk = true;
      }
    } catch (err) {
      console.warn('服务端不可用，降级为本地离线保存:', err);
    }

    const list = loadMine();
    list.unshift(item);
    saveMine(list);
    renderMine();
    if (state.mine) renderCards();

    $('#submitForm').reset();
    $('#formOk').classList.add('show');
    setTimeout(() => $('#formOk').classList.remove('show'), 3600);
    toast(serverOk ? (typeof t === 'function' ? t('toast.submitOk') : '提交成功！已进入管理员审核队列 🎉') : (typeof t === 'function' ? t('toast.submitOffline') : '已保存在本地浏览器（当前处于离线模式）'));
  };

  $('#btnReset').onclick = () => { $('#submitForm').reset(); toast(typeof t === 'function' ? t('toast.formReset') : '表单已清空'); };
  $('#btnClear').onclick = () => {
    if (!loadMine().length) return toast(typeof t === 'function' ? t('toast.mineEmpty') : '列表已经是空的');
    const confirmMsg = typeof t === 'function' ? t('toast.clearConfirm') : '确定清空全部已提交的福利？此操作不可恢复。';
    if (!confirm(confirmMsg)) return;
    saveMine([]); renderMine(); toast(typeof t === 'function' ? t('toast.cleared') : '已清空');
  };
  $('#btnExport').onclick = () => {
    const list = loadMine();
    if (!list.length) return toast(typeof t === 'function' ? t('toast.exportEmpty') : '暂无可导出的内容');
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ai-student-deals-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast(typeof t === 'function' ? t('toast.exportOk') : '已导出 JSON');
  };
}

const loadMine = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };

/* 把用户提交的条目映射成卡片结构，使其可参与筛选 / 搜索 / 详情 */
function mineAsDeals() {
  const isEn = typeof getCurrentLang === 'function' && getCurrentLang() === 'en';
  return loadMine().map(m => {
    const num = parseFloat(String(m.value || '').replace(/[^0-9.]/g, '')) || 0;
    return {
      id: m.id, isMine: true, cnNative: m.cn === 'ok',
      name: m.name, vendor: m.vendor || (isEn ? 'User Submitted' : '用户提交'),
      letter: (m.vendor || m.name || 'ME').slice(0, 2).toUpperCase(),
      brand: ['#ff7ab6', '#8b7cff'],
      category: m.category || 'ai',
      tier: 'A',
      status: m.status || 'conditional',
      value: m.value || '—', valueNum: num,
      duration: isEn ? 'User Submission · Pending' : '用户提交 · 待核实',
      deadline: m.deadline || '',
      cn: m.cn || 'partial',
      difficulty: 3,
      tags: [],
      summary: m.desc || '',
      highlights: m.desc ? [m.desc] : [],
      notes: m.contact ? (isEn ? `Submitter Contact: ${m.contact} (Private)` : `提交者联系方式：${m.contact}（未公开）`) : (isEn ? 'Submitted by you; unverified, please check official portal.' : '由你提交的条目，尚未核实，请以官方页面为准。'),
      need: { edu: true, sheerid: false, card: false, vpn: false },
      url: safeUrl(m.url)
    };
  });
}
const saveMine = l => {
  localStorage.setItem(LS_KEY, JSON.stringify(l));
  const n = l.length;
  const noteEl = $('.form-note');
  if (noteEl && typeof t === 'function') {
    noteEl.innerHTML = t('form.mineCount', { n });
  } else if ($('#mineCount')) {
    $('#mineCount').textContent = n;
  }
  $('#mineCount2').textContent = n ? `(${n})` : '';
  const tgl = $('#mineToggle');
  if (tgl) {
    const toggleLabel = typeof t === 'function' ? t('filter.mineToggle') : '✎ 计入我的提交';
    tgl.textContent = `${toggleLabel}${n ? ` (${n})` : ''}`;
    tgl.disabled = n === 0;
    if (n === 0) { tgl.classList.remove('mine-on'); state.mine = false; }
  }
};

function renderMine() {
  const list = loadMine();
  saveMine(list);
  const cnl = CN_MAP, stl = STATUS_MAP;
  const pendingText = typeof t === 'function' ? t('card.pending') : '待核实';
  const emptyText = typeof t === 'function' ? t('form.emptyMine') : '还没有提交记录。发现新的 AI 学生福利？用上方表单提交一条吧。';
  const valWord = typeof t === 'function' ? t('card.value') : '价值';
  const dueWord = typeof t === 'function' ? t('card.deadline') : '截止';
  const openWord = typeof t === 'function' ? t('card.btnApply') : '打开入口 ↗';
  const delWord = typeof getCurrentLang === 'function' && getCurrentLang() === 'en' ? 'Delete' : '删除';

  $('#mineList').innerHTML = list.length ? list.map(m => {
    const c = catOf(m.category);
    const catName = typeof t === 'function' ? t('cat.' + m.category) : c.name;
    const s = stl[m.status] || stl.conditional;
    const stLabel = typeof t === 'function' ? t('status.' + m.status) : s.label;
    const cn = cnl[m.cn] || cnl.partial;
    const cnLabel = typeof t === 'function' ? t('cn.' + m.cn) : cn.label;
    const left = daysLeft(m.deadline);
    const locDate = new Date(m.createdAt).toLocaleString(typeof getCurrentLang === 'function' && getCurrentLang() === 'en' ? 'en-US' : 'zh-CN');
    const leftText = left !== null ? (typeof t === 'function' ? `（${t('card.leftDays', { n: left })}）` : `（剩 ${left} 天）`) : '';

    return `
    <div class="mine-item">
      <div class="mi-b">${esc((m.vendor || m.name).slice(0, 2).toUpperCase())}</div>
      <div class="mi-c">
        <div class="mi-t">
          ${esc(m.name)}
          <span class="pending">${pendingText}</span>
          <span class="tag" style="font-size:10.5px">${c.icon} ${catName}</span>
          <span class="tag" style="font-size:10.5px;color:${cn.color};border-color:${cn.color}44">${cnLabel}</span>
        </div>
        <div class="mi-m">
          ${esc(m.vendor)} · ${valWord} ${esc(m.value)} · ${s.emoji} ${stLabel}
          ${m.deadline ? ` · ${dueWord} ${esc(m.deadline)}${leftText}` : ''}
          · ${locDate}
        </div>
        <div class="mi-d">${esc(m.desc)}</div>
        <div style="margin-top:9px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <a class="btn-mini" href="${esc(safeUrl(m.url))}" target="_blank" rel="noopener" style="text-decoration:none">${openWord}</a>
          <button class="btn-mini danger" data-del="${m.id}">${delWord}</button>
        </div>
      </div>
    </div>`;
  }).join('') : `<div class="empty">${emptyText}</div>`;

  $$('#mineList [data-del]').forEach(b => b.onclick = () => {
    saveMine(loadMine().filter(x => x.id !== b.dataset.del));
    renderMine();
    toast(typeof getCurrentLang === 'function' && getCurrentLang() === 'en' ? 'Deleted' : '已删除');
  });
}

/* ================= 交互绑定 ================= */
function initEvents() {
  let t;
  $('#searchInput').oninput = e => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value; renderCards(); }, 180);
  };
  $('#tierSel').onchange = e => { state.tier = e.target.value; renderCards(); };
  $('#cnSel').onchange   = e => { state.cn  = e.target.value; renderCards(); };
  $('#sortSel').onchange = e => { state.sort = e.target.value; renderCards(); };

  $('#mineToggle').onclick = () => {
    state.mine = !state.mine;
    $('#mineToggle').classList.toggle('mine-on', state.mine);
    renderCards();
    toast(state.mine ? (typeof t === 'function' ? t('toast.mineIncluded') : '已把我提交的福利计入列表') : (typeof t === 'function' ? t('toast.mineExcluded') : '已隐藏我提交的福利'));
  };
  $('#btnResetFilter').onclick = () => {
    Object.assign(state, { cat: 'all', tier: 'all', cn: 'all', sort: 'tier', q: '' });
    $('#searchInput').value = '';
    $('#tierSel').value = 'all';
    $('#cnSel').value = 'all';
    $('#sortSel').value = 'tier';
    renderChips();
    renderCards();
    toast(typeof t === 'function' ? t('toast.filterReset') : '筛选条件已重置');
  };

  $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  $('#toTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  window.addEventListener('scroll', () => {
    $('#toTop').classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  // 同步导航高度，保证筛选栏 sticky 不被遮挡
  const syncNavH = () => {
    const h = document.querySelector('.nav')?.offsetHeight || 76;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
  };
  syncNavH();
  window.addEventListener('resize', syncNavH);

  // 语言切换按钮
  const langBtn = $('#langToggle');
  if (langBtn) {
    langBtn.onclick = () => {
      if (typeof toggleLang === 'function') toggleLang();
    };
  }

  // 监听多语言变更并联动重绘所有动态组件
  window.addEventListener('langchange', () => {
    renderChips();
    renderCards();
    renderRoadmap();
    renderValue();
    renderWarnings();
    renderCountdowns();
    initForm();
    saveMine(loadMine());
  });

  // 滚动入场
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ================= 启动 ================= */
async function syncRemoteDeals() {
  try {
    const res = await fetch('/api/deals');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allDeals = data;
        renderCountdowns();
        renderChips();
        renderCards();
        renderRoadmap();
        renderValue();
        renderWarnings();
        animateCounters();
        console.log(`[API] 成功从服务端同步 ${data.length} 条已审核福利`);
      }
    }
  } catch (err) {
    console.info('[API] 处于静态或离线模式，已使用本地预置福利数据');
  }
}

function boot() {
  if (typeof setLang === 'function' && typeof getCurrentLang === 'function') {
    setLang(getCurrentLang());
  }
  $('#metaUpdated').textContent = SITE_META.updatedAt;
  $('#footDate').textContent = SITE_META.updatedAt;
  renderCountdowns();
  renderChips();
  renderCards();
  renderRoadmap();
  renderValue();
  renderWarnings();
  initForm();
  initEvents();
  animateCounters();
  syncRemoteDeals();
}

document.addEventListener('DOMContentLoaded', boot);
