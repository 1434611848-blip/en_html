-- ============================================================
-- 单词检测成绩表（单词小侦探）
-- 在 Supabase SQL Editor 里一次性执行下面全部语句即可。
-- 表结构：每个学生一次参与 = 一行；排行榜取每人最高分；
-- 老师后台“去重”通过软删除（status='deleted'）实现。
-- ============================================================

create table if not exists public.word_detection_scores (
  id            bigint generated always as identity primary key,
  student_name  text        not null,
  teacher       text        not null,
  version       text        not null default '通用',
  total         int         not null default 30,   -- 总题数
  correct       int         not null default 0,    -- 答对题数
  score         int         not null default 0,    -- 得分（含连对加成）
  detail        jsonb       not null default '[]'::jsonb, -- 错题明细 [{en,zh}]
  submitted_at  timestamptz not null default now(),
  status        text        not null default 'submitted'
);

-- 方便按老师/版本/时间查询
create index if not exists idx_wds_teacher   on public.word_detection_scores (teacher);
create index if not exists idx_wds_version   on public.word_detection_scores (version);
create index if not exists idx_wds_submitted on public.word_detection_scores (submitted_at desc);

-- 开启行级安全
alter table public.word_detection_scores enable row level security;

-- 匿名（学生端 / 排行榜 / 老师后台）可插入成绩
drop policy if exists "anon insert word scores" on public.word_detection_scores;
create policy "anon insert word scores" on public.word_detection_scores
  for insert to anon with check (true);

-- 匿名可查询（排行榜、老师后台查看）
drop policy if exists "anon select word scores" on public.word_detection_scores;
create policy "anon select word scores" on public.word_detection_scores
  for select to anon using (true);

-- 匿名可更新（老师后台“软删除”去重 / 单条删除）
drop policy if exists "anon update word scores" on public.word_detection_scores;
create policy "anon update word scores" on public.word_detection_scores
  for update to anon using (true) with check (true);
