// Section: introduction-the-hidden-labor-of-reality-contact
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const introductionTheHiddenLaborOfRealityContactLines: readonly string[] = [
  "\\section{Introduction: The Hidden Labor of Reality Contact}",
  "",
  "Most machine-learning systems are trained after another intelligence has already performed the expensive ontological work. The relevant objects have been segmented. The labels have been chosen. The task boundary has been drawn. The simulator has been stabilized. The reward has been written. The camera has been mounted. The calibration has been performed. The failure cases have been thrown away, averaged over, or renamed noise.",
  "",
  "Then the system learns inside a world already made legible.",
  "",
  "The necessary move is to move that hidden labor into the objective. Calibration and instrumentation are not glamorous. They are load-bearing. A robot that executes a chemistry protocol inside a clean workspace is useful. A robot that turns a messy workspace into a measurement environment approaches a different regime. The difference is the real work behind work.",
  "",
  "The engineering distinction is downstream of a deeper one. An embodied scientific agent is not merely a policy over actions. It is a system whose actions become causal inputs to what can be known next \\citep{pearl2009}. Its observations become consequences of prior interventions. Once this regime is entered, prediction, self-modeling, calibration, memory, and curiosity cease to be separable modules. They become one recursive loop.",
  "",
  "The recurrent topology is approximately:",
  "\\begin{equation}",
  "  \\mathrm{Unknown}\\rightarrow \\mathrm{Affordance}\\rightarrow \\mathrm{Instrument}\\rightarrow \\mathrm{Evidence}\\rightarrow \\mathrm{Compression}\\rightarrow \\mathrm{New\\ Affordance}.",
  "\\end{equation}",
  "Science lives in that loop. The published answer is only the last visible trace.",
  "",
  "\\begin{claimbox}",
  "\\textbf{Core invariant.} Real-world scientific intelligence begins when the work of making the world measurable becomes part of the objective, rather than an unrecorded favor performed by humans before training starts.",
  "\\end{claimbox}",
  "",
  "The chemistry setup matters because the transition remains visible at small scale. pH strips are not profound. The movement from ``I see a colored strip'' to ``I can construct a calibrated measurement with uncertainty and use it to revise a hypothesis'' is sufficient. It is a miniature version of the movement from semantic agency to causal agency.",
  "",
  "\\PaperFigure{real-work}",
  "",
  "",
] as const;
