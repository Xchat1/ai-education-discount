import { jsonResponse, handleOptions, formatDeal } from '../_utils.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) {
    return jsonResponse({ error: "Cloudflare D1 数据库 'DB' 未绑定，请在 Pages 后台绑定 D1" }, 500);
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT * FROM deals 
      WHERE review_status = 'approved' 
      ORDER BY 
        CASE tier WHEN 'S' THEN 1 WHEN 'A' THEN 2 WHEN 'B' THEN 3 ELSE 4 END, 
        value_num DESC, 
        created_at DESC
    `).all();

    const deals = results.map(formatDeal);
    return jsonResponse(deals, 200, {
      'Cache-Control': 'public, max-age=60, s-maxage=300'
    });
  } catch (err) {
    return jsonResponse({ error: '数据库查询失败: ' + err.message }, 500);
  }
}
