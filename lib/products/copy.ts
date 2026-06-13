// THE WORDS — single source of truth for the two products' surface copy.
//
// Discipline (Captain's, 2026-06-14): explain it like they're 12. No engine
// names, no jargon on the glass. Every "how it works / NEBULA / VELLUM / EARS"
// word lives in the OPT-IN guided tour, never on the page itself. The surface
// says what it DOES in plain English; the tour says how, with the real names on
// the doors, for the curious and the technical buyer.
//
// LOOPER  = type an idea → it writes the plan, sizes it, and names what it can't be sure of. (Agility + the semantic spec engine.)
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

/** A ready-to-run example prompt for the live tool. */
export interface ToolExample {
  label: string;
  idea: string;
  /** Optional gut-estimate (weeks) so the "you guessed X → real Y" lands. */
  guess?: number;
}

/** Copy for a live "type it → run it" tool surface. */
export interface ToolCopy {
  inputLabel: string;
  placeholder: string;
  runLabel: string;
  rerunLabel: string;
  guessLabel: string;
  examplesLabel: string;
  /** Plain section headings for the result blocks (no engine names). */
  sections: {
    reconciled: string;
    plan: string;
    size: string;
    humancall: string;
    proof: string;
  };
  examples: ToolExample[];
}

export interface ProductCopy {
  slug: string;
  name: string;
  kicker: string;
  oneLiner: string;
  tagline: string;
  sub: string;
  stages: Stage[];
  humanCall: HumanCall;
  proof: string[];
  storageKey: string;
  /** The opt-in tour. THIS is where the engine names live. cover → steps → outro. */
  tour: TourStep[];
  /** Present when the page is a live, type-it-yourself tool (LOOPER). */
  tool?: ToolCopy;
}

// ── LOOPER ───────────────────────────────────────────────────────────────────
export const LOOPER: ProductCopy = {
  slug: "looper",
  name: "LOOPER",
  kicker: "JourdanLabs · LOOPER",
  oneLiner: "Type an idea — get the plan, the real size, and the honest catch.",
  tagline: "Tell it what you want to build.",
  sub: "Type a sentence or two — a real feature, in your own words. LOOPER reads what you mean, writes the plan, breaks it into the real size, and tells you the one spot a person still needs to weigh in. Live, every time, with a receipt. Try the example, or write your own.",
  stages: [
    {
      anchor: "reconciled",
      label: "What LOOPER read",
      plain: "It pulls the real moving parts out of your words — and notices when two names mean the same thing.",
    },
    {
      anchor: "plan",
      label: "The plan",
      plain: "What it has to do, what it connects to, the one rule it can't break, and how we'll know it's done — every line traced back to what you said.",
    },
    {
      anchor: "size",
      label: "The real size",
      plain: "It breaks the work into real pieces and adds them up — usually far smaller than the gut-guess.",
    },
  ],
  humanCall: {
    label: "The one human call",
    plain: "There's always one spot a machine shouldn't fake. LOOPER finds it, flags it, and hands it to a person — instead of guessing and hoping.",
  },
  proof: [
    "Every line traces back to something you actually typed.",
    "Run the same idea twice, get the same answer. No dice.",
    "Nothing here was invented just to sound complete.",
  ],
  storageKey: "looper-tour-v1-seen",
  tool: {
    inputLabel: "Tell LOOPER what you want to build",
    placeholder: "e.g. Build a real-time pricing tool that refuses to quote on stale rates…",
    runLabel: "Run LOOPER",
    rerunLabel: "Run it",
    guessLabel: "Your rough guess (weeks) — optional",
    examplesLabel: "Try one of these, or write your own:",
    sections: {
      reconciled: "What LOOPER read",
      plan: "The plan",
      size: "The real size",
      humancall: "The one human call",
      proof: "Signed & checkable",
    },
    examples: [
      {
        label: "Correspondent pricing",
        guess: 20,
        idea: "Build a real-time pricing engine for correspondent lending. Servicing agents and the servicing agent both need live quotes. It must price against the live rate-sheet feed and refuse to quote if the rate sheet is stale, and it must check the eligibility service before pricing. Respond within 2 seconds at the p95, and log every quote for audit within 1 second.",
      },
      {
        label: "Payoff-quote tool",
        guess: 12,
        idea: "Build a customer-facing payoff-quote tool. It pulls the live payoff amount for a loan, never shows a quote older than 24 hours, and logs every request for audit. If the servicing system is unavailable it should tell the customer to try again later instead of showing a stale number.",
      },
      {
        label: "Stuck-loan radar",
        guess: 8,
        idea: "Build an internal dashboard that flags mortgage applications stuck in underwriting for more than five business days and routes each one to a senior reviewer. It must pull from the loan origination system every hour and never double-assign the same application.",
      },
    ],
  },
  tour: [
    {
      kind: "cover",
      kicker: "Under the hood · LOOPER",
      title: "How LOOPER actually works.",
      sub: "You just ran it. Here's what happened, with the real engine names on the doors — for the curious, and for the technical buyer.",
    },
    {
      kind: "step",
      n: 1,
      act: "I · You type it",
      sel: '[data-tour="input"]',
      title: "Plain words in. No special format.",
      body: "A sentence or two about what you want built — exactly what an engineer would jot at the start of a project. This is the front door of the software lifecycle; everything after it is governed and deterministic.",
    },
    {
      kind: "step",
      n: 2,
      act: "II · It reads what you MEAN",
      sel: '[data-tour="reconciled"]',
      title: "This is CADMUS, the spec engine.",
      body: "It doesn't keyword-match — it reads meaning. It notices when “servicing agents” and “the agent” are the same thing and merges them, and pulls out the real moving parts. A substring scan structurally can't do that.",
    },
    {
      kind: "step",
      n: 3,
      act: "III · The plan",
      sel: '[data-tour="plan"]',
      title: "Sourced, not guessed.",
      body: "It sorts the must-do rules and writes the plan — and ties every line back to something you actually said. Nothing is invented to sound complete.",
    },
    {
      kind: "step",
      n: 4,
      act: "IV · The real size",
      sel: '[data-tour="size"]',
      title: "It breaks the work into real pieces.",
      body: "The plan decomposes into sized slices — that's the real number, and it's usually far below the gut-guess. Feed that back to the prioritizer (we call it Agility) and the whole roadmap re-decides on the truth.",
    },
    {
      kind: "step",
      n: 5,
      act: "V · The honest part",
      sel: '[data-tour="humancall"]',
      title: "It names what it can't be sure of.",
      body: "Where the meaning is genuinely ambiguous, it doesn't bluff — it marks the exact spot a human (or a bigger model) is still needed. We call that the frontier. Naming it instead of faking it is the entire point.",
    },
    {
      kind: "step",
      n: 6,
      act: "VI · The receipt",
      sel: '[data-tour="proof"]',
      title: "Signed, and impossible to fake.",
      body: "Every plan is bound to its sources (VELLUM), passed through a gate that can say no (AURORA), and sealed into a tamper-proof chain (LUNA). Change one thing and the seal breaks. It re-runs identically, forever.",
    },
    {
      kind: "outro",
      kicker: "That's LOOPER",
      title: "You just ran the real thing.",
      sub: "Type your own idea and run it again — same engine, live, every time.",
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
      title: "The whole software line — and it won't ship when it's wrong.",
      sub: "Most AI writes code that looks right and ships it. NORTH POLE runs the entire lifecycle — decide, plan, build, check — and stops itself cold when the work is wrong. Here's the whole thing, with the real names on the doors. Press play, or click through at your own pace.",
    },
    {
      kind: "step",
      n: 1,
      act: "I · Is it worth building?",
      sel: '[data-tour="worth"]',
      title: "First, a real decision — this is Agility.",
      body: "Before a line of code, Agility weighs the idea: what it's worth against what it costs against the room your team actually has. It scores every candidate and shows the math — no gut calls. And the instant the true size is known later, this decision re-runs on its own.",
    },
    {
      kind: "step",
      n: 2,
      act: "II · The plan + the definition of done",
      sel: '[data-tour="plan"]',
      title: "This is CADMUS, the spec engine.",
      body: "CADMUS reads what you mean — not keywords — and writes the plan: what it does, what it touches, the one rule it can't break, and a concrete definition of done. It merges duplicate names so nothing slips, and ties every line back to a source. The plan isn't a vibe; it's the checklist the build will be graded against.",
    },
    {
      kind: "step",
      n: 3,
      act: "III · It builds it",
      sel: '[data-tour="build"]',
      title: "The builder writes real code — and that's the commodity part.",
      body: "A real loan-pricing step gets built, end to end. Anyone's AI can write code that looks plausible. What happens next — the check that grades it against the plan and can say no — is the part nobody else ships.",
    },
    {
      kind: "step",
      n: 4,
      act: "IV · The check refuses it",
      sel: '[data-tour="miss"]',
      title: "REFUSE → RESOLVE → RECOMPUTE.",
      body: "Pass 1 priced a loan on a rate sheet that was out of date — a quiet, dangerous bug that ships in production every day. The validator ran the real rules against the real output, caught it, and REFUSED to ship. The exact failing rule was handed back; the build RESOLVED it and RECOMPUTED to green. Only then did it ship.",
    },
    {
      kind: "step",
      n: 5,
      act: "V · Why this is the whole point",
      sel: '[data-tour="miss"]',
      title: "A human would have missed it.",
      body: "The broken version looked fine — it returned a confident price. Eyeballing the code, a reviewer signs off. Only a check that runs the real rules against the real result catches “that number is based on stale data.” That validator is the differentiator: AI that can't lie about whether its own work is right.",
    },
    {
      kind: "step",
      n: 6,
      act: "VI · Signed, every step",
      sel: '[data-tour="proof"]',
      title: "Bind, gate, sign — including the refusal.",
      body: "Under every step: the work is bound to its sources (VELLUM), passed through a gate that can say no (AURORA), and sealed — even the refused pass — into a tamper-proof chain (LUNA). Change one thing and the seal breaks. The whole run reproduces identically, forever.",
    },
    {
      kind: "step",
      n: 7,
      act: "VII · The loop closes",
      sel: '[data-tour="learned"]',
      title: "What the build proved feeds back.",
      body: "A build that ships clean confirms the idea is deliverable; one the check can't pass de-risks it and the lineup re-decides — on what was measured, not guessed. Decide → plan → build → check → learn → decide. Round and round.",
    },
    {
      kind: "outro",
      kicker: "That's NORTH POLE",
      title: "The whole line — and a check no one else has.",
      sub: "Governed end to end, a receipt at every step, and it stops itself rather than ship a lie. Synthetic data; real machinery.",
    },
  ],
};

export const PRODUCTS = [LOOPER, NORTH_POLE] as const;
