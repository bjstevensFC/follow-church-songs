const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:816,height:1056}});
await p.goto('file://'+require('path').resolve('Follow_Church_Sunday_Morning_Songs.html'));await p.waitForTimeout(1500);
const info=await p.evaluate(()=>{const o=[];document.querySelectorAll('.nm').forEach(e=>{if(e.scrollWidth>e.clientWidth)o.push(e.textContent)});
document.querySelectorAll('.dots').forEach(e=>{if(e.scrollWidth>e.clientWidth+1)o.push('DOTS '+e.parentNode.textContent)});
const pg=document.querySelector('.page');const last=document.querySelector('ul').getBoundingClientRect().bottom;const f=document.querySelector('footer').getBoundingClientRect().top;
return {o,last,f,sh:pg.scrollHeight}});console.log(JSON.stringify(info));
await p.screenshot({path:'shot.png'});
await p.pdf({path:'Follow_Church_Sunday_Morning_Songs.pdf',width:'8.5in',height:'11in',printBackground:true});await b.close();})();
