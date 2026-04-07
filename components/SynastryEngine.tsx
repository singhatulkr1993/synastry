"use client";

import React, { useEffect, useRef, useState } from "react";
import { SIGN_SYMBOLS, STAGES, EMOTIONS, THEMES, EXPRESSION_PROFILES, SOUL_URGE_PROFILES, getSignPairDetail, LIFE_PATH_PAIR_DYNAMICS, EXPRESSION_NUMBER_PROFILES, DESTINY_NUMBER_PROFILES, getLPPairKey } from "@/lib/constants";
import { buildNumerologySynthesis, buildPairDynamic, buildKeyTakeaway, personalizePairField } from "@/lib/narratives";
import { useCompatibilityEngine } from "@/lib/useCompatibilityEngine";
import { track } from "@/lib/analytics";
import {
  IconSymbolic, IconBehavioral, IconInteraction, IconEmotional,
  IconCommunication, IconValues, IconIntimacy, IconConflict,
  IconStability, IconVulnerability, IconEnvelope,
} from "@/components/icons/SynastryIcons";
import { PrivacyNote } from "@/components/ui/PrivacyNote";

// ─── Name formatting helpers ────────────────────────────────────
function toTitleCase(name: string): string {
  return name.trim().replace(/\b\w/g, c => c.toUpperCase());
}

function getFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

// ─── Design tokens (JS mirror of CSS vars) ─────────────────────
const T = {
  bg:       "var(--syn-bg)",
  bgAlt:    "var(--syn-bg-alt)",
  surface:  "var(--syn-surface)",
  surfaceW: "var(--syn-surface-warm)",
  border:   "var(--syn-border)",
  borderS:  "var(--syn-border-strong)",
  gold:     "var(--syn-gold)",
  goldL:    "var(--syn-gold-light)",
  goldD:    "var(--syn-gold-dark)",
  goldT:    "var(--syn-gold-tint)",
  plum:     "var(--syn-plum)",
  plumL:    "var(--syn-plum-light)",
  plumT:    "var(--syn-plum-tint)",
  navy:     "var(--syn-navy)",
  navyM:    "var(--syn-navy-mid)",
  navyS:    "var(--syn-navy-soft)",
  rose:     "var(--syn-rose)",
  roseL:    "var(--syn-rose-light)",
  roseT:    "var(--syn-rose-tint)",
  text:     "var(--syn-text-primary)",
  textS:    "var(--syn-text-secondary)",
  textM:    "var(--syn-text-muted)",
  textI:    "var(--syn-text-inverse)",
  success:  "var(--syn-success)",
  successT: "var(--syn-success-tint)",
  error:    "var(--syn-error)",
  errorT:   "var(--syn-error-tint)",
  shadow:   "var(--syn-shadow-md)",
  shadowG:  "var(--syn-shadow-gold)",
};

// Semantic score color (warm palette)
const sc = (v: number) => v >= 7 ? T.success : v >= 5 ? T.gold : T.rose;
const scBg = (v: number) => v >= 7 ? T.successT : v >= 5 ? T.goldT : T.roseT;

// ─── Shared style objects ────────────────────────────────────────
const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background: T.bg,
  color: T.text,
  fontFamily: "var(--syn-font-body)",
  display: "flex",
  flexDirection: "column" as const,
};

const cnt: React.CSSProperties = {
  width: "100%",
  maxWidth: "var(--syn-max-width)",
  margin: "0 auto",
  padding: "var(--syn-space-8) var(--syn-space-5)",
};

const Card: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: "var(--syn-radius-xl)",
  padding: "var(--syn-space-6) var(--syn-space-6)",
  marginBottom: "var(--syn-space-3)",
  boxShadow: "var(--syn-shadow-sm)",
  cursor: "pointer",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
};

const CS: React.CSSProperties = { ...Card, cursor: "default" };

const HS: React.CSSProperties = {
  fontFamily: "var(--syn-font-display)",
  fontSize: "clamp(1.5rem, 4vw, 2rem)",
  fontWeight: 400,
  color: T.text,
  marginBottom: "var(--syn-space-3)",
  lineHeight: 1.25,
};

const Sub: React.CSSProperties = {
  fontSize: "0.9375rem",
  color: T.textS,
  lineHeight: 1.7,
  marginBottom: "var(--syn-space-8)",
};

const Btn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "var(--syn-space-4) var(--syn-space-8)",
  background: "var(--syn-gradient-gold)",
  color: T.navy,
  border: "none",
  borderRadius: "var(--syn-radius-full)",
  fontFamily: "var(--syn-font-body)",
  fontSize: "0.875rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  cursor: "pointer",
  marginTop: "var(--syn-space-5)",
  boxShadow: T.shadowG,
  transition: "transform 150ms ease, box-shadow 150ms ease",
};

const GhostBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "var(--syn-space-3) var(--syn-space-6)",
  background: "transparent",
  color: T.textM,
  border: `1px solid ${T.border}`,
  borderRadius: "var(--syn-radius-full)",
  fontFamily: "var(--syn-font-body)",
  fontSize: "0.875rem",
  fontWeight: 500,
  cursor: "pointer",
  marginTop: "var(--syn-space-3)",
  transition: "border-color 150ms ease, color 150ms ease",
};

const Inp: React.CSSProperties = {
  width: "100%",
  padding: "var(--syn-space-3) var(--syn-space-4)",
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: "var(--syn-radius-md)",
  fontFamily: "var(--syn-font-body)",
  fontSize: "1rem",
  color: T.text,
  boxSizing: "border-box" as const,
  outline: "none",
  marginBottom: "var(--syn-space-4)",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
};

const Lab: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: T.textS,
  marginBottom: "var(--syn-space-2)",
  letterSpacing: "0.03em",
};

const Err: React.CSSProperties = {
  display: "block" as const,
  fontSize: "0.75rem",
  color: T.error,
  marginTop: "calc(var(--syn-space-2) * -1)",
  marginBottom: "var(--syn-space-3)",
};

const Tag = (bg?: string, col?: string): React.CSSProperties => ({
  display: "inline-block",
  background: bg || T.goldT,
  color: col || T.goldD,
  padding: "3px 12px",
  borderRadius: "var(--syn-radius-full)",
  fontSize: "0.75rem",
  fontWeight: 600,
  marginRight: "var(--syn-space-2)",
  marginBottom: "var(--syn-space-1)",
  letterSpacing: "0.03em",
});

// ── Theme → icon mapping for quiz pill tags ──────────────────────────
const THEME_ICONS: Record<string, React.ReactNode> = {
  T1: <IconEmotional     size={14} />,
  T2: <IconCommunication size={14} />,
  T3: <IconBehavioral    size={14} />,
  T4: <IconConflict      size={14} />,
  T5: <IconStability     size={14} />,
  T6: <IconVulnerability size={14} />,
  T7: <IconValues        size={14} />,
};

// ── Dimension name → icon mapping for report headings ────────────────
const DIM_ICONS: Record<string, React.ReactNode> = {
  "Emotional Compatibility": <IconEmotional     size={18} />,
  "Communication Style":     <IconCommunication size={18} />,
  "Conflict Approach":       <IconConflict      size={18} />,
  "Values & Lifestyle":      <IconValues        size={18} />,
  "Intimacy & Affection":    <IconIntimacy      size={18} />,
};

const GoldLabel: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: T.gold,
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  marginBottom: "var(--syn-space-3)",
};

// ─── Error boundary ─────────────────────────────────────────────
class ReportErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: "var(--syn-max-width)", margin: "0 auto", padding: "var(--syn-space-12) var(--syn-space-5)" }}>
          <div style={{ ...CS, textAlign: "center", padding: "var(--syn-space-8)" }}>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: "var(--syn-space-5)" }}>
              Something went wrong generating your analysis. Please try again.
            </p>
            <button style={{ ...Btn, maxWidth: 240, margin: "0 auto" }}
              onClick={() => { this.setState({ hasError: false }); this.props.onReset(); }}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type InputErrors = { nameA?: string; dobA?: string; nameB?: string; dobB?: string };

const APPROX_OPTIONS = ["Early Morning", "Morning", "Afternoon", "Evening", "Night"];

// ─── Nav bar ────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(250,248,245,0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${T.border}`,
      padding: "var(--syn-space-3) var(--syn-space-6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <a href="/" style={{
        fontFamily: "var(--syn-font-body)",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: T.gold,
        textDecoration: "none",
      }}>✦ &nbsp;Synastry</a>
      <div className="syn-navbar-right" style={{ fontSize: "0.75rem", color: T.textM }}>Relationship Intelligence</div>
    </nav>
  );
}

// ─── Main component ──────────────────────────────────────────────
export default function SynastryEngine() {
  const topRef = useRef<HTMLDivElement>(null);
  const {
    step, stage, emotion, personA, personB,
    freeReport, quizState, reportData,
    isPaid, isPaymentProcessing, paymentError, isGenerating, fade, actions,
  } = useCompatibilityEngine(topRef);

  const [inputErrs, setInputErrs] = useState<InputErrors>({});
  const [paywallEmail, setPaywallEmail] = useState("");
  const [lockedEmail, setLockedEmail] = useState("");
  const [lockedEmailSubmitted, setLockedEmailSubmitted] = useState(false);
  const [showBtA, setShowBtA] = useState(false);
  const [btModeA, setBtModeA] = useState<"exact" | "approximate">("exact");
  const [includesIdx, setIncludesIdx] = useState(0);
  const [reviewsIdx, setReviewsIdx] = useState(0);

  // Fix 8 — collapsible dimension cards
  const [dimExpanded, setDimExpanded] = useState<boolean[]>(() => {
    if (typeof window === "undefined") return new Array(5).fill(true);
    return new Array(5).fill(window.innerWidth >= 768);
  });

  useEffect(() => {
    let wasDesktop = window.innerWidth >= 768;
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop && !wasDesktop) {
        setDimExpanded(new Array(5).fill(true));
      } else if (!isDesktop && wasDesktop) {
        setDimExpanded(prev => prev.every(v => v) ? new Array(5).fill(false) : prev);
      }
      wasDesktop = isDesktop;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Skip the welcome screen — landing page handles that
  useEffect(() => {
    if (step === 0) actions.goToStep(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [showBtB, setShowBtB] = useState(false);
  const [btModeB, setBtModeB] = useState<"exact" | "approximate">("exact");

  const validate = (): boolean => {
    const errs: InputErrors = {};
    const now = new Date();
    const minDob = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const checkDob = (dob: string, key: "dobA" | "dobB") => {
      if (!dob) { errs[key] = "Date of birth is required"; return; }
      const d = new Date(dob);
      if (d > now) errs[key] = "Date of birth cannot be in the future";
      else if (d < minDob) errs[key] = "Date of birth cannot be more than 100 years ago";
    };
    if (!personA.name || personA.name.trim().length < 2) errs.nameA = "Name must be at least 2 characters";
    checkDob(personA.dob, "dobA");
    if (!personB.name || personB.name.trim().length < 2) errs.nameB = "Name must be at least 2 characters";
    checkDob(personB.dob, "dobB");
    setInputErrs(errs);
    return Object.keys(errs).length === 0;
  };

  const { currentQuestion: quizQ, currentPersonName: quizName, currentIndex: curQ, totalQuestions, progress: quizProg } = quizState;

  const stageLabel = stage === "screening" ? "Initial Signals"
    : stage === "early" ? "Early Stage Patterns"
    : stage === "ongoing" ? "Established Relationship Patterns"
    : stage === "premarriage" ? "Long-term Alignment" : "";

  const makeShareRow = (score: number | string) => {
    const msg = (url: string) => `I just got my compatibility analysis with ${getFirstName(personB.name)} — ${score}/10 connection. Get yours: ${url}`;
    const tweet = (url: string) => `My compatibility analysis with ${getFirstName(personB.name)} — ${score}/10. ${url}`;
    const sBtn: React.CSSProperties = {
      background: "none",
      border: `1px solid var(--syn-border-strong)`,
      color: "#1A1A1A",
      borderRadius: "var(--syn-radius-md)",
      padding: "var(--syn-space-2) var(--syn-space-4)",
      fontSize: "0.8rem",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "var(--syn-font-body)",
      whiteSpace: "nowrap" as const,
      transition: "background 150ms ease, border-color 150ms ease",
    };
    const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      (e.currentTarget).style.background = "var(--syn-gold-tint)";
      (e.currentTarget).style.borderColor = "var(--syn-gold)";
    };
    const onLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      (e.currentTarget).style.background = "none";
      (e.currentTarget).style.borderColor = "var(--syn-border-strong)";
    };
    return (
      <div className="syn-share-row" style={{ display: "flex", gap: "var(--syn-space-2)", marginTop: "var(--syn-space-3)", flexWrap: "wrap" as const }}>
        <button style={sBtn} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={() => { const u = window.location.href; window.open(`https://wa.me/?text=${encodeURIComponent(msg(u))}`, "_blank", "noopener,noreferrer"); }}>Share on WhatsApp</button>
        <button style={sBtn} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={() => { const u = window.location.href; window.open(`mailto:?subject=${encodeURIComponent("My Compatibility Analysis")}&body=${encodeURIComponent(msg(u))}`); }}>Send via Gmail</button>
        <button style={sBtn} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={() => { const u = window.location.href; window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet(u))}`, "_blank", "noopener,noreferrer"); }}>Share on X</button>
      </div>
    );
  };

  const cntFade: React.CSSProperties = { ...cnt, opacity: fade ? 1 : 0, transition: "opacity 0.3s" };

  return (
    <div ref={topRef} style={wrap}>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; }
        ::selection { background: rgba(201,168,76,0.2); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes syn-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* ── Mobile safety ── */
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        img, svg { max-width: 100%; }

        /* ── Hide scrollbars on scroll rows ── */
        .syn-scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .syn-scroll-hide::-webkit-scrollbar { display: none; }

        @media (max-width: 480px) {
          /* Prevent iOS zoom on focus */
          input, select, textarea { font-size: 16px !important; }

          /* Touch targets */
          button { min-height: 48px; }

          /* Stage cards */
          .syn-stage-card { min-height: 64px; width: 100%; }

          /* Quiz answer cards */
          .syn-quiz-card { min-height: 56px; padding: 16px !important; }

          /* Score number */
          .syn-score-num { font-size: clamp(2.5rem, 12vw, 4rem) !important; }

          /* Dimension progress bars — never overflow */
          .syn-dim-bar { max-width: 100%; }

          /* Share buttons — wrap */
          .syn-share-row { flex-wrap: wrap !important; }
          .syn-share-row button { flex: 1 1 100%; }

          /* Nav — prevent overlap */
          .syn-navbar-right { display: none; }

          /* CTA buttons full width */
          .syn-cta-full { width: 100% !important; box-sizing: border-box; }
        }

        @media (max-width: 768px) {
          /* Quiz header: stack on mobile */
          .syn-quiz-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .syn-quiz-header > div:last-child {
            margin-top: 12px;
            align-self: flex-start;
          }

          /* Quiz answer cards */
          .syn-quiz-card { min-height: 56px; padding: 16px !important; }

          /* Reading page: base font size and line height */
          .syn-reading-card {
            font-size: 16px !important;
            line-height: 1.75 !important;
          }

          /* Label blocks: label on its own line */
          .syn-label-block {
            display: block !important;
            margin-bottom: 4px !important;
          }
          .syn-label-block .syn-label-dash {
            display: none !important;
          }

          /* Score bars thicker */
          .syn-score-bar {
            height: 10px !important;
          }

          /* Dimension cards: collapse on mobile */
          .syn-dim-hint {
            display: block !important;
            font-size: 12px;
            color: var(--syn-text-muted);
            font-style: italic;
            margin-top: 12px;
            text-align: center;
          }

          /* Dynamic as a Pair: cap at 4 sentences on mobile - hide full, show partial */
          .syn-dynamic-full { display: none !important; }
          .syn-dynamic-mobile { display: block !important; }

          /* Core Strength/Growth Area padding */
          .syn-strength-growth {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          /* Invitations to Try: nudge titles */
          .syn-nudge-title {
            font-size: 1.1rem !important;
            font-weight: 700 !important;
            color: var(--syn-text-primary) !important;
            margin-bottom: 8px !important;
          }
          .syn-nudge-item:not(:first-child) {
            border-top: 1px solid var(--syn-border) !important;
            padding-top: 12px !important;
          }

          /* Stage card styling */
          .syn-stage-card {
            background: rgba(212, 175, 55, 0.06) !important;
            border-left: 3px solid var(--syn-gold) !important;
          }
          .syn-stage-label {
            color: var(--syn-gold) !important;
          }

          /* Share buttons: stack vertically */
          .syn-share-row {
            flex-direction: column !important;
          }
          .syn-share-row button {
            width: 100% !important;
            margin-bottom: 8px !important;
          }
          /* Order: WhatsApp first, then Gmail, then X - will need HTML order change */

          /* Begin New Analysis button: more visible */
          .syn-btn-secondary {
            background: var(--syn-surface) !important;
            border: 1.5px solid var(--syn-border-strong) !important;
            color: var(--syn-text-primary) !important;
            font-weight: 500 !important;
          }
          .syn-btn-secondary:hover {
            background: var(--syn-border) !important;
          }

          /* Score subtext: stack */
          .syn-score-subtext {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 4px !important;
          }
          .syn-score-subtext-item {
            display: block !important;
          }

          /* Labels: block on mobile for all labeled blocks */
          .syn-labeled-block .syn-label-inline {
            display: block !important;
            margin-bottom: 4px !important;
          }
          .syn-labeled-block .syn-label-dash {
            display: none !important;
          }
        }

        /* Mobile display helpers - default hidden, shown on mobile via media query */
        .syn-dynamic-mobile { display: none; }
        .syn-dynamic-full { display: block; }
        .syn-dim-hint { display: none; }
        .syn-dim-hint { display: none; }
      `}</style>

      <NavBar />

      {/* ── WELCOME ── */}
      {step === 0 && (
        <div style={{ ...cntFade, textAlign: "center", paddingTop: "var(--syn-space-12)" }}>
          <div style={{
            fontFamily: "var(--syn-font-display)",
            fontSize: "clamp(3rem, 10vw, 5rem)",
            lineHeight: 1,
            letterSpacing: "0.15em",
            color: T.gold,
            marginBottom: "var(--syn-space-6)",
          }}>☽ ✦ ♀</div>
          <h1 style={{ ...HS, fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "var(--syn-space-4)" }}>
            Your Relationship Analysis Begins Here
          </h1>
          <p style={{ ...Sub, maxWidth: 460, margin: "0 auto var(--syn-space-10)", fontSize: "1rem" }}>
            Synastry maps the astrology, numerology, and behavioral signatures of two people together
            — not just who you are, but how you move as a pair.
          </p>
          <button
            style={{ ...Btn, maxWidth: 320, margin: "0 auto" }}
            onClick={() => { track("flow_started"); actions.goToStep(1); }}
          >
            Begin My Analysis
          </button>
          <p style={{ fontSize: "0.75rem", color: T.textM, marginTop: "var(--syn-space-6)", lineHeight: 1.7, maxWidth: 380, margin: "var(--syn-space-6) auto 0" }}>
            A reflection and conversation tool. Synastry does not predict outcomes or replace professional guidance.
          </p>
        </div>
      )}

      {/* ── STAGE + EMOTION ── */}
      {step === 1 && (
        <div style={cntFade}>
          <h2 style={HS}>Where are you in this journey?</h2>
          <p style={Sub}>This shapes how we frame your analysis.</p>
          {STAGES.map(s => (
            <div
              key={s.id}
              style={{
                ...Card,
                borderColor: stage === s.id ? T.gold : T.border,
                background: stage === s.id ? T.goldT : T.surface,
                boxShadow: stage === s.id ? T.shadowG : "var(--syn-shadow-sm)",
                minHeight: 88,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              onClick={() => actions.setStage(s.id)}
            >
              <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, marginBottom: "var(--syn-space-1)" }}>{s.label}</div>
              <div style={{ fontSize: "0.875rem", color: T.textS }}>{s.desc}</div>
            </div>
          ))}

          {stage && (
            <div style={{ marginTop: "var(--syn-space-8)" }}>
              <h3 style={{ ...HS, fontSize: "1.3rem" }}>How are you feeling about this?</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                {EMOTIONS.map(e => {
                  const selected = emotion === e.id;
                  return (
                    <div
                      key={e.id}
                      style={{
                        padding: "10px 22px",
                        border: `1px solid ${selected ? "#D4AF37" : T.border}`,
                        borderRadius: 100,
                        background: selected ? "#D4AF37" : "transparent",
                        color: selected ? "#F0EEE9" : "#6B6B6B",
                        fontFamily: "var(--syn-font-body)",
                        fontSize: 14,
                        fontWeight: selected ? 500 : 400,
                        cursor: "pointer",
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s ease",
                        userSelect: "none" as const,
                      }}
                      onClick={() => actions.setEmotion(e.id)}
                      onMouseEnter={e2 => { if (!selected) { (e2.currentTarget as HTMLDivElement).style.background = "rgba(212,175,55,0.12)"; (e2.currentTarget as HTMLDivElement).style.borderColor = "#D4AF37"; } }}
                      onMouseLeave={e2 => { if (!selected) { (e2.currentTarget as HTMLDivElement).style.background = "transparent"; (e2.currentTarget as HTMLDivElement).style.borderColor = T.border; } }}
                    >
                      {e.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stage && emotion && (
            <button style={Btn} onClick={() => actions.goToStep(2)}>Continue</button>
          )}
        </div>
      )}

      {/* ── INPUTS ── */}
      {step === 2 && (
        <div style={cntFade}>
          <h2 style={HS}>Tell us about the two of you</h2>
          <p style={Sub}>Name and date of birth are all we need to begin your analysis.</p>
          {(() => {
            const tBtn: React.CSSProperties = {
              background: "none", border: "none", cursor: "pointer", color: T.textM,
              fontSize: "0.8rem", fontFamily: "inherit", padding: "0", textAlign: "left" as const,
              textDecoration: "underline", textDecorationColor: "rgba(92,84,73,0.3)",
              letterSpacing: "0.01em", display: "block", marginBottom: "var(--syn-space-4)",
            };
            const btBox: React.CSSProperties = {
              marginTop: "var(--syn-space-2)",
              padding: "var(--syn-space-4)",
              background: T.bgAlt,
              border: `1px solid ${T.border}`,
              borderRadius: "var(--syn-radius-lg)",
            };
            return (
              <>
                {/* Person A */}
                <div style={{ ...CS, borderLeft: `3px solid ${T.gold}` }}>
                  <div style={{ ...GoldLabel }}>First Person</div>
                  <label style={Lab}>Full Name</label>
                  <input
                    style={{ ...Inp, borderColor: inputErrs.nameA ? T.error : T.border }}
                    placeholder="Enter name"
                    value={personA.name}
                    onChange={e => { actions.updatePersonA("name", e.target.value); setInputErrs(p => ({ ...p, nameA: undefined })); }}
                  />
                  {inputErrs.nameA && <span style={Err}>{inputErrs.nameA}</span>}
                  <label style={Lab}>Date of Birth</label>
                  <input
                    style={{ ...Inp, borderColor: inputErrs.dobA ? T.error : T.border }}
                    type="date"
                    value={personA.dob}
                    onChange={e => { actions.updatePersonA("dob", e.target.value); setInputErrs(p => ({ ...p, dobA: undefined })); }}
                  />
                  {inputErrs.dobA && <span style={Err}>{inputErrs.dobA}</span>}
                  <button style={tBtn} onClick={() => {
                    setShowBtA(v => {
                      if (v) { actions.updatePersonA("birthTime", null); actions.updatePersonA("birthTimeApprox", null); actions.updatePersonA("birthTimeType", null); }
                      else { actions.updatePersonA("birthTimeType", "exact"); setBtModeA("exact"); }
                      return !v;
                    });
                  }}>{showBtA ? "▲ Hide birth time" : "Refine with birth time (optional) ↓"}</button>
                  {showBtA && <div style={btBox}>
                    {btModeA === "exact"
                      ? <>
                        <label style={{ ...Lab, color: T.gold, fontSize: "0.75rem" }}>Exact birth time</label>
                        <input style={{ ...Inp, marginBottom: "var(--syn-space-2)" }} type="time" value={personA.birthTime ?? ""}
                          onChange={e => { actions.updatePersonA("birthTime", e.target.value || null); actions.updatePersonA("birthTimeType", "exact"); actions.updatePersonA("birthTimeApprox", null); }} />
                        <button style={tBtn} onClick={() => { setBtModeA("approximate"); actions.updatePersonA("birthTime", null); actions.updatePersonA("birthTimeType", "approximate"); }}>I only know roughly →</button>
                      </>
                      : <>
                        <label style={{ ...Lab, color: T.gold, fontSize: "0.75rem" }}>Approximate birth time</label>
                        <select style={{ ...Inp, marginBottom: "var(--syn-space-2)" }} value={personA.birthTimeApprox ?? ""}
                          onChange={e => { actions.updatePersonA("birthTimeApprox", e.target.value || null); actions.updatePersonA("birthTimeType", "approximate"); actions.updatePersonA("birthTime", null); }}>
                          <option value="">Select a time of day</option>
                          {APPROX_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <button style={tBtn} onClick={() => { setBtModeA("exact"); actions.updatePersonA("birthTimeApprox", null); actions.updatePersonA("birthTimeType", "exact"); }}>← I know the exact time</button>
                      </>
                    }
                    {(personA.birthTime || personA.birthTimeApprox) && (
                      <div style={{ fontSize: "0.75rem", color: T.textM, marginTop: "var(--syn-space-2)", lineHeight: 1.5 }}>
                        Used to calculate Moon &amp; Venus signs — enriches your analysis.
                      </div>
                    )}
                  </div>}
                </div>

                {/* Person B */}
                <div style={{ ...CS, borderLeft: `3px solid ${T.plum}` }}>
                  <div style={{ ...GoldLabel, color: T.plum }}>Second Person</div>
                  <label style={Lab}>Full Name</label>
                  <input
                    style={{ ...Inp, borderColor: inputErrs.nameB ? T.error : T.border }}
                    placeholder="Enter name"
                    value={personB.name}
                    onChange={e => { actions.updatePersonB("name", e.target.value); setInputErrs(p => ({ ...p, nameB: undefined })); }}
                  />
                  {inputErrs.nameB && <span style={Err}>{inputErrs.nameB}</span>}
                  <label style={Lab}>Date of Birth</label>
                  <input
                    style={{ ...Inp, borderColor: inputErrs.dobB ? T.error : T.border }}
                    type="date"
                    value={personB.dob}
                    onChange={e => { actions.updatePersonB("dob", e.target.value); setInputErrs(p => ({ ...p, dobB: undefined })); }}
                  />
                  {inputErrs.dobB && <span style={Err}>{inputErrs.dobB}</span>}
                  <button style={tBtn} onClick={() => {
                    setShowBtB(v => {
                      if (v) { actions.updatePersonB("birthTime", null); actions.updatePersonB("birthTimeApprox", null); actions.updatePersonB("birthTimeType", null); }
                      else { actions.updatePersonB("birthTimeType", "exact"); setBtModeB("exact"); }
                      return !v;
                    });
                  }}>{showBtB ? "▲ Hide birth time" : "Refine with birth time (optional) ↓"}</button>
                  {showBtB && <div style={btBox}>
                    {btModeB === "exact"
                      ? <>
                        <label style={{ ...Lab, color: T.plum, fontSize: "0.75rem" }}>Exact birth time</label>
                        <input style={{ ...Inp, marginBottom: "var(--syn-space-2)" }} type="time" value={personB.birthTime ?? ""}
                          onChange={e => { actions.updatePersonB("birthTime", e.target.value || null); actions.updatePersonB("birthTimeType", "exact"); actions.updatePersonB("birthTimeApprox", null); }} />
                        <button style={tBtn} onClick={() => { setBtModeB("approximate"); actions.updatePersonB("birthTime", null); actions.updatePersonB("birthTimeType", "approximate"); }}>I only know roughly →</button>
                      </>
                      : <>
                        <label style={{ ...Lab, color: T.plum, fontSize: "0.75rem" }}>Approximate birth time</label>
                        <select style={{ ...Inp, marginBottom: "var(--syn-space-2)" }} value={personB.birthTimeApprox ?? ""}
                          onChange={e => { actions.updatePersonB("birthTimeApprox", e.target.value || null); actions.updatePersonB("birthTimeType", "approximate"); actions.updatePersonB("birthTime", null); }}>
                          <option value="">Select a time of day</option>
                          {APPROX_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <button style={tBtn} onClick={() => { setBtModeB("exact"); actions.updatePersonB("birthTimeApprox", null); actions.updatePersonB("birthTimeType", "exact"); }}>← I know the exact time</button>
                      </>
                    }
                    {(personB.birthTime || personB.birthTimeApprox) && (
                      <div style={{ fontSize: "0.75rem", color: T.textM, marginTop: "var(--syn-space-2)", lineHeight: 1.5 }}>
                        Used to calculate Moon &amp; Venus signs — enriches your analysis.
                      </div>
                    )}
                  </div>}
                </div>
              </>
            );
          })()}

          {isGenerating
            ? <div style={{ textAlign: "center", padding: "var(--syn-space-8) 0" }}>
              <div style={{ width: 36, height: 36, border: `2px solid ${T.border}`, borderTop: `2px solid ${T.gold}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
              <div style={{ color: T.textM, fontSize: "0.875rem", marginTop: "var(--syn-space-4)" }}>Generating your analysis…</div>
            </div>
            : <>
              <button
                style={{ ...Btn, opacity: (personA.name && personA.dob && personB.name && personB.dob) ? 1 : 0.4 }}
                onClick={() => { if (validate()) actions.submitBasicInfo(); }}
                disabled={isGenerating}
              >
                Begin My Analysis
              </button>
              <div style={{ textAlign: "center", marginTop: "var(--syn-space-4)" }}>
                <PrivacyNote />
              </div>
            </>
          }
        </div>
      )}

      {/* ── FREE TIER ── */}
      {step === 3 && freeReport && (
        <div style={cntFade}>
          <div style={{ textAlign: "center", marginBottom: "var(--syn-space-8)" }}>
            <div style={{ fontFamily: "var(--syn-font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.25rem, 5vw, 1.75rem)", color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "0.01em" }}>
              {freeReport.pA.sign.name}
              <span style={{ fontStyle: "normal", color: T.gold, margin: "0 12px" }}>✦</span>
              {freeReport.pB.sign.name}
            </div>
            <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 12, letterSpacing: "0.08em", color: T.textM, marginTop: 6 }}>
              {freeReport.pA.sign.element} · {freeReport.pB.sign.element}
            </div>
            <h2 style={{ ...HS, fontSize: "1.75rem", marginTop: "var(--syn-space-4)" }}>Your Symbolic Profile</h2>
            <p style={{ ...Sub, marginBottom: 0 }}>Based on astrological &amp; numerological signatures</p>
          </div>

          {/* Score */}
          <div style={{ ...CS, textAlign: "center", padding: "var(--syn-space-10)" }}>
            <div style={{
              fontFamily: "var(--syn-font-display)",
              fontSize: "4rem",
              fontWeight: 300,
              color: T.gold,
              lineHeight: 1,
            }}>
              {freeReport.score}
              <span style={{ fontSize: "1.25rem", color: T.textM, marginLeft: 2 }}>/10</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: T.textM, marginTop: "var(--syn-space-2)", letterSpacing: "0.04em" }}>
              Pattern estimate · astrological and numerological layer · behavioral assessment pending
            </div>
          </div>

          {/* Person A card */}
          <div style={{ ...CS, borderLeft: `3px solid ${T.gold}`, padding: "var(--syn-space-6)" }}>
            <div style={{ ...GoldLabel, marginBottom: "var(--syn-space-4)" }}>
              {getFirstName(personA.name)} — {freeReport.pA.sign.name}
            </div>
            <div style={{
              fontFamily: "var(--syn-font-display)",
              fontSize: "1.3rem",
              fontWeight: 500,
              marginBottom: "var(--syn-space-3)",
            }}>"{freeReport.archA.title}"</div>
            <div style={{ fontSize: "0.9375rem", color: T.textS, lineHeight: 1.85, marginBottom: "var(--syn-space-2)" }}>
              At their core: {freeReport.archA.core}.
            </div>
            <div style={{ fontSize: "0.9375rem", color: T.textS, lineHeight: 1.85, marginBottom: "var(--syn-space-2)" }}>
              In relationships: {freeReport.archA.inRelationship}.
            </div>
            <div style={{ fontSize: "0.9rem", color: T.textM, lineHeight: 1.7, fontStyle: "italic", marginBottom: "var(--syn-space-4)" }}>
              Shadow pattern: {freeReport.archA.shadow}.
            </div>
            <div style={{ height: 1, background: T.border, marginBottom: "var(--syn-space-4)" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: "var(--syn-space-3)" }}>
              <span style={Tag()}>Life Path {freeReport.pA.lifePath}: {freeReport.lpA.title}</span>
              {EXPRESSION_PROFILES[freeReport.pA.expression] && <span style={Tag()}>Expression {freeReport.pA.expression}: {EXPRESSION_PROFILES[freeReport.pA.expression].title}</span>}
              {DESTINY_NUMBER_PROFILES[freeReport.pA.destiny] && <span style={Tag()}>Destiny {freeReport.pA.destiny}: {DESTINY_NUMBER_PROFILES[freeReport.pA.destiny].title}</span>}
            </div>
            <>
              <span className="syn-dynamic-full" style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>
                {buildNumerologySynthesis(getFirstName(personA.name), freeReport.pA.lifePath, freeReport.pA.expression, freeReport.pA.destiny)}
              </span>
              <span className="syn-dynamic-mobile" style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>
                {(() => {
                  const s = buildNumerologySynthesis(getFirstName(personA.name), freeReport.pA.lifePath, freeReport.pA.expression, freeReport.pA.destiny);
                  const sentences = s.split(/(?<=[.!?])\s+/);
                  return sentences.slice(0, 3).join(' ');
                })()}
              </span>
            </>
            {(freeReport.pA.moonSign || freeReport.pA.venusSign) && <div style={{ fontSize: "0.8rem", color: T.textM, lineHeight: 1.6, marginTop: "var(--syn-space-2)", fontStyle: "italic" }}>
              {[freeReport.pA.moonSign && `Moon in ${freeReport.pA.moonSign}`, freeReport.pA.venusSign && `Venus in ${freeReport.pA.venusSign}`].filter(Boolean).join(" · ")}
              {freeReport.pA.isApproximate && " · Based on approximate birth time — directional only"}
            </div>}
          </div>

          {/* Person B card */}
          <div style={{ ...CS, borderLeft: `3px solid ${T.plum}`, padding: "var(--syn-space-6)" }}>
            <div style={{ ...GoldLabel, color: T.plum, marginBottom: "var(--syn-space-4)" }}>
              {getFirstName(personB.name)} — {freeReport.pB.sign.name}
            </div>
            <div style={{
              fontFamily: "var(--syn-font-display)",
              fontSize: "1.3rem",
              fontWeight: 500,
              marginBottom: "var(--syn-space-3)",
            }}>"{freeReport.archB.title}"</div>
            <div style={{ fontSize: "0.9375rem", color: T.textS, lineHeight: 1.85, marginBottom: "var(--syn-space-2)" }}>
              At their core: {freeReport.archB.core}.
            </div>
            <div style={{ fontSize: "0.9375rem", color: T.textS, lineHeight: 1.85, marginBottom: "var(--syn-space-2)" }}>
              In relationships: {freeReport.archB.inRelationship}.
            </div>
            <div style={{ fontSize: "0.9rem", color: T.textM, lineHeight: 1.7, fontStyle: "italic", marginBottom: "var(--syn-space-4)" }}>
              Shadow pattern: {freeReport.archB.shadow}.
            </div>
            <div style={{ height: 1, background: T.border, marginBottom: "var(--syn-space-4)" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: "var(--syn-space-3)" }}>
              <span style={Tag(T.plumT, T.plum)}>Life Path {freeReport.pB.lifePath}: {freeReport.lpB.title}</span>
              {EXPRESSION_PROFILES[freeReport.pB.expression] && <span style={Tag(T.plumT, T.plum)}>Expression {freeReport.pB.expression}: {EXPRESSION_PROFILES[freeReport.pB.expression].title}</span>}
              {DESTINY_NUMBER_PROFILES[freeReport.pB.destiny] && <span style={Tag(T.plumT, T.plum)}>Destiny {freeReport.pB.destiny}: {DESTINY_NUMBER_PROFILES[freeReport.pB.destiny].title}</span>}
            </div>
            <>
              <span className="syn-dynamic-full" style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>
                {buildNumerologySynthesis(getFirstName(personB.name), freeReport.pB.lifePath, freeReport.pB.expression, freeReport.pB.destiny)}
              </span>
              <span className="syn-dynamic-mobile" style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>
                {(() => {
                  const s = buildNumerologySynthesis(getFirstName(personB.name), freeReport.pB.lifePath, freeReport.pB.expression, freeReport.pB.destiny);
                  const sentences = s.split(/(?<=[.!?])\s+/);
                  return sentences.slice(0, 3).join(' ');
                })()}
              </span>
            </>
            {(freeReport.pB.moonSign || freeReport.pB.venusSign) && <div style={{ fontSize: "0.8rem", color: T.textM, lineHeight: 1.6, marginTop: "var(--syn-space-2)", fontStyle: "italic" }}>
              {[freeReport.pB.moonSign && `Moon in ${freeReport.pB.moonSign}`, freeReport.pB.venusSign && `Venus in ${freeReport.pB.venusSign}`].filter(Boolean).join(" · ")}
              {freeReport.pB.isApproximate && " · Based on approximate birth time — directional only"}
            </div>}
          </div>

          {/* Your Dynamic as a Pair — merged element + LP pair section */}
          {(() => {
            const lpPairKey = getLPPairKey(freeReport.pA.lifePath, freeReport.pB.lifePath);
            const lpPairData = LIFE_PATH_PAIR_DYNAMICS[lpPairKey];
            return (
              <>
                <div style={{ ...CS, padding: "var(--syn-space-6)" }}>
                  <div style={{ ...GoldLabel }}>Your Dynamic as a Pair</div>
                  <div style={{
                    fontFamily: "var(--syn-font-display)",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    marginBottom: "var(--syn-space-4)",
                    color: T.text,
                  }}>
                    {freeReport.pA.sign.element} + {freeReport.pB.sign.element} · Life Path {freeReport.pA.lifePath} meets Life Path {freeReport.pB.lifePath}
                  </div>
                  <div style={{ fontSize: "0.9375rem", color: T.textS, lineHeight: 1.85, marginBottom: "var(--syn-space-4)" }}>
                    {buildPairDynamic(getFirstName(personA.name), freeReport.pA, getFirstName(personB.name), freeReport.pB)}
                  </div>
                  <div style={{ display: "flex", gap: "var(--syn-space-3)", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 180, background: T.successT, border: `1px solid rgba(74,124,89,0.15)`, borderRadius: "var(--syn-radius-lg)", padding: "var(--syn-space-4)" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.success, marginBottom: "var(--syn-space-2)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Natural Strength</div>
                      <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.6 }}>
                        {freeReport.elDyn.strength}{lpPairData?.strength ? ` ${personalizePairField(lpPairData.strength, freeReport.pA.lifePath, freeReport.pB.lifePath, getFirstName(personA.name), getFirstName(personB.name))}` : ""}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 180, background: T.roseT, border: `1px solid rgba(196,112,106,0.15)`, borderRadius: "var(--syn-radius-lg)", padding: "var(--syn-space-4)" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.rose, marginBottom: "var(--syn-space-2)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Dynamic to Watch</div>
                      <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.6 }}>
                        {freeReport.elDyn.risk}{lpPairData?.watchFor ? ` ${personalizePairField(lpPairData.watchFor, freeReport.pA.lifePath, freeReport.pB.lifePath, getFirstName(personA.name), getFirstName(personB.name))}` : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Takeaway */}
                {lpPairData && (
                  <div style={{
                    background: "rgba(212,175,55,0.07)",
                    border: `1px solid ${T.border}`,
                    borderLeft: `3px solid var(--syn-gold)`,
                    borderRadius: "var(--syn-radius-xl)",
                    padding: "var(--syn-space-6)",
                    marginBottom: "var(--syn-space-3)",
                    boxShadow: "0 2px 16px rgba(212,175,55,0.10)",
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.gold, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: "var(--syn-space-3)" }}>
                      ✦ Your Key Takeaway
                    </div>
                    <div style={{ width: 40, height: 1, background: T.border, marginBottom: "var(--syn-space-4)" }} />
                    <div style={{ fontSize: "0.9375rem", color: T.text, lineHeight: 1.85 }}>
                      {buildKeyTakeaway(getFirstName(personA.name), freeReport.pA, getFirstName(personB.name), freeReport.pB, lpPairData)}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* CTA to interview */}
          <div style={{ ...CS, background: "rgba(138,154,91,0.07)", border: "none", borderLeft: "3px solid #8A9A5B", padding: "var(--syn-space-6)" }}>
            <div style={{
              fontFamily: "var(--syn-font-display)",
              fontSize: "1.15rem",
              fontWeight: 500,
              color: "#8A9A5B",
              marginBottom: "var(--syn-space-2)",
            }}>✦ Go deeper with the Behavioral Assessment</div>
            <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.7 }}>
              What you've seen is the symbolic layer — archetypes and elemental signatures. The Behavioral Assessment (~3 minutes per person) maps how you actually behave together: communication style, intimacy patterns, conflict rhythms, and long-term alignment.
            </div>
          </div>
          <button style={Btn} onClick={actions.goToPaywall}>Begin the Behavioral Assessment →</button>

          <div style={{ marginTop: "var(--syn-space-4)" }}>
            <div style={{ fontSize: "0.75rem", color: T.textM, marginBottom: "var(--syn-space-1)" }}>Share</div>
            {makeShareRow(freeReport.score)}
          </div>
        </div>
      )}

      {/* ── PAYWALL ── */}
      {step === 4 && (
        <div style={cntFade}>
          {isPaymentProcessing
            ? <div style={{ textAlign: "center", paddingTop: "var(--syn-space-20)" }}>
                <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTop: `3px solid ${T.gold}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                <div style={{ color: T.textM, fontSize: "0.9rem", marginTop: "var(--syn-space-6)", lineHeight: 1.7 }}>Processing your payment…</div>
              </div>
            : <>
                {/* ── Section 1: Header ── */}
                <div style={{ textAlign: "center", paddingTop: 48, marginBottom: "var(--syn-space-6)" }}>
                  <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.gold, marginBottom: "var(--syn-space-3)" }}>
                    Your Portrait Is Ready
                  </div>
                  <h2 style={{ fontFamily: "var(--syn-font-display)", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3rem)", color: T.text, lineHeight: 1.2, marginBottom: "var(--syn-space-4)" }}>
                    Unlock Your Full Analysis
                  </h2>
                  <p style={{ fontFamily: "var(--syn-font-body)", fontSize: 15, color: T.textS, maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
                    Your symbolic profile has been mapped. The behavioral assessment revealed your psychological patterns. What follows is the complete portrait — how you and {getFirstName(personB.name)} function together.
                  </p>
                  <div style={{ width: 60, height: 1, background: T.border, margin: "var(--syn-space-6) auto" }} />
                  {reportData && (
                    <div style={{ marginBottom: "var(--syn-space-2)" }}>
                      <div style={{ display: "inline-block", fontFamily: "var(--syn-font-body)", fontSize: 13, color: T.text, background: T.goldT, border: `1px solid ${T.goldL}`, borderRadius: 100, padding: "10px 24px" }}>
                        Your portrait is ready. We&apos;re holding it for 24 hours.
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Section 2: What's included ── */}
                <div style={{ marginBottom: "var(--syn-space-8)" }}>
                  <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.textM, marginBottom: 20 }}>
                    What Your Portrait Includes
                  </div>
                  <div
                    className="syn-scroll-hide"
                    onScroll={e => { const el = e.currentTarget; setIncludesIdx(Math.min(Math.round(el.scrollLeft / 276), 5)); }}
                    style={{ display: "flex", gap: 16, overflowX: "auto" as const, scrollSnapType: "x mandatory", paddingBottom: 16, paddingTop: 4 }}
                  >
                    {([
                      { icon: <IconBehavioral size={24} color="#8A9A5B" />, title: "Psychological Profiling", body: "Five compatibility dimensions scored from your behavioral responses — not birth data." },
                      { icon: <IconInteraction size={24} color={T.gold} />, title: "Pair Dynamics", body: "How your two profiles interact as a unit — complement points, friction points, emergent patterns." },
                      { icon: <IconSymbolic size={24} color={T.gold} />, title: "Ancient Pattern Recognition", body: "Vedic astrology and numerology cross-referenced with your behavioral data." },
                      { icon: <IconEmotional size={24} color={T.gold} />, title: "Personalized Guidance", body: "3–5 specific nudges built for your dynamic — not generic relationship advice." },
                      { icon: <IconValues size={24} color="#8A9A5B" />, title: "Stage-Specific Insight", body: "Guidance calibrated to where you are in this relationship right now." },
                      { icon: <IconEnvelope size={24} color="#8A9A5B" />, title: "Comprehensive Portrait by Email", body: "A detailed written portrait delivered to your inbox after payment." },
                    ] as { icon: React.ReactNode; title: string; body: string }[]).map((card, i) => (
                      <div key={i} style={{ flexShrink: 0, width: 260, scrollSnapAlign: "start", background: "#FAFAF8", border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px 20px", boxSizing: "border-box" as const }}>
                        <div style={{ marginBottom: 16 }}>{card.icon}</div>
                        <div style={{ fontFamily: "var(--syn-font-display)", fontWeight: 600, fontSize: "1.1rem", color: T.text, marginBottom: 8, lineHeight: 1.3 }}>{card.title}</div>
                        <p style={{ fontFamily: "var(--syn-font-body)", fontSize: 14, color: T.textS, lineHeight: 1.7, margin: 0 }}>{card.body}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: includesIdx === i ? T.gold : T.border, transition: "background 0.2s" }} />
                    ))}
                  </div>
                </div>

                {/* ── Section 4 + 5: Pricing card ── */}
                <div style={{ maxWidth: 520, margin: "0 auto 48px auto", background: "#FAFAF8", border: `1px solid ${T.border}`, borderRadius: 16, padding: "40px 36px", boxShadow: "0 2px 8px rgba(26,26,26,0.06), 0 8px 24px rgba(26,26,26,0.04)", boxSizing: "border-box" as const }}>
                  <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.4rem", fontWeight: 400, fontStyle: "italic" as const, color: T.textS, textAlign: "center" as const, marginBottom: 24 }}>
                    Complete your portrait
                  </div>

                  <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12, flexWrap: "wrap" as const }}>
                    <span style={{ fontFamily: "var(--syn-font-body)", fontSize: 16, color: T.textM, textDecoration: "line-through" }}>₹499</span>
                    <span style={{ fontFamily: "var(--syn-font-display)", fontSize: 52, fontWeight: 300, color: T.text, lineHeight: 1 }}>₹199</span>
                    <span style={{ fontFamily: "var(--syn-font-body)", fontSize: 11, letterSpacing: "0.08em", color: "#8A9A5B", background: "rgba(138,154,91,0.12)", padding: "4px 12px", borderRadius: 100 }}>Limited time</span>
                  </div>

                  <div style={{ marginBottom: 24, textAlign: "left" as const }}>
                    <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 13, color: T.textS, marginBottom: 8 }}>Where should we send your portrait?</div>
                    <input
                      style={{ width: "100%", padding: "12px 0", fontSize: 15, fontFamily: "var(--syn-font-body)", background: "transparent", border: "none", borderBottom: `1px solid ${T.border}`, color: T.text, outline: "none", boxSizing: "border-box" as const, transition: "border-bottom-color 150ms ease", display: "block", marginBottom: 12 }}
                      type="email"
                      placeholder="your@email.com"
                      value={paywallEmail}
                      onChange={e => setPaywallEmail(e.target.value)}
                      onFocus={e => { e.currentTarget.style.borderBottomColor = T.gold; }}
                      onBlur={e => { e.currentTarget.style.borderBottomColor = T.border; }}
                    />
                    <PrivacyNote />
                  </div>

                  <button
                    style={{ width: "100%", height: 54, background: T.gold, color: T.bg, border: "none", borderRadius: 8, padding: "16px 32px", fontFamily: "var(--syn-font-body)", fontWeight: 500, fontSize: 15, letterSpacing: "0.03em", cursor: "pointer", transition: "background 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--syn-space-3)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#C49B20"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.gold; }}
                    onClick={actions.initiatePaymentFromPaywall}
                    disabled={isPaymentProcessing}
                  >
                    Unlock Your Full Portrait — ₹199
                  </button>
                  {paymentError && <div style={{ fontSize: "0.8rem", color: T.error, marginTop: "var(--syn-space-3)", textAlign: "center", lineHeight: 1.6 }}>{paymentError}</div>}

                  <button
                    onClick={actions.startQuiz}
                    style={{ display: "block", width: "100%", textAlign: "center" as const, marginTop: 16, fontFamily: "var(--syn-font-body)", fontSize: 13, color: T.textM, background: "none", border: "none", cursor: "pointer", transition: "color 150ms ease" }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.textS; }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.textM; }}
                  >
                    Continue without unlocking →
                  </button>

                  {/* Trust bar */}
                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, flexWrap: "wrap" as const }}>
                    <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 12, color: T.textM, display: "flex", alignItems: "center", gap: 6 }}>
                      <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      Encrypted &amp; Secure
                    </div>
                    <div style={{ width: 1, height: 14, background: T.border, flexShrink: 0 }} />
                    <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 12, color: T.textM }}>No subscription required</div>
                    <div style={{ width: 1, height: 14, background: T.border, flexShrink: 0 }} />
                    <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 12, color: T.textM }}>Instant access after payment</div>
                  </div>
                </div>
              </>
          }
        </div>
      )}

      {/* ── BEHAVIORAL ASSESSMENT (quiz) ── */}
      {(step === 5 || step === 6) && quizQ && (
        <div style={cntFade}>
          <div className="syn-quiz-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--syn-space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--syn-space-3)" }}>
              <button
                onClick={actions.goBackInQuiz}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.textM, fontSize: "1.2rem", padding: "var(--syn-space-2)", minWidth: 44, minHeight: 44, fontFamily: "inherit", lineHeight: 1, flexShrink: 0 }}
                aria-label="Go back"
              >←</button>
              <div>
                <span style={{ fontSize: "0.75rem", color: T.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{getFirstName(quizName)}'s Assessment</span>
                <span style={{ fontSize: "0.75rem", color: T.textM, marginLeft: "var(--syn-space-3)" }}>{curQ + 1} of {totalQuestions}</span>
              </div>
            </div>
            <span style={{ ...Tag(), display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ opacity: 0.85 }}>{THEME_ICONS[quizQ.themeId!]}</span>
              {THEMES[quizQ.themeId!]?.name}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: T.border, borderRadius: 2, marginBottom: "var(--syn-space-8)" }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldL})`, borderRadius: 2, width: quizProg + "%", transition: "width 0.3s" }} />
          </div>

          <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.3rem", fontWeight: 400, marginBottom: "var(--syn-space-6)", lineHeight: 1.5, color: T.text }}>
            {quizQ.text}
          </h3>

          {quizQ.options.map((o, i) => (
            <div
              key={i}
              className="syn-quiz-card"
              style={{ ...Card, minHeight: 80, display: "flex", alignItems: "center" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.gold; (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadowG; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = T.border; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--syn-shadow-sm)"; }}
              onClick={() => actions.answerQuiz(quizQ.themeId!, o.score)}
            >
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: T.text }}>{o.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── FULL REPORT ── */}
      {step === 7 && reportData && (
        <ReportErrorBoundary onReset={actions.reset}>

          {/* POST BREAKUP */}
          {reportData.post && reportData.pb && (
            <div className="syn-reading-card" style={cntFade}>
              <div style={{ textAlign: "center", marginBottom: "var(--syn-space-8)" }}>
                <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.5rem", fontWeight: 300, color: T.success, marginBottom: "var(--syn-space-3)", letterSpacing: "0.1em" }}>✦</div>
                <h2 style={{ ...HS, fontSize: "1.75rem" }}>Patterns &amp; Reflection</h2>
                <p style={{ fontSize: "0.9rem", color: T.textM }}>{getFirstName(personA.name)} &amp; {getFirstName(personB.name)}</p>
                <p style={{ fontSize: "0.875rem", color: T.textS, marginTop: "var(--syn-space-3)", lineHeight: 1.7, maxWidth: 480, margin: "var(--syn-space-3) auto 0" }}>
                  This isn't a scorecard. It's a map of the patterns between you — what worked, where friction lived, and what to carry forward.
                </p>
              </div>
              {reportData.pb.reflections.map((rf, i) => (
                <div key={i} style={{ ...CS, borderLeft: `3px solid ${[T.success, T.rose, T.gold][i]}`, padding: "var(--syn-space-6)", marginBottom: "var(--syn-space-4)" }}>
                  <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, marginBottom: "var(--syn-space-3)", color: [T.success, T.rose, T.gold][i] }}>{rf.title}</div>
                  <div style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>{rf.text}</div>
                </div>
              ))}
              <div style={{ ...CS, padding: "var(--syn-space-6)", background: T.goldT, border: `1px solid ${T.goldL}` }}>
                <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.goldD, marginBottom: "var(--syn-space-4)" }}>Questions Worth Sitting With</div>
                {reportData.pb.questions.map((q, i) => (
                  <div key={i} style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8, padding: "var(--syn-space-3) 0", borderTop: i > 0 ? `1px solid ${T.goldL}` : "none" }}>{i + 1}. {q}</div>
                ))}
              </div>
              <div style={{ ...CS, padding: "var(--syn-space-6)", marginTop: "var(--syn-space-2)" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.textM, marginBottom: "var(--syn-space-4)" }}>Your Dynamic at a Glance</div>
                {reportData.dims.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--syn-space-3) 0", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: "0.9rem", color: T.textS }}>{d.name}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: d.score >= 7 ? T.success : d.score >= 5 ? T.textM : T.rose }}>
                      {d.score >= 7 ? "Natural alignment" : d.score >= 5 ? "Required effort" : "Core friction point"}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "0.75rem", color: T.textM, textAlign: "center", marginTop: "var(--syn-space-8)", lineHeight: 1.7 }}>
                This reflection is about understanding patterns, not assigning blame.
              </div>
              <button className="syn-btn-secondary" style={GhostBtn} onClick={actions.reset}>Begin a New Analysis</button>
            </div>
          )}

          {/* STANDARD — PAID */}
          {!reportData.post && isPaid && freeReport && (
            <div className="syn-reading-card" style={cntFade}>
              <div style={{ textAlign: "center", marginBottom: "var(--syn-space-8)" }}>
                <div style={{ fontFamily: "var(--syn-font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.25rem, 5vw, 1.75rem)", color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "0.01em", marginBottom: 6 }}>
                  {freeReport.pA.sign.name}
                  <span style={{ fontStyle: "normal", color: T.gold, margin: "0 12px" }}>✦</span>
                  {freeReport.pB.sign.name}
                </div>
                <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 12, letterSpacing: "0.08em", color: T.textM, marginBottom: "var(--syn-space-4)" }}>
                  {freeReport.pA.sign.element} · {freeReport.pB.sign.element}
                </div>
                <h2 style={{ ...HS, fontSize: "1.75rem" }}>Your Synastry Portrait — {toTitleCase(personA.name)} &amp; {toTitleCase(personB.name)}</h2>
              </div>

              {/* Overall score */}
              <div style={{ ...CS, textAlign: "center", padding: "var(--syn-space-10)", border: `1px solid ${T.goldL}` }}>
                <div className="syn-score-large" style={{
                  fontFamily: "var(--syn-font-display)",
                  fontSize: "clamp(2.75rem, 12vw, 4.5rem)",
                  fontWeight: 300,
                  color: sc(reportData.avg),
                  lineHeight: 1,
                }}>
                  {reportData.avg.toFixed(1)}
                  <span style={{ fontSize: "1.5rem", color: T.textM, marginLeft: 2 }}>/10</span>
                </div>
                <div className="syn-score-subtext" style={{ fontSize: "0.8rem", color: T.textM, marginTop: "var(--syn-space-2)", letterSpacing: "0.04em", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                  <span className="syn-score-subtext-item">Overall Compatibility Score</span>
                  <span className="syn-score-subtext-item" style={{ opacity: 0.6 }}>·</span>
                  <span className="syn-score-subtext-item">Astrological</span>
                  <span className="syn-score-subtext-item" style={{ opacity: 0.6 }}>·</span>
                  <span className="syn-score-subtext-item">Behavioral</span>
                  <span className="syn-score-subtext-item" style={{ opacity: 0.6 }}>·</span>
                  <span className="syn-score-subtext-item">Psychological</span>
                </div>
                {reportData.soft && (
                  <div style={{ fontSize: "0.85rem", color: T.rose, marginTop: "var(--syn-space-4)", lineHeight: 1.6, maxWidth: 480, margin: "var(--syn-space-4) auto 0" }}>
                    Scores reflect current signatures, not fixed destiny. Every dimension here can shift through awareness and intention.
                  </div>
                )}
              </div>

              {/* Five Dimensions — collapsible on mobile */}
              <div style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: "var(--syn-radius-xl)",
                overflow: "hidden",
                marginBottom: "var(--syn-space-3)",
                boxShadow: "var(--syn-shadow-sm)",
              }}>
                <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.border}` }}>
                  <h3 style={{
                    fontFamily: "var(--syn-font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#1A1A1A",
                    margin: 0,
                  }}>Five Dimensions</h3>
                  <p className="syn-dim-hint" style={{ fontSize: "12px", color: T.textM, fontStyle: "italic", textAlign: "center", marginTop: 12, marginBottom: 0 }}>Tap any dimension to read the full analysis</p>
                </div>
                {reportData.dims.map((d, i) => {
                  const expanded = dimExpanded.length > 0 ? dimExpanded[i] : true;
                  return (
                    <div key={i} style={{
                      borderTop: i > 0 ? `1px solid ${T.border}` : "none",
                      overflow: "hidden",
                      wordWrap: "break-word" as const,
                      overflowWrap: "break-word" as const,
                    }}>
                      {/* Clickable header row — always visible */}
                      <div
                        role="button"
                        aria-expanded={expanded}
                        onClick={() => setDimExpanded(prev => prev.map((v, j) => j === i ? !v : v))}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px 28px",
                          gap: "var(--syn-space-3)",
                          cursor: "pointer",
                          minHeight: 48,
                          userSelect: "none" as const,
                        }}
                      >
                        <h4 style={{
                          fontFamily: "var(--syn-font-display)",
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          margin: 0,
                          lineHeight: 1.3,
                          wordBreak: "break-word" as const,
                          flex: "1 1 auto",
                          minWidth: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}>
                          <span style={{ color: sc(d.score), flexShrink: 0 }}>{DIM_ICONS[d.name]}</span>
                          {d.name}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--syn-space-2)", flexShrink: 0 }}>
                          <span style={{
                            fontFamily: "var(--syn-font-display)",
                            fontSize: "1.1rem",
                            fontWeight: 500,
                            color: sc(d.score),
                            textAlign: "right" as const,
                          }}>
                            {reportData.soft && d.score < 4 ? "Needs work" : d.score.toFixed(1)}
                          </span>
                          <span style={{
                            color: T.textM,
                            fontSize: 13,
                            display: "inline-block",
                            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                            lineHeight: 1,
                          }}>▾</span>
                        </div>
                      </div>
                      {/* Score bar — always visible */}
                      <div className="syn-score-bar" style={{ height: 4, background: T.border, borderRadius: 2, margin: "0 28px 12px" }}>
                        <div style={{ height: "100%", borderRadius: 2, background: sc(d.score), width: d.score * 10 + "%", transition: "width 0.6s" }} />
                      </div>
                      {/* Collapsible narrative */}
                      <div style={{
                        maxHeight: expanded ? "2000px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease",
                      }}>
                        <div style={{ padding: "0 28px 24px" }}>
                          <p className="syn-labeled-block" style={{ fontSize: "0.9375rem", color: "#1A1A1A", lineHeight: 1.85, margin: 0, wordBreak: "break-word" as const, overflowWrap: "break-word" as const }}>
                            {reportData.ctxs[i].map((t, j) => (
                              <span key={j} className="syn-label-item">
                                <strong className="syn-label-inline" style={{ color: "#6B7B6B" }}>{t.label}</strong>
                                <span className="syn-label-dash" style={{ margin: "0 4px", opacity: 0.7 }}>—</span>
                                <span>{(() => {
                                  const sentences = t.text.split(/(?<=[.!?])\s+/);
                                  return sentences.slice(0, 3).join(' ');
                                })()}</span>
                                {j < reportData.ctxs[i].length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic as a Pair */}
              <div style={{ background: "#FAFAF8", border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, marginBottom: "var(--syn-space-3)", boxShadow: "var(--syn-shadow-sm)" }}>
                <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.25rem", fontWeight: 500, marginBottom: 20, color: T.gold, display: "flex", alignItems: "center", gap: 8 }}>
                  <IconInteraction size={18} color={T.gold} />
                  Your Dynamic as a Pair
                </h3>
                {/* Opening paragraph — different length for mobile */}
                <div className="syn-dynamic-full" style={{ fontFamily: "var(--syn-font-body)", fontSize: 15, color: "#4A4A4A", lineHeight: 1.75, marginBottom: 24, wordBreak: "break-word" as const }}>{reportData.pairFull.opening}</div>
                <div className="syn-dynamic-mobile" style={{ fontFamily: "var(--syn-font-body)", fontSize: 15, color: "#4A4A4A", lineHeight: 1.75, marginBottom: 24, wordBreak: "break-word" as const }}>
                  {(() => {
                    // Split into sentences and show first 4 on mobile
                    const sentences = reportData.pairFull.opening.split(/(?<=[.!?])\s+/);
                    return sentences.slice(0, 4).join(' ');
                  })()}
                </div>

                {/* Complements */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ display: "block", fontFamily: "var(--syn-font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#5C7A5C", marginBottom: 16 }}>Where you complement each other</span>
                  {reportData.pairFull.complements.map((c, i) => (
                    <div key={i} style={{ background: "rgba(92,122,92,0.06)", borderLeft: "2px solid #5C7A5C", borderRadius: "0 6px 6px 0", padding: "12px 16px", marginBottom: 8, fontFamily: "var(--syn-font-body)", fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, wordBreak: "break-word" as const }}>{c}</div>
                  ))}
                </div>

                {/* Frictions */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ display: "block", fontFamily: "var(--syn-font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#A0785A", marginBottom: 16 }}>Where friction tends to live</span>
                  {reportData.pairFull.frictions.map((f, i) => (
                    <div key={i} style={{ background: "rgba(160,120,90,0.06)", borderLeft: "2px solid #A0785A", borderRadius: "0 6px 6px 0", padding: "12px 16px", marginBottom: 8, fontFamily: "var(--syn-font-body)", fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, wordBreak: "break-word" as const }}>{f}</div>
                  ))}
                </div>

                {/* Dynamic to watch */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ display: "block", fontFamily: "var(--syn-font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#D4AF37", marginBottom: 16 }}>The dynamic to watch</span>
                  <div style={{ background: "rgba(212,175,55,0.06)", borderLeft: "2px solid #D4AF37", borderRadius: "0 6px 6px 0", padding: "12px 16px", fontFamily: "var(--syn-font-body)", fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, wordBreak: "break-word" as const }}>{reportData.pairFull.watch}</div>
                </div>

                {/* Life Path pairing — only shown when there is content */}
                {reportData.pairFull.lpSection && (
                  <div>
                    <span style={{ display: "block", fontFamily: "var(--syn-font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.goldD, marginBottom: 16 }}>How your orientations shape the dynamic</span>
                    <div style={{ background: "rgba(212,175,55,0.06)", borderLeft: "2px solid #D4AF37", borderRadius: "0 6px 6px 0", padding: "12px 16px", fontFamily: "var(--syn-font-body)", fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, wordBreak: "break-word" as const }}>{reportData.pairFull.lpSection}</div>
                  </div>
                )}
              </div>

              {/* Core Strength */}
              <div style={{ ...CS, borderLeft: `3px solid ${T.success}`, padding: "var(--syn-space-6)" }}>
                <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.success, marginBottom: "var(--syn-space-3)" }}>
                  ✦ Core Strength — {getFirstName(reportData.best.name)}
                </h3>
                <div className="syn-labeled-block syn-strength-growth" style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>
                  {reportData.sNarr.map((t, j) => (
                    <div key={j} style={{ marginBottom: j < reportData.sNarr.length - 1 ? 12 : 0 }}>
                      <strong className="syn-label-inline" style={{ color: "#6B7B6B" }}>{t.label}</strong>
                      <span className="syn-label-dash" style={{ margin: "0 4px", opacity: 0.7 }}>—</span>
                      <span>{(() => {
                        const sentences = t.text.split(/(?<=[.!?])\s+/);
                        return sentences.slice(0, 3).join(' ');
                      })()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Area */}
              <div style={{ ...CS, borderLeft: `3px solid ${T.rose}`, padding: "var(--syn-space-6)" }}>
                <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.rose, marginBottom: "var(--syn-space-3)" }}>
                  ↗ Growth Area — {getFirstName(reportData.worst.name)}
                </h3>
                <div className="syn-labeled-block syn-strength-growth" style={{ fontSize: "0.9rem", color: T.textS, lineHeight: 1.8 }}>
                  {reportData.gNarr.map((t, j) => (
                    <div key={j} style={{ marginBottom: j < reportData.gNarr.length - 1 ? 12 : 0 }}>
                      <strong className="syn-label-inline" style={{ color: "#8B5E5E" }}>{t.label}</strong>
                      <span className="syn-label-dash" style={{ margin: "0 4px", opacity: 0.7 }}>—</span>
                      <span>{(() => {
                        const sentences = t.text.split(/(?<=[.!?])\s+/);
                        return sentences.slice(0, 3).join(' ');
                      })()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nudges */}
              <div style={{ background: "#FAFAF8", border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, marginBottom: "var(--syn-space-3)", boxShadow: "var(--syn-shadow-sm)" }}>
                <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 600, color: "#D4AF37", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                  <IconEmotional size={18} color="#D4AF37" />
                  Invitations to Try
                </h3>
                {reportData.nudges.map((n, i) => (
                  <div key={i} className="syn-nudge-item" style={{ position: "relative", paddingTop: 20, paddingBottom: i < reportData.nudges.length - 1 ? 20 : 0, borderBottom: i < reportData.nudges.length - 1 ? `1px solid ${T.border}` : "none", overflow: "hidden" }}>
                    {/* Decorative number */}
                    <div style={{ position: "absolute", top: 12, right: 0, fontFamily: "var(--syn-font-display)", fontSize: 48, fontWeight: 300, color: T.border, lineHeight: 1, userSelect: "none" as const, pointerEvents: "none" as const }}>{i + 1}</div>
                    <div className="syn-nudge-title" style={{ fontFamily: "var(--syn-font-body)", fontWeight: 600, fontSize: 15, color: "#1A1A1A", marginBottom: 8, paddingRight: 40, wordBreak: "break-word" as const }}>{n.title}</div>
                    <div style={{ fontFamily: "var(--syn-font-body)", fontWeight: 400, fontSize: 15, color: "#4A4A4A", lineHeight: 1.75, wordBreak: "break-word" as const }}>{n.text}</div>
                  </div>
                ))}
              </div>

              {/* Stage context */}
              <div className="syn-stage-card" style={{ ...CS, background: T.goldT, border: `1px solid ${T.goldL}`, padding: "var(--syn-space-6)" }}>
                <div className="syn-stage-label" style={{ fontSize: "0.85rem", fontWeight: 600, color: T.goldD, marginBottom: "var(--syn-space-2)" }}>{stageLabel}</div>
                <div className="syn-strength-growth" style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.8 }}>
                  {stage === "screening" && `These patterns suggest what to explore in early conversations. Pay particular attention to ${getFirstName(reportData.worst.name)} — not as a dealbreaker, but as a topic to explore openly before investing further. The strength in ${getFirstName(reportData.best.name)} is a genuine positive signal worth noticing.`}
                  {stage === "early" && `Early patterns often shift as people relax and reveal more of themselves. Your strength in ${getFirstName(reportData.best.name)} is likely genuine — lean into it. The gap in ${getFirstName(reportData.worst.name)} may narrow as you learn each other's patterns, or it may be a real difference worth understanding now.`}
                  {stage === "ongoing" && `You've likely already experienced both the strength (${getFirstName(reportData.best.name)}) and the friction (${getFirstName(reportData.worst.name)}) this analysis describes. The value here is naming these patterns explicitly — so you can work with them intentionally rather than reactively.`}
                  {stage === "premarriage" && `Before a long-term commitment, the most important conversation isn't about ${getFirstName(reportData.best.name)} — that's already working. It's about ${getFirstName(reportData.worst.name)}: do you both see it? Are you both willing to work on it? No tool can tell you whether to commit to someone. These insights help you ask better questions.`}
                </div>
              </div>

              <div style={{ fontSize: "0.7rem", color: T.textM, textAlign: "center", marginTop: "var(--syn-space-8)", lineHeight: 1.7, padding: "0 var(--syn-space-5)" }}>
                This analysis blends symbolic frameworks with behavioral patterns. Scores are estimates based on your inputs — not scientific measurements or predictions.
              </div>
              <div style={{ marginTop: "var(--syn-space-5)" }}>
                <div style={{ fontSize: "0.75rem", color: T.textM, marginBottom: "var(--syn-space-1)" }}>Share</div>
                {makeShareRow(reportData.avg.toFixed(1))}
              </div>
              <button className="syn-btn-secondary" style={GhostBtn} onClick={actions.reset}>Begin a New Analysis</button>
            </div>
          )}

          {/* STANDARD — LOCKED */}
          {!reportData.post && !isPaid && freeReport && (() => {
            const bestIdx = reportData.dims.findIndex(d => d.key === reportData.best.key);
            return (
              <div className="syn-reading-card" style={cntFade}>
                <div style={{ textAlign: "center", marginBottom: "var(--syn-space-8)" }}>
                  <div style={{ fontFamily: "var(--syn-font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.25rem, 5vw, 1.75rem)", color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "0.01em", marginBottom: 6 }}>
                    {freeReport.pA.sign.name}
                    <span style={{ fontStyle: "normal", color: T.gold, margin: "0 12px" }}>✦</span>
                    {freeReport.pB.sign.name}
                  </div>
                  <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 12, letterSpacing: "0.08em", color: T.textM, marginBottom: "var(--syn-space-4)" }}>
                    {freeReport.pA.sign.element} · {freeReport.pB.sign.element}
                  </div>
                  <h2 style={{ ...HS, fontSize: "1.75rem" }}>Your Synastry Portrait</h2>
                  <p style={{ fontSize: "0.9rem", color: T.textM }}>{getFirstName(personA.name)} &amp; {getFirstName(personB.name)}</p>
                </div>

                {/* Email capture */}
                <div style={{ ...CS, background: T.goldT, border: `1px solid ${T.goldL}`, padding: "var(--syn-space-6)", marginBottom: "var(--syn-space-2)" }}>
                  <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.goldD, marginBottom: "var(--syn-space-2)" }}>Your chart is ready.</div>
                  <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.7, marginBottom: "var(--syn-space-4)" }}>Enter your email and we'll hold it for 24 hours.</div>
                  <div style={{ display: "flex", gap: "var(--syn-space-2)", marginBottom: "var(--syn-space-3)", flexWrap: "wrap" as const }}>
                    <input
                      style={{ ...Inp, flex: "1 1 200px", marginBottom: 0 }}
                      type="email"
                      placeholder="your@email.com"
                      value={lockedEmail}
                      onChange={e => setLockedEmail(e.target.value)}
                    />
                    <button
                      style={{ background: T.goldT, color: T.goldD, border: `1px solid ${T.goldL}`, borderRadius: "var(--syn-radius-md)", padding: "var(--syn-space-3) var(--syn-space-5)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
                      onClick={() => { if (lockedEmail.includes("@")) setLockedEmailSubmitted(true); }}
                    >
                      {lockedEmailSubmitted ? "✓ Saved" : "Notify Me"}
                    </button>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: T.textM, lineHeight: 1.6 }}>
                    Reveal anytime for ₹199 to get your full analysis + comprehensive email breakdown.
                  </div>
                </div>

                {/* Top CTA */}
                <div style={{ ...CS, background: T.goldT, border: `1px solid ${T.goldL}`, padding: "var(--syn-space-6)", marginBottom: "var(--syn-space-2)" }}>
                  <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.goldD, marginBottom: "var(--syn-space-2)" }}>Your full analysis is ready</div>
                  <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.7, marginBottom: "var(--syn-space-4)" }}>
                    You completed the Behavioral Assessment — unlock your personalised scores, dimension breakdown, and relationship insights.
                  </div>
                  <button
                    style={{ ...Btn, marginTop: 0, opacity: isPaymentProcessing ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--syn-space-3)" }}
                    onClick={actions.initiatePaymentFromReport}
                    disabled={isPaymentProcessing}
                  >
                    {isPaymentProcessing
                      ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(26,35,64,0.2)", borderTop: `2px solid ${T.navy}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Processing…</>
                      : "Unlock My Full Analysis — ₹199"
                    }
                  </button>
                  {paymentError && <div style={{ fontSize: "0.8rem", color: T.error, marginTop: "var(--syn-space-3)", lineHeight: 1.6 }}>{paymentError}</div>}
                </div>

                {/* Five Dimensions — 1 revealed */}
                <div style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: "var(--syn-radius-xl)",
                  overflow: "hidden",
                  marginBottom: "var(--syn-space-3)",
                  boxShadow: "var(--syn-shadow-sm)",
                }}>
                  <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.border}` }}>
                    <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.25rem", fontWeight: 600, color: "#1A1A1A", margin: 0 }}>Five Dimensions</h3>
                  </div>
                  {reportData.dims.map((d, i) => {
                    const isRevealed = i === bestIdx;
                    return (
                      <div key={i} style={{
                        padding: "24px 28px",
                        borderTop: i > 0 ? `1px solid ${T.border}` : "none",
                        overflow: "hidden",
                        wordWrap: "break-word" as const,
                        overflowWrap: "break-word" as const,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--syn-space-2)", gap: "var(--syn-space-3)" }}>
                          <h4 style={{
                            fontFamily: "var(--syn-font-display)",
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "#1A1A1A",
                            margin: 0,
                            lineHeight: 1.3,
                            wordBreak: "break-word" as const,
                            flex: "1 1 auto",
                            minWidth: 0,
                          }}>{d.name}</h4>
                          <span style={{
                            fontFamily: "var(--syn-font-display)",
                            fontSize: "1.25rem",
                            fontWeight: 500,
                            color: isRevealed ? sc(d.score) : T.textM,
                            flexShrink: 0,
                            textAlign: "right" as const,
                          }}>
                            {isRevealed ? (reportData.soft && d.score < 4 ? "Needs work" : d.score.toFixed(1)) : "—"}
                          </span>
                        </div>
                        <div className="syn-score-bar" style={{ height: 4, background: T.border, borderRadius: 2, marginBottom: "var(--syn-space-4)" }}>
                          {isRevealed
                            ? <div style={{ height: "100%", borderRadius: 2, background: sc(d.score), width: d.score * 10 + "%", transition: "width 0.6s" }} />
                            : <div style={{ height: "100%", borderRadius: 2, background: T.border, width: "55%", filter: "blur(3px)" }} />
                          }
                        </div>
                        {isRevealed
                          ? <p style={{ fontSize: "0.9375rem", color: "#1A1A1A", lineHeight: 1.85, margin: 0, wordBreak: "break-word" as const, overflowWrap: "break-word" as const }}>{reportData.ctxs[i].map((t, j) => <span key={j}><strong style={{ color: "#6B7B6B" }}>{t.label}</strong> — {t.text}{j < reportData.ctxs[i].length - 1 && <br />} </span>)}</p>
                          : <p style={{ fontSize: "0.9375rem", color: "#1A1A1A", lineHeight: 1.85, margin: 0, filter: "blur(5px)", userSelect: "none", pointerEvents: "none", wordBreak: "break-word" as const }}>{reportData.ctxs[i][0]?.text ?? ""}</p>
                        }
                      </div>
                    );
                  })}
                </div>

                {/* Core Strength — locked */}
                <div style={{ ...CS, borderLeft: `3px solid ${T.border}`, padding: "var(--syn-space-6)" }}>
                  <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.textM, marginBottom: "var(--syn-space-3)" }}>✦ Core Strength — Locked</h3>
                  <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.8, filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>{reportData.sNarr[0]?.text ?? ""}</div>
                </div>

                {/* Growth Area — locked */}
                <div style={{ ...CS, borderLeft: `3px solid ${T.border}`, padding: "var(--syn-space-6)" }}>
                  <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.textM, marginBottom: "var(--syn-space-3)" }}>↗ Growth Area — Locked</h3>
                  <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.8, filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>{reportData.gNarr[0]?.text ?? ""}</div>
                </div>

                {/* Nudges — locked */}
                <div style={{ ...CS, padding: "var(--syn-space-7)" }}>
                  <h3 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.1rem", fontWeight: 500, color: T.textM, marginBottom: "var(--syn-space-5)" }}>Relationship Nudges — Locked</h3>
                  {reportData.nudges.map((n, i) => (
                    <div key={i} style={{ marginBottom: "var(--syn-space-5)", paddingBottom: "var(--syn-space-5)", borderBottom: i < reportData.nudges.length - 1 ? `1px solid ${T.border}` : "none" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: T.textM, marginBottom: "var(--syn-space-2)" }}>{n.title}</div>
                      <div style={{ fontSize: "0.875rem", color: T.textS, lineHeight: 1.8, filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>{n.text}</div>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div style={{ ...CS, background: T.goldT, border: `1px solid ${T.goldL}`, padding: "var(--syn-space-6)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.15rem", fontWeight: 400, color: T.goldD, marginBottom: "var(--syn-space-2)" }}>
                    Reveal everything above for ₹199
                  </div>
                  <div style={{ fontSize: "0.8rem", color: T.textM, lineHeight: 1.7, marginBottom: "var(--syn-space-5)" }}>
                    One-time payment. Instant access. No subscription required.
                  </div>
                  <button
                    style={{ ...Btn, maxWidth: 360, margin: "0 auto", opacity: isPaymentProcessing ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--syn-space-3)" }}
                    onClick={actions.initiatePaymentFromReport}
                    disabled={isPaymentProcessing}
                  >
                    {isPaymentProcessing
                      ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(26,35,64,0.2)", borderTop: `2px solid ${T.navy}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Processing…</>
                      : "Unlock My Full Analysis — ₹199"
                    }
                  </button>
                </div>

                <div style={{ fontSize: "0.7rem", color: T.textM, textAlign: "center", marginTop: "var(--syn-space-8)", lineHeight: 1.7, padding: "0 var(--syn-space-5)" }}>
                  This analysis blends symbolic frameworks with behavioral patterns. Scores are estimates based on your inputs — not scientific measurements or predictions.
                </div>
                <button className="syn-btn-secondary" style={GhostBtn} onClick={actions.reset}>Begin a New Analysis</button>
              </div>
            );
          })()}

        </ReportErrorBoundary>
      )}
    </div>
  );
}
