import type { Metadata } from "next";
import BacchusRoeWebApp from "@/components/BacchusRoeWebApp";

export const metadata: Metadata = {
  title: "BACCHUS ROE — Altima Caviar Account Pipeline",
  description:
    "BACCHUS ROE account pipeline for Altima Caviar: AURORA scoring, reorder queue, intake, briefs, and receipt export.",
};

export default function BacchusRoePage() {
  return <BacchusRoeWebApp />;
}
