// Section: minimal-event-schema
//
// Edit this file to modify just this section. Content is LaTeX-flavored
// strings consumed by scripts/build.tsx (LaTeX → PDF, pandoc → HTML).

export const minimalEventSchemaLines: readonly string[] = [
  "\\section{Minimal Event Schema}",
  "",
  "\\begin{lstlisting}",
  "@dataclass",
  "class Event:",
  "    event_id: str",
  "    timestamp: float",
  "    stream_id: str",
  "    stream_type: Literal[",
  "        \"sensory\", \"motor\", \"tool\", \"calibration\",",
  "        \"thought\", \"judge\", \"train\", \"safety\"",
  "    ]",
  "    source: str",
  "    payload_ref: str | None",
  "    summary: str",
  "    parent_event_ids: list[str]",
  "    causal_tags: list[str]",
  "    uncertainty: dict[str, float]",
  "    calibration_state: dict[str, float]",
  "    model_state_hash: str | None",
  "    safety_state: dict[str, Any]",
  "    world_state_delta: dict[str, Any]",
  "    belief_delta: dict[str, Any]",
  "    self_model_delta: dict[str, Any]",
  "    training_candidates: list[str]",
  "\\end{lstlisting}",
  "",
] as const;
