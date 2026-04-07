"use client";

import { useState, type RefObject } from "react";
import {
  SIGN_ARCHETYPES, LIFE_PATH_PROFILES, ELEMENT_DYNAMICS,
} from "@/lib/constants";
import { makeProfile, makeThemes, getQuestions } from "@/lib/astrology";
import { calculateCelestialSigns } from "@/lib/celestial";
import { APPROX_TIME_MAP } from "@/lib/constants";
import { elemScore, calcScores } from "@/lib/scoring";
import { dimContext, strengthNarr, growthNarr, makeNudges, makePostBreakup, makePairTeaser, makePairDynamic } from "@/lib/narratives";
import type { Person, Profile, QuizAnswers, Question, FreeReport, ReportData } from "@/types";
import { track } from "@/lib/analytics";

// ─── Name helpers ─────────────────────────────────────────────
function firstName(name: string): string {
  const trimmed = name.trim();
  const first = trimmed.split(/\s+/)[0] ?? trimmed;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

// ─── Step map ────────────────────────────────────────────────
// 0  welcome
// 1  stage + emotion
// 2  inputs
// 3  free report
// 4  paywall
// 5  quiz – Person A
// 6  quiz – Person B
// 7  full report

export interface QuizState {
  currentQuestion: Question | null;
  currentPersonName: string;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
}

export interface EngineActions {
  setStage: (id: string) => void;
  setEmotion: (id: string) => void;
  updatePersonA: (field: keyof Person, value: string | null) => void;
  updatePersonB: (field: keyof Person, value: string | null) => void;
  submitBasicInfo: () => void;
  goToPaywall: () => void;
  startQuiz: () => void;
  initiatePaymentFromPaywall: () => void;
  initiatePaymentFromReport: () => void;
  goBackInQuiz: () => void;
  answerQuiz: (tid: string, score: number) => void;
  goToStep: (n: number) => void;
  reset: () => void;
}

export interface EngineState {
  step: number;
  stage: string | null;
  emotion: string | null;
  personA: Person;
  personB: Person;
  freeReport: FreeReport | null;
  quizState: QuizState;
  reportData: ReportData | null;
  isPaid: boolean;
  isPaymentProcessing: boolean;
  paymentError: string | null;
  isGenerating: boolean;
  fade: boolean;
  actions: EngineActions;
}

// ─── Razorpay script loader ───────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window === "undefined") return resolve(false);
    if ("Razorpay" in window) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useCompatibilityEngine(
  topRef: RefObject<HTMLDivElement>
): EngineState {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [personA, setPersonA] = useState<Person>({ name: "", dob: "", birthTime: null, birthTimeApprox: null, birthTimeType: null });
  const [personB, setPersonB] = useState<Person>({ name: "", dob: "", birthTime: null, birthTimeApprox: null, birthTimeType: null });
  const [profA, setProfA] = useState<Profile | null>(null);
  const [profB, setProfB] = useState<Profile | null>(null);
  const [thmA, setThmA] = useState<string[]>([]);
  const [thmB, setThmB] = useState<string[]>([]);
  const [freeReport, setFreeReport] = useState<FreeReport | null>(null);
  const [qQA, setQQA] = useState<Question[]>([]);
  const [qQB, setQQB] = useState<Question[]>([]);
  const [qAnsA, setQAnsA] = useState<QuizAnswers>({});
  const [qAnsB, setQAnsB] = useState<QuizAnswers>({});
  const [curQ, setCurQ] = useState(0);
  const [qPer, setQPer] = useState("A");
  const [fade, setFade] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const go = (n: number) => {
    setFade(false);
    setTimeout(() => {
      setStep(n);
      setFade(true);
      window.scrollTo(0, 0);
    }, 300);
  };

  const resolveTime = (p: Person): string | null => {
    if (p.birthTimeType === "exact" && p.birthTime) return p.birthTime;
    if (p.birthTimeType === "approximate" && p.birthTimeApprox) return APPROX_TIME_MAP[p.birthTimeApprox] ?? null;
    return null;
  };

  const submitBasicInfo = async () => {
    if (!personA.name || !personA.dob || !personB.name || !personB.dob) return;
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const a = makeProfile(personA.name, personA.dob);
    const b = makeProfile(personB.name, personB.dob);

    const timeA = resolveTime(personA);
    const timeB = resolveTime(personB);

    const [celA, celB] = await Promise.all([
      calculateCelestialSigns(personA.dob, timeA),
      calculateCelestialSigns(personB.dob, timeB),
    ]);

    const profA: typeof a = {
      ...a,
      moonSign: celA.moonSign,
      venusSign: celA.venusSign,
      isApproximate: personA.birthTimeType === "approximate",
    };
    const profB: typeof b = {
      ...b,
      moonSign: celB.moonSign,
      venusSign: celB.venusSign,
      isApproximate: personB.birthTimeType === "approximate",
    };

    setProfA(profA);
    setProfB(profB);
    const ta = makeThemes(profA), tb = makeThemes(profB);
    setThmA(ta);
    setThmB(tb);
    const ek = [profA.sign.element, profB.sign.element].sort().join("-");
    const elDyn = ELEMENT_DYNAMICS[ek] || ELEMENT_DYNAMICS["Fire-Earth"];
    const archA = SIGN_ARCHETYPES[profA.sign.name];
    const archB = SIGN_ARCHETYPES[profB.sign.name];
    setFreeReport({
      elDyn,
      lpA: LIFE_PATH_PROFILES[profA.lifePath] || LIFE_PATH_PROFILES[1],
      lpB: LIFE_PATH_PROFILES[profB.lifePath] || LIFE_PATH_PROFILES[1],
      archA,
      archB,
      score: Math.round(((Math.max(3, Math.min(8, 10 - Math.abs(profA.lifePath - profB.lifePath))) + elemScore(profA.sign.element, profB.sign.element)) / 2) * 10) / 10,
      pA: profA,
      pB: profB,
      pairTeaser: makePairTeaser(profA, profB, personA.name, personB.name, archA, archB, elDyn),
    });
    setQQA(getQuestions(ta));
    setQQB(getQuestions(tb));
    track("free_report_generated", { signA: profA.sign.name, signB: profB.sign.name, lifePathA: profA.lifePath, lifePathB: profB.lifePath });
    setIsGenerating(false);
    go(3);
  };

  const buildReport = (
    finalAnsA: QuizAnswers, finalAnsB: QuizAnswers,
    pa: Profile, pb: Profile,
    ta: string[], tb: string[]
  ): ReportData => {
    const dims = calcScores(pa, pb, finalAnsA, finalAnsB, ta, tb);
    const soft = emotion === "anxious" || emotion === "uncertain";
    const post = stage === "postbreakup";
    const sorted = [...dims].sort((a, b) => b.score - a.score);
    const best = sorted[0], worst = sorted[sorted.length - 1];
    const avg = dims.reduce((a, d) => a + d.score, 0) / dims.length;
    const nameA = firstName(personA.name);
    const nameB = firstName(personB.name);
    return {
      dims, avg, best, worst, soft, post,
      sNarr: strengthNarr(best, nameA, nameB, pa, pb, finalAnsA, finalAnsB, ta, tb),
      gNarr: growthNarr(worst, nameA, nameB, pa, pb, finalAnsA, finalAnsB, ta, tb, soft),
      nudges: makeNudges(dims, nameA, nameB, pa, pb, finalAnsA, finalAnsB, ta, tb),
      ctxs: dims.map(d => dimContext(d, nameA, nameB, pa, pb, finalAnsA, finalAnsB, ta, tb, soft)),
      pb: post ? makePostBreakup(dims, nameA, nameB, pa, pb, finalAnsA, finalAnsB, ta, tb) : null,
      pairFull: makePairDynamic(pa, pb, nameA, nameB, dims),
    };
  };

  const goBackInQuiz = () => {
    if (qPer === "A") {
      if (curQ === 0) {
        go(3);
      } else {
        const tid = qQA[curQ - 1].themeId;
        if (tid) setQAnsA(prev => { const u={...prev}; if(u[tid]?.length) u[tid]=u[tid].slice(0,-1); return u; });
        setCurQ(c => c - 1);
      }
    } else {
      if (curQ === 0) {
        const tid = qQA[qQA.length - 1].themeId;
        if (tid) setQAnsA(prev => { const u={...prev}; if(u[tid]?.length) u[tid]=u[tid].slice(0,-1); return u; });
        setQPer("A");
        setCurQ(qQA.length - 1);
        go(5);
      } else {
        const tid = qQB[curQ - 1].themeId;
        if (tid) setQAnsB(prev => { const u={...prev}; if(u[tid]?.length) u[tid]=u[tid].slice(0,-1); return u; });
        setCurQ(c => c - 1);
      }
    }
  };

  const startQuiz = () => {
    setCurQ(0);
    setQPer("A");
    go(5);
  };

  const answerQuiz = (tid: string, score: number) => {
    const isA = qPer === "A";
    const qs = isA ? qQA : qQB;
    const isLast = curQ >= qs.length - 1;

    if (isA) {
      const updatedA = { ...qAnsA };
      updatedA[tid] = [...(updatedA[tid] || []), score];
      setQAnsA(updatedA);
      if (!isLast) { setCurQ(c => c + 1); }
      else { setQPer("B"); setCurQ(0); go(6); }
    } else {
      const updatedB = { ...qAnsB };
      updatedB[tid] = [...(updatedB[tid] || []), score];
      setQAnsB(updatedB);
      if (!isLast) { setCurQ(c => c + 1); }
      else {
        const rpt = buildReport(qAnsA, updatedB, profA!, profB!, thmA, thmB);
        setReportData(rpt);
        track("quiz_completed");
        track("full_report_generated", { avgScore: rpt.avg, stage: stage ?? "", emotion: emotion ?? "" });
        go(7);
      }
    }
  };

  // ─── Shared Razorpay payment initiator ───────────────────────
  const initiatePayment = async (onSuccess: () => void) => {
    setIsPaymentProcessing(true);
    setPaymentError(null);
    track("payment_initiated");

    try {
      // 1. Create Razorpay order server-side
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personA: personA.name, personB: personB.name }),
      });
      const data = await res.json() as { orderId?: string; keyId?: string; amount?: number; error?: string };
      if (data.error || !data.orderId) throw new Error(data.error || "Order creation failed");

      // 2. Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway. Check your connection.");

      // 3. Open Razorpay modal — spinner clears once modal is open
      setIsPaymentProcessing(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        name: "Compatibility Engine",
        description: `${personA.name} & ${personB.name} — Full Report`,
        theme: { color: "#d4a843" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          // 4. Verify signature server-side
          const vRes = await fetch("/api/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const vData = await vRes.json() as { success?: boolean };
          if (vData.success) {
            track("payment_completed");
            setIsPaid(true);
            onSuccess();
          } else {
            track("payment_failed", { reason: "verification_failed", paymentId: response.razorpay_payment_id });
            setPaymentError("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: () => {
            track("payment_failed", { reason: "cancelled" });
            setIsPaymentProcessing(false);
          },
        },
      });

      rzp.on("payment.failed", (res: { error: { description: string } }) => {
        track("payment_failed", { reason: "error", description: res.error?.description });
        setPaymentError(res.error?.description || "Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsPaymentProcessing(false);
    }
  };

  // Called from paywall: pay → start quiz
  const initiatePaymentFromPaywall = () => {
    initiatePayment(() => {
      setCurQ(0);
      setQPer("A");
      go(5);
    });
  };

  // Called from locked report: pay → unlock in place
  const initiatePaymentFromReport = () => {
    initiatePayment(() => {});
  };

  const reset = () => {
    track("report_reset");
    setStep(0); setStage(null); setEmotion(null);
    setPersonA({ name: "", dob: "", birthTime: null, birthTimeApprox: null, birthTimeType: null });
    setPersonB({ name: "", dob: "", birthTime: null, birthTimeApprox: null, birthTimeType: null });
    setProfA(null); setProfB(null);
    setFreeReport(null); setQAnsA({}); setQAnsB({});
    setCurQ(0); setQPer("A"); setReportData(null);
    setIsPaid(false); setIsPaymentProcessing(false); setPaymentError(null); setIsGenerating(false);
  };

  // Derived quiz state (steps 5 + 6)
  const quizQuestions = (step === 5 || step === 6) ? (qPer === "A" ? qQA : qQB) : [];
  const quizCurrentQuestion = (quizQuestions.length > 0 && curQ < quizQuestions.length)
    ? quizQuestions[curQ]
    : null;

  return {
    step,
    stage,
    emotion,
    personA,
    personB,
    freeReport,
    quizState: {
      currentQuestion: quizCurrentQuestion,
      currentPersonName: (step === 5 || step === 6) ? (qPer === "A" ? personA.name : personB.name) : "",
      currentIndex: curQ,
      totalQuestions: quizQuestions.length,
      progress: quizQuestions.length > 0 ? (curQ / quizQuestions.length) * 100 : 0,
    },
    reportData,
    isPaid,
    isPaymentProcessing,
    paymentError,
    isGenerating,
    fade,
    actions: {
      setStage,
      setEmotion,
      updatePersonA: (field, value) => setPersonA(prev => ({ ...prev, [field]: value })),
      updatePersonB: (field, value) => setPersonB(prev => ({ ...prev, [field]: value })),
      submitBasicInfo,
      goToPaywall: () => { track("paywall_shown"); go(4); },
      startQuiz,
      initiatePaymentFromPaywall,
      initiatePaymentFromReport,
      goBackInQuiz,
      answerQuiz,
      goToStep: go,
      reset,
    },
  };
}
