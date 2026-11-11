// ---------- Body map ----------
// Each muscle: shapes on front (f) and/or back (b) figure. Coordinates in a 100x200 box per figure.
const E=(cx,cy,rx,ry,rot=0)=>({t:'e',cx,cy,rx,ry,rot});
const R=(x,y,w,h,r=3)=>({t:'r',x,y,w,h,r});
const P=(d)=>({t:'p',d});
const MUS={
  chest:{f:[E(42,45,8.5,6.5),E(58,45,8.5,6.5)]},
  delts_f:{f:[E(30.5,39,6,6.5),E(69.5,39,6,6.5)]},
  delts_s:{f:[E(30.5,39,6,6.5),E(69.5,39,6,6.5)],b:[E(30.5,39,6,6.5),E(69.5,39,6,6.5)]},
  delts_r:{b:[E(30.5,39,6,6.5),E(69.5,39,6,6.5)]},
  biceps:{f:[E(27,57,4.3,9),E(73,57,4.3,9)]},
  triceps:{b:[E(27,57,4.5,9.5),E(73,57,4.5,9.5)]},
  forearms:{f:[E(23.5,80,3.8,11,8),E(76.5,80,3.8,11,-8)],b:[E(23.5,80,3.8,11,8),E(76.5,80,3.8,11,-8)]},
  abs:{f:[R(44.5,53,11,30,3)]},
  obliques:{f:[E(38.5,67,3.8,11),E(61.5,67,3.8,11)]},
  quads:{f:[E(41.5,113,6.8,20),E(58.5,113,6.8,20)]},
  adductors:{f:[E(47.6,104,2.2,10),E(52.4,104,2.2,10)]},
  calves:{f:[E(42,156,3.8,13),E(58,156,3.8,13)],b:[E(42,153,5,12.5),E(58,153,5,12.5)]},
  traps:{b:[P('M41 27 L59 27 L66 35 L50 52 L34 35 Z')]},
  rotator:{b:[E(41,44,5.5,3.8),E(59,44,5.5,3.8)]},
  lats:{b:[P('M33 46 Q38 50 46 49 L47 70 Q40 66 35 58 Z'),P('M67 46 Q62 50 54 49 L53 70 Q60 66 65 58 Z')]},
  lowback:{b:[R(44.5,66,11,15,3)]},
  glutes:{b:[E(43,93,7.8,8),E(57,93,7.8,8)]},
  hamstrings:{b:[E(42,119,6.5,16),E(58,119,6.5,16)]},
};
const NAMES={chest:"груди",delts_f:"передня дельта",delts_s:"середня дельта",delts_r:"задня дельта",biceps:"біцепс",triceps:"трицепс",forearms:"передпліччя",abs:"прес",obliques:"косі м'язи",quads:"квадрицепс",adductors:"привідні",calves:"литки",traps:"трапеція",rotator:"ротаторна манжета",lats:"найширші",lowback:"поперек",glutes:"сідниці",hamstrings:"задня поверхня стегна"};

function shape(s,fill){
  if(s.t==='e')return `<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" transform="rotate(${s.rot} ${s.cx} ${s.cy})" fill="${fill}"/>`;
  if(s.t==='r')return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${fill}"/>`;
  return `<path d="${s.d}" fill="${fill}"/>`;
}
function silhouette(){ // head, neck, hands, feet, torso/limb outline
  return `<path d="M40 25 Q50 30 60 25 L70 33 Q77 37 77 46 L80 66 L83 92 L78 93 L72 68 L68 52 L66 86 Q67 96 66 100 L65 135 L63 172 L54 172 L52 130 L50 104 L48 130 L46 172 L37 172 L35 135 L34 100 Q33 96 34 86 L32 52 L28 68 L22 93 L17 92 L20 66 L23 46 Q23 37 30 33 Z" fill="var(--line)"/>
    <circle cx="50" cy="15" r="9" fill="var(--base)"/>
    <rect x="46" y="22" width="8" height="6" fill="var(--base)"/>
    <ellipse cx="19.5" cy="96" rx="3.5" ry="4.5" fill="var(--base)"/><ellipse cx="80.5" cy="96" rx="3.5" ry="4.5" fill="var(--base)"/>
    <ellipse cx="41.5" cy="176" rx="5" ry="3" fill="var(--base)"/><ellipse cx="58.5" cy="176" rx="5" ry="3" fill="var(--base)"/>`;
}
function figure(view,pri,sec){
  let out=silhouette();
  for(const k in MUS){const sh=MUS[k][view]; if(!sh)continue;
    const fill=pri.includes(k)?'var(--pri)':sec.includes(k)?'var(--sec)':'var(--base)';
    out+=sh.map(s=>shape(s,fill)).join('');}
  return out;
}
function bodySVG(pri,sec){
  return `<svg viewBox="0 0 200 194" role="img" aria-label="М'язи: ${pri.map(m=>NAMES[m]).join(', ')}">
    <g>${figure('f',pri,sec)}</g>
    <g transform="translate(100 0)">${figure('b',pri,sec)}</g>
    <text x="50" y="190" font-size="9" text-anchor="middle" fill="var(--muted)">спереду</text>
    <text x="150" y="190" font-size="9" text-anchor="middle" fill="var(--muted)">ззаду</text></svg>`;
}

// ---------- Plan ----------
const PLAN={
 mon:{title:"Понеділок · груди + біцепс",sub:"Відпочинок 3–4 хв на базових, 2–3 хв на решті.",ex:[
  {n:"Жим штанги на похилій лаві",s:"3 × 5–6",r:"3–4 хв",p:["chest"],q:["delts_f","triceps"],img:"img/mon1.webp"},
  {n:"Згинання з EZ-грифом на лаві Скотта",s:"3 × 5–6",r:"3 хв",p:["biceps"],q:["forearms"],img:"img/mon2b.webp"},
  {n:"Жим гантелей на похилій лаві",s:"3 × 6–8",r:"3 хв",p:["chest"],q:["delts_f","triceps"],img:"img/mon3.webp"},
  {n:"Pallof press (антиротація на блоці)",s:"3 × 10 на сторону",r:"між підходами жиму",p:["obliques","abs"],q:[],tag:"теніс",note:"Замість скручувань. Корпус тримає положення проти обертання — як при ударі.",img:"img/mon4.webp"},
  {n:"Згинання й розгинання кисті з гантеллю",s:"2 × 15 кожне",r:"1–2 хв",p:["forearms"],q:[],tag:"теніс",note:"Замість згинання однією рукою. Профілактика «тенісного ліктя».",img:"img/mon5.webp"},
  {n:"Бруси",s:"2 × 6–8",r:"3 хв",p:["chest","triceps"],q:["delts_f"],img:"img/mon6.webp"},
  {n:"Гіперекстензія",s:"2 × 12–15",r:"2–3 хв",p:["lowback"],q:["glutes","hamstrings"],img:"img/mon7.webp"},
 ]},
 wed:{title:"Середа · спина + трицепс",sub:"Відпочинок 3–4 хв на базових, 2–3 хв на решті.",ex:[
  {n:"Тяга верхнього блоку широким хватом",s:"3 × 5–6",r:"3–4 хв",p:["lats"],q:["biceps","delts_r"],img:"img/wed1.webp"},
  {n:"Розгинання рук на верхньому блоці",s:"3 × 5–6",r:"3–4 хв",p:["triceps"],q:[],img:"img/wed2.webp"},
  {n:"Тяга нижнього блоку сидячи",s:"3 × 5–6",r:"3–4 хв",p:["lats"],q:["traps","delts_r","biceps"],note:"Вузька V-ручка до низу живота, спина рівна, лопатки зводь у кінці руху.",img:"img/wed3.webp"},
  {n:"Французький жим лежачи з EZ-грифом",s:"2 × 10–12",r:"3 хв",p:["triceps"],q:[],img:"img/wed4b.webp"},
  {n:"Гіперекстензія",s:"2 × 12–15",r:"2–3 хв",p:["lowback"],q:["glutes","hamstrings"],img:"img/mon7.webp"},
  {n:"Горизонтальний дроворуб на кросовері",s:"3 × 10 на сторону",r:"2 хв",p:["obliques"],q:["abs","delts_f"],tag:"теніс",note:"Horizontal cable woodchop. Блок на рівні грудей, тягни горизонтально з поворотом стегон і корпусу — як форхенд.",img:"img/wed6b.webp"},
  {n:"Зворотний дроворуб знизу вгору",s:"3 × 10 на сторону",r:"2 хв",p:["obliques","delts_r"],q:["abs","glutes","traps"],tag:"теніс",note:"Low-to-high cable woodchop. Блок внизу, тягни по діагоналі вгору з поворотом стегон — як дворучний бекхенд.",img:"img/wed7b.webp"},
 ]},
 fri:{title:"П'ятниця · ноги + прес",sub:"Вибухові вправи — на початку, поки свіжий.",ex:[
  {n:"Випад з поворотом корпусу з медболом",s:"3 × 6 на сторону",r:"2 хв",p:["obliques","quads"],q:["glutes","abs"],tag:"теніс",note:"Медбол перед грудьми, у випаді — швидкий поворот у бік передньої ноги. Без кидків.",img:"img/fri1.webp"},
  {n:"Бічні стрибки з ноги на ногу",s:"3 × 6 на сторону",r:"1–2 хв",p:["glutes","quads"],q:["adductors","calves"],tag:"теніс",note:"Приземлення м'яке, затримка на 1 сек. Швидка зміна напрямку.",img:"img/fri2.webp"},
  {n:"Болгарські присідання",s:"3 × 8–10 на ногу",r:"3 хв",p:["quads","glutes"],q:["hamstrings","adductors"],img:"img/fri3.webp"},
  {n:"Румунська тяга",s:"3 × 6–8",r:"3–4 хв",p:["hamstrings","glutes"],q:["lowback","forearms"],img:"img/fri4.webp"},
  {n:"Бічні випади",s:"3 × 8 на ногу",r:"2 хв",p:["adductors","glutes"],q:["quads"],tag:"теніс",note:"Імітують бічне переміщення по корту.",img:"img/fri5.webp"},
  {n:"Піднімання ніг у висі на перекладині",s:"3 × 10–12",r:"1–2 хв",p:["abs"],q:["obliques","forearms"],note:"Hanging leg raise. Без розгойдування, таз підкручуй вгору. Важко — роби з зігнутими колінами.",img:"img/fri6.webp"},
  {n:"Скручування на прес",s:"3 × 15–20",r:"1 хв",p:["abs"],q:["obliques"],note:"Crunches. Поперек притиснутий до підлоги, видих на підйомі.",img:"img/fri7.webp"},
 ]},
};

function render(){
  const m=document.getElementById('main');
  let html='';
  for(const [k,d] of Object.entries(PLAN)){
    html+=`<section class="day${k==='mon'?' on':''}" id="d-${k}"><div class="dayhead"><h2>${d.title}</h2><p>${d.sub}</p><div class="prog" id="prog-${k}"></div></div>`;
    d.ex.forEach((e,i)=>{
      const key=k+'-'+i, n=1;
      html+=`<div class="ex${e.img?' has-img':''}" data-k="${key}" data-n="${n}">${e.img?`<figure class="pic"><img src="${e.img}" alt="${e.n}: старт і фініш" loading="lazy"><figcaption><span>старт</span><span>фініш</span></figcaption></figure>`:bodySVG(e.p,e.q)}<div>
        <div class="name"><span class="num">${i+1}</span>${e.n}${e.tag?`<span class="tag">${e.tag}</span>`:''}</div>
        <div class="meta"><b>${e.s}</b> · відпочинок ${e.r}</div>
        <div class="sets"><button class="set chk" data-k="${key}" data-j="0"><i></i><em>Не виконано</em></button></div>
        <div class="chips">${e.p.map(x=>`<span class="chip p">${NAMES[x]}</span>`).join('')}${e.q.map(x=>`<span class="chip s">${NAMES[x]}</span>`).join('')}</div>
        ${e.note?`<div class="note">${e.note}</div>`:''}</div></div>`;
    });
    html+=`</section>`;
  }
  html+=`<div class="tips"><h3>Поради</h3><ul>
    <li>Новачкам перший місяць — 8–12 повторень у всіх вправах, потім переходити на 5–6.</li>
    <li>Спочатку важкі базові вправи, потім ізолюючі.</li>
    <li>Важкий день ніг не ставити напередодні матчу чи інтенсивного тенісу.</li>
    <li>Виконав верхню межу повторень у всіх підходах — додай вагу.</li></ul>
    <p class="note">Основа: програма AtletPro (atletpro.com.ua), доповнена вправами для тенісу.</p></div>`;
  m.innerHTML=html;
}
render();
// ---------- Checkboxes (reset daily) ----------
const SKEY='gymplan-checks';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
let ST={date:today(),done:{}};
try{const raw=localStorage.getItem(SKEY); if(raw){const p=JSON.parse(raw); if(p&&p.date===today())ST=p;}}catch(e){}
function save(){try{localStorage.setItem(SKEY,JSON.stringify(ST));}catch(e){}}
function paint(){
  document.querySelectorAll('.set').forEach(b=>{const a=ST.done[b.dataset.k]||[];const on=!!a[+b.dataset.j];b.classList.toggle('on',on);const t=b.querySelector('em');if(t)t.textContent=on?'Виконано':'Не виконано';});
  const tot={};
  document.querySelectorAll('.ex[data-k]').forEach(c=>{const n=+c.dataset.n,a=ST.done[c.dataset.k]||[];let cnt=0;for(let j=0;j<n;j++)if(a[j])cnt++;
    const full=cnt===n;c.classList.toggle('done',full);const d=c.dataset.k.split('-')[0];tot[d]=tot[d]||[0,0];tot[d][1]++;if(full)tot[d][0]++;});
  for(const d in tot){const el=document.getElementById('prog-'+d);if(el)el.innerHTML=`Сьогодні виконано: <b>${tot[d][0]} / ${tot[d][1]}</b> вправ<button class="reset" data-reset="${d}">скинути</button>`;}
}
function checkDay(){if(ST.date!==today()){ST={date:today(),done:{}};save();paint();}}
document.addEventListener('click',ev=>{
  const b=ev.target.closest('.set');
  if(b){checkDay();const k=b.dataset.k,j=+b.dataset.j;const a=ST.done[k]||(ST.done[k]=[]);a[j]=!a[j];save();paint();return;}
  const r=ev.target.closest('[data-reset]');
  if(r){const d=r.dataset.reset;for(const k in ST.done)if(k.startsWith(d+'-'))delete ST.done[k];save();paint();}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkDay();});
setInterval(checkDay,60000);
paint();
(()=>{const m={1:'mon',3:'wed',5:'fri'}[new Date().getDay()];if(m){const b=document.querySelector(`nav button[data-d="${m}"]`);if(b)b.click();}})();
window.scrollTo(0,0);
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x===b));
  document.querySelectorAll('.day').forEach(s=>s.classList.toggle('on',s.id==='d-'+b.dataset.d));
  window.scrollTo({top:0,behavior:'smooth'});
}));