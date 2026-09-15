import {h,svg} from './dom.js';
import {digitsFor} from './math.js';
const path = (d, extra={}) => svg('path',{d,fill:'none',stroke:'currentColor','stroke-width':2.2,'stroke-linecap':'round','stroke-linejoin':'round',...extra});
export function icon(name,size=24) {
  const s=svg('svg',{viewBox:'0 0 24 24',width:size,height:size,fill:'none',stroke:'currentColor','stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'});
  const paths={
    compass:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M16 8l-3 5-5 3 3-5z',
    map:'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2z M9 3v16 M15 5v16',
    book:'M12 5c-3-3-7-3-10-2v16c4-1 7-1 10 2 3-3 6-3 10-2V3c-3-1-7-1-10 2z M12 5v16',
    flask:'M9 2h6 M10 2v7L4 19q-1 3 3 3h10q4 0 3-3L14 9V2 M7 15h10',
    sound:'M3 9h4l5-5v16l-5-5H3z M16 8q5 4 0 8 M19 5q8 7 0 14',
    mute:'M3 9h4l5-5v16l-5-5H3z M17 9l5 6 M22 9l-5 6',
    lock:'M6 10V7a6 6 0 0 1 12 0v3 M4 10h16v12H4z M12 15v3',
    arrow:'M4 12h16 M14 6l6 6-6 6',
    back:'M20 12H4 M10 6l-6 6 6 6',
    check:'M4 12l5 5L20 6',
    close:'M6 6l12 12 M18 6L6 18',
    bulb:'M8 17c0-3-4-4-4-8a8 8 0 0 1 16 0c0 4-4 5-4 8z M9 21h6',
    settings:'M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M10 15v6'
  };
  s.append(path(paths[name] || paths.compass)); return s;
}
export function egyptGlyph(weight) {
  const d = {
    1:'M15 5v30',
    10:'M5 34V17C5 2 25 2 25 17v17',
    100:'M12 35c0-10 14-12 13-23C24-2 3 0 4 14c0 12 17 11 16 1-1-7-11-6-10 0',
    1000:'M15 34V13 M6 5c0 8 5 12 9 12s9-4 9-12 M15 3v13 M9 34l6-7 6 7z'
  }[weight];
  return svg('svg',{viewBox:'0 0 30 40',class:'egypt-glyph','aria-hidden':'true'},path(d || 'M5 5h20v30H5z'));
}
export function tally(n) {
  return h('div',{class:'tallies',role:'img','aria-label':`${n} tally marks`},Array.from({length:Math.ceil(n/5)},(_,i)=>{
    const count=Math.min(5,n-i*5);
    return h('span',{class:'tally-bundle'},Array.from({length:count},(_,j)=>h('i',{class:j===4?'slash':''})));
  }));
}
export function mayaDigit(n) {
  if(n===0) return h('span',{class:'maya-digit',role:'img','aria-label':'Mayan zero shell'},svg('svg',{viewBox:'0 0 70 36',class:'shell','aria-hidden':'true'},svg('ellipse',{cx:35,cy:18,rx:29,ry:13,fill:'none',stroke:'currentColor','stroke-width':2.5}),path('M7 18h56 M10 24L35 6 60 24 M13 28l22-9 22 9')));
  return h('span',{class:'maya-digit',role:'img','aria-label':`${n%5} dots and ${Math.floor(n/5)} bars`},h('span',{class:'maya-dots'},Array.from({length:n%5},()=>h('i'))),Array.from({length:Math.floor(n/5)},()=>h('i',{class:'maya-bar'})));
}
export function babylonDigit(n) {
  if(n===0) return h('span',{class:'empty-place','aria-label':'empty position'},'—');
  return h('span',{class:'wedges',role:'img','aria-label':`${Math.floor(n/10)} tens wedges and ${n%10} ones wedges`},
    h('span',{class:'wedge-group tens'},Array.from({length:Math.floor(n/10)},()=>h('i',{class:'wedge-ten'}))),
    h('span',{class:'wedge-group ones'},Array.from({length:n%10},()=>h('i',{class:'wedge-one'}))));
}
export function rodDigit(n,weight=1) {
  if(n===0) return h('span',{class:'empty-place','aria-label':'empty position'},'—');
  const zong=Math.round(Math.log10(weight))%2===0;
  const s=svg('svg',{viewBox:'0 0 64 64',class:'rod-digit',role:'img','aria-label':`${n}, ${zong?'Zong':'Heng'} rods`});
  const count=n<=5?n:n-5;
  if(zong) {
    for(let i=0;i<count;i++) s.append(path(`M${32+(i-(count-1)/2)*10} ${n>5?16:10}v${n>5?38:44}`,{'stroke-width':3}));
    if(n>5) s.append(path('M8 16h48',{'stroke-width':3}));
  } else {
    for(let i=0;i<count;i++) s.append(path(`M10 ${n>5?36+i*7:32+(i-(count-1)/2)*9}h44`,{'stroke-width':3}));
    if(n>5) s.append(path('M32 8v28',{'stroke-width':3}));
  }
  return s;
}
export function digitVisual(system,n,weight=1) {
  if(system==='maya') return mayaDigit(n);
  if(system==='babylon') return babylonDigit(n);
  if(system==='rods') return rodDigit(n,weight);
  if(system==='tally') return tally(n*weight);
  if(system==='egypt') return h('div',{class:'glyph-cluster',role:'img','aria-label':`${n} symbols worth ${weight} each`},n?Array.from({length:n},()=>egyptGlyph(weight)):h('span',{class:'empty-place'},'—'));
  if(system==='shapes') {
    const shapes={1:'△',5:'□',25:'⬡',125:'○'};
    return h('div',{class:'shape-cluster','aria-label':`${n} symbols worth ${weight} each`},n?Array.from({length:n},()=>h('span',{},shapes[weight] || '○')):h('span',{class:'empty-place'},'—'));
  }
  return h('span',{class:'large-digit'},n);
}
export function placeBoard(system,digits,weights,opts={}) {
  return h('div',{class:`place-board ${system==='maya'?'vertical':''} ${opts.compact?'compact':''}`},digits.map((n,i)=>h('div',{class:'place-cell'},
    weights?h('span',{class:'place-label'},weights[i].toLocaleString('en-IN')):null,
    digitVisual(system,n,weights?.[i]),opts.showDigits?h('span',{class:'digit-label'},n):null)));
}
export function egyptKey() {
  return h('div',{class:'symbol-key'},[1000,100,10,1].map(n=>h('span',{},egyptGlyph(n),h('small',{},n.toLocaleString('en-IN')))));
}
export function visual(v) {
  if(!v) return null;
  if(v.kind==='tally') return h('div',{class:'artifact stone'},tally(v.n));
  if(v.kind==='inscription') return h('div',{class:'artifact inscription'},v.text);
  if(v.kind==='sequence') return h('div',{class:'sequence'},v.values.map(n=>h('span',{class:n==='?'?'unknown':''},n)));
  if(v.kind==='pairs') return h('div',{class:'pair-groups'},v.values.map(n=>h('span',{class:'pair-group'},Array.from({length:n},()=>h('i',{class:'pebble'})))));
  if(v.kind==='herd') return h('div',{class:'herd-scene'},h('div',{class:'herd'},Array.from({length:v.count},()=>h('span',{class:'animal','aria-hidden':'true'},'🐐'))),h('div',{class:'pebble-row','aria-label':`${v.pebbles} pebbles`},Array.from({length:v.pebbles},()=>h('i',{class:'pebble'}))));
  if(v.kind==='egypt') return h('div',{class:'artifact sand'},placeBoard('egypt',digitsFor(v.n,[1000,100,10,1]),[1000,100,10,1]),egyptKey());
  if(v.kind==='rodPair') return h('div',{class:'artifact rod-pair'},rodDigit(v.n,1),h('span',{},'='),rodDigit(v.n,10));
  if(['babylon','maya','rods'].includes(v.kind)) return h('div',{class:`artifact ${v.kind}`},placeBoard(v.kind,v.digits,v.weights));
  return null;
}
export function emblem(name) {
  if(name==='tally') return tally(5);
  if(name==='roman') return h('span',{class:'emblem-text'},'XIV');
  if(name==='egypt') return egyptGlyph(1000);
  if(name==='base') return h('span',{class:'emblem-text'},'5ⁿ');
  if(name==='babylon') return babylonDigit(12);
  if(name==='maya') return mayaDigit(7);
  if(name==='rods') return rodDigit(6);
  return h('span',{class:'emblem-zero'},'0');
}
export function compassArt() {
  const markings=Array.from({length:40},(_,i)=>{
    const a=i*Math.PI/20,r=i%5?137:130;
    return svg('line',{x1:180+Math.sin(a)*r,y1:180-Math.cos(a)*r,x2:180+Math.sin(a)*145,y2:180-Math.cos(a)*145,stroke:'currentColor','stroke-width':i%5?1:2,opacity:.55});
  });
  return h('div',{class:'compass-art','aria-hidden':'true'},
    svg('svg',{viewBox:'0 0 360 360',class:'compass-ring'},svg('circle',{cx:180,cy:180,r:150,fill:'none',stroke:'currentColor','stroke-width':1}),svg('circle',{cx:180,cy:180,r:116,fill:'none',stroke:'currentColor','stroke-width':1,'stroke-dasharray':'2 8',opacity:.45}),...markings,path('M180 12l7 15h-14z M180 348l7-15h-14z M12 180l15-7v14z M348 180l-15-7v14z',{fill:'currentColor','stroke-width':1})),
    h('div',{class:'compass-core'},h('span',{},'0'),h('small',{},'INFINITE POSSIBILITIES')),
    h('span',{class:'orbit-token token-one'},'XIV'),h('span',{class:'orbit-token token-two'},mayaDigit(7)),h('span',{class:'orbit-token token-three'},egyptGlyph(100)),h('span',{class:'orbit-star'},'✦'));
}
