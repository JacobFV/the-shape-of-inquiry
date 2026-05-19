// Section: ablations
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const ablationsLines: readonly string[] = [
  "\\section{Ablations}",
  "",
  "A serious account cannot show only the best version. Components claimed to matter must be removed under controlled ablation.",
  "",
  "Critical ablations include no raw \\texttt{exec} access; no callable calibration tools; hidden calibration state instead of exposed calibration uncertainty; no event memory; no transient streams; no structured merge packets; no curiosity or instrumentation objective; no trace-level judging; direct VLM classification only; open-loop pose commands without visual servo correction; local-only model control; cloud-only model control; and no learning or distillation between trials.",
  "",
  "The two central comparisons are direct perception versus constructed measurement, and event-sourced agent versus ordinary tool-calling agent. If those comparisons do not move, the central interpretation weakens.",
  "",
] as const;
