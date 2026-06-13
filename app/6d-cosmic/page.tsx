import type { Metadata } from "next";

import { runSixD } from "@/lib/six-d/engine";
import { EXAMPLE_INTENT } from "@/lib/six-d/example";
import type { RunManifest } from "@/lib/six-d/types";
import {
  buildCosmicRun,
  Ledger,
  runSixDCosmic,
  unboundElements,
  VERDICTS,
  type Verdict,
} from "@/lib/six-d/cosmic";
import styles from "./cosmic.module.css";

export const metadata: Metadata = {
  title: "6D Workbench · COSMIC — verdict-gated, hash-chained SDLC artifacts | JourdanLabs",
  description:
    "The 6D Workbench run through the real COSMIC pipeline: VELLUM binds every element to its source, AURORA issues a NO_OBJECTION/HOLD/REFUSE verdict per artifact (with the REFUSE→RESOLVE→RECOMPUTE loop), and LUNA chains each run into an append-only, tamper-evident ledger. Deterministic, keyless, zero egress.",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  NO_OBJECTION: "NO_OBJECTION",
  HOLD: "HOLD",
  REFUSE: "REFUSE",
};
const verdictClass = (v: Verdict): string =>
  v === "REFUSE" ? styles.refuse : v === "HOLD" ? styles.hold : styles.ok;

const short = (h: string): string => `${h.slice(0, 12)}…${h.slice(-8)}`;

// A second, deliberately under-bound intent so the gate has something to REFUSE on
// provenance grounds — paired with the clean example to show the contrast.
const THIN_INTENT = {
  title: "Make the dashboard better",
  context: "It feels slow sometimes.",
  goals: ["Improve it"],
  constraints: [],
  sourceMaterial: [],
};

// Inject one fabricated, unsourced element to demonstrate VELLUM UNBOUND → REFUSE.
function withFabricatedElement(m: RunManifest): RunManifest {
  const t: RunManifest = structuredClone(m);
  t.artifacts[0].elements.push({
    id: "define.fabricated.1",
    kind: "fabricated",
    body: "An invented requirement with no source in the intent.",
    sourceRefs: ["intent.does.not.exist"],
  });
  return t;
}

export default async function SixDCosmicPage() {
  // ── Run the pipeline deterministically at render (no clock, no network). ──
  const run = await buildCosmicRun(EXAMPLE_INTENT);

  // LUNA: chain three runs, then verify; then a tampered copy that snaps the chain.
  const ledger = new Ledger();
  await runSixDCosmic(EXAMPLE_INTENT, { ledger });
  await runSixDCosmic(THIN_INTENT, { ledger });
  await runSixDCosmic({ ...EXAMPLE_INTENT, title: "Servicing Console — Step-Up Auth (v2)" }, { ledger });
  const chain = ledger.all;
  const intact = await ledger.verify();

  const tampered = ledger.all;
  (tampered[1].payload as Record<string, unknown>).intentId = "tampered";
  const tamperedLedger = new Ledger(
    // re-seed a ledger over the mutated entries
    { load: () => tampered, append: () => {} },
  );
  const broken = await tamperedLedger.verify();

  // REFUSE → RESOLVE → RECOMPUTE on the real blocking audit-write gap.
  const resolved = await buildCosmicRun(EXAMPLE_INTENT).then(async (r) => {
    const { refuseResolveRecompute } = await import("@/lib/six-d/cosmic");
    return refuseResolveRecompute(r.manifest, [
      {
        key: "oq:develop.oq.1",
        answer: "If the audit write fails, the action BLOCKS and is queued for retry (owner decision).",
      },
    ]);
  });

  // VELLUM UNBOUND demonstration.
  const tamperedManifest = withFabricatedElement(await runSixD(EXAMPLE_INTENT));
  const { bindProvenance, runAuroraGate } = await import("@/lib/six-d/cosmic");
  const unboundProv = unboundElements(await bindProvenance(tamperedManifest));
  const unboundGate = await runAuroraGate(tamperedManifest);
  const unboundVerdict = unboundGate.artifacts
    .find((a) => a.phase === "define")!
    .elements.find((e) => e.elementId === "define.fabricated.1")!;

  const developBefore = run.gate.artifacts.find((a) => a.phase === "develop")!;
  const developAfter = resolved.after.artifacts.find((a) => a.phase === "develop")!;

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>6D Workbench · COSMIC-native (Tier 1)</p>
        <h1 className={styles.title}>{EXAMPLE_INTENT.title}</h1>
        <p className={styles.sub}>
          The same six-phase run as <code>/6d</code>, now put through the real COSMIC pipeline:
          <strong> VELLUM</strong> binds every element to its source, <strong>AURORA</strong> issues
          a verdict per artifact, and <strong>LUNA</strong> chains the run into an append-only,
          tamper-evident ledger. Deterministic · keyless · zero egress.
        </p>
        <div className={styles.receiptBar}>
          <span>
            <span className={styles.recLabel}>v1 receipt</span>
            <code>{short(run.manifest.receipt)}</code>
          </span>
          <span>
            <span className={styles.recLabel}>COSMIC run hash</span>
            <code>{short(run.runHash)}</code>
          </span>
          <span>
            <span className={styles.recLabel}>gate</span>
            <code>
              {run.gate.summary.NO_OBJECTION} ok · {run.gate.summary.HOLD} hold ·{" "}
              {run.gate.summary.REFUSE} refuse
            </code>
          </span>
        </div>
      </header>

      {/* ── AURORA ─────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.engine}>AURORA</span> — verdict gate
        </h2>
        <p className={styles.lede}>
          Every artifact gets a verdict from the fixed vocabulary{" "}
          <code>{Object.values(VERDICTS).join(" / ")}</code>. The toy “open questions” of v1 are now
          real verdicts: a blocking gap floors the phase to <strong>REFUSE</strong>, a non-blocking
          one to <strong>HOLD</strong>.
        </p>
        <div className={styles.grid}>
          {run.gate.artifacts.map((av) => (
            <div key={av.phase} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.phaseN}>{av.n}</span>
                <span className={styles.phaseName}>{av.phase}</span>
                <span className={`${styles.pill} ${verdictClass(av.verdict)}`}>
                  {VERDICT_LABEL[av.verdict]}
                </span>
              </div>
              <p className={styles.cardReason}>{av.reason}</p>
              {av.resolves.length > 0 && (
                <ul className={styles.needs}>
                  {av.resolves.map((n) => (
                    <li key={n.key}>
                      {n.blocking && <span className={styles.blocking}>BLOCKING</span>} {n.required}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── REFUSE → RESOLVE → RECOMPUTE ───────────────────────────────────── */}
      <section className={styles.section}>
        <h2>REFUSE → RESOLVE → RECOMPUTE</h2>
        <p className={styles.lede}>
          The Develop phase carries v1’s genuine blocking gap — “if the audit write fails, does the
          action proceed or block?” AURORA refuses it. Supply the owner’s decision and the gate
          recomputes; nothing was estimated.
        </p>
        <div className={styles.loop}>
          <div className={styles.loopCol}>
            <span className={styles.loopLabel}>before</span>
            <span className={`${styles.pill} ${verdictClass(developBefore.verdict)}`}>
              Develop · {VERDICT_LABEL[developBefore.verdict]}
            </span>
            <p className={styles.loopWhy}>
              {developBefore.resolves.find((n) => n.blocking)?.required}
            </p>
          </div>
          <div className={styles.loopArrow}>→ resolve →</div>
          <div className={styles.loopCol}>
            <span className={styles.loopLabel}>after</span>
            <span className={`${styles.pill} ${verdictClass(developAfter.verdict)}`}>
              Develop · {VERDICT_LABEL[developAfter.verdict]}
            </span>
            <p className={styles.loopWhy}>
              Resolved: <code>oq:develop.oq.1</code>. Outstanding needs{" "}
              {resolved.before.outstanding.length} → {resolved.after.outstanding.length}.
            </p>
          </div>
        </div>
      </section>

      {/* ── VELLUM ─────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.engine}>VELLUM</span> — provenance
        </h2>
        <p className={styles.lede}>
          Every <code>sourceRef</code> becomes a source+hash binding. On this run, all{" "}
          <strong>{run.provenance.length}</strong> elements bind to a source — nothing is UNBOUND.
          Inject a fabricated element with no real source and it is flagged immediately:
        </p>
        <div className={styles.unbound}>
          <span className={`${styles.pill} ${styles.refuse}`}>UNBOUND → REFUSE</span>
          <code>{unboundProv[0]?.elementId}</code>
          <span className={styles.unboundWhy}>
            {unboundProv[0]?.reason}. {unboundVerdict.reason}
          </span>
        </div>
      </section>

      {/* ── LUNA ───────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.engine}>LUNA</span> — hash-chained ledger
        </h2>
        <p className={styles.lede}>
          Each run appends to an append-only chain; entry N seals entry N-1’s hash.{" "}
          <code>verify()</code> walks the chain — and on tamper, names exactly which entry broke.
        </p>
        <ol className={styles.chain}>
          {chain.map((e) => (
            <li key={e.seq} className={styles.link}>
              <span className={styles.seq}>#{e.seq}</span>
              <code className={styles.linkHash}>{short(e.hash)}</code>
              <span className={styles.parent}>
                parent: {e.parentHash ? short(e.parentHash) : "GENESIS"}
              </span>
            </li>
          ))}
        </ol>
        <div className={styles.verifyRow}>
          <span className={`${styles.pill} ${styles.ok}`}>
            intact: {intact.ok ? `✓ ${intact.count} entries` : "broken"}
          </span>
          <span className={`${styles.pill} ${styles.refuse}`}>
            tampered entry #2 →{" "}
            {broken.ok ? "ok" : `✗ verify() caught it at entry ${broken.at}`}
          </span>
        </div>
        {!broken.ok && <p className={styles.brokenWhy}>{broken.reason}</p>}
      </section>

      <footer className={styles.footer}>
        Deterministic · keyless · zero egress. The semantic source set defines truth; AURORA refuses
        every element VELLUM cannot bind back to it; LUNA chains the run so any later edit snaps the
        chain and names where. 🐦‍⬛ + 🔑
      </footer>
    </main>
  );
}
