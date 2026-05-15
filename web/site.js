
const $ = (sel) => document.querySelector(sel);
const toast = $("#toast");
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
    showToast("section link copied");
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
    showToast("page link copied");
  }
});

$("#mobileToc")?.addEventListener("click", () => {
  const toc = $("#tocPanel");
  toc.classList.toggle("open");
  if (toc.classList.contains("open")) toc.scrollIntoView({ behavior: "smooth", block: "start" });
});

const pop = $("#selectionPopover");
function positionPopover(sel) {
  if (!sel.rangeCount) return;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  if (!rect || rect.width === 0) return;
  pop.style.left = `${rect.left + window.scrollX}px`;
  pop.style.top = `${rect.top + window.scrollY - 44}px`;
  pop.style.display = "flex";
}
document.addEventListener("selectionchange", () => {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) {
    pop.style.display = "none";
    return;
  }
  positionPopover(sel);
});
$("#copyQuote")?.addEventListener("click", async () => {
  const txt = window.getSelection().toString().trim();
  if (!txt) return;
  await navigator.clipboard.writeText(`“${txt}” — The Shape of Inquiry`);
  showToast("quote copied");
  pop.style.display = "none";
});
$("#highlightSel")?.addEventListener("click", () => {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  try {
    const range = sel.getRangeAt(0);
    const mark = document.createElement("mark");
    mark.className = "highlighted";
    range.surroundContents(mark);
    sel.removeAllRanges();
    showToast("highlighted");
  } catch (err) {
    showToast("highlight selection too complex");
  }
  pop.style.display = "none";
});
