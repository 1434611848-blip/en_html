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

  // 轻量列表查询：只取 totals 和 stats（JSONB 提取），1.7KB vs 370KB
  function fetchTeacherRecords(teacherName) {
    var filter = teacherName && teacherName !== '__all' ? '&teacher=eq.' + encodeURIComponent(teacherName) : '';
    var path = TABLE + '?select=id,student_name,teacher,submitted_at,analysis-%3Etotals,analysis-%3Estats' + filter + '&status=neq.deleted&order=submitted_at.desc';
    return request(path).then(function (rows) {
      return rows.map(function (row) {
        return {
          id: row.id,
          name: row.student_name || '',
          teacher: row.teacher || '',
          submittedAt: row.submitted_at,
          answers: null,
          analysis: {
            totals: row.totals || { score: 0, full: 80, rate: 0 },
            stats: row.stats || { right: 0, wrong: 0, blank: 0, total: 0 }
          },
          _detailLoaded: false
        };
      });
    });
  }

  // 详情查询：点击展开时加载单条记录的 answers，然后重新分析
  function fetchRecordDetail(id) {
    var path = TABLE + '?select=answers&id=eq.' + encodeURIComponent(id) + '&limit=1';
    return request(path).then(function (rows) {
      if (!rows || !rows.length) throw new Error('记录不存在');
      var answers = rows[0].answers || {};
      var analysis = {};
      if (window.Analyzer && Analyzer.analyze) {
        try { analysis = Analyzer.analyze(answers); } catch (e) { console.error('re-analyze failed:', e); }
      }
      return { answers: answers, analysis: analysis };
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

  // ===== 单词检测（单词小侦探） =====
  var WORD_TABLE = '/word_detection_scores';

  // 上传一次成绩
  function uploadWordScore(rec) {
    return request(WORD_TABLE + '?select=id', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({
        student_name: rec.name,
        teacher: rec.teacher,
        version: rec.version,
        total: rec.total,
        correct: rec.correct,
        score: rec.score,
        detail: rec.detail || [],
        duration: (typeof rec.duration === 'number') ? rec.duration : null,
        submitted_at: rec.submittedAt,
        status: 'submitted'
      })
    });
  }

  // 查询成绩：可按老师 + 版本过滤（默认查全部未删除）
  function fetchWordScores(teacherName, version) {
    var filter = '';
    if (teacherName && teacherName !== '__all') filter += '&teacher=eq.' + encodeURIComponent(teacherName);
    if (version && version !== '__all') filter += '&version=eq.' + encodeURIComponent(version);
    var path = WORD_TABLE + '?select=id,student_name,teacher,version,total,correct,score,detail,duration,submitted_at'
      + filter + '&status=neq.deleted&order=submitted_at.desc';
    return request(path);
  }

  // 软删除单条单词成绩（老师后台去重 / 删除）
  function deleteWordScore(id) {
    return request(WORD_TABLE + '?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({ status: 'deleted' })
    }).then(function (rows) {
      if (!rows || rows.length === 0) {
        throw new Error('RLS 未授权 UPDATE，请在 Supabase SQL Editor 执行 word_detection_scores 的授权语句');
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
    deleteRecord: deleteRecord,
    uploadWordScore: uploadWordScore,
    fetchWordScores: fetchWordScores,
    deleteWordScore: deleteWordScore
  };
})();
