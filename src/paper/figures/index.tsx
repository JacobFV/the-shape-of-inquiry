import type {PaperFigureId} from '../source';
import type {FigureSpec} from './_primitives';
import {realWorkSpec} from './real-work';
import {objectiveShapingSpec} from './objective-shaping';
import {eventAgentSpec} from './event-agent';
import {labSceneSpec} from './lab-scene';

// Figure registry. To add a new figure:
//   1. Add its id to PaperFigureId in ../source.tsx
//   2. Create src/paper/figures/<id>.tsx exporting a spec object
//   3. Register it here
//   4. Reference it from the body with \PaperFigure{<id>}
//
// See ./_primitives.tsx for the design constraints (monochrome, Unicode
// subscripts only, square corners, etc.) before authoring a new figure.

export const figures: Record<PaperFigureId, FigureSpec> = {
  'real-work': realWorkSpec,
  'objective-shaping': objectiveShapingSpec,
  'event-agent': eventAgentSpec,
  'lab-scene': labSceneSpec,
};

export type {FigureSpec, FigureComponent} from './_primitives';
