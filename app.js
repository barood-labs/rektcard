const $=id=>document.getElementById(id);
const SOL_RPCS=['https://solana-rpc.publicnode.com','https://api.mainnet-beta.solana.com'],ETH_RPCS=['https://ethereum-rpc.publicnode.com','https://eth.llamarpc.com'];
async function rpc(urls,method,params){for(const u of urls){try{const r=await fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});const j=await r.json();if(j.result!==undefined)return j.result}catch(e){}}throw new Error('rpc')}
function kind(q){if(/^0x[0-9a-fA-F]{40}$/.test(q))return'eth';if(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(q))return'sol';if(/^@?[A-Za-z0-9_]{1,15}$/.test(q))return'x';return null}
async function solStats(a){const [b,sigs,tok]=await Promise.all([rpc(SOL_RPCS,'getBalance',[a]),rpc([SOL_RPCS[1]],'getSignaturesForAddress',[a,{limit:1000}]).catch(()=>null),rpc(SOL_RPCS,'getTokenAccountsByOwner',[a,{programId:'TokenkegQfeZyiNwAJbNbGywPxBTq9fwsPKrb8wcBqgeQ'},{encoding:'jsonParsed'}]).catch(()=>({value:[]}))]);
 const t=sigs&&sigs[0]&&sigs[0].blockTime;return{unit:'SOL',bal:b.value/1e9,txs:sigs?sigs.length:null,failed:sigs?sigs.slice(0,100).filter(s=>s.err).length:0,tokens:(tok.value||[]).filter(x=>+x.account.data.parsed.info.tokenAmount.uiAmount>0).length,ageDays:t?Math.round((Date.now()/1e3-t)/86400):null}}
async function holdsCA(a){try{if(typeof CA!=='string'||!CA.trim()||!window.RektHolder)return 0;return await RektHolder.balance(a,CA.trim(),rpc,SOL_RPCS)}catch(e){return 0}}
async function ethStats(a){const[b,n]=await Promise.all([rpc(ETH_RPCS,'eth_getBalance',[a,'latest']),rpc(ETH_RPCS,'eth_getTransactionCount',[a,'latest'])]);return{unit:'ETH',bal:Number(BigInt(b))/1e18,txs:parseInt(n,16),failed:0,tokens:0,ageDays:null}}
function wrap(c,t,x,y,w,lh){const ws=t.split(' ');let l='';for(const w2 of ws){const s=l+w2+' ';if(c.measureText(s).width>w&&l){c.fillText(l,x,y);l=w2+' ';y+=lh}else l=s}c.fillText(l,x,y);return y+lh}
const MEMES=['rocket','crying','wallet_fire','clown','rug','skeleton'].map(n=>{const i=new Image();i.src='img/'+n+'.webp';return i});
const memeFor=s=>MEMES[Math.min(5,Math.floor((s-1)/16.5))];
function draw(title,lines,score,holder){const c=$('card').getContext('2d'),W=1080,H=1350;const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1a0a05');g.addColorStop(1,'#0b0b0f');c.fillStyle=g;c.fillRect(0,0,W,H);
 if(holder){const gg=c.createLinearGradient(0,0,W,0);gg.addColorStop(0,'#b8860b');gg.addColorStop(.5,'#ffe27a');gg.addColorStop(1,'#b8860b');c.strokeStyle=gg;c.lineWidth=24;c.strokeRect(18,18,W-36,H-36);c.fillStyle=gg;c.fillRect(W-430,70,360,80);c.fillStyle='#1a0a05';c.font='900 40px system-ui,sans-serif';c.textAlign='center';c.fillText('👑 REKT HOLDER',W-250,124)}else{c.strokeStyle='#ff4d1a';c.lineWidth=12;c.strokeRect(24,24,W-48,H-48)}c.textAlign='left';c.fillStyle='#ff4d1a';c.font='900 64px system-ui,sans-serif';c.fillText('🔥 REKTCARD',70,130);
 c.fillStyle='#aaa';c.font='600 36px monospace';c.fillText(title,70,200);let y=300;c.fillStyle='#fff';c.font='600 46px system-ui,sans-serif';for(const l of lines){y=wrap(c,l,70,y,W-140,60)+30}
 const im=memeFor(score);if(im.complete&&im.naturalWidth){c.drawImage(im,W-70-300,H-130-300,300,300)}
 if(holder){c.fillStyle='#ffd34d';c.font='700 34px system-ui,sans-serif';c.fillText('Holder detected. Roast softened 10%.',70,H-330)}
 c.fillStyle=holder?'#ffd34d':'#ff4d1a';c.font='900 120px system-ui,sans-serif';c.fillText(score+'%',70,H-190);c.fillStyle='#ddd';c.font='600 40px system-ui,sans-serif';c.fillText('REKT SCORE',70,H-130);
 c.fillStyle='#777';c.font='28px system-ui,sans-serif';c.textAlign='right';c.fillText('for fun only · not financial advice',W-70,H-70)}
const short=a=>a.length>16?a.slice(0,6)+'…'+a.slice(-4):a;
async function roast(q){q=q.trim();const k=kind(q);if(!k){$('status').textContent='That doesn\'t look like a wallet or X handle.';return}
 $('status').textContent='Reading the chain… 🔍';$('go').disabled=true;let lines,title,holder=0,handle=null;
 try{if(k==='x'){const h='@'+q.replace(/^@/,'');handle=h;title=h;lines=Roasts.handleRoast(h)}else{const[s,hb]=k==='sol'?[await solStats(q),await holdsCA(q)]:[await ethStats(q),0];holder=hb>0;title=short(q)+' · '+s.unit;lines=Roasts.walletRoast(s,q);window.__stats=s}
  let sc=Roasts.score(q);if(holder)sc=Math.max(1,Math.round(sc*0.9));window.__holder=holder;document.body.dataset.holder=holder?'1':'0';const mi=memeFor(sc);if(!mi.complete)await new Promise(r=>{mi.onload=mi.onerror=r});draw(title,lines,sc,holder);$('out').hidden=false;$('status').textContent='';
  $('tw').href='https://x.com/intent/post?text='+encodeURIComponent(handle?`Just roasted ${handle} on Rektcard 🔥 Rekt Score: ${sc}%\n"${lines[0]}"\n\nGet yours https://rektcard.fun $REKT`:`I just got roasted by Rektcard 🔥 Rekt score: ${sc}%${holder?' (REKT HOLDER 👑)':''}\n"${lines[0]}"\n\nGet yours via @Rektcardxyz: https://rektcard.fun $REKT`);window.__tw=$('tw').href;return{sc,lines,handle};
  $('out').scrollIntoView({behavior:'smooth'})}catch(e){$('status').textContent='Chain is being shy right now — try again in a sec.'}finally{$('go').disabled=false}}
async function roastFriend(){let h=$('fq').value.trim().replace(/^@/,'');if(!/^[A-Za-z0-9_]{1,15}$/.test(h)){$('status').textContent='Enter a friend\'s @handle.';return}const w=window.open('about:blank','_blank');$('q').value='@'+h;const r=await roast('@'+h);if(!r){if(w)w.close();return}const u=$('tw').href;if(w){w.location=u}else location.href=u}
$('ff').onsubmit=e=>{e.preventDefault();roastFriend()};
$('f').onsubmit=e=>{e.preventDefault();roast($('q').value)};$('again').onclick=()=>{$('q').value='';$('out').hidden=true;$('q').focus()};
$('dl').onclick=()=>{const a=document.createElement('a');a.download='rektcard.png';a.href=$('card').toDataURL('image/png');a.click()};
$('share').onclick=()=>$('card').toBlob(async b=>{const f=new File([b],'rektcard.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text:'Got roasted by Rektcard 🔥'}).catch(()=>{});else $('dl').click()});
const p=new URLSearchParams(location.search).get('q');if(p){$('q').value=p;roast(p)}
if(typeof CA==='string'&&CA.trim()){$('caval').textContent=CA.trim();$('ca').hidden=false;$('cacopy').onclick=()=>navigator.clipboard.writeText(CA.trim()).then(()=>{$('cacopy').textContent='Copied ✓';setTimeout(()=>$('cacopy').textContent='Copy',1500)})}

if(typeof CA==='string'&&CA.trim()){$('rekt').hidden=false;$('soon').hidden=true;for(const[id,u]of[['buy',typeof BUY_URL==='string'?BUY_URL:''],['chart',typeof CHART_URL==='string'?CHART_URL:'']])if(u.trim()){$(id).href=u.trim();$(id).hidden=false}}
