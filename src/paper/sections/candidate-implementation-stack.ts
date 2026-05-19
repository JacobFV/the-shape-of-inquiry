// Section: candidate-implementation-stack
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const candidateImplementationStackLines: readonly string[] = [
  "\\section{Candidate Implementation Stack}",
  "",
  "A pragmatic first stack contains:",
  "\\begin{itemize}",
  "  \\item Local real-time models for visual servoing, segmentation, calibration checks, and action proposal.",
  "  \\item Stronger cloud models for slow global control, critique, safety review, and trace judging.",
  "  \\item Event database for metadata and causal links.",
  "  \\item Object storage for raw frames, video, code outputs, and artifacts.",
  "  \\item Vector index for summaries and retrieval.",
  "  \\item Graph index for causal parent-child event structure.",
  "  \\item Hard safety governor around actuation and chemistry.",
  "  \\item Replay system for trace-level training examples.",
  "  \\item Local distillation loop from judged traces.",
  "\\end{itemize}",
  "",
] as const;
