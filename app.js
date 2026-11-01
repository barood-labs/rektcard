const $=id=>document.getElementById(id);
const SOL_RPCS=['https://solana-rpc.publicnode.com','https://api.mainnet-beta.solana.com'],ETH_RPCS=['https://ethereum-rpc.publicnode.com','https://eth.llamarpc.com'];
async function rpc(urls,method,params){for(const u of urls){try{const r=await fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});const j=await r.json();if(j.result!==undefined)return j.result}catch(e){}}throw new Error('rpc')}
function kind(q){if(/^0x[0-9a-fA-F]{40}$/.test(q))return'eth';if(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(q))return'sol';if(/^@?[A-Za-z0-9_]{1,15}$/.test(q))return'x';return null}
async function solStats(a){const [b,sigs,tok]=await Promise.all([rpc(SOL_RPCS,'getBalance',[a]),rpc([SOL_RPCS[1]],'getSignaturesForAddress',[a,{limit:1000}]).catch(()=>null),rpc(SOL_RPCS,'getTokenAccountsByOwner',[a,{programId:'TokenkegQfeZyiNwAJbNbGywPxBTq9fwsPKrb8wcBqgeQ'},{encoding:'jsonParsed'}]).catch(()=>({value:[]}))]);
 const t=sigs&&sigs[0]&&sigs[0].blockTime;return{unit:'SOL',bal:b.value/1e9,txs:sigs?sigs.length:null,failed:sigs?sigs.slice(0,100).filter(s=>s.err).length:0,tokens:(tok.value||[]).filter(x=>+x.account.data.parsed.info.tokenAmount.uiAmount>0).length,ageDays:t?Math.round((Date.now()/1e3-t)/86400):null}}
async function ethStats(a){const[b,n]=await Promise.all([rpc(ETH_RPCS,'eth_getBalance',[a,'latest']),rpc(ETH_RPCS,'eth_getTransactionCount',[a,'latest'])]);return{unit:'ETH',bal:Number(BigInt(b))/1e18,txs:parseInt(n,16),failed:0,tokens:0,ageDays:null}}
function wrap(c,t,x,y,w,lh){const ws=t.split(' ');let l='';for(const w2 of ws){const s=l+w2+' ';if(c.measureText(s).width>w&&l){c.fillText(l,x,y);l=w2+' ';y+=lh}else l=s}c.fillText(l,x,y);return y+lh}
function draw(title,lines,score){const c=$('card').getContext('2d'),W=1080,H=1350;const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1a0a05');g.addColorStop(1,'#0b0b0f');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.strokeStyle='#ff4d1a';c.lineWidth=12;c.strokeRect(24,24,W-48,H-48);c.textAlign='left';c.fillStyle='#ff4d1a';c.font='900 64px system-ui,sans-serif';c.fillText('🔥 REKTCARD',70,130);
 c.fillStyle='#aaa';c.font='600 36px monospace';c.fillText(title,70,200);let y=300;c.fillStyle='#fff';c.font='600 46px system-ui,sans-serif';for(const l of lines){y=wrap(c,l,70,y,W-140,60)+30}
 c.fillStyle='#ff4d1a';c.font='900 120px system-ui,sans-serif';c.fillText(score+'%',70,H-190);c.fillStyle='#ddd';c.font='600 40px system-ui,sans-serif';c.fillText('REKT SCORE',70,H-130);
 c.fillStyle='#777';c.font='28px system-ui,sans-serif';c.textAlign='right';c.fillText('for fun only · not financial advice',W-70,H-70)}
const short=a=>a.length>16?a.slice(0,6)+'…'+a.slice(-4):a;
async function roast(q){q=q.trim();const k=kind(q);if(!k){$('status').textContent='That doesn\'t look like a wallet or X handle.';return}
 $('status').textContent='Reading the chain… 🔍';$('go').disabled=true;let lines,title;
 try{if(k==='x'){const h='@'+q.replace(/^@/,'');title=h;lines=Roasts.handleRoast(h)}else{const s=k==='sol'?await solStats(q):await ethStats(q);title=short(q)+' · '+s.unit;lines=Roasts.walletRoast(s,q);window.__stats=s}
  const sc=Roasts.score(q);draw(title,lines,sc);$('out').hidden=false;$('status').textContent='';
  $('tw').href='https://x.com/intent/post?text='+encodeURIComponent(`I just got roasted by Rektcard 🔥 Rekt score: ${sc}%\n"${lines[0]}"\n\nGet yours via @Rektcardxyz:`)+'&url='+encodeURIComponent('https://rektcard.fun');
  $('out').scrollIntoView({behavior:'smooth'})}catch(e){$('status').textContent='Chain is being shy right now — try again in a sec.'}finally{$('go').disabled=false}}
$('f').onsubmit=e=>{e.preventDefault();roast($('q').value)};$('again').onclick=()=>{$('q').value='';$('out').hidden=true;$('q').focus()};
$('dl').onclick=()=>{const a=document.createElement('a');a.download='rektcard.png';a.href=$('card').toDataURL('image/png');a.click()};
$('share').onclick=()=>$('card').toBlob(async b=>{const f=new File([b],'rektcard.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text:'Got roasted by Rektcard 🔥'}).catch(()=>{});else $('dl').click()});
const p=new URLSearchParams(location.search).get('q');if(p){$('q').value=p;roast(p)}
if(typeof CA==='string'&&CA.trim()){$('caval').textContent=CA.trim();$('ca').hidden=false;$('cacopy').onclick=()=>navigator.clipboard.writeText(CA.trim()).then(()=>{$('cacopy').textContent='Copied ✓';setTimeout(()=>$('cacopy').textContent='Copy',1500)})}
