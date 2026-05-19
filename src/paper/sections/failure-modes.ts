// Section: failure-modes
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const failureModesLines: readonly string[] = [
  "\\section{Failure Modes}",
  "",
  "\\begin{falsifybox}",
  "\\textbf{Semantic Chemist.} Excellent lab notes, no event-grounded measurements. Signature: high semantic coherence, low self-effect, low calibration gain, high cosplay ratio.",
  "\\end{falsifybox}",
  "",
  "\\begin{falsifybox}",
  "\\textbf{Novelty Addict.} High activity, little posterior change. Signature: high action entropy, high cost, low uncertainty reduction.",
  "\\end{falsifybox}",
  "",
  "\\begin{falsifybox}",
  "\\textbf{Calibration Bureaucrat.} Calibration becomes the local optimum. Signature: rising calibration time with vanishing calibration gain.",
  "\\end{falsifybox}",
  "",
  "\\begin{falsifybox}",
  "\\textbf{Passive Observer.} Workspace survey and fluent narration without intervention. Signature: $\\rho\\approx 0$.",
  "\\end{falsifybox}",
  "",
  "\\begin{falsifybox}",
  "\\textbf{Judge-Model Theater.} Cloud judges reward coherent narratives over evidence-grounded traces. Signature: judge score increases while measurement validity decreases.",
  "\\end{falsifybox}",
  "",
  "\\begin{falsifybox}",
  "\\textbf{Unsafe Explorer.} Information gain pursued through unacceptable risk. Signature: high $\\IG$ with high $\\Risk$. This must be blocked by hard safety constraints, not merely discouraged by reward shaping.",
  "\\end{falsifybox}",
  "",
] as const;
