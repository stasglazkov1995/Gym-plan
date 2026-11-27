// App shell: shared checkbox markup, rendering both tabs, daily checkboxes, tab/day navigation.
// Load after js/training.js and js/food.js.

// ---------- Checkbox markup + wording per tab ----------
const LBL={
  gym:{on:"Виконано",off:"Не виконано",prog:"Сьогодні виконано",unit:"вправ"},
  food:{on:"З'їдено",off:"Не з'їдено",prog:"Сьогодні з'їдено",unit:"прийомів їжі"},
};
const chk=(key,lbl)=>`<div class="sets"><button class="set chk" data-k="${key}" data-j="0" data-lbl="${lbl}"><i></i><em>${LBL[lbl].off}</em></button></div>`;

// ---------- Render ----------
document.getElementById('main').innerHTML=renderTraining()+renderFood();

// ---------- Checkboxes (reset daily) ----------
const SKEY='gymplan-checks';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
let ST={date:today(),done:{}};
try{const raw=localStorage.getItem(SKEY); if(raw){const p=JSON.parse(raw); if(p&&p.date===today())ST=p;}}catch(e){}
function save(){try{localStorage.setItem(SKEY,JSON.stringify(ST));}catch(e){}}
function paint(){
  document.querySelectorAll('.set').forEach(b=>{const a=ST.done[b.dataset.k]||[];const on=!!a[+b.dataset.j];b.classList.toggle('on',on);const t=b.querySelector('em');if(t)t.textContent=LBL[b.dataset.lbl||'gym'][on?'on':'off'];});
  const tot={};
  document.querySelectorAll('.ex[data-k]').forEach(c=>{const n=+c.dataset.n,a=ST.done[c.dataset.k]||[];let cnt=0;for(let j=0;j<n;j++)if(a[j])cnt++;
    const full=cnt===n;c.classList.toggle('done',full);const d=c.dataset.g;tot[d]=tot[d]||[0,0];tot[d][1]++;if(full)tot[d][0]++;});
  for(const d in tot){const el=document.getElementById('prog-'+d);if(!el)continue;const L=LBL[el.dataset.lbl||'gym'];
    el.innerHTML=`${L.prog}: <b>${tot[d][0]} / ${tot[d][1]}</b> ${L.unit}<button class="reset" data-reset="${d}">скинути</button>`;}
}
function checkDay(){if(ST.date!==today()){ST={date:today(),done:{}};save();paint();}}
document.addEventListener('click',ev=>{
  const b=ev.target.closest('.set');
  if(b){checkDay();const k=b.dataset.k,j=+b.dataset.j;const a=ST.done[k]||(ST.done[k]=[]);a[j]=!a[j];save();paint();
    // Last item of a day ticked → tell other modules (js/recovery.js starts the recovery timer).
    const g=b.closest('[data-g]').dataset.g;
    if(a[j]&&[...document.querySelectorAll(`.ex[data-g="${g}"]`)].every(c=>c.classList.contains('done')))
      document.dispatchEvent(new CustomEvent('groupdone',{detail:g}));
    return;}
  const r=ev.target.closest('[data-reset]');
  if(r){const d=r.dataset.reset;for(const k in ST.done)if(k.startsWith(d+'-'))delete ST.done[k];save();paint();}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkDay();});
setInterval(checkDay,60000);
paint();
// ---------- Navigation: tab (Тренування / Харчування) + day within the tab ----------
function selectDay(d){
  const sec=document.getElementById('d-'+d); if(!sec)return;
  const mode=sec.classList.contains('mode-food')?'mode-food':'mode-gym';
  document.querySelectorAll('.day.'+mode).forEach(s=>s.classList.toggle('on',s===sec));
  document.querySelectorAll(`nav .${mode} button`).forEach(b=>b.classList.toggle('on',b.dataset.d===d));
}
const MKEY='gymplan-mode';
function setMode(m){
  document.body.dataset.mode=m;
  document.querySelectorAll('.modes button').forEach(b=>{const on=b.dataset.m===m;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);});
  try{localStorage.setItem(MKEY,m);}catch(e){}
}
const wd=new Date().getDay();
selectDay({1:'mon',3:'wed',5:'fri'}[wd]||'mon');
selectDay('food-'+['sun','mon','tue','wed','thu','fri','sat'][wd]);
let mode0='gym';try{if(localStorage.getItem(MKEY)==='food')mode0='food';}catch(e){}
setMode(mode0);
window.scrollTo(0,0);
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{
  selectDay(b.dataset.d);
  window.scrollTo({top:0,behavior:'smooth'});
}));
document.querySelectorAll('.modes button').forEach(b=>b.addEventListener('click',()=>{
  setMode(b.dataset.m);
  window.scrollTo({top:0,behavior:'smooth'});
}));