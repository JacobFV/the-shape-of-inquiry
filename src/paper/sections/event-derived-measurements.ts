// Section: event-derived-measurements
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const eventDerivedMeasurementsLines: readonly string[] = [
  "\\section{Event-Derived Measurements}",
  "",
  "The core measurements are given in closed form where possible:",
  "",
  "\\begin{longtable}{>{\\raggedright\\arraybackslash}p{0.24\\textwidth}>{\\raggedright\\arraybackslash}p{0.66\\textwidth}}",
  "\\toprule",
  "\\textbf{Quantity} & \\textbf{Operationalization}\\\\",
  "\\midrule",
  "Epistemic gain & $\\displaystyle \\IG_t=\\Ent(P(\\Theta\\mid h_t)) - \\Ent(P(\\Theta\\mid h_t,a_t,o_{t+1}))$\\\\",
  "Self-effect & $\\displaystyle \\rho_\\tau=\\frac{\\MI(A_t;O_{t+\\tau}\\mid O_{\\le t})}{\\Ent(O_{t+\\tau}\\mid O_{\\le t})}$\\\\",
  "Calibration gain & $\\displaystyle \\Delta\\kappa_t = U_{\\mathrm{pre}}(m_t)-U_{\\mathrm{post}}(m_t)$, or equivalently a reduction in posterior uncertainty after calibration\\\\",
  "Measurement validity & $\\displaystyle \\mathrm{Valid}=1-\\frac{1}{N}\\sum_{i=1}^N \\ell(\\hat\\theta_i,\\theta_i^{\\star})$ for an appropriate loss $\\ell$ against ground truth or an independent instrument\\\\",
  "World-touch ratio & $\\displaystyle \\mathrm{WTR}=\\frac{\\sum_t \\mathbf{1}[\\Delta O_t\\ \\text{is causally attributable to}\\ A_t]}{\\sum_t \\mathbf{1}[e_t\\in S^{\\mathrm{thought}}\\cup S^{\\mathrm{text}}] + \\epsilon}$\\\\",
  "Semantic cosplay ratio & $\\displaystyle \\Cosplay=\\frac{\\#\\{\\text{claims without event evidence}\\}}{\\#\\{\\text{claims with event evidence}\\}+\\epsilon}$\\\\",
  "Trace auditability & $\\displaystyle R_{\\mathrm{audit}}=\\frac{1}{N}\\sum_{i=1}^N \\mathbf{1}[\\hat c_i(\\mathcal{E}_i)=c_i]$, where cited event sets $\\mathcal{E}_i$ suffice to reconstruct conclusion $c_i$\\\\",
  "Creative compression & $\\displaystyle C_t = N_t\\,\\IG_t\\,\\Delta \\A_t\\,\\max\\{0,\\MDL(M_t)-\\MDL(M_{t+1})\\}$\\\\",
  "Policy improvement & $\\displaystyle \\Delta\\Pi_n = \\alpha\\,\\Delta\\mathrm{Acc}_n - \\beta\\,\\Delta\\mathrm{Lat}_n - \\gamma\\,\\Delta\\mathrm{Unc}_n - \\delta\\,\\Delta\\mathrm{Act}_n$ under held-out perturbations\\\\",
  "Safety score & $\\displaystyle S_{\\mathrm{safe}} = 1-\\frac{\\#\\{\\text{unsafe proposals accepted}\\}}{\\#\\{\\text{unsafe proposals issued}\\}+\\epsilon}$, with hard constraints preserved\\\\",
  "\\bottomrule",
  "\\end{longtable}",
  "",
] as const;
