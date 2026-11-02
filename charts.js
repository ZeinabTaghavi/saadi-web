(() => {
'use strict';
const data=window.SAADI_CHART_DATA,root=document.querySelector('#results-explorer');if(!root||!data)return;
const $=s=>root.querySelector(s),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const configs={
 exposure:{title:'Hit rate at comparable evidence exposure',description:'SAADI’s curve uses BM25. Agent points sit at their observed mean evidence exposure.',axis:'Hit rate (%)',x:'Retrieved chunks / mean trajectory chunks',source:'Figure 2 · Tables 1, 22–23',note:'Fixed-depth methods are placed at their cutoff. Agentic methods are placed at the mean number of distinct chunks admitted before answering; A-RAG counts full-chunk reads. Exposure is not the number of LLM calls.'},
 context:{title:'Retrieval as the document grows',description:'Add distractor documents, from no expansion to 256K tokens.',axis:'Hit rate (%)',x:'Context expansion target',source:'Figure 3(a) · Table 26',note:'Vanilla and SAADI are evaluated at top 10 with BM25 and Contriever. Agents use their pre-answer trajectories, not a fixed top-10 budget. These four agents are the comparators plotted in Figure 3(a); UMA is reported separately in Table 26.'},
 hops:{title:'Retrieval across evidence hops',description:'Compare queries that require evidence from more than one passage.',axis:'Hit rate (%)',x:'Number of evidence hops',source:'Figure 3(b) · Table 21',note:'Vanilla and SAADI are evaluated at top 10 with BM25 and BGE-M3. Agents use their pre-answer trajectories. BGE-M3 values are recovered from the original vector curves and rounded to 0.1 point. MuSiQue has no one-hop bin.'}
};
let mode='exposure',dataset=0,hidden=new Set(),active=false,width=0,raf;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const format=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
const xLabel=(d,x)=>d.labels?d.labels[x]:format(x);
function meta(s){return {...data.meta[s.key],...s};}
function shape(type,x,y,r=4){
 if(type==='square')return `<rect x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}" rx="1"/>`;
 if(type==='triangle')return `<path d="M${x} ${y-r-1} L${x+r+1} ${y+r} L${x-r-1} ${y+r} Z"/>`;
 if(type==='diamond')return `<path d="M${x} ${y-r-1} L${x+r+1} ${y} L${x} ${y+r+1} L${x-r-1} ${y} Z"/>`;
 if(type==='plus')return `<path d="M${x-r} ${y} H${x+r} M${x} ${y-r} V${y+r}" fill="none" stroke-width="3"/>`;
 if(type==='hex')return `<path d="M${x} ${y-r-1} L${x+r} ${y-r/2} V${y+r/2} L${x} ${y+r+1} L${x-r} ${y+r/2} V${y-r/2} Z"/>`;
 return `<circle cx="${x}" cy="${y}" r="${r}"/>`;
}
function renderControls(){
 const d=data[mode][dataset],c=configs[mode];
 root.querySelectorAll('[data-mode]').forEach(b=>{const selected=b.dataset.mode===mode;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;});
 $('#chart-panel').setAttribute('aria-labelledby','tab-'+mode);
 $('#explorer-title').textContent=c.title;$('#explorer-description').textContent=c.description;$('#chart-axis-caption').textContent=c.axis;
 $('#chart-source').textContent='Source: paper, '+c.source+'.';$('#chart-method-note').textContent=c.note;
 $('#chart-datasets').innerHTML=data[mode].map((v,i)=>`<button type="button" data-dataset="${i}" aria-pressed="${i===dataset}">${escape(v.name)}</button>`).join('');
 $('#chart-datasets').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{dataset=+b.dataset.dataset;renderControls();draw(true);$('#chart-datasets').querySelector(`[data-dataset="${dataset}"]`).focus({preventScroll:true});}));
 $('#series-legend').innerHTML=d.series.map(s=>{const m=meta(s);return `<button type="button" data-series="${s.key}" aria-pressed="${!hidden.has(s.key)}" aria-label="${escape(m.label)}: ${hidden.has(s.key)?'hidden':'shown'}"><svg viewBox="0 0 34 16" aria-hidden="true"><path d="M1 8 H33" stroke="${m.color}" stroke-width="2" ${m.dash?`stroke-dasharray="${m.dash}"`:''}/><g fill="${m.color}" stroke="${m.color}">${shape(m.shape,17,8,3)}</g></svg><span>${escape(m.label)}</span></button>`}).join('')+'<button type="button" class="all-series">Show all</button>';
 $('#series-legend').querySelectorAll('[data-series]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.series;if(hidden.has(key))hidden.delete(key);else hidden.add(key);renderControls();draw(false);$('#series-legend').querySelector(`[data-series="${key}"]`).focus({preventScroll:true});}));
 $('.all-series').addEventListener('click',()=>{hidden.clear();renderControls();draw(true);$('.all-series').focus({preventScroll:true});});
 const table=`<table><caption>${escape(d.name)} · ${escape(c.title)}</caption><thead><tr><th scope="col">Method</th><th scope="col">${escape(c.x)}</th><th scope="col">Hit rate (%)</th></tr></thead><tbody>${d.series.map(s=>s.points.map(([x,y])=>`<tr><th scope="row">${escape(meta(s).label)}</th><td>${escape(xLabel(d,x))}</td><td>${format(y)}</td></tr>`).join('')).join('')}</tbody></table>`;
 $('#chart-data-table').innerHTML=table;
}
function hideTip(){const tip=$('.chart-tooltip');tip.hidden=true;root.querySelectorAll('.point-selected').forEach(p=>p.classList.remove('point-selected'));}
function showTip(node,s,point){
 hideTip();node.classList.add('point-selected');const tip=$('.chart-tooltip'),d=data[mode][dataset],m=meta(s),[x,y]=point;
 const label=mode==='exposure'?`${format(x)} ${s.scatter?'mean chunks':'chunks'}`:mode==='context'?`${xLabel(d,x)} ${x===0?'(no expansion)':'tokens'}`:`${x} evidence ${x===1?'hop':'hops'}`;
 tip.innerHTML=`<strong>${escape(m.label)}</strong><span>${escape(d.name)} · ${escape(label)}</span><b>${format(y)}<small>% hit rate</small></b>`;
 tip.hidden=false;
 const box=$('.live-chart').getBoundingClientRect(),r=node.getBoundingClientRect();
 tip.style.left=Math.max(8,Math.min(box.width-tip.offsetWidth-8,r.left-box.left+12))+'px';
 tip.style.top=Math.max(20,r.top-box.top-tip.offsetHeight-12)+'px';
}
function draw(animate=false){
 hideTip();const d=data[mode][dataset],c=configs[mode];
 width=$('#chart-mount').clientWidth||900;const W=Math.max(260,width),H=W<500?340:390,L=W<500?43:55,R=22,T=16,B=H-55;
 const X=x=>L+(x-d.xmin)/(d.xmax-d.xmin)*(W-L-R),Y=y=>B-y/d.ymax*(B-T);
 const step=d.ymax===100?20:10;
 let out=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="${escape(d.name+' · '+c.title)}"><title>${escape(d.name+' · '+c.title)}</title><defs><clipPath id="chart-clip"><rect class="chart-wipe" x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>`;
 for(let y=0;y<=d.ymax;y+=step)out+=`<line x1="${L}" x2="${W-R}" y1="${Y(y)}" y2="${Y(y)}" class="chart-grid-line"/><text x="${L-12}" y="${Y(y)+4}" text-anchor="end" class="chart-tick">${y}</text>`;
 for(const x of d.x)out+=`<line x1="${X(x)}" x2="${X(x)}" y1="${B}" y2="${B+5}" class="chart-tick-line"/><text x="${X(x)}" y="${B+23}" text-anchor="middle" class="chart-tick">${escape(xLabel(d,x))}</text>`;
 out+=`<text x="${(L+W-R)/2}" y="${H-5}" text-anchor="middle" class="chart-x-title">${escape(W<500&&mode==='exposure'?'Chunks / mean trajectory chunks':c.x)}</text><g clip-path="url(#chart-clip)">`;
 // Draw the primary SAADI line last so nearby baselines remain distinguishable.
 const sorted=[...d.series].sort((a,b)=>(a.key==='saadi')-(b.key==='saadi'));
 for(const s of sorted){if(hidden.has(s.key))continue;const m=meta(s);
  if(!s.scatter)out+=`<path class="result-curve" d="${s.points.map(([x,y],i)=>`${i?'L':'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)}`).join(' ')}" stroke="${m.color}" stroke-width="${m.width||1.8}" ${m.dash?`stroke-dasharray="${m.dash}"`:''} fill="none"/>`;
  s.points.forEach(([x,y],i)=>{const label=`${m.label}, ${d.name}, ${xLabel(d,x)} ${mode==='hops'?'hops':mode==='context'?'context':'chunks'}, hit rate ${format(y)} percent`;
   out+=`<g class="chart-point" data-key="${s.key}" data-point="${i}" tabindex="0" role="button" aria-label="${escape(label)}"><circle class="point-hit" cx="${X(x)}" cy="${Y(y)}" r="${s.scatter?12:9}" fill="transparent"/><g class="point-mark" fill="${m.color}" stroke="${m.color}" stroke-width="1">${shape(m.shape,X(x),Y(y),s.scatter?5.5:3)}</g><title>${escape(label)}</title></g>`;
  });
 }
 out+='</g></svg>';$('#chart-mount').innerHTML=out;
 $('#chart-mount').querySelectorAll('.chart-point').forEach(node=>{const s=d.series.find(s=>s.key===node.dataset.key),pt=s.points[+node.dataset.point];const show=()=>showTip(node,s,pt);node.addEventListener('pointerenter',show);node.addEventListener('focus',show);node.addEventListener('click',show);node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show()}if(e.key==='Escape'){hideTip();node.blur()}});node.addEventListener('blur',hideTip);});
 if(active&&animate&&!reduced.matches)replay();
}
function replay(){if(reduced.matches)return;const rect=$('.chart-wipe');if(rect)rect.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:1100,easing:'cubic-bezier(.2,.6,.25,1)',fill:'none'});}
function switchMode(next){mode=next;dataset=0;hidden.clear();renderControls();draw(true);}
const tabs=[...root.querySelectorAll('[data-mode]')];tabs.forEach((b,i)=>{b.addEventListener('click',()=>switchMode(b.dataset.mode));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();switchMode(tabs[n].dataset.mode);tabs[n].focus();});});
$('.chart-replay').addEventListener('click',replay);$('.live-chart').addEventListener('pointerleave',hideTip);
renderControls();draw();new IntersectionObserver((entries,obs)=>{if(entries.some(e=>e.isIntersecting)){active=true;replay();obs.disconnect()}},{threshold:.3}).observe($('.live-chart'));
new ResizeObserver(()=>{const next=$('#chart-mount').clientWidth;if(Math.abs(next-width)>1){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>draw(false));}}).observe($('#chart-mount'));
reduced.addEventListener('change',()=>draw(false));
})();
