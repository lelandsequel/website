import type { Metadata } from "next";

import { prioritize, INITIATIVES, type Initiative } from "@/lib/agility";
import {
  initiativeToIntent,
  artifactsToInitiativeUpdate,
} from "@/lib/loop/adapter";
import { runSixDCosmic, type CosmicRun } from "@/lib/six-d/cosmic";
import LoopExplorer, { type FundedVM, type TraceVM } from "./LoopExplorer";
import styles from "./loop.module.css";

export const metadata: Metadata = {
  title:
    "The Agility ↔ 6D Loop — two products, one governed system | JourdanLabs",
  description:
    "Agility decides what to build (prioritized); 6D COSMIC specs the architecture; 6D's decomposed size + open issues feed back to Agility to re-prioritize against the real size. Decide → specify → measure → re-decide, with a VELLUM/LUNA receipt riding the whole circle. Deterministic, keyless, synthetic data.",
};

const CAPACITY = 12;
// The headline initiative for the closed-loop re-prioritize: a large rough
// estimate (22w) that the spec decomposes far smaller, freeing capacity.
const REPRIO_TARGET = "HL-002";

const short = (h: string): string => `${h.slice(0, 12)}…${h.slice(-8)}`;

/**
 * Find a provenance trace: an evidence-derived source atom that a real 6D
 * artifact element cites, with its VELLUM binding. Returns null if (on this
 * run) no element cites a source atom directly. Deterministic — first match in
 * phase/element/ref order.
 */
function findTrace(initiative: Initiative, run: CosmicRun): TraceVM | null {
  const sourceAtoms = run.manifest.intentIndex.filter((a) => a.kind === "source");
  if (!sourceAtoms.length) return null;
  const atomById = new Map(sourceAtoms.map((a) => [a.id, a]));

  for (const art of run.manifest.artifacts) {
    for (const e of art.elements) {
      const ref = e.sourceRefs.find((r) => atomById.has(r));
      if (!ref) continue;
      const atom = atomById.get(ref)!;
      const prov = run.provenance.find((p) => p.elementId === e.id);
      const binding = prov?.bindings.find((b) => b.ref === ref && b.resolved);
      // atom.text is "field: source" — split back out for display.
      const sep = atom.text.indexOf(": ");
      const evidenceField = sep > 0 ? atom.text.slice(0, sep) : atom.text;
      const evidenceSource = sep > 0 ? atom.text.slice(sep + 2) : "";
      return {
        evidenceField,
        evidenceSource,
        atomId: atom.id,
        elementId: e.id,
        elementKind: e.kind,
        bound: prov?.status === "BOUND",
        sourceHash: binding?.sourceHash ?? "",
      };
    }
  }
  return null;
}

/** Build the closed-loop re-prioritize view (before/after) for the target. */
async function buildReprio(target: Initiative): Promise<FundedVM["reprio"]> {
  const pass1 = prioritize(INITIATIVES, { capacity: CAPACITY });

  const { run, entry } = await runSixDCosmic(initiativeToIntent(target));
  const upd = artifactsToInitiativeUpdate(run, target, entry.hash);

  const updated: Initiative[] = INITIATIVES.map((i) =>
    i.id === target.id ? { ...i, effortTeamWeeks: upd.reEstimatedEffortTeamWeeks } : i,
  );
  const pass2 = prioritize(updated, { capacity: CAPACITY });

  const before = new Set(pass1.funded.map((f) => f.id));
  const newlyFunded = pass2.funded.map((f) => f.id).filter((id) => !before.has(id));

  return {
    capacityBefore: pass1.capacityUsed,
    capacityAfter: pass2.capacityUsed,
    headBefore: pass1.head ?? "",
    headAfter: pass2.head ?? "",
    before: pass1.funded.map((f) => ({
      id: f.id,
      title: f.title,
      weeks: f.effortTeamWeeks,
      newlyFunded: false,
      isTarget: f.id === target.id,
    })),
    after: pass2.funded.map((f) => ({
      id: f.id,
      title: f.title,
      weeks: f.effortTeamWeeks,
      newlyFunded: newlyFunded.includes(f.id),
      isTarget: f.id === target.id,
    })),
    newlyFunded,
  };
}

export default async function LoopPage() {
  // ── STEP 1 — Agility decides (deterministic; node:crypto ledger, server-side).
  const portfolio = prioritize(INITIATIVES, { capacity: CAPACITY });

  // ── STEPS 2–4 — spec every funded initiative through the loop, build the VM.
  const funded: FundedVM[] = [];
  for (const init of portfolio.funded) {
    const intent = initiativeToIntent(init);
    // Run through the COSMIC pipeline AND chain it (for the LUNA receipt).
    const { run, entry } = await runSixDCosmic(intent);
    const update = artifactsToInitiativeUpdate(run, init, entry.hash);

    funded.push({
      id: init.id,
      title: init.title,
      valueType: init.valueType,
      rank: init._rank ?? 0,
      mandate: Boolean(init.mandate),
      roughWeeks: init.effortTeamWeeks,
      reach: `${init.reach.value} ${init.reach.unit}`,
      v1Receipt: run.manifest.receipt,
      cosmicRunHash: run.runHash,
      specReceipt: entry.hash,
      gateSummary: run.gate.summary,
      phases: run.gate.artifacts.map((av) => ({
        phase: av.phase,
        n: av.n,
        verdict: av.verdict,
        reason: av.reason,
      })),
      trace: findTrace(init, run),
      reEstimatedWeeks: update.reEstimatedEffortTeamWeeks,
      reEstimateDiffers: update.reEstimateDiffers,
      dependencyCount: update.dependencies.length,
      openIssues: update.openIssues,
      verdict: update.verdict,
      // STEP 5 re-prioritize attaches only to the headline target.
      reprio: init.id === REPRIO_TARGET ? await buildReprio(init) : null,
    });
  }

  // Headline receipts for the hero (use the target, or the first funded item).
  const headline = funded.find((f) => f.id === REPRIO_TARGET) ?? funded[0];

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>JourdanLabs · OMNIS — the governed loop</p>
        <h1 className={styles.title}>
          The Agility ↔ 6D Loop
          <span className={styles.synthetic}>SYNTHETIC DATA</span>
        </h1>
        <p className={styles.sub}>
          Two products, one governed system. <strong>Agility</strong> is the product — it decides{" "}
          <em>what</em> to build, prioritized. <strong>6D COSMIC</strong> is the architecture — it
          specs the buildable artifact. The loop closes when 6D&rsquo;s decomposed size and open
          issues feed <em>back</em> to Agility to re-prioritize against the real size — with a
          VELLUM/LUNA receipt riding the whole circle. Deterministic · keyless · zero egress.
        </p>
        <div className={styles.ribbon}>
          <span className={styles.ribbonStep}>Agility decides</span>
          <span className={styles.ribbonArrow}>→</span>
          <span className={styles.ribbonStep}>6D specs</span>
          <span className={styles.ribbonArrow}>→</span>
          <span className={styles.ribbonStep}>6D measures</span>
          <span className={styles.ribbonArrow}>→</span>
          <span className={styles.ribbonStep}>Agility re-decides</span>
          <span className={styles.ribbonArrow}>↺</span>
        </div>
        {headline && (
          <div className={styles.receiptBar}>
            <span>
              <span className={styles.recLabel}>headline initiative</span>
              <code>
                {headline.id} · {headline.roughWeeks}w → {headline.reEstimatedWeeks}w
              </code>
            </span>
            <span>
              <span className={styles.recLabel}>spec chain head (LUNA)</span>
              <code>{short(headline.specReceipt)}</code>
            </span>
            <span>
              <span className={styles.recLabel}>funded NOW</span>
              <code>{portfolio.funded.length} initiatives</code>
            </span>
          </div>
        )}
      </header>

      <LoopExplorer funded={funded} />

      <footer className={styles.footer}>
        Agility (what to build) and 6D (the buildable spec) are one governed system: the same
        Initiative becomes a 6D intent, its <code>evidence</code> becomes VELLUM-bound source, its
        spec is sealed into the LUNA chain, and its decomposed size re-enters Agility&rsquo;s
        allocation. Nothing here is estimated by a model — the engines are deterministic and the
        portfolio is synthetic. 6D/JPMC SDLC framing throughout. 🐦‍⬛ + 🔑
      </footer>
    </main>
  );
}
