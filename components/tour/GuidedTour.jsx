"use client";

// GuidedTour — a self-contained, dependency-free walkthrough overlay.
//
// Generalized from FactoryTour: the steps and the localStorage "seen" key are
// PROPS, so every product hands it its own script (see lib/products/copy.ts).
// A title slide → spotlight stops (anchored to real DOM via [data-tour="…"]) →
// a closing slide, with optional AUTO-PLAY so it runs itself like a deck, or is
// driven by hand. Inline-styled against the dark product tokens (periwinkle
// #9fb4ff primary, green #6fe0a8 for "shipped/closed"), so it reads native.
//
// This is where the engine names live. The page stays plain; the curious press
// "Watch the walkthrough" and get the real names on the doors. 🐦‍⬛ + 🔑
//
// Drive it: ▶/❚❚ play-pause · ← → / Enter step · Space play-pause · R replay · Esc close.

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const MONO = "var(--font-mono), ui-monospace, monospace";
const SANS = "var(--font-sans), Inter, system-ui, sans-serif";
const ACCENT = "#9fb4ff"; // periwinkle — primary
const ACCENT_HI = "#c7d0ff"; // brighter on the dark slide
const SHIP = "#6fe0a8"; // green — shipped / closed
const INK = "#e7e7ea";
const MUTED = "#9a9aa4";
const CARD_BG = "rgba(18,20,28,0.98)";
const SCRIM = "rgba(8,9,14,0.86)";
const SLIDE_BG = "rgba(8,9,14,0.97)";
const STEP_MS = 8200; // auto-advance dwell on a content stop
const COVER_MS = 4800; // dwell on the title slide before it rolls

function readRect(sel) {
  if (typeof document === "undefined" || !sel) return null;
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/**
 * @param {object} props
 * @param {Array}  props.steps        cover/step/outro objects (lib/products/copy.ts shape).
 * @param {string} props.storageKey   localStorage key, unique per product.
 * @param {string} [props.launchLabel] floating-button label.
 * @param {boolean} [props.autoLaunch] open automatically on first visit (gated by storageKey).
 */
export default function GuidedTour({ steps, storageKey, launchLabel = "Watch the walkthrough", autoLaunch = false }) {
  const STEPS = Array.isArray(steps) ? steps : [];
  const CONTENT = STEPS.filter((s) => s.kind === "step").length;
  const LAST = STEPS.length - 1;

  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const [playing, setPlaying] = useState(false);

  const step = STEPS[i];

  const measure = useCallback(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    setRect(readRect(STEPS[i]?.sel));
  }, [i, STEPS]);

  // Only the launcher button opens the tour by default — the product lands first,
  // not the pitch. Pass autoLaunch to opt a page back into first-visit auto-open.
  useEffect(() => {
    if (!autoLaunch) return;
    try {
      if (storageKey && !window.localStorage.getItem(storageKey)) setOpen(true);
    } catch {
      /* private mode — launcher still works */
    }
  }, [storageKey, autoLaunch]);

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
      if (storageKey) window.localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  }, [storageKey]);
  const next = useCallback(() => setI((n) => Math.min(LAST, n + 1)), [LAST]);
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
    if (!open || !playing || !step) return;
    if (step.kind === "outro") {
      setPlaying(false);
      return;
    }
    const ms = step.kind === "cover" ? COVER_MS : STEP_MS;
    const t = setTimeout(() => setI((n) => (n >= LAST ? n : n + 1)), ms);
    return () => clearTimeout(t);
  }, [open, playing, i, step, LAST]);

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

  if (!STEPS.length) return null;

  // ── Launcher ──────────────────────────────────────────────────────────────
  if (!open) {
    return (
      <button
        type="button"
        onClick={start}
        aria-label={launchLabel}
        style={{
          position: "fixed", bottom: 16, right: 16, zIndex: 55, fontFamily: MONO, fontSize: 11,
          fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
          background: "rgba(18,20,28,0.92)", backdropFilter: "blur(10px)", color: INK,
          border: `1px solid ${ACCENT}`, borderRadius: 999, boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
          padding: "10px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
        }}
      >
        <span style={{ color: ACCENT, fontSize: 13, lineHeight: 1 }}>▸</span> {launchLabel}
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
      boxShadow: `0 0 0 9999px ${SCRIM}`, border: `2px solid ${ACCENT}`, borderRadius: 14,
      zIndex: 60, pointerEvents: "none",
      transition: "top .42s cubic-bezier(.4,0,.2,1), left .42s cubic-bezier(.4,0,.2,1), width .42s cubic-bezier(.4,0,.2,1), height .42s cubic-bezier(.4,0,.2,1)",
    };
  }

  const btn = {
    fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
    padding: "9px 14px", cursor: "pointer", border: `1px solid ${ACCENT}`, borderRadius: 999, lineHeight: 1,
    background: "rgba(255,255,255,0.04)", color: ACCENT,
  };
  const btnFill = { ...btn, background: ACCENT, color: "#0a0c14", borderColor: ACCENT };
  const iconBtn = { ...btn, padding: "8px 11px", minWidth: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 };
  const stepMs = step.kind === "cover" ? COVER_MS : STEP_MS;

  const keyframes =
    "@keyframes ftFade{from{opacity:0}to{opacity:1}}" +
    "@keyframes ftRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}" +
    "@keyframes ftSlide{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}";

  const isOutro = step.kind === "outro";

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
          style={{ position: "fixed", inset: 0, background: SCRIM, zIndex: 60, animation: "ftFade .3s ease" }}
        />
      )}

      {/* ── COVER / OUTRO — the presentation slides ─────────────────────────── */}
      {(step.kind === "cover" || isOutro) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 61, background: SLIDE_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw", animation: "ftFade .3s ease" }}>
          <div key={`slide-${i}`} style={{ width: "min(700px, 92vw)", animation: "ftSlide .45s cubic-bezier(.2,.7,.2,1)" }}>
            <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: isOutro ? SHIP : ACCENT_HI, marginBottom: 18 }}>
              {step.kicker}
            </div>
            <h1 style={{ fontFamily: SANS, fontSize: "clamp(34px,6vw,62px)", lineHeight: 1.04, letterSpacing: "-.04em", fontWeight: 900, color: "#fff", margin: 0 }}>
              {step.title}
            </h1>
            <p style={{ fontFamily: SANS, fontSize: "clamp(16px,2.3vw,21px)", lineHeight: 1.5, color: "#c0c0c8", margin: "20px 0 0", maxWidth: "54ch" }}>
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
                  <button type="button" onClick={finish} style={{ ...btnFill, background: SHIP, borderColor: SHIP, padding: "12px 22px", fontSize: 12 }}>Done ✓</button>
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
            position: "fixed", ...cardPos, zIndex: 61, background: CARD_BG,
            border: "1px solid #2a2d3a", borderTop: `3px solid ${ACCENT}`, borderRadius: 14,
            boxShadow: "0 24px 70px rgba(0,0,0,0.55)", padding: "16px 20px 14px",
            boxSizing: "border-box", animation: "ftRise .32s cubic-bezier(.2,.7,.2,1)",
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
          <div style={{ height: 3, background: "#23262f", borderRadius: 999, margin: "14px 0 12px", overflow: "hidden" }}>
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
