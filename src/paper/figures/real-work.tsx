import React from 'react';
import {Arrow, Box, Svg, Text, palette, type FigureComponent} from './_primitives';

// fig:real-work — "The real work behind work"
//
// Layout notes (don't break without re-measuring):
//   • 5 process-step boxes in a row. Stride 286, width 260, x_0=39. This
//     leaves a 26px arrow gap. With width 1500 the right margin is 57.
//   • Box height 180 + 2-line title + 2 sublines. Three titles wrap to two
//     lines for fit; "Unstructured World" fits on one line — we still
//     reserve the same height for vertical rhythm.
//   • Three formula boxes below show ρ, epistemic valence, and creative
//     compression. Formulas use Unicode subscripts (see _primitives note 2)
//     and a monospace family for the math line.
//   • Bottom inverted callout (black bg, white text) carries the slogan.
//     Inversion is the only "second color" we allow.
export const RealWorkFigure: FigureComponent = () => {
  const boxes: readonly [string | readonly string[], readonly string[]][] = [
    ['Unstructured World', ['unknowns, noise', 'confounds']],
    [['Instrumentation', 'Work'], ['calibration', 'tool choice']],
    [['Reliable', 'Measurement Loop'], ['perceive, hypothesize', 'intervene, update']],
    [['Evidence and', 'Compression'], ['posterior update', 'reusable routine']],
    [['Expanded', 'Affordance'], ['new questions', 'broader control']],
  ];

  return (
    <Svg width={1500} height={720}>
      {boxes.map(([title, lines], i) => (
        <React.Fragment key={String(Array.isArray(title) ? title[0] : title)}>
          <Box x={39 + i * 286} y={86} w={260} h={180} fill={palette.paper} title={title} lines={lines} />
          {i < boxes.length - 1 ? <Arrow x1={299 + i * 286} y1={176} x2={325 + i * 286} y2={176} /> : null}
        </React.Fragment>
      ))}
      {[
        ['self-effect', 'ρ = I(A; Oₙₑₓₜ | Oₚₐₛₜ) / H(Oₙₑₓₜ | Oₚₐₛₜ)'],
        ['epistemic valence', 'E[H(Θ | h) − H(Θ | h, a, o)]'],
        ['creative compression', 'C = N · IG · ΔA · max(0, MDL(Mₜ) − MDL(Mₜ₊₁))'],
      ].map(([title, formula], i) => (
        <g key={title}>
          <rect x={110 + i * 450} y={350} width={380} height={98} fill={palette.paper} stroke={palette.ink} strokeWidth={1.75} />
          <Text x={300 + i * 450} y={386} size={22} weight={700}>
            {title}
          </Text>
          <Text x={300 + i * 450} y={422} size={17} fill={palette.muted} family="ui-monospace, Menlo, monospace">
            {formula}
          </Text>
        </g>
      ))}
      <rect x={110} y={545} width={1280} height={86} fill={palette.fillDark} stroke={palette.ink} strokeWidth={1.75} />
      <Text x={750} y={598} size={26} weight={700} fill={palette.paper}>
        Intelligence begins when making the world measurable enters the objective.
      </Text>
    </Svg>
  );
};

export const realWorkSpec = {
  label: 'fig:real-work',
  title: 'The real work behind work',
  caption:
    'Answer production is downstream of world-preparation. The relevant trajectory converts understructured reality into a measurement domain: calibration, instrument construction, intervention, evidence compression, and affordance expansion.',
  file: 'real-work.svg',
  component: RealWorkFigure,
};
