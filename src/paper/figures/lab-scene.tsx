import React from 'react';
import {Svg, Text, palette, type FigureComponent} from './_primitives';

// fig:lab-scene — "Compact autonomous chemistry workspace"
//
// Layout notes:
//   • Full-bleed grayscale photograph (filter="url(#grayscale)") with 6
//     pointer callouts. Each callout is a 260×62 white card with a black
//     border + a 2.5px black leader line ending in an arrowhead.
//   • Callout positions are hand-tuned to the photograph. If the photo
//     changes, re-measure (x,y) and (tx,ty) per label.
//   • No math notation here — pure English labels.
export const LabSceneFigure: FigureComponent = ({imageHref}) => {
  const labels: readonly [string, string, number, number, number, number][] = [
    ['robot arm', 'interchangeable end-effector', 690, 95, 720, 410],
    ['multi-view cameras', '', 1110, 100, 1090, 240],
    ['safe unknown', 'samples', 210, 365, 230, 560],
    ['pH strips', '', 570, 940, 610, 765],
    ['color calibration', 'card', 860, 935, 840, 710],
    ['local controller', '+ sensor I/O', 1180, 930, 1160, 740],
  ];

  return (
    <Svg width={1500} height={1050}>
      <image
        href={imageHref}
        x={0}
        y={0}
        width={1500}
        height={1050}
        preserveAspectRatio="xMidYMid slice"
        filter="url(#grayscale)"
      />
      {labels.map(([a, b, x, y, tx, ty]) => (
        <g key={a}>
          <line x1={x} y1={y} x2={tx} y2={ty} stroke={palette.ink} strokeWidth={2.5} markerEnd="url(#arrow)" />
          <rect x={x - 130} y={y - 45} width={260} height={62} fill={palette.paper} stroke={palette.ink} strokeWidth={2} />
          <Text x={x} y={y - 19} size={20} weight={700}>
            {a}
          </Text>
          {b ? (
            <Text x={x} y={y + 6} size={16} fill={palette.muted}>
              {b}
            </Text>
          ) : null}
        </g>
      ))}
    </Svg>
  );
};

export const labSceneSpec = {
  label: 'fig:lab-scene',
  title: 'Compact autonomous chemistry workspace',
  caption:
    'The scene contains the core physical ingredients of the proposed measurement-construction loop: robot arm and end-effector, multiple cameras, pH strips, calibration reference, disposable glassware, safe unknown samples, and local controller hardware. The point of the image is not polish; it is the contact surface where semantic agency is forced into calibration, intervention, and event-grounded evidence.',
  file: 'lab-scene.svg',
  component: LabSceneFigure,
};
