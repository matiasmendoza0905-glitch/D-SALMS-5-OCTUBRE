/* D'Salms — Investigación pública: análisis académico de 15 registros anónimos. */
(()=>{
'use strict';
const questions=[
{title:'¿Qué impresión general te transmite D’Salms?',options:['Muy buena','Buena','Regular','Mala','Muy mala'],type:'pie',dimension:'Impresión general'},
{title:'¿Cómo calificas el diseño del logotipo de D’Salms?',options:['Excelente','Bueno','Regular','Malo','Muy malo'],type:'bar',dimension:'Logotipo'},
{title:'¿Qué te parecen los colores corporativos de D’Salms?',options:['Muy atractivos','Atractivos','Regulares','Poco atractivos','Nada atractivos'],type:'donut',dimension:'Color corporativo'},
{title:'¿Qué tan adecuada te parece la tipografía de la marca?',options:['Muy adecuada','Adecuada','Regular','Poco adecuada','Nada adecuada'],type:'horizontal',dimension:'Tipografía'},
{title:'¿Qué tan atractivos te parecen los diseños de sus prendas?',options:['Muy atractivos','Atractivos','Regulares','Poco atractivos','Nada atractivos'],type:'pie',dimension:'Diseño de prendas'},
{title:'¿Cómo percibes la integración de mensajes de fe en las prendas?',options:['Muy bien integrada','Bien integrada','Regular','Poco integrada','Nada integrada'],type:'donut',dimension:'Mensajes de fe'},
{title:'¿Qué tan coherentes son el logotipo, los colores, las prendas y las publicaciones?',options:['Muy coherentes','Coherentes','Regulares','Poco coherentes','Nada coherentes'],type:'bar',dimension:'Coherencia visual'},
{title:'¿Qué aspecto valorarías más al elegir una prenda D’Salms?',options:['Diseño y originalidad','Calidad y comodidad','Mensajes de fe','Colores y combinaciones','Precio'],type:'pie',dimension:'Factores de elección'},
{title:'¿Por qué canal preferirías conocer las novedades de D’Salms?',options:['Instagram','Facebook','TikTok','WhatsApp','Página web'],type:'horizontal',dimension:'Canales digitales'},
{title:'¿Qué aspecto debería mejorar principalmente D’Salms?',options:['Publicaciones y redes','Variedad de prendas','Fotografías de producto','Información de prendas','Navegación de la web'],type:'pareto',dimension:'Prioridades de mejora'}
];
// Respuestas ordenadas por las opciones de cada pregunta (1–5), reproducidas del ejercicio académico.
const raw=[
[1,2,1,2,1,1,2,1,1,1],[2,1,2,2,2,2,2,2,3,2],[1,1,1,1,1,1,1,1,1,3],
[2,2,2,3,2,2,3,3,2,1],[2,2,1,2,2,1,2,1,1,4],[3,3,2,3,3,3,3,5,4,2],
[2,2,1,2,1,2,2,2,3,1],[1,1,1,1,1,1,1,3,1,3],[2,2,2,2,2,2,2,1,2,5],
[3,3,3,3,2,3,3,5,4,4],[2,2,1,2,2,1,2,2,1,2],[1,1,1,1,1,1,1,1,3,3],
[2,2,2,3,2,2,3,3,2,1],[2,3,2,2,2,2,2,4,4,5],[1,1,1,2,1,1,1,1,1,2]
];
const N=raw.length,colors=['#2DB7C7','#4B1B6B','#B22222','#8f6db3','#c49b72'];
const pct=n=>(100*n/N).toFixed(1).replace(/\.0$/,'')+'%';
const counts=qi=>questions[qi].options.map((label,i)=>({label,count:raw.filter(row=>row[qi]===i+1).length,index:i}));
const svgEl=(tag,attrs={},txt)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(txt!==undefined)el.textContent=txt;return el};
const mk=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};
function arc(cx,cy,r,a,b){const rad=deg=>deg*Math.PI/180;const x1=cx+r*Math.cos(rad(a)),y1=cy+r*Math.sin(rad(a)),x2=cx+r*Math.cos(rad(b)),y2=cy+r*Math.sin(rad(b));return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${b-a>180?1:0} 1 ${x2} ${y2} Z`}
function donutArc(cx,cy,outer,inner,a,b){const rad=deg=>deg*Math.PI/180,pt=(r,t)=>[cx+r*Math.cos(rad(t)),cy+r*Math.sin(rad(t))];const [a1,a2]=pt(outer,a),[b1,b2]=pt(outer,b),[c1,c2]=pt(inner,b),[d1,d2]=pt(inner,a);return `M ${a1} ${a2} A ${outer} ${outer} 0 ${b-a>180?1:0} 1 ${b1} ${b2} L ${c1} ${c2} A ${inner} ${inner} 0 ${b-a>180?1:0} 0 ${d1} ${d2} Z`}
function chart(qi,target,compact=false){
 const q=questions[qi],data=counts(qi),wrapper=mk('div','study-chart-inner');wrapper.style.width='100%';
 const svg=svgEl('svg',{viewBox:q.type==='horizontal'?'0 0 620 310':'0 0 620 360',role:'img','aria-label':`Gráfico de ${q.dimension}: ${data.map(d=>`${d.label} ${d.count} personas (${pct(d.count)})`).join(', ')}`});
 const tip=mk('div','study-legend');const detail=mk('p','study-detail',`Total: ${N} registros analizados`);detail.setAttribute('aria-live','polite');
 const select=(d)=>{detail.textContent=`${d.label}: ${d.count} de ${N} (${pct(d.count)}) · simulación académica`;[...tip.querySelectorAll('button')].forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.index===String(d.index)?'true':'false'))};
 const addShape=(node,d)=>{node.setAttribute('tabindex','0');node.setAttribute('role','button');node.setAttribute('aria-label',`${d.label}, ${d.count} respuestas, ${pct(d.count)}`);node.addEventListener('click',()=>select(d));node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(d)}});svg.appendChild(node)};
 if(q.type==='pie'||q.type==='donut'){
  let angle=-90;data.forEach((d)=>{if(!d.count)return;const next=angle+360*d.count/N;const path=svgEl('path',{d:q.type==='donut'?donutArc(310,171,135,82,angle,next-.35):arc(310,171,132,angle,next-.35),fill:colors[d.index],class:'study-pie-sector'});addShape(path,d);angle=next});
  if(q.type==='donut'){svg.appendChild(svgEl('text',{x:310,y:165,'text-anchor':'middle',class:'study-chart-center'},String(N)));svg.appendChild(svgEl('text',{x:310,y:191,'text-anchor':'middle',class:'study-chart-sub'},'respuestas'))}
 }else if(q.type==='horizontal'){
  const max=Math.max(1,...data.map(d=>d.count));data.forEach((d,i)=>{const y=26+i*55;svg.appendChild(svgEl('text',{x:14,y:y+15,class:'study-chart-label'},d.label.length>27?d.label.slice(0,25)+'…':d.label));svg.appendChild(svgEl('rect',{x:225,y:y-4,width:328,height:26,fill:'#eee8ed',rx:6}));const bar=svgEl('rect',{x:225,y:y-4,width:328*d.count/max,height:26,fill:colors[i],rx:6,class:'study-bar'});addShape(bar,d);svg.appendChild(svgEl('text',{x:Math.min(574,230+328*d.count/max),y:y+14,class:'study-chart-label'},String(d.count)))})
 }else{
  const sorted=q.type==='pareto'?[...data].sort((a,b)=>b.count-a.count||a.index-b.index):data;const max=Math.max(1,...sorted.map(d=>d.count));let cumulative=0;const points=[];
  for(let t=0;t<=5;t++)svg.appendChild(svgEl('line',{x1:55,x2:600,y1:292-t*50,y2:292-t*50,class:'study-chart-line'}));
  sorted.forEach((d,i)=>{const x=75+i*108;const h=215*d.count/max;const bar=svgEl('rect',{x,y:292-h,width:62,height:h,rx:8,fill:colors[d.index],class:'study-bar'});addShape(bar,d);svg.appendChild(svgEl('text',{x:x+31,y:284-h,'text-anchor':'middle',class:'study-chart-label'},String(d.count)));const labels=d.label.split(' ');let short=d.label.length>13?d.label.slice(0,12)+'…':d.label;svg.appendChild(svgEl('text',{x:x+31,y:313,'text-anchor':'middle',class:'study-chart-axis'},short));cumulative+=d.count;points.push([x+31,292-215*(cumulative/N)]);
  });
  if(q.type==='pareto'){const path=svgEl('polyline',{points:points.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#161018','stroke-width':3.3,'stroke-linecap':'round','stroke-linejoin':'round'});svg.appendChild(path);points.forEach(([x,y],i)=>{svg.appendChild(svgEl('circle',{cx:x,cy:y,r:5,fill:'#161018'}));svg.appendChild(svgEl('text',{x,y:y-12,'text-anchor':'middle',class:'study-chart-axis'},pct(sorted.slice(0,i+1).reduce((v,d)=>v+d.count,0))))})}
 }
 if(q.type==='pie'||q.type==='donut')data.forEach(d=>{const b=mk('button','');b.type='button';b.dataset.index=d.index;b.setAttribute('aria-pressed','false');const sw=mk('span','swatch');sw.style.background=colors[d.index];b.append(sw,document.createTextNode(`${d.label} · ${d.count} (${pct(d.count)})`));b.addEventListener('click',()=>select(d));tip.append(b)});
 wrapper.append(svg);if(tip.children.length)wrapper.append(tip);if(!compact)wrapper.append(detail);target.replaceChildren(wrapper)
}
function table(qi,compact=false){const data=counts(qi),wrap=mk('div','study-table-scroll'),tbl=mk('table','study-data-table');tbl.innerHTML='<thead><tr><th>Alternativa</th><th>Frecuencia</th><th>Frecuencia relativa</th><th>Porcentaje</th></tr></thead>';
 const body=mk('tbody');data.forEach(d=>{const tr=mk('tr');[d.label,String(d.count),(d.count/N).toFixed(3),pct(d.count)].forEach(t=>tr.append(mk('td','',t)));body.append(tr)});const tr=mk('tr');['TOTAL',String(N),'1.000','100%'].forEach(t=>tr.append(mk('td','',t)));body.append(tr);tbl.append(body);wrap.append(tbl);return wrap}
function selection(qi){const q=questions[qi];document.querySelector('#featured-number').textContent=`PREGUNTA ${String(qi+1).padStart(2,'0')} / ${q.dimension.toUpperCase()}`;document.querySelector('#featured-title').textContent=q.title;document.querySelector('#featured-desc').textContent=`${q.type==='pie'?'Distribución circular':q.type==='donut'?'Visualización de dona':q.type==='pareto'?'Frecuencia y porcentaje acumulado':q.type==='horizontal'?'Comparación horizontal':'Comparación por columnas'} · ${N} respuestas analizadas.`;let sorted=[...counts(qi)].sort((a,b)=>b.count-a.count);document.querySelector('#featured-insight').textContent=`La alternativa con mayor frecuencia es «${sorted[0].label}»: ${sorted[0].count} de ${N} respuestas (${pct(sorted[0].count)}).`;chart(qi,document.querySelector('#featured-chart'));const node=document.querySelector('#featured-table');node.replaceChildren(table(qi));}
const select=document.querySelector('#question-select');if(!select)return;questions.forEach((q,i)=>{const opt=document.createElement('option');opt.value=i;opt.textContent=`P${i+1} · ${q.dimension}`;select.append(opt)});select.addEventListener('change',()=>selection(Number(select.value)));selection(0);
const all=document.querySelector('#all-charts');questions.forEach((q,i)=>{const card=mk('article','study-chart-card');card.append(mk('p','study-label',`P${String(i+1).padStart(2,'0')} / ${q.dimension}`),mk('h4','',q.title));const box=mk('div','study-chart');chart(i,box,true);card.append(box);card.append(mk('p','study-small-note',`${N} respuestas · Ver tabla detallada arriba en el selector.`));card.addEventListener('click',e=>{if(e.target.closest('svg,button'))return;select.value=i;selection(i)});all.append(card)});
const tbl=document.querySelector('#responses-table');const thead=mk('thead');const headrow=mk('tr');['Participante',...questions.map((_,i)=>'P'+String(i+1).padStart(2,'0'))].forEach(t=>headrow.append(mk('th','',t)));thead.append(headrow);tbl.append(thead);const tbody=mk('tbody');raw.forEach((row,i)=>{const tr=mk('tr');tr.append(mk('th','',`P${String(i+1).padStart(2,'0')}`));row.forEach((v,j)=>{const td=mk('td','',String(v));td.title=questions[j].options[v-1];td.setAttribute('aria-label',`${questions[j].dimension}: ${td.title}`);tr.append(td)});tbody.append(tr)});tbl.append(tbody);
const survey=document.querySelector('#survey-panel');questions.forEach((q,i)=>{const box=mk('section','study-survey-question');box.append(mk('h3','',`P${i+1}. ${q.title}`));const ul=mk('ul');q.options.forEach(o=>ul.append(mk('li','',o)));box.append(ul);survey.append(box)});const toggle=document.querySelector('#show-survey');toggle.addEventListener('click',()=>{const opened=!survey.hidden;survey.hidden=opened;toggle.setAttribute('aria-expanded',String(!opened));toggle.textContent=opened?'Ver cuestionario completo ↗':'Ocultar cuestionario ↑'});
document.querySelector('#download-csv').addEventListener('click',()=>{const quote=s=>'"'+String(s).replace(/"/g,'""')+'"';const lines=[['Participante',...questions.map((_,i)=>`P${i+1}`)],...raw.map((row,i)=>[`P${String(i+1).padStart(2,'0')}`,...row.map((v,j)=>questions[j].options[v-1])])];const data='\ufeff'+lines.map(row=>row.map(quote).join(';')).join('\r\n');const blob=new Blob([data],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='DSalms_encuesta_15_respuestas.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
window.DSalmsEncuesta={questions,responses:raw.map(row=>[...row]),frequencies:counts};
})();
