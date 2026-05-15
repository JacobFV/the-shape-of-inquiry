import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync } from "node:fs";

const source = "the_shape_of_inquiry.tex";
const temp = ".paper-pandoc.html";
const output = "index.html";

execFileSync(
  "pandoc",
  [
    "--from=latex",
    "--to=html5",
    "--standalone",
    "--mathjax=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js",
    "--metadata",
    "title=The Shape of Inquiry",
    "-o",
    temp,
    source,
  ],
  { stdio: "inherit" },
);

let html = readFileSync(temp, "utf8");

const figures = {
  "fig:real-work": `
<div class="diagram diagram-flow" aria-label="The real work behind work diagram">
  <div class="flow-row">
    <div class="flow-card blue"><strong>Unstructured World</strong><span>Unknowns, noise, confounds, partial observability</span></div>
    <div class="flow-arrow">→</div>
    <div class="flow-card amber"><strong>Instrumentation Work</strong><span>Calibration, standardization, tool choice, feature definition</span></div>
    <div class="flow-arrow">→</div>
    <div class="flow-card green"><strong>Reliable Measurement Loop</strong><span>Perceive → hypothesize → calibrate → intervene → observe → update</span></div>
    <div class="flow-arrow">→</div>
    <div class="flow-card purple"><strong>Evidence and Compression</strong><span>Posterior update, reusable routine, reduced future uncertainty</span></div>
    <div class="flow-arrow">→</div>
    <div class="flow-card amber"><strong>Expanded Affordance</strong><span>New questions, new experiments, broader control</span></div>
  </div>
  <div class="formula-row">
    <div class="formula-chip">\\(\\rho_\\tau=\\dfrac{I(A_t;O_{t+\\tau}\\mid O_{\\le t})}{H(O_{t+\\tau}\\mid O_{\\le t})}\\)<span>Self-effect</span></div>
    <div class="formula-chip">\\(V^{\\mathrm{epi}}(a\\mid h_t)=\\mathbb{E}[H(\\Theta\\mid h_t)-H(\\Theta\\mid h_t,a,o')]\\)<span>Epistemic valence</span></div>
    <div class="formula-chip">\\(C_t=N_t\\,IG_t\\,\\Delta A_t\\,\\max(0,MDL(M_t)-MDL(M_{t+1}))\\)<span>Creative compression</span></div>
  </div>
  <div class="diagram-claim"><strong>Intelligence begins when the work of making the world measurable becomes part of the objective.</strong></div>
</div>`,
  "fig:objective-shaping": `
<div class="diagram diagram-objective" aria-label="Objective shaping in the space of inquiry diagram">
  <div class="objective-list">
    <div class="objective-card blue"><strong>Information Gain</strong><span>\\(IG(a)=H(\\Theta\\mid h_t)-H(\\Theta\\mid h_t,a,o')\\)</span><em>\\(\\nabla_a IG\\)</em></div>
    <div class="objective-card blue"><strong>Self-Effect</strong><span>\\(\\rho_\\tau=I(A_t;O_{t+\\tau}\\mid O_{\\le t})/H(O_{t+\\tau}\\mid O_{\\le t})\\)</span><em>\\(\\nabla_a \\rho\\)</em></div>
    <div class="objective-card green"><strong>Calibration Gain</strong><span>\\(\\Delta\\kappa(a)\\)</span><em>\\(\\nabla_a \\Delta\\kappa\\)</em></div>
    <div class="objective-card green"><strong>Affordance Expansion</strong><span>\\(\\Delta A(a)\\)</span><em>\\(\\nabla_a \\Delta A\\)</em></div>
    <div class="objective-card amber"><strong>Creative Compression</strong><span>\\(C_t=N_t IG_t \\Delta A_t \\Delta MDL_t\\)</span><em>\\(\\nabla C\\)</em></div>
    <div class="objective-card purple"><strong>Stable Integration</strong><span>\\(\\Phi_{stable}\\) and \\(F_\\iota\\)</span><em>\\(\\nabla \\Phi,\\nabla F_\\iota\\)</em></div>
    <div class="objective-card red"><strong>Penalties</strong><span>\\(-Risk\\), \\(-Cost\\), \\(-Goodhart\\), \\(-Cosplay\\)</span><em>\\(-\\nabla Risk,-\\nabla Cosplay\\)</em></div>
  </div>
  <div class="agent-panel">
    <div class="thought">Which action will make the world more knowable?</div>
    <div class="agent-symbol">π</div>
    <div class="basin">
      <span>Novelty Addiction</span>
      <strong>Curiosity Basin</strong>
      <span>Semantic Cosplay</span>
    </div>
  </div>
  <div class="lab-loop">
    <div class="lab-card"><strong>Physical Lab</strong><span>Cameras, arm, pH strip, samples</span></div>
    <div class="loop-label">action ↓</div>
    <div class="lab-card green"><strong>Event Trace</strong><span>\\(\\tau=(h_0,a_0,o_0,\\ldots,h_T)\\)</span></div>
    <div class="loop-label">observation / replay / update</div>
  </div>
  <div class="wide-formula">\\(Q(\\tau)=w_1IG+w_2\\rho+w_3\\Delta\\kappa+w_4\\Delta A+w_5C+w_6\\Phi_{stable}+w_7F_\\iota-w_8Risk-w_9Goodhart-w_{10}Cosplay\\)</div>
</div>`,
  "fig:event-agent": `
<div class="diagram diagram-agent" aria-label="Event-sourced embodied scientific agent diagram">
  <div class="agent-grid">
    <div class="agent-block blue">
      <strong>Physical Substrate</strong>
      <span><b>Sensing:</b> top, side, macro cameras</span>
      <span><b>Actuation:</b> robot arm, pipette, gripper</span>
      <span><b>Lab:</b> safe unknowns, pH strips, color card, disposable glassware</span>
    </div>
    <div class="agent-block green">
      <strong>Grand Central Station — Persistent belief ledger</strong>
      <div class="stream-tabs"><span>Survey</span><span>Calibrate</span><span>Analyze</span><span>Plan</span><span>Audit</span></div>
      <p>Transient streams fork for bounded goals, send/wait on messages, and merge structured deltas back into the global ledger.</p>
      <b>Typed Event Streams</b>
      <div class="event-lines">
        <span>Visual</span><span>Motor</span><span>Tool</span><span>Calibration</span><span>Thought</span><span>Judge--Train</span>
      </div>
      <p>Append-only event history with temporal links, causal links, uncertainty, calibration state, and evidence pointers.</p>
    </div>
    <div class="agent-block amber">
      <div class="stack-card"><strong>Local Models</strong><span>Perception, servoing, world/self model</span></div>
      <div class="stack-card"><strong>Cloud Judges</strong><span>Trace critique, labels, distillation</span></div>
      <div class="stack-card red"><strong>Safety Governor</strong><span>Rules, thresholds, allowed actions</span></div>
      <div class="stack-card blue"><strong>Tool API</strong><span><code>view</code>, <code>exec</code>, <code>move</code>, <code>read</code>, <code>calibrate</code>, <code>store</code></span></div>
    </div>
  </div>
  <div class="diagram-claim"><strong>Embodied scientific loop:</strong> perceive → hypothesize → choose uncertainty-reducing measurement → self-calibrate → intervene physically → process raw data → update posterior → store trace → improve policy.</div>
  <div class="diagram-claim muted"><strong>Computed from event streams:</strong> self-effect \\(\\rho_\\tau\\), epistemic gain \\(IG\\), calibration gain \\(\\Delta\\kappa\\), trace auditability, and policy improvement.</div>
</div>`,
};

for (const [id, figure] of Object.entries(figures)) {
  const pattern = new RegExp(`(<figure id="${id}">)\\s*([\\s\\S]*?<figcaption>[\\s\\S]*?</figcaption>\\s*</figure>)`);
  html = html.replace(pattern, `$1\n${figure}\n$2`);
}

html = html
  .replace('<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">', '<html lang="en">')
  .replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="paper.css" />')
  .replace(/\n<header id="title-block-header">[\s\S]*?<\/header>\n/, "\n")
  .replace(/\n\s*<script src="https:\/\/polyfill\.io\/v3\/polyfill\.min\.js\?features=es6"><\/script>/, "")
  .replace('<body>', '<body>\n<main class="paper">')
  .replace('</body>', '</main>\n</body>');

writeFileSync(output, html);
rmSync(temp, { force: true });

console.log(`Wrote ${output}`);
