(() => {
'use strict';
const root=document.querySelector('#hero-animation'),scene=document.querySelector('#hero-scene');if(!root||!scene)return;
const $=s=>scene.querySelector(s),$$=s=>[...scene.querySelectorAll(s)];
const tiles=$$('.hs-chunk'),folds=$$('.hs-fold'),summaries=$$('.hs-l1'),top=$('.hs-l2'),topFold=$('.hs-fold-l2'),head=$('#hs-head');
const chips=Object.fromEntries($$('.hs-chip').map(c=>[c.dataset.e,c]));
const query=$('#hs-query'),queryText=$('#hs-query-text'),tray=$('#hs-tray'),answer=$('#hs-answer'),count=$('#hs-count'),caption=$('#hs-caption');
const pageCaption=document.querySelector('#hero-caption'),toggle=document.querySelector('#scene-toggle');
const watch=document.querySelector('#overview-watch'),videoBox=document.querySelector('#hero-video'),video=document.querySelector('#overview-video'),back=document.querySelector('#overview-back');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Each question is answered by a passage shown in the story section.
const questions=[
 {text:'Who was Alyona Ivanovna?',answer:'“…untenanted except by the old woman.”',chunk:0,entities:['woman','alias']},
 {text:'Who wakes Raskolnikov?',answer:'“Nastasya … waked him up that day.”',chunk:24,entities:['rask','nast']},
 {text:'When did Raskolnikov last visit?',answer:'“I came here a month ago.”',chunk:5,entities:['rask','woman']}
];
const restart=(el,cls)=>{el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);};
const on=(el,state=true)=>el.classList.toggle('is-on',state);
function say(text,page=text){if(caption.textContent!==text){caption.textContent=text;restart(caption,'is-swap');}pageCaption.textContent=page;}
function clearHits(){scene.querySelectorAll('.is-hit').forEach(el=>el.classList.remove('is-hit'));}
function reset(){
 scene.querySelectorAll('.is-on,.is-read,.is-hit,.is-recalled').forEach(el=>el.classList.remove('is-on','is-read','is-hit','is-recalled'));
 head.style.transform='';queryText.textContent='';answer.textContent='';count.textContent='';
 say('SAADI reads the document once, in order.');
}
function read(i){
 const x=el=>el.querySelector('rect').x.baseVal.value;
 head.style.transform=`translateX(${x(tiles[i])-x(tiles[0])}px)`;on(head);tiles[i].classList.add('is-read');
}
function fold(g){on(folds[g]);on(summaries[g]);}
function ask(n){
 const q=questions[n];clearHits();
 queryText.textContent=q.text;count.textContent=`${n+1} / ${questions.length}`;on(query);restart(query,'is-swap');
 say('Each question reuses the same index.',`Each question reuses the same index: “${q.text}”`);
}
function hit(n){const q=questions[n];tiles[q.chunk].classList.add('is-hit');summaries[Math.floor(q.chunk/5)].classList.add('is-hit');q.entities.forEach(e=>chips[e].classList.add('is-hit'));}
function respond(n){answer.textContent=questions[n].answer;on(tray);restart(answer,'is-swap');}
// Timeline in milliseconds: read 25 chunks, fold, then answer three questions.
const STEP=300,READ=500,events=[];
const at=(t,f)=>events.push([t,f]);
at(0,reset);
for(let i=0;i<25;i++)at(READ+i*STEP,()=>read(i));
for(let g=0;g<5;g++)at(READ+(g*5+4)*STEP+220,()=>fold(g));
at(READ+120,()=>{on(chips.dost);on(chips.woman);});
at(READ+4*STEP+260,()=>say('Every five chunks fold into one summary.'));
at(READ+5*STEP+120,()=>on(chips.rask));
at(READ+10*STEP+120,()=>{restart(chips.woman,'is-recalled');on(chips.alias);say('A later passage links “the old woman” to her name.');});
at(READ+16*STEP,()=>say('Entities are recalled and extended as it reads.'));
at(READ+24*STEP+120,()=>on(chips.nast));
at(READ+25*STEP+700,()=>{on(head,false);on(topFold);on(top);say('Five summaries fold again, one level up.');});
const BUILT=READ+25*STEP+2300,ASK=BUILT+1600,EACH=3800;
at(BUILT,()=>say('The index is built once, before the first question.'));
questions.forEach((q,n)=>{at(ASK+n*EACH,()=>ask(n));at(ASK+n*EACH+700,()=>hit(n));at(ASK+n*EACH+1300,()=>respond(n));});
const FINAL=ASK+questions.length*EACH,LOOP=FINAL+3400;
at(FINAL,()=>{clearHits();say('Understand once. Retrieve many times.');});
events.sort((a,b)=>a[0]-b[0]);
let time=0,next=0,last=0,frame=0,playing=true,visible=true,videoOpen=false;
const running=()=>playing&&visible&&!videoOpen&&!document.hidden;
function tick(now){
 frame=0;time+=last?Math.min(1000,now-last):0;last=now;
 while(next<events.length&&events[next][0]<=time)events[next++][1]();
 if(time>=LOOP){time=0;next=0;}
 schedule();
}
function schedule(){if(running()){if(!frame)frame=requestAnimationFrame(tick);}else{cancelAnimationFrame(frame);frame=0;last=0;}}
// Reduced motion shows the finished index with the first question answered.
function finish(){
 reset();
 tiles.forEach(t=>t.classList.add('is-read'));[...folds,...summaries,topFold,top,...Object.values(chips)].forEach(el=>on(el));
 ask(0);hit(0);respond(0);
 say('Understand once. Retrieve many times.');
}
function applyMotion(){
 toggle.hidden=reduced.matches;
 if(reduced.matches){playing=false;schedule();finish();}
 else{playing=toggle.getAttribute('aria-pressed')!=='true';time=0;next=0;schedule();}
}
toggle.addEventListener('click',()=>{playing=!playing;toggle.setAttribute('aria-pressed',String(!playing));toggle.setAttribute('aria-label',playing?'Pause animation':'Play animation');schedule();});
new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();}).observe(root);
document.addEventListener('visibilitychange',schedule);
reduced.addEventListener('change',applyMotion);applyMotion();
watch.addEventListener('click',()=>{videoOpen=true;schedule();root.hidden=true;pageCaption.hidden=true;videoBox.hidden=false;watch.setAttribute('aria-expanded','true');video.focus();video.play().catch(()=>{});});
back.addEventListener('click',()=>{video.pause();videoBox.hidden=true;root.hidden=false;pageCaption.hidden=false;videoOpen=false;watch.setAttribute('aria-expanded','false');schedule();watch.focus();});
})();
