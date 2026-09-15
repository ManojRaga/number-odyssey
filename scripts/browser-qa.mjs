// Optional end-to-end checks. Set ODYSSEY_PLAYWRIGHT / ODYSSEY_CHROMIUM when
// using a preinstalled browser runtime; otherwise install Playwright locally.
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {WORLDS} from '../www/js/content.js';
import {roman,digitsFor,exchange,normalized} from '../www/js/math.js';
const arg=name=>process.argv.find(a=>a.startsWith(`--${name}=`))?.slice(name.length+3);
const {chromium}=await import(arg('playwright') || process.env.ODYSSEY_PLAYWRIGHT || 'playwright');
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:arg('chromium') || process.env.ODYSSEY_CHROMIUM || undefined});
const context=await browser.newContext({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const base=arg('url') || 'http://localhost:8140';
try{
  await page.goto(base);await page.getByRole('heading',{name:'Every number has a story.'}).waitFor();
  await page.screenshot({path:'test-results/journey-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/journey-mobile.png',fullPage:true});
  assert.equal(await page.locator('.world-card:disabled').count(),7);
  await page.getByRole('button',{name:'Start adventure',exact:true}).click();await page.getByRole('button',{name:'Let’s explore',exact:true}).click();
  await page.screenshot({path:'test-results/pebble-mobile.png',fullPage:true});
  if(process.argv.includes('--deployed')){
    for(let i=1;i<=7;i++)await page.getByRole('button',{name:`Count animal ${i}`,exact:true}).click();
    await page.getByRole('button',{name:'Check answer',exact:true}).click();await page.locator('.feedback.success').waitFor();
    await page.getByRole('button',{name:'Number lab',exact:true}).click();
    await page.getByLabel('Grouping size').selectOption('2');assert.equal(await page.locator('.lab-numeral').innerText(),'11001');
    const scope=await page.evaluate(async()=>(await navigator.serviceWorker.ready).scope);
    assert.equal(scope,new URL('./',base).href);
    await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'The number lab.',exact:true}).waitFor();
    await page.getByRole('button',{name:'Journey',exact:true}).click();await page.getByRole('button',{name:'Continue adventure',exact:true}).click();
    await page.getByRole('button',{name:'Resume this world',exact:true}).click();await page.getByRole('heading',{name:'The missing travellers',exact:true}).waitFor();
    console.log(`✓ Published app, gameplay, base conversion, service-worker scope, offline reload and saved progress: ${base}`);
  }
  else if(process.argv.includes('--edge')){
    await page.goto(base);await page.reload();await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link:focus').count(),1);
    await page.keyboard.press('Enter');assert.equal(await page.locator('#main:focus').count(),1);
    await page.setViewportSize({width:320,height:740});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.getByRole('button',{name:'Adventure settings',exact:true}).click();
    await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Done',exact:true}).click();
    await page.locator('.classroom-banner').waitFor();
    assert.equal(await page.locator('.world-card:disabled').count(),0);
    await page.getByRole('button',{name:/Nile Workshop.*Open world/}).click();await page.getByRole('button',{name:'Let’s explore',exact:true}).click();
    await page.getByRole('button',{name:'213',exact:true}).click();await page.getByRole('button',{name:'Next discovery',exact:true}).click();
    await page.getByRole('button',{name:'Need a clue?',exact:true}).click();await page.locator('.hint-panel').waitFor();
    for(const [place,count] of [[100,3],[10,2],[1,4]])for(let i=0;i<count;i++)await page.getByRole('button',{name:`Add one to ${place}s`,exact:true}).click();
    await page.getByRole('button',{name:'Check answer',exact:true}).click();await page.getByRole('button',{name:'Next discovery',exact:true}).click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:'test-results/egypt-320.png',fullPage:true});
    await page.getByRole('button',{name:'Journey',exact:true}).click();
    await page.screenshot({path:'test-results/journey-320.png',fullPage:true});
    await page.getByRole('button',{name:'Adventure settings',exact:true}).click();
    await page.getByRole('button',{name:'Reset this device’s progress',exact:true}).click();
    await page.getByRole('button',{name:'Keep my progress',exact:true}).click();await page.getByRole('button',{name:'Done',exact:true}).click();
    await page.getByRole('button',{name:'Continue adventure',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Resume this world',exact:true}).count(),1);
    await page.getByRole('button',{name:'Journey',exact:true}).click();await page.setViewportSize({width:768,height:1024});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'test-results/journey-tablet.png',fullPage:true});
    await page.getByRole('button',{name:'Field guide',exact:true}).first().click();await page.locator('summary').filter({hasText:'Maya Steps'}).click();
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/guide-mobile-final.png',fullPage:true});
    console.log('✓ Keyboard skip link, 320px and tablet layouts, hint, classroom mode, and safe reset cancellation');
  }
  else if(!process.argv.includes('--full')){console.log('Preview screenshots captured.');}
  else{
    for(const [wi,world] of WORLDS.entries()){
      if(wi>0){await page.getByRole('button',{name:`Next: ${world.name}`,exact:true}).click();await page.getByRole('button',{name:'Let’s explore',exact:true}).click();}
      for(const [ri,round] of world.rounds.entries()){
        await page.getByRole('heading',{name:round.title,exact:true}).waitFor();
        // Save/resume with a missed attempt is tested through the visible flow.
        if(round.id==='p2'){
          await page.getByRole('button',{name:'1',exact:true}).click();
          await page.getByRole('button',{name:'Map',exact:true}).click();
          await page.getByRole('button',{name:'Continue adventure',exact:true}).click();
          await page.getByRole('button',{name:'Resume this world',exact:true}).click();
          await page.getByRole('heading',{name:round.title,exact:true}).waitFor();
          await page.reload();await page.getByRole('heading',{name:round.title,exact:true}).waitFor();
        }
        if(round.type==='choice')await page.getByRole('button',{name:round.answer,exact:true}).click();
        else if(round.type==='tally'){
          for(let i=1;i<=round.count;i++)await page.getByRole('button',{name:`Count animal ${i}`,exact:true}).click();
          await page.getByRole('button',{name:'Check answer',exact:true}).click();
        }else if(round.type==='roman'){
          for(const char of roman(round.target))await page.getByRole('button',{name:char,exact:true}).click();
          await page.getByRole('button',{name:'Check answer',exact:true}).click();
        }else if(round.type==='build'){
          const digits=digitsFor(round.target,round.weights);
          for(const [i,count] of digits.entries()){
            if(round.system==='binary'){if(count)await page.getByRole('button',{name:`Toggle ${round.weights[i]} place`,exact:true}).click();continue;}
            const label=round.labels?.[i] || `${round.weights[i].toLocaleString('en-IN')}s`;
            const inc=round.system==='maya'?5:round.system==='babylon'?10:1;
            for(let j=0;j<Math.floor(count/inc)&&inc>1;j++)await page.getByRole('button',{name:`Add ${inc} to ${label}`,exact:true}).click();
            for(let j=0;j<(inc>1?count%inc:count);j++)await page.getByRole('button',{name:`Add one to ${label}`,exact:true}).click();
          }
          if(['m6','z6','e3','c3'].includes(round.id))await page.screenshot({path:`test-results/${round.id}-mobile.png`,fullPage:true});
          await page.getByRole('button',{name:'Check answer',exact:true}).click();
        }else if(round.type==='exchange'){
          let counts=[...round.counts];
          for(let i=counts.length-1;i>0;i--)while(counts[i]>=round.base){
            await page.getByRole('button',{name:`Trade ${round.base} from ${round.base**(counts.length-i-1)} place`,exact:true}).click();counts=exchange(counts,i,round.base);
          }
          assert.ok(normalized(counts,round.base));await page.getByRole('button',{name:'Check my work',exact:true}).click();
        }else if(round.type==='match'){
          for(const [i,row] of round.rows.entries())await page.locator(`#match-${i}`).selectOption(row.answer);
          await page.getByRole('button',{name:'Check my work',exact:true}).click();
        }
        await page.locator('.feedback.success').waitFor();
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
        assert.equal(overflow,false,`${round.id} horizontal overflow`);
        await page.getByRole('button',{name:ri===world.rounds.length-1?'Collect discovery':'Next discovery',exact:true}).click();
      }
      await page.locator('.results-card').waitFor();console.log(`✓ ${world.name}: ${world.rounds.length} activities completed`);
      if(wi===0)assert.equal(await page.locator('.results-card .stars').getAttribute('aria-label'),'3 of 3 stars'); // 6/7 = 86%, including the persisted retry.
    }
    await page.screenshot({path:'test-results/completed-mobile.png',fullPage:true});
    await page.getByRole('button',{name:'Back to the trail',exact:true}).click();
    assert.equal(await page.locator('.world-card:disabled').count(),0);
    assert.match(await page.locator('.star-total').innerText(),/24/);
    await page.getByRole('button',{name:'Field guide',exact:true}).first().click();
    await page.locator('summary').filter({hasText:'Maya Steps'}).click();
    await page.screenshot({path:'test-results/guide-mobile.png',fullPage:true});
    await page.getByRole('button',{name:'Number lab',exact:true}).click();
    await page.getByLabel('Grouping size').selectOption('2');assert.equal(await page.locator('.lab-numeral').innerText(),'11001');
    await page.getByRole('spinbutton',{name:'Decimal quantity',exact:true}).fill('0');await page.getByRole('spinbutton',{name:'Decimal quantity',exact:true}).press('Tab');assert.equal(await page.locator('.lab-numeral').innerText(),'0');
    await page.screenshot({path:'test-results/lab-mobile.png',fullPage:true});
    await page.evaluate(()=>navigator.serviceWorker.ready);
    await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'The number lab.',exact:true}).waitFor();
    console.log('✓ Offline reload, field guide, lab, progress, and all 57 activities');
  }
  assert.deepEqual(errors,[]);console.log('✓ No browser runtime errors');
}finally{await browser.close();}
