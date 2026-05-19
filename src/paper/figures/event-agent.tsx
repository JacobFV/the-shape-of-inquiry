import React from 'react';
import {Arrow, Box, Svg, Text, palette, type FigureComponent} from './_primitives';

// fig:event-agent — "Event-sourced embodied scientific agent"
//
// Layout notes:
//   • Top row: 4 heads (substrate → store → ledger → control). Stride 350,
//     width 270.
//   • Curved feedback path from rightmost head back to leftmost.
//   • Lower container is a stream lane grid: 6 lanes × 4 event tiles. Lane
//     labels right-aligned at x=210; tiles start at x=265 with stride 225,
//     each tile 155×36. Summary column on the right (x=1195) uses monospace.
//   • Two summary bars below: inverted "Embodied loop" and a faint
//     "Computed from streams" caption.
//   • Math glyphs (Δκ, κ, ρ, Δπ) are Unicode (constraint 2).
export const EventAgentFigure: FigureComponent = () => {
  const lanes = ['Visual', 'Motor', 'Tool', 'Calibration', 'Thought', 'Judge-Train'];
  const events = [
    ['frame', 'segment', 'crop', 'observation'],
    ['command', 'pose', 'grip', 'servo'],
    ['view', 'exec', 'read', 'store'],
    ['color', 'intrinsic', 'extrinsic', 'Δκ'],
    ['hypothesis', 'plan', 'posterior', 'claim'],
    ['critique', 'reward', 'distill', 'update'],
  ];
  const laneSummary = ['IG, ρ', 'IG, ρ', 'IG, ρ', 'κ, Δκ', 'IG, ρ', 'Δπ'];

  const heads: readonly [string, string][] = [
    ['Physical Substrate', 'cameras, arm, labware, samples'],
    ['Typed Event Store', 'append-only causal memory'],
    ['Global Belief Ledger', 'hypotheses, goals, evidence'],
    ['Control Stack', 'models, judges, safety, tools'],
  ];

  return (
    <Svg width={1500} height={930}>
      {heads.map(([title, line], i) => (
        <React.Fragment key={title}>
          <Box x={82 + i * 350} y={62} w={270} h={132} fill={palette.paper} title={title} lines={[line]} titleSize={22} />
          {i < 3 ? <Arrow x1={352 + i * 350} y1={128} x2={432 + i * 350} y2={128} /> : null}
        </React.Fragment>
      ))}
      <path
        d="M 1230 198 C 1230 286 220 286 220 198"
        fill="none"
        stroke={palette.ink}
        strokeWidth={2.25}
        markerEnd="url(#arrow)"
      />
      <rect x={100} y={300} width={1300} height={420} fill={palette.paper} stroke={palette.ink} strokeWidth={1.75} />
      <Text x={140} y={345} size={22} weight={700} anchor="start">
        Typed Event Streams
      </Text>
      {lanes.map((lane, row) => (
        <g key={lane}>
          <Text x={210} y={395 + row * 54} size={17} weight={700} anchor="end">
            {lane}
          </Text>
          <line x1={235} y1={388 + row * 54} x2={1170} y2={388 + row * 54} stroke={palette.ink} strokeWidth={0.75} />
          {events[row].map((event, col) => (
            <g key={event}>
              <rect
                x={265 + col * 225}
                y={363 + row * 54}
                width={155}
                height={36}
                fill={palette.paper}
                stroke={palette.ink}
                strokeWidth={1.25}
              />
              <Text x={342 + col * 225} y={387 + row * 54} size={15}>
                {event}
              </Text>
            </g>
          ))}
          <Text x={1195} y={395 + row * 54} size={15} fill={palette.muted} anchor="start" family="ui-monospace, Menlo, monospace">
            {laneSummary[row]}
          </Text>
        </g>
      ))}
      <rect x={130} y={768} width={1240} height={54} fill={palette.fillDark} stroke={palette.ink} strokeWidth={1.75} />
      <Text x={750} y={802} size={19} weight={700} fill={palette.paper}>
        {'Embodied loop: perceive → hypothesize → calibrate → intervene → update posterior → improve policy.'}
      </Text>
      <rect x={130} y={838} width={1240} height={46} fill={palette.paper} stroke={palette.ink} strokeWidth={1.25} />
      <Text x={750} y={867} size={16} fill={palette.muted}>
        Computed from streams: self-effect, epistemic gain, calibration gain, replay auditability, policy improvement.
      </Text>
    </Svg>
  );
};

export const eventAgentSpec = {
  label: 'fig:event-agent',
  title: 'Event-sourced embodied scientific agent',
  caption:
    'The architecture is a physical action-observation loop before it is a conversational interface. Typed events provide the substrate for memory, auditability, judging, and policy improvement; the global belief ledger is a structured belief state, not a transcript.',
  file: 'event-agent.svg',
  component: EventAgentFigure,
};
