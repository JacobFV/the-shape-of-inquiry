#!/usr/bin/env python3
import argparse
import html
import re
import shutil
import subprocess
from pathlib import Path

FIGURE_MAP = {
    "fig:real-work": "figure-1.png",
    "fig:objective-shaping": "figure-2.png",
    "fig:event-agent": "figure-3.png",
    "fig:lab-scene": "figure-4.png",
}

FIGURE_TITLES = {
    "fig:real-work": "The real work behind work",
    "fig:objective-shaping": "Objective shaping in the space of inquiry",
    "fig:event-agent": "Event-sourced embodied scientific agent",
    "fig:lab-scene": "Compact autonomous chemistry workspace",
}

def strip_outer(tex: str) -> str:
    if "\\begin{document}" in tex:
        tex = tex.split("\\begin{document}", 1)[1]
    if "\\end{document}" in tex:
        tex = tex.rsplit("\\end{document}", 1)[0]
    tex = re.sub(r"\\begin\{titlepage\}.*?\\end\{titlepage\}", "", tex, flags=re.S)
    return tex

def extract_caption(block: str) -> str:
    m = re.search(r"\\caption\{(.*?)\}\s*\\label", block, flags=re.S)
    if not m:
        return ""
    cap = re.sub(r"\s+", " ", m.group(1)).strip()
    cap = cap.replace(r"\textbf", "").replace("{", "").replace("}", "")
    return cap

def preprocess(tex: str):
    tex = strip_outer(tex)
    captions = {}

    def repl_figure(m):
        block = m.group(0)
        lm = re.search(r"\\label\{([^}]+)\}", block)
        label = lm.group(1) if lm else f"fig:unknown-{len(captions)+1}"
        captions[label] = extract_caption(block)
        marker = f"FIGUREMARKER_{label.replace(':','_').replace('-','_')}"
        return "\n\n" + marker + "\n\n"

    tex = re.sub(r"\\begin\{figure\}\[H\].*?\\end\{figure\}", repl_figure, tex, flags=re.S)

    for env, title in [("claimbox", "Claim"), ("warnbox", "Warning"), ("falsifybox", "Falsification")]:
        tex = re.sub(rf"\\begin\{{{env}\}}(?:\[[^\]]*\])?", rf"\\begin{{quote}}\n\\textbf{{{title}.}} ", tex)
        tex = re.sub(rf"\\end\{{{env}\}}", r"\\end{quote}", tex)

    tex = tex.replace(r"\begin{lstlisting}", r"\begin{verbatim}")
    tex = tex.replace(r"\end{lstlisting}", r"\end{verbatim}")
    return tex, captions

def run_pandoc(preprocessed: Path, article_out: Path):
    cmd = ["pandoc", str(preprocessed), "-f", "latex", "-t", "html5", "--mathjax", "--wrap=none", "-o", str(article_out)]
    subprocess.run(cmd, check=True)

def slugify(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = re.sub(r"[^\w\s-]", "", s.lower())
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    return s or "section"

def inject_figures(article: str, captions: dict) -> str:
    for label, filename in FIGURE_MAP.items():
        marker = f"FIGUREMARKER_{label.replace(':','_').replace('-','_')}"
        cap = html.escape(captions.get(label, ""))
        title = html.escape(FIGURE_TITLES.get(label, label))
        figure_html = f'''
<figure class="paper-figure" id="{html.escape(label)}">
  <div class="figure-shell">
    <img src="assets/figures/{filename}" alt="{title}">
  </div>
  <figcaption><strong>{title}.</strong> {cap}</figcaption>
</figure>
'''
        article = article.replace(f"<p>{marker}</p>", figure_html)
        article = article.replace(marker, figure_html)
    return article

def add_heading_anchors(article: str):
    used = {}
    toc = []

    def repl(m):
        level = int(m.group(1))
        attrs = m.group(2) or ""
        inner = m.group(3)
        plain = re.sub(r"<[^>]+>", "", inner).strip()
        slug = slugify(plain)
        n = used.get(slug, 0)
        used[slug] = n + 1
        if n:
            slug = f"{slug}-{n+1}"
        toc.append((level, slug, plain))
        return f'<h{level} id="{slug}"{attrs}>{inner}<button class="copy-anchor" data-anchor="{slug}" aria-label="Copy link to {html.escape(plain)}">#</button></h{level}>'

    article = re.sub(r"<h([1-3])([^>]*)>(.*?)</h\1>", repl, article, flags=re.S)
    return article, toc

def build_toc(toc):
    return "\n".join(
        f'<a class="toc-l{level}" href="#{slug}">{html.escape(title)}</a>'
        for level, slug, title in toc
    )

CSS = r'''
:root {
  --ink: #15171a; --muted: #5c6670; --paper: #fbfaf6; --paper2: #f4f1e8;
  --line: #d8d2c2; --blue: #2f5d9c; --green: #2f7d4a; --amber: #996a21;
  --red: #9c2f2f; --purple: #6b4ca3; --shadow: 0 18px 55px rgba(26,25,22,.10);
  --measure: 760px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; color: var(--ink);
  background:
    radial-gradient(circle at 14px 20px, rgba(21,23,26,.045) 0 1px, transparent 1.2px),
    radial-gradient(circle at 43px 66px, rgba(21,23,26,.03) 0 1px, transparent 1.2px),
    linear-gradient(180deg, var(--paper), var(--paper2));
  background-size: 74px 74px, 98px 98px, auto;
  font-family: ui-serif, Georgia, "Iowan Old Style", "Times New Roman", serif;
  line-height: 1.62;
}
body.dark {
  --ink: #ede8da; --muted: #b6ad9d; --paper: #111111; --paper2: #1a1814;
  --line: #3a342b; --shadow: 0 18px 55px rgba(0,0,0,.45);
}
a { color: var(--blue); text-decoration-thickness: 1px; text-underline-offset: .18em; }
.topbar {
  position: sticky; top: 0; z-index: 10; display: flex; align-items: center;
  justify-content: space-between; gap: 1rem; padding: .8rem clamp(1rem,3vw,2rem);
  border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--paper) 90%, transparent);
  backdrop-filter: blur(10px);
}
.brand { display: flex; flex-direction: column; }
.brand strong { font-size: .98rem; letter-spacing: .01em; }
.brand span { color: var(--muted); font-size: .78rem; }
.controls { display: flex; gap: .45rem; flex-wrap: wrap; justify-content: flex-end; }
button, .button {
  border: 1px solid var(--line); background: color-mix(in srgb, var(--paper) 92%, white 8%);
  color: var(--ink); border-radius: 999px; padding: .42rem .72rem;
  font: 600 .78rem ui-sans-serif, system-ui, sans-serif; cursor: pointer; text-decoration: none;
}
button:hover, .button:hover { border-color: var(--blue); }
.progress {
  position: fixed; top: 0; left: 0; height: 3px; width: 0;
  background: linear-gradient(90deg, var(--blue), var(--green), var(--amber)); z-index: 30;
}
.layout {
  display: grid; grid-template-columns: minmax(180px,270px) minmax(0,var(--measure)) minmax(0,210px);
  gap: clamp(1rem,2.2vw,2rem); max-width: 1280px; margin: 0 auto; padding: clamp(1rem,3vw,2.2rem);
}
.toc {
  position: sticky; top: 5.2rem; align-self: start; max-height: calc(100vh - 6rem);
  overflow: auto; border-right: 1px solid var(--line); padding-right: 1rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.toc-title { margin: 0 0 .55rem; color: var(--muted); text-transform: uppercase; letter-spacing: .09em; font-size: .72rem; font-weight: 800; }
.toc a { display: block; padding: .18rem 0; color: var(--muted); text-decoration: none; font-size: .82rem; line-height: 1.35; }
.toc a:hover { color: var(--ink); }
.toc-l2 { padding-left: .8rem !important; }
.toc-l3 { padding-left: 1.6rem !important; font-size: .76rem !important; }
.paper {
  max-width: var(--measure); min-width: 0; background: color-mix(in srgb, var(--paper) 96%, white 4%);
  border: 1px solid var(--line); box-shadow: var(--shadow); padding: clamp(1.1rem,3vw,2.2rem);
}
.hero { border-bottom: 1px solid var(--line); margin-bottom: 1.8rem; padding-bottom: 1.3rem; }
.hero h1 { font-size: clamp(2rem,8vw,4.25rem); line-height: .96; margin: 0 0 .4rem; letter-spacing: -.055em; }
.hero p { margin: .1rem 0; color: var(--muted); }
.meta { font-family: ui-sans-serif, system-ui, sans-serif; font-size: .85rem; }
.paper h1, .paper h2, .paper h3 { line-height: 1.12; scroll-margin-top: 5.5rem; letter-spacing: -.025em; }
.paper h1 { margin: 2.1rem 0 .9rem; font-size: clamp(1.7rem,6vw,2.6rem); }
.paper h2 { margin: 1.7rem 0 .7rem; font-size: clamp(1.35rem,4vw,1.8rem); }
.paper h3 { margin: 1.3rem 0 .5rem; font-size: clamp(1.1rem,3vw,1.35rem); }
.copy-anchor { margin-left: .35rem; border: none; background: transparent; color: var(--muted); padding: .05rem .2rem; opacity: 0; }
h1:hover .copy-anchor, h2:hover .copy-anchor, h3:hover .copy-anchor { opacity: 1; }
p { margin: .84rem 0; }
blockquote { border-left: 3px solid var(--blue); margin: 1.25rem 0; padding: .65rem 1rem; background: color-mix(in srgb, var(--paper2) 65%, transparent); }
pre { overflow-x: auto; border: 1px solid var(--line); padding: .9rem; background: color-mix(in srgb, var(--paper2) 80%, transparent); border-radius: 10px; font-size: .82rem; }
mjx-container[jax="CHTML"][display="true"] { overflow-x: auto; overflow-y: hidden; padding: .5rem 0; }
.paper table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; margin: 1rem 0; font-size: .9rem; }
.paper th, .paper td { border-bottom: 1px solid var(--line); padding: .55rem .65rem; vertical-align: top; }
.paper th { text-align: left; font-family: ui-sans-serif, system-ui, sans-serif; }
.paper-figure { margin: 1.6rem 0; }
.figure-shell { border: 1px solid var(--line); background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.08); padding: .3rem; overflow-x: auto; }
.paper-figure img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
figcaption { margin-top: .62rem; color: var(--muted); font-size: .88rem; line-height: 1.45; }
.margin { position: sticky; top: 5.2rem; align-self: start; font-family: ui-sans-serif, system-ui, sans-serif; color: var(--muted); font-size: .82rem; }
.note-card { border: 1px solid var(--line); border-radius: 14px; padding: .9rem; background: color-mix(in srgb, var(--paper) 94%, white 6%); margin-bottom: .8rem; }
.highlighted { background: linear-gradient(transparent 50%, rgba(255,216,104,.55) 50%); border-radius: 2px; }
.popover { position: absolute; display: none; gap: .35rem; z-index: 40; background: var(--ink); color: var(--paper); border-radius: 999px; padding: .3rem; box-shadow: var(--shadow); }
.popover button { color: var(--paper); background: transparent; border-color: color-mix(in srgb, var(--paper) 30%, transparent); }
.toast { position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--paper); border-radius: 999px; padding: .6rem .9rem; font: 700 .82rem ui-sans-serif, system-ui, sans-serif; opacity: 0; pointer-events: none; transition: opacity 160ms ease; z-index: 50; }
.toast.show { opacity: 1; }
.mobile-toc-toggle { display: none; }
@media (max-width: 960px) {
  .layout { display: block; padding: .7rem; }
  .paper { padding: clamp(1rem,5vw,1.45rem); border-radius: 14px; }
  .toc, .margin { display: none; }
  .toc.open { display: block; position: static; max-height: none; border-right: 0; border-bottom: 1px solid var(--line); margin-bottom: .7rem; padding: .8rem; background: color-mix(in srgb, var(--paper) 94%, white 6%); border-radius: 12px; }
  .mobile-toc-toggle { display: inline-flex; }
  .topbar { align-items: flex-start; }
}
'''

JS = r'''
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
'''

MATHJAX = r'''
<script>
window.MathJax = {
  tex: {
    inlineMath: [['\\(','\\)'], ['$', '$']],
    displayMath: [['\\[','\\]'], ['$$','$$']],
    macros: {
      V: "\\mathcal{V}", E: "\\mathcal{E}", A: "\\mathcal{A}", R: "\\mathcal{R}",
      GCS: "\\mathrm{GCS}", GL: "\\mathrm{GL}", IG: "\\mathrm{IG}", MI: "\\mathrm{I}",
      Ent: "\\mathrm{H}", KL: "\\mathrm{KL}", MDL: "\\mathrm{MDL}",
      Safe: "\\mathrm{Safe}", Cosplay: "\\mathrm{Cosplay}", Risk: "\\mathrm{Risk}",
      Cost: "\\mathrm{Cost}", Goodhart: "\\mathrm{Goodhart}"
    }
  }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
'''

def write_site(article: str, toc_html: str, out: Path):
    out.mkdir(parents=True, exist_ok=True)
    (out / "fragments").mkdir(exist_ok=True)
    (out / "fragments" / "toc.html").write_text(toc_html)
    (out / "style.css").write_text(CSS)
    (out / "site.js").write_text(JS)
    index = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>The Shape of Inquiry</title>
  <meta name="description" content="The Real Work Behind Work: an event-sourced account of autonomous scientific agency.">
  <script defer src="https://unpkg.com/htmx.org@2.0.4"></script>
  {MATHJAX}
  <link rel="stylesheet" href="style.css">
</head>
<body hx-boost="true">
  <div class="progress" id="progress"></div>
  <header class="topbar">
    <div class="brand">
      <strong>The Shape of Inquiry</strong>
      <span>The Real Work Behind Work</span>
    </div>
    <div class="controls">
      <button class="mobile-toc-toggle" id="mobileToc">contents</button>
      <button id="themeToggle">theme</button>
      <button id="sharePage">share</button>
      <a class="button" href="the_shape_of_inquiry.pdf">pdf</a>
    </div>
  </header>
  <div class="layout">
    <nav class="toc" id="tocPanel" aria-label="Table of contents">
      <p class="toc-title">contents</p>
      <div hx-get="fragments/toc.html" hx-trigger="load" hx-swap="innerHTML">
        {toc_html}
      </div>
    </nav>
    <main class="paper" id="paper">
      <section class="hero">
        <h1>The Shape of Inquiry</h1>
        <p class="meta">The Real Work Behind Work · Jacob · Working Draft, May 2026</p>
        <p>A preliminary theoretical and experimental specification of scientific agency as measurement construction.</p>
      </section>
      {article}
    </main>
    <aside class="margin">
      <div class="note-card"><strong>Reader tools.</strong><br>Select text to highlight or copy a quote. Use section hashes for direct sharing.</div>
      <div class="note-card"><strong>Mobile.</strong><br>The layout collapses into a readable column; math and tables scroll horizontally.</div>
      <div class="note-card"><strong>Build.</strong><br>This site is generated from <code>main.tex</code> by <code>make tex2web</code>.</div>
    </aside>
  </div>
  <div class="popover" id="selectionPopover">
    <button id="highlightSel">highlight</button>
    <button id="copyQuote">copy quote</button>
  </div>
  <div class="toast" id="toast"></div>
  <script src="site.js"></script>
</body>
</html>'''
    (out / "index.html").write_text(index)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tex")
    ap.add_argument("pdf")
    ap.add_argument("out")
    args = ap.parse_args()

    tex_path = Path(args.tex)
    pdf_path = Path(args.pdf)
    out = Path(args.out)
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    (out / "assets" / "figures").mkdir(parents=True)
    if pdf_path.exists():
        shutil.copy2(pdf_path, out / "the_shape_of_inquiry.pdf")
    if Path("assets").exists():
        shutil.copytree("assets", out / "assets", dirs_exist_ok=True)

    pre, captions = preprocess(tex_path.read_text())
    pre_path = out / "_paper_preprocessed.tex"
    article_path = out / "_article.html"
    pre_path.write_text(pre)
    run_pandoc(pre_path, article_path)
    article = article_path.read_text()
    article = inject_figures(article, captions)
    article, toc = add_heading_anchors(article)
    write_site(article, build_toc(toc), out)
    pre_path.unlink(missing_ok=True)
    article_path.unlink(missing_ok=True)

if __name__ == "__main__":
    main()
