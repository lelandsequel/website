"use client";

// ProofTour — a self-contained, dependency-free PRESENTATION walkthrough of the
// /proof page (submission #6.1). A title slide → spotlight stops grouped into
// acts → a closing slide, with optional AUTO-PLAY (timed advance + a progress
// bar) so it can run itself like a deck for an 8-minute live demo, or be driven
// by hand. Spotlights anchor to real DOM via [data-tour="…"]; everything is
// inline-styled against THIS page's own tokens (deep-purple ink on the violet
// gradient, the #6f38ff accent, Geist Mono labels, Geist Sans display, 14px
// rounded cards, soft violet shadows) so it reads native to /proof.
//
// Drive it: ▶/❚❚ play-pause · ← → / Enter step · Space play-pause · R replay · Esc close.
//
// Honesty discipline (load-bearing): never claims a frontier model got the
// answer WRONG — the contrast is reproducible / sourced / refusable, not "more
// correct." No internal engine codenames: "the engine / the chain / refused at
// intake," never the names.

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const LS_KEY = "proof-tour-v1-seen";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";
const SANS = "var(--font-geist-sans), Inter, system-ui, sans-serif";
const ACCENT = "#6f38ff"; // page --accent
const ACCENT_HI = "#a66cff"; // page --accent-2, brighter on the dark slide
const INK = "#171226"; // page --text-primary
const MUTED = "#524a66"; // page --text-secondary
const STEP_MS = 7800; // auto-advance dwell on a content stop
const COVER_MS = 4600; // dwell on the title slide before it rolls

const STEPS = [
  {
    kind: "cover",
    kicker: "JourdanLabs · #6.1 · Live walkthrough",
    title: "Governance you can audit.",
    sub: "Provable AI for decisions a regulated firm can't take on faith — where every answer arrives with a receipt you can re-run. Eight minutes, end to end.",
  },

  { kind: "step", n: 1, act: "I · The thesis", sel: '[data-tour="thesis"]', title: "A normal AI gives an answer. It can't show its work.",
    body: "Pick any theme — secure design, embedded AI, employee experience. Underneath all of them is the same gap: the model produces output faster than anyone can verify it. In a regulated decision, an answer you can't ground, refuse, or audit is a non-starter." },

  { kind: "step", n: 2, act: "II · The substrate", sel: '[data-tour="substrate"]', title: "One engine under every proof on this page.",
    body: "It's deterministic, it sources every claim, it refuses what it can't prove, and it stamps a receipt you can re-run. No model sits in the decision path — so it can't be talked out of a 'no.' This is the 90-second path a judge can walk: paste a real packet, watch it hold." },

  { kind: "step", n: 3, act: "III · The proofs", sel: '[data-tour="gates"]', title: "Not six products — one gate, pointed six ways.",
    body: "Each tile is the same engine aimed at a place a wrong call can't be undone: a $2.4M auto-wire with no approver, an unbound agent, an uncontrolled data export, a model shipping with no rollback. It refuses, or it escalates to a named human. Every one runs live — click any tile." },

  { kind: "step", n: 4, act: "III · The proofs", sel: '[data-tour="negation"]', title: "It reads the sentence — not the keywords.",
    body: "The cheap version is 'if the packet says wire, refuse.' That gets fooled both directions. Here: 'contains no PII' still gets held, because saying it doesn't make it true. 'Will NOT wire money' is allowed through, because it's a harmless read. Same engine, both directions — it's reading negation, not scanning for a word." },

  { kind: "step", n: 5, act: "IV · The receipt", sel: '[data-tour="receipt"]', title: "Same input, same output, same hash.",
    body: "Every verdict lands on a tamper-evident record. Ask it twice and you get an identical answer and an identical hash — that's how you know it isn't a language model improvising. The frontier lane is fluent, but it drifts run to run; this lane is reproducible by design. Not 'more right' — re-runnable, and on the record." },

  { kind: "step", n: 6, act: "V · Why it wins", sel: '[data-tour="why"]', title: "The disease under every theme — cured once, shown live.",
    body: "It already runs: live engines, click-and-it-refuses, demo not diagram. The contribution is net-new — provable, refusal-grounded governance with no model in the decision path. One failure mode, fixed at the surfaces where a wrong call is unrecoverable." },

  {
    kind: "outro",
    kicker: "Receipts, or refusal",
    title: "We don't guess. We prove — or we say plainly we can't.",
    sub: "Provable, refusable, auditable — and it runs today, not someday. Re-run any verdict yourself; it won't budge.",
  },
];
const CONTENT = STEPS.filter((s) => s.kind === "step").length;
const LAST = STEPS.length - 1;

function readRect(sel) {
  if (typeof document === "undefined" || !sel) return null;
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function ProofTour() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const [playing, setPlaying] = useState(false);

  const step = STEPS[i];

  const measure = useCallback(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    setRect(readRect(STEPS[i]?.sel));
  }, [i]);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(LS_KEY)) setOpen(true);
    } catch {
      /* private mode — launcher still works */
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const el = step?.sel ? document.querySelector(step.sel) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t = setTimeout(measure, el ? 360 : 0);
    return () => clearTimeout(t);
  }, [open, i, step, measure]);

  useEffect(() => {
    if (!open) return;
    const on = () => measure();
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, true);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("scroll", on, true);
    };
  }, [open, measure]);

  const finish = useCallback(() => {
    setOpen(false);
    setPlaying(false);
    try {
      window.localStorage.setItem(LS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);
  const next = useCallback(() => setI((n) => Math.min(LAST, n + 1)), []);
  const prev = useCallback(() => setI((n) => Math.max(0, n - 1)), []);
  const start = useCallback(() => {
    setI(0);
    setOpen(true);
    setPlaying(false);
  }, []);
  const restart = useCallback(() => {
    setI(0);
    setPlaying(true);
  }, []);

  // Auto-advance while playing; stops itself on the closing slide.
  useEffect(() => {
    if (!open || !playing) return;
    if (step.kind === "outro") {
      setPlaying(false);
      return;
    }
    const ms = step.kind === "cover" ? COVER_MS : STEP_MS;
    const t = setTimeout(() => setI((n) => (n >= LAST ? n : n + 1)), ms);
    return () => clearTimeout(t);
  }, [open, playing, i, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Escape") { e.preventDefault(); finish(); }
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.key === "r" || e.key === "R") { e.preventDefault(); restart(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, finish, restart]);

  // ── Launcher ──────────────────────────────────────────────────────────────
  if (!open) {
    return (
      <button
        type="button"
        onClick={start}
        aria-label="Watch the walkthrough"
        style={{
          position: "fixed", bottom: 16, right: 16, zIndex: 55, fontFamily: MONO, fontSize: 11,
          fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", color: INK,
          border: `1px solid ${ACCENT}`, borderRadius: 999, boxShadow: "0 14px 34px rgba(111,56,255,0.28)",
          padding: "10px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
        }}
      >
        <span style={{ color: ACCENT, fontSize: 13, lineHeight: 1 }}>▸</span> Watch the walkthrough
      </button>
    );
  }

  // ── Geometry (content stops only) ─────────────────────────────────────────
  const W = Math.min(440, vp.w - 32);
  const PAD = 16;
  const CARD_H = 320;
  let cardPos = null;
  if (step.kind === "step") {
    if (!rect) {
      cardPos = { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: W };
    } else {
      const left = Math.max(PAD, Math.min(rect.left, Math.max(PAD, vp.w - W - PAD)));
      let top;
      if (rect.top + rect.height + 16 + CARD_H <= vp.h - PAD) top = rect.top + rect.height + 16;
      else if (rect.top - 16 - CARD_H >= PAD) top = rect.top - 16 - CARD_H;
      else top = vp.h - CARD_H - PAD;
      top = vp.h >= CARD_H + 2 * PAD ? Math.max(PAD, Math.min(top, vp.h - CARD_H - PAD)) : PAD;
      cardPos = { top, left, width: W };
    }
  }

  let spot = null;
  if (step.kind === "step" && rect) {
    const H = Math.min(rect.height + 14, vp.h * 0.7);
    const cy = rect.top + rect.height / 2;
    spot = {
      position: "fixed", top: cy - H / 2, left: Math.max(6, rect.left - 6),
      width: Math.min(rect.width + 12, vp.w - 12), height: H,
      boxShadow: "0 0 0 9999px rgba(23,18,38,0.74)", border: `2px solid ${ACCENT}`, borderRadius: 14,
      zIndex: 60, pointerEvents: "none",
      transition: "top .42s cubic-bezier(.4,0,.2,1), left .42s cubic-bezier(.4,0,.2,1), width .42s cubic-bezier(.4,0,.2,1), height .42s cubic-bezier(.4,0,.2,1)",
    };
  }

  const btn = {
    fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
    padding: "9px 14px", cursor: "pointer", border: `1px solid ${ACCENT}`, borderRadius: 999, lineHeight: 1,
    background: "#fff", color: ACCENT,
  };
  const btnFill = { ...btn, background: ACCENT, color: "#fff", borderColor: ACCENT };
  const iconBtn = { ...btn, padding: "8px 11px", minWidth: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 };
  const stepMs = step.kind === "cover" ? COVER_MS : STEP_MS;

  const keyframes =
    "@keyframes pfFade{from{opacity:0}to{opacity:1}}" +
    "@keyframes pfRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}" +
    "@keyframes pfSlide{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}";

  return (
    <div role="dialog" aria-modal="true" aria-label="Guided walkthrough">
      <style>{keyframes}</style>

      {/* dim — spotlight cutout for stops, full cinematic scrim for the slides */}
      {spot ? (
        <div style={spot} aria-hidden="true" />
      ) : (
        <div
          aria-hidden="true"
          onClick={step.kind === "step" ? finish : undefined}
          style={{ position: "fixed", inset: 0, background: "rgba(23,18,38,0.82)", zIndex: 60, animation: "pfFade .3s ease" }}
        />
      )}

      {/* ── COVER / OUTRO — the presentation slides ─────────────────────────── */}
      {(step.kind === "cover" || step.kind === "outro") && (
        <div style={{ position: "fixed", inset: 0, zIndex: 61, background: "rgba(16,10,32,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw", animation: "pfFade .3s ease" }}>
          <div key={`slide-${i}`} style={{ width: "min(700px, 92vw)", animation: "pfSlide .45s cubic-bezier(.2,.7,.2,1)" }}>
            <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: ACCENT_HI, marginBottom: 18 }}>
              {step.kicker}
            </div>
            <h1 style={{ fontFamily: SANS, fontSize: "clamp(38px,6.6vw,68px)", lineHeight: 1.02, letterSpacing: "-.04em", fontWeight: 900, color: "#fff", margin: 0 }}>
              {step.title}
            </h1>
            <p style={{ fontFamily: SANS, fontSize: "clamp(16px,2.3vw,21px)", lineHeight: 1.5, color: "#ccc4e6", margin: "20px 0 0", maxWidth: "52ch" }}>
              {step.sub}
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 34, flexWrap: "wrap", alignItems: "center" }}>
              {step.kind === "cover" ? (
                <>
                  <button type="button" onClick={() => { setI(1); setPlaying(true); }} style={{ ...btnFill, padding: "12px 22px", fontSize: 12 }}>▶ Play walkthrough</button>
                  <button type="button" onClick={() => { setI(1); setPlaying(false); }} style={{ ...btn, background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)", padding: "12px 20px", fontSize: 12 }}>Click through →</button>
                  <button type="button" onClick={finish} style={{ ...btn, background: "transparent", color: "#8f86a8", border: "none", padding: "12px 6px", fontSize: 12 }}>Skip</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={restart} style={{ ...btn, background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)", padding: "12px 20px", fontSize: 12 }}>↺ Replay</button>
                  <button type="button" onClick={finish} style={{ ...btnFill, padding: "12px 22px", fontSize: 12 }}>Done ✓</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT STOP — the spotlight card ───────────────────────────────── */}
      {step.kind === "step" && cardPos && (
        <div
          key={`card-${i}`}
          style={{
            position: "fixed", ...cardPos, zIndex: 61, background: "rgba(255,255,255,0.98)",
            border: "1px solid #eadfff", borderTop: `3px solid ${ACCENT}`, borderRadius: 14,
            boxShadow: "0 24px 70px rgba(82,43,177,0.28)", padding: "16px 20px 14px",
            boxSizing: "border-box", animation: "pfRise .32s cubic-bezier(.2,.7,.2,1)",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: ACCENT, marginBottom: 9 }}>
            {step.act}
          </div>
          <h3 style={{ fontFamily: SANS, fontSize: 20, lineHeight: 1.2, fontWeight: 800, color: INK, margin: "0 0 8px", letterSpacing: "-.02em" }}>
            {step.title}
          </h3>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: MUTED, margin: 0 }}>{step.body}</p>

          {/* auto-advance fill bar */}
          <div style={{ height: 3, background: "#eadfff", borderRadius: 999, margin: "14px 0 12px", overflow: "hidden" }}>
            <div
              key={`fill-${i}-${playing}`}
              style={{ height: "100%", background: ACCENT, width: playing ? "100%" : "0%", transition: playing ? `width ${stepMs}ms linear` : "none" }}
            />
          </div>

          {/* controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <button type="button" onClick={() => setPlaying((p) => !p)} style={iconBtn} aria-label={playing ? "Pause" : "Play"}>
                {playing ? "❚❚" : "▶"}
              </button>
              <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED, letterSpacing: ".06em" }}>
                {String(step.n).padStart(2, "0")} / {String(CONTENT).padStart(2, "0")}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {i > 0 && <button type="button" onClick={prev} style={btn}>← Back</button>}
              <button type="button" onClick={i >= LAST ? finish : next} style={btnFill}>{i >= LAST ? "Done ✓" : "Next →"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
