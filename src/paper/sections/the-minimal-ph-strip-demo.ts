// Section: the-minimal-ph-strip-demo
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const theMinimalPhStripDemoLines: readonly string[] = [
  "\\section{The Minimal pH-Strip Demo}",
  "",
  "The first experimental trace can remain deliberately unspectacular by chemistry standards. A safe unknown sample, pH paper, calibration card, pipette, camera, and manipulator are sufficient. The agent receives affordances and safety constraints, but no direct instruction to classify the sample.",
  "",
  "",
  "\\PaperFigure{lab-scene}",
  "",
  "",
  "A successful trace has the following structure:",
  "",
  "\\begin{enumerate}",
  "  \\item Survey the workspace.",
  "  \\item Identify pH strips as a possible measurement affordance.",
  "  \\item Form hypotheses about the unknown sample.",
  "  \\item Choose pH measurement because expected information gain is high.",
  "  \\item Detect that direct visual color estimation is unreliable.",
  "  \\item Invoke calibration.",
  "  \\item Apply sample to strip using the robot.",
  "  \\item Capture a calibrated macro image.",
  "  \\item Write or adapt Python code to segment strip patches and estimate pH.",
  "  \\item Update the posterior over candidate substances.",
  "  \\item Cite event evidence.",
  "  \\item Store the measurement routine for later use.",
  "  \\item Improve speed, uncertainty, or reliability on a second held-out trial.",
  "\\end{enumerate}",
  "",
  "The conclusion remains secondary. The trace is the object under study.",
  "",
] as const;
