import { jsonResponse, handleOptions } from '../../_utils.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const adminPass = String(env.ADMIN_PASSWORD || 'admin123456').trim();

  try {
    const data = await request.json();
    const inputPass = String(data.password || '').trim();
    if (inputPass === adminPass) {
      // 生成无状态 Token（安全支持各类字符）
      let token;
      try {
        token = btoa(unescape(encodeURIComponent(`${adminPass}:${Date.now()}:${Math.random()}`)));
      } catch {
        token = btoa(`${adminPass}:${Date.now()}:${Math.random()}`);
      }
      return jsonResponse({
        success: true,
        message: '登录成功',
        token
      }, 200);
    } else {
      return jsonResponse({ error: '管理员密码错误' }, 401);
    }
  } catch (err) {
    return jsonResponse({ error: '登录请求解析异常: ' + err.message }, 400);
  }
}
