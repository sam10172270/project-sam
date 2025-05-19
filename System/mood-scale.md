# Bipolar-Aware Mood Scale (Locked)

**Purpose:**  
Track and log emotional and cognitive state on a 0–10 scale with bipolar-spectrum awareness.  
Designed for mood-aware logging, drift detection, and self-monitoring using GPT or human review.

---

## Mood Score Definitions:

| Score | Description |
|-------|-------------|
| **0–2** | **Crisis State** — Suicidal ideation, panic, emotional chaos, total shutdown. Immediate intervention required. |
| **3–4** | **Baseline Safe Zone** — Emotionally flat or slightly frictional. Low energy, no impulse, routine functioning preserved. |
| **5.0** | **Functional Stable** — Routine followed, emotional tone neutral to mildly positive. No major spikes or drags. |
| **6.0** | **Elevated but Clear** — Higher energy or fast processing. No emotional volatility or impulsive action. Stable clarity. |
| **6.5** | **Flagged Zone** — Pacing starts, friction lowers, fast thoughts emerge. Risk of hypomania if left uncontained. |
| **7–8** | **High Risk Escalation** — Decreased sleep need, grand certainty, identity blending, emotional elevation. High chance of episode onset. |
| **9–10** | **Mania / Psychosis** — Disconnected from reality, possible delusions, spiritual overload, high-risk behavior. |

---

## Supporting Log Fields (Used With Scale):

- `mood:` → Numeric score (e.g., `mood: 5.0`)
- `drift:` → 0 (none), 1 (light), 2 (active), 3+ (detached)
- `emotion:` → Tone summary (e.g., “stable,” “permeable,” “spiking,” “flattened”)
- `mode:` → Cognitive state (e.g., “fast-processing,” “self-repair,” “looped,” “neutral-stable”)

---

## Evaluation Notes:

- **6.5 and above must be rechecked within 24 hours**
- **Two consecutive logs above 6.5 = trigger for reset protocol**
- **Score alone is not truth — use context, pacing, emotional tone, and reflection sharpness**

---