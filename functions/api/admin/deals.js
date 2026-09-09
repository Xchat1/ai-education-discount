import { jsonResponse, handleOptions, formatDeal, verifyAdminAuth } from '../../_utils.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!verifyAdminAuth(request, env)) {
    return jsonResponse({ error: '未授权，请先登录' }, 401);
  }

  if (!env.DB) {
    return jsonResponse({ error: "Cloudflare D1 数据库 'DB' 未绑定" }, 500);
  }

  try {
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status') || 'all';
    const query = (url.searchParams.get('q') || '').trim().toLowerCase();

    let sql = `SELECT * FROM deals`;
    const conditions = [];
    const params = [];

    if (statusFilter !== 'all') {
      conditions.push(`review_status = ?`);
      params.push(statusFilter);
    }

    if (query) {
      conditions.push(`(LOWER(name) LIKE ? OR LOWER(vendor) LIKE ? OR LOWER(summary) LIKE ?)`);
      const wildcard = `%${query}%`;
      params.push(wildcard, wildcard, wildcard);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }
    sql += ` ORDER BY created_at DESC`;

    const stmt = params.length > 0 ? env.DB.prepare(sql).bind(...params) : env.DB.prepare(sql);
    const { results } = await stmt.all();

    // 统计计数
    const pendingRow = await env.DB.prepare("SELECT COUNT(*) as c FROM deals WHERE review_status = 'pending'").first();
    const approvedRow = await env.DB.prepare("SELECT COUNT(*) as c FROM deals WHERE review_status = 'approved'").first();
    const rejectedRow = await env.DB.prepare("SELECT COUNT(*) as c FROM deals WHERE review_status = 'rejected'").first();
    const totalRow = await env.DB.prepare("SELECT COUNT(*) as c FROM deals").first();

    return jsonResponse({
      deals: results.map(formatDeal),
      counts: {
        pending: pendingRow ? pendingRow.c : 0,
        approved: approvedRow ? approvedRow.c : 0,
        rejected: rejectedRow ? rejectedRow.c : 0,
        total: totalRow ? totalRow.c : 0
      }
    });
  } catch (err) {
    return jsonResponse({ error: '获取后台列表失败: ' + err.message }, 500);
  }
}
