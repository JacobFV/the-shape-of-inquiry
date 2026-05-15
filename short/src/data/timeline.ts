export type VisualKind = 'alignment' | 'cameraCalibration' | 'compression' | 'curiosityField' | 'dualAccess' | 'eventStreams' | 'failureModes' | 'final' | 'hiddenLabor' | 'labClose' | 'labScan' | 'labTitle' | 'ledger' | 'loop' | 'metrics' | 'organ' | 'phMeasurement' | 'pipeline' | 'plausibility' | 'selfEffect' | 'sideBySide' | 'trialImprovement' | 'typology';

export type Beat = {
  id: string;
  start: number;
  duration: number;
  visual: VisualKind;
  headline: string;
  micro: string[];
  narration: string;
};

export const FPS = 30;
export const TOTAL_SECONDS = 180;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const beats: Beat[] = [
  {
    "id": "cold-open",
    "start": 0,
    "duration": 6,
    "visual": "labTitle",
    "headline": "Before an answer, the world must be made answerable.",
    "micro": [
      "calibration",
      "sampling",
      "lighting",
      "uncertainty"
    ],
    "narration": "There is a kind of work beneath the work. Before a scientist can answer a question, the world has to be made answerable."
  },
  {
    "id": "hidden-labor",
    "start": 6,
    "duration": 8,
    "visual": "hiddenLabor",
    "headline": "Most systems inherit the ontology.",
    "micro": [
      "objects segmented",
      "labels chosen",
      "task boundary drawn",
      "failure renamed noise"
    ],
    "narration": "Most machine-learning systems begin after another intelligence has already done the expensive ontological labor. The objects have been segmented. The labels chosen. The simulator stabilized."
  },
  {
    "id": "dataset-residue",
    "start": 14,
    "duration": 8,
    "visual": "pipeline",
    "headline": "A cleaned dataset is the fossil of prior intelligence.",
    "micro": [
      "dataset",
      "benchmark",
      "reward",
      "protocol"
    ],
    "narration": "Then the system learns inside a world that has already been made legible. A dataset is not the beginning of science. It is residue after world-preparation."
  },
  {
    "id": "objective-shift",
    "start": 22,
    "duration": 7,
    "visual": "typology",
    "headline": "Under autonomy, that hidden labor enters the objective.",
    "micro": [
      "not answer score",
      "measurement construction",
      "instrumentation work"
    ],
    "narration": "Under sufficient autonomy, that hidden labor can no longer remain outside the objective. Task completion and plausible narration sit at the wrong abstraction layer."
  },
  {
    "id": "substrate",
    "start": 29,
    "duration": 8,
    "visual": "labScan",
    "headline": "The substrate is deliberately small.",
    "micro": [
      "robot arm",
      "pH strips",
      "calibration card",
      "safe unknowns"
    ],
    "narration": "The first substrate can be small: cameras, manipulators, pH strips, calibration cards, safe unknown samples, and disposable labware on a table."
  },
  {
    "id": "thesis-touch-table",
    "start": 37,
    "duration": 6,
    "visual": "labClose",
    "headline": "The pH strip is not the thesis.",
    "micro": [
      "the first surface where the thesis touches the table"
    ],
    "narration": "The pH-strip task is not the thesis. It is the first surface where the thesis touches the table."
  },
  {
    "id": "affordance-loop",
    "start": 43,
    "duration": 8,
    "visual": "loop",
    "headline": "Unknown \u2192 Affordance \u2192 Instrument \u2192 Evidence \u2192 Compression.",
    "micro": [
      "the loop closes through intervention"
    ],
    "narration": "The process repeatedly collapses into a loop: unknown, affordance, instrument, evidence, compression, new affordance. Science lives there."
  },
  {
    "id": "semantic-to-causal",
    "start": 51,
    "duration": 8,
    "visual": "sideBySide",
    "headline": "From semantic agency to causal agency.",
    "micro": [
      "colored strip \u2260 evidence",
      "measurement requires calibration"
    ],
    "narration": "The movement from seeing a colored strip to constructing a calibrated estimate with uncertainty is the miniature transition from semantic agency to causal agency."
  },
  {
    "id": "view-exec",
    "start": 59,
    "duration": 9,
    "visual": "dualAccess",
    "headline": "view() perceives. exec() measures.",
    "micro": [
      "VLM semantics",
      "raw pixels",
      "segmentation",
      "numeric estimator"
    ],
    "narration": "The interface matters. view gives semantic perception. exec gives raw sensor access. The agent can stop describing an image and begin constructing a measurement."
  },
  {
    "id": "camera-calibration",
    "start": 68,
    "duration": 8,
    "visual": "cameraCalibration",
    "headline": "Calibration is the first act of humility.",
    "micro": [
      "intrinsics",
      "extrinsics",
      "color",
      "lighting",
      "tool transform"
    ],
    "narration": "Calibration is not cheating. It is organ bootstrapping: camera intrinsics, extrinsics, color correction, lighting state, tool-tip transforms."
  },
  {
    "id": "measurement-procedure",
    "start": 76,
    "duration": 8,
    "visual": "phMeasurement",
    "headline": "Color becomes evidence only through a procedure.",
    "micro": [
      "wet strip",
      "capture frame",
      "normalize color",
      "estimate pH"
    ],
    "narration": "A wet strip changes color. But color is not yet evidence. Evidence appears only after timing, image capture, color normalization, segmentation, and uncertainty."
  },
  {
    "id": "causal-contact",
    "start": 84,
    "duration": 8,
    "visual": "selfEffect",
    "headline": "A world model acquires meaning through causal contact.",
    "micro": [
      "actions explain future observations",
      "self-effect ratio"
    ],
    "narration": "A world model acquires meaning through causal contact. Once actions explain future observations, the agent must model itself as part of the world."
  },
  {
    "id": "event-streams",
    "start": 92,
    "duration": 9,
    "visual": "eventStreams",
    "headline": "The trace is not a log. It is what the agent becomes from.",
    "micro": [
      "visual",
      "motor",
      "tool",
      "calibration",
      "thought",
      "judge/train"
    ],
    "narration": "Every frame, pose, tool call, calibration update, hypothesis, posterior revision, and failure becomes a typed event. The trace becomes autobiography."
  },
  {
    "id": "belief-ledger",
    "start": 101,
    "duration": 8,
    "visual": "ledger",
    "headline": "A belief ledger replaces context soup.",
    "micro": [
      "fork worker",
      "message",
      "wait",
      "merge evidence",
      "preserve contradiction"
    ],
    "narration": "A single context window cannot carry this architecture. A global belief ledger forks bounded workers, waits on evidence, and merges structured deltas rather than raw rambling."
  },
  {
    "id": "curiosity",
    "start": 109,
    "duration": 8,
    "visual": "curiosityField",
    "headline": "Curiosity is not novelty.",
    "micro": [
      "uncertainty welcomed only where it can become traction"
    ],
    "narration": "Curiosity is not novelty. Noise can generate novelty. Damage can generate novelty. Curiosity is positive valence over uncertainty reduction where uncertainty can become traction."
  },
  {
    "id": "creativity",
    "start": 117,
    "duration": 8,
    "visual": "compression",
    "headline": "Creativity is compression that opens action.",
    "micro": [
      "new",
      "evidence-contacting",
      "compressive",
      "enabling"
    ],
    "narration": "Creativity is not style or surprise. In this regime, it is compression that opens action: a reusable measurement routine that lowers the cost of future inquiry."
  },
  {
    "id": "intelligence",
    "start": 125,
    "duration": 8,
    "visual": "alignment",
    "headline": "Intelligence appears as transition-geometry alignment.",
    "micro": [
      "internal trajectories \u2194 world trajectories",
      "intervention",
      "transfer",
      "recovery"
    ],
    "narration": "Intelligence becomes the alignment between internal transition geometry and the transition geometry of the world: enough alignment to intervene, transfer, and recover."
  },
  {
    "id": "metrics",
    "start": 133,
    "duration": 10,
    "visual": "metrics",
    "headline": "The system is evaluated by the trajectory.",
    "micro": [
      "epistemic gain",
      "self-effect",
      "calibration gain",
      "world-touch ratio",
      "cosplay penalty"
    ],
    "narration": "The result is not the label. The result is the trajectory: epistemic gain, self-effect, calibration gain, world-touch ratio, trace auditability, and semantic cosplay penalty."
  },
  {
    "id": "failure-modes",
    "start": 143,
    "duration": 9,
    "visual": "failureModes",
    "headline": "The obvious failures are structural.",
    "micro": [
      "semantic chemist",
      "novelty addict",
      "calibration bureaucrat",
      "passive observer"
    ],
    "narration": "The failures are structural: the semantic chemist who writes beautiful notes without evidence; the novelty addict who touches everything and learns little; the calibration bureaucrat who never acts."
  },
  {
    "id": "policy-improvement",
    "start": 152,
    "duration": 8,
    "visual": "trialImprovement",
    "headline": "Second-trial improvement matters.",
    "micro": [
      "fewer actions",
      "lower uncertainty",
      "faster calibration",
      "better transfer"
    ],
    "narration": "The second trial matters. If the system becomes faster, safer, better calibrated, or more transferable, then the event history has become training substrate."
  },
  {
    "id": "lab-cognitive-organ",
    "start": 160,
    "duration": 7,
    "visual": "organ",
    "headline": "The laboratory becomes a cognitive organ.",
    "micro": [
      "instrumentation",
      "memory",
      "calibration",
      "policy"
    ],
    "narration": "As the objective shifts from solving tasks to constructing measurements, the laboratory becomes part of the cognitive loop itself."
  },
  {
    "id": "plausibility",
    "start": 167,
    "duration": 7,
    "visual": "plausibility",
    "headline": "Autonomous science becomes plausible when the hidden work is modeled.",
    "micro": [
      "not benchmark dominance",
      "not theatrical AGI",
      "measurement construction"
    ],
    "narration": "This is not benchmark dominance, and not theatrical AGI. It is autonomous scientific agency as a measurable trajectory through the world."
  },
  {
    "id": "final",
    "start": 174,
    "duration": 6,
    "visual": "final",
    "headline": "The Shape of Inquiry",
    "micro": [
      "reality made more predictable by participation"
    ],
    "narration": "An agent making reality more predictable by participating in it."
  }
];
