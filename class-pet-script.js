// ========== SUPABASE ==========
const supabase = window.supabase.createClient(
  'https://xwnvsydndaclamzcfrpl.supabase.co',
  'sb_publishable_PATbkfSdIrjUug0C7qqnsg__fGlTOLZ'
);

// ========== IN-MEMORY STATE ==========
const STAGE_THRESHOLDS = [0, 20, 50, 100, 200];
const STAGE_NAMES = ['蛋 🥚', '幼年', '成长', '成年', '完全体'];

const PETS = {
  cat:       { name:'猫咪',    emoji:'🐱', rarity:'rare',      color:'#ff9f43' },
  dog:       { name:'小狗',    emoji:'🐶', rarity:'rare',      color:'#ee5a24' },
  hedgehog:  { name:'刺猬',    emoji:'🦔', rarity:'rare',      color:'#d4a373' },
  turtle:    { name:'乌龟',    emoji:'🐢', rarity:'rare',      color:'#6b8f71' },
  panda:     { name:'熊猫',    emoji:'🐼', rarity:'rare',      color:'#636e72' },
  fox:       { name:'狐狸',    emoji:'🦊', rarity:'rare',      color:'#e17055' },
  penguin:   { name:'企鹅',    emoji:'🐧', rarity:'rare',      color:'#74b9ff' },
  capybara:  { name:'卡皮巴拉',emoji:'🦫', rarity:'rare',      color:'#d4a574' },
  redpanda:  { name:'小熊猫',  emoji:'🦝', rarity:'rare',      color:'#e67e22' },
  alpaca:    { name:'羊驼',    emoji:'🦙', rarity:'rare',      color:'#f5e6ca' },
  otter:     { name:'海獭',    emoji:'🦦', rarity:'rare',      color:'#6ab04c' },
  badger:    { name:'蜜獾',    emoji:'🦡', rarity:'rare',      color:'#535c68' },
  unicorn:   { name:'独角兽',  emoji:'🦄', rarity:'legendary', color:'#a29bfe' },
  sloth:     { name:'树懒',    emoji:'🦥', rarity:'legendary', color:'#778ca3' },
  dragon:    { name:'神龙',    emoji:'🐲', rarity:'mythic',    color:'#fd79a8' },
  phoenix:   { name:'凤凰',    emoji:'🔥', rarity:'mythic',    color:'#fdcb6e' },
  kraken:    { name:'海怪',    emoji:'🐙', rarity:'mythic',    color:'#6c5ce7' },
};

const RARITY_LABELS = { rare:'稀有', legendary:'传说', mythic:'神话' };
const RARITY_WEIGHTS = [
  { key:'rare', weight:60 }, { key:'legendary', weight:25 }, { key:'mythic', weight:15 }
];
const DEFAULT_SCORE_TYPES = {
  '单词游戏参与':1, '打卡参与':1, '暑假听课参与':1, '暑假作业参与':1,
  '错题订正参与':1, '问问题积极':1, '额外加分':1
};

let teachers = [];
let currentTeacher = '';
let classes = {};  // { '亚楠': { '小明': { id, pet, rarity, score, stage, history } } }
let scoreTypes = { ...DEFAULT_SCORE_TYPES };
let selectedType = null;
let stageFilter = -1;
let colleagueFilter = -1;

function getMyStudents() {
  if (!currentTeacher || !classes[currentTeacher]) return {};
  return classes[currentTeacher];
}

// ========== PET LOGIC ==========
function randomRarity() {
  const total = RARITY_WEIGHTS.reduce((s,w)=>s+w.weight,0);
  let r = Math.random() * total;
  for (const w of RARITY_WEIGHTS) { r -= w.weight; if (r <= 0) return w.key; }
  return 'common';
}
function randomPet(rarity) {
  const pool = Object.entries(PETS).filter(([k,v])=>v.rarity===rarity);
  return pool[Math.floor(Math.random() * pool.length)][0];
}
function getStage(score) {
  for (let i = STAGE_THRESHOLDS.length-1; i>=0; i--) { if (score >= STAGE_THRESHOLDS[i]) return i; }
  return 0;
}
function getStageProgress(score, stage) {
  const cur = STAGE_THRESHOLDS[stage];
  const next = stage < STAGE_THRESHOLDS.length-1 ? STAGE_THRESHOLDS[stage+1] : cur+100;
  return Math.min(100, Math.round(((score-cur)/(next-cur))*100));
}
function getPetDisplay(petType, stage) {
  const emoji = PETS[petType].emoji;
  if (stage===0) return '🥚';
  if (stage===1) return emoji;
  if (stage===2) return emoji+'⭐';
  if (stage===3) return emoji+'✨';
  return emoji+'👑';
}

// ========== SUPABASE DATA LOADING ==========
async function loadFromSupabase() {
  // 加载教师列表（班级宠物模式）
  const { data: tData, error: tErr } = await supabase
    .from('teachers')
    .select('name, type')
    .eq('type', '班级宠物模式')
    .order('created_at', { ascending: true });
  if (tErr) { console.error('加载教师失败:', tErr); toast('数据库连接失败','error'); return false; }
  teachers = (tData || []).map(t => ({ name: t.name, type: t.type || '班级宠物模式' }));
  if (teachers.length === 0) { currentTeacher = ''; classes = {}; return true; }
  if (!currentTeacher || !teachers.find(t => t.name === currentTeacher)) {
    currentTeacher = teachers[0].name;
  }

  // 加载所有班级宠物模式教师的学生数据
  const teacherNames = teachers.map(t => t.name);
  const { data: sData, error: sErr } = await supabase
    .from('pet_students')
    .select('*')
    .in('teacher_name', teacherNames)
    .order('score', { ascending: false });
  if (sErr) { console.error('加载学生失败:', sErr); return false; }

  classes = {};
  for (const t of teacherNames) classes[t] = {};
  for (const s of (sData || [])) {
    if (!classes[s.teacher_name]) classes[s.teacher_name] = {};
    classes[s.teacher_name][s.name] = {
      id: s.id,
      pet: s.pet_key,
      rarity: s.rarity,
      score: s.score,
      stage: s.stage,
      history: []  // 历史按需加载
    };
  }
  return true;
}

// ========== TEACHER MANAGEMENT ==========
async function addTeacherObj(name) {
  name = name.trim();
  if (!name) return false;
  if (teachers.find(t => t.name === name)) return false;
  const { error } = await supabase
    .from('teachers')
    .insert({ name, type: '班级宠物模式', created_at: new Date().toISOString() });
  if (error) { console.error('添加教师失败:', error); return false; }
  teachers.push({ name, type: '班级宠物模式' });
  classes[name] = {};
  if (!currentTeacher) currentTeacher = name;
  return true;
}

async function removeTeacherObj(name) {
  // 删除 Supabase 中的教师
  await supabase.from('teachers').delete().eq('name', name).eq('type', '班级宠物模式');
  // 删除该教师的所有学生及记录
  const sKeys = Object.keys(classes[name] || {});
  for (const sn of sKeys) {
    const s = classes[name][sn];
    await supabase.from('pet_score_history').delete().eq('student_id', s.id);
  }
  await supabase.from('pet_students').delete().eq('teacher_name', name);
  teachers = teachers.filter(t => t.name !== name);
  delete classes[name];
  if (currentTeacher === name) {
    currentTeacher = teachers.length > 0 ? teachers[0].name : '';
  }
}

async function addTeacherFromBar() {
  const input = document.getElementById('newTeacherInput');
  const name = input.value.trim();
  if (!name) { toast('请输入教师姓名','warn'); return; }
  if (teachers.find(t => t.name === name)) { toast('该教师已存在','warn'); return; }
  const ok = await addTeacherObj(name);
  if (!ok) { toast('添加失败','error'); return; }
  currentTeacher = name;
  input.value = '';
  renderAll();
  toast(`已添加教师「${name}」`,'success');
}

async function delTeacherFromBar() {
  const name = currentTeacher;
  if (!name) { toast('没有可删除的教师','warn'); return; }
  if (!confirm(`确定删除教师「${name}」吗？其所有学生数据也将被删除。`)) return;
  await removeTeacherObj(name);
  renderAll();
  updateUI();
  toast(`已删除教师「${name}」`,'info');
}

async function switchTeacher(name) {
  if (!name || !teachers.find(t => t.name === name)) return;
  currentTeacher = name;
  updateUI();
}

// ========== STUDENT CRUD ==========
async function addStudentToClass(teacher, name) {
  name = name.trim();
  if (!name || !teacher) return null;
  if (!classes[teacher]) classes[teacher] = {};
  if (classes[teacher][name]) return null;
  const rarity = randomRarity(), pet = randomPet(rarity);
  const { data, error } = await supabase
    .from('pet_students')
    .insert({ teacher_name: teacher, name, pet_key: pet, rarity, score: 0, stage: 0, created_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) { console.error('添加学生失败:', error); return null; }
  classes[teacher][name] = { id: data.id, pet, rarity, score: 0, stage: 0, history: [] };
  return { name, pet, rarity };
}

async function addScoreToStudent(teacher, name, points, type) {
  name = name.trim();
  if (!name || !teacher) return null;
  let isNew = false, studentId;
  if (!classes[teacher]) classes[teacher] = {};

  if (!classes[teacher][name]) {
    const rarity = randomRarity(), pet = randomPet(rarity);
    const { data, error } = await supabase
      .from('pet_students')
      .insert({ teacher_name: teacher, name, pet_key: pet, rarity, score: points, stage: 0, created_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error) { console.error('添加学生失败:', error); return null; }
    studentId = data.id;
    classes[teacher][name] = { id: studentId, pet, rarity, score: points, stage: 0, history: [] };
    isNew = true;
  } else {
    studentId = classes[teacher][name].id;
    classes[teacher][name].score += points;
    const newStage = getStage(classes[teacher][name].score);
    classes[teacher][name].stage = newStage;
  }

  const oldStage = isNew ? 0 : (classes[teacher][name].stage);  // already updated above
  const scoreNow = classes[teacher][name].score;

  // 同步更新 Supabase pet_students
  await supabase.from('pet_students').update({ score: scoreNow, stage: classes[teacher][name].stage }).eq('id', studentId);

  // 写入加分记录
  await supabase.from('pet_score_history').insert({
    student_id: studentId, teacher_name: teacher, student_name: name,
    type: type || '其他', score: points, created_at: new Date().toISOString()
  });

  if (!classes[teacher][name].history) classes[teacher][name].history = [];
  classes[teacher][name].history.push({ type: type||'其他', score: points, time: new Date().toLocaleString('zh-CN') });

  return { name, isNew, pet: classes[teacher][name].pet, rarity: classes[teacher][name].rarity, oldStage, newStage: classes[teacher][name].stage, score: scoreNow };
}

async function removeStudentFromClass(teacher, name) {
  const s = classes[teacher] && classes[teacher][name];
  if (!s) return;
  await supabase.from('pet_score_history').delete().eq('student_id', s.id);
  await supabase.from('pet_students').delete().eq('id', s.id);
  delete classes[teacher][name];
}

// ========== UI RENDER ==========
function renderTeacherSwitcher() {
  const sel = document.getElementById('currentTeacherSelect');
  sel.innerHTML = teachers.length === 0
    ? '<option value="">-- 请添加教师 --</option>'
    : teachers.map(t => `<option value="${t.name}" ${currentTeacher===t.name?'selected':''}>${t.name}</option>`).join('');
  if (teachers.length > 0 && !currentTeacher) {
    currentTeacher = teachers[0].name;
    sel.value = teachers[0].name;
  }
  document.getElementById('currentClassLabel').textContent = currentTeacher || '-';
}

function updateUI() {
  renderTeacherSwitcher();
  updateStats();
  renderStudentGrid();
  renderTypeTags();
  renderScoreSelect();
  renderRankings();
  renderRankClassFilter();
  renderColleagueSelect();
}

function renderAll() { updateUI(); }

// ========== STATS ==========
function updateStats() {
  const students = getMyStudents();
  const names = Object.keys(students);
  document.getElementById('statTotal').textContent = names.length;
  if (names.length === 0) {
    document.getElementById('statMaxStage').textContent = '-';
    document.getElementById('statTopScorer').textContent = '-';
    return;
  }
  let maxStage=0, topScorer='', topScore=-1;
  for (const [n,s] of Object.entries(students)) {
    if (s.stage>maxStage) maxStage=s.stage;
    if (s.score>topScore) { topScore=s.score; topScorer=n; }
  }
  document.getElementById('statMaxStage').textContent = STAGE_NAMES[maxStage];
  document.getElementById('statTopScorer').textContent = topScorer;
}

// ========== STUDENT GRID ==========
function renderStudentGrid() {
  const grid = document.getElementById('studentGrid');
  const empty = document.getElementById('emptyStudents');
  const students = getMyStudents();
  const search = (document.getElementById('searchInput').value || '').trim().toLowerCase();

  let filtered = Object.entries(students);
  if (search) filtered = filtered.filter(([n])=>n.toLowerCase().includes(search));
  if (stageFilter >= 0) filtered = filtered.filter(([,s])=>s.stage === stageFilter);

  filtered.sort((a,b)=>b[1].score - a[1].score);
  document.getElementById('resultCount').textContent = `显示 ${filtered.length} / ${Object.keys(students).length} 人`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    grid.innerHTML = filtered.map(([name,s])=>{
      const progress = getStageProgress(s.score, s.stage);
      const display = getPetDisplay(s.pet, s.stage);
      const info = PETS[s.pet];
      return `<div class="student-card">
        ${s.stage===0?'':`<div class="rarity-badge rarity-${s.rarity}">${RARITY_LABELS[s.rarity]}</div>`}
        <div class="score-badge">${s.score}分</div>
        <div class="pet-display" onclick="event.stopPropagation();showHistory('${currentTeacher}','${name.replace(/'/g,"&#39;")}')" style="cursor:pointer" title="${s.stage===0?'点击揭开品种':'查看加分记录'}">${display}</div>
        <div class="name">${name}</div>
        <div class="info">${s.stage===0?'？':info.name} · ${STAGE_NAMES[s.stage]}</div>
        <div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div></div>
        <button class="del-btn" onclick="event.stopPropagation();delStudent('${name}')">✕</button>
      </div>`;
    }).join('');
  }

  const filterTags = document.getElementById('filterTags');
  filterTags.innerHTML = ['全部', ...STAGE_NAMES].map((s,i)=>{
    const val = i-1;
    return `<span class="filter-tag${stageFilter===val?' active':''}" onclick="setStageFilter(${val})">${s}</span>`;
  }).join('');
}

function setStageFilter(val) { stageFilter = val; renderStudentGrid(); }

// ========== SCORE ==========
function renderTypeTags() {
  const container = document.getElementById('typeTags');
  container.innerHTML = Object.entries(scoreTypes).map(([type,val])=>
    `<div class="type-tag${selectedType===type?' active':''}" onclick="selectType('${type}')">${type} (${val}分)</div>`
  ).join('');
  if (!selectedType && Object.keys(scoreTypes).length>0) {
    selectType(Object.keys(scoreTypes)[0]);
  }
}
function selectType(type) {
  selectedType = type;
  renderTypeTags();
}
function renderScoreSelect() {
  const sel = document.getElementById('scoreStudent');
  const students = getMyStudents();
  const names = Object.keys(students).sort((a,b)=>students[b].score-students[a].score);
  sel.innerHTML = names.length===0
    ? '<option value="">-- 请先添加学生 --</option>'
    : names.map(n=>`<option value="${n}">${n}（${students[n].score}分 | ${STAGE_NAMES[students[n].stage]}）</option>`).join('');
}

// ========== RANKINGS ==========
function renderRankClassFilter() {
  const sel = document.getElementById('rankClassFilter');
  sel.innerHTML = '<option value="all">全部班级</option>' +
    teachers.map(t=>`<option value="${t.name}">${t.name}的班级</option>`).join('');
}

function renderRankings() {
  const classFilter = document.getElementById('rankClassFilter').value;
  let allStudents = [];
  for (const [teacher, cls] of Object.entries(classes)) {
    if (classFilter !== 'all' && teacher !== classFilter) continue;
    for (const [name, s] of Object.entries(cls)) {
      allStudents.push({ name, teacher, ...s });
    }
  }

  const petRank = [...allStudents].sort((a,b)=>{
    if (b.stage !== a.stage) return b.stage - a.stage;
    return b.score - a.score;
  });
  const petBody = document.querySelector('#petRankTable tbody');
  const emptyPet = document.getElementById('emptyPetRank');
  if (petRank.length === 0) { petBody.innerHTML=''; emptyPet.classList.remove('hidden'); }
  else {
    emptyPet.classList.add('hidden');
    petBody.innerHTML = petRank.map((s,i)=>{
      const rk=i+1, rc=rk===1?'rank-1':(rk===2?'rank-2':(rk===3?'rank-3':''));
      return `<tr><td><span class="rank-num ${rc}">${rk}</span></td><td><strong>${s.name}</strong></td><td>${s.teacher}</td><td>${getPetDisplay(s.pet,s.stage)} ${s.stage===0?'？':PETS[s.pet].name}</td><td>${STAGE_NAMES[s.stage]}</td><td>${s.score}分</td><td><div style="width:80px"><div class="progress-bar"><div class="progress-fill" style="width:${getStageProgress(s.score,s.stage)}%"></div></div></div></td></tr>`;
    }).join('');
  }

  const scoreRank = [...allStudents].sort((a,b)=>b.score-a.score);
  const scoreBody = document.querySelector('#scoreRankTable tbody');
  const emptyScore = document.getElementById('emptyScoreRank');
  if (scoreRank.length===0) { scoreBody.innerHTML=''; emptyScore.classList.remove('hidden'); }
  else {
    emptyScore.classList.add('hidden');
    scoreBody.innerHTML = scoreRank.map((s,i)=>{
      const rk=i+1, rc=rk===1?'rank-1':(rk===2?'rank-2':(rk===3?'rank-3':''));
      return `<tr><td><span class="rank-num ${rc}">${rk}</span></td><td><strong>${s.name}</strong></td><td>${s.teacher}</td><td>${s.stage===0?'🥚':PETS[s.pet].emoji} ${s.stage===0?'？':PETS[s.pet].name}</td><td><strong>${s.score}分</strong></td><td>${STAGE_NAMES[s.stage]}</td></tr>`;
    }).join('');
  }
}

// ========== COLLEAGUES ==========
function renderColleagueSelect() {
  const sel = document.getElementById('colleagueSelect');
  const others = teachers.filter(t => t.name !== currentTeacher);
  sel.innerHTML = others.length===0
    ? '<option value="">-- 暂无其他教师 --</option>'
    : others.map(t=>`<option value="${t.name}">${t.name}的班级</option>`).join('');
  if (others.length > 0) renderColleagueView();
}

function renderColleagueView() {
  const sel = document.getElementById('colleagueSelect');
  const teacher = sel.value;
  document.getElementById('colleagueName').textContent = teacher || '-';
  const grid = document.getElementById('colleagueGrid');
  const empty = document.getElementById('emptyColleague');

  if (!teacher) { grid.innerHTML=''; empty.classList.remove('hidden'); return; }

  const cls = classes[teacher] || {};
  const search = (document.getElementById('colleagueSearch').value||'').trim().toLowerCase();
  let filtered = Object.entries(cls);
  if (search) filtered = filtered.filter(([n])=>n.toLowerCase().includes(search));
  if (colleagueFilter >= 0) filtered = filtered.filter(([,s])=>s.stage === colleagueFilter);
  filtered.sort((a,b)=>b[1].score-a[1].score);

  document.getElementById('colleagueCount').textContent = `显示 ${filtered.length} / ${Object.keys(cls).length} 人`;

  if (filtered.length===0) { grid.innerHTML=''; empty.classList.remove('hidden'); }
  else {
    empty.classList.add('hidden');
    grid.innerHTML = filtered.map(([name,s])=>{
      const progress = getStageProgress(s.score, s.stage);
      const display = getPetDisplay(s.pet, s.stage);
      const info = PETS[s.pet];
      return `<div class="student-card readonly-card">
        ${s.stage===0?'':`<div class="rarity-badge rarity-${s.rarity}">${RARITY_LABELS[s.rarity]}</div>`}
        <div class="readonly-badge">只读</div>
        <div class="score-badge">${s.score}分</div>
        <div class="pet-display" onclick="event.stopPropagation();showHistory('${teacher.replace(/'/g,"&#39;")}','${name.replace(/'/g,"&#39;")}')" style="cursor:pointer" title="${s.stage===0?'点击揭开品种':'查看加分记录'}">${display}</div>
        <div class="name">${name}</div>
        <div class="info">${s.stage===0?'？':info.name} · ${STAGE_NAMES[s.stage]}</div>
        <div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div></div>
      </div>`;
    }).join('');
  }

  const filterTags = document.getElementById('colleagueFilterTags');
  filterTags.innerHTML = ['全部', ...STAGE_NAMES].map((s,i)=>{
    const val = i-1;
    return `<span class="filter-tag${colleagueFilter===val?' active':''}" onclick="setColleagueFilter(${val})">${s}</span>`;
  }).join('');
}
function setColleagueFilter(val) { colleagueFilter = val; renderColleagueView(); }

// ========== ACTIONS ==========
async function addSingle() {
  if (!currentTeacher) { toast('请先添加教师', 'warn'); return; }
  const input = document.getElementById('singleName');
  const names = input.value.split(/[,，\s]+/).filter(n=>n.trim());
  input.value = '';
  if (names.length===0) { toast('请输入名字', 'warn'); return; }
  const results = [];
  for (const name of names) {
    const r = await addStudentToClass(currentTeacher, name);
    if (r) results.push(r);
  }
  results.length>0 ? showBlindBox(results) : toast('名字已存在或无效', 'warn');
}
async function batchImport() {
  if (!currentTeacher) { toast('请先添加教师', 'warn'); return; }
  const text = document.getElementById('batchNames').value.trim();
  if (!text) { toast('请输入名字列表', 'warn'); return; }
  const names = text.split(/[\n,，]+/).filter(n=>n.trim());
  const results = [];
  for (const name of names) { const r=await addStudentToClass(currentTeacher,name); if(r) results.push(r); }
  document.getElementById('batchNames').value='';
  results.length>0 ? showBlindBox(results) : toast('所有名字已存在', 'warn');
}
async function handleNameFile(e) {
  if (!currentTeacher) { toast('请先添加教师', 'warn'); return; }
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=async function(ev){
    const names=ev.target.result.split(/[\n\r,，]+/).filter(n=>n.trim());
    const results=[];
    for(const name of names){ const r=await addStudentToClass(currentTeacher,name); if(r) results.push(r); }
    results.length>0 ? showBlindBox(results) : toast('文件中的名字已全部存在', 'warn');
  };
  reader.readAsText(file,'UTF-8'); e.target.value='';
}
async function delStudent(name) {
  if (confirm(`确定删除「${name}」吗？`)) {
    await removeStudentFromClass(currentTeacher, name);
    renderAll(); toast(`已删除 ${name}`,'info');
  }
}
async function addScoreSingle() {
  const name = document.getElementById('scoreStudent').value;
  if (!name) { toast('请选择学生', 'warn'); return; }
  const val = parseInt(document.getElementById('scoreValue').value)||0;
  if (val<=0) { toast('分值必须大于0', 'warn'); return; }
  const result = await addScoreToStudent(currentTeacher, name, val, selectedType);
  if (result) { showScoreResult(result, val); renderAll(); }
}
async function addScoreBatch() {
  if (!currentTeacher) { toast('请先选择教师', 'warn'); return; }
  const text = document.getElementById('batchScoreNames').value.trim();
  if (!text) { toast('请输入名字列表', 'warn'); return; }
  const val = parseInt(document.getElementById('batchScoreValue').value)||0;
  if (val<=0) { toast('分值必须大于0', 'warn'); return; }
  const names = text.split(/[\n,，]+/).filter(n=>n.trim());
  document.getElementById('batchScoreNames').value='';
  const results=[];
  for (const name of names) { const r=await addScoreToStudent(currentTeacher,name,val,selectedType); if(r) results.push(r); }
  if (results.length>0) {
    const upgraded=results.filter(r=>r.newStage>r.oldStage), newPets=results.filter(r=>r.isNew);
    let msg=`成功为 ${results.length} 名学生各加 ${val} 分`;
    if (newPets.length>0) msg+=`（其中 ${newPets.length} 名新学生获得盲盒宠物）`;
    if (upgraded.length>0) msg+=`，${upgraded.length} 只宠物升级了！`;
    toast(msg,'success'); renderAll();
  } else { toast('未找到有效名字','warn'); }
}
async function handleScoreFile(e) {
  if (!currentTeacher) { toast('请先选择教师', 'warn'); return; }
  const file=e.target.files[0]; if(!file) return;
  const val = parseInt(document.getElementById('batchScoreValue').value)||0;
  if (val<=0) { toast('请先设置分值','warn'); e.target.value=''; return; }
  const reader=new FileReader();
  reader.onload=async function(ev){
    const names=ev.target.result.split(/[\n\r,，]+/).filter(n=>n.trim());
    const results=[];
    for(const name of names){ const r=await addScoreToStudent(currentTeacher,name,val); if(r) results.push(r); }
    if(results.length>0){
      const upgraded=results.filter(r=>r.newStage>r.oldStage), newPets=results.filter(r=>r.isNew);
      let msg=`成功为 ${results.length} 名学生各加 ${val} 分`;
      if(newPets.length>0) msg+=`（${newPets.length} 名新学生获得盲盒宠物）`;
      if(upgraded.length>0) msg+=`，${upgraded.length} 只宠物升级了！`;
      toast(msg,'success'); renderAll();
    } else { toast('文件中的名字无效','warn'); }
  };
  reader.readAsText(file,'UTF-8'); e.target.value='';
}
function showScoreResult(result, val) {
  const info = PETS[result.pet];
  if (result.isNew) {
    document.getElementById('modalEmoji').textContent = info.emoji;
    document.getElementById('modalTitle').textContent = `🎉 新学生「${result.name}」`;
    document.getElementById('modalDesc').textContent = `获得盲盒宠物：${info.name}（${RARITY_LABELS[result.rarity]}）！加 ${val} 分，当前 ${result.score} 分`;
    document.getElementById('blindModal').classList.remove('hidden');
  } else if (result.newStage > result.oldStage) {
    document.getElementById('modalEmoji').textContent = getPetDisplay(result.pet, result.newStage);
    document.getElementById('modalTitle').textContent = '⬆️ 宠物升级！';
    document.getElementById('modalDesc').textContent = `「${result.name}」的${info.name}从 ${STAGE_NAMES[result.oldStage]} 升级到 ${STAGE_NAMES[result.newStage]}！（加 ${val} 分，当前 ${result.score} 分）`;
    document.getElementById('blindModal').classList.remove('hidden');
  } else {
    toast(`「${result.name}」加 ${val} 分，当前 ${result.score} 分`,'success');
  }
}

// ========== BLIND BOX MODAL ==========
function showBlindBox(results) {
  if (results.length===1) {
    const r=results[0], info=PETS[r.pet];
    document.getElementById('modalEmoji').textContent=info.emoji;
    document.getElementById('modalTitle').textContent=`🎁 拆到：${info.name}`;
    document.getElementById('modalDesc').textContent=`「${r.name}」获得了 ${RARITY_LABELS[r.rarity]} 品质的 ${info.name}！`;
  } else {
    const list=results.map(r=>{const info=PETS[r.pet];return `「${r.name}」→ ${info.emoji} ${info.name}（${RARITY_LABELS[r.rarity]}）`;}).join('<br>');
    document.getElementById('modalEmoji').textContent='🎁';
    document.getElementById('modalTitle').textContent=`批量拆盲盒 x${results.length}`;
    document.getElementById('modalDesc').innerHTML=list;
  }
  document.getElementById('blindModal').classList.remove('hidden'); renderAll();
}
function closeModal() {
  document.getElementById('blindModal').classList.add('hidden');
  document.getElementById('modalDesc').innerHTML='';
}

// ========== HISTORY ==========
async function showHistory(teacher, name) {
  const s = (classes[teacher]||{})[name];
  if (!s) return;
  if (s.stage === 0) {
    const info = PETS[s.pet];
    document.getElementById('modalEmoji').textContent = info.emoji;
    document.getElementById('modalTitle').textContent = '🥚 揭开品种！';
    document.getElementById('modalDesc').innerHTML = `「${name}」的宠物蛋孵化出：<br><strong>${info.name}</strong>（${RARITY_LABELS[s.rarity]}）`;
    document.getElementById('blindModal').classList.remove('hidden');
    return;
  }
  // 从 Supabase 加载历史
  const { data: history } = await supabase
    .from('pet_score_history')
    .select('type, score, created_at')
    .eq('student_id', s.id)
    .order('created_at', { ascending: false });
  document.getElementById('historyTitle').textContent = `${name} 的加分记录`;
  if (!history || history.length === 0) {
    document.getElementById('historyBody').innerHTML = '<p style="text-align:center;color:#999">暂无加分记录</p>';
  } else {
    document.getElementById('historyBody').innerHTML = `<table style="width:100%;font-size:13px"><thead><tr><th>#</th><th>类型</th><th>分值</th><th>时间</th></tr></thead><tbody>${
      history.map((h,i)=>`<tr><td>${i+1}</td><td>${h.type}</td><td>+${h.score}</td><td style="font-size:12px;color:#999">${new Date(h.created_at).toLocaleString('zh-CN')}</td></tr>`).join('')
    }</tbody></table>`;
  }
  document.getElementById('historyModal').classList.remove('hidden');
}
function closeHistory() {
  document.getElementById('historyModal').classList.add('hidden');
}
function toast(msg, type) {
  const existing=document.querySelector('.toast'); if(existing) existing.remove();
  const t=document.createElement('div'); t.className=`toast toast-${type}`; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2500);
}

// ========== TABS ==========
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    this.classList.add('active');
    const tabName=this.dataset.tab;
    ['students','score','rank','colleagues'].forEach(t=>document.getElementById('tab-'+t).classList.add('hidden'));
    document.getElementById('tab-'+tabName).classList.remove('hidden');
    if (tabName==='rank') renderRankings();
    if (tabName==='score') { renderTypeTags(); renderScoreSelect(); }
    if (tabName==='students') { renderStudentGrid(); renderTeacherSwitcher(); }
    if (tabName==='colleagues') { renderColleagueSelect(); }
  });
});

// ========== INIT ==========
(async function init(){
  const loaded = await loadFromSupabase();
  if (!loaded) return;
  if (selectedType===null && Object.keys(scoreTypes).length>0) {
    selectedType=Object.keys(scoreTypes)[0];
  }
  renderAll();
})();
</script>
</body>
</html>
