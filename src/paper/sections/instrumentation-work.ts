// Section: instrumentation-work
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const instrumentationWorkLines: readonly string[] = [
  "\\section{Instrumentation Work}",
  "",
  "Instrumentation work names the conversion of a patch of reality into a measurement domain.",
  "",
  "Let $\\Theta$ be latent variables of interest, $O$ observations, $A$ actions, $K$ calibration states, and $M$ measurement procedures. A measurement procedure maps observations and calibration into an estimate and uncertainty:",
  "\\begin{equation}",
  "  m:(O,K)\\mapsto (\\hat{\\theta}, U(\\hat{\\theta})).",
  "\\end{equation}",
  "Instrumentation work over an interval $[t,t+k]$ is approximately",
  "\\begin{equation}",
  "  \\mathcal{W}_{\\mathrm{inst}} = \\Delta \\MI(\\Theta;O,A,K,M) + \\lambda\\Delta\\kappa + \\mu\\Delta\\A - \\nu\\Cost - \\omega\\Risk.",
  "\\end{equation}",
  "The equation is not an answer score. It measures the degree to which the system has made future answers less arbitrary. A correct guess from a biased visual prior can have high task score and low instrumentation work. A calibrated measurement procedure that can be replayed, audited, and transferred has high instrumentation work even when the final classification remains uncertain.",
  "",
] as const;
