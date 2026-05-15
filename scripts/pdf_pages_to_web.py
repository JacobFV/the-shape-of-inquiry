#!/usr/bin/env python3
from pathlib import Path

WEB = Path("web")
pages = sorted((WEB / "pages").glob("page-*.png"))

html = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>The Shape of Inquiry</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      background: #f3f4f5;
      color: #15171a;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 0.9rem 1.1rem;
      background: rgba(255,255,255,0.92);
      border-bottom: 1px solid #ddd;
      backdrop-filter: blur(8px);
    }
    header h1 { margin: 0; font-size: 1.05rem; }
    header p { margin: 0.15rem 0 0; color: #5c6670; font-size: 0.85rem; }
    main { max-width: 980px; margin: 1rem auto 3rem; padding: 0 1rem; }
    .page {
      display: block;
      width: 100%;
      height: auto;
      margin: 0 auto 1.25rem;
      background: white;
      box-shadow: 0 8px 30px rgba(0,0,0,0.10);
      border-radius: 2px;
    }
  </style>
</head>
<body>
<header>
  <h1>The Shape of Inquiry</h1>
  <p>Static web rendering generated from the LaTeX/PDF source.</p>
</header>
<main>
"""

for p in pages:
    html += f'  <img class="page" src="pages/{p.name}" alt="{p.stem}">\n'

html += """</main>
</body>
</html>
"""

(WEB / "index.html").write_text(html)
print(f"wrote web/index.html with {len(pages)} pages")
