import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { engineeringModules } from "@/lib/engineering-suite";
import styles from "./omnis.module.css";

export const metadata: Metadata = {
  title: "OMNIS - Deterministic Engineering OS",
  description:
    "OMNIS is the JourdanLabs deterministic engineering app: CADMUS for specs, VANTAGE 2.0 for code verification, PROSPECTOR for software estate intelligence, and LUNA for persistent work memory.",
};

const metrics = [
  ["Suite mode", "Specify → Verify → Discover → Remember"],
  ["Runtime posture", "No LLM in the decision path"],
  ["Public gate", "12 runs / hour / product"],
  ["Receipts", "SHA-sealed deterministic runs"],
];

export default function OmnisPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.rail}>
          <Link href="/omnis" className={styles.railBrand}>
            <Image src="/brand/baby-pulsar-flag.png" alt="" width={40} height={40} />
            <span className={styles.railTitle}>
              <span>Deterministic</span>
              <strong>OMNIS</strong>
            </span>
          </Link>
          <nav className={styles.railNav} aria-label="OMNIS suite">
            {engineeringModules.map((module) => (
              <Link href={module.route} key={module.id}>
                <strong>{module.name}</strong>
                <span>{module.lane} · {module.headline}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.railFooter}>
            <strong>OMNIS KEY comes next.</strong>
            <p>First the deterministic app hardens. Then agents get keys, tools, BIFROST, and refusal discipline.</p>
          </div>
        </aside>

        <section className={styles.main}>
          <div className={styles.workspace}>
            <div className={styles.toolbar}>
              <span className={styles.kicker}>JourdanLabs · OMNIS</span>
              <Link href="/alchemist">Open ALCHEMIST</Link>
            </div>

            <div className={styles.heroPanel}>
              <div>
                <span className={styles.kicker}>CADMUS · VANTAGE 2.0 · PROSPECTOR</span>
                <h1>The engineering OS for brilliant messy builders.</h1>
                <p>
                  OMNIS turns engineering chaos into deterministic workrooms:
                  CADMUS produces buildable specs, VANTAGE 2.0 blocks dangerous code
                  before release, PROSPECTOR maps the software estate, and LUNA turns
                  computer activity into persistent work briefs. Public runs are capped
                  because these are real workbenches, not pretty showcases.
                </p>
              </div>
              <div className={styles.mascotPanel}>
                <Image src="/brand/baby-pulsar-speech.png" alt="Baby PULSAR" width={240} height={240} />
                <span>OMNIS gate online</span>
              </div>
            </div>

            <div className={styles.downloadPanel}>
              <div>
                <span className={styles.kicker}>Mac download</span>
                <h2>Run OMNIS locally.</h2>
                <p>
                  Download the Mac build when you want OMNIS on your machine instead of only in
                  the public web workbench. The local app starts a private 127.0.0.1 workspace
                  and opens VANTAGE, CADMUS, PROSPECTOR, and LUNA in your browser. It also speaks
                  MCP as a governed host — every agent tool call passes a deterministic gate and is
                  hash-audited.
                </p>
                <small>
                  Signed with a JourdanLabs Developer ID, notarized by Apple — opens with a normal double-click.
                </small>
              </div>
              <div className={styles.downloadActions}>
                <a href="/downloads/OMNIS-Mac-0.1.2.dmg" download>
                  Download OMNIS for Mac
                </a>
                <a href="/downloads/OMNIS-Mac-0.1.2.dmg.sha256.txt" download>
                  SHA-256
                </a>
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

            <div className={styles.moduleGrid}>
              {engineeringModules.map((module) => (
                <Link href={module.route} className={styles.moduleCard} key={module.id}>
                  <em>{module.lane}</em>
                  <strong>{module.name}</strong>
                  <p>{module.summary}</p>
                  <b>Open workbench →</b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
