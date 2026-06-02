import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EngineeringRunner from "@/components/EngineeringRunner";
import { engineeringModules, getEngineeringModule } from "@/lib/engineering-suite";
import styles from "../omnis.module.css";

export function generateStaticParams() {
  return engineeringModules.map((module) => ({ module: module.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: moduleId } = await params;
  const module = getEngineeringModule(moduleId);
  if (!module) return {};
  return {
    title: `${module.name} Workbench - OMNIS`,
    description: module.summary,
  };
}

export default async function OmnisModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params;
  const module = getEngineeringModule(moduleId);
  if (!module) notFound();

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
            {engineeringModules.map((item) => (
              <Link href={item.route} key={item.id} data-active={item.id === module.id}>
                <strong>{item.name}</strong>
                <span>{item.lane} · {item.headline}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.railFooter}>
            <strong>Agent layer deferred.</strong>
            <p>This is the hardened deterministic app. OMNIS KEY adds agents after these gates are stable.</p>
          </div>
        </aside>

        <section className={styles.main}>
          <div className={styles.workspace}>
            <div className={styles.toolbar}>
              <Link href="/omnis">← OMNIS suite</Link>
              <Link href="/crucible/vantage">Verification receipts</Link>
            </div>
            <div className={styles.heroPanel}>
              <div>
                <span className={styles.kicker}>{module.lane} · {module.name}</span>
                <h1>{module.headline}.</h1>
                <p>{module.summary}</p>
                {module.id === "cadmus" && (
                  <Link
                    href="/cadmus"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginTop: "1.1rem",
                      padding: "0.6rem 1.05rem",
                      borderRadius: 999,
                      background: "#6f38ff",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    ⚡ Try the live generator →
                  </Link>
                )}
              </div>
              <div className={styles.mascotPanel}>
                <Image src="/brand/baby-pulsar-speech.png" alt="Baby PULSAR" width={240} height={240} />
                <span>Deterministic gate online</span>
              </div>
            </div>
            <EngineeringRunner module={module} />
          </div>
        </section>
      </div>
    </main>
  );
}
