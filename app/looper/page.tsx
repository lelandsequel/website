// LOOPER — the live, type-it-yourself page. Server component: pre-runs the first
// example so the page already shows a working result on load, then hands it to
// the client tool. ZERO engine vocabulary on this surface — every visible string
// comes from `LOOPER` copy; the engine names live ONLY in the opt-in tour, which
// now opens solely from its own button (no autoLaunch). 🐦‍⬛ + 🔑

import type { Metadata } from "next";

import { Shell, Hero, Footer } from "@/components/omnis/ui";
import { ProductNav } from "@/components/products/ProductNav";
import GuidedTour from "@/components/tour/GuidedTour";
import { LOOPER } from "@/lib/products/copy";
import { runLooper } from "./actions";
import LooperTool from "./LooperTool";

export const metadata: Metadata = {
  title: `${LOOPER.name} — ${LOOPER.oneLiner}`,
  description: LOOPER.sub,
};

export default async function LooperPage() {
  const ex = LOOPER.tool!.examples[0];
  const initial = await runLooper(ex.idea, ex.guess); // pre-run so the page shows a working result on load

  return (
    <Shell>
      <ProductNav current="/looper" />

      <Hero kicker={LOOPER.kicker} title={LOOPER.tagline} chip="SYNTHETIC DATA · LIVE">
        {LOOPER.sub}
      </Hero>

      <LooperTool initial={initial} />

      <Footer>
        Type a real idea and run it — live, every time. Nothing here is guessed: the same words give the same
        answer, and every line traces back to what you typed. 🐦‍⬛ + 🔑
      </Footer>

      <GuidedTour steps={LOOPER.tour} storageKey={LOOPER.storageKey} launchLabel="How it works" />
    </Shell>
  );
}
