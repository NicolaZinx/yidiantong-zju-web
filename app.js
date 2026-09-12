'use strict';
const $=selector=>document.querySelector(selector);
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const welcomeText='Hi！同学你好，我是浙江大学马建青教授团队开发的“思政课一点通”AI助手。是经统编思政教材喂养起来的哦~同学们有什么想知道答案，或者想和我说的事，请编辑成文字或者上传图片，发送给我吧!';
const starters=['我国的国体和政体分别是什么？依据是什么？','AI思政课一点通如何赋能于思政课教学？','我最近压力好大，怎么办？'];
const sampleQuestion='怎样核查一条教学资料的来源？';
const sampleAnswer='可以从三个步骤入手：\n\n1. 找到原始出处，确认资料由谁发布。\n2. 核对发布时间和上下文，避免把不同语境的内容混在一起。\n3. 把能确认的事实与仍需核实的部分分开说明。[1]\n\n以下来源按钮展示如何展开出处。这是一段预先撰写的界面示例，不是实时生成的问答。';
const sampleSource='示例说明：找到原始出处；核对时间与上下文；区分已确认事实和待核实信息。\n\n本段由预览页作者为演示来源交互而撰写，不引用教材、知识库原文或用户会话，也不作为权威原典。';
let sampleVisited=false,showingSample=false,noticeTimer;
function notice(text){clearTimeout(noticeTimer);$('#notice').textContent=text;$('#notice').hidden=false;noticeTimer=setTimeout(()=>$('#notice').hidden=true,6500);}
function closeSidebar(){$('#sidebar').classList.remove('open');$('#sidebar-scrim').hidden=true;}
function modal(title,body){$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=body;$('#dialog').showModal();}
function welcome(){return `<section class="welcome"><img class="welcome-logo" src="./logo.png" width="98" height="98" alt="一点通标识"><h1>浙大·AI思政课一点通</h1><div class="welcome-text">${e(welcomeText)}</div><div class="starter-list">${starters.map(q=>`<button type="button" data-action="question" data-question="${e(q)}">${e(q)}</button>`).join('')}</div></section>`;}
function sample(){return `<article class="message message-user"><div class="user-bubble">${e(sampleQuestion)}</div></article><article class="message message-assistant"><div class="answer-card"><div class="answer-label sample-label">一点通 · 预先撰写的示例</div><details class="thinking"><summary><span><i class="thinking-symbol" aria-hidden="true">?</i>过程说明 · 示例</span></summary><div class="thinking-text">用一段简短资料展示提问、回答、来源和追问的阅读方式。这是界面说明，不是模型思维过程。</div></details><div class="answer-content">${e(sampleAnswer).replace('[1]','<button class="citation" type="button" data-action="source" aria-label="查看示例来源 1">1</button>')}</div><div class="sources-row"><span>示例来源（1）</span><button type="button" data-action="source">[1] 本页示例说明</button></div></div><div class="message-actions"><button type="button" data-action="copy">复制示例</button></div><div class="follow-ups"><span>示例追问</span><button type="button" data-action="question" data-question="两个资料说法不一致时，应该怎样核对？">两个资料说法不一致时，应该怎样核对？</button></div></article>`;}
function render(){$('#history-list').innerHTML=sampleVisited?`<button class="history-item ${showingSample?'active':''}" type="button" data-action="example"><span>来源核查示例</span><small>预览示例</small></button>`:'<p class="empty-history">暂无历史记录</p>';$('#messages').innerHTML=showingSample?sample():welcome();$('#messages').scrollTop=0;}
function showExample(){sampleVisited=true;showingSample=true;render();closeSidebar();}
function send(){const value=$('#message-input').value.trim();if(!value)return;notice('在线问答正在接入，请先点击“查看示例”。');}
const icon=paths=>`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
$('#file-button').innerHTML=icon('<path d="M3 7V5a1 1 0 0 1 1-1h5l3 3h8a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"/><path d="M12 16v-5m-3 3 3-3 3 3"/>');
$('#voice-button').innerHTML=icon('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-3 0h6"/>');
$('#clear-button').innerHTML=icon('<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 10v7m4-7v7"/>');
$('#example-button').addEventListener('click',showExample);
$('#new-button').addEventListener('click',()=>{showingSample=false;$('#message-input').value='';render();closeSidebar();});
$('#clear-button').addEventListener('click',()=>{sampleVisited=false;showingSample=false;$('#message-input').value='';render();});
$('#chat-form').addEventListener('submit',event=>{event.preventDefault();send();});
$('#message-input').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();send();}});
$('#message-input').addEventListener('input',event=>{event.target.style.height='auto';event.target.style.height=Math.min(event.target.scrollHeight,130)+'px';});
$('#preview-button').addEventListener('click',()=>{closeSidebar();modal('一点通形象',`<img class="preview-image" src="./avatar.jpg" width="976" height="995" alt="一点通静态人物形象"><p class="preview-caption">静态形象预览 · 语音互动暂不可用</p>`);});
$('#menu-button').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#sidebar-scrim').hidden=false;});
$('#sidebar-scrim').addEventListener('click',closeSidebar);
$('#dialog-close').addEventListener('click',()=>$('#dialog').close());
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSidebar();});
$('#dialog').addEventListener('click',event=>{if(event.target===$('#dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('#dialog').close();}});
document.body.addEventListener('click',async event=>{
  const button=event.target.closest('[data-action]');if(!button)return;
  if(button.dataset.action==='example')showExample();
  if(button.dataset.action==='question'){$('#message-input').value=button.dataset.question;notice('在线问答正在接入，请先点击“查看示例”。');}
  if(button.dataset.action==='source')modal('示例来源详情',`<h3>本页示例说明</h3><dl><dt>类型</dt><dd>预览页原创说明</dd><dt>位置</dt><dd>来源核查示例，第 1 段</dd></dl><pre>${e(sampleSource)}</pre>`);
  if(button.dataset.action==='copy'){try{await navigator.clipboard.writeText('【预先撰写的示例】\n'+sampleQuestion+'\n'+sampleAnswer);notice('示例已复制。');}catch{notice('可以选中示例文字进行复制。');}}
});
render();
