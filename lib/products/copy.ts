// THE WORDS — single source of truth for the two products' surface copy.
//
// Discipline (Captain's, 2026-06-14): explain it like they're 12. No engine
// names, no jargon on the glass. Every "how it works / NEBULA / VELLUM / EARS"
// word lives in the OPT-IN guided tour, never on the page itself. The surface
// says what it DOES in plain English; the tour says how, with the real names on
// the doors, for the curious and the technical buyer.
//
// LOOPER  = decide what to build + write the plan for it, and prove it. (Agility + the semantic spec engine.)
// NORTH POLE = the whole workshop: idea in, finished+checked work out. (All three stages.)
// 🐦‍⬛ + 🔑

export interface Stage {
  /** data-tour anchor the page MUST put on this section, e.g. data-tour="plan". */
  anchor: string;
  /** Plain section heading shown on the glass. No engine names. */
  label: string;
  /** One or two plain sentences under the heading. No engine names. */
  plain: string;
}

export interface HumanCall {
  label: string;
  plain: string;
}

/** A guided-tour step, shaped exactly for <GuidedTour steps={…}>. */
export type TourStep =
  | { kind: "cover"; kicker: string; title: string; sub: string }
  | { kind: "step"; n: number; act: string; sel: string; title: string; body: string }
  | { kind: "outro"; kicker: string; title: string; sub: string };

export interface ProductCopy {
  slug: string;
  name: string;
  /** Hero kicker. */
  kicker: string;
  /** Nav + metadata one-liner. */
  oneLiner: string;
  /** Hero headline (plain, human). */
  tagline: string;
  /** Hero sub-paragraph (plain). */
  sub: string;
  /** The narrative sections, in order. The page renders live data under each. */
  stages: Stage[];
  /** The frontier, in plain words: where it refuses to fake it. */
  humanCall: HumanCall;
  /** Plain proof points (determinism / provenance / refusal) — no hashes-as-jargon. */
  proof: string[];
  /** localStorage key so each tour remembers "seen" independently. */
  storageKey: string;
  /** The opt-in tour. THIS is where the engine names live. cover → steps → outro. */
  tour: TourStep[];
}

// ── LOOPER ───────────────────────────────────────────────────────────────────
export const LOOPER: ProductCopy = {
  slug: "looper",
  name: "LOOPER",
  kicker: "JourdanLabs · LOOPER",
  oneLiner: "Decide what to build next — for real reasons.",
  tagline: "You have more good ideas than time.",
  sub: "LOOPER lines up everything you could build, picks what fits this round, and writes the plan for the top one. Most of the time the real plan turns out smaller than you feared — so you get to build more. Every call is shown, never guessed.",
  stages: [
    {
      anchor: "lineup",
      label: "Everything on the table",
      plain: "Each idea you could build, with what it's worth and how big it looks right now. Pick one to send down the line.",
    },
    {
      anchor: "picks",
      label: "What we're building this round",
      plain: "LOOPER picks what fits your team's real schedule — and shows you why each one made the cut.",
    },
    {
      anchor: "plan",
      label: "The plan for your top pick",
      plain: "Open it up: what it has to do, what it connects to, the one rule it can't break, and how you'll know it's done. Every line traced back to what you asked for.",
    },
    {
      anchor: "surprise",
      label: "The surprise",
      plain: "You guessed it was huge. Broken into a real plan, it's a fraction of that — and the freed-up time lets more ideas through. The lineup re-decides on the spot.",
    },
  ],
  humanCall: {
    label: "The one human call",
    plain: "There's always one spot a machine shouldn't fake. LOOPER finds it, flags it, and hands it to a person — instead of guessing and hoping.",
  },
  proof: [
    "Every line traces back to something you actually said.",
    "Run it twice, get the same answer. No dice.",
    "Nothing here was invented just to sound smart.",
  ],
  storageKey: "looper-tour-v1-seen",
  tour: [
    {
      kind: "cover",
      kicker: "Under the hood · LOOPER",
      title: "How LOOPER actually works.",
      sub: "The same loop you just saw — now with the real engine names on the doors. For the curious, and for the technical buyer.",
    },
    {
      kind: "step",
      n: 1,
      act: "I · The lineup",
      sel: '[data-tour="lineup"]',
      title: "This part is Agility.",
      body: "Agility scores every idea on value and effort, then decides what fits your team's true capacity — like a sharp product lead triaging a roadmap, except it shows all its math and writes the decision down.",
    },
    {
      kind: "step",
      n: 2,
      act: "II · The plan",
      sel: '[data-tour="plan"]',
      title: "This part is CADMUS, the spec engine.",
      body: "CADMUS doesn't keyword-match. It reads what you mean: it notices that “servicing agents” and “the agent” are the same thing and merges them, sorts the must-do rules, and ties every line of the plan back to a source.",
    },
    {
      kind: "step",
      n: 3,
      act: "III · Why the number drops",
      sel: '[data-tour="surprise"]',
      title: "The gut-guess vs. the real plan.",
      body: "Broken into actual pieces, the work is usually far smaller than the gut estimate. LOOPER feeds that true size back to Agility, which re-decides on the spot — and room opens up for more.",
    },
    {
      kind: "step",
      n: 4,
      act: "IV · The honest part",
      sel: '[data-tour="humancall"]',
      title: "It names what it can't be sure of.",
      body: "Where the meaning is genuinely ambiguous, LOOPER doesn't bluff. It marks the exact spot a human (or a bigger model) is still needed. We call that the frontier — naming it instead of faking it is the entire point.",
    },
    {
      kind: "step",
      n: 5,
      act: "V · The receipt",
      sel: '[data-tour="proof"]',
      title: "Signed, and impossible to fake.",
      body: "Every plan is bound to its sources, passed through a gate that can say no, and sealed into a tamper-proof record. Change one thing and the seal breaks. It re-runs identically, forever.",
    },
    {
      kind: "outro",
      kicker: "That's LOOPER",
      title: "Decide. Plan. Prove. Repeat.",
      sub: "Two engines, one honest loop — and it tells you the truth about its own work.",
    },
  ],
};

// ── NORTH POLE ─────────────────────────────────────────────────────────────────
export const NORTH_POLE: ProductCopy = {
  slug: "north-pole",
  name: "NORTH POLE",
  kicker: "JourdanLabs · NORTH POLE",
  oneLiner: "The whole workshop — idea in, finished work out.",
  tagline: "The whole workshop, start to finish.",
  sub: "Drop in an idea. NORTH POLE decides if it's worth doing, writes the plan, builds it, checks its own work — and refuses to ship if it's wrong. Then it tells you what it learned and goes again.",
  stages: [
    {
      anchor: "worth",
      label: "Is it worth building?",
      plain: "The first call: should we build this at all, and when? NORTH POLE decides — and shows the reasoning.",
    },
    {
      anchor: "plan",
      label: "The plan",
      plain: "The build plan in plain terms: what it does, what it touches, the rule it can't break, and how we'll know it's done.",
    },
    {
      anchor: "build",
      label: "Build & check",
      plain: "It builds it — then catches its own mistake, refuses to ship the broken version, fixes it, and ships clean. Two passes, on purpose.",
    },
    {
      anchor: "learned",
      label: "What we learned",
      plain: "The real size and the open questions go back to the top, and the line decides what's next. Round and round it goes.",
    },
  ],
  humanCall: {
    label: "Where it asks for help",
    plain: "NORTH POLE won't pretend. When a step needs human judgment, it stops and says so — clearly — instead of guessing.",
  },
  proof: [
    "Every step is signed the moment it happens.",
    "Tamper with one step and the whole record breaks — visibly.",
    "The machine stops itself rather than ship something wrong.",
  ],
  storageKey: "northpole-tour-v1-seen",
  tour: [
    {
      kind: "cover",
      kicker: "Under the hood · NORTH POLE",
      title: "The workshop, with the real names on the doors.",
      sub: "The same line you just walked — now labeled for the curious and the technical buyer.",
    },
    {
      kind: "step",
      n: 1,
      act: "I · Worth it?",
      sel: '[data-tour="worth"]',
      title: "This is Agility.",
      body: "The “is it worth it” call is Agility: it weighs value against effort against your real capacity — and re-runs the instant the true size is known.",
    },
    {
      kind: "step",
      n: 2,
      act: "II · The plan",
      sel: '[data-tour="plan"]',
      title: "This is CADMUS, the spec engine.",
      body: "CADMUS reads meaning, not keywords: it merges duplicate names, sorts the rules, and sources every line. The plan isn't a vibe — it's traceable.",
    },
    {
      kind: "step",
      n: 3,
      act: "III · Build, refuse, resolve",
      sel: '[data-tour="build"]',
      title: "The validator is the part nobody else ships.",
      body: "The builder writes real code; a validator checks it against the plan. Round one REFUSES — it priced on stale data, a real and dangerous miss. So it RESOLVES and RECOMPUTES, and only then ships. It would rather stop than ship a lie.",
    },
    {
      kind: "step",
      n: 4,
      act: "IV · The receipt",
      sel: '[data-tour="proof"]',
      title: "Bind, gate, sign.",
      body: "Under every step: the work is bound to its sources, passed through a gate that can say no, and chained into a tamper-proof receipt. The whole circle re-runs identically.",
    },
    {
      kind: "step",
      n: 5,
      act: "V · The loop closes",
      sel: '[data-tour="learned"]',
      title: "What the build proved goes back to the top.",
      body: "A shipped build confirms the estimate; one the gate can't pass de-risks the idea and the lineup re-decides. Decide → plan → build → check → learn → decide. That's the factory.",
    },
    {
      kind: "outro",
      kicker: "That's NORTH POLE",
      title: "The whole line — and it stops itself when it's wrong.",
      sub: "Governed end to end, a receipt at every step, and a check no one else has.",
    },
  ],
};

export const PRODUCTS = [LOOPER, NORTH_POLE] as const;
