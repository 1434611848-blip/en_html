/* Supabase 云端数据收集箱客户端 — 使用 exam_records 扁平表 */
window.CloudBox = (function () {
  var SUPABASE_URL = 'https://xwnvsydndaclamzcfrpl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ';
  var API = SUPABASE_URL + '/rest/v1';
  var TABLE = '/exam_records';

  function headers(extra) {
    var h = {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  function request(path, options) {
    options = options || {};
    options.headers = headers(options.headers);
    return fetch(API + path, options).then(function (res) {
      return res.text().then(function (text) {
        var body = text ? JSON.parse(text) : null;
        if (!res.ok) {
          var msg = body && (body.message || body.details || body.hint) || ('HTTP ' + res.status);
          throw new Error(msg);
        }
        return body;
      });
    });
  }

  // 生成唯一 record_id
  function genRecordId() {
    return 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  // 上传考试记录 — 扁平表，直接存 student_name / teacher
  function uploadRecord(rec) {
    return request(TABLE + '?select=id', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({
        record_id: genRecordId(),
        student_name: rec.name,
        teacher: rec.teacher,
        answers: rec.answers,
        analysis: rec.analysis,
        submitted_at: rec.submittedAt,
        status: 'submitted'
      })
    });
  }

  // 获取所有教师名（从 teachers 表）
  function fetchTeachers() {
    return request('/teachers?select=name&order=created_at.asc').then(function (rows) {
      return rows.map(function (row) {
        return { name: row.name || '' };
      }).filter(function (t) { return t.name; });
    });
  }

  // 列表摘要查询：只取 id/姓名/教师/时间/analysis，不拉 answers（省流量秒开）
  function fetchTeacherRecords(teacherName) {
    var filter = teacherName && teacherName !== '__all' ? '&teacher=eq.' + encodeURIComponent(teacherName) : '';
    var path = TABLE + '?select=id,student_name,teacher,submitted_at,analysis' + filter + '&status=neq.deleted&order=submitted_at.desc';
    return request(path).then(function (rows) {
      return rows.map(function (row) {
        var analysis = row.analysis || {};
        var totals = analysis.totals || { score: 0, full: 100, rate: 0 };
        var stats = analysis.stats || { right: 0, wrong: 0, blank: 0 };
        return {
          id: row.id,
          name: row.student_name || '',
          teacher: row.teacher || '',
          submittedAt: row.submitted_at,
          answers: null,       // 详情懒加载
          analysis: { totals: totals, stats: stats },  // 最小 analysis，列表够用
          _detailLoaded: false  // 标记详情未加载
        };
      });
    });
  }

  // 详情查询：点击展开时才加载单条记录的 answers + 完整 analysis
  function fetchRecordDetail(id) {
    var path = TABLE + '?select=id,answers,analysis&id=eq.' + encodeURIComponent(id) + '&limit=1';
    return request(path).then(function (rows) {
      if (!rows || !rows.length) throw new Error('记录不存在');
      return {
        answers: rows[0].answers || {},
        analysis: rows[0].analysis || {}
      };
    });
  }

  // 按 ID 加载完整记录（供 report.html 使用）
  function fetchRecordById(id) {
    var path = TABLE + '?select=id,student_name,teacher,submitted_at,answers,analysis&id=eq.' + encodeURIComponent(id) + '&limit=1';
    return request(path).then(function (rows) {
      if (!rows || !rows.length) throw new Error('记录不存在');
      var row = rows[0];
      return {
        id: row.id,
        name: row.student_name || '',
        teacher: row.teacher || '',
        submittedAt: row.submitted_at,
        answers: row.answers || {},
        analysis: row.analysis || {}
      };
    });
  }

  // 软删除：PATCH status='deleted'，查询端用 status=neq.deleted 过滤
  function deleteRecord(id) {
    return request(TABLE + '?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({ status: 'deleted' })
    }).then(function (rows) {
      if (!rows || rows.length === 0) {
        throw new Error('RLS 未授权 UPDATE，请先在 Supabase SQL Editor 执行授权语句');
      }
      return rows;
    });
  }

  return {
    uploadRecord: uploadRecord,
    fetchTeacherRecords: fetchTeacherRecords,
    fetchRecordDetail: fetchRecordDetail,
    fetchRecordById: fetchRecordById,
    fetchTeachers: fetchTeachers,
    deleteRecord: deleteRecord
  };
})();
