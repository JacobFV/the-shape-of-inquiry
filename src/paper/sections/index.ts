// Section registry — order here defines the paper's reading order.
// To reorder, move imports/entries; to add a section, create a new file
// here and register it in both arrays.

import {abstractLines} from './abstract';
import {introductionTheHiddenLaborOfRealityContactLines} from './introduction-the-hidden-labor-of-reality-contact';
import {theObjectiveStackTerminatesTooEarlyLines} from './the-objective-stack-terminates-too-early';
import {geometryBeforeSemanticsLines} from './geometry-before-semantics';
import {curiosityCreativityAndIntelligenceAsObjectiLines} from './curiosity-creativity-and-intelligence-as-objecti';
import {instrumentationWorkLines} from './instrumentation-work';
import {theEventStreamIsNotALogLines} from './the-event-stream-is-not-a-log';
import {theObjectiveAsTrajectoryFunctionalLines} from './the-objective-as-trajectory-functional';
import {theChemistryRobotAsExperimentalApertureLines} from './the-chemistry-robot-as-experimental-aperture';
import {theMinimalPhStripDemoLines} from './the-minimal-ph-strip-demo';
import {hypothesesLines} from './hypotheses';
import {eventDerivedMeasurementsLines} from './event-derived-measurements';
import {ablationsLines} from './ablations';
import {failureModesLines} from './failure-modes';
import {theFrontierObjectiveGeometryLines} from './the-frontier-objective-geometry';
import {discussionMakingTheWorldAnswerableLines} from './discussion-making-the-world-answerable';
import {conclusionLines} from './conclusion';
import {candidateImplementationStackLines} from './candidate-implementation-stack';
import {minimalEventSchemaLines} from './minimal-event-schema';
import {promptSkeletonForNeutralLabModeLines} from './prompt-skeleton-for-neutral-lab-mode';
import {compressedFalsificationMapLines} from './compressed-falsification-map';
import {bibliographyLines} from './bibliography';

export const sectionLines: readonly (readonly string[])[] = [
  abstractLines,
  introductionTheHiddenLaborOfRealityContactLines,
  theObjectiveStackTerminatesTooEarlyLines,
  geometryBeforeSemanticsLines,
  curiosityCreativityAndIntelligenceAsObjectiLines,
  instrumentationWorkLines,
  theEventStreamIsNotALogLines,
  theObjectiveAsTrajectoryFunctionalLines,
  theChemistryRobotAsExperimentalApertureLines,
  theMinimalPhStripDemoLines,
  hypothesesLines,
  eventDerivedMeasurementsLines,
  ablationsLines,
  failureModesLines,
  theFrontierObjectiveGeometryLines,
  discussionMakingTheWorldAnswerableLines,
  conclusionLines,
  candidateImplementationStackLines,
  minimalEventSchemaLines,
  promptSkeletonForNeutralLabModeLines,
  compressedFalsificationMapLines,
  bibliographyLines,
];

// Each section file preserves the trailing blank line(s) that the original
// source had, so a plain flat concat reproduces the body verbatim.
export const bodyLines: readonly string[] = sectionLines.flatMap((ls) => [...ls]);
