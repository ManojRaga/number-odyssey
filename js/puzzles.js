import {h,button,shuffle} from './dom.js';
import {digitVisual,visual,egyptKey,tally,icon} from './visuals.js';
import {roman,valueOf,placeValues,exchange,canExchange,normalized} from './math.js';
import {sound} from './effects.js';

// Each puzzle owns only its controls; the runner owns progress and feedback.
export function renderPuzzle(round,api) {
  const wrap=h('div',{class:'puzzle'});
  if(round.visual) wrap.append(visual(round.visual));
  let check;
  if(round.type==='choice') {
    const options=h('div',{class:`choices ${round.options.every(s=>s.length<15)?'short':''}`});
    for(const answer of shuffle(round.options)) options.append(button(h('span',{},answer),e=>{
      const correct=answer===round.answer;
      if(correct) e.currentTarget.classList.add('correct-choice');
      else { e.currentTarget.classList.add('wrong-choice');e.currentTarget.disabled=true; }
      api.answer(correct);
    },'choice'));
    wrap.append(options);
  } else if(round.type==='tally') {
    const marked=new Set(),counter=h('div',{class:'pebble-row'}),caption=h('p',{class:'live-caption','aria-live':'polite'},'No pebbles yet');
    const herd=h('div',{class:'herd interactive'},Array.from({length:round.count},(_,i)=>{
      const b=button([h('span',{'aria-hidden':'true'},'🐐'),h('i',{class:'animal-tick','aria-hidden':'true'},'✓')],()=>{
        if(marked.has(i)) return;
        marked.add(i); b.classList.add('counted');b.setAttribute('aria-pressed','true');sound.tap();
        counter.append(h('i',{class:'pebble'}));caption.textContent=`${marked.size} animal${marked.size===1?'':'s'} matched to ${marked.size} pebble${marked.size===1?'':'s'}`;
      },'animal-button');b.setAttribute('aria-label',`Count animal ${i+1}`);b.setAttribute('aria-pressed','false');return b;
    }));
    wrap.append(h('div',{class:'herd-scene'},herd,counter,caption));check=()=>api.answer(marked.size===round.count);
  } else if(round.type==='roman') {
    let entered='';
    const inscription=h('output',{class:'artifact inscription carved','aria-label':'Your Roman numeral','aria-live':'polite'},'…');
    const sync=()=>{inscription.textContent=entered || '…';};
    wrap.append(h('div',{class:'roman-key'},[['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]].map(([s,n])=>h('span',{},h('b',{},s),h('small',{},n)))),inscription);
    wrap.append(h('div',{class:'roman-tiles'},['M','D','C','L','X','V','I'].map(s=>button(s,()=>{if(entered.length<18){entered+=s;sync();sound.tap();}},'symbol-button'))));
    wrap.append(h('div',{class:'edit-actions'},button('Undo',()=>{entered=entered.slice(0,-1);sync();},'text-button'),button('Clear',()=>{entered='';sync();},'text-button')));
    check=()=>entered?api.answer(entered===roman(round.target)):api.note('Tap the Roman symbols to make your numeral first.');
  } else if(round.type==='build') {
    const counts=round.weights.map(()=>0),board=h('div',{class:`build-board ${round.system==='maya'?'vertical':''} ${round.system==='binary'?'binary-board':''}`});
    const displays=[],values=[],plus=[],minus=[];
    const expansion=h('p',{class:'expansion','aria-live':'polite'});
    function update() {
      counts.forEach((n,i)=>{
        displays[i].replaceChildren(digitVisual(round.system,n,round.weights[i]));
        values[i].textContent=String(n);
        if(plus[i]) plus[i].disabled=n>=(round.limits?.[i]??9);
        if(minus[i]) minus[i].disabled=n===0;
      });
      expansion.textContent=counts.map((n,i)=>`${n} × ${round.weights[i].toLocaleString('en-IN')}`).join(' + ');
    }
    counts.forEach((n,i)=>{
      const label=round.labels?.[i] || `${round.weights[i].toLocaleString('en-IN')}s`;
      const display=h('div',{class:'digit-display'}),value=h('output',{'aria-label':`Count in ${label}`,class:'counter-value'},'0');
      displays.push(display);values.push(value);
      const cell=h('div',{class:'build-cell'},h('span',{class:'place-label'},round.labels?.[i]||round.weights[i].toLocaleString('en-IN')),display);
      if(round.system==='binary') {
        const toggle=button('Off',()=>{counts[i]=1-counts[i];toggle.textContent=counts[i]?'On':'Off';toggle.classList.toggle('on',!!counts[i]);toggle.setAttribute('aria-pressed',String(!!counts[i]));sound.tap();update();},'bit-switch');
        toggle.setAttribute('aria-label',`Toggle ${round.weights[i]} place`);toggle.setAttribute('aria-pressed','false');cell.append(toggle,value);
      } else {
        const down=button('−',()=>{counts[i]=Math.max(0,counts[i]-1);update();sound.tap();},'stepper');down.setAttribute('aria-label',`Remove one from ${label}`);
        const up=button('+',()=>{counts[i]=Math.min(round.limits?.[i]??9,counts[i]+1);update();sound.tap();},'stepper');up.setAttribute('aria-label',`Add one to ${label}`);
        plus[i]=up;minus[i]=down;cell.append(h('div',{class:'stepper-row'},down,value,up));
        if(round.system==='maya' || round.system==='babylon') {
          const increment=round.system==='maya'?5:10;
          const more=button(`+${increment}`,()=>{counts[i]=Math.min(round.limits?.[i]??19,counts[i]+increment);update();sound.tap();},'small-button');more.setAttribute('aria-label',`Add ${increment} to ${label}`);cell.append(more);
        }
      }
      board.append(cell);
    });
    wrap.append(h('div',{class:'target-strip'},h('span',{},'TARGET QUANTITY'),h('strong',{},round.target.toLocaleString('en-IN')),round.base?h('span',{},`WRITE IN BASE ${round.base}`):null),board,expansion);
    if(round.system==='egypt') wrap.append(egyptKey());
    if(round.system==='shapes') wrap.append(h('p',{class:'micro-copy'},'△ = 1 · □ = 5 · ⬡ = 25 · ○ = 125'));
    if(round.system==='maya') wrap.append(h('p',{class:'micro-copy'},'Dot = 1 · Bar = 5 · Shell = 0 within each level'));
    if(round.system==='babylon') wrap.append(h('p',{class:'micro-copy'},'Corner wedge = 10 · Vertical wedge = 1 within each group'));
    update();check=()=>api.answer(valueOf(counts,round.weights)===round.target);
  } else if(round.type==='exchange') {
    let counts=[...round.counts];const weights=placeValues(round.base,counts.length),total=valueOf(counts,weights);
    const board=h('div',{class:'trade-board'}),report=h('p',{class:'live-caption','aria-live':'polite'});
    const draws=[],labels=[],trades=[];
    function update(message) {
      counts.forEach((n,i)=>{
        draws[i].replaceChildren(...Array.from({length:n},()=>h('i',{class:'bead'})));
        labels[i].textContent=n;trades[i].disabled=!canExchange(counts,i,round.base);
      });
      report.textContent=message || `Total quantity: ${total.toLocaleString('en-IN')}. Every trade preserves it.`;
    }
    counts.forEach((n,i)=>{
      const beads=h('div',{class:'bead-bowl'}),count=h('strong',{class:'bead-count'},n);
      const trade=button(i===0?'Top place':`Trade ${round.base}`,()=>{
        counts=exchange(counts,i,round.base);sound.good();update(`${round.base} × ${weights[i]} became 1 × ${weights[i-1]}. Total stays ${total.toLocaleString('en-IN')}.`);
      },'trade-button');trade.setAttribute('aria-label',`Trade ${round.base} from ${weights[i]} place`);
      draws.push(beads);labels.push(count);trades.push(trade);
      board.append(h('div',{class:'trade-cell'},h('span',{class:'place-label'},weights[i].toLocaleString('en-IN')),beads,count,trade));
    });
    wrap.append(h('div',{class:'target-strip'},h('span',{},'GROUP SIZE'),h('strong',{},round.base),h('span',{},`TOTAL ${total.toLocaleString('en-IN')}`)),board,report);
    update();check=()=>api.answer(normalized(counts,round.base));
  } else if(round.type==='match') {
    const selects=[];
    wrap.append(h('div',{class:'match-rows'},round.rows.map((row,i)=>{
      const select=h('select',{id:`match-${i}`},h('option',{value:''},'Choose a system…'),shuffle(round.options).map(v=>h('option',{value:v},v)));selects.push(select);
      return h('div',{class:'match-row'},h('label',{for:`match-${i}`},row.label),select);
    })));
    check=()=>{
      if(selects.some(s=>!s.value)){api.note('Choose a system for every discovery first.');return;}
      selects.forEach((s,i)=>{s.classList.toggle('matched',s.value===round.rows[i].answer);s.setAttribute('aria-invalid',String(s.value!==round.rows[i].answer));});
      api.answer(selects.every((s,i)=>s.value===round.rows[i].answer));
    };
  }
  if(check) wrap.append(button(['exchange','match'].includes(round.type)?'Check my work':'Check answer',check,'button primary check-button'));
  return {el:wrap,lock(){wrap.querySelectorAll('button,input,select').forEach(b=>b.disabled=true);}};
}
