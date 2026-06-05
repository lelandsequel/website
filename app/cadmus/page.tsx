import type { Metadata } from "next";
import CadmusTool from "./CadmusTool";
import styles from "./cadmus.module.css";

export const metadata: Metadata = {
  title: "CADMUS — Spec & Prompt Generator",
  description:
    "CADMUS turns messy intent into a buildable spec, PRD, deck outline, and ready-to-paste AI build prompt with deterministic guardrails.",
};

export default function CadmusPage() {
  return (
    <main className={styles.page}>
      <CadmusTool />
    </main>
  );
}
