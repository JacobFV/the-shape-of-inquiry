import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Figure primitives — shared building blocks for every figure component.
//
// Design constraints baked in here. Read before changing.
//
//   1. MONOCHROME. The aesthetic is strict black-on-white with ONE muted gray
//      (#666) for secondary text. Do NOT introduce additional fill swatches
//      or colored strokes for "hierarchy" — the user explicitly rejected
//      multi-gray palettes. If you need to distinguish a box, use typography
//      weight or the inverted (black bg / white text) callout pattern.
//
//   2. NO SVG SUBSCRIPT HACKS. Earlier we tried <tspan dy="0.35em"
//      font-size="0.7em"> and <tspan baseline-shift="sub">. Both render fine
//      in browsers but break in ImageMagick's internal MSVG renderer (used
//      by the PDF build via `convert`) — tspans get stacked at the same x,
//      producing illegible overlap. Always use Unicode subscript glyphs
//      directly: ₀–₉ ₊ ₋ ₌ ₍ ₎ ₐ ₑ ₕ ᵢ ⱼ ₖ ₗ ₘ ₙ ₒ ₚ ᵣ ₛ ₜ ᵤ ᵥ ₓ.
//      Missing letters (b c d f g q w y z): rephrase with an available
//      Unicode-subscriptable word, never fall back to <tspan>.
//
//   3. GRAYSCALE IMAGE. Photographs are desaturated via the <filter
//      id="grayscale"> defined in Svg{}. Apply it with filter="url(#grayscale)"
//      on <image>. ImageMagick respects feColorMatrix.
//
//   4. SQUARE CORNERS. rx is omitted everywhere — this is part of the brutal
//      research aesthetic. Don't reintroduce rounded corners.
//
//   5. TITLE OVERFLOW. SVG <text> has no auto-wrap. Long titles in narrow
//      boxes (≤ ~250px) must be passed as a string array so each entry
//      renders on its own line. Box{} expands vertically as needed —
//      ensure h is tall enough for (title lines + subline count).
//
//   6. RENDER PATH. Each component is rendered twice by scripts/build.tsx:
//      once with imageHref pointing to a base64 data: URI (for the PNG
//      ImageMagick consumes) and once with a relative path (for the web).
//      Keep components pure functions of {imageHref} — no other side state.
// ─────────────────────────────────────────────────────────────────────────────

export const palette = {
  ink: '#111',
  muted: '#666',
  paper: '#fff',
  fillDark: '#111',
} as const;

export function Svg({
  children,
  width = 1400,
  height = 760,
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
    >
      <rect width={width} height={height} fill={palette.paper} />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={palette.ink} />
        </marker>
        {/* Luminance grayscale for embedded photographs. ImageMagick honors this. */}
        <filter id="grayscale">
          <feColorMatrix
            type="matrix"
            values="0.2627 0.6780 0.0593 0 0
                    0.2627 0.6780 0.0593 0 0
                    0.2627 0.6780 0.0593 0 0
                    0      0      0      1 0"
          />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

export function Text({
  x,
  y,
  children,
  size = 23,
  weight = 400,
  fill = palette.ink,
  anchor = 'middle',
  family = 'Inter, Arial, sans-serif',
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  family?: string;
}) {
  // Children must already contain Unicode glyphs for any math (see constraint 2).
  return (
    <text x={x} y={y} fontFamily={family} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  fill,
  title,
  lines,
  titleSize = 22,
  lineSize = 18,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  // Pass an array of strings to wrap a long title onto multiple lines.
  // SVG has no auto-wrap; manual wrapping is the only option.
  title: string | readonly string[];
  lines: readonly string[];
  titleSize?: number;
  lineSize?: number;
}) {
  const titleArr = Array.isArray(title) ? title : [title];
  const titleStep = titleSize + 4;
  const titleBaseY = y + 34;
  const sublineBaseY = titleBaseY + (titleArr.length - 1) * titleStep + 30;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={palette.ink} strokeWidth={1.75} />
      {titleArr.map((t, i) => (
        <Text key={`t${i}`} x={x + w / 2} y={titleBaseY + i * titleStep} size={titleSize} weight={700}>
          {t}
        </Text>
      ))}
      {lines.map((line, i) => (
        <Text key={`l${i}`} x={x + w / 2} y={sublineBaseY + i * (lineSize + 8)} size={lineSize} fill={palette.muted}>
          {line}
        </Text>
      ))}
    </g>
  );
}

export function Arrow({x1, y1, x2, y2}: {x1: number; y1: number; x2: number; y2: number}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.ink} strokeWidth={2.25} markerEnd="url(#arrow)" />;
}

export type FigureComponent = (props: {imageHref: string}) => React.JSX.Element;

export type FigureSpec = {
  label: string;
  title: string;
  caption: string;
  file: string;
  component: FigureComponent;
};
