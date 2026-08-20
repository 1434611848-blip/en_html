---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: b67f9162d7cfc5f3077ae48fe863a08b_78d621f09be411f18cca525400e6dd8f
    ReservedCode1: 2Ei1h76nei8SqV7gNbnHzvpOBb3Y+IrD4MZpPflafuaS8fCBKy0Wiv+2nuTg0wI2NfJ2+juvOXmvlVYCJI28rFHCcgbJZr6uveDnpPIPnco/UIwKQ41eQZig0g9CLegRG5jSqWKeyUkcr4CrOqrQp/pfNn0ay5HiIv/F//vC7ARXTy2AjS3l1ABns9Y=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: b67f9162d7cfc5f3077ae48fe863a08b_78d621f09be411f18cca525400e6dd8f
    ReservedCode2: 2Ei1h76nei8SqV7gNbnHzvpOBb3Y+IrD4MZpPflafuaS8fCBKy0Wiv+2nuTg0wI2NfJ2+juvOXmvlVYCJI28rFHCcgbJZr6uveDnpPIPnco/UIwKQ41eQZig0g9CLegRG5jSqWKeyUkcr4CrOqrQp/pfNn0ay5HiIv/F//vC7ARXTy2AjS3l1ABns9Y=
---

# CLAUDE.md

本文件为 AI 助手（Claude / Marvis 等）在此仓库工作时的项目说明。

## 项目简介

初中英语教学辅助**静态网站**，部署于 GitHub Pages（`https://1434611848-blip.github.io/en_html/`）。

- **技术栈**：纯 HTML + CSS + 原生 JS（无构建工具、无框架）
- **后端**：Supabase（云数据库，匿名 anon 直连，无登录体系）
- **埋点**：腾讯 Beacon（`beacon.cdn.qq.com`）
- **依赖库**：`supabase.min.js`（CDN 引入）、`qrcode.min.js`、本地字体 `fredoka.woff2` / `z-cool-kuaile.woff2`
- **主要页面**：暑假试卷智能批改（学生/教师）、单词游戏（消消乐/密室逃脱/射击/测测测）、单词发音练习（18 天音频）、班级宠物、教师工作台

---

## 1. 代码提交与发布

项目通过 `push.sh` 一键发布到 GitHub Pages：

```bash
git add .
git commit --allow-empty -m "rebuild pages"
git pull
git push
```

要点：

- `--allow-empty` 允许空提交，用于**强制触发 GitHub Pages 重新构建**（即使内容未变化）。
- 如果出现 pull 冲突，先 `git stash` 或手动解决冲突再 push。
- 页面间互相引用线上资源时使用绝对路径：`https://1434611848-blip.github.io/en_html/xxx.js`（如 `supabase-patch.js` 在所有页面 `<body>` 末尾引入）。

---

## 2. Supabase 连接与数据存储

### 2.1 连接信息

| 项 | 值 |
|---|---|
| Project URL | `https://xwnvsydndaclamzcfrpl.supabase.co` |
| anon key | `sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ` |

### 2.2 两种访问方式

1. **supabase-js SDK**（多数页面使用）：CDN 引入后 `window.supabase.createClient(URL, KEY)`，再 `sb.from('表名').select/insert/update/delete/upsert`。客户端统一封装在 `shared.js`（教师列表加载 + 客户端初始化，含 4.5s CDN 轮询兜底）。
2. **REST API 直连**（`teacher-app/js/supabase.js` 的 `CloudBox` 使用）：`fetch(URL + '/rest/v1/表名?...')`，请求头必须带 `apikey` 与 `Authorization: Bearer <key>`。查询用 `?select=...&字段=eq.值&order=...`，写库用 `Prefer: return=representation`。

### 2.3 存储模式与约定

- **本地草稿**：已移除所有 localStorage/sessionStorage（`teacher-app/js/storage.js` 中函数均为 noop），草稿仅保存在内存中，不持久化。
- **云端持久化**：提交时双写 Supabase；`supabase-patch.js` 拦截 `Storage.addRecord` 自动把考试记录写入 `game_records`。
- **软删除约定**：所有表用 `status` 字段（`'submitted'` / `'deleted'`）标记删除，查询统一加 `status=neq.deleted`，**禁止物理删除**（宠物相关表除外，教师删除班级时级联物理删除）。
- **RLS 策略**：匿名 anon 对 `word_detection_scores` 等表开放 insert/select/update（见 `teacher-app/sql/word_detection_scores.sql` 模板）。新建表后需在 Supabase SQL Editor 配置相应策略，否则前端读写会被拒。

---

## 3. 数据表结构

Supabase 中共 9 张业务表（`app_settings` / `exam_records` / `game_records` / `pet_score_history` / `pet_students` / `stage_thresholds` / `teachers` / `word_detection_scores` / `word_editions`）：

### 3.1 teachers — 教师表

| 字段 | 类型 | 说明 |
|---|---|---|
| name | text | 教师名（如 亚飞老师 / 亚楠老师），按去除"老师"后缀去重 |
| type | text | 来源标记（如 `班级宠物模式`） |
| created_at | timestamptz | 创建时间 |

前端：`shared.js` 的 `loadTeachers()` 拉取并按"亚飞老师"置顶排序；宠物模式删除教师时按 `type` 过滤删除。

### 3.2 exam_records — 试卷考试记录（teacher-app 云收集箱）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint identity | 主键 |
| record_id | text | 唯一记录 ID（`rec_时间戳_随机`） |
| student_name | text | 学生姓名 |
| teacher | text | 所属老师 |
| answers | jsonb | 各题型答案（`{choice:{1:'A',...}, cloze, reading, task, grammar}`） |
| analysis | jsonb | 分析结果（`{totals:{score,full,rate}, stats:{right,wrong,blank,total}, sections, wrongList, weakPoints, comments}`） |
| submitted_at | timestamptz | 提交时间 |
| status | text | `submitted` / `deleted`（软删除） |

访问封装：`teacher-app/js/supabase.js` 的 `CloudBox`（uploadRecord / fetchTeacherRecords / fetchRecordDetail / fetchRecordById / deleteRecord）。注意：teacher-app 上传用 `record_id` 自生成，不依赖 Supabase 自增 id。

### 3.3 game_records — 游戏通用成绩表（消消乐/密室逃脱/射击/考试通用）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint identity | 主键 |
| name | text | 学生名 |
| teacher | text | 所属老师 |
| date | text | 日期（`toLocaleDateString('zh-CN')` 或 ISO 日期） |
| time | int | 用时（秒）；参与人次记录为 0 |
| accuracy | numeric | 正确率 |
| correct | int | 答对题数 |
| wrong | int | 答错题数 |
| rounds | int | 轮数 / 总题数（0 表示纯参与记录） |
| game_type | text | 游戏类型：`match`（消消乐）/ `escape`（密室）/ `shooting`（射击）/ `exam`（考试）等 |
| edition_id | text | 期次 ID（关联 `word_editions.name`，可空） |
| pair_log | jsonb | 详情日志（考试时存 `{student_name, submitted_at, mode, total_score, full_score, correct_rate, right_count, wrong_count, blank_count, total_questions, answers, analysis, wrong_list}`） |

用途：排行榜按 `accuracy` 降序 + `time` 升序；`getAttemptCount` 用 `rounds=0` 的记录统计参与次数。

### 3.4 word_detection_scores — 单词检测成绩（单词小侦探）

建表 SQL 见 `teacher-app/sql/word_detection_scores.sql`（含索引与 RLS 策略，可直接在 Supabase SQL Editor 执行）。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint identity | 主键 |
| student_name | text | 学生名 |
| teacher | text | 老师 |
| version | text | 版本（默认 `通用`） |
| total | int | 总题数（默认 30） |
| correct | int | 答对题数 |
| score | int | 得分（含连对加成） |
| detail | jsonb | 错题明细 `[{en,zh}]` |
| submitted_at | timestamptz | 提交时间 |
| status | text | `submitted` / `deleted` |

### 3.5 word_editions — 单词期次（游戏词汇包）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint identity | 主键 |
| name | text | 期次名（如 `20260819`，同名日自动追加序号） |
| words | jsonb | 单词数组 `[{en, cn}]` |
| note | text | 归属标记：`''`=消消乐、`'escape'`=密室、`'shooting'`=射击 |
| created_at | timestamptz | 创建时间 |

游戏启动时通过 `app_settings` 中的激活期次名读取对应 `words` 覆盖 `window.GAME_WORDS`（`words.js` 为默认词库）。

### 3.6 app_settings — 应用设置（KV 表）

| 字段 | 类型 | 说明 |
|---|---|---|
| key | text（唯一） | 配置键：`active_edition_id`、`escape_active_edition_id`、`shooting_active_edition_id`、`custom_word_list` |
| value | text | 配置值（期次名或 JSON 字符串） |

写入用 `upsert(..., {onConflict:'key'})`；删除某 key 用 `delete().eq('key', ...)`。

### 3.7 pet_students — 班级宠物学生

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint identity | 主键 |
| teacher_name | text | 老师名 |
| name | text | 学生名 |
| pet_key | text | 宠物类型 |
| rarity | text | 稀有度 |
| score | int | 当前积分 |
| stage | int | 阶段（由 `stage_thresholds` 计算） |
| created_at | timestamptz | 创建时间 |

### 3.8 pet_score_history — 宠物得分流水

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint identity | 主键 |
| student_id | bigint | 关联 `pet_students.id` |
| student_name | text | 学生名 |
| teacher_name | text | 老师名 |
| type | text | 得分类型（课堂/作业/考试等） |
| score | int | 变动分数 |
| created_at | timestamptz | 时间 |

### 3.9 stage_thresholds — 宠物阶段阈值

| 字段 | 类型 | 说明 |
|---|---|---|
| id | int | 固定 `1`（单行） |
| values | jsonb | 阈值数组，默认 `[0, 20, 50, 100, 200]`（代码中前置补 0） |
| updated_at | timestamptz | 更新时间 |

---

## 4. 页面模块速查

| 文件 | 功能 | 关联表 |
|---|---|---|
| ~~`index.html` / `student.html` / `manual.html`~~（根目录，legacy 已废弃，引用的 `css/`/`js/` 目录不存在） | 暑假综合检测答题（学生入口 → 登记 → 录入） | `game_records`（经 supabase-patch） |
| `teacher-app/index.html` ~ `student.html` / `manual.html` / `report.html` / `teacher-list.html` | 教师端批改与报告（实际使用版本） | `exam_records`、`teachers` |
| `teacher-cloud.html` | 教师工作台 · 个性化反馈方案书 | `exam_records` |
| `word_match_game.html` / `word_match_admin.html` | 单词消消乐 + 教师后台 | `game_records`、`word_editions`、`app_settings` |
| `word_escape_game.html` / `word_escape_admin.html` | 单词密室逃脱 + 教师看板 | 同上（note='escape'） |
| `word_shooting_game.html` | 单词射击大作战 | 同上（note='shooting'） |
| `word_cecece.html` | 单词测测测 | `game_records` |
| `word_weekend_check.html` | 周末检测 | `game_records` |
| `class-pet.html` / `class-pet-script.js` | 班级宠物乐园（教师后台） | `pet_students`、`pet_score_history`、`stage_thresholds`、`teachers` |
| `word-detect-*.html`（teacher-app） | 单词小侦探游戏/看板/排行 | `word_detection_scores` |
| `word-audio-day1~18.html` + `audio/` | 中考单词发音练习（9 个教材版本，大部分 18 天，北师大版 17 天，共 161 个 mp3） | 无（纯静态） |

## 5. 外部素材备忘（待办/可复用）

- **单词表扬榜_0819.html**：位于 `C:\Users\14346\Downloads\单词表扬榜_0819.html`（2026-08-19 生成）。
  - 性质：粉色系表扬榜海报页，标题"单词表扬榜 · 今日单词小达人"，内置 89 名学生名单（圣楷、刘楠、萌萌、艺溥……），6 列卡片网格 + 徽章 emoji，底部鼓励语标签；引入 html2canvas CDN，支持"保存为图片"导出 PNG。
  - **重要能力：保存为 PNG 图片**。页面自带"📷 保存为图片"按钮（html2canvas scale=2 导出 PNG，文件名 `单词表扬榜_X月X日.png`）。**后续做表扬榜相关任务时，PNG 图片是与 HTML 同等重要的产出物**——可能要直接生成图片文件交付（用于发群/打印/分享），而不只是网页。
  - 与项目关系：视觉风格与 en_html 教学页面一致（ZCOOL KuaiLe 字体、可爱海报风），类似 `word_weekend_check.html` 的展示型页面。
  - 后续可能任务：① 复制进 en_html 根目录并 `push.sh` 发布上线；② 调整学生名单 / 标题日期 / 样式配色；③ 生成类似风格的其他表扬榜（如作业表扬、阅读表扬）；④ 直接渲染生成 PNG 图片文件交付。发布时注意页面引用的字体与 CDN 依赖是否需本地化。

---

## 6. 常见开发注意点

- 新增页面如需写库，统一走 `shared.js`（消消乐/密室）或 `CloudBox`（teacher-app）的封装，**不要散落创建 supabase client**；页面 `<body>` 末尾记得引入 `supabase-patch.js`（线上绝对路径）。
- 新增表后必须在 Supabase SQL Editor 建表 + 开 RLS 策略（参考 `word_detection_scores.sql`），否则 anon 读写会被拒绝。
- 查询软删除表必须带 `status=neq.deleted`。
- 修改线上页面后执行 `push.sh` 发布；页面内引用的 JS/CSS 更新同样随 git 推送，GitHub Pages 构建约 1 分钟生效。
*（内容由AI生成，仅供参考）*
