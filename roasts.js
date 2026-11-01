// Templated roast engine (no API, no keys). Deterministic per input via seeded RNG.
(function(g){
function seed(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h=Math.imul(h^(h>>>15),2246822507);h=Math.imul(h^(h>>>13),3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function walletRoast(s,key){const r=seed(key),L=[],u=s.unit;
 if(s.bal===0)L.push(pick(r,[`0 ${u}. This wallet isn't a portfolio, it's a crime scene.`,`Balance: 0 ${u}. Even the gas fees left you.`]));
 else if(s.bal<0.05)L.push(pick(r,[`${s.bal.toFixed(4)} ${u}. That's not a bag, that's a crumb.`,`${s.bal.toFixed(4)} ${u} left. Exit liquidity has never looked so humble.`]));
 else if(s.bal<5)L.push(pick(r,[`${s.bal.toFixed(2)} ${u}. Rich enough to ape, too poor to recover.`,`${s.bal.toFixed(2)} ${u}: the "one more trade and I'm out" stack.`]));
 else L.push(pick(r,[`${s.bal.toFixed(1)} ${u} sitting there. Must be nice to be late to every pump with style.`,`${s.bal.toFixed(1)} ${u}? Whale-ish. The dev thanks you for your service.`]));
 if(s.txs==null)L.push(pick(r,[`Trade history? Hidden. Smart — we wouldn't show it either.`,`Can't see your trades. Honestly, that's the kindest thing the chain has done for you.`]));
 else if(s.txs>=1000)L.push(pick(r,[`${s.txs}+ transactions. Touch grass? You can't even touch "sell" properly.`,`${s.txs}+ txs. This isn't trading, it's a gambling addiction with a block explorer.`]));
 else if(s.txs>100)L.push(pick(r,[`${s.txs} transactions. Validators know you by name.`,`${s.txs} txs and still no exit strategy.`]));
 else if(s.txs>0)L.push(pick(r,[`Only ${s.txs} transactions. Scared money detected.`,`${s.txs} txs. You treat the chain like a museum: look, don't touch.`]));
 else L.push(`Zero transactions. A wallet so fresh it still smells like seed phrase.`);
 if(s.failed>3)L.push(`${s.failed} failed transactions recently. Even the blockchain said "no."`);
 if(s.tokens>20)L.push(`${s.tokens} different tokens. You don't have a portfolio, you have a graveyard with tickers.`);
 else if(s.tokens>0)L.push(`${s.tokens} token${s.tokens>1?'s':''} in the bag. Each one a lesson you refused to learn.`);
 if(s.ageDays!=null)L.push(s.ageDays>365?`On-chain for ${Math.round(s.ageDays/365*10)/10} years and still buying tops.`:`Active ${s.ageDays} days ago. Bold of you to keep showing up.`);
 L.push(pick(r,[`Verdict: certified exit liquidity.`,`Verdict: buys the rumor, holds the funeral.`,`Verdict: diamond hands, cardboard brain.`,`Verdict: the market's favorite donor.`]));
 return L.slice(0,4)}
function handleRoast(h){const r=seed(h.toLowerCase()),L=[],n=h.replace(/^@/,'');
 if(/\d{3,}/.test(n))L.push(`@${n} — the numbers in your handle are the only thing up only.`);
 if(/(sol|eth|btc|crypto|degen|ape|moon|pump)/i.test(n))L.push(`A crypto word in the handle. Bold to brand yourself after the thing that took your money.`);
 if(/(king|god|alpha|whale|chad|goat)/i.test(n))L.push(`Calling yourself that? Your followers call it "reply guy energy."`);
 if(n.length>12)L.push(`${n.length} characters long. Even your handle can't take profit early.`);
 if(n.length<=5)L.push(`Short handle, short attention span, short every bottom.`);
 while(L.length<3)L.push(pick(r,[`Posts "gm" like it's a job. It's the only thing you're consistent at.`,`Your timeline is 40% "wagmi" and 60% deleted calls.`,`Has "NFA" in the bio and still gives the worst advice on the app.`,`Bought every top you ever tweeted about. Respect the dedication.`,`Engagement-farms harder than any yield farm you aped into.`]));
 L.push(pick(r,[`Verdict: main character, side quest portfolio.`,`Verdict: thread guy with no thread to hold onto.`]));
 return[...new Set(L)].slice(0,4)}
const score=(k)=>1+Math.floor(seed(k+'s')()*99);
g.Roasts={walletRoast,handleRoast,score};if(typeof module!=='undefined')module.exports=g.Roasts})(typeof window!=='undefined'?window:globalThis);
