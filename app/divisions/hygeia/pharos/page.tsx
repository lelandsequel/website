import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PharosRunner from "@/components/PharosRunner";
import styles from "@/app/omnis/omnis.module.css";

export const metadata: Metadata = {
  title: "PHAROS - Pharmacovigilance Signal Detection",
  description:
    "PHAROS is JourdanLabs' deterministic pharmacovigilance signal-detection workbench: SIGNAL benchmark receipts, calibrated abstention, and source-chain refusal discipline.",
};

const metrics = [
  ["Benchmark", "36 drug-event pairs"],
  ["Corpus", "17.76M / 44q"],
  ["Detection", "63.9%"],
  ["Lead time", "24.3mo"],
];

export default function PharosPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.rail}>
          <Link href="/divisions/hygeia" className={styles.railBrand}>
            <Image src="/brand/baby-pulsar-flag.png" alt="" width={40} height={40} />
            <span className={styles.railTitle}>
              <span>HYGEIA</span>
              <strong>PHAROS</strong>
            </span>
          </Link>
          <nav className={styles.railNav} aria-label="PHAROS navigation">
            <Link href="/divisions/hygeia">
              <strong>HYGEIA</strong>
              <span>Clinical safety intelligence division</span>
            </Link>
            <Link href="/divisions/hygeia/pharos" data-active="true">
              <strong>PHAROS</strong>
              <span>Pharmacovigilance signal workbench</span>
            </Link>
            <Link href="/divisions/helix">
              <strong>HELIX</strong>
              <span>Wellness and human performance</span>
            </Link>
            <Link href="/crucible/benchmarks/signal">
              <strong>SIGNAL</strong>
              <span>Benchmark receipt and methodology</span>
            </Link>
            <a href="/api/pharos/run" target="_blank" rel="noopener noreferrer">
              <strong>API</strong>
              <span>Sealed runner manifest</span>
            </a>
          </nav>
          <div className={styles.railFooter}>
            <strong>Boundary discipline.</strong>
            <p>PHAROS prioritizes safety signals for review. It refuses causality claims from intake packets.</p>
          </div>
        </aside>

        <section className={styles.main}>
          <div className={styles.workspace}>
            <div className={styles.toolbar}>
              <Link href="/divisions/hygeia">← HYGEIA</Link>
              <Link href="/crucible/benchmarks/signal">SIGNAL receipts</Link>
            </div>

            <div className={styles.heroPanel}>
              <div>
                <span className={styles.kicker}>HYGEIA · PHAROS</span>
                <h1>Earlier safety signals. No causality cosplay.</h1>
                <p>
                  PHAROS applies COSMIC to pharmacovigilance: product-event entity resolution,
                  source-chain validation, PRR/ROR/BCPNN/MGPS comparator scoring, COSMIC feature
                  aggregation, confound challenge, and an AURORA gate that refuses unsafe claims.
                  It tells a safety team what deserves attention. It does not pretend intake data
                  proves causality.
                </p>
              </div>
              <div className={styles.mascotPanel}>
                <Image src="/brand/baby-pulsar-speech.png" alt="Baby PULSAR" width={240} height={240} />
                <span>Safety gate online</span>
              </div>
            </div>

            <div className={styles.metricRow}>
              {metrics.map(([label, value]) => (
                <div className={styles.metricCard} key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className={styles.downloadPanel}>
              <div>
                <span className={styles.kicker}>SIGNAL → PHAROS</span>
                <h2>Benchmark receipts become a product surface.</h2>
                <p>
                  SIGNAL proved the pharmacovigilance track against FDA black-box outcomes and
                  FAERS-scale data. PHAROS turns that posture into a live safety-signal workbench:
                  prioritize, monitor, or refuse, with the refusal boundary visible.
                </p>
                <small>
                  Output is safety-review triage, not medical advice, regulatory advice, or clinical causality.
                </small>
              </div>
              <div className={styles.downloadActions}>
                <Link href="/crucible/benchmarks/signal">Open SIGNAL</Link>
                <a href="/api/pharos/run" target="_blank" rel="noopener noreferrer">Manifest</a>
              </div>
            </div>

            <PharosRunner />
          </div>
        </section>
      </div>
    </main>
  );
}
