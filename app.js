(()=>{
'use strict';
const D=window.SG_DATA;

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const sample=(a,n)=>shuffle(a).slice(0,n);
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const dkey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}
const finePointer=()=>window.matchMedia&&window.matchMedia('(pointer:fine)').matches;

const ICONS={
 home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-6h4v6"/>',
 cards:'<rect x="3" y="7" width="14" height="13" rx="2.5"/><path d="M7 3.5h11.5A2.5 2.5 0 0 1 21 6v11"/>',
 book:'<path d="M2.5 4.5h6A3.5 3.5 0 0 1 12 8v12a3 3 0 0 0-3-3H2.5z"/><path d="M21.5 4.5h-6A3.5 3.5 0 0 0 12 8v12a3 3 0 0 1 3-3h6.5z"/>',
 head:'<path d="M3.5 17v-5a8.5 8.5 0 0 1 17 0v5"/><path d="M20.5 18a2.5 2.5 0 0 1-2.5 2.5h-1v-6h3.5zM3.5 18A2.5 2.5 0 0 0 6 20.5h1v-6H3.5z"/>',
 gear:'<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
 speaker:'<path d="M11 5 6.5 9H3v6h3.5L11 19z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12"/>',
 play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
 stop:'<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/>',
 star:'<path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
 check:'<path d="M5 12.5 10 17.5 19.5 7"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 back:'<path d="M14.5 5.5 8 12l6.5 6.5"/>',
 chev:'<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
 quiz:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4"/><path d="M12 16.8v.2"/>',
 tag:'<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0z"/><circle cx="8" cy="8" r="1.5"/>',
 pen:'<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m14.5 7.5 2 2"/>',
 refresh:'<path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3"/><path d="M20 4.5V11h-6.5"/>',
 list:'<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.5" cy="6.5" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="17.5" r="1" fill="currentColor"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
};
const ic=(n,s=20)=>`<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ---------- data ---------- */
const THEMES=D.themes.map(t=>({...t,words:t.w.map((line,i)=>{const [k,d,p,z,e,ez]=line.split('|');const noun=k==='der'||k==='die'||k==='das';return {id:t.id+'-'+i,tid:t.id,art:noun?k:'',type:noun?'n':k,d,p:p||'',z,e,ez};})}));
const ALL=THEMES.flatMap(t=>t.words);
const full=w=>w.art?w.art+' '+w.d:w.d;
const artSpan=w=>w.art?`<span class="art a-${w.art}">${w.art}</span>`:'';
const TYPE={n:'Nomen',v:'Verb',a:'Adjektiv / Adverb'};
const TYPEZ={n:'名词',v:'动词',a:'形容词 / 副词'};
function forms(w){ if(w.type==='n') return w.p&&w.p!=='–'?`Pl. die ${w.p}`:'ohne Plural'; if(w.type==='v') return w.p; return ''; }

/* ---------- state ---------- */
const KEY='sprachgarten-a2-v1';
const DEF={name:'',goal:50,rate:0.85,voice:'',zh:true,theme:'auto',words:{},read:{},listen:{},dict:{},puzzle:{},xp:{}};
let S=load();
function load(){try{const r=localStorage.getItem(KEY);if(r){return Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(r));}}catch(e){}return JSON.parse(JSON.stringify(DEF));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function addXP(n){ if(!n) return; const k=dkey(); S.xp[k]=(S.xp[k]||0)+n; save(); updateXP(); }
function wrec(id){ return S.words[id]||(S.words[id]={c:0,w:0}); }
function mark(id,ok){ const r=wrec(id); if(ok) r.c++; else r.w++; r.l=ok?1:0; r.t=Date.now(); save(); }
const isKnown=id=>{const r=S.words[id];return !!r&&r.c>=2&&r.c>r.w&&r.l===1;};
const isHard=id=>{const r=S.words[id];return !!r&&(r.c+r.w)>0&&(r.l===0||r.w>r.c);};
const isStar=id=>!!(S.words[id]&&S.words[id].s);
function streak(){ let n=0; const d=new Date(); if(!(S.xp[dkey(d)]>0)) d.setDate(d.getDate()-1); while(S.xp[dkey(d)]>0){n++;d.setDate(d.getDate()-1);} return n; }

/* ---------- speech ---------- */
const FEM=/(anna|petra|helena|katja|hedda|marlene|vicki|amala|seraphina|katharina|louisa|elke|klara|tanja|female|weiblich)/i;
const MASC=/(markus|yannick|stefan|hans|conrad|martin|viktor|killian|florian|kasper|ralf|bernd|christoph|jonas|männlich|\bmale\b)/i;
const isDeVoice=x=>/^de([-_]|$)|^deu/i.test(x.lang||'')||/deutsch|german|allemand|alemán|tedesco|德语|德文|德國|德国|ドイツ/i.test(x.name||'');
const NOVEL=/(albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|good news|jester|organ|superstar|trinoids|whisper|zarvox|grandma|grandpa|eddy|\bflo\b|reed|rocko|sandy|shelley)/i;
const TTS={
 ok:'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window,
 voices:[],all:[],sid:0,res:null,warned:false,loaded:false,
 init(){
  if(!this.ok) return;
  try{speechSynthesis.onvoiceschanged=()=>this.load();}catch(e){}
  this.load(); setTimeout(()=>this.load(),800); setTimeout(()=>{this.loaded=true;this.load();},2500);
 },
 load(){
  let v=[]; try{v=speechSynthesis.getVoices()||[];}catch(e){}
  if(v.length) this.loaded=true;
  const de=v.filter(isDeVoice);
  const sc=x=>(NOVEL.test(x.name)?-10:0)+(/natural|neural|premium|enhanced|online/i.test(x.name)?4:0)+(/google/i.test(x.name)?3:0)+(/de[-_]de/i.test(x.lang)?1:0);
  de.sort((a,b)=>sc(b)-sc(a));
  const changed=de.length!==this.voices.length||v.length!==this.all.length; this.voices=de; this.all=v.slice();
  if(changed||v.length) document.dispatchEvent(new CustomEvent('sg-voices'));
 },
 chosen(){ if(!S.voice) return null; return this.all.find(v=>v.voiceURI===S.voice)||this.all.find(v=>v.name===S.voice)||null; },
 base(){ return this.chosen()||this.voices[0]||null; },
 pick(g){
  const vs=this.voices,b=this.base(); if(!b) return {voice:null,pitch:g==='m'?0.8:1};
  const isF=v=>FEM.test(v.name), isM=v=>MASC.test(v.name)&&!isF(v), ok=v=>!NOVEL.test(v.name);
  if(g==='m'){ if(isM(b)) return {voice:b,pitch:1}; const m=vs.find(v=>isM(v)&&ok(v)); if(m) return {voice:m,pitch:1}; const o=vs.find(v=>v!==b&&ok(v)); return o?{voice:o,pitch:.9}:{voice:b,pitch:.78}; }
  if(g==='f'){ if(!isM(b)) return {voice:b,pitch:1}; const f=vs.find(v=>isF(v)&&ok(v)); if(f) return {voice:f,pitch:1}; const o=vs.find(v=>v!==b&&ok(v)); return o?{voice:o,pitch:1.05}:{voice:b,pitch:1.2}; }
  return {voice:b,pitch:1};
 },
 stop(){ this.sid++; if(this.ok){try{speechSynthesis.cancel();}catch(e){}} const r=this.res; this.res=null; if(r) r(false); $$('.playing').forEach(x=>x.classList.remove('playing')); },
 seq(items,o={}){
  if(!this.ok){ if(!this.warned){toast('Dieser Browser kann leider keine Sprache ausgeben.');this.warned=true;} return Promise.resolve(false); }
  if(!this.voices.length) this.load();
  this.stop(); const sid=this.sid, rate=o.rate||S.rate;
  return new Promise(resolve=>{
   this.res=resolve; let i=0;
   const fin=v=>{ if(this.res===resolve) this.res=null; resolve(v); };
   const next=()=>{
    if(sid!==this.sid) return;
    if(i>=items.length) return fin(true);
    const idx=i++, it=items[idx];
    const u=new SpeechSynthesisUtterance(it.text); u.lang='de-DE';
    const p=this.pick(it.g); if(p.voice){ try{u.voice=p.voice;}catch(e){} } u.pitch=p.pitch; u.rate=rate;
    let done=false; const go=()=>{ if(done) return; done=true; if(sid!==this.sid) return; setTimeout(next,it.pause!=null?it.pause:150); };
    u.onend=go; u.onerror=go;
    if(o.onitem) o.onitem(idx);
    try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){ go(); }
   };
   next();
  });
 },
 say(text,g,rate){ return this.seq([{text,g}],{rate}); }
};
document.addEventListener('pointerdown',()=>{ if(!TTS.ok) return; try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){} },{once:true});

const RATES=[[0.7,'Langsam'],[0.85,'Mittel'],[1,'Normal']];
const rateSeg=()=>`<div class="seg" role="group" aria-label="Sprechtempo">${RATES.map(([r,l])=>{const on=Math.abs(S.rate-r)<.01;return `<button type="button" data-rate-set="${r}" class="${on?'on':''}" aria-pressed="${on}">${l}</button>`;}).join('')}</div>`;
const say=(text,{g='',cls='',label='Anhören'}={})=>`<button type="button" class="say ${cls}" data-say="${esc(text)}"${g?` data-g="${g}"`:''} aria-label="${label}" title="${label}">${ic('speaker',18)}</button>`;

function voiceNoticeHtml(){
 if(!TTS.ok) return `<div class="notice"><b>Keine Sprachausgabe verfügbar</b>Dieser Browser kann keine Texte vorlesen. Öffne die Seite am besten in Chrome, Safari oder Edge. <span class="zh">此浏览器不支持语音朗读，请使用 Chrome、Safari 或 Edge。</span></div>`;
 if(TTS.loaded&&!TTS.voices.length&&!TTS.chosen()) return `<div class="notice"><b>Keine deutsche Stimme gefunden</b>Deshalb wird mit englischem Akzent vorgelesen. Was hilft:<br>1. Eine deutsche Stimme installieren. Android: Einstellungen › Text-in-Sprache-Ausgabe. iPhone: Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Deutsch.<br>2. Die Seite in Chrome öffnen, nicht im WeChat- oder Handy-Browser.<br>3. Chrome neu starten: Einstellungen › Apps › Chrome › „Beenden erzwingen“.<br>4. In Sprachgarten unter Einstellungen › Stimme die deutsche Stimme wählen.<br><span class="zh">未找到德语语音。请：① 安装德语语音（设置 › 文字转语音输出）；② 用 Chrome 打开本网站，不要用微信或手机自带浏览器；③ 在应用设置里“强行停止” Chrome 后重新打开；④ 在本网站“设置 › 声音”中选择德语语音。</span></div>`;
 return '';
}
function refreshNotices(){ $$('[data-voice-notice]').forEach(n=>n.innerHTML=voiceNoticeHtml()); }

/* ---------- ui helpers ---------- */
let toastT;
function toast(msg){ let t=$('.toast'); if(!t){t=el('<div class="toast" role="status" aria-live="polite"></div>');document.body.append(t);} t.textContent=msg; requestAnimationFrame(()=>t.classList.add('show')); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2300); }
function updateXP(){ const x=S.xp[dkey()]||0; $$('[data-xp]').forEach(n=>{n.innerHTML=`<span class="bar mini"><i style="width:${Math.min(100,Math.round(x/S.goal*100))}%"></i></span><span>${x} / ${S.goal}</span>`;n.title='Punkte heute';}); }
const stampHtml=(p,mini)=>`<div class="stamp${mini?' mini':''}" aria-hidden="true">${p>=.8?'优':p>=.5?'好':'练'}</div>`;
function resultHtml(p,line,extra=''){ const [de,zh]=p>=.8?['Ausgezeichnet!','太棒了！']:p>=.5?['Gut gemacht!','做得好！']:['Weiter üben!','继续加油！']; return `<div class="result">${stampHtml(p)}<h2>${de} <span class="zh zh-help">${zh}</span></h2><p class="score">${line}</p><div class="row">${extra}</div></div>`; }
const progressHtml=(i,n)=>`<div class="progress"><div class="bar"><i style="width:${Math.round(i/n*100)}%"></i></div><span>${Math.min(i+1,n)} / ${n}</span></div>`;
const UML=['ä','ö','ü','ß','Ä','Ö','Ü'];
const keysHtml=()=>`<div class="keys" aria-label="Sonderzeichen">${UML.map(k=>`<button type="button" class="key" data-key="${k}">${k}</button>`).join('')}</div>`;
function bindKeys(root,inp){ $$('[data-key]',root).forEach(b=>{ b.addEventListener('mousedown',e=>e.preventDefault()); b.onclick=()=>{ if(inp.readOnly) return; const s=inp.selectionStart!=null?inp.selectionStart:inp.value.length, e2=inp.selectionEnd!=null?inp.selectionEnd:inp.value.length; inp.value=inp.value.slice(0,s)+b.dataset.key+inp.value.slice(e2); const p=s+1; try{inp.setSelectionRange(p,p);}catch(e){} inp.focus(); }; }); }
let cleanups=[];
function onKey(fn){ const h=e=>{ if(e.target.closest&&e.target.closest('input,textarea,select')) return; if(e.metaKey||e.ctrlKey||e.altKey) return; fn(e); }; document.addEventListener('keydown',h); cleanups.push(()=>document.removeEventListener('keydown',h)); }
function translit(s){ return s.replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss'); }
function lev(a,b){ if(a===b) return 0; const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let prev=Array.from({length:n+1},(_,i)=>i); for(let i=1;i<=m;i++){ const cur=[i]; for(let j=1;j<=n;j++) cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1)); prev=cur; } return prev[n]; }

/* ---------- popover ---------- */
let pop=null;
function showPop(target,de,zh){ closePop(); pop=el(`<div class="pop" role="dialog" aria-label="${esc(de)}"><div class="pop-de"><span>${esc(de)}</span>${say(de,{cls:'sm'})}</div><div class="pop-zh zh">${esc(zh)}</div></div>`); document.body.append(pop); const r=target.getBoundingClientRect(); const pw=pop.offsetWidth; const vw=document.documentElement.clientWidth; let left=r.left+window.scrollX+r.width/2-pw/2; left=Math.max(window.scrollX+12,Math.min(left,window.scrollX+vw-pw-12)); pop.style.left=left+'px'; pop.style.top=(r.bottom+window.scrollY+8)+'px'; target.classList.add('active'); }
function closePop(){ if(pop){pop.remove();pop=null;} $$('.gl.active').forEach(x=>x.classList.remove('active')); }

/* ---------- global events ---------- */
function toggleStar(id){ const r=wrec(id); r.s=!r.s; save(); $$(`[data-star="${id}"]`).forEach(b=>{ b.classList.toggle('on',!!r.s); b.setAttribute('aria-pressed',!!r.s); const l=b.querySelector('.lbl'); if(l) l.textContent=r.s?'Gemerkt':'Merken'; }); toast(r.s?'Zu „Meine Wörter“ hinzugefügt':'Aus „Meine Wörter“ entfernt'); }
document.addEventListener('click',e=>{
 const s=e.target.closest('[data-say]');
 if(s){ e.preventDefault(); if(s.classList.contains('playing')){TTS.stop();return;} const p=TTS.say(s.dataset.say,s.dataset.g||''); s.classList.add('playing'); p.then(()=>s.classList.remove('playing')); return; }
 const st=e.target.closest('[data-star]'); if(st){ e.preventDefault(); toggleStar(st.dataset.star); return; }
 const rs=e.target.closest('[data-rate-set]'); if(rs){ S.rate=+rs.dataset.rateSet; save(); $$('[data-rate-set]').forEach(b=>{const on=Math.abs(+b.dataset.rateSet-S.rate)<.01;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);}); return; }
 if(e.target.closest('[data-open-settings]')){ openSettings(); return; }
 if(pop&&!e.target.closest('.pop')&&!e.target.closest('.gl')) closePop();
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePop(); });
let lastW=window.innerWidth; window.addEventListener('resize',()=>{ if(window.innerWidth!==lastW){ lastW=window.innerWidth; closePop(); } });

/* ---------- shell ---------- */
const NAV=[['start','#/','home','Start','首页'],['woerter','#/woerter','cards','Wortschatz','词汇'],['lesen','#/lesen','book','Lesen','阅读'],['hoeren','#/hoeren','head','Hören','听力']];
function buildShell(){
 const brand=`<a class="brand" href="#/"><span class="brand-seal">学</span><span><b>Sprachgarten</b><small class="zh">德语小花园 · A2</small></span></a>`;
 document.body.insertAdjacentHTML('afterbegin',`
 <div class="app">
  <aside class="rail"><div class="rail-in">${brand}
   <nav class="nav" aria-label="Hauptnavigation">${NAV.map(([k,h,i,l,z])=>`<a href="${h}" data-nav="${k}">${ic(i,22)}<span>${l}<small class="zh">${z}</small></span></a>`).join('')}</nav>
   <div class="rail-foot"><div class="xp-pill" data-xp></div><button class="nav-btn" type="button" data-open-settings>${ic('gear',22)}<span>Einstellungen<small class="zh">设置</small></span></button></div>
  </div></aside>
  <div class="col">
   <header class="topbar">${brand}<div class="xp-pill" data-xp></div><button class="icon-btn" type="button" data-open-settings aria-label="Einstellungen">${ic('gear')}</button></header>
   <main id="main" tabindex="-1"></main>
  </div>
 </div>
 <nav class="tabbar" aria-label="Navigation">${NAV.map(([k,h,i,l])=>`<a href="${h}" data-nav="${k}">${ic(i,22)}<span>${l}</span></a>`).join('')}</nav>`);
 updateXP();
}
function applyTheme(){ const r=document.documentElement; if(S.theme==='light'||S.theme==='dark') r.setAttribute('data-theme',S.theme); else r.removeAttribute('data-theme'); r.classList.toggle('hide-zh',!S.zh); }

/* ---------- router ---------- */
function route(){
 cleanups.forEach(f=>{try{f();}catch(e){}}); cleanups=[]; TTS.stop(); closePop();
 const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean).map(decodeURIComponent);
 const [a,b,c]=parts; let v=null;
 try{
  if(!a) v=Home();
  else if(a==='woerter') v=!b?VocabHome():!c?ThemeView(b):VocabMode(b,c);
  else if(a==='lesen') v=b?ReadView(b):ReadList();
  else if(a==='hoeren'){
   if(!b) v=ListenHome('dialoge');
   else if(b==='d') v=DialogView(c);
   else if(b==='diktat') v=c?DictView(c):ListenHome('diktat');
   else if(b==='puzzle') v=c?PuzzleView(c):ListenHome('puzzle');
  }
 }catch(err){ console.error(err); }
 if(!v) v=NotFound();
 const main=$('#main'); main.replaceChildren(v);
 const nav=a||'start'; $$('[data-nav]').forEach(n=>{const on=n.dataset.nav===nav;n.classList.toggle('active',on);if(on)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
 window.scrollTo(0,0); refreshNotices(); setTimeout(refreshNotices,2700);
}
function NotFound(){ return el(`<div class="view"><div class="empty"><p><b>Diese Seite gibt es nicht.</b></p><p class="zh">找不到这个页面。</p><a class="btn" href="#/">Zur Startseite</a></div></div>`); }

/* ---------- home ---------- */
function wordOfDay(){ const d=new Date(); const n=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5); return ALL[(n*37)%ALL.length]; }
function Home(){
 const h=new Date().getHours();
 const [gde,gzh]=h<11?['Guten Morgen','早上好']:h<18?['Guten Tag','你好']:['Guten Abend','晚上好'];
 const w=wordOfDay(), xpT=S.xp[dkey()]||0, pct=Math.min(100,Math.round(xpT/S.goal*100));
 const known=ALL.filter(x=>isKnown(x.id)).length, hard=ALL.filter(x=>isHard(x.id)).length;
 const rd=D.texts.filter(t=>S.read[t.id]!=null).length, ld=D.dialogs.filter(d=>S.listen[d.id]!=null).length;
 const dd=D.dictation.filter(s=>S.dict[s.id]!=null||S.puzzle[s.id]!=null).length;
 const tx=D.texts.find(t=>S.read[t.id]==null)||rnd(D.texts);
 const dl=D.dialogs.find(d=>S.listen[d.id]==null)||rnd(D.dialogs);
 const tk=t=>t.words.filter(x=>isKnown(x.id)).length/t.words.length;
 const nt=THEMES.slice().sort((a,b)=>tk(a)-tk(b)||Math.random()-.5)[0];
 const st=streak(), WD=['So','Mo','Di','Mi','Do','Fr','Sa'];
 const days=[]; for(let k=6;k>=0;k--){ const d=new Date(); d.setDate(d.getDate()-k); days.push({l:WD[d.getDay()],on:(S.xp[dkey(d)]||0)>0,today:k===0}); }
 const ex=w.e?`<div class="wod-ex">${say(w.e,{cls:'sm',label:'Beispielsatz anhören'})}<div><p>${esc(w.e)}</p><p class="zh muted zh-help">${esc(w.ez)}</p></div></div>`:'';
 const v=el(`<div class="view home">
  <header class="greet"><h1>${gde}${S.name?', '+esc(S.name):''}!</h1><span class="zh">${gzh}${S.name?'，'+esc(S.name):''}！今天也来学一点德语吧。</span></header>
  ${S.name?'':`<div class="hello-card"><label for="nm"><b>Wie heißt du?</b><span class="zh">你叫什么名字？</span></label><div class="row"><input id="nm" class="inp" placeholder="Dein Vorname" maxlength="30" autocomplete="given-name"><button class="btn sm" type="button" data-a="savename">Speichern</button></div></div>`}
  <section class="wod" aria-label="Wort des Tages">
   <div class="wod-head"><span>Wort des Tages <span class="zh zh-help">每日一词</span></span><span>${esc(THEMES.find(t=>t.id===w.tid).t)}</span></div>
   <div class="wod-word">${artSpan(w)}${esc(w.d)}</div>
   <div class="wod-forms">${esc(forms(w)||TYPE[w.type])}</div>
   <div class="wod-zh zh">${esc(w.z)}</div>
   ${ex}
   <div class="row"><button class="btn" type="button" data-say="${esc(full(w))}">${ic('speaker',18)} Anhören</button><button class="btn ghost ${isStar(w.id)?'on':''}" type="button" data-star="${w.id}" aria-pressed="${isStar(w.id)}">${ic('star',18)} <span class="lbl">${isStar(w.id)?'Gemerkt':'Merken'}</span></button></div>
  </section>
  <section class="today" aria-label="Heute">
   <div>
    <div class="goal-top"><b>Heute</b><span class="muted">${xpT} von ${S.goal} Punkten</span></div>
    <div class="bar big"><i style="width:${pct}%"></i></div>
    <p class="goal-msg">${xpT>=S.goal?'Tagesziel geschafft. Toll gemacht!':`Noch ${S.goal-xpT} Punkte bis zum Tagesziel. Jede richtige Antwort zählt.`} <span class="zh zh-help">${xpT>=S.goal?'今日目标已完成！':`距离今日目标还差 ${S.goal-xpT} 分。`}</span></p>
   </div>
   <div class="week" aria-label="Die letzten sieben Tage">${days.map(d=>`<div class="day${d.on?' on':''}${d.today?' is-today':''}"><i>${d.on?'学':''}</i><span>${d.l}</span></div>`).join('')}</div>
   <p class="streak">${st>0?`<b>${st}</b> ${st===1?'Tag':'Tage'} in Folge gelernt <span class="zh zh-help">已连续学习 ${st} 天</span>`:'Lerne heute etwas, dann bekommt dieser Tag einen Stempel. <span class="zh zh-help">今天学习一下，就能得到一个印章。</span>'}</p>
  </section>
  <h2 class="sec">Weiterlernen <span class="zh">继续学习</span></h2>
  <div class="next-grid">
   <a class="next" href="#/woerter/${nt.id}/quiz"><span class="glyph">${nt.c}</span><span><b>Wörter üben</b><small>Quiz: ${esc(nt.t)}</small></span>${ic('chev')}</a>
   <a class="next" href="#/lesen/${tx.id}"><span class="glyph">${tx.c}</span><span><b>Text lesen</b><small>${esc(tx.t)}</small></span>${ic('chev')}</a>
   <a class="next" href="#/hoeren/d/${dl.id}"><span class="glyph">${dl.c}</span><span><b>Zuhören</b><small>${esc(dl.t)}</small></span>${ic('chev')}</a>
  </div>
  ${hard?`<a class="hard-card" href="#/woerter/schwierig/karten"><span class="glyph">难</span><span><b>${hard} schwierige ${hard===1?'Wort':'Wörter'} wiederholen</b><small>Diese Wörter hast du zuletzt falsch beantwortet. <span class="zh zh-help">复习你答错过的单词。</span></small></span>${ic('chev')}</a>`:''}
  <h2 class="sec">Dein Fortschritt <span class="zh">学习进度</span></h2>
  <div class="prog-rows">
   ${[['Wortschatz','词汇',known,ALL.length],['Lesen','阅读',rd,D.texts.length],['Hören','听力',ld,D.dialogs.length],['Diktat & Puzzle','听写',dd,D.dictation.length]].map(([l,z,a,n])=>`<div class="prow"><span>${l}<small class="zh">${z}</small></span><div class="bar"><i style="width:${Math.round(a/n*100)}%"></i></div><span>${a} / ${n}</span></div>`).join('')}
  </div>
 </div>`);
 const sv=$('[data-a=savename]',v);
 if(sv){ const inp=$('#nm',v); const go=()=>{ const n=inp.value.trim(); if(!n){inp.focus();return;} S.name=n; save(); route(); toast(`Schön, dich kennenzulernen, ${n}!`); }; sv.onclick=go; inp.onkeydown=e=>{ if(e.key==='Enter') go(); }; }
 return v;
}

/* ---------- vocabulary ---------- */
function getList(id){
 if(id==='merkliste') return {id,t:'Meine Wörter',z:'我的生词本',c:'★',special:true,words:ALL.filter(w=>isStar(w.id))};
 if(id==='schwierig') return {id,t:'Schwierige Wörter',z:'难词复习',c:'难',special:true,words:ALL.filter(w=>isHard(w.id))};
 if(id==='alle') return {id,t:'Alle Themen gemischt',z:'全部混合',c:'全',special:true,mix:true,words:ALL};
 const t=THEMES.find(x=>x.id===id); return t?{...t}:null;
}
function VocabHome(){
 const nS=ALL.filter(w=>isStar(w.id)).length, nH=ALL.filter(w=>isHard(w.id)).length;
 const v=el(`<div class="view">
  <header class="page-head"><h1>Wortschatz</h1><span class="zh">词汇</span><p class="lead">${ALL.length} wichtige Wörter für den Alltag in ${THEMES.length} Themen. Jedes Wort mit Artikel, Plural, Beispielsatz und chinesischer Übersetzung.</p></header>
  <div class="special">
   <a class="sp" href="#/woerter/merkliste"><span class="glyph seal">★</span><span><b>Meine Wörter</b><small>${nS} gemerkt <span class="zh zh-help">我的生词本</span></small></span>${ic('chev')}</a>
   <a class="sp" href="#/woerter/schwierig"><span class="glyph seal">难</span><span><b>Schwierige Wörter</b><small>${nH} zum Wiederholen <span class="zh zh-help">难词复习</span></small></span>${ic('chev')}</a>
   <a class="sp" href="#/woerter/alle"><span class="glyph">全</span><span><b>Alles gemischt</b><small>Alle Themen <span class="zh zh-help">全部混合练习</span></small></span>${ic('chev')}</a>
  </div>
  <h2 class="sec">Themen <span class="zh">主题</span></h2>
  <div class="theme-grid">${THEMES.map(t=>{const k=t.words.filter(w=>isKnown(w.id)).length;return `<a class="theme" href="#/woerter/${t.id}"><span class="glyph">${t.c}</span><span><b>${esc(t.t)}</b><span class="zh">${esc(t.z)}</span></span><span class="tp"><span class="bar"><i style="width:${Math.round(k/t.words.length*100)}%"></i></span><span>${k} / ${t.words.length}</span></span></a>`;}).join('')}</div>
 </div>`);
 return v;
}
function rowHtml(w){
 const st=isKnown(w.id)?'<i class="dot ok" title="Gelernt"></i>':isHard(w.id)?'<i class="dot bad" title="Schwierig"></i>':'';
 return `<li class="wrow" tabindex="0" aria-expanded="false" data-id="${w.id}">${say(full(w))}
  <div><div class="wde">${artSpan(w)}${esc(w.d)}${forms(w)?`<span class="forms">${esc(forms(w))}</span>`:''}</div><div class="wzh zh">${esc(w.z)}</div>
  <div class="wex"><p>${esc(w.e)} ${say(w.e,{cls:'sm',label:'Beispielsatz anhören'})}</p><p class="zh zh-help">${esc(w.ez)}</p></div></div>
  <span class="wstat">${st}</span>
  <button type="button" class="star ${isStar(w.id)?'on':''}" data-star="${w.id}" aria-pressed="${isStar(w.id)}" aria-label="Wort merken">${ic('star',19)}</button></li>`;
}
function ThemeView(id){
 const L=getList(id); if(!L) return NotFound();
 const ws=L.words, nouns=ws.filter(w=>w.art).length, known=ws.filter(w=>isKnown(w.id)).length;
 const modes=[['karten','cards','Karteikarten','单词卡','Umdrehen und merken'],['quiz','quiz','Quiz','选择题','Bedeutung wählen, auch per Hören'],['artikel','tag','der, die, das','词性练习','Artikel trainieren'],['schreiben','pen','Schreiben','拼写练习','Wörter selbst tippen']];
 let body;
 if(!ws.length){
  body=id==='merkliste'
   ?`<div class="empty"><p><b>Noch keine Wörter gemerkt.</b></p><p>Tippe in einer Wortliste auf den Stern, um ein Wort hier zu sammeln.</p><p class="zh">在单词列表中点击星号，就可以把单词收藏到这里。</p><a class="btn" href="#/woerter">Themen ansehen</a></div>`
   :`<div class="empty"><p><b>Keine schwierigen Wörter.</b></p><p>Wörter, die du in einer Übung falsch beantwortest, erscheinen hier automatisch.</p><p class="zh">练习中答错的单词会自动出现在这里。</p><a class="btn" href="#/woerter">Themen ansehen</a></div>`;
 }else{
  body=`<div class="modes">${modes.filter(m=>m[0]!=='artikel'||nouns).map(([m,icn,t,z,sub])=>`<a class="mode" href="#/woerter/${id}/${m}">${ic(icn,26)}<b>${t}</b><small>${sub}<span class="zh zh-help">${z}</span></small></a>`).join('')}</div>
  ${L.mix?'':`<div class="list-head"><h2 class="sec">Wortliste <span class="zh">词汇表</span></h2><div class="legend"><span><b class="a-der">der</b> maskulin</span><span><b class="a-die">die</b> feminin</span><span><b class="a-das">das</b> neutral</span></div></div>
  <ul class="wlist">${ws.map(rowHtml).join('')}</ul><p class="muted small" style="margin-top:12px">Tippe auf ein Wort für den Beispielsatz. <span class="zh zh-help">点击单词查看例句。</span></p>`}`;
 }
 const v=el(`<div class="view">
  <a class="back" href="#/woerter">${ic('back',18)} Alle Themen</a>
  <header class="t-head"><span class="glyph lg${L.special?' seal':''}">${L.c}</span><div><h1>${esc(L.t)}</h1><span class="zh">${esc(L.z)}</span><p class="muted small">${ws.length} Wörter, davon ${known} gelernt</p></div></header>
  ${body}</div>`);
 const tog=r=>{ r.classList.toggle('open'); r.setAttribute('aria-expanded',r.classList.contains('open')); };
 v.addEventListener('click',e=>{ const r=e.target.closest('.wrow'); if(!r||e.target.closest('button')) return; tog(r); });
 v.addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('wrow')){ e.preventDefault(); tog(e.target); } });
 return v;
}
function VocabMode(id,mode){
 const L=getList(id); if(!L) return NotFound(); if(!L.words.length) return ThemeView(id);
 if(mode==='karten') return Flash(L);
 if(mode==='quiz') return Quiz(L);
 if(mode==='artikel') return L.words.some(w=>w.art)?Artikel(L):ThemeView(id);
 if(mode==='schreiben') return Write(L);
 return NotFound();
}
const exHead=(L,title,zh)=>`<div class="ex-top"><a class="icon-btn" href="#/woerter/${L.id}" aria-label="Übung beenden">${ic('x')}</a><div class="ex-title"><b>${title} <span class="zh zh-help" style="font-weight:400;font-size:15px;color:var(--muted)">${zh}</span></b><small>${esc(L.t)}</small></div></div>`;

function Flash(L){
 let deck,i,ok,again;
 const v=el(`<div class="view ex">${exHead(L,'Karteikarten','单词卡')}<div class="ex-body"></div></div>`), body=$('.ex-body',v);
 function setup(words){ deck=shuffle(words||L.words).slice(0,L.mix?20:999); i=0; ok=0; again=[]; render(); }
 function render(){
  if(i>=deck.length) return done();
  const w=deck[i];
  body.innerHTML=`${progressHtml(i,deck.length)}
  <div class="flash" tabindex="0" role="button" aria-label="Karte umdrehen">
   <div class="flash-inner">
    <div class="face front"><span class="face-tag">${TYPE[w.type]}</span><div class="fw">${artSpan(w)}${esc(w.d)}</div>${forms(w)?`<div class="ff">${esc(forms(w))}</div>`:''}<p class="flip-hint">Tippen zum Umdrehen <span class="zh zh-help">点击翻面</span></p></div>
    <div class="face back"><span class="face-tag">Bedeutung</span><div class="fz zh">${esc(w.z)}</div><div class="fw sm">${artSpan(w)}${esc(w.d)}</div><p class="fex">${esc(w.e)}</p><p class="zh muted zh-help">${esc(w.ez)}</p></div>
   </div>
  </div>
  <div class="flash-ctl">${say(full(w),{cls:'lg'})}<button class="btn ghost" type="button" data-a="again">${ic('refresh',18)} Noch nicht</button><button class="btn" type="button" data-a="know">${ic('check',18)} Gewusst</button></div>
  <p class="kbd-hint">Leertaste: umdrehen, Pfeil links: noch nicht, Pfeil rechts: gewusst</p>`;
  const card=$('.flash',body);
  card.onclick=()=>card.classList.toggle('flipped');
  card.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); card.classList.toggle('flipped'); } };
  $('[data-a=again]',body).onclick=()=>answer(false);
  $('[data-a=know]',body).onclick=()=>answer(true);
 }
 function answer(k){ const w=deck[i]; if(!w) return; mark(w.id,k); if(k){ok++;addXP(1);} else again.push(w); i++; render(); }
 function done(){
  body.innerHTML=resultHtml(ok/deck.length,`${ok} von ${deck.length} Wörtern gewusst`,`${again.length?`<button class="btn" type="button" data-a="redo">${ic('refresh',18)} Die ${again.length} anderen nochmal</button>`:''}<button class="btn ghost" type="button" data-a="restart">Alle nochmal</button><a class="btn ghost" href="#/woerter/${L.id}">Zur Wortliste</a>`);
  const r=$('[data-a=redo]',body); if(r) r.onclick=()=>setup(again.slice());
  $('[data-a=restart]',body).onclick=()=>setup();
 }
 onKey(e=>{ if(!body.isConnected) return; const card=$('.flash',body); if(!card) return;
  if(e.key===' '){ e.preventDefault(); card.classList.toggle('flipped'); }
  else if(e.key==='ArrowRight') answer(true); else if(e.key==='ArrowLeft') answer(false); });
 setup(); return v;
}

function Quiz(L){
 const types=TTS.ok?['de2zh','zh2de','audio']:['de2zh','zh2de'];
 let qs,i,sc;
 const v=el(`<div class="view ex">${exHead(L,'Quiz','选择题')}<div class="ex-body"></div></div>`), body=$('.ex-body',v);
 function setup(){
  const n=Math.min(10,L.words.length);
  qs=shuffle(sample(L.words,n).map((w,k)=>{ const tw=THEMES.find(t=>t.id===w.tid).words.filter(x=>x.id!==w.id&&x.z!==w.z); let pool=tw.filter(x=>x.type===w.type); if(pool.length<3) pool=tw; return {w,t:types[k%types.length],opts:shuffle([w,...sample(pool,3)])}; }));
  i=0; sc=0; render();
 }
 function render(){
  if(i>=qs.length) return done();
  const q=qs[i], w=q.w; let prompt;
  if(q.t==='de2zh') prompt=`<p class="qlabel">Was bedeutet das Wort?<span class="zh zh-help">这个词是什么意思？</span></p><div class="qbig"><span>${artSpan(w)}${esc(w.d)}</span>${say(full(w))}</div>`;
  else if(q.t==='zh2de') prompt=`<p class="qlabel">Wie heißt das auf Deutsch?<span class="zh zh-help">用德语怎么说？</span></p><div class="qbig zh">${esc(w.z)}</div>`;
  else prompt=`<p class="qlabel">Hör zu und wähle die Bedeutung.<span class="zh zh-help">听一听，选出正确的意思。</span></p><div class="row center"><button type="button" class="play-big" data-say="${esc(full(w))}" aria-label="Wort anhören">${ic('speaker',34)}</button></div>`;
  body.innerHTML=`${progressHtml(i,qs.length)}<div class="qcard">${prompt}</div><div class="opts">${q.opts.map((o,k)=>`<button type="button" class="opt" data-k="${k}">${q.t==='zh2de'?`<span>${artSpan(o)}${esc(o.d)}</span>`:`<span class="zh">${esc(o.z)}</span>`}</button>`).join('')}</div><div class="fb" aria-live="polite"></div>`;
  $$('.opt',body).forEach(b=>b.onclick=()=>pick(+b.dataset.k));
  if(q.t==='audio') setTimeout(()=>{ if(body.isConnected&&qs[i]===q){ const b=$('.play-big',body); const p=TTS.say(full(w)); if(b){b.classList.add('playing');p.then(()=>b.classList.remove('playing'));} } },350);
 }
 function pick(k){
  const q=qs[i]; if(!q||q.done) return; q.done=true;
  const ok=q.opts[k]===q.w, w=q.w; mark(w.id,ok); if(ok){sc++;addXP(2);}
  $$('.opt',body).forEach((b,j)=>{ b.disabled=true; if(q.opts[j]===w) b.classList.add('ok'); else if(j===k) b.classList.add('bad'); });
  $('.fb',body).innerHTML=`<div class="fb-box ${ok?'ok':'bad'}"><div><strong>${ok?rnd(['Richtig!','Super!','Genau!']):'Leider falsch.'}</strong><p>${artSpan(w)}<b>${esc(w.d)}</b> = <span class="zh">${esc(w.z)}</span></p></div><button class="btn sm" type="button" data-a="next">Weiter</button></div>`;
  const nb=$('[data-a=next]',body); nb.onclick=()=>{i++;render();}; nb.focus({preventScroll:true});
  TTS.say(full(w));
 }
 function done(){
  body.innerHTML=resultHtml(sc/qs.length,`${sc} von ${qs.length} richtig`,`<button class="btn" type="button" data-a="again">${ic('refresh',18)} Neues Quiz</button><a class="btn ghost" href="#/woerter/${L.id}">Zur Wortliste</a>`);
  $('[data-a=again]',body).onclick=setup;
 }
 onKey(e=>{ if(!body.isConnected) return; const n=parseInt(e.key,10); if(n>=1&&n<=4){ const b=$$('.opt',body)[n-1]; if(b&&!b.disabled) b.click(); } });
 setup(); return v;
}

function artHint(w){
 const d=w.d.toLowerCase(); let m;
 if((m=d.match(/(ung|heit|keit|schaft|ion|tät)$/))) return `Merkhilfe: Nomen auf -${m[1]} sind immer feminin (die).`;
 if(/in$/.test(d)&&w.art==='die') return 'Merkhilfe: Weibliche Personen auf -in haben immer den Artikel die.';
 if(/(chen|lein)$/.test(d)) return 'Merkhilfe: Nomen auf -chen und -lein sind immer neutral (das).';
 if(/ment$/.test(d)) return 'Merkhilfe: Nomen auf -ment sind meistens neutral (das).';
 if(/ling$/.test(d)) return 'Merkhilfe: Nomen auf -ling sind maskulin (der).';
 if(/e$/.test(d)) return w.art==='die'?'Merkhilfe: Die meisten Nomen auf -e sind feminin (die).':'Achtung, Ausnahme: Die meisten Nomen auf -e sind feminin, dieses aber nicht.';
 return '';
}
function Artikel(L){
 const nouns=L.words.filter(w=>w.art); let qs,i,sc;
 const v=el(`<div class="view ex">${exHead(L,'der, die, das','词性练习')}<div class="ex-body"></div></div>`), body=$('.ex-body',v);
 function setup(){ qs=sample(nouns,Math.min(15,nouns.length)); i=0; sc=0; render(); }
 function render(){
  if(i>=qs.length) return done();
  const w=qs[i];
  body.innerHTML=`${progressHtml(i,qs.length)}<div class="qcard"><p class="qlabel">Welcher Artikel passt?<span class="zh zh-help">选择正确的冠词</span></p><div class="qbig">${esc(w.d)}</div><p class="zh muted big-zh">${esc(w.z)}</p></div>
  <div class="art-btns">${['der','die','das'].map((a,k)=>`<button type="button" class="art-btn ${a}" data-art="${a}" aria-keyshortcuts="${k+1}">${a}</button>`).join('')}</div><div class="fb" aria-live="polite"></div>`;
  $$('.art-btn',body).forEach(b=>b.onclick=()=>pick(b.dataset.art));
 }
 function pick(a){
  const w=qs[i]; if(!w||$('.art-btn:disabled',body)) return;
  const ok=a===w.art; mark(w.id,ok); if(ok){sc++;addXP(2);}
  $$('.art-btn',body).forEach(b=>{ b.disabled=true; if(b.dataset.art===w.art) b.classList.add('ok'); else if(b.dataset.art===a) b.classList.add('bad'); });
  const hint=artHint(w);
  $('.fb',body).innerHTML=`<div class="fb-box ${ok?'ok':'bad'}"><div><strong>${ok?'Richtig!':'Leider falsch.'}</strong><p>${artSpan(w)}<b>${esc(w.d)}</b><span class="muted">${esc(forms(w))}</span></p>${hint?`<p class="tip">${ic('bulb',16)}<span>${esc(hint)}</span></p>`:''}</div><button class="btn sm" type="button" data-a="next">Weiter</button></div>`;
  const nb=$('[data-a=next]',body); nb.onclick=()=>{i++;render();}; nb.focus({preventScroll:true});
  TTS.say(full(w));
 }
 function done(){
  body.innerHTML=resultHtml(sc/qs.length,`${sc} von ${qs.length} Artikeln richtig`,`<button class="btn" type="button" data-a="again">${ic('refresh',18)} Nochmal</button><a class="btn ghost" href="#/woerter/${L.id}">Zur Wortliste</a>`);
  $('[data-a=again]',body).onclick=setup;
 }
 onKey(e=>{ if(!body.isConnected) return; const m={'1':'der','2':'die','3':'das'}[e.key]; if(m) pick(m); });
 setup(); return v;
}

function cmpWord(a,b){ if(a===b) return 'ok'; if(a.toLowerCase()===b.toLowerCase()) return 'case'; if(translit(a.toLowerCase())===translit(b.toLowerCase())) return 'uml'; return false; }
function checkWrite(raw,w){
 let s=raw.trim().replace(/\s+/g,' ').replace(/[.!?]+$/,''); let art='';
 const m=s.match(/^(der|die|das)\s+(.+)$/i); if(m&&w.type==='n'){ art=m[1].toLowerCase(); s=m[2]; }
 let r=cmpWord(s,w.d); if(!r&&w.d.startsWith('sich ')) r=cmpWord(s,w.d.slice(5));
 if(!r) return {res:'bad'};
 if(w.art){ if(art&&art!==w.art) return {res:'bad',note:'Das Wort stimmt, aber der Artikel ist falsch.'}; if(!art) return {res:'almost',note:'Das Wort stimmt. Denk beim nächsten Mal an den Artikel!'}; }
 if(r==='case') return {res:'almost',note:w.art?'Nomen schreibt man im Deutschen groß.':'Achte auf Groß- und Kleinschreibung.'};
 if(r==='uml') return {res:'almost',note:'Achte auf ä, ö, ü und ß.'};
 return {res:'ok'};
}
function Write(L){
 let qs,i,sc,hint,answered;
 const v=el(`<div class="view ex">${exHead(L,'Schreiben','拼写练习')}<div class="ex-body"></div></div>`), body=$('.ex-body',v);
 function setup(){ qs=sample(L.words,Math.min(10,L.words.length)); i=0; sc=0; render(); }
 function render(){
  if(i>=qs.length) return done();
  const w=qs[i]; hint=0; answered=false;
  body.innerHTML=`${progressHtml(i,qs.length)}<div class="qcard"><p class="qlabel">${w.art?'Schreib das Wort mit Artikel.':'Schreib das Wort auf Deutsch.'}<span class="zh zh-help">${w.art?'请写出这个词（带冠词）。':'请用德语写出这个词。'}</span></p><div class="qbig zh">${esc(w.z)}</div><p class="type-label">${TYPE[w.type]} <span class="zh zh-help">${TYPEZ[w.type]}</span></p><div class="row center"><button class="btn ghost sm" type="button" data-say="${esc(full(w))}">${ic('speaker',18)} Anhören</button><button class="btn ghost sm" type="button" data-a="hint">${ic('bulb',18)} Tipp</button></div><p class="hint-out" aria-live="polite"></p></div>
  <input class="lined" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${w.art?'z. B. die Katze':'Deine Antwort'}" aria-label="Deine Antwort">
  ${keysHtml()}
  <div class="row"><button class="btn" type="button" data-a="check">Prüfen</button><button class="btn ghost" type="button" data-a="skip">Weiß ich nicht</button></div>
  <div class="fb" aria-live="polite"></div>`;
  const inp=$('.lined',body); bindKeys(body,inp);
  if(finePointer()) setTimeout(()=>inp.focus({preventScroll:true}),60);
  inp.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); if(answered){i++;render();} else check(false); } };
  $('[data-a=check]',body).onclick=()=>check(false);
  $('[data-a=skip]',body).onclick=()=>check(true);
  $('[data-a=hint]',body).onclick=()=>{ hint=Math.min(hint+1,w.d.length); $('.hint-out',body).innerHTML=`${artSpan(w)}${esc(w.d.slice(0,hint))}<span class="muted">${w.d.slice(hint).replace(/[^ ]/g,'_')}</span>`; };
 }
 function check(skip){
  if(answered) return; const w=qs[i], inp=$('.lined',body);
  if(!skip&&!inp.value.trim()){ inp.focus(); return; }
  answered=true; const r=skip?{res:'bad'}:checkWrite(inp.value,w); const good=r.res!=='bad';
  mark(w.id,good); if(good){ sc++; addXP(r.res==='ok'&&!hint?2:1); }
  inp.readOnly=true; inp.classList.add(r.res);
  $('[data-a=check]',body).hidden=true; $('[data-a=skip]',body).hidden=true;
  $('.fb',body).innerHTML=`<div class="fb-box ${r.res}"><div><strong>${r.res==='ok'?'Richtig!':r.res==='almost'?'Fast richtig!':skip?'Kein Problem, jetzt weißt du es.':'Leider nicht richtig.'}</strong>${r.note?`<p>${esc(r.note)}</p>`:''}<p>Lösung: ${artSpan(w)}<b>${esc(w.d)}</b>${say(full(w),{cls:'sm'})}</p></div><button class="btn sm" type="button" data-a="next">Weiter</button></div>`;
  const nb=$('[data-a=next]',body); nb.onclick=()=>{i++;render();}; if(finePointer()) inp.focus({preventScroll:true});
  TTS.say(full(w));
 }
 function done(){
  body.innerHTML=resultHtml(sc/qs.length,`${sc} von ${qs.length} richtig geschrieben`,`<button class="btn" type="button" data-a="again">${ic('refresh',18)} Nochmal</button><a class="btn ghost" href="#/woerter/${L.id}">Zur Wortliste</a>`);
  $('[data-a=again]',body).onclick=setup;
 }
 setup(); return v;
}

/* ---------- questions block (reading & listening) ---------- */
function QuestionBlock(qs,onDone,nextLink){
 const ans=qs.map(()=>null);
 const box=el(`<section class="qs"><h2 class="sec">Aufgaben <span class="zh">练习题</span></h2>
  <ol class="qlist">${qs.map((q,i)=>`<li class="q" data-i="${i}"><p class="q-text">${esc(q.q)}</p><div class="q-opts${q.t==='rf'?' rf':''}">${(q.t==='rf'?['Richtig','Falsch']:q.o).map((o,k)=>`<button type="button" class="opt sm" data-k="${k}">${q.t==='rf'?`${o}<span class="zh">${k===0?'对':'错'}</span>`:esc(o)}</button>`).join('')}</div></li>`).join('')}</ol>
  <div class="q-foot"><button class="btn" type="button" data-a="check" disabled>Antworten prüfen</button></div><div class="q-res"></div></section>`);
 const checkBtn=$('[data-a=check]',box), res=$('.q-res',box);
 box.addEventListener('click',e=>{ const b=e.target.closest('.q-opts .opt'); if(!b||b.disabled) return; const li=b.closest('.q'), i=+li.dataset.i; ans[i]=+b.dataset.k; $$('.opt',li).forEach(x=>x.classList.toggle('sel',x===b)); checkBtn.disabled=ans.some(a=>a===null); });
 checkBtn.onclick=()=>{
  let sc=0;
  qs.forEach((q,i)=>{ const right=q.t==='rf'?(q.a?0:1):q.a, li=$(`.q[data-i="${i}"]`,box);
   $$('.opt',li).forEach(x=>{ const k=+x.dataset.k; x.disabled=true; x.classList.remove('sel'); if(k===right) x.classList.add('ok'); else if(k===ans[i]) x.classList.add('bad'); });
   if(ans[i]===right) sc++; li.classList.add(ans[i]===right?'q-ok':'q-bad'); });
  checkBtn.hidden=true; addXP(sc*3); if(onDone) onDone(sc,qs.length);
  res.innerHTML=resultHtml(sc/qs.length,`${sc} von ${qs.length} Aufgaben richtig`,`<button class="btn ghost" type="button" data-a="retry">${ic('refresh',18)} Nochmal versuchen</button>${nextLink?`<a class="btn" href="${nextLink.href}">${esc(nextLink.label)} ${ic('chev',18)}</a>`:''}`);
  $('[data-a=retry]',res).onclick=()=>{ ans.fill(null); $$('.opt',box).forEach(x=>{x.disabled=false;x.className='opt sm';}); $$('.q',box).forEach(l=>l.classList.remove('q-ok','q-bad')); res.innerHTML=''; checkBtn.hidden=false; checkBtn.disabled=true; box.scrollIntoView({behavior:'smooth',block:'start'}); };
  res.scrollIntoView({behavior:'smooth',block:'center'});
 };
 return box;
}

/* ---------- reading ---------- */
const ABBR=new Set(['dr','nr','str','ca','bzw','usw','z','b','st','hr','fr','u','med','tel']);
function splitSentences(p){
 const out=[]; let start=0;
 for(let i=0;i<p.length;i++){
  const ch=p[i]; if(ch!=='.'&&ch!=='!'&&ch!=='?') continue;
  let j=i+1; while(j<p.length&&/[“”"»)]/.test(p[j])) j++;
  if(j<p.length&&p[j]!==' ') continue;
  let k=j; while(k<p.length&&p[k]===' ') k++;
  if(k>=p.length) break;
  if(!/[A-ZÄÖÜ„"0-9]/.test(p[k])) continue;
  if(ch==='.'){ const b=p.slice(start,i).match(/([A-Za-zÄÖÜäöüß]+|\d+)$/); if(b&&(/^\d+$/.test(b[1])||ABBR.has(b[1].toLowerCase()))) continue; }
  out.push(p.slice(start,j).trim()); start=k; i=k-1;
 }
 if(start<p.length) out.push(p.slice(start).trim());
 return out.filter(Boolean);
}
function wrapGloss(html,sorted,keyList){
 const L='A-Za-zÄÖÜäöüß';
 for(const k of sorted){ const idx=keyList.indexOf(k); const re=new RegExp('(^|[^'+L+'\\u0002])('+escRe(esc(k))+')(?=[^'+L+'\\u0003]|$)','g'); html=html.replace(re,(m,a,b)=>a+'\u0001'+idx+'\u0002'+b+'\u0003'); }
 return html.replace(/\u0001(\d+)\u0002([^\u0003]*)\u0003/g,(m,i,t)=>`<span class="gl" tabindex="0" role="button" data-gi="${i}">${t}</span>`);
}
const wc=t=>t.p.join(' ').split(/\s+/).filter(x=>/[A-Za-zÄÖÜäöüß0-9]/.test(x)).length;
const listItem=(href,c,t,z,chips,score)=>`<a class="item" href="${href}"><span class="glyph">${c}</span><span class="item-main"><b>${esc(t)}</b><span class="zh">${esc(z)}</span>${chips?`<span class="chips">${chips}</span>`:''}</span><span class="item-end">${score!=null?`${stampHtml(score,true)}<small>${Math.round(score*100)} %</small>`:ic('chev')}</span></a>`;
function ReadList(){
 return el(`<div class="view"><header class="page-head"><h1>Lesen</h1><span class="zh">阅读理解</span><p class="lead">Kurze Alltagstexte auf A2-Niveau: E-Mails, Aushänge, Informationen und Berichte. Tippe beim Lesen auf unterstrichene Wörter, dann siehst du die Übersetzung.</p></header>
 <div class="list">${D.texts.map(t=>{const n=wc(t);return listItem(`#/lesen/${t.id}`,t.c,t.t,t.z,`<span class="chip">${esc(t.k)}</span><span class="chip">${n} Wörter</span><span class="chip">ca. ${Math.max(2,Math.round(n/80))} Min.</span>`,S.read[t.id]);}).join('')}</div></div>`);
}
function ReadView(id){
 const ti=D.texts.findIndex(t=>t.id===id); if(ti<0) return NotFound(); const T=D.texts[ti];
 const keyList=Object.keys(T.g), sorted=keyList.slice().sort((a,b)=>b.length-a.length), sentences=[]; let sIdx=0;
 const paras=T.p.map(p=>{ let cls='',txt=p; if(p.startsWith('## ')){cls='h';txt=p.slice(3);} else if(p.startsWith('> ')){cls='meta';txt=p.slice(2);} else if(p.startsWith('• ')){cls='li';txt=p.slice(2);}
  const ss=splitSentences(txt).map(s=>{ sentences.push(s); return `<span class="s" data-s="${sIdx++}">${wrapGloss(esc(s),sorted,keyList)}</span>`; }).join(' ');
  return cls==='h'?`<h3 class="t-h">${ss}</h3>`:cls==='meta'?`<p class="t-meta">${ss}</p>`:cls==='li'?`<p class="t-li">${ss}</p>`:`<p>${ss}</p>`; }).join('');
 const nx=D.texts[ti+1];
 const v=el(`<div class="view">
  <a class="back" href="#/lesen">${ic('back',18)} Alle Texte</a>
  <header class="t-head"><span class="glyph lg">${T.c}</span><div><h1>${esc(T.t)}</h1><span class="zh">${esc(T.z)}</span><div class="chips"><span class="chip">${esc(T.k)}</span><span class="chip">${wc(T)} Wörter</span></div></div></header>
  <div data-voice-notice></div>
  <div class="toolbar"><button class="btn" type="button" data-a="read">${ic('play',18)} Vorlesen</button>${rateSeg()}</div>
  <article class="paper"><div class="txt" lang="de">${paras}</div><p class="read-hint">${ic('bulb',16)}<span>Unterstrichene Wörter antippen für die Übersetzung. <span class="zh zh-help">点击带下划线的词查看中文意思。</span></span></p></article>
  <details class="gloss"><summary>${ic('list',18)} Wortliste zum Text <span class="zh zh-help">生词表</span><span class="chip">${keyList.length}</span></summary><ul>${keyList.map(k=>`<li><span>${esc(k)}</span><span class="zh">${esc(T.g[k])}</span>${say(k,{cls:'sm'})}</li>`).join('')}</ul></details>
  <div data-q></div></div>`);
 v.addEventListener('click',e=>{ const g=e.target.closest('.gl'); if(!g) return; const k=keyList[+g.dataset.gi]; if(g.classList.contains('active')){closePop();return;} showPop(g,k,T.g[k]); });
 v.addEventListener('keydown',e=>{ const g=e.target.closest&&e.target.closest('.gl'); if(g&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); const k=keyList[+g.dataset.gi]; showPop(g,k,T.g[k]); } });
 const rb=$('[data-a=read]',v); let reading=false;
 const setR=r=>{ reading=r; rb.innerHTML=r?`${ic('stop',18)} Stopp`:`${ic('play',18)} Vorlesen`; if(r) rb.classList.add('playing'); else rb.classList.remove('playing'); };
 const clearS=()=>$$('.s.reading',v).forEach(x=>x.classList.remove('reading'));
 rb.onclick=()=>{ if(reading){TTS.stop();setR(false);clearS();return;} closePop();
  const p=TTS.seq(sentences.map(t=>({text:t,pause:260})),{onitem:k=>{ clearS(); const s=$(`.s[data-s="${k}"]`,v); if(s){ s.classList.add('reading'); const r=s.getBoundingClientRect(); if(r.top<80||r.bottom>window.innerHeight-90) s.scrollIntoView({block:'center',behavior:'smooth'}); } }});
  setR(true); p.then(()=>{ setR(false); clearS(); }); };
 $('[data-q]',v).replaceWith(QuestionBlock(T.q,(sc,n)=>{ S.read[T.id]=Math.max(S.read[T.id]||0,sc/n); save(); },nx?{href:`#/lesen/${nx.id}`,label:'Nächster Text'}:null));
 return v;
}

/* ---------- listening ---------- */
function ListenHome(tab){
 const tabs=[['dialoge','#/hoeren','Dialoge','对话'],['diktat','#/hoeren/diktat','Diktat','听写'],['puzzle','#/hoeren/puzzle','Satzpuzzle','连词成句']];
 let content;
 if(tab==='dialoge') content=`<p class="lead" style="margin:0 0 18px">Gespräche und Durchsagen aus dem Alltag. Lies zuerst die Fragen, dann hör zu. <span class="zh zh-help">先看问题，再听录音。</span></p><div class="list">${D.dialogs.map(d=>listItem(`#/hoeren/d/${d.id}`,d.c,d.t,d.z,`<span class="chip">${esc(d.k)}</span><span class="chip">${d.q.length} Fragen</span>`,S.listen[d.id])).join('')}</div>`;
 else if(tab==='diktat') content=`<p class="lead" style="margin:0 0 18px">Hör einen Satz und schreib ihn auf. Du kannst jeden Satz so oft hören, wie du möchtest. <span class="zh zh-help">听句子并写下来，可以反复听。</span></p><div class="list">${D.dictation.map(s=>listItem(`#/hoeren/diktat/${s.id}`,s.c,s.t,s.z,`<span class="chip">${s.s.length} Sätze</span>`,S.dict[s.id])).join('')}</div>`;
 else content=`<p class="lead" style="margin:0 0 18px">Hör den Satz und bring die Wörter in die richtige Reihenfolge. So trainierst du Hören und Satzbau zusammen. <span class="zh zh-help">听句子，把词语排成正确的顺序。</span></p><div class="list">${D.dictation.map(s=>listItem(`#/hoeren/puzzle/${s.id}`,s.c,s.t,s.z,`<span class="chip">${s.s.length} Sätze</span>`,S.puzzle[s.id])).join('')}</div>`;
 return el(`<div class="view"><header class="page-head"><h1>Hören</h1><span class="zh">听力</span></header>
  <div data-voice-notice></div>
  <nav class="tabs" aria-label="Hörübungen">${tabs.map(([k,h,l,z])=>`<a class="tab${k===tab?' active':''}" href="${h}"${k===tab?' aria-current="page"':''}>${l}<span class="zh zh-help">${z}</span></a>`).join('')}</nav>
  ${content}</div>`);
}
function DialogView(id){
 const di=D.dialogs.findIndex(x=>x.id===id); if(di<0) return NotFound(); const d=D.dialogs[di];
 const multi=Object.keys(d.sp).length>1; let plays=0, playing=false;
 const nx=D.dialogs[di+1];
 const v=el(`<div class="view">
  <a class="back" href="#/hoeren">${ic('back',18)} Alle Hörübungen</a>
  <header class="t-head"><span class="glyph lg">${d.c}</span><div><h1>${esc(d.t)}</h1><span class="zh">${esc(d.z)}</span><div class="chips"><span class="chip">${esc(d.k)}</span>${multi?`<span class="chip">${Object.values(d.sp).map(s=>esc(s.n)).join(' und ')}</span>`:''}</div></div></header>
  <div data-voice-notice></div>
  <div class="sit"><p>${esc(d.s)}</p><p class="zh muted zh-help">${esc(d.sz)}</p></div>
  <div class="player"><button class="play-main" type="button" data-a="play" aria-label="Abspielen">${ic('play',28)}</button><div class="pl-info"><b data-pl>Abspielen</b><small data-plays>Noch nicht gehört</small></div>${rateSeg()}</div>
  <p class="tip-line">${ic('bulb',16)}<span>Lies zuerst die Fragen unten. Hör dann zweimal zu. <span class="zh zh-help">先读下面的问题，然后听两遍。</span></span></p>
  <details class="trans"><summary>${ic('list',18)} Transkript anzeigen <span class="zh zh-help">显示原文</span></summary><div class="lines" lang="de">${d.l.map(([s,t],k)=>`<p class="ln" data-l="${k}">${multi?`<b class="spk">${esc(d.sp[s].n)}:</b>`:''}${esc(t)}</p>`).join('')}</div></details>
  <div data-q></div></div>`);
 const btn=$('[data-a=play]',v), lbl=$('[data-pl]',v);
 const setP=p=>{ playing=p; btn.innerHTML=ic(p?'stop':'play',28); btn.setAttribute('aria-label',p?'Stoppen':'Abspielen'); lbl.textContent=p?'Läuft …':'Abspielen'; if(p) btn.classList.add('playing'); else btn.classList.remove('playing'); };
 const clearL=()=>$$('.ln.reading',v).forEach(x=>x.classList.remove('reading'));
 btn.onclick=()=>{
  if(playing){ TTS.stop(); setP(false); clearL(); return; }
  const p=TTS.seq(d.l.map(([s,t])=>({text:t,g:d.sp[s].g,pause:multi?420:300})),{onitem:k=>{ clearL(); const x=$(`.ln[data-l="${k}"]`,v); if(x) x.classList.add('reading'); }});
  setP(true);
  p.then(fin=>{ setP(false); clearL(); if(fin){ plays++; $('[data-plays]',v).textContent=`${plays}× gehört`; } });
 };
 $('[data-q]',v).replaceWith(QuestionBlock(d.q,(sc,n)=>{ S.listen[d.id]=Math.max(S.listen[d.id]||0,sc/n); save(); },nx?{href:`#/hoeren/d/${nx.id}`,label:'Nächste Übung'}:null));
 return v;
}
function diffWords(inp,tgt){
 const strip=w=>w.replace(/[.,!?;:„“"”»«()]/g,'');
 const norm=w=>translit(strip(w).toLowerCase());
 const T=tgt.split(/\s+/).filter(Boolean), I=inp.trim().split(/\s+/).filter(Boolean);
 const tn=T.map(norm), inn=I.map(norm), m=T.length, n=I.length;
 const eq=(a,b)=>a===b||(a.length>=4&&b.length>=3&&lev(a,b)<=1);
 const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
 for(let a=m-1;a>=0;a--) for(let b=n-1;b>=0;b--) dp[a][b]=eq(tn[a],inn[b])?dp[a+1][b+1]+1:Math.max(dp[a+1][b],dp[a][b+1]);
 const res=T.map(t=>({t,st:'miss'})); let a=0,b=0;
 while(a<m&&b<n){ if(eq(tn[a],inn[b])){ const exact=strip(T[a])===strip(I[b]); res[a].st=exact?'ok':'near'; if(!exact) res[a].got=strip(I[b]); a++; b++; } else if(dp[a+1][b]>=dp[a][b+1]) a++; else b++; }
 const ok=res.filter(r=>r.st==='ok').length, near=res.filter(r=>r.st==='near').length;
 return {res,acc:(ok+near*.5)/Math.max(m,n,1)};
}
function DictView(id){
 const set=D.dictation.find(s=>s.id===id); if(!set) return NotFound();
 let i,accs,answered;
 const v=el(`<div class="view ex"><div class="ex-top"><a class="icon-btn" href="#/hoeren/diktat" aria-label="Übung beenden">${ic('x')}</a><div class="ex-title"><b>Diktat <span class="zh zh-help" style="font-weight:400;font-size:15px;color:var(--muted)">听写</span></b><small>${esc(set.t)}</small></div></div><div data-voice-notice></div><div class="ex-body"></div></div>`), body=$('.ex-body',v);
 function setup(){ i=0; accs=[]; render(); }
 function play(rate,btn){ const p=TTS.say(set.s[i][0],'',rate); if(btn){btn.classList.add('playing');p.then(()=>btn.classList.remove('playing'));} }
 function render(){
  if(i>=set.s.length) return done();
  answered=false;
  body.innerHTML=`${progressHtml(i,set.s.length)}<div class="qcard"><p class="qlabel">Hör zu und schreib den Satz auf.<span class="zh zh-help">听句子，然后写下来。</span></p><div class="row center"><button type="button" class="play-big" data-a="play" aria-label="Satz anhören">${ic('speaker',34)}</button></div><div class="row center"><button type="button" class="btn ghost sm" data-a="slow">Langsam anhören</button></div></div>
  <textarea class="lined" rows="2" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" placeholder="Schreib hier …" aria-label="Dein Satz"></textarea>
  ${keysHtml()}
  <div class="row"><button class="btn" type="button" data-a="check">Prüfen</button></div><div class="fb" aria-live="polite"></div>`;
  const inp=$('.lined',body); bindKeys(body,inp);
  $('[data-a=play]',body).onclick=e=>play(undefined,e.currentTarget);
  $('[data-a=slow]',body).onclick=e=>play(0.6,e.currentTarget);
  $('[data-a=check]',body).onclick=check;
  inp.onkeydown=e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); if(answered){i++;render();} else check(); } };
  setTimeout(()=>{ if(body.isConnected&&!answered) play(undefined,$('.play-big',body)); },350);
 }
 function check(){
  if(answered) return; const inp=$('.lined',body); if(!inp.value.trim()){ inp.focus(); return; }
  answered=true; const [de,zh]=set.s[i]; const r=diffWords(inp.value,de); accs.push(r.acc);
  addXP(r.acc>=.9?3:r.acc>=.6?1:0); inp.readOnly=true;
  const pct=Math.round(r.acc*100), cls=r.acc>=.9?'ok':r.acc>=.6?'almost':'bad';
  $('[data-a=check]',body).hidden=true;
  $('.fb',body).innerHTML=`<div class="fb-box ${cls}"><div><strong>${pct} % richtig</strong><p class="diff" lang="de">${r.res.map(x=>`<span class="w-${x.st}"${x.got?` title="Deine Schreibweise: ${esc(x.got)}"`:''}>${esc(x.t)}</span>`).join(' ')}</p><p class="zh muted zh-help">${esc(zh)}</p><p class="diff-legend"><span class="w-ok">grün: richtig</span><span class="w-near">orange: fast richtig</span><span class="w-miss">rot: fehlt oder falsch</span></p></div><button class="btn sm" type="button" data-a="next">Weiter</button></div>`;
  const nb=$('[data-a=next]',body); nb.onclick=()=>{i++;render();}; nb.focus({preventScroll:true});
 }
 function done(){
  const avg=accs.reduce((a,b)=>a+b,0)/accs.length; S.dict[set.id]=Math.max(S.dict[set.id]||0,avg); save();
  body.innerHTML=resultHtml(avg,`Durchschnittlich ${Math.round(avg*100)} % richtig`,`<button class="btn" type="button" data-a="again">${ic('refresh',18)} Nochmal</button><a class="btn ghost" href="#/hoeren/diktat">Alle Diktate</a>`);
  $('[data-a=again]',body).onclick=setup;
 }
 setup(); return v;
}
function PuzzleView(id){
 const set=D.dictation.find(s=>s.id===id); if(!set) return NotFound();
 let i,sc,placed,pool,core,answered;
 const v=el(`<div class="view ex"><div class="ex-top"><a class="icon-btn" href="#/hoeren/puzzle" aria-label="Übung beenden">${ic('x')}</a><div class="ex-title"><b>Satzpuzzle <span class="zh zh-help" style="font-weight:400;font-size:15px;color:var(--muted)">连词成句</span></b><small>${esc(set.t)}</small></div></div><div data-voice-notice></div><div class="ex-body"></div></div>`), body=$('.ex-body',v);
 function setup(){ i=0; sc=0; render(); }
 function prep(){ const de=set.s[i][0]; const m=de.match(/^(.*?)([.!?])$/); core=m?m[1]:de; const toks=core.split(' ').map((t,k)=>({k,t})); let sh=shuffle(toks); let guard=0; while(toks.length>1&&sh.map(x=>x.t).join(' ')===core&&guard++<20) sh=shuffle(toks); pool=sh; placed=[]; answered=false; }
 function play(btn){ const p=TTS.say(set.s[i][0]); if(btn){btn.classList.add('playing');p.then(()=>btn.classList.remove('playing'));} }
 function render(){
  if(i>=set.s.length) return done();
  prep();
  body.innerHTML=`${progressHtml(i,set.s.length)}<div class="qcard"><p class="qlabel">Hör zu und bilde den Satz.<span class="zh zh-help">听一听，把词语排成正确的句子。</span></p><div class="row center"><button type="button" class="play-big sm" data-a="play" aria-label="Satz anhören">${ic('speaker',30)}</button></div></div>
  <div class="answer-line" aria-label="Dein Satz" aria-live="polite"></div><div class="pool" aria-label="Wörter"></div>
  <div class="row"><button class="btn" type="button" data-a="check" disabled>Prüfen</button><button class="btn ghost" type="button" data-a="reset">Zurücksetzen</button></div><div class="fb" aria-live="polite"></div>`;
  $('[data-a=play]',body).onclick=e=>play(e.currentTarget);
  $('[data-a=reset]',body).onclick=()=>{ if(answered) return; pool=pool.concat(placed); placed=[]; draw(); };
  $('[data-a=check]',body).onclick=check;
  body.querySelector('.answer-line').onclick=e=>{ const c=e.target.closest('.chipw'); if(!c||answered) return; const k=+c.dataset.k; const x=placed.find(p=>p.k===k); placed=placed.filter(p=>p.k!==k); pool.push(x); draw(); };
  body.querySelector('.pool').onclick=e=>{ const c=e.target.closest('.chipw'); if(!c||answered) return; const k=+c.dataset.k; const x=pool.find(p=>p.k===k); pool=pool.filter(p=>p.k!==k); placed.push(x); draw(); };
  draw();
  setTimeout(()=>{ if(body.isConnected&&!answered) play($('.play-big',body)); },350);
 }
 function draw(){
  const al=$('.answer-line',body), pl=$('.pool',body);
  al.innerHTML=placed.length?placed.map(x=>`<button type="button" class="chipw" data-k="${x.k}">${esc(x.t)}</button>`).join(''):`<span class="placeholder">Tippe auf die Wörter unten. <span class="zh zh-help">点击下面的词语。</span></span>`;
  pl.innerHTML=pool.map(x=>`<button type="button" class="chipw" data-k="${x.k}">${esc(x.t)}</button>`).join('');
  $('[data-a=check]',body).disabled=pool.length>0;
 }
 function check(){
  if(answered||pool.length) return; answered=true;
  const [de,zh]=set.s[i]; const ok=placed.map(x=>x.t).join(' ')===core;
  if(ok){ sc++; addXP(2); }
  $('.answer-line',body).classList.add(ok?'ok':'bad');
  $('[data-a=check]',body).hidden=true; $('[data-a=reset]',body).hidden=true;
  $('.fb',body).innerHTML=`<div class="fb-box ${ok?'ok':'bad'}"><div><strong>${ok?'Richtig!':'Nicht ganz. So ist es richtig:'}</strong><p lang="de">${esc(de)}${say(de,{cls:'sm'})}</p><p class="zh muted zh-help">${esc(zh)}</p></div><button class="btn sm" type="button" data-a="next">Weiter</button></div>`;
  const nb=$('[data-a=next]',body); nb.onclick=()=>{i++;render();}; nb.focus({preventScroll:true});
 }
 function done(){
  const p=sc/set.s.length; S.puzzle[set.id]=Math.max(S.puzzle[set.id]||0,p); save();
  body.innerHTML=resultHtml(p,`${sc} von ${set.s.length} Sätzen richtig`,`<button class="btn" type="button" data-a="again">${ic('refresh',18)} Nochmal</button><a class="btn ghost" href="#/hoeren/puzzle">Alle Puzzles</a>`);
  $('[data-a=again]',body).onclick=setup;
 }
 setup(); return v;
}

/* ---------- settings ---------- */
function openSettings(){
 if($('.modal-wrap')) return;
 const m=el(`<div class="modal-wrap" role="dialog" aria-modal="true" aria-labelledby="set-t"><div class="modal">
  <div class="modal-head"><h2 id="set-t">Einstellungen<span class="zh">设置</span></h2><button class="icon-btn" type="button" data-a="close" aria-label="Schließen">${ic('x')}</button></div>
  <label class="field"><span>Dein Name <span class="zh">你的名字</span></span><input id="s-name" value="${esc(S.name)}" maxlength="30" autocomplete="given-name"></label>
  <div class="field"><span>Tagesziel in Punkten <span class="zh">每日目标（分）</span></span><div class="seg">${[[20,'Locker'],[50,'Normal'],[100,'Intensiv']].map(([g,l])=>`<button type="button" data-goal="${g}" class="${S.goal===g?'on':''}">${l}: ${g}</button>`).join('')}</div></div>
  <div class="field"><span>Sprechtempo <span class="zh">语速</span></span>${rateSeg()}</div>
  <div class="field"><span>Stimme <span class="zh">声音</span></span><div class="row"><select id="s-voice" aria-label="Stimme"></select><button class="btn ghost sm" type="button" data-a="test">${ic('speaker',18)} Testen</button></div></div>
  <p class="voice-note" id="s-vnote"></p>
  <label class="switch"><input type="checkbox" id="s-zh" ${S.zh?'checked':''}><span>Chinesische Hilfen anzeigen <span class="zh muted">显示中文提示</span><br><small class="muted">Aus: weniger Übersetzungen, mehr Deutsch.</small></span></label>
  <div class="field"><span>Darstellung <span class="zh">外观</span></span><div class="seg">${[['auto','Automatisch'],['light','Hell'],['dark','Dunkel']].map(([k,l])=>`<button type="button" data-theme-set="${k}" class="${S.theme===k?'on':''}">${l}</button>`).join('')}</div></div>
  <div class="danger"><button class="btn ghost danger-btn" type="button" data-a="reset">Fortschritt zurücksetzen</button></div>
 </div></div>`);
 document.body.append(m);
 const sel=$('#s-voice',m);
 const fill=()=>{
  const all=TTS.all, de=TTS.voices, others=all.filter(x=>!de.includes(x)), cur=TTS.chosen();
  const opt=x=>`<option value="${esc(x.voiceURI||x.name)}"${x===cur?' selected':''}>${esc(x.name)} (${esc(x.lang||'?')})</option>`;
  sel.innerHTML=`<option value="">Automatisch${de.length?'':' (keine deutsche Stimme erkannt)'}</option>`+(de.length?`<optgroup label="Deutsch">${de.map(opt).join('')}</optgroup>`:'')+(others.length?`<optgroup label="${de.length?'Andere Sprachen':'Alle Stimmen'}">${others.map(opt).join('')}</optgroup>`:'');
  $('#s-vnote',m).textContent=!TTS.ok?'Dieser Browser unterstützt keine Sprachausgabe.'
   :!all.length?'Der Browser meldet noch keine Stimmen. Starte Chrome neu (Einstellungen › Apps › Chrome › Beenden erzwingen).'
   :de.length?`${de.length} deutsche ${de.length===1?'Stimme':'Stimmen'} gefunden (von ${all.length} insgesamt).`
   :`Der Browser meldet ${all.length} Stimmen, aber keine erkennbar deutsche. Steht in der Auswahlliste eine deutsche Stimme, wähle sie direkt aus. Sonst Chrome über Einstellungen › Apps › Chrome › „Beenden erzwingen“ neu starten.`;
 };
 TTS.load(); fill(); document.addEventListener('sg-voices',fill);
 sel.onchange=()=>{ S.voice=sel.value; save(); refreshNotices(); if(sel.value) TTS.say('Hallo! Das ist meine Stimme.'); };
 $('[data-a=test]',m).onclick=()=>TTS.say('Hallo! Schön, dass du Deutsch lernst.');
 $('#s-name',m).oninput=e=>{ S.name=e.target.value.trim(); save(); };
 $('#s-zh',m).onchange=e=>{ S.zh=e.target.checked; save(); applyTheme(); };
 m.addEventListener('click',e=>{
  const g=e.target.closest('[data-goal]'); if(g){ S.goal=+g.dataset.goal; save(); $$('[data-goal]',m).forEach(b=>b.classList.toggle('on',b===g)); updateXP(); return; }
  const t=e.target.closest('[data-theme-set]'); if(t){ S.theme=t.dataset.themeSet; save(); applyTheme(); $$('[data-theme-set]',m).forEach(b=>b.classList.toggle('on',b===t)); return; }
  if(e.target===m||e.target.closest('[data-a=close]')) close();
 });
 const rb=$('[data-a=reset]',m);
 rb.onclick=()=>{ if(!rb.classList.contains('armed')){ rb.classList.add('armed'); rb.textContent='Wirklich alles löschen? Nochmal tippen.'; return; }
  const keep={name:S.name,goal:S.goal,rate:S.rate,voice:S.voice,zh:S.zh,theme:S.theme}; S=Object.assign(JSON.parse(JSON.stringify(DEF)),keep); save(); updateXP(); toast('Fortschritt wurde zurückgesetzt.'); close(); };
 const onEsc=e=>{ if(e.key==='Escape') close(); };
 document.addEventListener('keydown',onEsc);
 function close(){ document.removeEventListener('keydown',onEsc); document.removeEventListener('sg-voices',fill); m.remove(); route(); }
 setTimeout(()=>{ const c=$('[data-a=close]',m); if(c) c.focus(); },30);
}

/* ---------- init ---------- */
applyTheme(); buildShell(); TTS.init();
document.addEventListener('sg-voices',refreshNotices);
window.addEventListener('hashchange',route);
route();
})();
