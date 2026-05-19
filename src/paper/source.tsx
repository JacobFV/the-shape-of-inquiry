import React from 'react';
import {bodyLines} from './sections';

// ─────────────────────────────────────────────────────────────────────────────
// Paper manifest. The body is composed from per-section files in ./sections/.
//
//   • To edit content, open the relevant src/paper/sections/<slug>.ts file.
//   • To reorder or add sections, edit ./sections/index.ts.
//   • To add a figure, see src/paper/figures/index.tsx and reference it from
//     a section body line with the marker \PaperFigure{<id>}.
//
// The build pipeline (scripts/build.tsx) reads `paper.body` (joined string)
// and feeds it through both LaTeX (PDF) and pandoc (HTML).
// ─────────────────────────────────────────────────────────────────────────────

export type PaperFigureId =
  | 'real-work'
  | 'objective-shaping'
  | 'event-agent'
  | 'lab-scene';

export const paper = {
  title: 'The Shape of Inquiry',
  subtitle: 'The Real Work Behind Work',
  author: 'Jacob',
  draft: 'Working Draft, May 2026',
  description:
    'A preliminary theoretical and experimental specification of scientific agency as measurement construction.',
  body: bodyLines.join('\n') + '\n',
} as const;

export const figureOrder: PaperFigureId[] = [
  'real-work',
  'objective-shaping',
  'event-agent',
  'lab-scene',
];

export const figureLatex: Record<PaperFigureId, { placement: string; width: string }> = {
  'real-work': { placement: "[H]", width: "\\textwidth" },
  'objective-shaping': { placement: "[p]", width: "0.98\\textwidth" },
  'event-agent': { placement: "[H]", width: "\\textwidth" },
  'lab-scene': { placement: "[H]", width: "\\textwidth" },
};

export function PaperSourceManifest() {
  return (
    <article data-source="tsx" data-title={paper.title}>
      {figureOrder.map((id) => (
        <figure key={id} data-figure-id={id} />
      ))}
    </article>
  );
}
