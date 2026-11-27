// Recovery timers for each day's main muscle groups (GROUPS and PLAN[day].main in js/training.js).
// The countdown starts at the end of the day: "Завершити тренування" button, or automatically
// when every exercise of the day is ticked. Load after js/app.js.

// ---------- State: { mon: finishedAtMs, ... } — kept across days, unlike the daily checkboxes ----------
const RKEY='gymplan-recovery';
let REC={};
try{REC=JSON.parse(localStorage.getItem(RKEY))||{};}catch(e){}
function saveRec(){try{localStorage.setItem(RKEY,JSON.stringify(REC));}catch(e){}}

const isToday=t=>new Date(t).toDateString()===new Date().toDateString();
const hhmm=t=>new Date(t).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'});
const pad=n=>String(n).padStart(2,'0');
function countdown(ms){const s=Math.ceil(ms/1000);return `${Math.floor(s/3600)}:${pad(Math.floor(s/60)%60)}:${pad(s%60)}`;}
const groupList=d=>PLAN[d].main.map(g=>GROUPS[g].n.toLowerCase()).join(', ');

// Latest finished session that trained group g → time left and share recovered (0..1).
function groupState(g){
  let start=0;
  for(const d in REC)if(PLAN[d]&&PLAN[d].main.includes(g))start=Math.max(start,REC[d]);
  const total=GROUPS[g].h*3600e3, done=Date.now()-start;
  return start&&done<total?{left:total-done,pct:Math.max(0,done/total)}:{left:0,pct:1};
}

// ---------- Render ----------
function buildRec(){
  document.querySelectorAll('.rec[data-day]').forEach(el=>{
    el.innerHTML=`<div class="rec-h"><span>Основні групи</span><span>відновлення</span></div>`+
      PLAN[el.dataset.day].main.map(g=>`<div class="rec-row" data-grp="${g}"><span class="rec-n">${GROUPS[g].n}<small>${GROUPS[g].h} год</small></span><span class="rec-bar"><i></i></span><span class="rec-t"></span></div>`).join('');
  });
}
function paintFinish(){
  document.querySelectorAll('.finish[data-day]').forEach(el=>{
    const d=el.dataset.day, t=REC[d];
    el.innerHTML=t&&isToday(t)
      ?`<div class="finish-done"><span>✓ Тренування завершено о ${hhmm(t)} — відновлення запущено</span><button class="reset" data-rec-cancel="${d}">скасувати</button></div>`
      :`<button class="finish-btn" data-rec-finish="${d}">Завершити тренування</button><div class="note">Запустить таймер відновлення: ${groupList(d)}. Стартує й сам, коли всі вправи відмічено.</div>`;
  });
}
let shownDay='';
function tickRec(){
  const day=new Date().toDateString();
  if(day!==shownDay){shownDay=day;paintFinish();} // "finished today" state flips at midnight
  document.querySelectorAll('.rec-row').forEach(r=>{
    const s=groupState(r.dataset.grp), ok=!s.left;
    r.classList.toggle('ok',ok);
    r.querySelector('.rec-bar i').style.width=(s.pct*100).toFixed(2)+'%';
    r.querySelector('.rec-t').textContent=ok?'відновлено':'ще '+countdown(s.left);
  });
}
function finishDay(d){REC[d]=Date.now();saveRec();paintFinish();tickRec();}

// ---------- Events ----------
document.addEventListener('click',ev=>{
  const f=ev.target.closest('[data-rec-finish]');
  if(f){finishDay(f.dataset.recFinish);return;}
  const c=ev.target.closest('[data-rec-cancel]');
  if(c){delete REC[c.dataset.recCancel];saveRec();paintFinish();tickRec();}
});
// All exercises of a training day ticked → start its timer (once per day).
document.addEventListener('groupdone',e=>{const d=e.detail;if(PLAN[d]&&!(REC[d]&&isToday(REC[d])))finishDay(d);});

buildRec();
tickRec();
setInterval(tickRec,1000);
