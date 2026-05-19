# The Shape of Inquiry

This repo is TSX-first. The manuscript metadata, prose body, and typed figure references live in `src/paper/source.tsx`; the figures are React-rendered SVG components in `src/paper/figures.tsx`.

LaTeX and static web files are generated artifacts.

## Install

```bash
npm install
```

## Build Everything

```bash
make
```

This writes:

```text
the_shape_of_inquiry.pdf
web/index.html
web/style.css
web/site.js
web/assets/
build/the_shape_of_inquiry.tex
build/figures/*.svg
build/figures/*.png
```

## Build Targets

```bash
make pdf       # alias for the TSX build, including generated PDF
make web       # alias for the TSX build, including generated web output
make typecheck # TypeScript check only
make clean
```

The web target uses generated LaTeX body text through Pandoc for math-heavy prose, then injects the TSX-authored SVG figures into the custom researcher-style shell. It remains mobile-readable and includes responsive typography, sticky/mobile contents, section-link sharing, theme toggle, local highlights, and quote-copy.

## Layout

```text
src/paper/          TSX source of truth for manuscript + SVG figures
src/web/templates/  static web shell assets copied into web/
public/images/      source raster imagery used by SVG figures
scripts/build.tsx   TSX build pipeline for PDF and web
short/              Remotion video package
```

## Dependencies

Required:

```bash
npm
node
pandoc
latexmk
pdflatex
convert
```

`convert` is ImageMagick and is used only to rasterize generated SVGs for the LaTeX PDF pass. The canonical figure assets remain SVGs.
