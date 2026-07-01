// ============ 公共模块：Supabase + 教师加载 ============
// 消消乐 & 密室逃脱共用，修改一处即可
const DEFAULT_TEACHERS = ['亚飞老师','亚楠老师','佳萌老师'];

// Supabase 客户端（等待 CDN 就绪）
(function initSB() {
  if (window.supabase) {
    window.SB = window.supabase.createClient(
      'https://xwnvsydndaclamzcfrpl.supabase.co',
      'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ'
    );
  } else {
    // CDN 尚未加载，轮询等待
    var retries = 0;
    var check = setInterval(function() {
      retries++;
      if (window.supabase) {
        clearInterval(check);
        window.SB = window.supabase.createClient(
          'https://xwnvsydndaclamzcfrpl.supabase.co',
          'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ'
        );
      } else if (retries > 50) {
        clearInterval(check);
        console.error('Supabase CDN failed to load after 15s');
      }
    }, 300);
  }
})();

// 教师列表
let CACHED_TEACHERS = null;

function sortTeachers(arr) {
  const s = '亚飞老师';
  return [...arr].sort((a, b) => a === s ? -1 : b === s ? 1 : a.localeCompare(b, 'zh'));
}

async function loadTeachers() {
  try {
    // 等待 SB 就绪（最多 8 秒）
    if (!window.SB) { 
      await new Promise(function(resolve) {
        var start = Date.now();
        var check = setInterval(function() {
          if (window.SB || Date.now() - start > 8000) { 
            clearInterval(check); 
            resolve(); 
          }
        }, 200);
      });
    }
    // SB 超时未就绪，直接用默认列表
    if (!window.SB) {
      CACHED_TEACHERS = DEFAULT_TEACHERS;
      return DEFAULT_TEACHERS;
    }
    const { data } = await window.SB.from('teachers').select('name').order('created_at', { ascending: true });
    if (data && data.length > 0) {
      // 按「去除"老师"后缀」去重，保留首次出现的版本
      const seen = new Set();
      const deduped = [];
      for (const r of data) {
        const norm = r.name.replace(/老师$/g, '');
        if (!seen.has(norm)) { seen.add(norm); deduped.push(r.name); }
      }
      CACHED_TEACHERS = sortTeachers(deduped);
      return CACHED_TEACHERS;
    }
    CACHED_TEACHERS = [];
    return [];
  } catch (e) {
    console.error('loadTeachers failed:', e);
    CACHED_TEACHERS = DEFAULT_TEACHERS;
    return DEFAULT_TEACHERS;
  }
}

function getTeachers() {
  return CACHED_TEACHERS || [];
}
