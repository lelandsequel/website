// CADMUS — the meaning-driven spec engine. Showcase, on the OMNIS design system.
// Runs the semantic pipeline on a sample intent and surfaces what keyword parsing
// can't: reconciled entities, typed requirements, and the honest frontier. 🐦‍⬛ + 🔑

import type { Metadata } from "next";

import { runSixDCosmicSemantic } from "@/lib/six-d/semantic/run-semantic";
import type { IntentSemanticModel } from "@/lib/six-d/semantic/model";
import { Shell, DemoNav, Hero, Section, Card, Pill, ReceiptBar, FrontierPanel, Footer, T } from "@/components/omnis/ui";

export const metadata: Metadata = {
  title: "CADMUS — the spec engine that reads what you mean | JourdanLabs",
  description:
    "CADMUS reconciles an intent's entities (NEBULA), types its requirements (ASTRAL), builds the spec from that meaning, then binds (VELLUM), gates (AURORA) and chains (LUNA) it — and names exactly where an LLM is still required instead of faking it. The spec stage of the OMNIS loop. Deterministic, keyless, synthetic data.",
};

const SAMPLE_INTENT = {
  title: "Correspondent Pricing Engine",
  context:
    "Servicing agents and the servicing agent both need real-time quotes. The agent must price against the live rate-sheet feed; if the rate sheet is stale the engine must refuse to quote. It must check the eligibility service before pricing. Response must complete within 2 seconds at the p95.",
  goals: ["Win lock volume with faster, sharper quotes", "Never quote below the locked margin floor"],
  constraints: [
    "Integrates with the rate-sheet feed and the eligibility service",
    "Every quote must be logged for audit within 1 second",
  ],
  sourceMaterial: ["Capital Markets uplift study CM-2026-07"],
};

const short = (h: string): string => (h.length > 18 ? `${h.slice(0, 10)}…${h.slice(-6)}` : h);

export default async function CadmusSemanticPage() {
  const { run, entry } = await runSixDCosmicSemantic(SAMPLE_INTENT);
  const m = (run.manifest as unknown as { semantic: IntentSemanticModel }).semantic;
  const bound = run.provenance.filter((p) => p.status === "BOUND").length;
  const phases = run.manifest.artifacts.map((a) => ({ phase: a.phase, n: a.elements.length }));

  return (
    <Shell>
      <DemoNav current="/omnis/semantic" />
      <Hero kicker="JourdanLabs · CADMUS — the spec engine · OMNIS loop" title="It reads what you mean." chip="SYNTHETIC DATA">
        CADMUS <strong style={{ color: T.ink }}>reconciles</strong> an intent&rsquo;s entities (NEBULA),{" "}
        <strong style={{ color: T.ink }}>types</strong> its requirements (ASTRAL), and builds the spec from that meaning
        — then VELLUM binds every element to a source, AURORA gates it, LUNA chains it. And where it can&rsquo;t be
        sure, it <strong style={{ color: T.green }}>names exactly where an LLM is still required</strong> instead of
        faking it. Deterministic · keyless · meaning-driven.
      </Hero>

      <Section label="① Reconciliation — NEBULA" title="Keyword parsing sees strings. CADMUS sees entities — and merges the surface forms that mean the same thing, with provenance. The thing a substring scan structurally cannot do.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "0.7rem" }}>
          {m.entities.map((e) => (
            <Card key={e.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Pill>{e.role}</Pill>
                <strong style={{ fontSize: "1.02rem" }}>{e.display}</strong>
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 12.5, color: T.muted, lineHeight: 1.7 }}>
                {e.variants.map((v, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: T.faint }}> · </span>}&ldquo;{v}&rdquo;
                  </span>
                ))}
                {e.variants.length >= 2 && (
                  <div style={{ color: T.green, marginTop: 4 }}>↳ reconciled into one entity from {e.variants.length} mentions</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section label="② Typed requirements — ASTRAL">
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {m.requirements.map((r, i) => {
            const budget = r.typing.canonical?.budget as { raw?: string } | undefined;
            const narrative = r.typing.ears === "narrative";
            return (
              <Card key={i} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <Pill color={narrative ? T.gold : T.green}>{r.typing.ears}</Pill>
                <Pill>{r.typing.modality}</Pill>
                {budget?.raw && <Pill color={T.gold}>budget {budget.raw}</Pill>}
                <span style={{ color: T.muted, fontSize: "0.92rem", flex: 1, minWidth: "40%" }}>{r.text}</span>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section
        label="③ The frontier — named, not faked"
        color={T.green}
        title="What makes CADMUS trustworthy: it does not pretend to understand arbitrary prose. It reconciles and types what it can, and reports — precisely — where a model would still be required."
      >
        <FrontierPanel
          stats={[
            { n: m.frontier.narrativeRequirements, label: "narrative req(s)" },
            { n: m.frontier.unresolvedTokens.length, label: "residual token(s)" },
            { n: m.frontier.reviewQueue.length, label: "merge(s) to adjudicate" },
          ]}
          items={m.frontier.llmRequiredFor}
        />
      </Section>

      <Section label="④ The governed spec — VELLUM · AURORA · LUNA">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
          {phases.map((p) => (
            <Card key={p.phase} style={{ padding: "0.5rem 0.8rem", textAlign: "center", minWidth: 92 }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.faint, textTransform: "uppercase" }}>{p.phase}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{p.n}</div>
            </Card>
          ))}
        </div>
        <ReceiptBar
          items={[
            { label: "VELLUM", value: `${bound}/${run.provenance.length} bound`, color: T.green },
            { label: "AURORA", value: `NO_OBJECTION ${run.gate.summary.NO_OBJECTION} · HOLD ${run.gate.summary.HOLD} · REFUSE ${run.gate.summary.REFUSE}` },
            { label: "LUNA", value: short(entry.hash), color: T.accent },
            { label: "fingerprint", value: m.fingerprint, color: T.accent },
          ]}
        />
      </Section>

      <Footer>
        CADMUS — the JourdanLabs spec engine, the spec stage of the OMNIS loop. Meaning in, governed spec out, the gap
        named not faked. Every element here traces to a source; the receipt re-runs identically. This page runs the same
        engine the loop does. 🐦‍⬛ + 🔑
      </Footer>
    </Shell>
  );
}
