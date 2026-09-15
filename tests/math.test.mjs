import test from 'node:test';
import assert from 'node:assert/strict';
import {roman,parseRoman,digitsFor,valueOf,placeValues,mayaDigits,exchange,normalized,starScore} from '../www/js/math.js';
import {createStore} from '../www/js/state.js';
import {WORLDS} from '../www/js/content.js';

test('Roman numerals cover standard subtractive boundaries and round-trip all supported integers',()=>{
  for(const [n,s] of [[4,'IV'],[9,'IX'],[49,'XLIX'],[302,'CCCII'],[944,'CMXLIV'],[1999,'MCMXCIX'],[2999,'MMCMXCIX'],[3999,'MMMCMXCIX']]) assert.equal(roman(n),s);
  for(let n=1;n<=3999;n++)assert.equal(parseRoman(roman(n)),n);
  for(const s of ['','IIII','IL','IC','VX','IIV','MMMM','0','hello']) assert.equal(parseRoman(s),null);
  assert.throws(()=>roman(0));assert.throws(()=>roman(1.5));assert.throws(()=>roman(4000));
});
test('Positional conversion preserves quantity, including zeros and base boundaries',()=>{
  assert.deepEqual(digitsFor(25,placeValues(2,5)),[1,1,0,0,1]);
  assert.deepEqual(digitsFor(25,placeValues(8,2)),[3,1]);
  assert.deepEqual(digitsFor(25,placeValues(5,3)),[1,0,0]);
  assert.deepEqual(digitsFor(3605,[3600,60,1]),[1,0,5]);
  for(const base of [2,3,5,7,8,10,60]) for(let n=0;n<=255;n++){
    const weights=placeValues(base,8),digits=digitsFor(n,weights);
    assert.equal(valueOf(digits,weights),n);assert.ok(digits.every(d=>d>=0&&d<base));
  }
});
test('Mayan conversion uses the textbook’s mixed-radix 360 place, including carries',()=>{
  for(const [n,expected] of [[0,[0,0,0,0]],[77,[0,0,3,17]],[359,[0,0,17,19]],[360,[0,1,0,0]],[361,[0,1,0,1]],[721,[0,2,0,1]],[1660,[0,4,11,0]],[7200,[1,0,0,0]]])assert.deepEqual(mayaDigits(n),expected);
  for(let n=0;n<144000;n++){
    const digits=mayaDigits(n);assert.equal(valueOf(digits,[7200,360,20,1]),n);assert.ok(digits[2]<18&&digits[3]<20);
  }
});
test('Every regrouping preserves value and supports cascading carries',()=>{
  for(const [base,start,end] of [[10,[0,15,15],[1,6,5]],[5,[0,6,8],[1,2,3]],[10,[2,9,4,10],[2,9,5,0]],[10,[0,9,19],[1,0,9]]]){
    let counts=[...start];const weights=placeValues(base,counts.length),total=valueOf(counts,weights);
    for(let i=counts.length-1;i>0;i--)while(counts[i]>=base){counts=exchange(counts,i,base);assert.equal(valueOf(counts,weights),total);}
    assert.deepEqual(counts,end);assert.ok(normalized(counts,base));
  }
  assert.deepEqual(exchange([1,2],1,5),[1,2]);assert.deepEqual(exchange([10,2],0,5),[10,2]);
  const original=[0,10];exchange(original,1,10);assert.deepEqual(original,[0,10]);
});
test('Scoring rewards mastery while retaining stars earned earlier',()=>{
  assert.equal(starScore(6,7),3);assert.equal(starScore(5,7),2);assert.equal(starScore(4,7),2);assert.equal(starScore(3,7),1);assert.equal(starScore(0,7),1);
  const storage=memory();const s=createStore(storage);s.finish('pebbles',3);s.finish('pebbles',1);assert.equal(s.stars('pebbles'),3);
  assert.equal(s.unlocked(0,WORLDS),true);assert.equal(s.unlocked(1,WORLDS),true);assert.equal(s.unlocked(2,WORLDS),false);
  s.saveRun('rome',{index:3,hits:2,missed:true});assert.deepEqual(createStore(storage).run('rome'),{index:3,hits:2,missed:true});
  s.finish('rome',2);assert.equal(s.run('rome'),null);s.reset();assert.equal(s.total(),0);assert.equal(s.run('pebbles'),null);
});
function memory(){const map=new Map();return{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('Storage failures and corrupt data cannot block a child’s game',()=>{
  const bad={getItem:()=>'{invalid',setItem:()=>{throw new Error('quota');}};const s=createStore(bad);assert.equal(s.total(),0);assert.doesNotThrow(()=>s.finish('pebbles',3));assert.equal(s.persistent(),false);
  const hostile={getItem:()=>JSON.stringify({stars:{pebbles:'3',rome:-1,egypt:900},runs:{pebbles:{index:-1,hits:12}}}),setItem:()=>{}};
  assert.equal(createStore(hostile).total(),0);assert.equal(createStore(hostile).run('pebbles'),null);
});
test('Every chapter activity has a reachable answer, instructions, feedback, and a unique identity',()=>{
  const ids=new Set();assert.equal(WORLDS.length,8);
  for(const w of WORLDS) for(const r of w.rounds){
    assert.ok(!ids.has(r.id));ids.add(r.id);for(const key of ['title','prompt','why','hint'])assert.ok(r[key],`${r.id} missing ${key}`);
    if(r.type==='choice'){assert.ok(r.options.includes(r.answer));assert.equal(new Set(r.options).size,r.options.length);}
    if(r.type==='build'){const digits=digitsFor(r.target,r.weights);assert.equal(valueOf(digits,r.weights),r.target);digits.forEach((d,i)=>assert.ok(d<=(r.limits?.[i]??9),`${r.id} target exceeds controls`));}
    if(r.type==='match')r.rows.forEach(row=>assert.ok(r.options.includes(row.answer)));
  }
  assert.equal(ids.size,57);
});
