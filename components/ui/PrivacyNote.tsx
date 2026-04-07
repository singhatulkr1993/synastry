import React from "react";

export function PrivacyNote() {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--syn-font-body)",
      fontSize: 11,
      color: "var(--syn-text-muted)",
    }}>
      {/* Thin lock icon */}
      <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      Your information is encrypted and never shared.
    </div>
  );
}
