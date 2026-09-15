import {h,button,stars} from './dom.js';
import {WORLDS,TOTAL_ROUNDS} from './content.js';
import {store} from './state.js';
import {sound,celebrate} from './effects.js';
import {icon,emblem,compassArt,placeBoard,egyptKey} from './visuals.js';
import {renderPuzzle} from './puzzles.js';
import {digitsFor,placeValues,roman,starScore} from './math.js';

const app=document.getElementById('app');
let classroom=false,activeDispose=()=>{},offlineReady=false;
const go=route=>{sound.tap();if(location.hash===`#${route}`)render();else location.hash=route;};
function worldLink(w){return `world/${w.id}`;}
function unlocked(w){return classroom || store.unlocked(WORLDS.indexOf(w),WORLDS);}
function resumeWorld(){return WORLDS.find(w=>store.run(w.id)&&unlocked(w)) || WORLDS.find(w=>!store.stars(w.id)&&unlocked(w)) || WORLDS[0];}
function navButton(name,text,route,current){const b=button([icon(name,20),h('span',{},text)],()=>go(route),`nav-button ${current===route?'active':''}`);if(current===route)b.setAttribute('aria-current','page');return b;}
function shell(current='journey') {
  const mute=button(icon(store.muted()?'mute':'sound',19),()=>{store.toggleMute();mute.replaceChildren(icon(store.muted()?'mute':'sound',19));mute.setAttribute('aria-label',store.muted()?'Turn sound on':'Mute sound');},'icon-button');mute.setAttribute('aria-label',store.muted()?'Turn sound on':'Mute sound');
  const settings=button(icon('settings',19),showSettings,'icon-button');settings.setAttribute('aria-label','Adventure settings');
  const header=h('header',{class:'site-header'},button([h('span',{class:'brand-mark'},icon('compass',28)),h('span',{class:'brand-name'},'NUMBER',h('b',{},'ODYSSEY'))],()=>go('journey'),'brand'),
    h('nav',{class:'main-nav','aria-label':'Main navigation'},navButton('map','Journey','journey',current),navButton('book','Field guide','guide',current),navButton('flask','Number lab','lab',current)),
    h('div',{class:'header-tools'},h('span',{class:'star-total','aria-label':`${store.total()} of 24 stars`},'✦ ',store.total(),h('small',{},'/ 24')),mute,settings));
  const main=h('main',{id:'main',tabindex:'-1'});
  app.replaceChildren(header,main,h('footer',{class:'site-footer'},h('span',{},'GANITA PRAKASH · CLASS 8 · CHAPTER 3'),h('span',{},'A little curiosity goes a long way.')));
  return main;
}
function pageHeading(kicker,title,subtitle){return h('div',{class:'page-heading'},h('p',{class:'eyebrow'},kicker),h('h1',{},title),h('p',{class:'lead'},subtitle));}
function showMap(){
  const main=shell('journey'),next=resumeWorld(),done=WORLDS.filter(w=>store.stars(w.id)).length;
  const intro=h('section',{class:'journey-intro'},h('div',{class:'intro-copy'},h('p',{class:'eyebrow'},h('span',{class:'tiny-spark'},'✦'),' A STORY OF NUMBERS'),h('h1',{},'Every number',h('br'),'has a ',h('em',{},'story.')),h('p',{class:'lead'},'Travel across civilisations. Crack their codes. Discover the ideas that changed how we count.'),compassArt(),h('p',{class:'art-caption'},'EIGHT WORLDS. ONE EXTRAORDINARY IDEA.'),
    h('div',{class:'next-discovery'},h('span',{class:'eyebrow'},done===8?'YOUR JOURNEY CONTINUES':'YOUR NEXT DISCOVERY'),h('h2',{},next.name),h('p',{},store.run(next.id)?'Your expedition is saved. Pick up where you left off.':next.intro),button([store.run(next.id)?'Continue adventure':done===8?'Play again':'Start adventure',icon('arrow',20)],()=>go(worldLink(next)),'button primary'),h('span',{class:'small-note'},'No timer. Explore at your own pace.'))));
  const grid=h('div',{class:'world-grid'},WORLDS.map((w,i)=>{
    const open=unlocked(w),score=store.stars(w.id),run=store.run(w.id);
    const b=button([
      h('span',{class:'world-topline'},h('span',{class:'world-index'},String(i+1).padStart(2,'0')),h('span',{class:`world-status ${score?'complete':''}`},score?'DISCOVERED':open?(run?'IN PROGRESS':'READY TO EXPLORE'):'UNDISCOVERED')),
      h('span',{class:`world-scene scene-${w.emblem}`},h('i',{class:'scene-orbit'}),h('span',{class:'world-emblem'},emblem(w.emblem)),h('i',{class:'scene-floor'}),h('span',{class:'scene-spark'},'✧')),
      h('span',{class:'world-title'},w.name),h('span',{class:'world-topic'},w.topic),h('span',{class:'world-bottom'},score?stars(score):h('span',{class:'round-count'},`${w.rounds.length} discoveries`),open?icon('arrow',18):icon('lock',16))
    ],()=>go(worldLink(w)),`world-card ${open?'available':'locked'}`);
    b.style.setProperty('--accent',w.color);b.disabled=!open;b.setAttribute('aria-label',`${w.name}. ${w.topic}. ${open?(score?`${score} stars earned`:'Open world'):`Complete ${WORLDS[i-1].name} to unlock`}`);return b;
  }));
  main.append(h('div',{class:'journey-layout'},intro,h('section',{class:'worlds-section','aria-label':'Adventure worlds'},h('div',{class:'section-heading'},h('div',{},h('span',{class:'eyebrow'},'YOUR EXPEDITION'),h('h2',{},'The discovery trail')),h('span',{class:'progress-pill'},`${done} / 8 worlds`)),h('div',{class:'journey-progress',role:'progressbar','aria-valuemin':0,'aria-valuemax':8,'aria-valuenow':done,'aria-label':'Worlds completed'},h('span',{style:`width:${done/8*100}%`})),classroom?h('p',{class:'classroom-banner'},'Classroom mode · All worlds are open'):null,grid,h('div',{class:'trail-note'},icon('book',23),h('p',{},'Need a clue? Your ',button('Field guide',()=>go('guide'),'inline-button'),' keeps every discovery close.')))));
}
function showWorld(w){
  if(!unlocked(w)){go('journey');return;}
  const main=shell(),i=WORLDS.indexOf(w),run=store.run(w.id),score=store.stars(w.id);
  main.style.setProperty('--accent',w.color);
  const card=h('section',{class:'world-intro-card'},h('div',{class:'intro-emblem'},emblem(w.emblem)),h('p',{class:'eyebrow'},`WORLD ${i+1} · ${w.tag}`),h('h1',{},w.name),h('p',{class:'lead'},w.intro),h('div',{class:'lesson-card'},h('span',{class:'eyebrow'},'BEFORE YOU SET OFF'),h('p',{},w.lesson)),
    h('div',{class:'intro-meta'},h('span',{},`${w.rounds.length} short discoveries`),h('span',{},'Hints whenever you need'),score?stars(score):null),
    button([run?'Resume this world':'Let’s explore',icon('arrow',20)],()=>go(`play/${w.id}`),'button primary wide'),
    h('p',{class:'small-note'},'3 stars: at least 85% unaided · 2 stars: at least 55% · 1 star: complete the world'),
    button('Back to the trail',()=>go('journey'),'text-button'));
  main.append(card);
}
function solution(round){
  if(round.type==='roman') return `Build ${roman(round.target)}. ${round.why}`;
  if(round.type==='build') return `${digitsFor(round.target,round.weights).map((d,i)=>`${d} in the ${round.weights[i]} place`).join('; ')}. ${round.why}`;
  if(round.type==='choice') return `Choose “${round.answer}”. ${round.why}`;
  if(round.type==='match') return round.rows.map(r=>`${r.label}: ${r.answer}.`).join(' ');
  return round.why;
}
function play(w){
  if(!unlocked(w)){go('journey');return;}
  let alive=true;activeDispose=()=>{alive=false;};
  const main=shell(),saved=store.run(w.id);main.style.setProperty('--accent',w.color);
  let index=saved&&saved.index<=w.rounds.length?saved.index:0,hits=saved?.hits||0,missed=saved?.missed||false;
  function results(){
    const score=starScore(hits,w.rounds.length);store.finish(w.id,score);sound.win();celebrate();
    const next=WORLDS[WORLDS.indexOf(w)+1],all=WORLDS.every(x=>store.stars(x.id));
    main.replaceChildren(h('section',{class:'results-card'},h('div',{class:'result-emblem'},emblem(w.emblem)),h('p',{class:'eyebrow'},'DISCOVERY COMPLETE'),h('h1',{},all?'A true number explorer!':`${w.name}, discovered.`),stars(score),h('p',{class:'lead'},`${hits} of ${w.rounds.length} solved without a hint or retry.`),h('div',{class:'lesson-card'},h('span',{class:'eyebrow'},'TAKE THIS IDEA WITH YOU'),h('p',{},w.takeaway)),
      h('p',{class:'small-note'},score===3?'All three stars are yours. Beautiful exploring.':'Hints helped you learn. Replay any time to improve your stars; your best score stays.'),
      button([next?`Next: ${next.name}`:'Back to the trail',icon('arrow',20)],()=>go(next?worldLink(next):'journey'),'button primary wide'),
      h('div',{class:'button-row'},button('Replay world',()=>{index=0;hits=0;missed=false;showRound();},'button secondary'),button('Journey map',()=>go('journey'),'button secondary'))));
    main.querySelector('h1').setAttribute('tabindex','-1');main.querySelector('h1').focus({preventScroll:true});window.scrollTo(0,0);
    document.querySelector('.star-total').replaceChildren('✦ ',String(store.total()),h('small',{},'/ 24'));
    document.querySelector('.star-total').setAttribute('aria-label',`${store.total()} of 24 stars`);
  }
  function showRound(){
    if(!alive)return;if(index>=w.rounds.length){results();return;}
    const round=w.rounds[index];let locked=false,tries=0;
    store.saveRun(w.id,{index,hits,missed});
    const feedback=h('div',{class:'feedback-area','aria-live':'polite','aria-atomic':'true'});
    const hintPanel=h('div',{class:'hint-panel',hidden:true,role:'status'});
    const hint=button([icon('bulb',18),'Need a clue?'],()=>{
      if(locked)return;missed=true;store.saveRun(w.id,{index,hits,missed});hintPanel.hidden=false;hintPanel.replaceChildren(h('strong',{},tries>=2?'Let’s work it out':'Explorer’s clue'),h('p',{},tries>=2?solution(round):round.hint));hint.textContent=tries>=2?'Solution shown':'Clue shown';
    },'hint-button');
    const api={
      note(message){feedback.replaceChildren(h('div',{class:'feedback note'},message));},
      answer(correct){
        if(locked||!alive)return;
        if(correct){
          locked=true;puzzle.lock();hint.disabled=true;if(!missed)hits++;sound.good();
          store.saveRun(w.id,{index:index+1,hits,missed:false});
          const next=button([index===w.rounds.length-1?'Collect discovery':'Next discovery',icon('arrow',18)],()=>{index++;missed=false;showRound();},'button primary');
          feedback.replaceChildren(h('div',{class:'feedback success'},h('div',{class:'feedback-icon'},icon('check',22)),h('div',{},h('strong',{},missed?'You worked it out!':'That’s it!'),h('p',{},round.why)),next));
          next.focus({preventScroll:true});feedback.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
        }else{
          tries++;missed=true;store.saveRun(w.id,{index,hits,missed});sound.retry();
          feedback.replaceChildren(h('div',{class:'feedback retry'},h('strong',{},'Keep exploring.'),h('p',{},tries===1?'That isn’t quite it. Adjust your answer, or open a clue.':round.hint)));
          if(tries>=2)hint.replaceChildren(icon('bulb',18),'Show me how');
        }
      }
    };
    const puzzle=renderPuzzle(round,api);
    const back=button([icon('back',18),'Map'],()=>go('journey'),'text-button');
    const hud=h('div',{class:'game-hud'},back,h('div',{class:'game-world'},w.name),h('span',{class:'round-position'},`${index+1} / ${w.rounds.length}`));
    const pips=h('div',{class:'round-progress','aria-label':`Discovery ${index+1} of ${w.rounds.length}`},w.rounds.map((_,i)=>h('span',{class:i<index?'done':i===index?'current':''})));
    main.replaceChildren(h('section',{class:'game-shell'},hud,pips,h('div',{class:'round-heading'},h('p',{class:'eyebrow'},index===w.rounds.length-1?'GUARDIAN CHALLENGE':`DISCOVERY ${String(index+1).padStart(2,'0')}`),h('h1',{tabindex:'-1'},round.title),h('p',{class:'round-prompt'},round.prompt)),puzzle.el,h('div',{class:'hint-row'},hint,h('span',{class:'small-note'},'No rush. You’ve got this.')),hintPanel,feedback));
    main.querySelector('h1').focus({preventScroll:true});window.scrollTo(0,0);
  }
  showRound();
}
function showGuide(){
  const main=shell('guide');
  main.append(pageHeading('THE EXPLORER’S NOTEBOOK','A field guide to numbers.','Keep the big ideas close. Open any page for a reminder, a symbol key, and a connection to your textbook.'),h('div',{class:'guide-intro'},icon('compass',24),h('p',{},'The trail follows the development of ideas, not a timeline. These systems arose in different places and periods.')));
  const visuals=[()=>h('p',{class:'guide-example'},'ukasar + ukasar + urapon = 2 + 2 + 1 = 5'),()=>h('p',{class:'guide-example'},'I  V  X  L  C  D  M'),egyptKey,()=>placeBoard('decimal',[1,2,3],[25,5,1]),()=>placeBoard('babylon',[2,3],[60,1]),()=>placeBoard('maya',[1,0,1],[360,20,1]),()=>placeBoard('rods',[2,6,3,4],[1000,100,10,1]),()=>placeBoard('decimal',[3,0,5],[100,10,1])];
  main.append(h('div',{class:'guide-grid'},WORLDS.map((w,i)=>h('details',{class:'guide-card',style:`--accent:${w.color}`},h('summary',{},h('span',{class:'guide-emblem'},emblem(w.emblem)),h('span',{},h('strong',{},w.name),h('small',{},w.topic)),h('span',{class:'disclosure'},'+')),h('div',{class:'guide-body'},h('p',{},w.guide),h('div',{class:'guide-visual'},visuals[i]()),h('p',{class:'takeaway'},w.takeaway),h('p',{class:'small-note'},`Textbook ${w.section} · printed pages ${w.pages}`),unlocked(w)?button('Explore this world',()=>go(worldLink(w)),'button secondary'):h('p',{class:'small-note'},'Complete the previous world to play, or open Classroom mode in settings.'))))));
  main.append(h('div',{class:'teacher-note'},h('h2',{},'For curious classrooms'),h('p',{},'Ask children to explain why a trade keeps the quantity unchanged, invent symbols for a new base, or discuss how a missing zero changes a number. The app covers the chapter’s core ideas; open-ended discussion can continue off-screen.'),h('p',{class:'small-note'},'Aligned to Ganita Prakash, Grade 8, Part I, Chapter 3: A Story of Numbers. Original game activities; numeral drawings are simplified learning diagrams.')));
}
function showLab(){
  const main=shell('lab');let base=5,n=25;
  main.append(pageHeading('NO STARS. JUST CURIOSITY.','The number lab.','One quantity, many ways to write it. Change the number or the base and see what happens.'));
  const baseSelect=h('select',{id:'lab-base',onchange:e=>{base=Number(e.target.value);update();}},[2,3,4,5,6,7,8,9,10].map(b=>h('option',{value:b,selected:b===base},`Base ${b}`)));
  const range=h('input',{type:'range',id:'lab-quantity',min:0,max:255,value:n,oninput:e=>{n=Number(e.target.value);input.value=n;update();}});
  const input=h('input',{type:'number',min:0,max:255,value:n,id:'lab-number','aria-label':'Decimal quantity',onchange:e=>{n=Math.min(255,Math.max(0,Math.round(Number(e.target.value)||0)));e.target.value=n;range.value=n;update();}});
  const board=h('div',{class:'lab-board'}),equation=h('p',{class:'lab-equation','aria-live':'polite'}),numeral=h('strong',{class:'lab-numeral'}),other=h('div',{class:'lab-other'});
  function update(){
    const length=Math.max(2,n?Math.floor(Math.log(n)/Math.log(base))+1:2),weights=placeValues(base,length),digits=digitsFor(n,weights);
    board.replaceChildren(placeBoard('decimal',digits,weights));numeral.textContent=digits.join('').replace(/^0+(?=.)/,'');
    equation.textContent=digits.map((d,i)=>`${d} × ${weights[i]}`).join(' + ')+` = ${n} in decimal`;
    other.replaceChildren(h('article',{class:'lab-mini'},h('h3',{},'Roman'),h('div',{class:'lab-roman'},n?roman(n):'No zero symbol'),h('p',{},'Landmark symbols, with standard short forms.')),
      h('article',{class:'lab-mini'},h('h3',{},'Mayan'),placeBoard('maya',digitsFor(n,[360,20,1]),[360,20,1]),h('p',{},'Places follow the chapter: 1, 20, 360. A shell is zero.')),
      h('article',{class:'lab-mini'},h('h3',{},'Babylonian'),placeBoard('babylon',digitsFor(n,[60,1]),[60,1]),h('p',{},'Modern labels show the places clearly. A dash here marks an empty group.')));
  }
  main.append(h('section',{class:'lab-panel'},h('div',{class:'lab-controls'},h('div',{},h('label',{for:'lab-quantity'},'Decimal quantity'),input,range),h('div',{},h('label',{for:'lab-base'},'Grouping size'),baseSelect)),h('div',{class:'lab-readout'},h('span',{class:'eyebrow'},'YOUR NEW NUMERAL'),numeral,board,equation),h('p',{class:'lab-question'},'Try this: keep the quantity at 25. Switch between bases 10, 8, 5, and 2. What changes? What stays the same?')),other);
  update();
}
function showSettings(){
  const dialog=h('dialog',{class:'settings-dialog','aria-labelledby':'settings-title'});
  const close=button(icon('close',20),()=>dialog.close(),'icon-button');close.setAttribute('aria-label','Close settings');
  const classroomInput=h('input',{type:'checkbox',checked:classroom,onchange:e=>{classroom=e.target.checked;}});
  const resetArea=h('div',{class:'reset-area'});
  dialog.append(h('div',{class:'dialog-heading'},h('h2',{id:'settings-title'},'Adventure settings'),close),h('label',{class:'setting-row'},h('span',{},h('strong',{},'Classroom mode'),h('small',{},'Open all worlds so you can choose the topic to teach.')),classroomInput),h('p',{class:'small-note'},'Stars and progress are saved on this device. Classroom mode lasts until you reload.'),h('p',{class:'offline-status'},offlineReady?'✓ This adventure is ready to play offline.':'Browser offline play becomes available after the first full load. The Android app includes all game content.'),
    h('p',{class:'small-note'},'No account, ads, or tracking. Sound is optional. The game respects reduced-motion settings.'),resetArea,button('Done',()=>dialog.close(),'button primary wide'));
  const reset=()=>resetArea.replaceChildren(button('Reset this device’s progress',()=>resetArea.replaceChildren(h('p',{},'Reset all stars and saved rounds for Number Odyssey on this device?'),h('div',{class:'button-row'},button('Keep my progress',reset,'button secondary'),button('Yes, reset progress',()=>{store.reset();dialog.close();go('journey');},'button danger'))),'text-button danger-text'));
  reset();dialog.addEventListener('close',()=>{dialog.remove();render();},{once:true});app.append(dialog);dialog.showModal();
}
function render(){
  activeDispose();activeDispose=()=>{};
  const [route='journey',id]=location.hash.slice(1).split('/');
  if(route==='guide')showGuide();else if(route==='lab')showLab();else if(route==='world'||route==='play'){
    const w=WORLDS.find(w=>w.id===id);if(w)(route==='play'?play:showWorld)(w);else showMap();
  }else showMap();
  window.scrollTo(0,0);
}
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();document.getElementById('main').focus();});
window.addEventListener('hashchange',render);render();
if('serviceWorker' in navigator && ['http:','https:'].includes(location.protocol)){
  navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{offlineReady=true;}).catch(()=>{});
}
