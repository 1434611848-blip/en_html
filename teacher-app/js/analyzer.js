/**
 * 答题判定逻辑与个性化分析引擎
 *
 * 评分规则（避免机械性误判）：
 *  - 客观题（选择、阅读、任务型、语法）：按题号严格匹配正确答案
 *  - 主观题（语法填空）：支持常见等价形式（如 doesn't go ≡ does not go）
 *  - 容错：
 *      · 大小写不敏感
 *      · 自动去除首尾空白
 *      · 多个等价答案数组 (altAnswers) 任意匹配即视为正确
 *      · 学生答案为空时记为"未作答"，既不计入正确也不计入错误，会单独统计
 */

window.Analyzer = (function () {
  const D = window.EXAM_DATA;

  /** 标准化处理：去空白、小写、可选去除尾部句号 */
  function norm(s) {
    if (s === null || s === undefined) return '';
    return String(s).trim().toLowerCase().replace(/[.\s]+$/g, '');
  }

  /** 单题判定（选择题 / 任务型 / 语法填空通用） */
  function judgeOne(studentAnswer, correctAnswer, altAnswers) {
    const s = norm(studentAnswer);
    if (!s) {
      return { state: 'blank', correct: null, msg: '未作答' };
    }
    const cand = [norm(correctAnswer), ...(altAnswers || []).map(norm)];
    if (cand.includes(s)) {
      return { state: 'right', correct: correctAnswer, msg: '正确' };
    }
    return { state: 'wrong', correct: correctAnswer, msg: `正确答案：${correctAnswer}` };
  }

  /**
   * 主分析函数
   * @param {object} answers
   *   {
   *     choice:   {1:'A', 2:'B', ...},
   *     cloze:    {1:'A', 2:'A', ...},
   *     reading:  {1:'B', 2:'B', ...},
   *     task:     {1:'volleyball', 2:'flowers', ...},
   *     grammar:  {1:'watches', 2:'tomatoes', ...}
   *   }
   */
  function analyze(answers) {
    const result = {
      sections: {},          // 各 section 得分与逐题结果
      totals: { score: 0, full: D.meta.totalScore, rate: 0 },
      stats: { right: 0, wrong: 0, blank: 0, total: 0 },
      wrongByKnowledge: {},  // 错题 → 知识点 → 列表
      wrongList: [],         // 错题详细清单
      weakPoints: [],        // 归纳的薄弱知识点（按错误数量倒序）
      comments: []           // 鼓励性评语
    };

    const sections = [
      { key: 'choice',  conf: D.choice,  isOptions: true,  listKey: 'questions' },
      { key: 'cloze',   conf: D.cloze,   isOptions: true,  listKey: 'questions' },
      { key: 'reading', conf: D.reading, isOptions: true,  listKey: 'questions' },
      { key: 'task',    conf: D.task,    isOptions: false, listKey: 'blanks' },
      { key: 'grammar', conf: D.grammar, isOptions: false, listKey: 'questions' }
    ];

    sections.forEach(sec => {
      const userMap = answers[sec.key] || {};
      const list = sec.conf[sec.listKey];
      const per = sec.conf.perScore;
      const sectionResult = {
          name: sec.conf.sectionName,
          perScore: per,
          score: 0,
          full: list.length * per,
          items: []
        };

      list.forEach(q => {
        const ua = userMap[q.no];
        let judge;
        if (sec.isOptions) {
          judge = judgeOne(ua, q.answer);
        } else {
          judge = judgeOne(ua, q.answer, q.altAnswers);
        }
        const item = {
          no: q.no,
          stem: q.stem || q.label,
          student: ua || '',
          state: judge.state,
          correct: judge.correct,
          knowledge: q.knowledge || '',
          diagnosis: q.diagnosis || '',
          tip: q.tip || ''
        };
        if (judge.state === 'right') {
          item.score = per;
          sectionResult.score += per;
          result.stats.right++;
        } else if (judge.state === 'wrong') {
          item.score = 0;
          result.stats.wrong++;
          result.wrongList.push({ section: sec.conf.sectionName, ...item, sectionKey: sec.key, fullQuestion: q });
        } else {
          item.score = 0;
          result.stats.blank++;
        }
        result.stats.total++;
        sectionResult.items.push(item);
      });

      result.sections[sec.key] = sectionResult;
      result.totals.score += sectionResult.score;
    });

    result.totals.rate = +(result.totals.score / result.totals.full * 100).toFixed(1);

    // 知识点 → 错题统计（按 section + 题号 精确匹配，避免跨题型重复）
    Object.keys(D.knowledgePoints).forEach(kp => {
      const cfg = D.knowledgePoints[kp];
      let wrong = 0;
      const wrongs = [];
      let totalRelated = 0;
      Object.keys(cfg.related).forEach(secKey => {
        const sec = result.sections[secKey];
        const nos = cfg.related[secKey];
        if (!sec || !Array.isArray(nos)) return;
        totalRelated += nos.length;
        nos.forEach(no => {
          const it = sec.items.find(x => x.no === no);
          const uid = secKey + '-' + no;
          if (it && it.state === 'wrong' && !wrongs.includes(uid)) {
            wrong++;
            wrongs.push(uid);
          }
        });
      });
      if (wrong > 0) {
        result.weakPoints.push({
          name: kp,
          wrongCount: wrong,
          totalRelated: totalRelated,
          weakness: cfg.weakness,
          advice: cfg.advice
        });
      }
    });
    result.weakPoints.sort((a, b) => b.wrongCount - a.wrongCount);

    const rate = result.totals.rate;
    if (rate >= 90) result.comments.push('太棒了！基础扎实、综合运用能力强，请继续保持并尝试更高难度的拓展练习。');
    else if (rate >= 75) result.comments.push('整体掌握不错，针对薄弱点集中突破，可以再上一个台阶。');
    else if (rate >= 60) result.comments.push('基础部分有进步空间，建议针对错题集中的知识点逐个击破，并加强语篇训练。');
    else result.comments.push('这次分数偏低，不要灰心。先把高频考点（名词复数、时态、介词、搭配）系统过一遍，再做同类练习巩固。');

    if (result.stats.blank > 5) {
      result.comments.push(`本次共有 ${result.stats.blank} 题未作答。建议先做会做的拿稳基础分，再攻克难题。`);
    }

    return result;
  }

  return { analyze, norm, judgeOne };
})();
