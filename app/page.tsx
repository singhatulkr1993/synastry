"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IconSymbolic, IconBehavioral, IconInteraction, IconValues } from "@/components/icons/SynastryIcons";
import { PrivacyNote } from "@/components/ui/PrivacyNote";

const T = {
  hero: {
    fontFamily: "var(--syn-font-display)",
    fontWeight: 300,
    fontSize: "clamp(2.2rem, 7vw, 4rem)",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    color: "var(--syn-text-inverse)",
    maxWidth: 720,
    margin: "0 auto",
  } as React.CSSProperties,
  heroSub: {
    fontFamily: "var(--syn-font-body)",
    fontWeight: 300,
    fontSize: "clamp(1rem, 2.5vw, 1.0625rem)",
    lineHeight: 1.8,
    color: "rgba(250,248,245,0.72)",
    maxWidth: 560,
    margin: "0 auto",
  } as React.CSSProperties,
  sectionLabel: {
    fontFamily: "var(--syn-font-body)",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--syn-gold)",
    marginBottom: "var(--syn-space-4)",
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "var(--syn-font-display)",
    fontWeight: 400,
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
    lineHeight: 1.25,
    color: "var(--syn-text-primary)",
    marginBottom: "var(--syn-space-4)",
  } as React.CSSProperties,
  sectionBody: {
    fontFamily: "var(--syn-font-body)",
    fontSize: "1rem",
    lineHeight: 1.75,
    color: "var(--syn-text-secondary)",
  } as React.CSSProperties,
};

const REVIEWS = [
  {
    name: "Kavya S.",
    city: "Mumbai",
    text: "I was skeptical but this actually named something my partner and I had been circling around for months. The communication dimension was uncomfortably accurate. We used the nudges as a starting point for a real conversation.",
  },
  {
    name: "Rohan M.",
    city: "Bangalore",
    text: "The 'Dynamic as a Pair' section was worth it alone. Seeing our signs and life paths decoded together — not just separately — was something I hadn't found anywhere else. Practical, not mystical.",
  },
  {
    name: "Ananya K.",
    city: "Delhi",
    text: "What struck me was that it didn't just tell us we were compatible — it told us exactly where to watch out and why. That specificity is rare. Forwarded the portrait to my partner and we talked about it for an hour.",
  },
];

// Social icon components — thin stroke, fill none
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M4 4 L20 20 M20 4 L4 20" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconPinterest() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 15 C9 15 10 10 10 8.5 C10 7 11 6 12.5 6 C14.5 6 15 7.5 14.5 9 C14 10.5 12.5 11 12.5 12.5 C12.5 13.5 13.5 14 14.5 13 M10 14 L9.5 17" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9 10 C9 9 10 8.5 10.5 9 L11.5 10.5 C12 11 11.5 11.5 11 12 C11 12 12 13.5 13.5 14.5 C14 15 14.5 14.5 15 14 C15.5 13.5 16 13 16.5 13.5" />
    </svg>
  );
}

function ReviewCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx(i => (i + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

  const goTo = (i: number) => setIdx((i + REVIEWS.length) % REVIEWS.length);

  return (
    <div
      style={{ position: "relative", width: "100%", overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div style={{
        display: "flex",
        transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
        transform: `translateX(-${idx * 100}%)`,
      }}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (dx < -50) goTo(idx + 1);
          else if (dx > 50) goTo(idx - 1);
        }}
      >
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ flexShrink: 0, width: "100%", padding: "0 24px", boxSizing: "border-box" as const }}>
            <div style={{
              background: "var(--syn-surface)",
              border: "1px solid var(--syn-border)",
              borderRadius: 12,
              padding: "36px 32px",
              maxWidth: 600,
              margin: "0 auto",
              boxSizing: "border-box" as const,
            }}>
              <div style={{
                fontFamily: "var(--syn-font-display)",
                fontSize: 64,
                lineHeight: 0.8,
                color: "var(--syn-gold)",
                marginBottom: 16,
                userSelect: "none" as const,
              }}>&ldquo;</div>
              <div style={{ color: "var(--syn-gold)", fontSize: "0.875rem", letterSpacing: 3, marginBottom: 16 }}>★★★★★</div>
              <p style={{
                fontFamily: "var(--syn-font-display)",
                fontSize: "1.2rem",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.9,
                color: "var(--syn-text-primary)",
                marginBottom: 24,
              }}>{r.text}</p>
              <div style={{ width: 40, height: 1, background: "var(--syn-border-strong)", marginBottom: 16 }} />
              <div style={{ fontFamily: "var(--syn-font-body)", fontWeight: 500, fontSize: 14, color: "var(--syn-text-primary)" }}>{r.name}</div>
              <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 13, color: "var(--syn-text-muted)", marginTop: 2 }}>{r.city}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 28 }}>
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: idx === i ? 20 : 6,
              height: 6,
              borderRadius: "var(--syn-radius-full)",
              background: idx === i ? "var(--syn-gold)" : "var(--syn-border)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main style={{ background: "var(--syn-bg)", color: "var(--syn-text-primary)", fontFamily: "var(--syn-font-body)" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "var(--syn-gradient-hero)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--syn-space-20) var(--syn-space-6) 8rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow overlay */}
        <div style={{ position: "absolute", inset: 0, background: "var(--syn-gradient-glow)", pointerEvents: "none" }} />

        {/* Wordmark */}
        <div style={{
          fontFamily: "var(--syn-font-body)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--syn-gold)",
          marginBottom: "var(--syn-space-10)",
        }}>
          ✦ &nbsp;Synastry
        </div>

        {/* Eyebrow */}
        <div style={{
          fontFamily: "var(--syn-font-body)",
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(250,248,245,0.45)",
          marginBottom: "var(--syn-space-6)",
        }}>
          Relationship Intelligence · Behavioral Science · Ancient Wisdom
        </div>

        {/* Converging paths SVG */}
        <svg
          viewBox="0 0 120 40"
          width={120}
          height={40}
          style={{ display: "block", margin: "0 auto var(--syn-space-8)" }}
        >
          <path d="M0,20 C30,20 45,20 60,20" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.7" />
          <path d="M120,20 C90,20 75,20 60,20" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.7" />
          <circle cx="60" cy="20" r="2" fill="#D4AF37" />
        </svg>

        <h1 style={T.hero}>
          Relationship Intelligence,<br />
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>Where Behavioral Science Meets Ancient Wisdom</em>
        </h1>

        <p style={{ ...T.heroSub, margin: "var(--syn-space-6) auto var(--syn-space-10)" }}>
          Synastry combines behavioral psychology and psychometric profiling with Vedic astrology and
          numerology — two scientific traditions, Eastern and Western, working together to reveal how
          you and another person function as a pair.
        </p>

        <Link href="/reading" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--syn-space-2)",
          padding: "var(--syn-space-4) var(--syn-space-10)",
          background: "var(--syn-gradient-gold)",
          color: "var(--syn-navy)",
          fontFamily: "var(--syn-font-body)",
          fontWeight: 600,
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: "var(--syn-radius-full)",
          boxShadow: "var(--syn-shadow-gold)",
          transition: "transform 250ms var(--syn-ease-spring), box-shadow 250ms var(--syn-ease-out)",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--syn-shadow-glow)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--syn-shadow-gold)";
          }}
        >
          Begin Your Analysis
        </Link>

        {/* Privacy note */}
        <div style={{ marginTop: "var(--syn-space-4)", opacity: 0.6 }}>
          <PrivacyNote />
        </div>

        <p style={{
          marginTop: "var(--syn-space-3)",
          fontSize: "0.72rem",
          color: "rgba(250,248,245,0.35)",
          letterSpacing: "0.04em",
        }}>
          A guidance and pattern recognition tool — not prediction, not prescription.
        </p>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: "var(--syn-space-8)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: 0.4,
        }}>
          <div style={{ width: 1, height: 40, background: "var(--syn-gold-light)" }} />
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--syn-gold-light)" }}>SCROLL</div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: "var(--syn-space-24) var(--syn-space-6)",
        maxWidth: "var(--syn-max-width-lg)",
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "var(--syn-space-16)" }}>
          <h2 style={{
            fontFamily: "var(--syn-font-display)",
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--syn-text-primary)",
            lineHeight: 1.2,
            margin: 0,
          }}>
            How It Works
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--syn-space-5)" }}>
          {[
            {
              step: "I",
              title: "We Surface Your Patterns",
              icon: <IconSymbolic size={32} color="#D4AF37" />,
              body: "Vedic astrology and numerology act as the first lens — ancient Eastern frameworks that have mapped personality archetypes and relationship dynamics for centuries. Your birth data generates a symbolic profile that seeds the analysis.",
              topBorder: "#D4AF37",
            },
            {
              step: "II",
              title: "We Profile Your Behavior",
              icon: <IconBehavioral size={32} color="#8A9A5B" />,
              body: "A scenario-based behavioral assessment — the same methodology used in psychometric profiling — builds your psychological portrait from how you actually respond under real conditions, not how you describe yourself.",
              topBorder: "#8A9A5B",
            },
            {
              step: "III",
              title: "We Map Your Dynamic",
              icon: <IconInteraction size={32} color="#D4AF37" />,
              body: "The analysis doesn't stop at two individual profiles. It models the emergent dynamic between you — where your patterns complement, where they create friction, and what that means in practice.",
              topBorder: "#D4AF37",
            },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "36px 28px",
              background: "var(--syn-surface)",
              border: "1px solid var(--syn-border)",
              borderTop: `2px solid ${s.topBorder}`,
              borderRadius: 12,
              boxSizing: "border-box" as const,
            }}>
              <div style={{ marginBottom: 8 }}>{s.icon}</div>
              <div
              className="roman-numeral"
              style={{
                fontFamily: "var(--syn-font-display)",
                fontSize: "2rem",
                fontWeight: 300,
                color: "var(--syn-border)",
                lineHeight: 0.85,
                marginBottom: 16,
                userSelect: "none" as const,
              }}>
                {s.step}
              </div>
              <div style={{
                fontFamily: "var(--syn-font-display)",
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "var(--syn-text-primary)",
                marginBottom: 12,
                lineHeight: 1.3,
              }}>
                {s.title}
              </div>
              <p style={{ fontFamily: "var(--syn-font-body)", fontSize: 15, color: "var(--syn-text-secondary)", lineHeight: 1.8, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUR FRAMEWORKS ── */}
      <section style={{
        padding: "var(--syn-space-24) var(--syn-space-6)",
        background: "var(--syn-bg-alt)",
      }}>
        <div style={{ maxWidth: "var(--syn-max-width-lg)", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--syn-space-16)" }}>
            <div style={T.sectionLabel}>What You Receive</div>
            <div style={{ width: 48, height: 1, background: "var(--syn-gradient-gold)", margin: "0 auto var(--syn-space-6)" }} />
            <h2 style={{ ...T.sectionTitle, marginBottom: "var(--syn-space-2)" }}>
              Four Frameworks, One Portrait
            </h2>
            <p style={{ ...T.sectionBody, maxWidth: 440, margin: "0 auto" }}>
              Eastern and Western traditions, working together.
            </p>
          </div>

          <style>{`
            @media (max-width: 768px) {
              .frameworks-grid { grid-template-columns: 1fr !important; }
              .how-it-works-card { padding: 24px !important; }
              .roman-numeral { font-size: 2rem !important; display: block !important; margin-bottom: 12px !important; }
            }
            @media (min-width: 768px) {
              .frameworks-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
          <div className="frameworks-grid" style={{
  display: "grid",
  gap: "var(--syn-space-5)",
  gridTemplateColumns: "repeat(2, 1fr)"
}}>
            {[
              {
                icon: <IconBehavioral size={32} color="#8A9A5B" />,
                title: "Psychological Profiling",
                body: "A scenario-based behavioral assessment that builds your psychological profile — and your partner's — from how you actually respond, not self-reported traits.",
              },
              {
                icon: <IconSymbolic size={32} color="#D4AF37" />,
                title: "Ancient Pattern Recognition",
                body: "Vedic astrology and numerology surface archetypal patterns that Eastern traditions have mapped for centuries — cross-referenced with your behavioral data.",
              },
              {
                icon: <IconInteraction size={32} color="#D4AF37" />,
                title: "Pair Dynamics Analysis",
                body: "The emergent dynamic between your two profiles — where you naturally complement each other, where friction lives, and what to do about it.",
              },
              {
                icon: <IconValues size={32} color="#8A9A5B" />,
                title: "Personalized Guidance",
                body: "Specific, actionable guidance calibrated to your unique dynamic and where you are in this relationship — not generic advice.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 32,
                background: "var(--syn-surface)",
                border: "1px solid var(--syn-border)",
                borderRadius: 12,
                boxShadow: "var(--syn-shadow-sm)",
                boxSizing: "border-box",
                maxWidth: "100%",
                width: "100%",
              }}>
                <div style={{ marginBottom: "var(--syn-space-5)" }}>{item.icon}</div>
                <div style={{
                  fontFamily: "var(--syn-font-display)",
                  fontSize: "1.35rem",
                  fontWeight: 600,
                  color: "var(--syn-text-primary)",
                  marginBottom: "var(--syn-space-3)",
                  lineHeight: 1.3,
                }}>{item.title}</div>
                <p style={{ ...T.sectionBody, fontSize: "0.9rem", margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{
        padding: "var(--syn-space-24) 0",
        overflow: "hidden",
      }}>
        <div style={{ textAlign: "center", marginBottom: "var(--syn-space-12)", padding: "0 var(--syn-space-6)" }}>
          <h2 style={{
            fontFamily: "var(--syn-font-display)",
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--syn-text-primary)",
            lineHeight: 1.2,
            margin: "0 0 var(--syn-space-3)",
          }}>What People Say</h2>
          <p style={{
            fontFamily: "var(--syn-font-body)",
            fontSize: 14,
            color: "var(--syn-text-muted)",
            margin: 0,
          }}>From people who&apos;ve used Synastry to understand their connections.</p>
        </div>
        <ReviewCarousel />
      </section>

      {/* ── PRICING ── */}
      <section style={{
        padding: "var(--syn-space-24) var(--syn-space-6)",
        background: "var(--syn-navy)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "var(--syn-max-width-lg)", margin: "0 auto" }}>
          <div style={{ ...T.sectionLabel, color: "var(--syn-gold-light)" }}>Pricing</div>
          <div style={{ width: 48, height: 1, background: "var(--syn-gradient-gold)", margin: "0 auto var(--syn-space-6)" }} />
          <h2 style={{
            ...T.sectionTitle,
            color: "var(--syn-text-inverse)",
            marginBottom: "var(--syn-space-4)",
          }}>
            One portrait. One price.
          </h2>
          <p style={{ ...T.sectionBody, color: "rgba(250,248,245,0.6)", maxWidth: 420, margin: "0 auto var(--syn-space-12)" }}>
            The free symbolic profile is always available. Unlock the full analysis when you're ready.
          </p>

          <div style={{
            display: "inline-block",
            background: "rgba(250,248,245,0.05)",
            border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: "var(--syn-radius-2xl)",
            padding: "var(--syn-space-10) var(--syn-space-12)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--syn-gradient-gold)",
              color: "var(--syn-navy)",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              padding: "4px 16px",
              borderRadius: "var(--syn-radius-full)",
            }}>LIMITED TIME</div>

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "var(--syn-space-3)", marginBottom: "var(--syn-space-4)" }}>
              <span style={{ fontSize: "1rem", color: "rgba(250,248,245,0.35)", textDecoration: "line-through" }}>₹499</span>
              <span style={{
                fontFamily: "var(--syn-font-display)",
                fontSize: "3.5rem",
                fontWeight: 300,
                color: "var(--syn-gold)",
                lineHeight: 1,
              }}>₹199</span>
            </div>

            <p style={{ fontSize: "0.8rem", color: "rgba(250,248,245,0.5)", marginBottom: "var(--syn-space-8)", letterSpacing: "0.04em" }}>
              One-time · Instant access · No subscription
            </p>

            {[
              "Psychological compatibility across five behavioral dimensions",
              "How your behavioral patterns interact as a pair — not just individually",
              "Scores grounded in how you both actually responded, not just when you were born",
              "3–5 personalized guidance nudges specific to your dynamic",
              "Guidance calibrated to your stage in this relationship",
              "A comprehensive portrait delivered to your inbox",
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--syn-space-3)",
                padding: "var(--syn-space-2) 0",
                fontSize: "0.875rem",
                color: "rgba(250,248,245,0.72)",
                textAlign: "left",
              }}>
                <span style={{ color: "var(--syn-gold)", fontSize: "0.7rem", flexShrink: 0 }}>✦</span>
                {f}
              </div>
            ))}

            <Link href="/reading" style={{
              display: "block",
              marginTop: "var(--syn-space-8)",
              padding: "var(--syn-space-4) var(--syn-space-8)",
              background: "var(--syn-gradient-gold)",
              color: "var(--syn-navy)",
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "var(--syn-radius-full)",
              boxShadow: "var(--syn-shadow-gold)",
            }}>
              Begin My Analysis
            </Link>
          </div>

          <p style={{ marginTop: "var(--syn-space-6)", fontSize: "0.75rem", color: "rgba(250,248,245,0.3)" }}>
            Free symbolic profile always available · No card required to begin
          </p>
        </div>
      </section>

      {/* ── SOCIAL FOOTER ── */}
      <div style={{
        background: "var(--syn-bg)",
        borderTop: "1px solid var(--syn-border)",
        padding: "32px 40px",
      }}>
        <div style={{
          maxWidth: "var(--syn-max-width-lg)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          {/* Left */}
          <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 13, color: "var(--syn-text-muted)" }}>
            Follow us on:
          </div>

          {/* Center — social icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[
              { href: "#", label: "Facebook",  Icon: IconFacebook },
              { href: "#", label: "Instagram", Icon: IconInstagram },
              { href: "#", label: "X",         Icon: IconX },
              { href: "#", label: "YouTube",   Icon: IconYouTube },
              { href: "#", label: "Pinterest", Icon: IconPinterest },
              { href: "#", label: "WhatsApp",  Icon: IconWhatsApp },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{ color: "var(--syn-text-secondary)", display: "flex", transition: "color 200ms ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#D4AF37"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--syn-text-secondary)"; }}
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* Right */}
          <div style={{ fontFamily: "var(--syn-font-body)", fontSize: 13, color: "var(--syn-text-muted)" }}>
            © {new Date().getFullYear()} Synastry
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "var(--syn-space-10) var(--syn-space-6)",
        background: "var(--syn-navy)",
        borderTop: "1px solid rgba(201,168,76,0.1)",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "var(--syn-font-body)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--syn-gold)",
          marginBottom: "var(--syn-space-4)",
        }}>✦ &nbsp;Synastry</div>
        <p style={{ fontSize: "0.75rem", color: "rgba(250,248,245,0.3)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
          A guidance and pattern recognition tool. Synastry blends behavioral science with ancient symbolic frameworks.
          Scores are estimates based on your inputs — not scientific measurements or predictions.
        </p>
      </footer>

    </main>
  );
}
