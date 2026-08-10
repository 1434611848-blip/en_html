/* Supabase 云端数据收集箱客户端 */
window.CloudBox = (function () {
  var SUPABASE_URL = 'https://ilywffybxgogvvuaynvo.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_NI1StV7zqLdysR3jHo6h6A_AujM62v4';
  var API = SUPABASE_URL + '/rest/v1';

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

  function one(path) {
    return request(path, { headers: { 'Accept': 'application/json' } }).then(function (rows) {
      return rows && rows[0] ? rows[0] : null;
    });
  }

  function findTeacher(name) {
    return one('/teachers?select=id,teacher_name&teacher_name=eq.' + encodeURIComponent(name) + '&is_active=eq.true&limit=1');
  }

  function findExam() {
    return one('/exams?select=id&exam_code=eq.summer_english_grade7&version=eq.v1&is_active=eq.true&limit=1');
  }

  function findOrCreateStudent(teacherId, name) {
    var query = '/students?select=id&teacher_id=eq.' + encodeURIComponent(teacherId) + '&student_name=eq.' + encodeURIComponent(name) + '&limit=1';
    return one(query).then(function (row) {
      if (row) return row;
      return request('/students?select=id', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ teacher_id: teacherId, student_name: name })
      }).then(function (rows) { return rows[0]; });
    });
  }

  function uploadRecord(rec) {
    return Promise.all([findTeacher(rec.teacher), findExam()]).then(function (base) {
      if (!base[0]) throw new Error('云端未找到所属老师：' + rec.teacher);
      if (!base[1]) throw new Error('云端未找到试卷版本，请先执行 Supabase SQL');
      return findOrCreateStudent(base[0].id, rec.name).then(function (student) {
        return request('/submissions?select=id', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            student_id: student.id,
            teacher_id: base[0].id,
            exam_id: base[1].id,
            input_mode: rec.mode === 'ocr+manual' ? 'ocr_manual' : 'manual',
            status: 'submitted',
            score: rec.analysis.totals.score,
            full_score: rec.analysis.totals.full,
            accuracy: rec.analysis.totals.rate,
            right_count: rec.analysis.stats.right,
            wrong_count: rec.analysis.stats.wrong,
            blank_count: rec.analysis.stats.blank,
            raw_answers: rec.answers,
            analysis_json: rec.analysis,
            submitted_at: rec.submittedAt
          })
        });
      });
    });
  }

  function fetchTeachers() {
    return request('/teachers?select=id,teacher_name&is_active=eq.true&order=created_at.asc').then(function (rows) {
      return rows.map(function (row) {
        return { id: row.id, name: row.teacher_name };
      });
    });
  }

  function fetchTeacherRecords(teacherName) {
    var filter = teacherName && teacherName !== '__all' ? '&teachers.teacher_name=eq.' + encodeURIComponent(teacherName) : '';
    var path = '/submissions?select=*,teachers!inner(teacher_name),students!inner(student_name)&status=neq.deleted' + filter + '&order=submitted_at.desc';
    return request(path).then(function (rows) {
      return rows.map(function (row) {
        var analysis = row.analysis_json || {};
        return {
          id: row.id,
          name: row.students && row.students.student_name || '',
          teacher: row.teachers && row.teachers.teacher_name || '',
          submittedAt: row.submitted_at,
          answers: row.raw_answers || {},
          analysis: analysis
        };
      });
    });
  }

  function deleteRecord(id) {
    return request('/submissions?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({ status: 'deleted' })
    }).then(function(rows) {
      if (!rows || rows.length === 0) {
        throw new Error('RLS 策略阻止了更新，请在 Supabase 后台添加 UPDATE 权限');
      }
      return rows;
    });
  }

  return { uploadRecord: uploadRecord, fetchTeacherRecords: fetchTeacherRecords, fetchTeachers: fetchTeachers, deleteRecord: deleteRecord };
})();
