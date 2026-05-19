// Section: the-objective-stack-terminates-too-early
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const theObjectiveStackTerminatesTooEarlyLines: readonly string[] = [
  "\\section{The Objective Stack Terminates Too Early}",
  "",
  "Next-token prediction, imitation learning, task rewards \\citep{suttonbarto2018}, and scalar preference models dominate because they are legible. They are optimizable. They fit the existing apparatus. Their failure mode follows from the same fact: they shape local continuation surfaces while leaving the deeper geometry of inquiry underspecified.",
  "",
  "A system trained to continue text can inherit the language of curiosity. A system trained to imitate scientists can produce scientist-like traces. A system trained on task success can become efficient at exploiting narrow paths through a task distribution. None of these conditions forces calibrated evidence to dominate plausible narration. None forces uncertainty reduction to dominate activity. None forces measurement construction to dominate answer production.",
  "",
  "The answer is residue. The trajectory is the object.",
  "",
  "\\begin{claimbox}",
  "\\textbf{Attractor geometry.} Curiosity, creativity, and intelligence are treated here as attractor geometries over event-sourced trajectories, not as semantic categories, reward labels, or prompt-conditioned behavioral styles.",
  "\\end{claimbox}",
  "",
  "Training a model to sound like a chemist installs a linguistic prior. Training a system to enter the basin of scientific inquiry requires a control geometry.",
  "",
] as const;
