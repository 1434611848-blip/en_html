/**
 * 本地存储模块
 *  - 学生提交数据：本地保存 + 教师端汇总
 *  - 教师登录态
 *
 * 数据结构：
 *  records: [
 *    {
 *      id, name, teacher, submittedAt,
 *      answers,        // 学生作答
 *      analysis        // 分析结果（与 analyzer 输出保持一致）
 *    }
 *  ]
 *
 *  teacherSession: { teacher: '亚飞老师'|'亚楠老师', loggedAt }
 */

window.Storage = (function () {
  const KEY_RECORDS = 'exam.records.v1';
  const KEY_TEACHER_SESSION = 'exam.teacherSession.v1';

  function loadRecords() {
    try {
      const raw = localStorage.getItem(KEY_RECORDS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('records load failed', e);
      return [];
    }
  }
  function saveRecords(list) {
    localStorage.setItem(KEY_RECORDS, JSON.stringify(list));
  }
  function addRecord(rec) {
    const list = loadRecords();
    rec.id = 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    rec.submittedAt = new Date().toISOString();
    list.push(rec);
    saveRecords(list);
    return rec;
  }
  function deleteRecord(id) {
    const list = loadRecords().filter(r => r.id !== id);
    saveRecords(list);
  }
  function clearAll() {
    localStorage.removeItem(KEY_RECORDS);
  }

  function setTeacherSession(teacher) {
    const s = { teacher, loggedAt: Date.now() };
    sessionStorage.setItem(KEY_TEACHER_SESSION, JSON.stringify(s));
  }
  function getTeacherSession() {
    try {
      const raw = sessionStorage.getItem(KEY_TEACHER_SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearTeacherSession() {
    sessionStorage.removeItem(KEY_TEACHER_SESSION);
  }

  // 草稿（学生录入过程中的临时数据，未提交）
  const KEY_DRAFT = 'exam.draft.v1';
  function saveDraft(draft) { localStorage.setItem(KEY_DRAFT, JSON.stringify(draft)); }
  function loadDraft() {
    try {
      const raw = localStorage.getItem(KEY_DRAFT);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearDraft() { localStorage.removeItem(KEY_DRAFT); }

  return {
    loadRecords, saveRecords, addRecord, deleteRecord, clearAll,
    setTeacherSession, getTeacherSession, clearTeacherSession,
    saveDraft, loadDraft, clearDraft
  };
})();
