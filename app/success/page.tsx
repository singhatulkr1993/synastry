"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    const orderId = params.get("razorpay_order_id");
    const paymentId = params.get("razorpay_payment_id");
    const signature = params.get("razorpay_signature");

    if (!orderId || !paymentId || !signature) {
      setStatus("fail");
      return;
    }

    fetch("/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    })
      .then(r => r.json())
      .then(d => setStatus(d.success === true ? "ok" : "fail"))
      .catch(() => setStatus("fail"));
  }, [params]);

  const page: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--syn-bg)",
    fontFamily: "var(--syn-font-body)",
  };

  const col: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--syn-space-5)",
    textAlign: "center",
    padding: "0 var(--syn-space-6)",
    maxWidth: 480,
  };

  if (status === "loading") {
    return (
      <main style={page}>
        <div style={col}>
          <div style={{ width: 36, height: 36, border: "2px solid var(--syn-border)", borderTop: "2px solid var(--syn-gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "0.9rem", color: "var(--syn-text-muted)" }}>Verifying payment…</p>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </main>
    );
  }

  if (status === "fail") {
    return (
      <main style={page}>
        <div style={col}>
          <p style={{ color: "var(--syn-error)", fontSize: "0.9rem" }}>Payment verification failed.</p>
          <a href="/reading" style={{ color: "var(--syn-gold)", fontSize: "0.875rem", textDecoration: "none" }}>← Back to reading</a>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={col}>
        <div style={{ fontFamily: "var(--syn-font-display)", fontSize: "3rem", color: "var(--syn-gold)", letterSpacing: "0.2em" }}>☽ ✦ ♀</div>
        <h1 style={{ fontFamily: "var(--syn-font-display)", fontSize: "1.75rem", fontWeight: 400, color: "var(--syn-text-primary)" }}>
          Payment Successful
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--syn-text-secondary)", lineHeight: 1.7 }}>
          Your full synastry chart has been unlocked.
        </p>
        <a href="/reading" style={{
          display: "inline-block",
          padding: "var(--syn-space-4) var(--syn-space-8)",
          background: "var(--syn-gradient-gold)",
          color: "var(--syn-navy)",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: "var(--syn-radius-full)",
          boxShadow: "var(--syn-shadow-gold)",
        }}>
          Reveal My Chart →
        </a>
        <p style={{ color: "var(--syn-text-muted)", fontSize: "0.75rem", marginTop: "var(--syn-space-2)" }}>
          You may need to re-enter names to regenerate your session.
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--syn-bg)" }}>
        <p style={{ color: "var(--syn-text-muted)", fontFamily: "var(--syn-font-body)" }}>Loading…</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
