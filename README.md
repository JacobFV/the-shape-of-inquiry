# The Shape of Inquiry

## Build PDF

```bash
make tex2pdf
```

This writes `the_shape_of_inquiry.pdf`.

## Build static web version

```bash
make tex2web
```

This writes `web/index.html` and page images under `web/pages/`.

The `tex2web` target renders the compiled PDF to static page images, preserving the exact LaTeX layout and TikZ figures for static hosting.
