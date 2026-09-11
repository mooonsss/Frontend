// 界面渲染、计分与计时分开处理，方便逐步学习。
const panel = document.querySelector('#quiz');
const questions = quizData.questions;
let current = 0;
let score = 0;
let records = [];
let timed = false;
let answered = false;
let timer = null;
let deadline = 0;
let phase = 'intro';
const letters = ['A', 'B', 'C', 'D'];
// 题目含 HTML 标签，用转义保证它们作为文字显示。
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function stopTimer() { clearInterval(timer); timer = null; }
function showIntro() {
  stopTimer(); phase = 'intro';
  panel.innerHTML = `<div class="intro-top"><span class="small-label">准备好检验一下了吗？</span><span class="pill">入门难度</span></div><div class="intro-art" aria-hidden="true">?</div><h2>从一道题开始。</h2><p class="intro-copy">不必急着给出答案，想一想，再做选择。<br>完成 ${questions.length} 道题，看看你掌握了多少。</p><div class="stats"><div><strong>${questions.length} <span class="hint">道</span></strong><small>精选选择题</small></div><div><strong>3 <span class="hint">类</span></strong><small>基础知识点</small></div><div><strong>+1 <span class="hint">分</span></strong><small>每答对一题</small></div></div><label class="timer-setting"><input id="timed" type="checkbox" ${timed ? 'checked' : ''}><span>开启限时挑战<small>每题 60 秒 · 超时扣 1 分并自动进入下一题</small></span></label><button class="primary start" id="start">开始测验 <span aria-hidden="true">→</span></button>`;
  document.querySelector('#start').addEventListener('click', () => startQuiz(document.querySelector('#timed').checked));
}
function startQuiz(useTimer) {
  timed = useTimer; current = 0; score = 0; records = []; phase = 'question';
  showQuestion();
}
function showQuestion() {
  stopTimer(); answered = false;
  const q = questions[current];
  panel.innerHTML = `<div class="question-meta"><span>第 ${current + 1} / ${questions.length} 题</span><span>得分 <b>${score}</b> ${timed ? ' · <span id="clock" class="clock">01:00</span>' : ' · 自由练习'}</span></div><div class="progress" role="progressbar" aria-label="测验进度" aria-valuenow="${current}" aria-valuemin="0" aria-valuemax="${questions.length}"><div style="width:${current / questions.length * 100}%"></div></div><span class="pill">${escapeHTML(q.category)}</span><h2 class="question-title" tabindex="-1">${escapeHTML(q.question)}</h2><div class="answers">${q.options.map((option, i) => `<button class="answer" data-index="${i}"><span class="letter">${letters[i]}</span><span>${escapeHTML(option)}</span></button>`).join('')}</div><div id="feedback" aria-live="polite"></div><div class="question-bottom"><span class="hint">${records.at(-1)?.selected === null ? '上一题超时，已扣 1 分。' : '选择一个答案，即可查看解析。'}</span><button id="next" class="primary" hidden>${current === questions.length - 1 ? '查看成绩' : '下一题 →'}</button></div>`;
  panel.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => selectAnswer(Number(button.dataset.index))));
  document.querySelector('#next').addEventListener('click', nextQuestion);
  panel.querySelector('h2').focus();
  if (timed) {
    deadline = Date.now() + 60000;
    timer = setInterval(tick, 200);
  }
}
function tick() {
  if (phase !== 'question' || answered || !timed) return;
  const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  const clock = document.querySelector('#clock');
  clock.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  clock.classList.toggle('urgent', remaining <= 10);
  if (remaining === 0) { selectAnswer(null); nextQuestion(); }
}
function selectAnswer(selected) {
  if (phase !== 'question' || answered) return;
  if (selected !== null && (!Number.isInteger(selected) || selected < 0 || selected >= questions[current].options.length)) throw new Error('无效选项');
  if (selected !== null && timed && Date.now() >= deadline) { tick(); return; }
  answered = true; stopTimer();
  const q = questions[current];
  const correct = selected === q.answer;
  score += selected === null ? -1 : correct ? 1 : 0;
  records.push({selected, correct});
  panel.querySelectorAll('.answer').forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) { button.classList.add('correct'); button.insertAdjacentHTML('beforeend', '<span class="state">✓ 正确答案</span>'); }
    else if (i === selected) { button.classList.add('wrong'); button.insertAdjacentHTML('beforeend', '<span class="state">✕ 你的选择</span>'); }
  });
  panel.querySelector('.question-meta b').textContent = score;
  document.querySelector('#feedback').innerHTML = `<div class="feedback"><strong>${selected === null ? '时间到，扣 1 分' : correct ? '✓ 回答正确！+1 分' : '✕ 回答错误，再记住这个知识点。'}</strong><p>正确答案：${letters[q.answer]} · ${escapeHTML(q.options[q.answer])}</p><p>${escapeHTML(q.explanation)}</p></div>`;
  document.querySelector('#next').hidden = false;
}
function nextQuestion() {
  if (phase !== 'question' || !answered) return;
  current++;
  if (current === questions.length) showResults(); else showQuestion();
}
function showResults() {
  stopTimer(); phase = 'results';
  const correctCount = records.filter(r => r.correct).length;
  const timeoutCount = records.filter(r => r.selected === null).length;
  panel.innerHTML = `<span class="pill">测验完成</span><div class="result-score">${score}<small> / ${questions.length} 分</small></div><h2 tabindex="-1">${correctCount === questions.length ? '全部答对，基础很扎实！' : '每一次练习，都有收获。'}</h2><p class="intro-copy">答对 ${correctCount} 题 · 答错 ${questions.length - correctCount - timeoutCount} 题 · 超时 ${timeoutCount} 题<br>正确率 ${Math.round(correctCount / questions.length * 100)}%${timeoutCount ? ' · 超时每题扣 1 分，允许负分' : ''}</p><button id="restart" class="primary start">再练一次 <span>↻</span></button><div class="result-list"><h3>答题回顾</h3>${questions.map((q, i) => { const r = records[i]; return `<article class="result-item"><span class="result-status ${r.correct ? '' : 'bad'}">${r.selected === null ? '◷ 超时 · −1 分' : r.correct ? '✓ 正确 · +1 分' : '✕ 错误 · 0 分'} · ${escapeHTML(q.category)}</span><h3>${i + 1}. ${escapeHTML(q.question)}</h3><p>你的答案：${r.selected === null ? '未作答' : letters[r.selected] + ' · ' + escapeHTML(q.options[r.selected])}</p><p>正确答案：${letters[q.answer]} · ${escapeHTML(q.options[q.answer])}</p><p class="result-explanation">${escapeHTML(q.explanation)}</p></article>`; }).join('')}</div>`;
  document.querySelector('#restart').addEventListener('click', () => { showIntro(); document.querySelector('#start').focus(); });
  panel.querySelector('h2').focus();
}
showIntro();
// 可选的浏览器代理接口；不支持时不影响正常测验。
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const tool = {name:'answer_quiz_question', description:'选择当前测验题的答案并显示反馈；需先在页面开始测验。', inputSchema:{type:'object',properties:{index:{type:'integer',minimum:0,maximum:3}},required:['index'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input) {
    if (phase !== 'question' || answered) throw new Error('当前没有可回答的问题');
    if (!input || !Number.isInteger(input.index) || input.index < 0 || input.index > 3) throw new Error('选项下标必须为 0 到 3');
    selectAnswer(input.index); return {score, answered, question:current + 1};
  }};
  try { Promise.resolve(document.modelContext.registerTool(tool, {signal:lifecycle.signal})).catch(() => {}); } catch {}
  window.addEventListener('pagehide', () => lifecycle.abort(), {once:true});
}
