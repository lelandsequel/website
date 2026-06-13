// OMNIS FACTORY — the flagship. One initiative, idea to gated build, the whole
// loop as one cohesive scroll. Agility decides → CADMUS specs from reconciled
// meaning → build leg builds + gates → Agility re-decides on what was proven.
// A receipt riding the whole circle. 🐦‍⬛ + 🔑

import type { Metadata } from "next";

import { prioritize, INITIATIVES } from "@/lib/agility";
import { initiativeToIntent, artifactsToInitiativeUpdate } from "@/lib/loop/adapter";
import { runSixDCosmicSemantic } from "@/lib/six-d/semantic/run-semantic";
import type { IntentSemanticModel } from "@/lib/six-d/semantic/model";
import { runBuildLeg, STALE_DATA_STORY } from "@/lib/build-leg";
import { priceQuote as brokenBuild } from "@/lib/build-leg/demo/broken/priceQuote";
import { priceQuote as fixedBuild } from "@/lib/build-leg/demo/candidate/priceQuote";
import { buildOutcomeToFeedback, applyBuildFeedback } from "@/lib/loop/build-feedback";
import {
  Shell,
  DemoNav,
  Hero,
  Section,
  Card,
  Pill,
  ReceiptBar,
  FrontierPanel,
  Footer,
  T,
} from "@/components/omnis/ui";

export const metadata: Metadata = {
  title:
    "OMNIS Factory — one initiative, idea to gated build | JourdanLabs",
  description:
    "The whole OMNIS loop on one page: Agility decides what to build, CADMUS specs it from reconciled meaning, the build leg builds and gates it, and the proven deliverability re-enters Agility to re-decide. A receipt riding the whole circle. Deterministic, keyless, synthetic data.",
};

const short = (h: string): string =>
  h.length > 18 ? `${h.slice(0, 10)}…${h.slice(-6)}` : h;

export default async function FactoryFlagshipPage() {
  // ── DATA SPINE — deterministic, all server-side ──────────────────────────────

  // ① Agility decides
  const portfolio = prioritize(INITIATIVES, { capacity: 12 });
  const init = portfolio.funded.find((i) => i.id === "HL-002")!;

  // ② CADMUS specs it — semantic pipeline: NEBULA → ASTRAL → VELLUM → AURORA → LUNA
  const { run, entry } = await runSixDCosmicSemantic(initiativeToIntent(init));
  const model = (run.manifest as unknown as { semantic: IntentSemanticModel }).semantic;
  const update = artifactsToInitiativeUpdate(run, init, entry.hash);

  // ③ Build + gate — self-correcting: broken round 1, fixed round 2
  const build = await runBuildLeg(
    STALE_DATA_STORY,
    ({ round }) => (round === 1 ? { priceQuote: brokenBuild } : { priceQuote: fixedBuild }),
    { maxRounds: 3 },
  );

  // ④ Back to Agility — proven deliverability re-enters the portfolio
  const feedback = buildOutcomeToFeedback(build, init);
  const after = prioritize(applyBuildFeedback(INITIATIVES, feedback), { capacity: 12 });

  // Score access helpers (engine attaches underscore-prefixed fields post-run)
  const scoreBefore = (portfolio.funded.find((f) => f.id === "HL-002") as { _score?: number })?._score ?? null;
  const scoreAfter = (after.funded.find((f) => f.id === "HL-002") as { _score?: number })?._score ?? null;
  const rankBefore = (init as { _rank?: number })._rank ?? null;

  // Provenance stats for the spec receipt
  const boundCount = run.provenance.filter((p) => p.status === "BOUND").length;
  const phases = run.manifest.artifacts.map((a) => ({
    phase: a.phase,
    n: a.elements.length,
  }));

  // Round display data
  const round1 = build.rounds[0];
  const round2 = build.rounds[1];
  const failingCriteria = round1.verdict.probes.filter((p) => !p.pass);

  return (
    <Shell>
      <DemoNav current="/omnis/factory" />
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <Hero
        kicker="JourdanLabs · OMNIS — the software factory"
        title="One initiative, idea to gated build."
        chip="SYNTHETIC DATA"
      >
        Agility decides what to build. CADMUS{" "}
        <strong style={{ color: T.ink }}>specs it from reconciled meaning</strong> — not keyword
        parsing. The build leg{" "}
        <strong style={{ color: T.ink }}>builds it and gates it</strong> against executable
        acceptance criteria. And the proven deliverability{" "}
        <strong style={{ color: T.ink }}>re-enters Agility</strong> to re-decide — a receipt
        riding the whole circle. Deterministic · keyless · zero egress.
      </Hero>

      {/* Loop ribbon */}
      <div
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          alignItems: "center",
          fontFamily: T.mono,
          fontSize: 11.5,
          letterSpacing: "0.04em",
          marginBottom: "2.4rem",
          padding: "0.55rem 0.85rem",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          background: "rgba(20,22,31,0.55)",
        }}
      >
        {[
          { label: "① Agility decides", active: false },
          { label: "→", sep: true },
          { label: "② CADMUS specs", active: false },
          { label: "→", sep: true },
          { label: "③ Build + gate", active: false },
          { label: "→", sep: true },
          { label: "④ Re-decide ↺", active: false },
        ].map((item, i) =>
          item.sep ? (
            <span key={i} style={{ color: T.faint }}>
              {item.label}
            </span>
          ) : (
            <span key={i} style={{ color: T.accent }}>
              {item.label}
            </span>
          ),
        )}
        <span style={{ color: T.faint, marginLeft: "auto" }}>
          HL-002 · {init.title}
        </span>
      </div>

      {/* ── ① AGILITY DECIDES ─────────────────────────────────────────────────── */}
      <Section
        label="① Agility decides"
        title="RICE × 3-yr NPV, mandate carve-out, tier, and allocate. The engine answers: what should we build with the capacity we have? HL-002 makes the funded cut."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.65rem",
            marginBottom: "0.8rem",
          }}
        >
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Initiative
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{init.id}</div>
            <div style={{ color: T.muted, fontSize: "0.9rem", marginTop: 2 }}>
              {init.title}
            </div>
          </Card>
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Rank / Score
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              #{rankBefore}{" "}
              <span style={{ color: T.muted, fontWeight: 400, fontSize: "0.9rem" }}>
                score {scoreBefore}
              </span>
            </div>
            <div style={{ color: T.muted, fontSize: "0.88rem", marginTop: 2 }}>
              funded · capacity 12w
            </div>
          </Card>
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Value type
            </div>
            <Pill color={T.gold}>{init.valueType}</Pill>
            <div style={{ color: T.muted, fontSize: "0.88rem", marginTop: 4 }}>
              {init.reach.value.toLocaleString()} {init.reach.unit}
            </div>
          </Card>
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Rough effort
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              {init.effortTeamWeeks}w
            </div>
            <div style={{ color: T.muted, fontSize: "0.88rem", marginTop: 2 }}>
              before spec measures it
            </div>
          </Card>
        </div>
        <ReceiptBar
          items={[
            {
              label: "area",
              value: init.area,
            },
            {
              label: "sponsor",
              value: init.sponsor,
            },
            {
              label: "confidence",
              value: `delivery ${init.deliveryConfidence} · value ${init.valueConfidence}`,
            },
            {
              label: "portfolio head",
              value: short(portfolio.head ?? ""),
              color: T.accent,
            },
          ]}
        />
      </Section>

      {/* ── ② CADMUS SPECS IT ────────────────────────────────────────────────── */}
      <Section
        label="② CADMUS specs it"
        color={T.accent}
        title="The intent flows through NEBULA (entity reconciliation) → ASTRAL (requirement typing) → VELLUM → AURORA → LUNA. The spec is built from reconciled meaning, not keyword buckets."
      >
        {/* Entity reconciliation */}
        <p
          style={{
            fontFamily: T.mono,
            fontSize: 11.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: T.accent,
            margin: "0 0 0.55rem",
          }}
        >
          NEBULA — entity reconciliation
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0.6rem",
            marginBottom: "1.2rem",
          }}
        >
          {model.entities.map((e) => (
            <Card key={e.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <Pill>{e.role}</Pill>
                <strong style={{ fontSize: "0.98rem" }}>{e.display}</strong>
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 12,
                  color: T.muted,
                  lineHeight: 1.65,
                }}
              >
                {e.variants.map((v, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: T.faint }}> · </span>}
                    &ldquo;{v}&rdquo;
                  </span>
                ))}
                {e.variants.length >= 2 && (
                  <div style={{ color: T.green, marginTop: 3, fontSize: 11.5 }}>
                    ↳ reconciled from {e.variants.length} mentions
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* A sample of typed requirements */}
        <p
          style={{
            fontFamily: T.mono,
            fontSize: 11.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: T.accent,
            margin: "0 0 0.55rem",
          }}
        >
          ASTRAL — typed requirements ({model.requirements.length} total, showing first 5)
        </p>
        <div style={{ display: "grid", gap: "0.4rem", marginBottom: "1.2rem" }}>
          {model.requirements.slice(0, 5).map((r) => {
            const narrative = r.typing.ears === "narrative";
            const budget = r.typing.canonical?.budget as { raw?: string } | undefined;
            return (
              <Card
                key={r.id}
                style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
              >
                <Pill color={narrative ? T.gold : T.green}>{r.typing.ears}</Pill>
                <Pill>{r.typing.modality}</Pill>
                {budget?.raw && <Pill color={T.gold}>budget {budget.raw}</Pill>}
                <span
                  style={{
                    color: T.muted,
                    fontSize: "0.9rem",
                    flex: 1,
                    minWidth: "40%",
                  }}
                >
                  {r.text}
                </span>
              </Card>
            );
          })}
        </div>

        {/* Re-estimate — the key loop payload */}
        <Card
          style={{
            marginBottom: "1.2rem",
            display: "flex",
            gap: "1.4rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Rough effort (Agility)
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: T.muted }}>
              {update.roughEffortTeamWeeks}w
            </div>
          </div>
          <div style={{ fontSize: "1.3rem", color: T.faint }}>→</div>
          <div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Re-estimated (6D decomposed)
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: update.reEstimateDiffers ? T.gold : T.green,
              }}
            >
              {update.reEstimatedEffortTeamWeeks}w
            </div>
          </div>
          {update.reEstimateDiffers && (
            <div style={{ color: T.gold, fontSize: "0.88rem", maxWidth: "28ch" }}>
              Spec decomposed the real size — Agility will re-rank on the actual number, not the
              napkin.
            </div>
          )}
        </Card>

        {/* The frontier — first-class */}
        <p
          style={{
            fontFamily: T.mono,
            fontSize: 11.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: T.green,
            margin: "0 0 0.55rem",
          }}
        >
          The frontier — named, not faked
        </p>
        <FrontierPanel
          stats={[
            { n: model.frontier.narrativeRequirements, label: "narrative req(s)" },
            { n: model.frontier.unresolvedTokens.length, label: "residual token(s)" },
            { n: model.frontier.reviewQueue.length, label: "merge(s) to adjudicate" },
          ]}
          items={model.frontier.llmRequiredFor}
        />

        {/* Phase manifest + receipt */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            margin: "1rem 0 0.8rem",
          }}
        >
          {phases.map((p) => (
            <Card
              key={p.phase}
              style={{ padding: "0.45rem 0.75rem", textAlign: "center", minWidth: 88 }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10.5,
                  color: T.faint,
                  textTransform: "uppercase",
                }}
              >
                {p.phase}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{p.n}</div>
            </Card>
          ))}
        </div>
        <ReceiptBar
          items={[
            {
              label: "VELLUM",
              value: `${boundCount}/${run.provenance.length} bound`,
              color: T.green,
            },
            {
              label: "AURORA",
              value: `NO_OBJECTION ${run.gate.summary.NO_OBJECTION} · HOLD ${run.gate.summary.HOLD} · REFUSE ${run.gate.summary.REFUSE}`,
            },
            { label: "LUNA", value: short(entry.hash), color: T.accent },
            { label: "open issues", value: update.openIssueCount, color: update.openIssueCount > 0 ? T.gold : T.green },
          ]}
        />
      </Section>

      {/* ── ③ BUILD + GATE ───────────────────────────────────────────────────── */}
      <Section
        label="③ Build + gate"
        color={T.red}
        title="The build leg runs the acceptance criteria as executable probes. The builder self-corrects: REFUSE → RESOLVE → RECOMPUTE until NO_OBJECTION."
      >
        {/* Round 1 — REFUSE */}
        {round1 && (
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "0.6rem",
              }}
            >
              <Pill color={T.red}>ROUND 1</Pill>
              <Pill color={T.red}>{round1.verdict.verdict}</Pill>
              <span
                style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}
              >
                {round1.verdict.blockingFailures} blocking failure(s) · build cannot ship
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {failingCriteria.map((p) => (
                <Card key={p.id} style={{ borderColor: `${T.red}44`, background: `${T.red}0a` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Pill color={T.red}>{p.id}</Pill>
                    {p.blocking && <Pill color={T.red}>BLOCKING</Pill>}
                    <span style={{ color: T.muted, fontSize: "0.88rem", flex: 1 }}>
                      {p.text}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11.5,
                      color: T.red,
                      marginTop: 4,
                    }}
                  >
                    ✗ {p.detail}
                  </div>
                </Card>
              ))}
            </div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11.5,
                color: T.muted,
                marginTop: "0.5rem",
                paddingLeft: "0.5rem",
                borderLeft: `2px solid ${T.border}`,
              }}
            >
              LUNA seq {round1.ledgerSeq} · {short(round1.ledgerHash)} — refuse sealed to chain
            </div>
          </div>
        )}

        {/* Round 2 — NO_OBJECTION */}
        {round2 && (
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "0.6rem",
              }}
            >
              <Pill color={T.green}>ROUND 2</Pill>
              <Pill color={T.green}>{round2.verdict.verdict}</Pill>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>
                {round2.verdict.passed}/{round2.verdict.probes.length} acceptance criteria · build
                ships
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {round2.verdict.probes.map((p) => (
                <Card
                  key={p.id}
                  style={{ borderColor: `${T.green}44`, background: `${T.green}0a` }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Pill color={T.green}>{p.id}</Pill>
                    <span style={{ color: T.muted, fontSize: "0.88rem", flex: 1 }}>
                      {p.text}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11.5,
                      color: T.green,
                      marginTop: 4,
                    }}
                  >
                    ✓ {p.detail}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <ReceiptBar
          items={[
            {
              label: "status",
              value: build.status,
              color: build.status === "shipped" ? T.green : T.red,
            },
            {
              label: "rounds to green",
              value: build.roundsToGreen ?? "—",
              color: T.gold,
            },
            { label: "LUNA head", value: short(build.ledgerHead), color: T.accent },
          ]}
        />
      </Section>

      {/* ── ④ BACK TO AGILITY ───────────────────────────────────────────────── */}
      <Section
        label="④ Back to Agility"
        color={T.gold}
        title="The build's proven deliverability re-enters Agility. 6D fed back effort; the build leg feeds back delivery confidence — Agility stops guessing, re-decides on what was measured."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.65rem",
            marginBottom: "0.9rem",
          }}
        >
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Proven delivery confidence
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: T.green,
              }}
            >
              {feedback.provenDeliveryConfidence.toFixed(1)}
            </div>
            <div style={{ color: T.muted, fontSize: "0.85rem", marginTop: 2 }}>
              shipped after {build.roundsToGreen} round(s)
            </div>
          </Card>
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Prior confidence
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: T.muted }}>
              {feedback.priorDeliveryConfidence.toFixed(1)}
            </div>
            <div style={{ color: T.muted, fontSize: "0.85rem", marginTop: 2 }}>
              {feedback.confidenceChanged ? "REVISED" : "CONFIRMED — build proved it"}
            </div>
          </Card>
          <Card>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.faint,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              HL-002 score
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: T.gold,
              }}
            >
              {scoreBefore} → {scoreAfter}
            </div>
            <div style={{ color: T.muted, fontSize: "0.85rem", marginTop: 2 }}>
              {scoreBefore === scoreAfter
                ? "unchanged — confidence held"
                : "re-ranked on what was proven"}
            </div>
          </Card>
        </div>

        <ReceiptBar
          items={[
            {
              label: "build receipt",
              value: short(feedback.buildReceipt),
              color: T.accent,
            },
            {
              label: "Agility head before",
              value: short(portfolio.head ?? ""),
              color: T.faint,
            },
            {
              label: "Agility head after",
              value: short(after.head ?? ""),
              color: portfolio.head === after.head ? T.faint : T.gold,
            },
          ]}
        />

        {/* The circuit diagram — loop closed */}
        <div
          style={{
            marginTop: "1.2rem",
            padding: "1rem 1.1rem",
            border: `1px solid ${T.gold}44`,
            borderRadius: 10,
            background: `${T.gold}08`,
            fontFamily: T.mono,
            fontSize: 12.5,
            color: T.muted,
            lineHeight: 1.75,
          }}
        >
          <div style={{ color: T.gold, fontWeight: 700, marginBottom: 6 }}>
            The loop closed.
          </div>
          <div>Agility → rough effort {update.roughEffortTeamWeeks}w, score {scoreBefore}</div>
          <div>
            CADMUS → decomposed {update.reEstimatedEffortTeamWeeks}w, {model.entities.length}{" "}
            entities, {model.requirements.length} requirements, frontier named
          </div>
          <div>
            Build → REFUSE round 1, NO_OBJECTION round 2, delivery confidence{" "}
            {feedback.provenDeliveryConfidence.toFixed(1)}
          </div>
          <div>
            Agility re-decided → score {scoreAfter}, confidence{" "}
            {feedback.confidenceChanged ? "revised" : "confirmed by the gate"}
          </div>
          <div style={{ color: T.accent, marginTop: 4 }}>
            LUNA: spec {short(entry.hash)} · build {short(build.ledgerHead)}
          </div>
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <Footer>
        <div style={{ marginBottom: "0.7rem" }}>
          OMNIS: meaning in, governed spec out, gated build, re-decided on what was
          measured. Every number on this page comes from the real engines — no model, no
          estimation, no faking. The frontier is named not hidden. The receipt rides the
          whole circle.
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <a href="/6d" style={{ color: T.accent, textDecoration: "none" }}>
            /6d — spec workbench
          </a>
          <a href="/omnis/semantic" style={{ color: T.accent, textDecoration: "none" }}>
            /omnis/semantic — CADMUS engine
          </a>
          <a href="/loop" style={{ color: T.accent, textDecoration: "none" }}>
            /loop — the full Agility ↔ 6D loop
          </a>
          <a href="/factory" style={{ color: T.accent, textDecoration: "none" }}>
            /factory — build leg deep dive
          </a>
        </div>
        <div>🐦‍⬛ + 🔑</div>
      </Footer>
    </Shell>
  );
}
