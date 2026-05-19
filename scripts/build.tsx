#!/usr/bin/env tsx
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';
import {renderToStaticMarkup} from 'react-dom/server';
import {figures} from '../src/paper/figures';
import {figureLatex, paper, type PaperFigureId} from '../src/paper/source';

const root = process.cwd();
const buildDir = path.join(root, 'build');
const figureBuildDir = path.join(buildDir, 'figures');
const webDir = path.join(root, 'web');
const publicDir = path.join(root, 'public');
const templateDir = path.join(root, 'src', 'web', 'templates');
const labImage = path.join(publicDir, 'images', 'robot_lab_scene.png');

const figureIds = Object.keys(figures) as PaperFigureId[];

function ensureDir(dir: string) {
  mkdirSync(dir, {recursive: true});
}

function copyDir(src: string, dest: string) {
  if (!existsSync(src)) return;
  ensureDir(dest);
  for (const entry of readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function run(command: string, args: string[]) {
  execFileSync(command, args, {stdio: 'inherit'});
}

function slugify(value: string) {
  return (
    value
      .replace(/<[^>]+>/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}

function htmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function latexEscapeCaption(value: string) {
  return value.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/#/g, '\\#');
}

function renderFigures({skipPng = false}: {skipPng?: boolean} = {}) {
  const imageHref = `data:image/png;base64,${readFileSync(labImage).toString('base64')}`;
  ensureDir(figureBuildDir);
  ensureDir(path.join(webDir, 'assets', 'figures'));

  for (const id of figureIds) {
    const spec = figures[id];
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${renderToStaticMarkup(<spec.component imageHref={imageHref} />)}\n`;
    const webSvg = `<?xml version="1.0" encoding="UTF-8"?>\n${renderToStaticMarkup(
      <spec.component imageHref="../images/robot_lab_scene.png" />,
    )}\n`;
    const svgPath = path.join(figureBuildDir, spec.file);
    const webPath = path.join(webDir, 'assets', 'figures', spec.file);
    writeFileSync(svgPath, svg);
    writeFileSync(webPath, webSvg);

    if (skipPng) continue;
    const pngPath = svgPath.replace(/\.svg$/, '.png');
    run('convert', [
      '-background',
      'white',
      '-alpha',
      'remove',
      '-alpha',
      'off',
      '-density',
      '144',
      svgPath,
      '-resize',
      '1800x1800>',
      '-depth',
      '8',
      '-strip',
      pngPath,
    ]);
  }
}

function renderLatexFigure(id: PaperFigureId) {
  const spec = figures[id];
  const latex = figureLatex[id];
  const pngPath = path.join('build', 'figures', spec.file.replace(/\.svg$/, '.png'));
  return String.raw`
\begin{figure}${latex.placement}
\centering
\includegraphics[width=${latex.width}]{${pngPath}}
\caption{${latexEscapeCaption(`${spec.title}. ${spec.caption}`)}}
\label{${spec.label}}
\end{figure}
`;
}

function renderLatexBody() {
  return paper.body.replace(/\\PaperFigure\{([^}]+)\}/g, (_match, rawId: string) => {
    const id = rawId as PaperFigureId;
    if (!figures[id]) {
      throw new Error(`Unknown figure id: ${rawId}`);
    }
    return renderLatexFigure(id);
  });
}

function renderLatexDocument() {
  return String.raw`\documentclass[11pt]{article}

\usepackage[margin=1in]{geometry}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{libertinus}
\usepackage{microtype}
\usepackage{amsmath,amssymb,amsfonts,mathtools}
\usepackage{graphicx}
\usepackage{float}
\usepackage{xcolor}
\usepackage{booktabs}
\usepackage{array}
\usepackage{longtable}
\usepackage{enumitem}
\usepackage[most]{tcolorbox}
\usepackage{hyperref}
\usepackage{listings}
\usepackage{titlesec}
\usepackage{fancyhdr}
\usepackage{natbib}
\usepackage{caption}

\definecolor{ink}{HTML}{15171A}
\definecolor{muted}{HTML}{5C6670}
\definecolor{softblue}{HTML}{EAF2FF}
\definecolor{blue}{HTML}{2F5D9C}
\definecolor{softgreen}{HTML}{ECF7EF}
\definecolor{green}{HTML}{2F7D4A}
\definecolor{softamber}{HTML}{FFF5E5}
\definecolor{amber}{HTML}{996A21}
\definecolor{softred}{HTML}{FFF0F0}
\definecolor{red}{HTML}{9C2F2F}
\definecolor{softgray}{HTML}{F6F7F8}

\hypersetup{
  colorlinks=true,
  linkcolor=blue,
  citecolor=blue,
  urlcolor=blue,
  pdftitle={${paper.title}},
  pdfauthor={${paper.author}}
}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0.74em}
\setlist[itemize]{leftmargin=1.2em, itemsep=0.13em, topsep=0.1em}
\setlist[enumerate]{leftmargin=1.45em, itemsep=0.16em, topsep=0.1em}
\renewcommand{\baselinestretch}{1.035}
\captionsetup{font=small, labelfont=bf}

\titleformat{\section}{\Large\bfseries\color{ink}}{\thesection}{0.55em}{}
\titleformat{\subsection}{\large\bfseries\color{ink}}{\thesubsection}{0.55em}{}
\titleformat{\subsubsection}{\normalsize\bfseries\color{ink}}{\thesubsubsection}{0.55em}{}
\titlespacing*{\section}{0pt}{1.55em}{0.45em}
\titlespacing*{\subsection}{0pt}{1.05em}{0.28em}
\titlespacing*{\subsubsection}{0pt}{0.75em}{0.20em}

\pagestyle{fancy}
\fancyhf{}
\lhead{\small\color{muted}${paper.title}}
\rhead{\small\color{muted}Working Draft}
\cfoot{\small\thepage}
\renewcommand{\headrulewidth}{0.3pt}

\newtcolorbox{claimbox}[1][]{enhanced, breakable, colback=softblue, colframe=blue!55!black, boxrule=0.45pt, arc=2mm, left=2.5mm, right=2.5mm, top=1.8mm, bottom=1.8mm, #1}
\newtcolorbox{methodbox}[1][]{enhanced, breakable, colback=softgreen, colframe=green!60!black, boxrule=0.45pt, arc=2mm, left=2.5mm, right=2.5mm, top=1.8mm, bottom=1.8mm, #1}
\newtcolorbox{warnbox}[1][]{enhanced, breakable, colback=softamber, colframe=amber!70!black, boxrule=0.45pt, arc=2mm, left=2.5mm, right=2.5mm, top=1.8mm, bottom=1.8mm, #1}
\newtcolorbox{falsifybox}[1][]{enhanced, breakable, colback=softred, colframe=red!65!black, boxrule=0.45pt, arc=2mm, left=2.5mm, right=2.5mm, top=1.8mm, bottom=1.8mm, #1}

\lstdefinestyle{paper}{
  basicstyle=\ttfamily\small,
  backgroundcolor=\color{softgray},
  frame=single,
  rulecolor=\color{muted!40},
  xleftmargin=0.8em,
  xrightmargin=0.8em,
  aboveskip=0.8em,
  belowskip=0.8em,
  columns=fullflexible,
  breaklines=true,
  showstringspaces=false
}
\lstset{style=paper}

\newcommand{\V}{\mathcal{V}}
\newcommand{\E}{\mathcal{E}}
\newcommand{\A}{\mathcal{A}}
\newcommand{\Sset}{\mathcal{S}}
\newcommand{\M}{\mathcal{M}}
\newcommand{\R}{\mathcal{R}}
\newcommand{\GL}{\mathrm{GL}}
\newcommand{\IG}{\mathrm{IG}}
\newcommand{\MI}{\mathrm{I}}
\newcommand{\Ent}{\mathrm{H}}
\newcommand{\KL}{\mathrm{KL}}
\newcommand{\MDL}{\mathrm{MDL}}
\newcommand{\rankeff}{\mathrm{rank}_{\mathrm{eff}}}
\newcommand{\Safe}{\mathrm{Safe}}
\newcommand{\Cosplay}{\mathrm{Cosplay}}
\newcommand{\Risk}{\mathrm{Risk}}
\newcommand{\Cost}{\mathrm{Cost}}
\newcommand{\Goodhart}{\mathrm{Goodhart}}

\begin{document}

\pagenumbering{gobble}
\begin{titlepage}
\centering
\vspace*{0.60in}
{\Huge\bfseries ${paper.title}\par}
\vspace{0.20in}
{\Large ${paper.subtitle}\par}
\vspace{0.38in}
{\large ${paper.author}\par}
{\small ${paper.draft}\par}
\vfill
\begin{minipage}{0.80\textwidth}
\small
\textit{A preliminary theoretical and experimental specification. Completed robotic chemistry results are not reported here. The operative claim is narrow: scientific agency becomes measurable when measurement construction, calibration, and event-grounded inquiry enter the objective rather than remaining hidden human preconditions.}
\end{minipage}
\vfill
\end{titlepage}
\clearpage
\pagenumbering{arabic}

${renderLatexBody()}

\end{document}
`;
}

function preprocessForPandoc() {
  let tex = paper.body.replace(/\\PaperFigure\{([^}]+)\}/g, (_match, id) => `\n\nFIGUREMARKER_${id}\n\n`);

  for (const [env, title] of [
    ['claimbox', 'Claim'],
    ['warnbox', 'Warning'],
    ['falsifybox', 'Falsification'],
    ['methodbox', 'Method'],
  ]) {
    tex = tex.replace(new RegExp(String.raw`\\begin\{${env}\}(?:\[[^\]]*\])?`, 'g'), String.raw`\begin{quote}` + `\n` + String.raw`\textbf{${title}.} `);
    tex = tex.replace(new RegExp(String.raw`\\end\{${env}\}`, 'g'), String.raw`\end{quote}`);
  }

  return tex.replace(/\\begin\{lstlisting\}/g, String.raw`\begin{verbatim}`).replace(/\\end\{lstlisting\}/g, String.raw`\end{verbatim}`);
}

function injectFigures(article: string) {
  let next = article;
  for (const id of figureIds) {
    const spec = figures[id];
    const marker = `FIGUREMARKER_${id}`;
    const figureHtml = `
<figure class="paper-figure" id="${htmlEscape(spec.label)}">
  <div class="figure-shell">
    <img src="assets/figures/${htmlEscape(spec.file)}" alt="${htmlEscape(spec.title)}">
  </div>
  <figcaption><strong>${htmlEscape(spec.title)}.</strong> ${htmlEscape(spec.caption)}</figcaption>
</figure>
`;
    next = next.replace(new RegExp(`<p>${marker}</p>`, 'g'), figureHtml);
    next = next.replace(new RegExp(marker, 'g'), figureHtml);
  }
  return next;
}

function addHeadingAnchors(article: string) {
  const used = new Map<string, number>();
  const toc: Array<{level: number; slug: string; title: string}> = [];
  const next = article.replace(/<h([1-3])([^>]*)>(.*?)<\/h\1>/gs, (_match, levelRaw, attrs = '', inner) => {
    const level = Number(levelRaw);
    const title = inner.replace(/<[^>]+>/g, '').trim();
    const baseSlug = slugify(title);
    const count = used.get(baseSlug) ?? 0;
    used.set(baseSlug, count + 1);
    const slug = count ? `${baseSlug}-${count + 1}` : baseSlug;
    toc.push({level, slug, title});
    return `<h${level} id="${slug}"${attrs}>${inner}<button class="copy-anchor" data-anchor="${slug}" aria-label="Copy link to ${htmlEscape(title)}">#</button></h${level}>`;
  });
  return {article: next, toc};
}

function buildToc(toc: Array<{level: number; slug: string; title: string}>) {
  return toc.map(({level, slug, title}) => `<a class="toc-l${level}" href="#${slug}">${htmlEscape(title)}</a>`).join('\n');
}

const mathjax = String.raw`
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
`;

function writeSite(article: string, tocHtml: string) {
  ensureDir(path.join(webDir, 'fragments'));
  copyDir(publicDir, path.join(webDir, 'assets'));
  writeFileSync(path.join(webDir, 'fragments', 'toc.html'), tocHtml);
  copyFileSync(path.join(templateDir, 'style.css'), path.join(webDir, 'style.css'));
  copyFileSync(path.join(templateDir, 'site.js'), path.join(webDir, 'site.js'));
  const pdfPath = path.join(root, 'the_shape_of_inquiry.pdf');
  if (existsSync(pdfPath)) {
    copyFileSync(pdfPath, path.join(webDir, 'the_shape_of_inquiry.pdf'));
  }

  const index = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlEscape(paper.title)}</title>
  <meta name="description" content="${htmlEscape(paper.description)}">
  <script defer src="https://unpkg.com/htmx.org@2.0.4"></script>
  ${mathjax}
  <link rel="stylesheet" href="style.css">
</head>
<body hx-boost="true">
  <div class="progress" id="progress"></div>
  <header class="topbar">
    <div class="brand">
      <strong>${htmlEscape(paper.title)}</strong>
      <span>${htmlEscape(paper.subtitle)}</span>
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
        ${tocHtml}
      </div>
    </nav>
    <main class="paper" id="paper">
      <section class="hero">
        <h1>${htmlEscape(paper.title)}</h1>
        <p class="meta">${htmlEscape(paper.subtitle)} · ${htmlEscape(paper.author)} · ${htmlEscape(paper.draft)}</p>
        <p>${htmlEscape(paper.description)}</p>
      </section>
      ${article}
    </main>
    <aside class="margin" aria-label="Notes">
      <div class="margin-head">
        <span class="margin-title">notes</span>
        <span class="margin-count" id="noteCount">0</span>
      </div>
      <p class="margin-hint">select text -> hl. notes persist locally.</p>
      <div class="margin-list" id="marginList"></div>
      <p class="margin-foot"><code>localstorage</code></p>
    </aside>
  </div>
  <div class="popover" id="selectionPopover">
    <button id="highlightSel">hl</button>
    <button id="copyQuote">copy</button>
  </div>
  <div class="toast" id="toast"></div>
  <script src="site.js"></script>
</body>
</html>`;
  writeFileSync(path.join(webDir, 'index.html'), index);
}

function buildWeb() {
  const preprocessed = path.join(buildDir, 'paper.preprocessed.tex');
  const articleOut = path.join(buildDir, 'article.html');
  writeFileSync(preprocessed, preprocessForPandoc());
  run('pandoc', [preprocessed, '-f', 'latex', '-t', 'html5', '--mathjax', '--wrap=none', '-o', articleOut]);
  const withFigures = injectFigures(readFileSync(articleOut, 'utf8'));
  const {article, toc} = addHeadingAnchors(withFigures);
  writeSite(article, buildToc(toc));
}

function buildPdf() {
  const texPath = path.join(buildDir, 'the_shape_of_inquiry.tex');
  writeFileSync(texPath, renderLatexDocument());
  run('latexmk', ['-pdf', '-interaction=nonstopmode', '-halt-on-error', '-outdir=build', '-jobname=the_shape_of_inquiry', texPath]);
  copyFileSync(path.join(buildDir, 'the_shape_of_inquiry.pdf'), path.join(root, 'the_shape_of_inquiry.pdf'));
}

export function build({skipPdf = false}: {skipPdf?: boolean} = {}) {
  rmSync(buildDir, {recursive: true, force: true});
  rmSync(webDir, {recursive: true, force: true});
  ensureDir(buildDir);
  ensureDir(webDir);
  renderFigures({skipPng: skipPdf});
  if (!skipPdf) buildPdf();
  buildWeb();
}

// Run directly only when invoked as a script (not when imported).
if (import.meta.url === `file://${process.argv[1]}`) {
  const skipPdf = process.argv.includes('--skip-pdf');
  build({skipPdf});
}
