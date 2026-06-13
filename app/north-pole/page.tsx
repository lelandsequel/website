// NORTH POLE — the whole workshop, idea in to finished+checked work out.
//
// One product page a non-technical buyer understands. The server runs the real
// engines once, deterministically — decide if it's worth building, lay out the
// plan, build it twice (the check refuses the broken pass, then ships the fixed
// one), and close the loop — then hands a PLAIN JSON view-model to the client.
//
// HARD RULE: zero engine words on the glass. The real names (and the loop's
// REFUSE/RESOLVE/RECOMPUTE grammar) live ONLY in the opt-in guided tour. Here we
// say what it DOES, like they're twelve. 🐦‍⬛ + 🔑

import type { Metadata } from "next";

import {
  Shell,
  Hero,
  Section,
  Card,
  Pill,
  ReceiptBar,
  Footer,
  T,
} from "@/components/omnis/ui";
import { ProductNav } from "@/components/products/ProductNav";
import GuidedTour from "@/components/tour/GuidedTour";
import { NORTH_POLE } from "@/lib/products/copy";

import { prioritize, INITIATIVES } from "@/lib/agility";
import { runBuildLeg, STALE_DATA_STORY, type Builder } from "@/lib/build-leg";
import { priceQuote as brokenBuild } from "@/lib/build-leg/demo/broken/priceQuote";
import { priceQuote as fixedBuild } from "@/lib/build-leg/demo/candidate/priceQuote";
import { buildOutcomeToFeedback, applyBuildFeedback } from "@/lib/loop/build-feedback";

import NorthPoleApp, { type BuildVM, type RoundVM } from "./NorthPoleApp";

export const metadata: Metadata = {
  title: `${NORTH_POLE.name} — ${NORTH_POLE.oneLiner}`,
  description: NORTH_POLE.sub,
};

const short = (h: string): string =>
  h.length > 16 ? `${h.slice(0, 8)}…${h.slice(-6)}` : h;

// Plain, human restatements of the build plan — what each rule MEANS, with no
// engine words. Keyed to the story's criteria but the prose is the product's
// own plain English; the machine-readable criteria stay in the tour/engine.
const PLAN_CARDS: Array<{ heading: string; body: string }> = [
  {
    heading: "What it does",
    body: "Quotes a price for a loan when — and only when — the numbers behind it are live and the borrower checks out.",
  },
  {
    heading: "What it touches",
    body: "Two live feeds: today's rate sheet, and the borrower-eligibility service. Both have to be up and current.",
  },
  {
    heading: "The rule it can't break",
    body: "Never quote a price on stale or missing data — and never quote below the locked price floor. If anything's off, it stops instead of guessing.",
  },
  {
    heading: "How we'll know it's done",
    body: "It quotes correctly when both feeds are healthy, refuses when either is stale or down, and every quote leaves a record you can audit.",
  },
];

export default async function NorthPolePage() {
  // ── STAGE 1 — Is it worth building? (decide) ──────────────────────────────
  const portfolio = prioritize(INITIATIVES, { capacity: 12 });
  const initiative = portfolio.funded.find((i) => i.id === STALE_DATA_STORY.sourceInitiative);
  const decided = !!initiative; // it made the funded cut → "yes, this round"
  const rank = (initiative as { _rank?: number } | undefined)?._rank ?? null;
  const scoreBefore =
    (initiative as { _score?: number } | undefined)?._score ?? null;

  // ── STAGE 3 — Build & check (the self-correcting build, run once, server) ──
  const selfCorrecting: Builder = ({ round }) =>
    round === 1 ? { priceQuote: brokenBuild } : { priceQuote: fixedBuild };
  const result = await runBuildLeg(STALE_DATA_STORY, selfCorrecting, { maxRounds: 3 });

  // Translate the two rounds into a PLAIN view-model (no probe/criteria/verdict words).
  const rounds: RoundVM[] = result.rounds.map((r) => {
    const refused = r.verdict.verdict !== "NO_OBJECTION";
    const checks = r.verdict.probes.map((p) => ({
      rule: plainRule(p.id, p.text),
      ok: p.pass,
      detail: plainDetail(p.pass, p.detail),
    }));
    return {
      n: r.round,
      refused,
      headline: refused
        ? "built it — but the check found a real problem"
        : "fixed it, checked again, all clear",
      checks,
      note: refused
        ? "It priced the loan using a rate sheet that was out of date — exactly the kind of quiet, dangerous mistake that ships in real systems. The check caught it and stopped: it would rather refuse than ship something wrong. The exact problem was handed back to be fixed."
        : "Same work, corrected: now it refuses on stale data and on a missing eligibility check, quotes correctly when the feeds are healthy, and leaves an auditable record every time. Only now does it ship.",
      signed: refused
        ? `Signed record of this pass: ${short(r.ledgerHash)} — the refusal is on the record too.`
        : `Signed record of this pass: ${short(r.ledgerHash)}.`,
    };
  });

  // The round that actually shipped carries the full pass/fail checklist the
  // build is graded against; the refused round carries the dangerous miss.
  const shipped = rounds.find((r) => !r.refused) ?? rounds[rounds.length - 1];
  const refusedRound = rounds.find((r) => r.refused);
  const failed = refusedRound ? refusedRound.checks.filter((c) => !c.ok) : [];

  const buildVM: BuildVM = {
    whatItBuilt: "a loan-pricing step for a lending desk",
    rounds,
    humanCallLabel: NORTH_POLE.humanCall.label,
    humanCallPlain: NORTH_POLE.humanCall.plain,
  };

  // ── STAGE 4 — What we learned (close the loop) ────────────────────────────
  // Shipping confirms the idea is deliverable; the counterfactual (had the check
  // never been able to pass it) de-risks it and the lineup re-decides.
  const shippedFeedback = initiative ? buildOutcomeToFeedback(result, initiative) : null;
  const refusedRun = await runBuildLeg(STALE_DATA_STORY, () => ({ priceQuote: brokenBuild }), {
    maxRounds: 3,
  });
  const refusedFeedback = initiative ? buildOutcomeToFeedback(refusedRun, initiative) : null;
  const portfolioAfter = refusedFeedback
    ? prioritize(applyBuildFeedback(INITIATIVES, refusedFeedback), { capacity: 12 })
    : portfolio;
  const scoreAfterRefused =
    (portfolioAfter.funded.find((f) => f.id === STALE_DATA_STORY.sourceInitiative) as
      | { _score?: number }
      | undefined)?._score ?? null;

  const proofItems = NORTH_POLE.proof;

  return (
    <Shell>
      <ProductNav current="/north-pole" />

      <Hero kicker={NORTH_POLE.kicker} title={NORTH_POLE.tagline} chip="SYNTHETIC DATA">
        {NORTH_POLE.sub}
      </Hero>

      {/* ── 1 · Is it worth building? ─────────────────────────────────────── */}
      <Section label={NORTH_POLE.stages[0].label} title={NORTH_POLE.stages[0].plain}>
        <div data-tour="worth">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.65rem",
              marginBottom: "0.9rem",
            }}
          >
            <Card>
              <div style={labelStyle}>The idea</div>
              <div style={{ fontWeight: 700, fontSize: "1.02rem", lineHeight: 1.35 }}>
                {STALE_DATA_STORY.title}
              </div>
            </Card>
            <Card>
              <div style={labelStyle}>The call</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Pill color={decided ? T.green : T.gold}>
                  {decided ? "Yes — build it" : "Not this round"}
                </Pill>
              </div>
              <div style={{ color: T.muted, fontSize: "0.88rem", marginTop: 6 }}>
                {decided
                  ? "It earns a spot in this round's work."
                  : "Good idea — just not what fits right now."}
              </div>
            </Card>
            <Card>
              <div style={labelStyle}>Why</div>
              <div style={{ color: T.muted, fontSize: "0.9rem", lineHeight: 1.55 }}>
                Its value clears the bar against the effort it takes and the room your team
                actually has{rank ? <> — it lands at #{rank} in the lineup</> : null}.
              </div>
            </Card>
          </div>
          <p style={{ color: T.faint, fontSize: "0.88rem", lineHeight: 1.6, margin: 0, maxWidth: "70ch" }}>
            Nothing here is a gut call. Every idea is weighed on what it&rsquo;s worth versus what
            it costs versus the time on hand — and the math is shown, not hidden. The moment the
            real size is known, this decision re-runs on its own.
          </p>
        </div>
      </Section>

      {/* ── 2 · The plan ──────────────────────────────────────────────────── */}
      <Section label={NORTH_POLE.stages[1].label} title={NORTH_POLE.stages[1].plain}>
        <div data-tour="plan">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "0.65rem",
            }}
          >
            {PLAN_CARDS.map((c) => (
              <Card key={c.heading}>
                <div style={labelStyle}>{c.heading}</div>
                <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                  {c.body}
                </p>
              </Card>
            ))}
          </div>

          <div style={{ marginTop: "1.1rem" }}>
            <div style={labelStyle}>
              Definition of done — every one of these must be true to ship
            </div>
            <ul style={{ listStyle: "none", margin: "0.4rem 0 0", padding: 0 }}>
              {shipped.checks.map((check, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "0.3rem 0",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: T.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: T.ink, fontSize: "0.93rem" }}>{check.rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p style={{ color: T.faint, fontSize: "0.86rem", margin: "0.9rem 0 0", maxWidth: "70ch" }}>
          The plan isn&rsquo;t a vibe. Every line traces back to something you actually asked for
          — and the same names get read as the same thing, so nothing slips through the cracks.
        </p>
      </Section>

      {/* ── 3 · Build & check — THE interactive centerpiece (client) ──────── */}
      <NorthPoleApp vm={buildVM} />

      {/* ── 3b · The dangerous miss, up close ─────────────────────────────── */}
      <Section
        label="The dangerous miss, up close"
        title="The broken build didn't crash or look wrong. It shipped a confident, dangerous answer. This is the bug the check exists to stop."
      >
        <div data-tour="miss">
          <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.6, margin: "0 0 0.9rem", maxWidth: "70ch" }}>
            Pass 1 returned a confident price. It looked completely fine — exactly what a code
            review would have signed off on. Here is what the check caught that a human eye would
            not.
          </p>

          {failed.length > 0 ? (
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {failed.map((check, i) => (
                <Card key={i} style={{ borderColor: `${T.red}66`, background: `${T.red}0d` }}>
                  <div style={{ color: T.ink, fontWeight: 700, fontSize: "0.96rem", lineHeight: 1.4 }}>
                    {check.rule}
                  </div>
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 12.5,
                      color: T.red,
                      marginTop: 6,
                      lineHeight: 1.6,
                    }}
                  >
                    What actually happened: {check.detail}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                On this run every rule passed on the first try.
              </p>
            </Card>
          )}

          <div
            style={{
              marginTop: "0.9rem",
              padding: "0.85rem 1rem",
              border: `1px solid ${T.green}55`,
              background: `${T.green}0a`,
              borderRadius: 10,
              color: T.muted,
              fontSize: "0.93rem",
              lineHeight: 1.65,
            }}
          >
            A human eyeballing the code signs off — the number looks right. Only a check that runs
            the real rules against the real result catches that the price was built on stale data.
            That check is the whole product: software that can&rsquo;t lie about whether its own
            work is right.
          </div>
        </div>
      </Section>

      {/* ── 4 · Proof ─────────────────────────────────────────────────────── */}
      <Section label="The receipt" title="A check no one else has — and a record you can trust.">
        <div data-tour="proof">
          <ReceiptBar
            items={proofItems.map((p, i) => ({
              label: `0${i + 1}`,
              value: p,
              color: i === 2 ? T.green : T.ink,
            }))}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.4rem 0.55rem",
              fontFamily: T.mono,
              fontSize: 12,
              lineHeight: 1.6,
              margin: "1rem 0 0",
            }}
          >
            {result.rounds
              .map((r, i) => ({ n: r.round, refused: rounds[i].refused, hash: short(r.ledgerHash) }))
              .map((node, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
                  {i > 0 ? <span style={{ color: T.faint }}>&rarr;</span> : null}
                  <span
                    style={{
                      color: node.refused ? T.red : T.green,
                      border: `1px solid ${node.refused ? T.red : T.green}55`,
                      borderRadius: 8,
                      padding: "0.25rem 0.55rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Pass {node.n} · {node.refused ? "refused" : "shipped"} · {node.hash}
                  </span>
                </span>
              ))}
            <span style={{ color: T.faint }}>&rarr;</span>
            <span
              style={{
                color: T.accent,
                border: `1px solid ${T.accent}55`,
                borderRadius: 8,
                padding: "0.25rem 0.55rem",
                whiteSpace: "nowrap",
                fontWeight: 700,
              }}
            >
              sealed head {short(result.ledgerHead)}
            </span>
          </div>
          <p
            style={{
              fontFamily: T.mono,
              fontSize: 11.5,
              color: T.faint,
              margin: "0.55rem 0 0",
              lineHeight: 1.6,
            }}
          >
            Every step — including the refusal — is sealed in order. Change any one of them and the
            chain breaks.
          </p>

          <p
            style={{
              fontFamily: T.mono,
              fontSize: 11.5,
              color: T.faint,
              margin: "0.7rem 0 0",
              lineHeight: 1.6,
            }}
          >
            Signed record · both passes sealed · head {short(result.ledgerHead)} — run it again and
            you get the exact same result, every time.
          </p>
        </div>
      </Section>

      {/* ── 5 · What we learned ───────────────────────────────────────────── */}
      <Section label={NORTH_POLE.stages[3].label} title={NORTH_POLE.stages[3].plain}>
        <div data-tour="learned">
          {shippedFeedback && refusedFeedback ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "0.65rem",
                  marginBottom: "0.9rem",
                }}
              >
                <Card style={{ borderColor: `${T.green}55`, background: `${T.green}0d` }}>
                  <div style={labelStyle}>What shipping proved</div>
                  <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                    The work made it through the check clean, so the lineup stops{" "}
                    <em>guessing</em> whether this can be delivered — it was. The idea&rsquo;s spot
                    is{" "}
                    {shippedFeedback.confidenceChanged ? "updated on what was measured" : "confirmed"}.
                  </p>
                </Card>
                <Card style={{ borderColor: `${T.gold}55`, background: `${T.gold}0d` }}>
                  <div style={labelStyle}>And if it couldn&rsquo;t pass</div>
                  <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                    Had the check never been able to clear it, the idea would look riskier — its
                    score {scoreBefore} → {scoreAfterRefused} — and the lineup would re-decide. The
                    workshop won&rsquo;t keep pouring time into what it can&rsquo;t actually finish.
                  </p>
                </Card>
              </div>
              <div
                style={{
                  padding: "0.85rem 1rem",
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 10,
                  background: `${T.accent}0a`,
                  fontFamily: T.mono,
                  fontSize: 12.5,
                  color: T.muted,
                  lineHeight: 1.7,
                }}
              >
                <span style={{ color: T.accent, fontWeight: 700 }}>The loop closes. </span>
                Decide what&rsquo;s worth it → write the plan → build it → check it → learn from
                what the build proved → decide again. Round and round it goes.
              </div>
            </>
          ) : (
            <Card>
              <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                What the build proved goes back to the top, and the lineup decides what&rsquo;s
                next — on what was measured, not guessed.
              </p>
            </Card>
          )}
        </div>
      </Section>

      <Footer>
        <div style={{ marginBottom: "0.6rem" }}>
          One workshop, end to end: an idea goes in, finished and checked work comes out — and it
          stops itself rather than ship something wrong. Every number here comes from the real
          machinery; nothing is faked. The data is synthetic.
        </div>
        <div>🐦‍⬛ + 🔑</div>
      </Footer>

      <GuidedTour
        steps={NORTH_POLE.tour}
        storageKey={NORTH_POLE.storageKey}
        launchLabel="How it works"
        autoLaunch
      />
    </Shell>
  );
}

// ── Plain-language helpers (criteria → human words, no engine vocabulary) ────

const labelStyle = {
  fontFamily: T.mono,
  fontSize: 11,
  color: T.faint,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  marginBottom: 4,
};

/** Map a criterion id to a plain, human rule. Falls back to the spec text. */
function plainRule(id: string, fallback: string): string {
  switch (id) {
    case "ac.1":
      return "Won't quote a price on a stale rate sheet.";
    case "ac.2":
      return "Won't quote when the borrower-check service is down.";
    case "ac.3":
      return "Does quote correctly when both feeds are healthy.";
    case "ac.4":
      return "Never quotes below the locked price floor.";
    case "ac.5":
      return "Leaves an auditable record on every quote.";
    default:
      return fallback;
  }
}

/** Strip engine/JSON noise from probe details into a short plain phrase. */
function plainDetail(pass: boolean, raw: string): string {
  if (pass) {
    if (/refused on a stale/i.test(raw)) return "stopped instead of pricing on stale data";
    if (/refused when eligibility/i.test(raw)) return "stopped when the borrower-check was down";
    if (/^quoted \d/i.test(raw)) return "returned a correct price";
    if (/respects the/i.test(raw)) return "stayed at or above the price floor";
    if (/auditable/i.test(raw)) return "full record kept";
    return "passed";
  }
  if (/PRICED on stale/i.test(raw)) return "it priced on stale data — the dangerous miss";
  if (/quoted without eligibility/i.test(raw)) return "it quoted without checking the borrower";
  if (/BELOW the/i.test(raw)) return "it dipped below the price floor";
  if (/incomplete/i.test(raw)) return "the record was incomplete";
  return "failed the check";
}
