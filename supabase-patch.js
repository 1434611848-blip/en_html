/**
 * Supabase 数据同步补丁脚本
 * 在学生答题提交时，同时将数据写入 Supabase 云数据库
 * 
 * 使用方式：在 student.html / index.html 的 </body> 前引入：
 *   <script src="https://1434611848-blip.github.io/en_html/supabase-patch.js"></script>
 * 
 * 前置条件：页面需已加载 CDN 的 Supabase SDK
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
 */

(function () {
  'use strict';

  // ===========================
  // 配置
  // ===========================
  var SUPABASE_URL = 'https://xwnvsydndaclamzcfrpl.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ';
  var TABLE_NAME = 'game_records';

  // ===========================
  // 已提交 ID 缓存（防重）
  // ===========================
  var submittedIds = {};

  // ===========================
  // Supabase 客户端初始化
  // ===========================
  function getSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
      // 如果页面没有预加载 Supabase SDK，动态加载
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.async = false;
      document.head.appendChild(script);
    }

    if (typeof window.supabase === 'undefined') {
      return null;
    }

    if (!window.__sb_client) {
      try {
        window.__sb_client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (e) {
        console.error('[Supabase Patch] 创建客户端失败:', e);
        return null;
      }
    }
    return window.__sb_client;
  }

  // ===========================
  // 安全提取字段
  // ===========================
  function safe(obj, path, fallback) {
    if (obj == null) return fallback;
    var keys = path.split('.');
    var cur = obj;
    for (var i = 0; i < keys.length; i++) {
      if (cur == null || typeof cur !== 'object') return fallback;
      cur = cur[keys[i]];
    }
    return cur != null ? cur : fallback;
  }

  // ===========================
  // 构建 Supabase 写入数据
  // ===========================
  function buildRecord(rec) {
    return {
      name: rec.name || '',
      teacher: rec.teacher || '',
      date: rec.submittedAt || new Date().toISOString().split('T')[0],
      time: 0,
      accuracy: safe(rec, 'analysis.totals.rate', 0),
      correct: safe(rec, 'analysis.stats.right', 0),
      wrong: safe(rec, 'analysis.stats.wrong', 0),
      rounds: safe(rec, 'analysis.stats.total', 0),
      game_type: 'exam',
      pair_log: {
        student_name: rec.name || '',
        submitted_at: rec.submittedAt || '',
        mode: rec.mode || '',
        total_score: safe(rec, 'analysis.totals.score', 0),
        full_score: safe(rec, 'analysis.totals.full', 0),
        correct_rate: safe(rec, 'analysis.totals.rate', 0),
        right_count: safe(rec, 'analysis.stats.right', 0),
        wrong_count: safe(rec, 'analysis.stats.wrong', 0),
        blank_count: safe(rec, 'analysis.stats.blank', 0),
        total_questions: safe(rec, 'analysis.stats.total', 0),
        answers: rec.answers || {},
        analysis: rec.analysis || {},
        wrong_list: safe(rec, 'analysis.wrongList', [])
      }
    };
  }

  // ===========================
  // 写入 Supabase
  // ===========================
  function syncToSupabase(rec) {
    // 防重：已提交过的 ID 不再写入
    if (submittedIds[rec.id]) {
      console.log('[Supabase Patch] ID ' + rec.id + ' 已同步，跳过');
      return;
    }

    var client = getSupabaseClient();
    if (!client) {
      console.error('[Supabase Patch] Supabase 客户端不可用，同步失败');
      return;
    }

    var data = buildRecord(rec);

    client
      .from(TABLE_NAME)
      .insert([data])
      .then(function (result) {
        if (result.error) {
          console.error('[Supabase Patch] 写入失败:', result.error.message);
          return;
        }
        submittedIds[rec.id] = true;
        console.log('[Supabase Patch] 同步成功: ' + rec.name + ' (ID: ' + rec.id + ')');
      })
      .catch(function (err) {
        console.error('[Supabase Patch] 写入异常:', err);
      });
  }

  // ===========================
  // 覆盖 Storage.addRecord
  // ===========================
  if (typeof window.Storage !== 'undefined' && typeof window.Storage.addRecord === 'function') {
    var _originalAddRecord = window.Storage.addRecord;

    window.Storage.addRecord = function (rec) {
      // 先调用原始方法写入 localStorage
      _originalAddRecord.call(window.Storage, rec);

      // 异步写入 Supabase（静默：失败不影响学生端正常提交流程）
      if (rec && rec.id) {
        syncToSupabase(rec);
      }
    };

    console.log('[Supabase Patch] 已挂载，Storage.addRecord 拦截就绪');
  } else {
    console.warn('[Supabase Patch] Storage.addRecord 未找到，可能页面尚未加载 storage.js，请确保引入顺序正确');
  }

})();
