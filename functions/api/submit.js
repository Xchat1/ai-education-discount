import { jsonResponse, handleOptions } from '../_utils.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return jsonResponse({ error: "Cloudflare D1 数据库 'DB' 未绑定" }, 500);
  }

  try {
    const data = await request.json();
    const name = (data.name || '').trim();
    const vendor = (data.vendor || '').trim();
    const url = (data.url || '').trim();
    const desc = (data.desc || '').trim();

    if (!name || !vendor || !url || !desc) {
      return jsonResponse({ error: '必填字段不能为空（平台名称、厂商、入口链接、权益说明）' }, 400);
    }

    if (!/^https?:\/\/.+/i.test(url)) {
      return jsonResponse({ error: '官方入口需以 http:// 或 https:// 开头' }, 400);
    }

    const id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
    const brand = JSON.stringify(['#ff7ab6', '#8b7cff']);
    const tags = JSON.stringify(data.tags || []);
    const highlights = JSON.stringify(desc ? [desc] : []);
    const need = JSON.stringify({ edu: true, sheerid: false, card: false, vpn: false });

    await env.DB.prepare(`
      INSERT INTO deals (
        id, name, vendor, letter, brand, category, tier, status, review_status,
        value, value_num, duration, deadline, cn, difficulty, tags, summary,
        highlights, notes, need, url, contact, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `).bind(
      id,
      name,
      vendor,
      (vendor || name).slice(0, 2).toUpperCase(),
      brand,
      data.category || 'ai',
      'A',
      data.status || 'conditional',
      'pending', // 初始审核状态为待审核
      data.value || '—',
      valNum,
      '用户提交 · 待核实',
      data.deadline || '',
      data.cn || 'partial',
      3,
      tags,
      desc,
      highlights,
      data.contact ? `提交者联系方式：${data.contact}（未公开）` : '由用户提交，尚未核实。',
      need,
      url,
      data.contact || ''
    ).run();

    return jsonResponse({
      success: true,
      message: '提交成功！已进入管理员审核队列，审核通过后将正式同步至全站。',
      id
    }, 201);
  } catch (err) {
    return jsonResponse({ error: '提交处理失败: ' + err.message }, 500);
  }
}
