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

TEMPLATE_DIR = Path(__file__).resolve().parent / "web_templates"


def load_template(name: str) -> str:
    return (TEMPLATE_DIR / name).read_text()

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
    (out / "style.css").write_text(load_template("style.css"))
    (out / "site.js").write_text(load_template("site.js"))
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
    <aside class="margin" aria-label="Notes">
      <p class="margin-line">select: hl / copy</p>
      <p class="margin-line">heading #: link</p>
      <p class="margin-line"><code>make tex2web</code></p>
    </aside>
  </div>
  <div class="popover" id="selectionPopover">
    <button id="highlightSel">hl</button>
    <button id="copyQuote">copy</button>
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
