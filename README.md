# The Shape of Inquiry

This package contains the LaTeX source, figure assets, and a Makefile for PDF and static web builds.

## Build PDF

```bash
make tex2pdf
```

This writes:

```text
the_shape_of_inquiry.pdf
```

## Build researcher-styled web version

```bash
make tex2web
```

This writes:

```text
web/index.html
web/style.css
web/site.js
web/assets/
```

The web target uses the LaTeX source, Pandoc, MathJax, HTMX, and a custom researcher-style shell. It is mobile-readable and includes:

- responsive typography and layout
- sticky / mobile table of contents
- section-link sharing
- theme toggle
- text selection popover with highlight and quote-copy
- paper-speckle background
- figure assets preserved from the LaTeX/PDF build

## Dependencies

Required:

```bash
latexmk
pdflatex
pandoc
python3
```

No JavaScript bundler is required.
