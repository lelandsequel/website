"use client";

// 6D Workbench — the one-screen client for the deterministic six-phase engine.
// Everything runs in the browser: no API key, no network call, no data egress.
// The receipt bar is the product's thesis made visible — run, verify, export.
//
// v1.1 — adds a v1 (keyword) ↔ Semantic (CADMUS) toggle so the same intent can
// be run through both engines side-by-side. The semantic mode surfaces the
// reconciled entity model and the honest frontier report above the 6-phase tabs.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  lineage,
  runSixD,
  validateTrace,
  verifyRun,
  type RawIntent,
} from "@/lib/six-d/engine";
import { runSixDSemantic } from "@/lib/six-d/semantic/run-semantic";
import type { IntentSemanticModel } from "@/lib/six-d/semantic/model";
import { EXAMPLE_INTENT } from "@/lib/six-d/example";
import { splitLines } from "@/lib/six-d/helpers";
import { bundleMarkdown, KIND_TITLES, phaseMarkdown } from "@/lib/six-d/markdown";
import type { ArtifactElement, RunManifest } from "@/lib/six-d/types";
import styles from "./sixd.module.css";

type EngineMode = "v1" | "semantic";
type VerifyState = { status: "idle" | "ok" | "fail"; recomputed?: string };

const download = (name: string, text: string, mime: string) => {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const shortHash = (h: string) => `${h.slice(0, 10)}…${h.slice(-6)}`;

export default function SixDWorkbench() {
  const [title, setTitle] = useState(EXAMPLE_INTENT.title);
  const [context, setContext] = useState(EXAMPLE_INTENT.context);
  const [goalsText, setGoalsText] = useState(EXAMPLE_INTENT.goals.join("\n"));
  const [constraintsText, setConstraintsText] = useState(EXAMPLE_INTENT.constraints.join("\n"));
  const [sourceText, setSourceText] = useState("");
  const [manifest, setManifest] = useState<RunManifest | null>(null);
  const [semanticModel, setSemanticModel] = useState<IntentSemanticModel | null>(null);
  const [mode, setMode] = useState<EngineMode>("v1");
  const [active, setActive] = useState(0);
  const [verify, setVerify] = useState<VerifyState>({ status: "idle" });
  const [openTraces, setOpenTraces] = useState<Set<string>>(new Set());

  const currentIntent = useCallback(
    (): RawIntent => ({
      title,
      context,
      goals: splitLines(goalsText),
      constraints: splitLines(constraintsText),
      sourceMaterial: splitLines(sourceText),
    }),
    [title, context, goalsText, constraintsText, sourceText],
  );

  const run = useCallback(async (intent: RawIntent, runMode: EngineMode) => {
    if (runMode === "semantic") {
      const m = await runSixDSemantic(intent);
      setManifest(m);
      setSemanticModel(m.semantic);
    } else {
      const m = await runSixD(intent);
      setManifest(m);
      setSemanticModel(null);
    }
    setActive(0);
    setVerify({ status: "idle" });
    setOpenTraces(new Set());
  }, []);

  // Land alive: the synthetic example is run on first paint.
  useEffect(() => {
    void run(EXAMPLE_INTENT, "v1");
  }, [run]);

  const onRun = () => void run(currentIntent(), mode);

  const onLoadExample = () => {
    setTitle(EXAMPLE_INTENT.title);
    setContext(EXAMPLE_INTENT.context);
    setGoalsText(EXAMPLE_INTENT.goals.join("\n"));
    setConstraintsText(EXAMPLE_INTENT.constraints.join("\n"));
    setSourceText("");
    void run(EXAMPLE_INTENT, mode);
  };

  const onModeSwitch = (next: EngineMode) => {
    setMode(next);
    void run(currentIntent(), next);
  };

  const onVerify = async () => {
    if (!manifest) return;
    if (mode === "semantic") {
      // Re-run the semantic pipeline and compare receipts
      const fresh = await runSixDSemantic({
        title: manifest.intent.title,
        context: manifest.intent.context,
        goals: manifest.intent.goals,
        constraints: manifest.intent.constraints,
        sourceMaterial: manifest.intent.sourceMaterial,
      });
      setVerify({ status: fresh.receipt === manifest.receipt ? "ok" : "fail", recomputed: fresh.receipt });
    } else {
      const v = await verifyRun(manifest);
      setVerify({ status: v.ok ? "ok" : "fail", recomputed: v.recomputed });
    }
  };

  const trace = useMemo(() => (manifest ? validateTrace(manifest) : null), [manifest]);
  const elementCount = useMemo(
    () => (manifest ? manifest.artifacts.reduce((n, a) => n + a.elements.length, 0) : 0),
    [manifest],
  );
  const allOq = useMemo(
    () => (manifest ? manifest.artifacts.flatMap((a) => a.openQuestions) : []),
    [manifest],
  );

  const art = manifest?.artifacts[active] ?? null;
  const kindsInOrder = useMemo(() => {
    if (!art) return [] as string[];
    const ks: string[] = [];
    for (const e of art.elements) if (!ks.includes(e.kind)) ks.push(e.kind);
    return ks;
  }, [art]);

  const toggleTrace = (id: string) =>
    setOpenTraces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderElement = (e: ArtifactElement) => {
    const isCode = Boolean(e.fields?.language);
    const chips: string[] = [];
    if (e.fields?.estimate) chips.push(`estimate ${e.fields.estimate}`);
    if (Array.isArray(e.fields?.labels)) chips.push(`labels: ${(e.fields.labels as string[]).join(", ")}`);
    if (Array.isArray(e.fields?.dependsOn) && (e.fields.dependsOn as string[]).length)
      chips.push(`depends on ${(e.fields.dependsOn as string[]).join(", ")}`);
    if (e.fields?.type) chips.push(String(e.fields.type));
    const open = openTraces.has(e.id);
    const chain = open && manifest ? lineage(manifest, e.id) : [];
    return (
      <div className={styles.element} key={e.id}>
        {e.title ? <div className={styles.elementTitle}>{e.title}</div> : null}
        {isCode ? <pre className={styles.code}>{e.body}</pre> : <p className={styles.body}>{e.body}</p>}
        {chips.length ? (
          <div className={styles.chipRow}>
            {chips.map((c) => (
              <span className={styles.chip} key={c}>
                {c}
              </span>
            ))}
          </div>
        ) : null}
        <button type="button" className={styles.traceBtn} onClick={() => toggleTrace(e.id)}>
          {open ? "▾" : "▸"} trace · {e.id}
        </button>
        {open ? (
          <div className={styles.traceBox}>
            <div>
              <span className={styles.traceLabel}>direct:</span> {e.sourceRefs.join(" · ")}
            </div>
            <div>
              <span className={styles.traceLabel}>full lineage:</span>{" "}
              {chain.length ? chain.join(" ← ") : "(root)"}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <strong>6D WORKBENCH</strong>
            <span className={styles.brandSub}>powered by the CADMUS Engine</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.modeToggle} role="group" aria-label="Engine mode">
              <button
                type="button"
                className={mode === "v1" ? styles.modeActive : styles.modeBtn}
                onClick={() => onModeSwitch("v1")}
              >
                v1 <span className={styles.modeSub}>keyword</span>
              </button>
              <button
                type="button"
                className={mode === "semantic" ? styles.modeActive : styles.modeBtn}
                onClick={() => onModeSwitch("semantic")}
              >
                Semantic <span className={styles.modeSub}>CADMUS</span>
              </button>
            </div>
            <div className={styles.gatePill}>deterministic · keyless · zero egress</div>
          </div>
        </header>

        <section className={styles.hero}>
          <h1>The 6D path, executed deterministically.</h1>
          <p className={styles.heroSub}>
            One feature intent in — six phase artifacts out: PRD, design records, ticket-ready
            slices, engineering handoff, test design, release inputs. Same intent, same artifacts,
            same hash, every run. Where the intent is silent, the engine asks instead of inventing.
          </p>
          <p className={styles.honest}>
            Synthetic demo · draft accelerators — every artifact is reviewed by its accountable
            owner · process acceleration, not process bypass.
          </p>
        </section>

        <div className={styles.grid}>
          {/* ── Intent rail ─────────────────────────────────────────────── */}
          <aside className={styles.rail}>
            <div className={styles.railHead}>Feature intent</div>
            <label className={styles.label}>
              Title
              <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className={styles.label}>
              Context — the messy ask
              <textarea className={styles.textarea} rows={5} value={context} onChange={(e) => setContext(e.target.value)} />
            </label>
            <label className={styles.label}>
              Goals — one per line
              <textarea className={styles.textarea} rows={4} value={goalsText} onChange={(e) => setGoalsText(e.target.value)} />
            </label>
            <label className={styles.label}>
              Constraints — one per line
              <textarea className={styles.textarea} rows={4} value={constraintsText} onChange={(e) => setConstraintsText(e.target.value)} />
            </label>
            <label className={styles.label}>
              Source material (optional)
              <textarea className={styles.textarea} rows={2} value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
            </label>
            <div className={styles.railActions}>
              <button type="button" className={styles.runBtn} onClick={onRun}>
                Run 6D →
              </button>
              <button type="button" className={styles.ghostBtn} onClick={onLoadExample}>
                Load synthetic example
              </button>
            </div>
          </aside>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <section className={styles.results}>
            {/* ── Semantic panels (visible only in semantic mode) ─────── */}
            {mode === "semantic" && semanticModel ? (
              <>
                {/* Panel 1 — Reconciled entities */}
                <div className={styles.semanticPanel}>
                  <div className={styles.semanticPanelHead}>
                    <div className={styles.semanticPanelTitle}>Reconciled entities</div>
                    <div className={styles.semanticPanelSub}>
                      {semanticModel.entities.length} canonical &middot;{" "}
                      {semanticModel.entities.filter((e) => e.variants.length >= 2).length} merged from multiple surface forms
                    </div>
                  </div>
                  <div className={styles.entityGrid}>
                    {semanticModel.entities.map((e) => {
                      const merged = e.variants.length >= 2;
                      return (
                        <div key={e.id} className={merged ? styles.entityCardMerged : styles.entityCard}>
                          <div className={styles.entityRow}>
                            <span className={styles.entityDisplay}>{e.display}</span>
                            <span className={styles.entityRole}>{e.role}</span>
                            {merged ? (
                              <span className={styles.mergedBadge}>reconciled</span>
                            ) : null}
                          </div>
                          {merged ? (
                            <div className={styles.variantList}>
                              {e.variants.map((v) => (
                                <span key={v} className={styles.variantChip}>&ldquo;{v}&rdquo;</span>
                              ))}
                              <span className={styles.variantArrow}>→ {e.display}</span>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Panel 2 — The frontier */}
                <div className={styles.frontierPanel}>
                  <div className={styles.frontierHead}>
                    <div className={styles.frontierTitle}>Where an LLM is still required — named, not faked</div>
                    <div className={styles.frontierCounts}>
                      <span className={styles.frontierStat}>
                        <strong>{semanticModel.frontier.narrativeRequirements}</strong> narrative reqs
                      </span>
                      <span className={styles.frontierStat}>
                        <strong>{semanticModel.frontier.unresolvedTokens.length}</strong> unresolved tokens
                      </span>
                      <span className={styles.frontierStat}>
                        <strong>{semanticModel.frontier.reviewQueue.length}</strong> merge reviews
                      </span>
                    </div>
                  </div>
                  <ul className={styles.frontierList}>
                    {semanticModel.frontier.llmRequiredFor.map((item, i) => (
                      <li key={i} className={styles.frontierItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}

            {manifest ? (
              <>
                <div className={styles.receiptBar}>
                  <div className={styles.receiptLeft}>
                    <span className={styles.receiptLabel}>receipt</span>
                    <code className={styles.receiptHash} title={manifest.receipt}>
                      sha256:{shortHash(manifest.receipt)}
                    </code>
                    {trace ? (
                      <span className={styles.traceOk}>
                        trace {trace.ok ? "100%" : `${trace.problems.length} problems`} · {elementCount} elements
                      </span>
                    ) : null}
                    {allOq.length ? (
                      <span className={styles.oqCount}>{allOq.length} open questions</span>
                    ) : null}
                  </div>
                  <div className={styles.receiptActions}>
                    <button type="button" className={styles.verifyBtn} onClick={onVerify}>
                      {verify.status === "idle"
                        ? "Verify — re-run & compare"
                        : verify.status === "ok"
                          ? "✓ recomputed — identical"
                          : "✕ MISMATCH"}
                    </button>
                    <button
                      type="button"
                      className={styles.ghostBtn}
                      onClick={() => download("6d-bundle.md", bundleMarkdown(manifest), "text/markdown")}
                    >
                      Export bundle (.md)
                    </button>
                    <button
                      type="button"
                      className={styles.ghostBtn}
                      onClick={() =>
                        download("6d-manifest.json", JSON.stringify(manifest, null, 2), "application/json")
                      }
                    >
                      Manifest (.json)
                    </button>
                  </div>
                </div>

                <div className={styles.tabs}>
                  {manifest.artifacts.map((a, i) => (
                    <button
                      key={a.phase}
                      type="button"
                      className={i === active ? styles.tabActive : styles.tab}
                      onClick={() => setActive(i)}
                    >
                      <span className={styles.tabN}>{a.n}</span>
                      <span className={styles.tabName}>{a.name}</span>
                      <span className={styles.tabRole}>{a.role}</span>
                      {a.openQuestions.length ? (
                        <span className={styles.tabBadge}>{a.openQuestions.length}</span>
                      ) : null}
                    </button>
                  ))}
                </div>

                {art ? (
                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <div>
                        <div className={styles.panelTitle}>
                          {art.n} · {art.name} <span className={styles.panelRole}>({art.role})</span>
                        </div>
                        <div className={styles.panelDeliverable}>{art.deliverable}</div>
                      </div>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => download(`6d-${art.phase}.md`, phaseMarkdown(art), "text/markdown")}
                      >
                        Export phase (.md)
                      </button>
                    </div>

                    {kindsInOrder.map((kind) => (
                      <div className={styles.kindSection} key={kind}>
                        <div className={styles.kindTitle}>{KIND_TITLES[kind] ?? kind}</div>
                        {art.elements.filter((e) => e.kind === kind).map(renderElement)}
                      </div>
                    ))}

                    {art.openQuestions.length ? (
                      <div className={styles.oqSection}>
                        <div className={styles.kindTitle}>Open questions — honest gaps, not guesses</div>
                        {art.openQuestions.map((q) => (
                          <div className={q.blocking ? styles.oqBlocking : styles.oq} key={q.id}>
                            {q.blocking ? <span className={styles.oqFlag}>BLOCKING</span> : null}
                            {q.question}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <div className={styles.panel}>Running…</div>
            )}
          </section>
        </div>

        <footer className={styles.footer}>
          JourdanLabs · 6D Workbench — powered by the CADMUS Engine. No model in the run path · no
          API key · nothing leaves your browser. Open questions are the engine refusing to invent
          what it was not given.
        </footer>
      </div>
    </main>
  );
}
