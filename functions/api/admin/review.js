import { jsonResponse, handleOptions, verifyAdminAuth } from '../../_utils.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!verifyAdminAuth(request, env)) {
    return jsonResponse({ error: '未授权，请先登录' }, 401);
  }

  if (!env.DB) {
    return jsonResponse({ error: "Cloudflare D1 数据库 'DB' 未绑定" }, 500);
  }

  try {
    const { id, action, data } = await request.json();

    if (!id && action !== 'create') {
      return jsonResponse({ error: '缺少条目 ID' }, 400);
    }

    switch (action) {
      case 'approve': {
        // 审核通过并上线
        if (data && typeof data === 'object') {
          const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
          await env.DB.prepare(`
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
          `).bind(
            data.name, data.vendor, data.category, data.tier, data.status,
            data.value, valNum, data.duration, data.deadline, data.cn,
            data.url, data.summary || data.desc, id
          ).run();
        } else {
          await env.DB.prepare("UPDATE deals SET review_status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
        }
        return jsonResponse({ success: true, message: '已审核通过并上线！' });
      }

      case 'reject': {
        // 审核驳回
        await env.DB.prepare("UPDATE deals SET review_status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true, message: '条目已标记为驳回' });
      }

      case 'unpublish': {
        // 下线转回待审核
        await env.DB.prepare("UPDATE deals SET review_status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true, message: '条目已下线并转入待审' });
      }

      case 'delete': {
        // 彻底删除
        await env.DB.prepare("DELETE FROM deals WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true, message: '条目已彻底删除' });
      }

      case 'update': {
        // 管理员直接编辑更新
        if (!data) return jsonResponse({ error: '缺少更新数据' }, 400);
        const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
        await env.DB.prepare(`
          UPDATE deals SET
            name = ?, vendor = ?, category = ?, tier = ?, status = ?,
            value = ?, value_num = ?, duration = ?, deadline = ?, cn = ?,
            url = ?, summary = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(
          data.name, data.vendor, data.category, data.tier || 'A', data.status || 'conditional',
          data.value || '—', valNum, data.duration || '', data.deadline || '', data.cn || 'partial',
          data.url, data.summary || data.desc || '', data.notes || '', id
        ).run();
        return jsonResponse({ success: true, message: '更新成功' });
      }

      case 'create': {
        // 管理员直接录入新福利
        if (!data || !data.name || !data.vendor || !data.url) {
          return jsonResponse({ error: '必填项不能为空' }, 400);
        }
        const newId = data.id || ('d_' + Date.now().toString(36));
        const valNum = parseFloat(String(data.value || '').replace(/[^0-9.]/g, '')) || 0;
        const brand = JSON.stringify(data.brand || ['#8b7cff', '#38e0c8']);
        const tags = JSON.stringify(data.tags || []);
        const highlights = JSON.stringify(data.highlights || (data.summary ? [data.summary] : []));
        const need = JSON.stringify(data.need || { edu: true, sheerid: false, card: false, vpn: false });

        await env.DB.prepare(`
          INSERT INTO deals (
            id, name, vendor, letter, brand, category, tier, status, review_status,
            value, value_num, duration, deadline, cn, difficulty, tags, summary,
            highlights, notes, need, url, contact, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, 'approved',
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, '管理员直录', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `).bind(
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
        ).run();

        return jsonResponse({ success: true, message: '新增福利已成功发布上线！', id: newId }, 201);
      }

      default:
        return jsonResponse({ error: `未知操作: ${action}` }, 400);
    }
  } catch (err) {
    return jsonResponse({ error: '审核操作失败: ' + err.message }, 500);
  }
}
