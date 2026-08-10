/**
 * 公共工具：URL 参数解析、轻量 toast、HTML 转义
 */

window.Common = (function () {
  function qs(name) {
    const m = location.search.match(new RegExp('[?&]' + name + '=([^&#]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setQs(name, val) {
    const u = new URL(location.href);
    u.searchParams.set(name, val);
    history.replaceState(null, '', u.toString());
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toast(msg, type = 'info') {
    let layer = document.getElementById('toast-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'toast-layer';
      layer.style.cssText = 'position:fixed;top:24px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:9999;pointer-events:none;';
      document.body.appendChild(layer);
    }
    const t = document.createElement('div');
    const colorMap = {
      info: 'rgba(60,60,60,.92)',
      success: 'rgba(34,139,34,.92)',
      warning: 'rgba(204,140,0,.92)',
      error: 'rgba(200,40,40,.92)'
    };
    t.style.cssText = `background:${colorMap[type]};color:#fff;padding:10px 16px;border-radius:24px;font-size:14px;max-width:80vw;box-shadow:0 6px 20px rgba(0,0,0,.18);animation:slideIn .25s ease;`;
    t.textContent = msg;
    layer.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transition = 'opacity .3s';
      setTimeout(() => t.remove(), 300);
    }, 2200);
  }

  function formatDateTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = n => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function requireTeacherSession() {
    const s = Storage.getTeacherSession();
    if (!s) {
      location.href = 'teacher.html';
      return null;
    }
    return s;
  }

  // 注入全局样式（仅一次）
  let styleInjected = false;
  function injectGlobalStyle() {
    if (styleInjected) return;
    styleInjected = true;
    const s = document.createElement('style');
    s.textContent = `
      @keyframes slideIn { from { transform: translateY(-8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      .pill { display:inline-block;padding:2px 10px;border-radius:14px;font-size:12px; }
      .pill.right { background:#e6f7ec;color:#0a7a3b; }
      .pill.wrong { background:#fdecec;color:#a4262c; }
      .pill.blank { background:#f1f1f1;color:#666; }
      .pill.warn { background:#fff4e5;color:#a85b00; }
      .btn-primary { background:#07c160;color:#fff;border:none;border-radius:6px;padding:12px 18px;font-size:15px;cursor:pointer; }
      .btn-primary:disabled { background:#9bd9b1;cursor:not-allowed; }
      .btn-secondary { background:#f4f5f6;color:#333;border:1px solid #e5e6e8;border-radius:6px;padding:12px 18px;font-size:15px;cursor:pointer; }
      .btn-link { background:transparent;border:none;color:#576b95;cursor:pointer;font-size:14px;padding:8px 12px; }
      .field { width:100%;padding:10px 12px;border:1px solid #dcdfe6;border-radius:6px;font-size:15px;box-sizing:border-box; }
    `;
    document.head.appendChild(s);
  }

  return { qs, setQs, escapeHtml, toast, formatDateTime, requireTeacherSession, injectGlobalStyle };
})();
