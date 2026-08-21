/* 单词小侦探 · 云端数据封装（自包含，仅单词成绩相关）
 * 复用「亚飞教育」现有 Supabase 项目，表 word_detection_scores。
 * 纯 REST（fetch），无需 supabase-js SDK，静态页可直接 <script src> 引入。
 * 全局对象：window.CloudBox
 */
window.CloudBox = (function () {
  var SUPABASE_URL = 'https://xwnvsydndaclamzcfrpl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ';
  var API = SUPABASE_URL + '/rest/v1';
  var WORD_TABLE = '/word_detection_scores';

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
          var msg = (body && (body.message || body.details || body.hint)) || ('HTTP ' + res.status);
          throw new Error(msg);
        }
        return body;
      });
    });
  }

  // 上传一次成绩。rec: {name, teacher, version, total, correct, score, game, detail, submittedAt}
  function uploadWordScore(rec) {
    var body = {
      student_name: rec.name,
      teacher: rec.teacher,
      version: rec.version,
      total: rec.total,
      correct: rec.correct,
      score: (typeof rec.score === 'number') ? rec.score : 0,
      detail: rec.detail || [],
      duration: (typeof rec.duration === 'number') ? rec.duration : null,
      submitted_at: rec.submittedAt || new Date().toISOString(),
      status: 'submitted'
    };
    // 先带 game 上传；若 game 列尚未存在（400/PGRST），自动降级为不带 game 重试，保证成绩始终能入库
    var withGame = Object.assign({}, body, { game: rec.game || null });
    function post(payload){
      return request(WORD_TABLE + '?select=id', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(payload)
      });
    }
    return post(withGame).catch(function(err){
      var msg = String((err && err.message) || '');
      if (msg.indexOf('game') >= 0 || msg.indexOf('column') >= 0 || msg.indexOf('PGRST') >= 0) {
        return post(body);
      }
      throw err;
    });
  }

  // 查询成绩：可按老师 + 版本 + 起始时间过滤（默认全部未删除，按提交时间倒序）
  // sinceISO：可选，只返回 submitted_at >= sinceISO 的记录（用于"只显示本周"）
  // 容错：若 game 列尚未存在（400/PGRST），自动去掉 game 重试，保证记录始终能读出来
  function fetchWordScores(teacherName, version, sinceISO) {
    var filter = '';
    if (teacherName && teacherName !== '__all') filter += '&teacher=eq.' + encodeURIComponent(teacherName);
    if (version && version !== '__all') filter += '&version=eq.' + encodeURIComponent(version);
    if (sinceISO) filter += '&submitted_at=gte.' + encodeURIComponent(sinceISO);
    var base = WORD_TABLE + '?select=id,student_name,teacher,version,total,correct,score,detail,duration,submitted_at'
      + filter + '&status=neq.deleted&order=submitted_at.desc';
    var withGame = WORD_TABLE + '?select=id,student_name,teacher,version,total,correct,score,game,detail,duration,submitted_at'
      + filter + '&status=neq.deleted&order=submitted_at.desc';
    return request(withGame).catch(function (err) {
      var msg = String((err && err.message) || '');
      if (msg.indexOf('game') >= 0 || msg.indexOf('column') >= 0 || msg.indexOf('PGRST') >= 0) {
        return request(base);
      }
      throw err;
    });
  }

  // 软删除单条（老师后台去重 / 删除）
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
    uploadWordScore: uploadWordScore,
    fetchWordScores: fetchWordScores,
    deleteWordScore: deleteWordScore
  };
})();
