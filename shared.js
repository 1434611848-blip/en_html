// ============ 公共模块：Supabase + 教师加载 ============
// 消消乐 & 密室逃脱共用，修改一处即可
const DEFAULT_TEACHERS = ['亚飞老师','亚楠老师','佳萌老师'];

// Supabase 客户端
window.SB = window.supabase.createClient(
  'https://xwnvsydndaclamzcfrpl.supabase.co',
  'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ'
);

// 教师列表
let CACHED_TEACHERS = null;

function sortTeachers(arr) {
  const s = '亚飞老师';
  return [...arr].sort((a, b) => a === s ? -1 : b === s ? 1 : a.localeCompare(b, 'zh'));
}

async function loadTeachers() {
  try {
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
