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
      CACHED_TEACHERS = sortTeachers(data.map(r => r.name));
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
