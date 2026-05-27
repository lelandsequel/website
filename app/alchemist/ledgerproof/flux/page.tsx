import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "Flux Inquest - LedgerProof",
  description:
    "ALCHEMIST Flux Inquest explains variances only when volume, price, mix, customer, or timing evidence supports the claim.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "1rem",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.72 },
  note: {
    marginTop: "1rem",
    padding: "0.9rem 1rem",
    borderRadius: 16,
    border: "1px solid var(--accent-border)",
    background: "var(--accent-dim)",
    color: "var(--purple-900)",
    fontSize: "0.86rem",
    fontWeight: 760,
    lineHeight: 1.52,
  },
  packetPre: {
    whiteSpace: "pre-wrap",
    margin: 0,
    minHeight: 520,
    color: "var(--text-primary)",
  },
  outputList: { display: "grid", gap: "0.7rem", marginTop: "1rem" },
  outputItem: {
    padding: "0.9rem",
    borderRadius: 16,
    border: "1px solid var(--bg-border)",
    background: "rgba(255,255,255,0.82)",
  },
};

const varianceInputs = [
  ["Whole flux packet", "P&L, bridges, support files", "Ingested"],
  ["P&L flux", "Revenue +38%", "Flagged"],
  ["Sales volume", "Units +18%", "Supported"],
  ["Price bridge", "ASP +9%", "Supported"],
  ["Product mix", "Enterprise SKU shift", "Supported"],
  ["Customer cohort", "Top 3 customers +$412k", "Supported"],
  ["Timing evidence", "Pull-forward found", "Partial"],
  ["Management note", "\"Strong demand\"", "Too vague"],
  ["Proof ledger", "4 tied drivers", "1 refusal"],
];

const evidenceDrivers = [
  {
    code: "VOLUME_TIE",
    title: "Volume evidence",
    detail:
      "Unit shipments rose 18% and tie to order logs, billings, and delivery records. The explanation can cite volume only for the supported portion of the variance.",
    source: "shipment_log_april.csv + invoice_register.csv",
  },
  {
    code: "PRICE_TIE",
    title: "Price evidence",
    detail:
      "Average selling price increased 9% after discount approvals changed for two enterprise contracts. The bridge ties to signed order forms.",
    source: "price_bridge_q2.xlsx",
  },
  {
    code: "MIX_TIE",
    title: "Mix evidence",
    detail:
      "High-margin enterprise SKUs grew from 31% to 44% of sales. Flux Inquest accepts mix only because SKU-level support reconciles to revenue.",
    source: "sku_mix_rollforward.csv",
  },
  {
    code: "CUSTOMER_TIE",
    title: "Customer evidence",
    detail:
      "Three named customers explain $412,000 of the increase. Each customer claim links to invoice, contract, and collection evidence.",
    source: "customer_bridge_april.xlsx",
  },
  {
    code: "TIMING_PARTIAL",
    title: "Timing evidence",
    detail:
      "A $96,000 pull-forward from May is supported, but a second timing claim lacks delivery proof. The unsupported portion is refused.",
    source: "cutoff_review_AR-20491.pdf",
  },
];

const proofRows = [
  ["Revenue", "+$684k", "SUPPORTED", "Volume, price, mix, customer, and partial timing bridge"],
  ["Gross margin", "+420 bps", "SUPPORTED", "SKU mix and vendor cost schedules tie"],
  ["Sales commissions", "+$73k", "UNSUPPORTED", "Explanation says hiring ramp; payroll roster does not tie"],
  ["Hosting cost", "-$41k", "CONTRADICTED", "Usage report increased while cost decreased"],
  ["Professional fees", "+$58k", "VAGUE", "Consulting activity cited without invoice or SOW support"],
  ["Bad debt", "+$22k", "PROVEN", "Reserve schedule ties to aged receivables"],
];

const refusalRules = [
  ["Volume", "Accept only when units, shipments, orders, or usage reconcile to the variance."],
  ["Price", "Accept only when rate cards, discounts, contracts, or ASP bridges support the claim."],
  ["Mix", "Accept only when SKU, product, channel, or margin mix ties to source records."],
  ["Customer", "Accept only when named customers explain the movement with traceable evidence."],
  ["Timing", "Accept only when cutoff, billing, delivery, or accrual support proves period movement."],
  ["Vague claims", "Refuse explanations like market strength, seasonality, normalization, or timing without proof."],
];

const rejectedNotes = [
  "Revenue increased because demand was strong.",
  "Margins improved due to operational discipline.",
  "Professional fees were higher because of normal timing.",
  "Commissions changed because the sales team was active.",
];

const fluxVariancePacket = `LEDGERPROOF FLUX INQUEST TEST PACKET
Company: Northstar Robotics, Inc.
Close period: April 2026
Task: Ingest the whole variance workpaper packet and decide which explanations can pass the close binder release gate. Return release decision, accepted driver claims, refused explanations, missing evidence, allowed binder language, and recovery actions. Do not provide assurance.

Packet manifest:
- Workpapers included: P&L flux, revenue driver bridge, SKU mix rollforward, customer bridge, timing cutoff schedule, commission analysis, hosting usage report, professional-fee support
- Required release gate: narrative may enter the binder only to the extent it ties to source-backed volume, price, mix, customer, timing, or account-specific evidence
- Requested export: reviewer-ready flux packet

P&L flux:
- Revenue March 2026: $1,800,900
- Revenue April 2026: $2,484,900
- Variance: +$684,000 / +38.0%
- Management note: "Revenue increased because demand was strong and the team executed well."

Attached driver evidence:
1. Volume bridge: March units 1,020; April units 1,204; unit increase explains $258,000. Ties to shipment_log_april.csv and invoice_register_april.csv.
2. Price bridge: ASP increased from $1,765 to $1,924; price movement explains $191,000. Ties to signed order forms for two enterprise contracts.
3. Mix bridge: Enterprise SKU share increased from 31% to 44%; mix explains $139,000. Ties to sku_mix_rollforward.csv.
4. Customer bridge: Customers Atlas, Boreal, and Coda explain $412,000 of the revenue increase. Each has invoice, contract, and collection support.
5. Timing bridge: $96,000 of April revenue was pulled forward from May. Invoice AR-20491 for $38,400 has delivery proof dated May 3; no April delivery evidence. A second timing claim for $57,600 has no delivery proof attached.

Other fluxes:
- Gross margin: +420 bps. Ties to SKU mix and vendor cost schedules.
- Sales commissions: +$73,000. Explanation says hiring ramp, but payroll roster does not tie to commission expense.
- Hosting cost: -$41,000. Explanation says cloud efficiency, but usage report increased 22%.
- Professional fees: +$58,000. Explanation says normal timing. No SOW or invoice support.

Reviewer status:
- Revenue driver bridge has preparer support but no reviewer signoff for the timing exception.
- Sales commissions, hosting, and professional fees have no owner recovery action attached.

Requested output schema:
- release_decision
- release_gate
- accepted_driver_claims
- refused_explanations
- missing_evidence
- allowed_binder_language
- recovery_actions
- why_a_generic_llm_might_fail`;

const fluxExpectedOutput = [
  ["Release decision", "PARTIAL RELEASE / REFUSE VAGUE NOTE. Supported driver claims can enter the binder; unsupported timing and other vague notes stay blocked."],
  ["Release gate", "Only source-backed driver language may export. Unsupported timing, commission, hosting, and professional-fee narratives remain outside the close binder."],
  ["Blockers", "Timing claim lacks in-period delivery proof, commission explanation does not tie to roster, hosting explanation contradicts usage, professional-fee note lacks invoice or SOW support."],
  ["Missing evidence", "Delivery or cutoff correction for timing, reviewer signoff, commission roster-to-GL bridge, cloud usage-to-cost analysis, SOW and invoice support for professional fees."],
  ["Generic LLM failure", "A generic model often rewrites 'strong demand' into a polished narrative instead of allocating the variance only to source-backed volume, price, mix, customer, and timing drivers."],
];

export default function FluxInquestPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST · LEDGERPROOF · FLUX INQUEST</span>
          <h1
            style={{
              fontSize: "clamp(2.65rem, 7vw, 5.8rem)",
              fontWeight: 950,
              letterSpacing: "-0.058em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 960,
              marginBottom: "1rem",
            }}
          >
            Variance explanations that have to show their work.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            Flux Inquest refuses soft variance narratives. It ingests the whole flux
            workpaper packet, then allows only the portion tied to volume, price, mix,
            customer, timing, or account-specific evidence into the close binder.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Inquest verdict</strong>
            <span>PARTIAL RELEASE · 4 supported drivers · 1 vague explanation refused</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Variance packet</span>
            <h2>&ldquo;Strong demand&rdquo; is not a bridge.</h2>
            <p>
              The module decomposes movement into supported drivers, then rejects the leftovers
              that cannot be traced. Vague explanations do not become workpapers just because
              they sound plausible or because the binder needs a tidy story.
            </p>
            <div className="ledgerproof-inputs">
              {varianceInputs.map(([name, detail, status]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Release control</span>
            <div className="ledgerproof-stamp">REFUSE VAGUE NOTE</div>
            <p>
              The supported bridge can be included in the binder. The unsupported narrative
              stays out until management provides driver-level evidence and reviewer signoff.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>FLUX HASH c71f0b44</span>
              <span>5 driver tests</span>
              <span>1 explanation refused</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Evidence drivers</span>
            <h2>A variance claim must attach to a real driver.</h2>
            <p>
              Flux Inquest separates supported explanations from confident filler. Each accepted
              claim names the source record and the driver category it proves.
            </p>
          </div>

          <div className="ledgerproof-blockers">
            {evidenceDrivers.map((driver) => (
              <article key={driver.code}>
                <span>{driver.code}</span>
                <h3>{driver.title}</h3>
                <p>{driver.detail}</p>
                <small>{driver.source}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Proof ledger</span>
            <h2>The bridge gets a status by account.</h2>
            <div className="ledgerproof-table-wrap">
              <table className="ledgerproof-table">
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Variance</th>
                    <th>Status</th>
                    <th>Evidence finding</th>
                  </tr>
                </thead>
                <tbody>
                  {proofRows.map(([area, variance, status, finding]) => (
                    <tr key={area}>
                      <td>{area}</td>
                      <td>{variance}</td>
                      <td>
                        <code>{status}</code>
                      </td>
                      <td>{finding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Refusal rules</span>
            <h2>No unsupported storytelling.</h2>
            <div className="ledgerproof-source-list">
              {refusalRules.map(([name, text]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p style={S.note}>
              Flux Inquest provides workpaper support for review. It does not provide an audit
              opinion, legal opinion, accounting opinion, or assurance conclusion.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable flux variance packet</span>
            <h2>The model has to bridge the variance, not decorate it.</h2>
            <p>
              Paste this case into a general LLM and compare whether it separates supported
              drivers from unsupported narrative. LedgerProof only releases the proven pieces
              and refuses binder language where evidence is missing.
            </p>
            <div style={S.outputList}>
              {fluxExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{fluxVariancePacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Rejected explanations</span>
            <h2>The system is allowed to say: not enough.</h2>
            <p>
              These notes remain outside the binder until the preparer ties them to volume,
              price, mix, customer, or timing support.
            </p>
          </div>
          <div className="ledgerproof-prompts">
            {rejectedNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="REFUSE VAGUE NOTE unless volume, price, mix, customer, timing, and reviewer evidence supports the exact binder language."
            prompt="Ingest this whole flux packet. Revenue increased 38% and management says 'strong demand.' Which language can pass the binder release gate?"
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="flux"
            title="Run the flux gate."
            intro="Edit the variance packet and the deterministic runner emits explanation posture, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={fluxVariancePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own flux packet."
            packetPlaceholder={`Paste a sanitized whole flux packet here: current period, prior period, threshold, management explanation, P&L workpapers, volume/price/mix/customer/timing support, owner notes, reviewer status, and unresolved drivers.\n\nAsk the model which explanation text can pass the binder release gate, what evidence is missing, and what must be refused.`}
            expected="Accept only evidence-backed variance drivers; refuse vague explanations, unsupported narrative, missing reviewer evidence, and audit-ready language when proof is missing."
          />
        </div>
      </section>
    </>
  );
}
