const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const MC={人物:"#9b7653",花鳥:"#5d8a72",山水:"#3f6a80",走獸:"#a85f3f",書法:"#2a3035",文創:"#b4372d"};
const mc=i=>MC[W[i][1]]||"#666";
const im=(i,c)=>`<img${c?` class="${c}"`:""} src="${IMG[i]}" alt="${W[i][0]}" decoding="async">`;
const all=W.map((w,i)=>i);

/* hero: hanging scrolls */
const FEAT=["香風翠柳","松上雙孔雀","江山如此多嬌","祥龍獻瑞","紅楓山水","孔雀牡丹","紫藤鸚鵡","錦鯉圖","雄鷹與松","荷與鯉"].map(n=>W.findIndex(w=>w[0]==n)).filter(i=>i>=0);
$("#hang").innerHTML=FEAT.map((i,n)=>`<button class="hang" data-open="${i}" data-ctx="hero" style="--n:${n}" aria-label="${W[i][0]}"><span class="cord"></span><span class="silk">${im(i)}</span><span class="slip" aria-hidden="true">${[...W[i][0]].map(c=>`<i>${c}</i>`).join("")}</span></button>`).join("");
const hr=$("#hang");$("#prev").onclick=()=>hr.scrollBy({left:-hr.clientWidth*.7,behavior:"smooth"});$("#next").onclick=()=>hr.scrollBy({left:hr.clientWidth*.7,behavior:"smooth"});

/* works */
let CAT="全部";
const LIST=()=>all.filter(i=>CAT=="全部"||W[i][1]==CAT);
const item=(i,ctx,sm)=>`<button class="item" data-open="${i}" data-ctx="${ctx}" style="--mc:${mc(i)}"><span class="mount">${im(i)}</span><b>${W[i][0]}</b>${sm?"":`<span class="mute">${W[i][3]}</span>`}</button>`;
function grid(){const l=LIST();$("#grid").innerHTML=l.map(i=>item(i,"grid")).join("");$("#count").textContent=`共 ${l.length} 件`}
$("#chips").innerHTML=CATS.map((c,k)=>`<button class="chip" data-cat="${c}" aria-pressed="${k==0}">${c=="全部"?"":`<i style="background:${MC[c]}"></i>`}${c}<small>${c=="全部"?W.length:W.filter(w=>w[1]==c).length}</small></button>`).join("");
grid();

/* series + timeline */
$("#cols").innerHTML=COLS.map((c,k)=>{const l=all.filter(i=>W[i][5]==k);return `<article class="ser"><div><h3>${c[0]}</h3><p class="mute">${c[1]}</p><p class="mute">${l.length} 件</p></div><div class="row">${l.map(i=>item(i,"col"+k,1)).join("")}</div></article>`}).join("");
const yv=y=>y=="待補"?-1:+(y.match(/\d{4}/)||[0])[0];
const YRS=[...new Set(W.map(w=>w[2]))].sort((a,b)=>yv(b)-yv(a));
$("#tl").innerHTML=YRS.map((y,n)=>{const l=all.filter(i=>W[i][2]==y);return `<div class="yr"><h3>${y=="待補"?"年份待補":y}</h3><div class="row">${l.map(i=>`<button class="item" data-open="${i}" data-ctx="yr${n}" style="--mc:${mc(i)}" aria-label="${W[i][0]}"><span class="mount">${im(i)}</span></button>`).join("")}</div></div>`}).join("");

/* navigation */
function go(id){if(!$("#p-"+id))id="home";$$(".page").forEach(s=>s.classList.toggle("on",s.id=="p-"+id));$$("#nav button").forEach(b=>b.dataset.go==id?b.setAttribute("aria-current","page"):b.removeAttribute("aria-current"));scrollTo(0,0);try{history.replaceState(null,"","#"+id)}catch(e){}}

/* lightbox */
let cur=0,ring=[],last=null;
const ctxList=c=>c=="hero"?FEAT:c=="grid"?LIST():c.startsWith("col")?all.filter(i=>W[i][5]==+c.slice(3)):c.startsWith("yr")?all.filter(i=>W[i][2]==YRS[+c.slice(2)]):null;
function show(i){cur=i;const w=W[i],k=ring.indexOf(i);
 const rel=all.filter(j=>j!=i&&(W[j][5]==w[5]||W[j][1]==w[1])).slice(0,8);
 $("#st").innerHTML=`<span class="mount" style="--mc:${mc(i)}">${im(i)}</span>`;
 $("#info").innerHTML=`<div class="tools"><button id="x">關閉</button>${ring.length>1?`<span class="mute">${k+1} / ${ring.length}</span><span><button data-step="-1" aria-label="上一件">上一件</button> <button data-step="1" aria-label="下一件">下一件</button></span>`:""}</div>
 <h2>${w[0]}</h2>
 <dl><dt>年份</dt><dd>${w[2]}</dd><dt>媒材</dt><dd>${w[3]}</dd><dt>工具</dt><dd>${w[4]}</dd><dt>系列</dt><dd>${COLS[w[5]][0]}</dd><dt>分類</dt><dd>${w[1]}</dd></dl>
 <p>${w[6]}</p><p class="tags">${w[7].map(t=>`<span>#${t}</span>`).join("")}</p>
 <h4>相關作品</h4>
 <div class="rel">${rel.map(j=>`<button data-jump="${j}" aria-label="${W[j][0]}">${im(j)}</button>`).join("")}</div>`;
 $("#info").scrollTop=0}
function open_(i,ctx){ring=(ctx&&ctxList(ctx))||[i];if(!ring.includes(i))ring=[i];last=document.activeElement;show(i);$("#lb").classList.add("on");$("#app").inert=true;$("#x").focus()}
function close_(){$("#lb").classList.remove("on");$("#app").inert=false;if(last&&last.focus)last.focus()}
function step(d){const k=ring.indexOf(cur);show(ring[(k+d+ring.length)%ring.length]);$("#x").focus()}
document.addEventListener("click",e=>{
 const g=e.target.closest("[data-go]");if(g){go(g.dataset.go);return}
 const o=e.target.closest("[data-open]");if(o){open_(+o.dataset.open,o.dataset.ctx);return}
 const c=e.target.closest("[data-cat]");if(c){CAT=c.dataset.cat;$$(".chip").forEach(x=>x.setAttribute("aria-pressed",x==c));grid();return}
 const s=e.target.closest("[data-step]");if(s){step(+s.dataset.step);return}
 const j=e.target.closest("[data-jump]");if(j){ring=[+j.dataset.jump];show(+j.dataset.jump);return}
 if(e.target.closest("#x"))close_()});
addEventListener("keydown",e=>{if(!$("#lb").classList.contains("on"))return;
 if(e.key=="Escape")close_();else if(e.key=="ArrowLeft"&&ring.length>1)step(-1);else if(e.key=="ArrowRight"&&ring.length>1)step(1)});
go((location.hash||"#home").slice(1));
