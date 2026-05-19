import React from 'react';
import {Arrow, Box, Svg, Text, palette, type FigureComponent} from './_primitives';

// fig:objective-shaping — "Objective shaping in the space of inquiry"
//
// Layout notes:
//   • Hero band at the top embeds the lab photograph (passed as imageHref)
//     and is desaturated via filter="url(#grayscale)". The photo is the only
//     visual element that gets to carry mid-tones; everything else is pure
//     ink-on-paper.
//   • 5 stages across the middle. Stride 286, width 230.
//   • Legend block at the bottom (signal name → function). Two columns at
//     x=165 (bold) and x=555 (muted).
//   • Inverted Q(τ) summary bar at the very bottom, monospace family.
//     ALL math notation in this figure uses Unicode glyphs (constraint 2):
//     ρ Δκ ΔA Φ τ π aₜ hₜ κₜ w₁ … w₅.
export const ObjectiveShapingFigure: FigureComponent = ({imageHref}) => {
  const stages: readonly [string, string][] = [
    ['Trajectory signals', 'IG, ρ, Δκ, ΔA, C, Φ'],
    ['Policy update', 'π(aₜ | hₜ, κₜ)'],
    ['Physical action', 'robot + tools + sensors'],
    ['Event trace', 'τ = (h, a, o, …)'],
    ['Replay / distill', 'future policy'],
  ];

  return (
    <Svg width={1500} height={1180}>
      <image
        href={imageHref}
        x={105}
        y={45}
        width={1290}
        height={520}
        preserveAspectRatio="xMidYMid slice"
        filter="url(#grayscale)"
      />
      <rect x={105} y={45} width={1290} height={520} fill="none" stroke={palette.ink} strokeWidth={2} />
      {stages.map(([title, line], i) => (
        <React.Fragment key={title}>
          <Box x={70 + i * 286} y={625} w={230} h={130} fill={palette.paper} title={title} lines={[line]} />
          {i < 4 ? <Arrow x1={300 + i * 286} y1={690} x2={350 + i * 286} y2={690} /> : null}
        </React.Fragment>
      ))}
      <path
        d="M 1325 758 C 1325 842 180 842 180 758"
        fill="none"
        stroke={palette.ink}
        strokeWidth={2.25}
        markerEnd="url(#arrow)"
      />
      <rect x={120} y={880} width={1260} height={200} fill={palette.paper} stroke={palette.ink} strokeWidth={1.75} />
      {[
        ['Information gain', 'reduce latent uncertainty'],
        ['Self-effect', 'keep actions load-bearing'],
        ['Calibration gain', 'convert perception into evidence'],
        ['Affordance expansion', 'open reachable measurements'],
        ['Counter-gradients', 'suppress unsafe semantic theater'],
      ].map(([signal, fn], i) => (
        <g key={signal}>
          <Text x={165} y={925 + i * 32} size={19} weight={700} anchor="start">
            {signal}
          </Text>
          <Text x={555} y={925 + i * 32} size={19} fill={palette.muted} anchor="start">
            {fn}
          </Text>
        </g>
      ))}
      <rect x={160} y={1110} width={1180} height={50} fill={palette.fillDark} stroke={palette.ink} strokeWidth={1.75} />
      <Text x={750} y={1142} size={19} weight={700} fill={palette.paper} family="ui-monospace, Menlo, monospace">
        Q(τ) = w₁·IG + w₂·ρ + w₃·Δκ + w₄·ΔA + w₅·C − risk − Goodhart − cosplay
      </Text>
    </Svg>
  );
};

export const objectiveShapingSpec = {
  label: 'fig:objective-shaping',
  title: 'Objective shaping in the space of inquiry',
  caption:
    'The real lab substrate is not decoration; it is the causal surface through which objective terms acquire meaning. Trajectory-level signals shape policy toward measurement construction, while counter-gradients suppress unsafe exploration, proxy exploitation, and semantic performance without evidence.',
  file: 'objective-shaping.svg',
  component: ObjectiveShapingFigure,
};
