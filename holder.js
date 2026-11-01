// Read-only $REKT holder check: derives the wallet's associated token account and reads it. No wallet connect, no signing.
(function(){const A='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function b58d(s){let n=0n;for(const ch of s){const i=A.indexOf(ch);if(i<0)throw 0;n=n*58n+BigInt(i)}const o=[];while(n>0n){o.unshift(Number(n&255n));n>>=8n}for(const ch of s){if(ch==='1')o.unshift(0);else break}return Uint8Array.from(o)}
function b58e(b){let n=0n;for(const x of b)n=n*256n+BigInt(x);let s='';while(n>0n){s=A[Number(n%58n)]+s;n/=58n}for(const x of b){if(x===0)s='1'+s;else break}return s}
const P=2n**255n-19n,md=(a)=>((a%P)+P)%P;function pw(b,e){let r=1n;b=md(b);while(e>0n){if(e&1n)r=r*b%P;b=b*b%P;e>>=1n}return r}
const D=md(-121665n*pw(121666n,P-2n));
function onCurve(by){let y=0n;for(let i=31;i>=0;i--)y=(y<<8n)|BigInt(i===31?by[i]&127:by[i]);if(y>=P)return false;const y2=y*y%P,u=md(y2-1n),v=md(D*y2+1n);
 const x=md(u*pw(v,3n)%P*pw(u*pw(v,7n),(P-5n)/8n));const vx2=v*x%P*x%P;return vx2===u||vx2===md(-u)}
async function pda(seeds,prog){const tag=new TextEncoder().encode('ProgramDerivedAddress');for(let b=255;b>=0;b--){const parts=[...seeds,Uint8Array.of(b),prog,tag];const len=parts.reduce((t,p)=>t+p.length,0),buf=new Uint8Array(len);let o=0;for(const p of parts){buf.set(p,o);o+=p.length}
 const h=new Uint8Array(await crypto.subtle.digest('SHA-256',buf));if(!onCurve(h))return b58e(h)}throw 0}
const ATA=b58d('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),PROGS=['TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb','TokenkegQfeZyiNwAJbNbGywPxBTq9fwsPKrb8wcBqgeQ'];
window.RektHolder={b58d,b58e,onCurve,pda,async ata(owner,mint,prog){return pda([b58d(owner),b58d(prog),b58d(mint)],ATA)},
 async balance(owner,mint,rpc,urls){let tot=0;for(const prog of PROGS){try{const a=await this.ata(owner,mint,prog);const r=await rpc(urls,'getAccountInfo',[a,{encoding:'jsonParsed'}]);const i=r&&r.value&&r.value.data&&r.value.data.parsed&&r.value.data.parsed.info;
  if(i&&i.mint===mint&&i.owner===owner)tot+=+i.tokenAmount.uiAmount||0;if(tot>0)break}catch(e){}}return tot}};})();
