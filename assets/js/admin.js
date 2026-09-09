/**
 * AI 学生折扣站 · 管理审核后台逻辑
 */

const TOKEN_KEY = 'ai_deals_admin_token';
let currentTab = 'pending';
let allLoadedDeals = [];

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setAdminToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function esc(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function apiRequest(url, options = {}) {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Admin-Token'] = token;
  }

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    // 认证失败，显示登录遮罩
    setAdminToken('');
    showLogin(true);
    throw new Error('请先登录管理员账号');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '请求失败');
  }
  return data;
}

function showLogin(show) {
  const overlay = $('#loginOverlay');
  if (overlay) {
    overlay.style.display = show ? 'flex' : 'none';
    if (show) {
      setTimeout(() => $('#loginPassword')?.focus(), 100);
    }
  }
}

// 初始化分类与状态下拉框
function initSelectOptions() {
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  $('#mCategory').innerHTML = cats.map(c => {
    const name = typeof t === 'function' ? t('cat.' + c.id) : c.name;
    return `<option value="${c.id}">${c.icon} ${name}</option>`;
  }).join('');
  
  const allCatsText = typeof t === 'function' ? t('admin.allCats') : '全部类别';
  $('#catFilter').innerHTML = `<option value="all">${allCatsText}</option>` + 
    cats.map(c => {
      const name = typeof t === 'function' ? t('cat.' + c.id) : c.name;
      return `<option value="${c.id}">${c.icon} ${name}</option>`;
    }).join('');

  $('#mStatus').innerHTML = Object.entries(STATUS_MAP)
    .map(([k, v]) => {
      const lbl = typeof t === 'function' ? t('status.' + k) : v.label;
      return `<option value="${k}">${v.emoji} ${lbl}</option>`;
    }).join('');

  $('#mCn').innerHTML = Object.entries(CN_MAP)
    .map(([k, v]) => {
      const lbl = typeof t === 'function' ? t('cn.' + k) : v.label;
      return `<option value="${k}">${lbl}</option>`;
    }).join('');
}

// 加载审核列表数据
async function loadDeals() {
  const listEl = $('#auditList');
  listEl.innerHTML = '<div class="empty" style="padding:60px">正在加载审核数据…</div>';

  try {
    const q = encodeURIComponent($('#searchKeyword').value.trim());
    const data = await apiRequest(`/api/admin/deals?status=${currentTab}&q=${q}`);
    allLoadedDeals = data.deals || [];

    // 更新 KPI 与 Tab 徽章数字
    updateCounts(data.counts || {});

    // 根据分类二次过滤（如果有选择）
    const cat = $('#catFilter').value;
    let filtered = allLoadedDeals;
    if (cat !== 'all') {
      filtered = filtered.filter(d => d.category === cat);
    }

    renderList(filtered);
  } catch (err) {
    listEl.innerHTML = `<div class="empty" style="color:var(--danger)">加载失败：${esc(err.message)}</div>`;
  }
}

function updateCounts(counts) {
  const p = counts.pending || 0;
  const a = counts.approved || 0;
  const r = counts.rejected || 0;
  const t = counts.total || 0;

  $('#kpiPending').textContent = p;
  $('#kpiApproved').textContent = a;
  $('#kpiRejected').textContent = r;
  $('#kpiTotal').textContent = t;

  $('#tabCountPending').textContent = p;
  $('#tabCountApproved').textContent = a;
  $('#tabCountRejected').textContent = r;
  $('#tabCountAll').textContent = t;
}

// 渲染条目列表
function renderList(deals) {
  const listEl = $('#auditList');
  if (!deals.length) {
    const emptyMsg = typeof t === 'function' ? t('admin.emptyList') : '当前没有符合条件的条目记录。';
    listEl.innerHTML = `<div class="empty" style="padding:60px">${emptyMsg}</div>`;
    return;
  }

  const catMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
  const statusMap = STATUS_MAP;
  const cnMap = CN_MAP;
  const isEn = typeof getCurrentLang === 'function' && getCurrentLang() === 'en';

  listEl.innerHTML = deals.map(rawD => {
    const d = typeof localizeDeal === 'function' ? localizeDeal(rawD) : rawD;
    const c = catMap[d.category] || { icon: '✦', name: d.category };
    const catName = typeof t === 'function' ? t('cat.' + d.category) : c.name;
    const s = statusMap[d.status] || { emoji: '🟡', label: '待核实' };
    const stLabel = typeof t === 'function' ? t('status.' + d.status) : s.label;
    const cn = cnMap[d.cn] || { label: '有条件' };
    const cnLabel = typeof t === 'function' ? t('cn.' + d.cn) : cn.label;
    const reviewStatus = d.reviewStatus || 'pending';

    let statusBadge = '';
    if (reviewStatus === 'pending') {
      const pTxt = typeof t === 'function' ? t('admin.tabPending') : '⏳ 待审核';
      statusBadge = `<span class="tag" style="color:var(--warn);border-color:rgba(255,180,87,.4);background:rgba(255,180,87,.14)">${pTxt}</span>`;
    } else if (reviewStatus === 'approved') {
      const aTxt = typeof t === 'function' ? t('admin.tabApproved') : '🟢 已上线';
      statusBadge = `<span class="tag" style="color:var(--ok);border-color:rgba(61,220,151,.4);background:rgba(61,220,151,.14)">${aTxt}</span>`;
    } else {
      const rTxt = typeof t === 'function' ? t('admin.tabRejected') : '🔴 已驳回';
      statusBadge = `<span class="tag" style="color:var(--danger);border-color:rgba(255,107,129,.4);background:rgba(255,107,129,.14)">${rTxt}</span>`;
    }

    const locDate = new Date(d.createdAt).toLocaleString(isEn ? 'en-US' : 'zh-CN');
    const openPortalTxt = typeof t === 'function' ? t('admin.btnOpenPortal') : '打开官方入口 ↗';
    const approveTxt = typeof t === 'function' ? t('admin.btnApproveOnline') : '✅ 审核通过并上线';
    const unpublishTxt = typeof t === 'function' ? t('admin.btnUnpublish') : '⏸️ 下线转为待审';
    const editTxt = typeof t === 'function' ? (isEn ? '✏️ Edit' : '✏️ 编辑') : '✏️ 编辑';
    const rejectTxt = typeof t === 'function' ? t('admin.btnRejectDeal') : '❌ 驳回';
    const deleteTxt = typeof t === 'function' ? t('admin.btnDeleteForever') : '🗑️ 彻底删除';

    const lblVendor = typeof t === 'function' ? t('admin.metaVendor') : '厂商：';
    const lblVal = typeof t === 'function' ? t('admin.metaValue') : '预估价值：';
    const lblDur = typeof t === 'function' ? t('admin.metaDuration') : '时长：';
    const lblDue = typeof t === 'function' ? t('admin.metaDeadline') : '截止：';
    const lblSt = typeof t === 'function' ? t('admin.metaStatus') : '状态标签：';
    const lblCr = typeof t === 'function' ? t('admin.metaCreated') : '创建时间：';
    const lblDesc = typeof t === 'function' ? t('admin.descTitle') : '权益说明：';
    const lblNotes = typeof t === 'function' ? t('admin.notesTitle') : '审核避坑备注：';
    const lblContact = typeof t === 'function' ? t('admin.contactTitle') : '👤 提交者联系方式：';
    const contactSuffix = typeof t === 'function' ? t('admin.contactSuffix') : '（前台已隐藏）';

    return `
      <div class="audit-card status-${reviewStatus}" data-id="${esc(d.id)}">
        <div class="ac-head">
          <div>
            <div class="ac-title-wrap">
              <span class="ac-title">${esc(d.name)}</span>
              ${statusBadge}
              <span class="tag">${c.icon} ${catName}</span>
              <span class="tag" style="color:var(--brand-1)">Tier ${esc(d.tier || 'A')}</span>
              <span class="tag">${cnLabel}</span>
            </div>
            <div class="ac-meta" style="margin-top:6px">
              <span><b>${lblVendor}</b>${esc(d.vendor)}</span>
              <span><b>${lblVal}</b>${esc(d.value)}</span>
              <span><b>${lblDur}</b>${esc(d.duration || '—')}</span>
              ${d.deadline ? `<span><b>${lblDue}</b>${esc(d.deadline)}</span>` : ''}
              <span><b>${lblSt}</b>${s.emoji} ${stLabel}</span>
              <span><b>${lblCr}</b>${locDate}</span>
            </div>
          </div>
          <div>
            <a href="${esc(d.url)}" target="_blank" rel="noopener" class="btn-action" style="background:rgba(255,255,255,.07);color:var(--txt-1)">${openPortalTxt}</a>
          </div>
        </div>

        <div class="ac-body">
          <b>${lblDesc}</b> ${esc(d.summary || d.desc || (isEn ? '(No description)' : '（无描述）'))}
          ${d.notes ? `<div style="margin-top:6px;color:var(--txt-3);font-size:12.5px"><b>${lblNotes}</b>${esc(d.notes)}</div>` : ''}
        </div>

        ${d.contact ? `<div class="ac-contact">${lblContact}<b>${esc(d.contact)}</b>${contactSuffix}</div>` : ''}

        <div class="ac-foot">
          <div style="font-size:12px;color:var(--txt-3)">${isEn ? 'Item ID: ' : '条目 ID: '}<code>${esc(d.id)}</code></div>
          <div class="ac-btns">
            ${reviewStatus !== 'approved' ? `
              <button class="btn-action btn-approve" data-action="approve" data-id="${esc(d.id)}">${approveTxt}</button>
            ` : `
              <button class="btn-action btn-reject" data-action="unpublish" data-id="${esc(d.id)}">${unpublishTxt}</button>
            `}
            <button class="btn-action btn-edit" data-action="edit" data-id="${esc(d.id)}">${editTxt}</button>
            ${reviewStatus !== 'rejected' ? `
              <button class="btn-action btn-reject" data-action="reject" data-id="${esc(d.id)}">${rejectTxt}</button>
            ` : ''}
            <button class="btn-action btn-del" data-action="delete" data-id="${esc(d.id)}">${deleteTxt}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  bindCardActions();
}

function bindCardActions() {
  $$('#auditList button[data-action]').forEach(btn => {
    btn.onclick = async () => {
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const targetDeal = allLoadedDeals.find(d => d.id === id);

      if (action === 'edit') {
        openModal(targetDeal);
        return;
      }

      if (action === 'delete') {
        if (!confirm(`确定彻底删除【${targetDeal?.name || id}】？删除后不可恢复。`)) return;
      }

      try {
        const res = await apiRequest('/api/admin/review', {
          method: 'POST',
          body: JSON.stringify({ id, action })
        });
        toast(res.message || '操作成功');
        loadDeals();
      } catch (err) {
        alert(err.message);
      }
    };
  });
}

// 模态弹窗表单逻辑
function openModal(deal = null) {
  const isEdit = !!deal;
  $('#modalTitle').textContent = isEdit ? `编辑福利：${deal.name}` : '手动录入新 AI 福利';
  $('#mId').value = isEdit ? deal.id : '';
  $('#mName').value = isEdit ? deal.name : '';
  $('#mVendor').value = isEdit ? deal.vendor : '';
  $('#mCategory').value = isEdit ? deal.category : 'ai';
  $('#mTier').value = isEdit ? (deal.tier || 'A') : 'A';
  $('#mStatus').value = isEdit ? deal.status : 'hot';
  $('#mValue').value = isEdit ? deal.value : '';
  $('#mDuration').value = isEdit ? deal.duration : '学生期内有效';
  $('#mDeadline').value = isEdit ? (deal.deadline || '') : '';
  $('#mCn').value = isEdit ? deal.cn : 'partial';
  $('#mDifficulty').value = isEdit ? (deal.difficulty || 3) : 3;
  $('#mUrl').value = isEdit ? deal.url : '';
  $('#mTags').value = isEdit ? (deal.tags || []).join(', ') : '';
  $('#mSummary').value = isEdit ? (deal.summary || deal.desc || '') : '';
  $('#mHighlights').value = isEdit ? (deal.highlights || []).join('\n') : '';
  $('#mNotes').value = isEdit ? (deal.notes || '') : '';

  $('#btnModalSubmit').textContent = isEdit ? '保存并发布' : '直接录入上线';
  $('#dealModal').classList.add('show');
}

function closeModal() {
  $('#dealModal').classList.remove('show');
  $('#dealForm').reset();
}

function initModalEvents() {
  $('#btnModalClose').onclick = closeModal;
  $('#btnModalCancel').onclick = closeModal;

  $('#dealForm').onsubmit = async e => {
    e.preventDefault();
    const id = $('#mId').value;
    const isEdit = !!id;

    const tags = $('#mTags').value.split(/[,，]/).map(t => t.trim()).filter(Boolean);
    const highlights = $('#mHighlights').value.split('\n').map(h => h.trim()).filter(Boolean);

    const data = {
      name: $('#mName').value.trim(),
      vendor: $('#mVendor').value.trim(),
      category: $('#mCategory').value,
      tier: $('#mTier').value,
      status: $('#mStatus').value,
      value: $('#mValue').value.trim() || '—',
      duration: $('#mDuration').value.trim() || '学生期内有效',
      deadline: $('#mDeadline').value,
      cn: $('#mCn').value,
      difficulty: parseInt($('#mDifficulty').value, 10),
      url: $('#mUrl').value.trim(),
      tags,
      summary: $('#mSummary').value.trim(),
      highlights: highlights.length ? highlights : [$('#mSummary').value.trim()],
      notes: $('#mNotes').value.trim()
    };

    try {
      if (isEdit) {
        // 更新现有条目并设置为已上线
        await apiRequest('/api/admin/review', {
          method: 'POST',
          body: JSON.stringify({ id, action: 'approve', data })
        });
        toast('福利已更新并发布上线！');
      } else {
        // 直接录入新条目
        await apiRequest('/api/admin/review', {
          method: 'POST',
          body: JSON.stringify({ action: 'create', data })
        });
        toast('新福利已成功创建并上线！');
      }
      closeModal();
      loadDeals();
    } catch (err) {
      alert(err.message);
    }
  };

  $('#btnAddNew').onclick = () => openModal(null);
}

// 初始化交互事件
function initEvents() {
  // Tab 切换
  $$('.tab-btn').forEach(b => {
    b.onclick = () => {
      $$('.tab-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentTab = b.dataset.status;

      // 同步高亮 KPI 卡片
      $$('.kpi-card').forEach(k => {
        k.classList.toggle('active', k.dataset.tab === currentTab);
      });

      loadDeals();
    };
  });

  // KPI 卡片点击联动
  $$('.kpi-card').forEach(k => {
    k.onclick = () => {
      const tabName = k.dataset.tab;
      const tabBtn = $(`.tab-btn[data-status="${tabName}"]`);
      if (tabBtn) tabBtn.click();
    };
  });

  // 搜索框防抖
  let timer;
  $('#searchKeyword').oninput = () => {
    clearTimeout(timer);
    timer = setTimeout(loadDeals, 240);
  };

  // 分类筛选变更
  $('#catFilter').onchange = () => {
    loadDeals();
  };

  // 登录表单
  $('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const pwd = $('#loginPassword').value;
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || '登录失败');
      }
      setAdminToken(json.token);
      showLogin(false);
      toast('登录成功');
      loadDeals();
    } catch (err) {
      alert(err.message);
    }
  };

  // 退出登录
  $('#btnLogout').onclick = () => {
    setAdminToken('');
    showLogin(true);
    toast(typeof getCurrentLang === 'function' && getCurrentLang() === 'en' ? 'Logged out' : '已退出登录');
  };

  // 语言切换
  const langBtn = $('#langToggle');
  if (langBtn) {
    langBtn.onclick = () => {
      if (typeof toggleLang === 'function') toggleLang();
    };
  }

  // 监听语言切换事件
  window.addEventListener('langchange', () => {
    initSelectOptions();
    loadDeals();
  });
}

// 启动入口
window.addEventListener('DOMContentLoaded', () => {
  if (typeof setLang === 'function' && typeof getCurrentLang === 'function') {
    setLang(getCurrentLang());
  }
  initSelectOptions();
  initModalEvents();
  initEvents();

  if (!getAdminToken()) {
    showLogin(true);
  } else {
    showLogin(false);
    loadDeals();
  }
});
