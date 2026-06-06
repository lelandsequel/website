// Always the brake. Never the sword.
import type { Metadata } from "next";
import Link from "next/link";
import HeimdallAirborneConsole from "./HeimdallAirborneConsole";
import styles from "./airborne.module.css";

export const metadata: Metadata = {
  title: "HEIMDALL Airborne Command Center - Coalition Brief",
  description:
    "A synthetic HEIMDALL coalition-brief console for airborne decision support, human review, brake-only verdicts, and tamper-evident decision logs.",
};

export default function HeimdallAirbornePage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topRail}>
          <Link href="/divisions/heimdall">Back to HEIMDALL</Link>
          <div className={styles.statusStrip} aria-label="Safety boundaries">
            <span>Synthetic only</span>
            <span>Decision support</span>
            <span>Human-in-command</span>
            <span>No real ops data</span>
          </div>
        </div>

        <HeimdallAirborneConsole />

        <details className={styles.details}>
          <summary>Brief constraints</summary>
          <div>
            <span>Governance boundary</span>
            <p>
              This console is a demo-grade coalition brief slice. It uses synthetic scenarios only:
              EOD suspected IED overwatch, LE ambiguous structure overwatch, and a crowd-edge situation.
              It contains no real people, no real locations, no real operations feed, and no real targeting.
            </p>
            <p>
              The output set is constrained to REFUSE, HOLD, ABSTAIN, and NO_OBJECTION. Jim-facing display
              language maps those states to NOT FIRE, REVIEW, or NO RESPONSE. The system can stop, pause,
              or stay silent; it never owns the act.
            </p>
            <p>
              The console uses the HEIMDALL evidence gate and load gate in a browser-safe local adapter so
              the coalition brief can run without cloud dependencies. The pattern demonstrated here is the
              governance layer: deterministic restraint, human command, and an audit chain that breaks when
              altered.
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
