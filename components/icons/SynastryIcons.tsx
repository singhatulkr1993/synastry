import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}

const base = (size: number, color: string) => ({
  width: size,
  height: size,
  display: "inline-block",
  verticalAlign: "middle",
  flexShrink: 0,
  color,
} as React.CSSProperties);

// ── 1. Symbolic — crescent moon + 3 star dots ─────────────────────────
export function IconSymbolic({ size = 28, color = "#D4AF37" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crescent moon */}
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      {/* Three star dots scattered in the dark area */}
      <circle cx="4.5" cy="4" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="9.5" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="2.5" r="0.72" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── 2. Behavioral — two overlapping circles (Venn) ────────────────────
export function IconBehavioral({ size = 28, color = "#8A9A5B" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9.5" cy="12" r="6" />
      <circle cx="14.5" cy="12" r="6" />
    </svg>
  );
}

// ── 3. Interaction — two curves meeting at center ──────────────────────
export function IconInteraction({ size = 28, color = "#D4AF37" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left path curves right to center */}
      <path d="M3 5 C5 8 8 10 12 12" stroke="currentColor" />
      {/* Right path curves left to center */}
      <path d="M21 5 C19 8 16 10 12 12" stroke="#A0785A" />
      {/* Meeting point dot */}
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── 4. Emotional — sine wave / pulse ──────────────────────────────────
export function IconEmotional({ size = 28, color = "#D4AF37" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Primary wave */}
      <path d="M2 12 C4.5 7 7.5 7 10 12 C12.5 17 15.5 17 18 12 C20.5 7 22 7 22 12" />
      {/* Secondary wave, slightly offset and more transparent */}
      <path
        d="M2 14.5 C4.5 9.5 7.5 9.5 10 14.5 C12.5 19.5 15.5 19.5 18 14.5"
        strokeOpacity="0.35"
      />
    </svg>
  );
}

// ── 5. Communication — two speech bubbles facing each other ───────────
export function IconCommunication({ size = 28, color = "#8A9A5B" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left bubble (top-left) */}
      <rect x="1" y="2" width="13" height="8" rx="2" />
      {/* Left bubble tail — points down-left */}
      <path d="M3.5 10 L2 13.5 L7.5 10" fill="none" />
      {/* Text lines in left bubble */}
      <line x1="3" y1="5" x2="12" y2="5" />
      <line x1="3" y1="7.5" x2="9" y2="7.5" />

      {/* Right bubble (bottom-right) */}
      <rect x="10" y="13" width="13" height="8" rx="2" />
      {/* Right bubble tail — points down-right */}
      <path d="M20.5 21 L22 24 L16.5 21" fill="none" />
      {/* Text lines in right bubble */}
      <line x1="12" y1="16" x2="21" y2="16" />
      <line x1="12" y1="18.5" x2="17.5" y2="18.5" />
    </svg>
  );
}

// ── 6. Values — compass rose ──────────────────────────────────────────
export function IconValues({ size = 28, color = "#D4AF37" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="9.5" />
      {/* Cross lines (N/S/E/W ticks) */}
      <line x1="12" y1="2.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="21.5" y2="12" />
      {/* Filled north pointer triangle */}
      <polygon points="12,4 10.5,9.5 13.5,9.5" fill="currentColor" stroke="none" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── 7. Intimacy — three concentric circles ────────────────────────────
export function IconIntimacy({ size = 28, color = "#D4AF37" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.5" strokeOpacity="0.3" />
      <circle cx="12" cy="12" r="6" strokeOpacity="0.6" />
      <circle cx="12" cy="12" r="3" strokeOpacity="0.9" />
      {/* Filled center dot */}
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── 8. Conflict — two arrows curving around each other ────────────────
export function IconConflict({ size = 28, color = "#A0785A" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Arrow 1: curves left-to-right (upper arc) */}
      <path d="M4 9 C8 9 12 14.5 20 14" stroke="currentColor" />
      {/* Arrowhead 1 */}
      <path d="M17 11.5 L20 14 L17.5 16.5" stroke="currentColor" fill="none" />

      {/* Arrow 2: curves right-to-left (lower arc) */}
      <path d="M20 15 C16 15 12 9.5 4 10" stroke="#8A9A5B" />
      {/* Arrowhead 2 */}
      <path d="M7 12.5 L4 10 L6.5 7.5" stroke="#8A9A5B" fill="none" />
    </svg>
  );
}

// ── 9. Stability — horizontal layered lines (strata) ──────────────────
export function IconStability({ size = 28, color = "#8A9A5B" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Four horizontal lines — slightly different widths for strata feel */}
      <line x1="5" y1="7" x2="19" y2="7" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="6" y1="19" x2="18" y2="19" />
    </svg>
  );
}

// ── 10. Vulnerability — open padlock ─────────────────────────────────
export function IconVulnerability({ size = 28, color = "#D4AF37" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Lock body */}
      <rect x="5" y="11" width="14" height="10" rx="2" />
      {/* Shackle — open on right side (right arm doesn't connect back to body) */}
      <path d="M8 11 V7 A4 4 0 0 1 16 7 V9" />
      {/* Keyhole circle */}
      <circle cx="12" cy="15.5" r="1.5" />
      {/* Keyhole slot */}
      <line x1="12" y1="17" x2="12" y2="19" />
    </svg>
  );
}

// ── Inline envelope SVG (for paywall email item) ──────────────────────
export function IconEnvelope({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={base(size, color)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Envelope body */}
      <rect x="2" y="5" width="20" height="14" rx="2" />
      {/* Envelope flap V */}
      <path d="M2 7 L12 13 L22 7" />
    </svg>
  );
}
