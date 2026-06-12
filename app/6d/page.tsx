import type { Metadata } from "next";
import SixDWorkbench from "./SixDWorkbench";

export const metadata: Metadata = {
  title: "6D Workbench — deterministic SDLC artifacts | JourdanLabs",
  description:
    "One feature intent in, six SDLC artifacts out — PRD, design records, ticket-ready slices, engineering handoff, test design, release inputs. Deterministic, traceable, receipt-sealed. Powered by the CADMUS Engine.",
};

export default function SixDPage() {
  return <SixDWorkbench />;
}
