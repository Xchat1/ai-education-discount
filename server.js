/**
 * AI 学生折扣站 - 全功能单文件服务端 (支持 Docker / 本地 Node.js 运行)
 * 特性：
 * - 0 外部 NPM 依赖，基于 Node 22+ 原生模块 (node:http, node:sqlite, node:fs, node:crypto)
 * - 自动初始化 SQLite 数据库并导入 40+ 条初始 AI 福利数据
 * - 提供完整的公开 API (/api/deals, /api/submit)
 * - 提供管理审核 API (/api/admin/login, /api/admin/deals, /api/admin/review)
 * - 静态页面代理 (index.html, admin.html, assets/*)
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

// 配置
const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || 'admin123456').trim();
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'deals.db');
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// 保证数据目录存在
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 初始化数据库
const db = new DatabaseSync(DB_PATH);
initDatabase();

function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    const countRow = db.prepare("SELECT COUNT(*) as count FROM deals").get();
    console.log(`[DB] 数据库已就绪，当前共计 ${countRow ? countRow.count : 0} 条福利数据`);
  } else {
    console.warn('[DB] 未发现 schema.sql，数据库需手动初始化');
  }
}

// 辅助：解析 JSON 字段
function safeParseJson(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// 辅助：映射 Deals 数据结构至前端统一格式
function formatDeal(row) {
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

// Token 签名与验证（兼容内存会话与无状态 Base64 格式）
const activeSessions = new Set();
function createAdminToken() {
  const token = Buffer.from(ADMIN_PASSWORD + ':' + Date.now() + ':' + Math.random()).toString('base64');
  activeSessions.add(token);
  return token;
}

function verifyAdminToken(req) {
  const auth = req.headers['authorization'] || '';
  let token = '';
  if (auth.startsWith('Bearer ')) {
    token = auth.slice(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = req.headers['x-admin-token'];
  }
  if (!token) return false;
  if (activeSessions.has(token)) return true;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [pass] = decoded.split(':');
    return pass === ADMIN_PASSWORD;
  } catch {
    return token === ADMIN_PASSWORD;
  }
}

// 辅助：读取请求体 JSON
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) { // 限制 1MB
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// 辅助：发送 JSON 响应
function sendJson(res, statusCode, data, headers = {}) {
  const jsonStr = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    ...headers
  });
  res.end(jsonStr);
}

// 静态资源 MIME 类型
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

// 静态文件处理器
function serveStatic(req, res, pathname) {
  let filePath = pathname === '/' ? '/index.html' : pathname;
  if (filePath === '/admin') filePath = '/admin.html';

  const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
  const target = path.join(__dirname, safePath);

  if (!target.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(target, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(target).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });
    fs.createReadStream(target).pipe(res);
  });
}

// 创建 HTTP 服务
const server = http.createServer(async (req, res) => {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  try {
    /* ----------------------------------------------------
     * 1. 公开 API: 获取所有已审核上线的福利
     * ---------------------------------------------------- */
    if (pathname === '/api/deals' && req.method === 'GET') {
      const rows = db.prepare(`
        SELECT * FROM deals 
        WHERE review_status = 'approved' 
        ORDER BY 
          CASE tier WHEN 'S' THEN 1 WHEN 'A' THEN 2 WHEN 'B' THEN 3 ELSE 4 END, 
          value_num DESC, 
          created_at DESC
      `).all();

      const deals = rows.map(formatDeal);
      return sendJson(res, 200, deals, {
        'Cache-Control': 'public, max-age=60, s-maxage=300'
      });
    }

    /* ----------------------------------------------------
     * 2. 公开 API: 用户提交新福利 (默认 review_status = 'pending')
     * ---------------------------------------------------- */
    if (pathname === '/api/submit' && req.method === 'POST') {
      const data = await parseRequestBody(req);
      const name = (data.name || '').trim();
      const vendor = (data.vendor || '').trim();
      const url = (data.url || '').trim();
      const desc = (data.desc || '').trim();

      if (!name || !vendor || !url || !desc) {
        return sendJson(res, 400, { error: '必填字段不能为空（平台名称、厂商、入口链接、权益说明）' });
      }

      if (!/^https?:\/\/.+/i.test(url)) {
        return sendJson(res, 400, { error: '官方入口需以 http:// 或 https:// 开头' });
      }

      const id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
      const brand = JSON.stringify(['#ff7ab6', '#8b7cff']);
      const tags = JSON.stringify(data.tags || []);
      const highlights = JSON.stringify(desc ? [desc] : []);
      const need = JSON.stringify({ edu: true, sheerid: false, card: false, vpn: false });

      db.prepare(`
        INSERT INTO deals (
          id, name, vendor, letter, brand, category, tier, status, review_status,
          value, value_num, duration, deadline, cn, difficulty, tags, summary,
          highlights, notes, need, url, contact, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `).run(
        id,
        name,
        vendor,
        (vendor || name).slice(0, 2).toUpperCase(),
        brand,
        data.category || 'ai',
        'A',
        data.status || 'conditional',
        'pending', // 审核状态：待审核
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
      );

      return sendJson(res, 201, {
        success: true,
        message: '提交成功！已进入管理员审核队列，审核通过后将正式同步至全站。',
        id
      });
    }

    /* ----------------------------------------------------
     * 3. 管理员登录 API: /api/admin/login
     * ---------------------------------------------------- */
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const data = await parseRequestBody(req);
      if (String(data.password || '').trim() === ADMIN_PASSWORD) {
        const token = createAdminToken();
        return sendJson(res, 200, {
          success: true,
          message: '登录成功',
          token
        });
      } else {
        return sendJson(res, 401, { error: '管理员密码错误' });
      }
    }

    /* ----------------------------------------------------
     * 4. 管理员 API: 获取提交列表与统计数据
     * ---------------------------------------------------- */
    if (pathname === '/api/admin/deals' && req.method === 'GET') {
      if (!verifyAdminToken(req)) {
        return sendJson(res, 401, { error: '未授权，请先登录' });
      }

      const statusFilter = parsedUrl.searchParams.get('status') || 'all';
      const query = (parsedUrl.searchParams.get('q') || '').trim().toLowerCase();

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

      const rows = db.prepare(sql).all(...params);

      // 统计计数
      const pendingCount = db.prepare("SELECT COUNT(*) as c FROM deals WHERE review_status = 'pending'").get().c;
      const approvedCount = db.prepare("SELECT COUNT(*) as c FROM deals WHERE review_status = 'approved'").get().c;
      const rejectedCount = db.prepare("SELECT COUNT(*) as c FROM deals WHERE review_status = 'rejected'").get().c;
      const totalCount = db.prepare("SELECT COUNT(*) as c FROM deals").get().c;

      return sendJson(res, 200, {
        deals: rows.map(formatDeal),
        counts: {
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          total: totalCount
        }
      });
    }

    /* ----------------------------------------------------
     * 5. 管理员审核操作 API: /api/admin/review
     * ---------------------------------------------------- */
    if (pathname === '/api/admin/review' && req.method === 'POST') {
      if (!verifyAdminToken(req)) {
        return sendJson(res, 401, { error: '未授权，请先登录' });
      }

      const { id, action, data } = await parseRequestBody(req);

      if (!id && action !== 'create') {
        return sendJson(res, 400, { error: '缺少条目 ID' });
      }

      switch (action) {
        case 'approve': {
          // 审核通过并上线（可同时更新字段）
          if (data && typeof data === 'object') {
            const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
            db.prepare(`
              UPDATE deals SET
                name = COALESCE(?, name),
                vendor = COALESCE(?, vendor),
                category = COALESCE(?, category),
                tier = COALESCE(?, tier),
                status = COALESCE(?, status),
                value = COALESCE(?, value),
                value_num = ?,
                duration = COALESCE(?, duration),
                deadline = COALESCE(?, deadline),
                cn = COALESCE(?, cn),
                url = COALESCE(?, url),
                summary = COALESCE(?, summary),
                review_status = 'approved',
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).run(
              data.name, data.vendor, data.category, data.tier, data.status,
              data.value, valNum, data.duration, data.deadline, data.cn,
              data.url, data.summary || data.desc, id
            );
          } else {
            db.prepare("UPDATE deals SET review_status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
          }
          return sendJson(res, 200, { success: true, message: '已审核通过并上线！' });
        }

        case 'reject': {
          // 审核驳回
          db.prepare("UPDATE deals SET review_status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
          return sendJson(res, 200, { success: true, message: '条目已标记为驳回' });
        }

        case 'unpublish': {
          // 下线转回待审核
          db.prepare("UPDATE deals SET review_status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
          return sendJson(res, 200, { success: true, message: '条目已下线并转入待审' });
        }

        case 'delete': {
          // 彻底删除
          db.prepare("DELETE FROM deals WHERE id = ?").run(id);
          return sendJson(res, 200, { success: true, message: '条目已删除' });
        }

        case 'update': {
          // 管理员直接编辑更新
          if (!data) return sendJson(res, 400, { error: '缺少更新数据' });
          const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
          db.prepare(`
            UPDATE deals SET
              name = ?, vendor = ?, category = ?, tier = ?, status = ?,
              value = ?, value_num = ?, duration = ?, deadline = ?, cn = ?,
              url = ?, summary = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(
            data.name, data.vendor, data.category, data.tier || 'A', data.status || 'conditional',
            data.value || '—', valNum, data.duration || '', data.deadline || '', data.cn || 'partial',
            data.url, data.summary || data.desc || '', data.notes || '', id
          );
          return sendJson(res, 200, { success: true, message: '更新成功' });
        }

        case 'create': {
          // 管理员直接录入新福利
          if (!data || !data.name || !data.vendor || !data.url) {
            return sendJson(res, 400, { error: '必填项不能为空' });
          }
          const newId = data.id || ('d_' + Date.now().toString(36));
          const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
          const brand = JSON.stringify(data.brand || ['#8b7cff', '#38e0c8']);
          const tags = JSON.stringify(data.tags || []);
          const highlights = JSON.stringify(data.highlights || (data.summary ? [data.summary] : []));
          const need = JSON.stringify(data.need || { edu: true, sheerid: false, card: false, vpn: false });

          db.prepare(`
            INSERT INTO deals (
              id, name, vendor, letter, brand, category, tier, status, review_status,
              value, value_num, duration, deadline, cn, difficulty, tags, summary,
              highlights, notes, need, url, contact, created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, 'approved',
              ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, '管理员直录', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
          `).run(
            newId,
            data.name,
            data.vendor,
            (data.vendor || data.name).slice(0, 2).toUpperCase(),
            brand,
            data.category || 'ai',
            data.tier || 'A',
            data.status || 'hot',
            data.value || '—',
            valNum,
            data.duration || '学生期内有效',
            data.deadline || '',
            data.cn || 'partial',
            Number(data.difficulty) || 3,
            tags,
            data.summary || '',
            highlights,
            data.notes || '',
            need,
            data.url
          );
          return sendJson(res, 201, { success: true, message: '新增福利已成功发布上线！', id: newId });
        }

        default:
          return sendJson(res, 400, { error: `未知操作: ${action}` });
      }
    }

    /* ----------------------------------------------------
     * 6. 静态网页托管
     * ---------------------------------------------------- */
    serveStatic(req, res, pathname);

  } catch (err) {
    console.error('[Server Error]', err);
    sendJson(res, 500, { error: '服务器内部错误: ' + err.message });
  }
});

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🎓 AI 学生折扣站服务已启动: http://localhost:${PORT}`);
  console.log(`⚙️  管理审核后台直达: http://localhost:${PORT}/admin`);
  console.log(`🔑 默认管理员密码: ${ADMIN_PASSWORD}`);
  console.log(`=================================================`);
});

// 优雅退出
process.on('SIGINT', () => { db.close(); process.exit(0); });
process.on('SIGTERM', () => { db.close(); process.exit(0); });
