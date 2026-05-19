// Section: the-chemistry-robot-as-experimental-aperture
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const theChemistryRobotAsExperimentalApertureLines: readonly string[] = [
  "\\section{The Chemistry Robot as Experimental Aperture}",
  "",
  "The physical setup remains deliberately modest, in contrast with full self-driving laboratories such as the mobile robotic chemist of \\citet{burger2020}: disposable glassware, safe unknown powders and solutions, pH strips, a color calibration card, a thermometer, a multimeter or conductivity probe, multiple cameras, and a low-cost arm with interchangeable manipulators. Chemical novelty is secondary. Physical closure is the invariant.",
  "",
  "A sufficient minimal tool interface is:",
  "\\begin{lstlisting}",
  "view(camera_id)             # semantic perception through a VLM",
  "exec(python_code)           # raw camera/sensor access, code, calibration routines",
  "move(tool, pose)            # robot command, with observed pose recorded",
  "read(sensor_id)             # physical instrument readout",
  "calibrate(mode)             # hard-coded calibration routines",
  "fork(goal, context)         # transient stream creation",
  "merge(stream_id, packet)    # structured merge back to global ledger",
  "store(event)                # append typed event",
  "\\end{lstlisting}",
  "",
  "The distinction between \\texttt{view} and \\texttt{exec} is the hinge. \\texttt{view} gives semantic perception. \\texttt{exec} permits measurement construction. A scientist is not merely a system that can look at a strip and say it appears orange. A scientist can decide that orange is not yet evidence, then build the procedure that turns color into an estimate with uncertainty.",
  "",
  "\\subsection{Calibration as Organ Bootstrapping}",
  "",
  "Calibration should be partly hard-coded. This does not weaken the experiment. It prevents theater. A biological organism does not invent its retina from first principles every morning. Calibration is organ bootstrapping.",
  "",
  "Calibration mode should include camera intrinsics and extrinsics, camera-to-robot transform, tool-tip transform for each end-effector, workspace coordinate frame, color correction, illumination normalization, fiducial detection, visual servo sanity checks, and pH-strip patch localization. The strict requirement is that calibration uncertainty be exposed:",
  "\\begin{equation}",
  "  \\kappa_t=(\\kappa^{pose}_t,\\kappa^{color}_t,\\kappa^{lighting}_t,\\kappa^{tool}_t,\\kappa^{sensor}_t).",
  "\\end{equation}",
  "The agent should be able to infer that direct visual pH estimation is weak when color and lighting confidence are low, invoke color calibration, and process raw strip pixels through Python rather than laundering uncertainty through fluent description.",
  "",
] as const;
