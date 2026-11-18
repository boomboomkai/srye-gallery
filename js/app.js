const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const all = W.map((_, i) => i);
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

const MC = {
 人物: "#9b7653", 花鳥: "#5d8a72", 山水: "#3f6a80",
 走獸: "#a85f3f", 書法: "#2a3035", 文創: "#b4372d"
};
const mountColor = i => MC[W[i][1]] || "#666";

// 依原圖比例保留空間，順序與作品編號一致。
const sizes = `
640x1213 640x1156 640x1312 680x1321 680x1266 680x906 680x906 680x510 680x480 680x510 680x510 680x510
384x1500 355x1500 680x686 580x960 680x853 680x1308 680x1270 680x1341 680x635 680x1253 509x960 297x1172
680x347 322x1138 680x340 680x1206 680x809 500x1320 680x909 439x1500 680x1021 680x417 680x363 427x1500
416x1500 393x1500 680x1264 680x1143 680x382 680x376 680x364 680x355 680x375 680x378 680x361 680x373
680x361 680x1109 680x1291 344x1446 548x1425 390x1500 391x1500 390x1500 680x1308 529x1300 426x1300 543x1300
480x1300 454x1300 510x960 514x960 589x1300 452x960 566x1300 583x1300 720x720 720x720 720x960 720x960
720x960 720x960 720x540 720x1280 720x960 680x718 497x1500 680x907 680x907 680x510 680x906 680x907
522x1500 503x1500 680x906 332x1024 680x906 680x625 680x906 508x1500 484x752 400x632 378x616 610x935
425x742 470x660 428x807 390x632 437x715 400x767 432x580 680x1021 680x943 680x1216 680x946 680x1392
`.trim().split(/\s+/);

const escapeHTML = value => String(value)
 .replaceAll("&", "&amp;")
 .replaceAll("<", "&lt;")
 .replaceAll(">", "&gt;")
 .replaceAll('"', "&quot;");
const label = i => escapeHTML(`${W[i][0]}（${W[i][1]}）`);

function image(i, { full = false, eager = false, high = false } = {}) {
 const src = full ? IMG[i] : IMG[i].replace("/works/", "/thumbs/");
 const size = sizes[Number(IMG[i].match(/\/(\d+)\.jpg$/i)?.[1]) - 1];
 const [width, height] = (size || "4x5").split("x");
 return `<img class="wash" src="${escapeHTML(src)}" alt="${label(i)}" width="${width}" height="${height}" loading="${eager || full ? "eager" : "lazy"}"${high ? ' fetchpriority="high"' : ""} decoding="async">`;
}

document.addEventListener("load", event => {
 if (event.target instanceof HTMLImageElement && event.target.classList.contains("wash")) {
  event.target.classList.add("loaded");
 }
}, true);
$$("img.wash").forEach(img => {
 if (img.complete && img.naturalWidth) img.classList.add("loaded");
});

// 首頁掛軸
const featured = ["香風翠柳", "松上雙孔雀", "江山如此多嬌", "祥龍獻瑞", "紅楓山水", "孔雀牡丹", "紫藤鸚鵡", "錦鯉圖", "雄鷹與松", "荷與鯉"]
 .map(title => W.findIndex(work => work[0] === title))
 .filter(i => i >= 0);
const hang = $("#hang");

function renderHero() {
 hang.innerHTML = featured.map((i, n) => `<button class="hang" data-open="${i}" data-ctx="hero" aria-label="${label(i)}"><span class="cord"></span><span class="silk">${image(i, { eager: n < 3, high: n === 0 })}</span><span class="slip" aria-hidden="true">${[...W[i][0]].map(char => `<i>${escapeHTML(char)}</i>`).join("")}</span></button>`).join("");
}

function scrollHero(direction) {
 hang.scrollBy({ left: direction * hang.clientWidth * .7, behavior: reduced.matches ? "auto" : "smooth" });
}
$("#prev").addEventListener("click", () => scrollHero(-1));
$("#next").addEventListener("click", () => scrollHero(1));

// 作品與分類
let category = "全部";
const filtered = () => all.filter(i => category === "全部" || W[i][1] === category);
const byCollection = COLS.map((_, k) => all.filter(i => W[i][5] === k));
const yearValue = year => year === "待補" ? -1 : Number(year.match(/\d{4}/)?.[0] || 0);
const years = [...new Set(W.map(work => work[2]))].sort((a, b) => yearValue(b) - yearValue(a));
const byYear = years.map(year => all.filter(i => W[i][2] === year));

function card(i, context, variant) {
 const caption = variant === "year" ? "" : `<b>${escapeHTML(W[i][0])}</b>`;
 const medium = variant === "grid" ? `<span class="mute">${escapeHTML(W[i][3])}</span>` : "";
 return `<button class="item" data-open="${i}" data-ctx="${context}" style="--mc:${mountColor(i)}"${variant === "grid" ? "" : ` aria-label="${label(i)}"`}><span class="mount">${image(i)}</span>${caption}${medium}</button>`;
}

function renderGrid() {
 const works = filtered();
 $("#grid").innerHTML = works.map(i => card(i, "grid", "grid")).join("");
 $("#count").textContent = `共 ${works.length} 件`;
}

function renderWorks() {
 $("#chips").innerHTML = CATS.map(name => {
  const count = name === "全部" ? W.length : W.filter(work => work[1] === name).length;
  const dot = name === "全部" ? "" : `<i aria-hidden="true" style="background:${MC[name]}"></i>`;
  return `<button class="chip" data-cat="${escapeHTML(name)}" aria-pressed="${name === category}" aria-controls="grid">${dot}${escapeHTML(name)}<small>${count}</small></button>`;
 }).join("");
 renderGrid();
}

function renderCollections() {
 $("#cols").innerHTML = COLS.map(([name, description], k) => {
  const works = byCollection[k];
  return `<article class="ser"><div><h3>${escapeHTML(name)}</h3><p class="mute">${escapeHTML(description)}</p><p class="mute">${works.length} 件</p></div><div class="row">${works.map(i => card(i, `col${k}`, "series")).join("")}</div></article>`;
 }).join("");

 $("#tl").innerHTML = years.map((year, k) => {
  const heading = year === "待補" ? "年份待補" : year;
  return `<div class="yr"><h3>${escapeHTML(heading)}</h3><div class="row">${byYear[k].map(i => card(i, `yr${k}`, "year")).join("")}</div></div>`;
 }).join("");
}

// 燈箱
const dialog = $("#lb");
const stage = $("#st");
const info = $("#info");
const closeButton = $("#x");
const position = $("#position");
const steps = $("#steps");
const announcement = $("#announcement");
const prefetched = new Map();
let current = 0;
let ring = [];
let opener = null;
let lockedScroll = 0;
let closeTimer = 0;
let touchStart = null;

function contextWorks(context) {
 if (context === "hero") return featured;
 if (context === "grid") return filtered();
 if (context.startsWith("col")) return byCollection[Number(context.slice(3))];
 return byYear[Number(context.slice(2))];
}

function preloadNeighbors(index) {
 const neighbors = new Set();
 if (ring.length > 1) {
  neighbors.add(ring[(index + 1) % ring.length]);
  neighbors.add(ring[(index + ring.length - 1) % ring.length]);
 }
 for (const i of prefetched.keys()) {
  if (!neighbors.has(i)) prefetched.delete(i);
 }
 for (const i of neighbors) {
  if (prefetched.has(i)) continue;
  const img = new Image();
  img.setAttribute("fetchpriority", "low");
  img.src = IMG[i];
  prefetched.set(i, img);
 }
}

function showWork(i) {
 current = i;
 const work = W[i];
 const index = ring.indexOf(i);
 const related = all.filter(j => j !== i && (W[j][5] === work[5] || W[j][1] === work[1])).slice(0, 8);

 if (info.contains(document.activeElement) && document.activeElement !== info) closeButton.focus();
 stage.innerHTML = `<span class="mount" style="--mc:${mountColor(i)}">${image(i, { full: true })}</span>`;
 position.textContent = ring.length > 1 ? `${index + 1} / ${ring.length}` : "";
 steps.hidden = ring.length < 2;

 info.innerHTML = `<h2>${escapeHTML(work[0])}</h2>
 <dl><dt>年份</dt><dd>${escapeHTML(work[2])}</dd><dt>媒材</dt><dd>${escapeHTML(work[3])}</dd><dt>工具</dt><dd>${escapeHTML(work[4])}</dd><dt>系列</dt><dd>${escapeHTML(COLS[work[5]][0])}</dd><dt>分類</dt><dd>${escapeHTML(work[1])}</dd></dl>
 <p>${escapeHTML(work[6])}</p><p class="tags">${work[7].map(tag => `<span>#${escapeHTML(tag)}</span>`).join("")}</p>
 <h4>相關作品</h4>
 <div class="rel">${related.map(j => `<button data-jump="${j}" aria-label="${label(j)}">${image(j)}</button>`).join("")}</div>`;
 info.scrollTop = 0;
 announcement.textContent = `${work[0]}（${work[1]}）${position.textContent ? `，${position.textContent}` : ""}`;
 preloadNeighbors(index);
}

function openWork(button) {
 if (dialog.open) return;
 const i = Number(button.dataset.open);
 const works = contextWorks(button.dataset.ctx);
 ring = works?.includes(i) ? works : [i];
 opener = button;
 lockedScroll = window.scrollY;
 document.body.style.setProperty("--lock-top", `${-lockedScroll}px`);
 document.body.classList.add("modal-open");
 dialog.showModal();
 closeButton.focus({ preventScroll: true });
 showWork(i);
}

function finishClose(restoreFocus) {
 if (!dialog.open) return;
 clearTimeout(closeTimer);
 dialog.close();
 dialog.classList.remove("closing");
 document.body.classList.remove("modal-open");
 document.body.style.removeProperty("--lock-top");
 window.scrollTo(0, lockedScroll);
 stage.replaceChildren();
 info.replaceChildren();
 announcement.textContent = "";
 prefetched.clear();
 touchStart = null;
 if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
 opener = null;
}

function closeWork() {
 if (dialog.classList.contains("closing")) return;
 if (reduced.matches) {
  finishClose(true);
  return;
 }
 dialog.classList.add("closing");
 closeTimer = setTimeout(() => finishClose(true), 220);
}

function step(direction) {
 if (ring.length < 2 || dialog.classList.contains("closing")) return;
 const index = ring.indexOf(current);
 showWork(ring[(index + direction + ring.length) % ring.length]);
}

dialog.addEventListener("animationend", event => {
 if (event.target === dialog && event.animationName === "dialog-out") finishClose(true);
});
dialog.addEventListener("cancel", event => {
 event.preventDefault();
 closeWork();
});
dialog.addEventListener("keydown", event => {
 if (event.key === "Tab") {
  const targets = [...dialog.querySelectorAll("button, [tabindex='0']")].filter(element => element.getClientRects().length);
  const first = targets[0];
  const last = targets[targets.length - 1];
  const active = document.activeElement;
  if (!targets.includes(active) || (event.shiftKey ? active === first : active === last)) {
   event.preventDefault();
   (event.shiftKey ? last : first).focus();
  }
  return;
 }
 if (ring.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
 if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
  if (event.target.closest(".rel")) return;
  event.preventDefault();
  step(event.key === "ArrowLeft" ? -1 : 1);
 }
});

stage.addEventListener("touchstart", event => {
 const touch = event.touches[0];
 touchStart = event.touches.length === 1 ? { id: touch.identifier, x: touch.clientX, y: touch.clientY } : null;
}, { passive: true });
stage.addEventListener("touchend", event => {
 if (!touchStart) return;
 const start = touchStart;
 touchStart = null;
 const end = [...event.changedTouches].find(touch => touch.identifier === start.id);
 if (!end || event.touches.length) return;
 const dx = end.clientX - start.x;
 const dy = end.clientY - start.y;
 if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.35) step(dx < 0 ? 1 : -1);
}, { passive: true });
stage.addEventListener("touchcancel", () => { touchStart = null; });

dialog.addEventListener("click", event => {
 const button = event.target.closest("button");
 if (!button || dialog.classList.contains("closing")) return;
 if (button === closeButton) {
  closeWork();
 } else if (button.hasAttribute("data-step")) {
  step(Number(button.dataset.step));
 } else if (button.hasAttribute("data-jump")) {
  const i = Number(button.dataset.jump);
  if (!ring.includes(i)) ring = all;
  closeButton.focus({ preventScroll: true });
  showWork(i);
 }
});

// 分頁與瀏覽紀錄
const pages = new Map($$(".page").map(page => [page.id.slice(2), page]));
const renderers = new Map([
 ["home", renderHero], ["works", renderWorks], ["collections", renderCollections]
]);
let activePage;

function showRoute(moveFocus) {
 const hash = location.hash.slice(1);
 const id = pages.has(hash) ? hash : "home";
 if (id === activePage) return;
 finishClose(false);
 const page = pages.get(id);

 if (renderers.has(id)) {
  renderers.get(id)();
  renderers.delete(id);
 }
 for (const section of pages.values()) {
  section.classList.toggle("on", section === page);
  section.classList.toggle("enter", moveFocus && section === page);
 }
 for (const button of $$("#nav button")) {
  if (button.dataset.go === id) button.setAttribute("aria-current", "page");
  else button.removeAttribute("aria-current");
 }
 activePage = id;
 if (moveFocus) page.querySelector("h1, h2").focus({ preventScroll: true });
 window.scrollTo(0, 0);
}

document.addEventListener("click", event => {
 const button = event.target.closest("button[data-go], button[data-open], button[data-cat]");
 if (!button) return;

 if (button.hasAttribute("data-go")) {
  const id = button.dataset.go;
  if (id === activePage) {
   window.scrollTo(0, 0);
   return;
  }
  history.pushState(null, "", `#${id}`);
  showRoute(true);
 } else if (button.hasAttribute("data-open")) {
  openWork(button);
 } else if (button.dataset.cat !== category) {
  category = button.dataset.cat;
  for (const chip of $$("#chips .chip")) chip.setAttribute("aria-pressed", String(chip === button));
  renderGrid();
  const bar = $("#chips");
  const top = parseFloat(getComputedStyle(bar).top);
  const bottom = bar.getBoundingClientRect().bottom;
  if (bottom <= top + bar.offsetHeight + 1) {
   const gridTop = $("#grid").getBoundingClientRect().top;
   if (gridTop < bottom) window.scrollTo(0, window.scrollY + gridTop - bottom - 10);
  }
 }
});

history.scrollRestoration = "manual";
window.addEventListener("hashchange", () => showRoute(true));
window.addEventListener("popstate", () => showRoute(true));
showRoute(false);
