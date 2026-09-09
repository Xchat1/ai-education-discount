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
    .map(d => ({
      label: d.name,
      date: d.deadline,
      urgent: daysLeft(d.deadline) <= 30,
      start: '2026-09-01'
    }));

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
        <div class="cd-note">${c.urgent
          ? '临期活动：逾期后不再补发，看到就尽快用'
          : '请在截止日期前完成领取'}</div>
      </div>`;
  }).join('');

  // Hero 统计数字与数据层保持自洽
  const nums = $$('.hstat .n');
  const total = allDeals.reduce((s, d) => s + (d.valueNum || 0), 0);
  const deadlines = allDeals.map(d => daysLeft(d.deadline)).filter(x => x !== null);
  if (nums[0]) nums[0].dataset.count = Math.round(total);
  if (nums[1]) nums[1].dataset.count = allDeals.length;
  if (nums[2]) nums[2].dataset.count = CATEGORIES.length - 1;
  if (nums[3]) nums[3].dataset.count = deadlines.length ? Math.min(...deadlines) : daysLeft(SITE_META.hotDeadline.date);
}

/* ================= 分类 Chips ================= */
function renderChips() {
  const counts = {};
  CATEGORIES.forEach(c => counts[c.id] = 0);
  allDeals.forEach(d => { if (counts[d.category] !== undefined) counts[d.category]++; });
  counts.all = allDeals.length;
  counts.china = allDeals.filter(d => d.cnNative).length;

  $('#catChips').innerHTML = CATEGORIES.map(c => `
    <button class="chip ${c.id === state.cat ? 'on' : ''}" data-cat="${c.id}">
      ${c.icon} ${c.name}<span class="cnt">${counts[c.id] || 0}</span>
    </button>`).join('');

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
      const hay = [d.name, d.vendor, d.summary, ...(d.tags || []), ...(d.highlights || [])]
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
  $('#resCount').innerHTML = `匹配 <b>${list.length}</b> / ${src.length} 条`;

  $('#cardGrid').innerHTML = list.map((d, i) => {
    const st = STATUS_MAP[d.status];
    const cn = CN_MAP[d.cn];
    const c = catOf(d.category);
    const left = daysLeft(d.deadline);
    return `
    <article class="card t-${d.tier}" data-id="${d.id}" tabindex="0" role="button"
      aria-label="查看 ${esc(d.name)} 详情" style="animation-delay:${Math.min(i * 26, 420)}ms">
      <div class="card-top">
        <div class="brand-mark" style="background:${gradientOf(d.brand)}">${esc(d.letter)}</div>
        <div class="card-title">
          <h3>${esc(d.name)}</h3>
          <div class="card-vendor">${esc(d.vendor)} · ${c.icon} ${c.name}</div>
        </div>
        <div class="tier-badge tier-${d.tier}" title="${d.tier} 级优先级">${d.tier}</div>
      </div>

      <div class="card-value">
        <span class="v" style="color:${d.valueNum ? 'var(--txt-1)' : 'var(--txt-3)'}">${esc(d.value)}</span>
        <span class="d">${esc(d.duration)}</span>
      </div>

      <p class="card-desc">${esc(d.summary)}</p>

      <div class="tags">
        ${(d.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
        ${d.isMine ? `<span class="tag" style="color:var(--brand-3);border-color:rgba(255,122,182,.4);background:rgba(255,122,182,.14)">✎ 我提交</span>` : ''}
        ${left !== null && left <= 60 ? `<span class="tag hot">⏳ 剩 ${left} 天</span>` : ''}
      </div>

      <div class="card-foot">
        <div>
          <div class="status-dot" style="color:${st.color}">
            <i style="background:${st.color};box-shadow:0 0 8px ${st.color}"></i>${st.label}
          </div>
          <div class="card-meta">
            <span class="cn-badge" style="background:${cn.color}1f;color:${cn.color}">${cn.label}</span>
            <span class="diff" title="申请难度 ${d.difficulty}/5">
              ${[1,2,3,4,5].map(n => `<i class="${n <= d.difficulty ? 'on' : ''}"></i>`).join('')}
            </span>
          </div>
        </div>
        <a class="go-btn" href="${esc(safeUrl(d.url))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
          去申请 →
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
  const d = allDeals.find(x => x.id === id) ||
            (state.mine ? mineAsDeals().find(x => x.id === id) : null);
  if (!d) return;
  const st = STATUS_MAP[d.status], cn = CN_MAP[d.cn], c = catOf(d.category);
  const left = daysLeft(d.deadline);
  const req = [
    ['学校邮箱 / 学生身份', d.need.edu],
    ['SheerID 认证', d.need.sheerid],
    ['国际信用卡', d.need.card],
    ['海外网络环境', d.need.vpn]
  ];

  $('#modalCard').innerHTML = `
    <button class="modal-close" id="mcClose">×</button>
    <div class="modal-head">
      <div class="brand-mark" style="background:${gradientOf(d.brand)}">${esc(d.letter)}</div>
      <div>
        <h3>${esc(d.name)}</h3>
        <div class="mv">${esc(d.vendor)} · ${c.icon} ${c.name} · ${d.tier} 级优先级</div>
      </div>
    </div>

    <div class="modal-metrics">
      <div class="metric"><b style="color:var(--brand-4)">${esc(d.value)}</b><span>预估价值</span></div>
      <div class="metric"><b>${esc(d.duration)}</b><span>权益周期</span></div>
      <div class="metric"><b>${d.deadline ? (left + ' 天') : '长期'}</b><span>${d.deadline ? '剩余时间' : '无截止'}</span></div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <span class="tag" style="color:${st.color};border-color:${st.color}44;background:${st.color}18">${st.emoji} ${st.label}</span>
      <span class="tag" style="color:${cn.color};border-color:${cn.color}44;background:${cn.color}18">中国大陆：${cn.label}</span>
      <span class="tag">申请难度 ${'●'.repeat(d.difficulty)}${'○'.repeat(5 - d.difficulty)}</span>
    </div>

    <div class="modal-h4">包含权益</div>
    <ul class="hl-list">${(d.highlights || []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>

    <div class="modal-h4">申请要求</div>
    <div class="req-grid">
      ${req.map(([n, v]) => `<span class="req-item ${v ? 'yes' : ''}">${v ? '需要 · ' : '不需要 · '}${n}</span>`).join('')}
    </div>

    ${d.notes ? `<div class="note-box"><b>注意：</b>${esc(d.notes)}</div>` : ''}

    <a class="modal-go" href="${esc(safeUrl(d.url))}" target="_blank" rel="noopener">前往官方页面申请 →</a>
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
  $('#roadGrid').innerHTML = ROADMAPS.map(r => `
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
    <text x="450" y="64" text-anchor="middle" fill="#0a0d1a" font-size="15" font-weight="800">🎓 学生身份</text>`;

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
    <text x="450" y="471" text-anchor="middle" fill="#0a0d1a" font-size="15" font-weight="900">🎓 学生 AI 超级工作站</text>`;

  svg += `</svg>`;
  $('#treeSvg').innerHTML = svg;
}

/* ================= 价值分布 ================= */
function renderValue() {
  const top = allDeals.filter(d => d.valueNum > 0).sort((a, b) => b.valueNum - a.valueNum);
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
      <span>可折算年价值</span>
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
  $('#warnGrid').innerHTML = WARNINGS.map(w => `
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
    .map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  $('#fStatus').innerHTML = Object.entries(STATUS_MAP)
    .map(([k, v]) => `<option value="${k}">${v.emoji} ${v.label}</option>`).join('');
  $('#fCn').innerHTML = Object.entries(CN_MAP)
    .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

  renderMine();

  $('#submitForm').onsubmit = e => {
    e.preventDefault();
    const name = $('#fName').value.trim();
    const vendor = $('#fVendor').value.trim();
    const url = $('#fUrl').value.trim();
    const desc = $('#fDesc').value.trim();

    if (!name || !vendor || !url || !desc) return toast('请填写带 * 的必填项');
    if (!/^https?:\/\/.+/i.test(url)) return toast('官方入口需以 http:// 或 https:// 开头');

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

    const list = loadMine();
    list.unshift(item);
    saveMine(list);
    renderMine();
    if (state.mine) renderCards();

    $('#submitForm').reset();
    $('#formOk').classList.add('show');
    setTimeout(() => $('#formOk').classList.remove('show'), 3600);
    toast('提交成功，已加入我的福利列表');
  };

  $('#btnReset').onclick = () => { $('#submitForm').reset(); toast('表单已清空'); };
  $('#btnClear').onclick = () => {
    if (!loadMine().length) return toast('列表已经是空的');
    if (!confirm('确定清空全部已提交的福利？此操作不可恢复。')) return;
    saveMine([]); renderMine(); toast('已清空');
  };
  $('#btnExport').onclick = () => {
    const list = loadMine();
    if (!list.length) return toast('暂无可导出的内容');
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ai-student-deals-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast('已导出 JSON');
  };
}

const loadMine = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };

/* 把用户提交的条目映射成卡片结构，使其可参与筛选 / 搜索 / 详情 */
function mineAsDeals() {
  return loadMine().map(m => {
    const num = parseFloat(String(m.value || '').replace(/[^0-9.]/g, '')) || 0;
    return {
      id: m.id, isMine: true, cnNative: m.cn === 'ok',
      name: m.name, vendor: m.vendor || '用户提交',
      letter: (m.vendor || m.name || 'ME').slice(0, 2).toUpperCase(),
      brand: ['#ff7ab6', '#8b7cff'],
      category: m.category || 'ai',
      tier: 'A',
      status: m.status || 'conditional',
      value: m.value || '—', valueNum: num,
      duration: '用户提交 · 待核实',
      deadline: m.deadline || '',
      cn: m.cn || 'partial',
      difficulty: 3,
      tags: [],
      summary: m.desc || '',
      highlights: m.desc ? [m.desc] : [],
      notes: m.contact ? `提交者联系方式：${m.contact}（未公开）` : '由你提交的条目，尚未核实，请以官方页面为准。',
      need: { edu: true, sheerid: false, card: false, vpn: false },
      url: safeUrl(m.url)
    };
  });
}
const saveMine = l => {
  localStorage.setItem(LS_KEY, JSON.stringify(l));
  const n = l.length;
  $('#mineCount').textContent = n;
  $('#mineCount2').textContent = n ? `(${n})` : '';
  const tgl = $('#mineToggle');
  if (tgl) {
    tgl.textContent = `✎ 计入我的提交${n ? ` (${n})` : ''}`;
    tgl.disabled = n === 0;
    if (n === 0) { tgl.classList.remove('mine-on'); state.mine = false; }
  }
};

function renderMine() {
  const list = loadMine();
  saveMine(list);
  const cnl = CN_MAP, stl = STATUS_MAP;
  $('#mineList').innerHTML = list.length ? list.map(m => {
    const c = catOf(m.category), s = stl[m.status] || stl.conditional, cn = cnl[m.cn] || cnl.partial;
    const left = daysLeft(m.deadline);
    return `
    <div class="mine-item">
      <div class="mi-b">${esc((m.vendor || m.name).slice(0, 2).toUpperCase())}</div>
      <div class="mi-c">
        <div class="mi-t">
          ${esc(m.name)}
          <span class="pending">待核实</span>
          <span class="tag" style="font-size:10.5px">${c.icon} ${c.name}</span>
          <span class="tag" style="font-size:10.5px;color:${cn.color};border-color:${cn.color}44">${cn.label}</span>
        </div>
        <div class="mi-m">
          ${esc(m.vendor)} · 价值 ${esc(m.value)} · ${s.emoji} ${s.label}
          ${m.deadline ? ` · 截止 ${esc(m.deadline)}${left !== null ? `（剩 ${left} 天）` : ''}` : ''}
          · ${new Date(m.createdAt).toLocaleString('zh-CN')}
        </div>
        <div class="mi-d">${esc(m.desc)}</div>
        <div style="margin-top:9px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <a class="btn-mini" href="${esc(safeUrl(m.url))}" target="_blank" rel="noopener" style="text-decoration:none">打开入口 ↗</a>
          <button class="btn-mini danger" data-del="${m.id}">删除</button>
        </div>
      </div>
    </div>`;
  }).join('') : `<div class="empty">还没有提交记录。发现新的 AI 学生福利？用上方表单提交一条吧。</div>`;

  $$('#mineList [data-del]').forEach(b => b.onclick = () => {
    saveMine(loadMine().filter(x => x.id !== b.dataset.del));
    renderMine();
    toast('已删除');
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
    toast(state.mine ? '已把我提交的福利计入列表' : '已隐藏我提交的福利');
  };
  $('#btnResetFilter').onclick = () => {
    Object.assign(state, { cat: 'all', tier: 'all', cn: 'all', sort: 'tier', q: '' });
    $('#searchInput').value = '';
    $('#tierSel').value = 'all';
    $('#cnSel').value = 'all';
    $('#sortSel').value = 'tier';
    renderChips();
    renderCards();
    toast('筛选条件已重置');
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

  // 滚动入场
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ================= 启动 ================= */
function boot() {
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
}

document.addEventListener('DOMContentLoaded', boot);
