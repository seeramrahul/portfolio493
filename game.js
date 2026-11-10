'use strict';
(() => {
const missions=[
 {id:'ai',artifact:'Trust lens',name:'Find the trust lens.',description:'Explore how AI recommendations keep buyers in control.',insight:'Keep evidence beside the answer, and let people confirm consequential actions.'},
 {id:'sourcing',artifact:'Workflow compass',name:'Recover the workflow compass.',description:'Follow a request through RFQ, evaluation and approval.',insight:'Show the stage, the owner and the evidence together so every handoff is visible.'},
 {id:'brand',artifact:'Brand signal',name:'Restore the brand signal.',description:'Discover how the product story became an enterprise presence.',insight:'Pair a clear business promise with product evidence and repeatable page patterns.'},
 {id:'expense',artifact:'Evidence key',name:'Trace the evidence key.',description:'Follow a change in spend back to its source transactions.',insight:'Preserve the period, account and category as users move from signals to records.'}
];
const storageKey='rahul-district-progress-v1';
const world=document.querySelector('#city-map');
const avatar=document.querySelector('#avatar');
const status=document.querySelector('#game-status');
const ids=missions.map(m=>m.id);
let completed=new Set();
let selected=0;
let soundOn=false;
let audioContext;
let undoProgress=null;
try {
 const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
 if(Array.isArray(saved))completed=new Set(saved.filter(id=>ids.includes(id)));
} catch {}
function save(){
 try{localStorage.setItem(storageKey,JSON.stringify([...completed]));document.querySelector('#save-status').textContent='Progress saved in this browser';}
 catch{document.querySelector('#save-status').textContent='Progress kept for this visit only';}
}
function playTone(reward=false){
 if(!soundOn)return;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  audioContext ||= new Audio();
  audioContext.resume().catch(()=>{});
  const notes=reward?[523.25,659.25,783.99]:[392];
  notes.forEach((frequency,i)=>{
   const oscillator=audioContext.createOscillator();
   const gain=audioContext.createGain();
   const start=audioContext.currentTime+i*.11;
   oscillator.type='triangle';oscillator.frequency.value=frequency;
   gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.045,start+.01);gain.gain.exponentialRampToValueAtTime(.001,start+.15);
   oscillator.connect(gain);gain.connect(audioContext.destination);
   oscillator.start(start);oscillator.stop(start+.17);
  });
 }catch{soundOn=false;document.querySelector('#sound').textContent='Sound unavailable';document.querySelector('#sound').setAttribute('aria-pressed','false');}
}
function updateRoute(){
 if(!document.body.classList.contains('game-active'))return;
 const base=world.getBoundingClientRect();
 const points=missions.map(m=>{
  const rect=document.querySelector('.pin[data-project="'+m.id+'"]').getBoundingClientRect();
  return [rect.left-base.left+20,rect.bottom-base.top+48];
 });
 const route=document.querySelector('.route-line');
 route.setAttribute('viewBox','0 0 '+base.width+' '+base.height);
 document.querySelector('#route-path').setAttribute('points',[...points,points[0]].map(p=>p.join(',')).join(' '));
 avatar.style.left=points[selected][0]+'px';
 avatar.style.top=points[selected][1]+'px';
}
function selectMission(index,announce=true){
 selected=(index+missions.length)%missions.length;
 const m=missions[selected];
 document.querySelectorAll('.pin').forEach(pin=>pin.classList.toggle('is-current',pin.dataset.project===m.id));
 document.querySelector('#mission-location').textContent='MISSION 0'+(selected+1)+' / '+cases[m.id].district;
 document.querySelector('#mission-name').textContent=m.name;
 document.querySelector('#mission-description').textContent=m.description;
 document.querySelector('#open-mission').innerHTML=(completed.has(m.id)?'Revisit mission':'Open mission')+' <kbd>Enter</kbd>';
 updateRoute();
 if(announce){status.textContent=cases[m.id].district+' selected. '+m.description;playTone();}
}
function renderProgress(){
 const count=completed.size;
 document.querySelector('#mission-count').textContent=count+' / 4';
 document.querySelector('#xp-label').textContent=(count*100)+' / 400 XP';
 document.querySelector('#xp-meter').value=count*100;
 document.querySelector('#player-rank').textContent=count===4?'District Architect':count>=2?'City Navigator':count===1?'Street Scout':'District Rookie';
 document.querySelectorAll('[data-mission]').forEach(button=>{
  const done=completed.has(button.dataset.mission);
  button.classList.toggle('collected',done);
  button.querySelector('.artifact-state').textContent=done?'✓':'＋';
  button.setAttribute('aria-label',missions.find(m=>m.id===button.dataset.mission).artifact+(done?', collected. Revisit case study':', not collected. Open case study'));
 });
 document.querySelectorAll('.pin').forEach(pin=>pin.classList.toggle('is-complete',completed.has(pin.dataset.project)));
 document.querySelector('#district-complete').hidden=count!==4;
 selectMission(selected,false);
}
function addReward(id){
 const m=missions.find(m=>m.id===id);
 if(!m)return;
 document.querySelector('.mission-reward')?.remove();
 const reward=document.createElement('section');
 reward.className='mission-reward';
 const done=completed.has(id);
 reward.innerHTML='<p class="eyebrow">MISSION REWARD / 100 XP</p><h3>'+m.artifact+'</h3><p>'+m.insight+'</p><button data-collect="'+id+'" '+(done?'disabled':'')+'>'+(done?'✓ Insight collected':'Collect insight +100 XP')+'</button><p class="reward-result" role="status">'+(done?'This insight is already in your collection.':'')+'</p>';
 caseBody.insertBefore(reward,caseBody.querySelector('.case-actions'));
}
function enterGame(){
 document.body.classList.add('game-active');
 selectMission(selected,false);
 world.scrollIntoView({block:'start',behavior:'instant'});
 world.focus({preventScroll:true});
 status.textContent='Explore four districts. Use arrow keys to travel and Enter to open a mission.';
}
function exitGame(){
 document.body.classList.remove('game-active');
 document.querySelector('#enter-game').focus({preventScroll:true});
 document.querySelector('.hero').scrollIntoView({block:'start',behavior:'instant'});
}
document.querySelector('#enter-game').addEventListener('click',enterGame);
document.querySelector('#exit-game').addEventListener('click',exitGame);
document.querySelector('#previous-stop').addEventListener('click',()=>selectMission(selected-1));
document.querySelector('#next-stop').addEventListener('click',()=>selectMission(selected+1));
document.querySelector('#open-mission').addEventListener('click',()=>openCase(missions[selected].id));
document.addEventListener('district-select',event=>selectMission(ids.indexOf(event.detail)));
document.addEventListener('case-open',event=>{const index=ids.indexOf(event.detail);if(index>=0)selectMission(index,false);addReward(event.detail);});
document.querySelectorAll('[data-mission]').forEach(button=>button.addEventListener('click',()=>openCase(button.dataset.mission)));
caseBody.addEventListener('click',event=>{
 const button=event.target.closest('[data-collect]');
 if(!button||completed.has(button.dataset.collect))return;
 const id=button.dataset.collect;
 if(!ids.includes(id))return;
 completed.add(id);undoProgress=null;
 document.querySelector('#reset-progress').textContent='Restart run';
 save();renderProgress();playTone(true);
 button.disabled=true;button.textContent='✓ Insight collected';
 const message=completed.size===4?'400 XP. District Architect unlocked. You collected every insight.':'+100 XP. '+missions.find(m=>m.id===id).artifact+' added to your collection.';
 button.parentElement.querySelector('.reward-result').textContent=message;
 status.textContent=message;
});
world.addEventListener('keydown',event=>{
 if(!document.body.classList.contains('game-active')||dialog.open||event.altKey||event.ctrlKey||event.metaKey)return;
 if(['ArrowRight','ArrowDown','d','D','s','S'].includes(event.key)){event.preventDefault();selectMission(selected+1);}
 else if(['ArrowLeft','ArrowUp','a','A','w','W'].includes(event.key)){event.preventDefault();selectMission(selected-1);}
 else if(event.key==='Enter'&&event.target===world){event.preventDefault();openCase(missions[selected].id);}
 else if(event.key==='Escape'){event.preventDefault();exitGame();}
});
document.querySelector('#sound').addEventListener('click',()=>{
 soundOn=!soundOn;
 document.querySelector('#sound').textContent='Sound: '+(soundOn?'on':'off');
 document.querySelector('#sound').setAttribute('aria-pressed',String(soundOn));playTone();
});
document.querySelector('#reset-progress').addEventListener('click',()=>{
 if(undoProgress){completed=new Set(undoProgress);undoProgress=null;status.textContent='Your previous run has been restored.';document.querySelector('#reset-progress').textContent='Restart run';}
 else {undoProgress=[...completed];completed.clear();status.textContent='New run started. You can undo this restart.';document.querySelector('#reset-progress').textContent='Undo restart';}
 save();renderProgress();
});
window.addEventListener('resize',updateRoute);
renderProgress();
if(dialog.open)addReward(location.hash.replace('#case-',''));
})();