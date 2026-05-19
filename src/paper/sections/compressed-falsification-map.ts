// Section: compressed-falsification-map
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const compressedFalsificationMapLines: readonly string[] = [
  "\\section{Compressed Falsification Map}",
  "",
  "\\begin{longtable}{>{\\raggedright\\arraybackslash}p{0.30\\textwidth}>{\\raggedright\\arraybackslash}p{0.58\\textwidth}}",
  "\\toprule",
  "\\textbf{Claim} & \\textbf{What would falsify or weaken it}\\\\",
  "\\midrule",
  "Curiosity basin & Neutral agents do not enter measurement loops more often than baselines\\\\",
  "Calibration reflex & Calibration does not improve validity or is not invoked appropriately\\\\",
  "Measurement construction & Direct VLM estimates match calibrated raw-image pipelines under perturbation\\\\",
  "Event memory & Conclusions are not more auditable or policies do not improve from replay\\\\",
  "Self-effect & Action histories do not explain future observations better than passive histories\\\\",
  "Creativity & Generated routines are not reusable, compressive, or affordance-expanding\\\\",
  "Trace-level judging & Judges reward narrative coherence over event-grounded validity\\\\",
  "Trajectory-geometric objective & Task-reward or imitation baselines occupy inquiry basins equally well\\\\",
  "\\bottomrule",
  "\\end{longtable}",
  "",
  "\\newpage",
  "\\bibliographystyle{plainnat}",
] as const;
