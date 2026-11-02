const passages = [{"step": 0, "lines": ["A few words about Dostoevsky himself", "may help the English reader to", "understand his work. Dostoevsky was", "the son of a doctor. \u2026 and so the fourth", "floor on this staircase would be", "untenanted except by the old woman.", "\"That's a good thing anyway,\" he thought", "to himself, as he rang the bell of \u2026"], "highlights": ["Dostoevsky", "old woman"], "entities": ["Fyodor Dostoevsky", "old woman"], "recalled": [], "source_step": 0, "source_steps": [0, 4], "excerpt": "A few words about Dostoevsky himself may help the English reader to understand his work. Dostoevsky was the son of a doctor. \u2026 and so the fourth floor on this staircase would be untenanted except by the old woman. \"That's a good thing anyway,\" he thought to himself, as he rang the bell of \u2026"}, {"step": 1, "lines": ["\"How much will you give me for the", "watch, Alyona Ivanovna?\" \u2026 \"Please", "yourself\"\u2014and the old woman handed", "him back the watch. The young man took", "it, and was so angry that he was on the", "point of going away; but checked himself", "at once, remembering that there was", "nowhere else \u2026"], "highlights": ["Alyona Ivanovna", "old woman"], "entities": ["old woman", "silver watch", "chest of drawers", "keys"], "recalled": ["old woman"], "source_step": 6, "excerpt": "\"How much will you give me for the watch, Alyona Ivanovna?\" \u2026 \"Please yourself\"\u2014and the old woman handed him back the watch. The young man took it, and was so angry that he was on the point of going away; but checked himself at once, remembering that there was nowhere else \u2026"}, {"step": 2, "lines": ["\"Raskolnikov, a student, I came here a", "month ago,\" the young man made haste", "to mutter, with a half bow, remembering", "that he ought to be more polite. \"I", "remember, my good sir, I remember", "quite well your coming here,\" the old", "woman said distinctly, still keeping her", "inquiring eyes on his face. \u2026"], "highlights": ["Raskolnikov"], "entities": ["old woman", "Raskolnikov", "Lizaveta"], "recalled": ["old woman"], "source_step": 5, "excerpt": "\"Raskolnikov, a student, I came here a month ago,\" the young man made haste to mutter, with a half bow, remembering that he ought to be more polite. \"I remember, my good sir, I remember quite well your coming here,\" the old woman said distinctly, still keeping her inquiring eyes on his face. \u2026"}, {"step": 3, "lines": ["Nastasya, the cook and only servant,", "was rather pleased at the lodger's mood", "and had entirely given up sweeping and", "doing his room, only once a week or so", "she would stray into his room with a", "broom. She waked him up that day. \"Get", "up, why are you asleep?\" she called to", "him. \"It's past nine, I have \u2026"], "highlights": ["Nastasya"], "entities": ["Raskolnikov", "Nastasya", "Praskovya Pavlovna"], "recalled": ["Raskolnikov"], "source_step": 24, "excerpt": "Nastasya, the cook and only servant, was rather pleased at the lodger's mood and had entirely given up sweeping and doing his room, only once a week or so she would stray into his room with a broom. She waked him up that day. \"Get up, why are you asleep?\" she called to him. \"It's past nine, I have \u2026"}, {"step": 4, "lines": ["\"Oh, nothing particular, I simply asked.", "You are too quick\u2026 Good\u2010day, Alyona", "Ivanovna.\" Raskolnikov went out in", "complete confusion. This confusion", "became more and more intense. As he", "went down the stairs, he even stopped", "short, two or three times, as though", "suddenly struck by some \u2026"], "highlights": ["Raskolnikov", "old woman"], "entities": ["Raskolnikov", "old woman", "silver cigarette box", "tavern"], "recalled": ["Raskolnikov", "old woman"], "source_step": 7, "excerpt": "\"Oh, nothing particular, I simply asked. You are too quick\u2026 Good\u2010day, Alyona Ivanovna.\" Raskolnikov went out in complete confusion. This confusion became more and more intense. As he went down the stairs, he even stopped short, two or three times, as though suddenly struck by some \u2026"}];
(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const clamp = (x,a=0,b=1) => Math.min(b,Math.max(a,x));
const ease = x => {x=clamp(x);return x*x*(3-2*x)};
const escapeHTML = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Pinned scenes need a tall, wide window: the figure is about 620px high.
const scrollyQuery=matchMedia('(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
const names=['Dostoevsky','old woman','Raskolnikov','Nastasya','','',''];
$('#memory-nodes').innerHTML=names.map((n,i)=>`<div class="entity-node n${i}" aria-hidden="true">${n}</div>`).join('');
const nodes=$$('.entity-node');
let indexStage=-1,queryStage=-1,lastTree='',foldFrame=0,scrolly=false;
const tree = $('#history-tree');
function treeMarkup(level,fold) {
 const edge=[],box=[];
 const line=(x1,y1,x2,y2,o=1)=>edge.push(`<path class="tree-edge" style="opacity:${o}" d="M${x1} ${y1} V${(y1+y2)/2} H${x2} V${y2}"/>`);
 const node=(x,y,w,h,l,label,opacity=1)=>box.push(`<g style="opacity:${opacity}"><rect class="tree-node level${l}" x="${x-w/2}" y="${y}" width="${w}" height="${h}" rx="${l?5:2}"/>${label?`<text class="${l?'tree-label':'tree-chunk-label'}" x="${x}" y="${y+h/2+4}" text-anchor="middle">${label}</text>`:''}</g>`);
 const f=ease(fold),xs=[90,220,350,480,610];
 if(level===0){xs.forEach((x,i)=>{if(i<(indexStage<2?1:2))node(x,115,66,42,0,'C'+(i+1));});}
 if(level===1){
  xs.forEach((x,i)=>{const y=115+24*f;line(x,y,350,78,f);node(x,y,68,42,0,'C'+(i+1));});
  node(350,39,150,42,1,'L1',f);
 }
 if(level===2){
  xs.forEach(x=>{line(x,101,350,67,f);node(x,101,88,34,1,'L1');for(let j=0;j<5;j++){const cx=x-42+j*21;line(cx,177,x,135);node(cx,177,14,23,0,'');}});
  node(350,25,150,42,2,'L2',f);
 }
 if(level===3){
  xs.forEach((x,i)=>{line(x,77,350,49,f);node(x,77,88,32,2,'L2');if(i!==2)box.push(`<text x="${x}" y="131" text-anchor="middle" fill="#8da7c6" font-size="20">…</text>`);});
  const children=[142,246,350,454,558];
  children.forEach(x=>{line(x,145,350,109);node(x,145,66,27,1,'L1');for(let j=0;j<5;j++){const cx=x-33+j*16.5;line(cx,195,x,172);node(cx,195,11,16,0,'');}});
  node(350,8,150,41,3,'L3',f);
 }
 return edge.join('')+box.join('');
}
function paintIndex(stage,local=1){
 stage=clamp(stage,0,5);
 if(indexStage!==stage){
  indexStage=stage;
  const passage=passages[stage<2?0:stage===2?1:stage===3?4:3];
  let text=escapeHTML(passage.excerpt);
  for(const h of passage.highlights)text=text.replaceAll(escapeHTML(h),`<mark>${escapeHTML(h)}</mark>`);
  $('#document-text').innerHTML=text;
  $('#passage-label').textContent=stage<2?'C1':stage===2?'C2':stage===3?'C5':'…';
  $('#chunk-indicator').textContent=stage<2?'C1':stage===2?'C2':stage===3?'C1–C5':stage===4?'25 chunks':'125 chunks';
  $('#memory-action').textContent=['Empty','Add records','Recall + update','Accumulate','Recall + update','Reusable state'][stage];
  nodes.forEach((n,i)=>{const visible=stage===0?false:stage<3?i<2:true;n.style.opacity=visible?'1':'0';n.style.transform=visible?'scale(1)':'scale(.4)';n.classList.toggle('recalled',stage===2&&i===1||stage===4&&(i===2||i===3));});
  $('.n1').textContent=stage<2?'old woman':'old woman / Alyona';
  $('#memory-record').style.opacity=stage===0?'0':'1';
  $('.alias-line').style.visibility=stage<2?'hidden':'visible';
  $('#recall-arrow').style.opacity=stage===2||stage===4?'1':'0';
  $('#fold-label').textContent=['Recent chunks','Recent chunks','Recent chunks','5 chunks → L1','5 L1 → L2','5 L2 → L3'][stage];
  $('#history-note').textContent=stage<3?'The latest chunk enters the history.':stage===3?'Summaries preserve earlier context as reading continues.':stage===4?'Recent chunks + earlier L1 + earlier L2.':'Broader history, with one branch expanded for clarity.';
 }
 const level=Math.max(0,stage-2);
 const f=level?ease((local-.08)/.62):1;
 const signature=level+':'+Math.round(f*100)+':'+stage;
 if(lastTree!==signature){tree.innerHTML=treeMarkup(level,f);lastTree=signature;}
 $('#document-text').style.transform=`translateY(${-Math.round(clamp(local-.35)*17)}px)`;
}
// Each step replays its fold once it becomes active, whatever the scroll speed.
function playIndex(stage){
 cancelAnimationFrame(foldFrame);
 if(reduced.matches){paintIndex(stage,1);return;}
 const start=performance.now();
 const tick=now=>{const t=clamp((now-start)/1400);paintIndex(stage,t);if(t<1)foldFrame=requestAnimationFrame(tick);};
 paintIndex(stage,0);foldFrame=requestAnimationFrame(tick);
}
function paintQuery(stage){
 stage=clamp(stage,0,2);if(stage===queryStage)return;queryStage=stage;
 $('#query-scene').dataset.stage=stage;
 $('.rank-status').textContent=['Text signal','Text + memory','Text + memory + summary'][stage];
}
const chapters=[{root:$('#indexing'),paint:playIndex},{root:$('#query-time'),paint:paintQuery}].map(c=>({...c,steps:$$('.step',c.root),stage:-1}));
function setStage(chapter,i){
 if(chapter.stage===i)return;chapter.stage=i;
 chapter.steps.forEach((s,j)=>s.classList.toggle('is-active',j===i));
 chapter.buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));
 chapter.paint(i);
}
chapters.forEach(chapter=>{
 const group=chapter.root.querySelector('.step-controls');
 group.innerHTML=chapter.steps.map((s,i)=>`<button type="button" aria-pressed="false" aria-label="Step ${i+1}: ${escapeHTML(s.querySelector('b').textContent)}">${i+1}</button>`).join('');
 chapter.buttons=$$('button',group);
 chapter.buttons.forEach((b,i)=>b.addEventListener('click',()=>setStage(chapter,i)));
 setStage(chapter,0);
});
// On wide screens the step crossing the middle of the window drives the pinned scene.
const stepObserver=new IntersectionObserver(entries=>{if(!scrolly)return;entries.forEach(e=>{if(!e.isIntersecting)return;const chapter=chapters.find(c=>c.steps.includes(e.target));setStage(chapter,chapter.steps.indexOf(e.target));});},{rootMargin:'-45% 0px -50% 0px'});
function setMode(){
 scrolly=scrollyQuery.matches;document.documentElement.classList.toggle('js-scrolly',scrolly);
 stepObserver.disconnect();if(scrolly)chapters.forEach(c=>c.steps.forEach(s=>stepObserver.observe(s)));
}
document.documentElement.classList.add('js-ready');setMode();scrollyQuery.addEventListener('change',setMode);
const navLinks=$$('.nav nav a');
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-40% 0px -55% 0px'});
['#top',...navLinks.map(a=>a.getAttribute('href'))].forEach(id=>{const section=$(id);if(section)navObserver.observe(section);});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.3});observer.observe($('.agent-chart'));
function openHash(){let el;try{el=document.querySelector(location.hash)}catch{}if(el){for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;setTimeout(()=>el.scrollIntoView({behavior:'auto',block:'start'}),30);}}
addEventListener('hashchange',openHash);if(location.hash)openHash();
if(window.renderMathInElement)window.renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false});
$('#copybib').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#bib').textContent);$('#copybib').textContent='Copied';setTimeout(()=>$('#copybib').textContent='Copy',1600);}catch{$('#copybib').textContent='Select citation below';const selection=getSelection();const range=document.createRange();range.selectNodeContents($('#bib'));selection.removeAllRanges();selection.addRange(range);}});
})();
