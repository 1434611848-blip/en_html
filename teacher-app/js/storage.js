/**
 * 存储模块（已移除所有 localStorage/sessionStorage）
 * - 学生提交数据：全部存 Supabase 数据库
 * - 教师登录态：URL 参数传递
 * - 答题草稿：内存中保存，不持久化
 * - 题目数据：data.js 静态文件（符合要求）
 *
 * 保留空函数签名兼容旧引用，实际不做任何本地存储操作
 */
window.Storage = (function () {
  function noop() {}
  function noopEmpty() { return []; }
  function noopNull() { return null; }

  return {
    // 旧接口兼容（全部 no-op）
    loadRecords: noopEmpty,
    saveRecords: noop,
    addRecord: function(rec) {
      // 不再本地存储，只返回对象供后续上传云端
      rec.id = 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      rec.submittedAt = new Date().toISOString();
      return rec;
    },
    deleteRecord: noop,
    clearAll: noop,
    setTeacherSession: noop,
    getTeacherSession: noopNull,
    clearTeacherSession: noop,
    saveDraft: noop,
    loadDraft: noopNull,
    clearDraft: noop,
    loadDeletedCloudIds: noopEmpty,
    addDeletedCloudId: noop
  };
})();
