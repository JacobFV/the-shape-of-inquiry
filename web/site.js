
const $ = (sel) => document.querySelector(sel);
const toast = $("#toast");
const paper = $("#paper");
const marginList = $("#marginList");
const noteCount = $("#noteCount");
const pop = $("#selectionPopover");

const STORAGE_KEY = "inquiry-annotations-v1";

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1400);
}

function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max ? (h.scrollTop / max) * 100 : 0;
  $("#progress").style.width = pct + "%";
}
document.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

document.addEventListener("click", async (e) => {
  const anchor = e.target.closest(".copy-anchor");
  if (anchor) {
    const url = `${location.origin}${location.pathname}#${anchor.dataset.anchor}`;
    await navigator.clipboard.writeText(url);
    showToast("link copied");
  }
});

$("#themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

$("#sharePage")?.addEventListener("click", async () => {
  const data = { title: document.title, url: location.href };
  if (navigator.share) await navigator.share(data);
  else {
    await navigator.clipboard.writeText(location.href);
    showToast("copied");
  }
});

$("#mobileToc")?.addEventListener("click", () => {
  const toc = $("#tocPanel");
  toc.classList.toggle("open");
  if (toc.classList.contains("open")) toc.scrollIntoView({ behavior: "smooth", block: "start" });
});

function storageKey() {
  return `${STORAGE_KEY}:${location.pathname}`;
}

function loadAnnotations() {
  try {
    const raw = localStorage.getItem(storageKey());
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) throw new Error("invalid");
    return data;
  } catch {
    return [];
  }
}

function saveAnnotations(items) {
  localStorage.setItem(storageKey(), JSON.stringify(items));
}

let annotations = loadAnnotations();
let activeId = null;

function nodePath(node, root) {
  const path = [];
  let n = node;
  while (n && n !== root) {
    const parent = n.parentNode;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, n));
    n = parent;
  }
  return path;
}

function nodeFromPath(root, path) {
  let n = root;
  for (const i of path) {
    if (!n || !n.childNodes || !n.childNodes[i]) return null;
    n = n.childNodes[i];
  }
  return n;
}

function serializeRange(range) {
  const start = nodePath(range.startContainer, paper);
  const end = nodePath(range.endContainer, paper);
  if (!start || !end) return null;
  return {
    startPath: start,
    startOffset: range.startOffset,
    endPath: end,
    endOffset: range.endOffset,
  };
}

function deserializeRange(serial) {
  const startNode = nodeFromPath(paper, serial.startPath);
  const endNode = nodeFromPath(paper, serial.endPath);
  if (!startNode || !endNode) return null;
  const range = document.createRange();
  try {
    range.setStart(startNode, serial.startOffset);
    range.setEnd(endNode, serial.endOffset);
    if (range.collapsed || !range.toString().trim()) return null;
    return range;
  } catch {
    return null;
  }
}

function pathRank(serial) {
  const len = Math.max(serial.startPath.length, serial.endPath.length);
  for (let i = 0; i < len; i++) {
    const a = serial.startPath[i] ?? -1;
    const b = serial.endPath[i] ?? -1;
    if (a !== b) return a - b;
  }
  return serial.startOffset - serial.endOffset;
}

function wrapRange(range, id) {
  const mark = document.createElement("mark");
  mark.className = "highlighted";
  mark.dataset.id = id;
  range.surroundContents(mark);
  return mark;
}

function unwrapMark(mark) {
  const parent = mark.parentNode;
  if (!parent) return;
  while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
  parent.removeChild(mark);
}

function findMark(id) {
  return paper.querySelector(`mark.highlighted[data-id="${CSS.escape(id)}"]`);
}

function scrollToHighlight(id) {
  const mark = findMark(id);
  if (!mark) {
    showToast("highlight missing");
    return;
  }
  mark.scrollIntoView({ behavior: "smooth", block: "center" });
  setActiveHighlight(id);
}

function setActiveHighlight(id) {
  activeId = id;
  paper.querySelectorAll("mark.highlighted.is-active").forEach((m) => m.classList.remove("is-active"));
  const mark = findMark(id);
  if (mark) mark.classList.add("is-active");
  marginList.querySelectorAll(".note-item").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.id === id);
  });
}

function excerpt(text, max = 72) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function renderSidebar(focusId) {
  noteCount.textContent = String(annotations.length);
  marginList.replaceChildren();

  if (!annotations.length) {
    const empty = document.createElement("p");
    empty.className = "margin-empty";
    empty.textContent = "no highlights yet";
    marginList.appendChild(empty);
    return;
  }

  for (const item of annotations) {
    const article = document.createElement("article");
    article.className = "note-item" + (item.id === activeId ? " is-active" : "");
    article.dataset.id = item.id;

    const quoteBtn = document.createElement("button");
    quoteBtn.type = "button";
    quoteBtn.className = "note-quote";
    quoteBtn.dataset.action = "goto";
    quoteBtn.textContent = excerpt(item.quote);

    const input = document.createElement("textarea");
    input.className = "note-input";
    input.rows = 2;
    input.placeholder = "note…";
    input.setAttribute("aria-label", "Note for highlight");
    input.value = item.note || "";

    const meta = document.createElement("div");
    meta.className = "note-meta";
    const status = document.createElement("span");
    status.textContent = item.note?.trim() ? "saved" : "—";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "note-del";
    del.dataset.action = "delete";
    del.textContent = "×";
    meta.append(status, del);

    article.append(quoteBtn, input, meta);
    marginList.appendChild(article);
  }

  if (focusId) {
    const item = marginList.querySelector(`.note-item[data-id="${CSS.escape(focusId)}"]`);
    const input = item?.querySelector(".note-input");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

function removeAnnotation(id) {
  const mark = findMark(id);
  if (mark) unwrapMark(mark);
  annotations = annotations.filter((a) => a.id !== id);
  saveAnnotations(annotations);
  if (activeId === id) activeId = null;
  renderSidebar();
}

function restoreByQuote(item) {
  const walker = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const idx = text.indexOf(item.quote);
    if (idx === -1) continue;
    const range = document.createRange();
    range.setStart(node, idx);
    range.setEnd(node, idx + item.quote.length);
    try {
      wrapRange(range, item.id);
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

function restoreHighlights() {
  const sorted = [...annotations].sort((a, b) => pathRank(b.range) - pathRank(a.range));
  for (const item of sorted) {
    if (findMark(item.id)) continue;
    const range = deserializeRange(item.range);
    if (range) {
      try {
        wrapRange(range, item.id);
        continue;
      } catch {
        /* fall through to quote search */
      }
    }
    restoreByQuote(item);
  }
}

function bootAnnotations() {
  restoreHighlights();
  renderSidebar();
}

function createHighlightFromSelection() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  if (!paper.contains(range.commonAncestorContainer)) return null;
  const quote = sel.toString().trim();
  if (!quote) return null;

  const serial = serializeRange(range);
  if (!serial) {
    showToast("selection too complex");
    return null;
  }

  const duplicate = annotations.find((a) => a.quote === quote && JSON.stringify(a.range) === JSON.stringify(serial));
  if (duplicate) {
    scrollToHighlight(duplicate.id);
    showToast("already highlighted");
    return duplicate;
  }

  const id = crypto.randomUUID?.() ?? `hl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  try {
    wrapRange(range.cloneRange(), id);
  } catch {
    showToast("selection too complex");
    return null;
  }

  sel.removeAllRanges();
  const entry = {
    id,
    quote,
    note: "",
    range: serial,
    createdAt: new Date().toISOString(),
  };
  annotations.push(entry);
  saveAnnotations(annotations);
  renderSidebar(id);
  setActiveHighlight(id);
  showToast("hl");
  return entry;
}

marginList.addEventListener("input", (e) => {
  const input = e.target.closest(".note-input");
  if (!input) return;
  const item = input.closest(".note-item");
  const id = item?.dataset.id;
  if (!id) return;
  const ann = annotations.find((a) => a.id === id);
  if (!ann) return;
  ann.note = input.value;
  saveAnnotations(annotations);
  const meta = item.querySelector(".note-meta span");
  if (meta) meta.textContent = ann.note.trim() ? "saved" : "—";
});

marginList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const item = btn.closest(".note-item");
  const id = item?.dataset.id;
  if (!id) return;
  if (btn.dataset.action === "goto") scrollToHighlight(id);
  if (btn.dataset.action === "delete") {
    removeAnnotation(id);
    showToast("removed");
  }
});

function positionPopover(sel) {
  if (!sel.rangeCount) return;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  if (!rect || rect.width === 0) return;
  pop.style.left = `${rect.left + window.scrollX}px`;
  pop.style.top = `${rect.top + window.scrollY - 36}px`;
  pop.style.display = "block";
}

document.addEventListener("selectionchange", () => {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) {
    pop.style.display = "none";
    return;
  }
  if (!paper.contains(sel.anchorNode)) {
    pop.style.display = "none";
    return;
  }
  positionPopover(sel);
});

$("#copyQuote")?.addEventListener("click", async () => {
  const txt = window.getSelection().toString().trim();
  if (!txt) return;
  await navigator.clipboard.writeText(`“${txt}” — The Shape of Inquiry`);
  showToast("copied");
  pop.style.display = "none";
});

$("#highlightSel")?.addEventListener("click", () => {
  createHighlightFromSelection();
  pop.style.display = "none";
});

paper.addEventListener("click", (e) => {
  const mark = e.target.closest("mark.highlighted");
  if (!mark?.dataset.id) return;
  setActiveHighlight(mark.dataset.id);
  const input = marginList.querySelector(`.note-item[data-id="${CSS.escape(mark.dataset.id)}"] .note-input`);
  input?.focus();
});

if (window.MathJax?.startup?.promise) {
  window.MathJax.startup.promise.then(bootAnnotations);
} else {
  bootAnnotations();
}
