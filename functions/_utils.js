// Cloudflare Pages Functions 工具函数

export function jsonResponse(data, status = 200, customHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      ...customHeaders
    }
  });
}

export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token'
    }
  });
}

export function safeParseJson(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function formatDeal(row) {
  return {
    id: row.id,
    name: row.name,
    vendor: row.vendor,
    letter: row.letter || (row.vendor || row.name || 'AI').slice(0, 2).toUpperCase(),
    brand: safeParseJson(row.brand, ['#8b7cff', '#38e0c8']),
    category: row.category,
    tier: row.tier || 'A',
    status: row.status || 'conditional',
    reviewStatus: row.review_status || 'approved',
    value: row.value || '—',
    valueNum: Number(row.value_num) || 0,
    duration: row.duration || '学生期内有效',
    deadline: row.deadline || '',
    cn: row.cn || 'partial',
    cnNative: row.cn === 'ok',
    difficulty: Number(row.difficulty) || 3,
    tags: safeParseJson(row.tags, []),
    summary: row.summary || '',
    highlights: safeParseJson(row.highlights, row.summary ? [row.summary] : []),
    notes: row.notes || '',
    need: safeParseJson(row.need, { edu: true, sheerid: false, card: false, vpn: false }),
    url: row.url,
    contact: row.contact || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function verifyAdminAuth(request, env) {
  const adminPass = String(env.ADMIN_PASSWORD || 'admin123456').trim();
  const auth = request.headers.get('Authorization') || '';
  let token = '';
  if (auth.startsWith('Bearer ')) {
    token = auth.slice(7).trim();
  } else if (request.headers.get('x-admin-token')) {
    token = request.headers.get('x-admin-token').trim();
  }
  if (!token) return false;

  try {
    const decoded = atob(token);
    const [pass] = decoded.split(':');
    return pass === adminPass;
  } catch {
    return token === adminPass;
  }
}
