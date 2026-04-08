import { jsPDF } from "jspdf";
import type { ReportData, FreeReport, DimTheme, Nudge } from "@/types";

// ─── Palette ───────────────────────────────────────────────────
type RGB = [number, number, number];
const BG    : RGB = [240, 238, 233];
const GOLD  : RGB = [212, 175,  55];
const DARK  : RGB = [ 44,  44,  44];
const MUTED : RGB = [107, 107, 107];
const GREEN : RGB = [ 74, 124,  89];
const TERRA : RGB = [160,  82,  45];
const BORDER: RGB = [224, 221, 216];

// ─── Layout ────────────────────────────────────────────────────
const PW  = 210;           // page width mm
const PH  = 297;           // page height mm
const ML  = 20;            // left margin
const MR  = 20;            // right margin
const CW  = PW - ML - MR; // content width 170mm
const FH  = 16;            // footer reservation height

// ─── Low-level helpers ─────────────────────────────────────────

function tc(doc: jsPDF, c: RGB)  { doc.setTextColor(c[0], c[1], c[2]); }
function fc(doc: jsPDF, c: RGB)  { doc.setFillColor(c[0], c[1], c[2]); }
function dc(doc: jsPDF, c: RGB)  { doc.setDrawColor(c[0], c[1], c[2]); }

function rule(doc: jsPDF, y: number, c: RGB = BORDER, lw = 0.2) {
  dc(doc, c); doc.setLineWidth(lw); doc.line(ML, y, PW - MR, y);
}

/** Draw wrapped text. Returns y after the last line. */
function wt(
  doc:   jsPDF,
  text:  string,
  x:     number,
  y:     number,
  maxW:  number,
  size:  number,
  style: "normal" | "bold" | "italic",
  color: RGB,
  lh    = 1.5,
  align: "left" | "center" | "right" = "left",
): number {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  tc(doc, color);
  const lines = doc.splitTextToSize(text, maxW) as string[];
  const step  = size * 0.3528 * lh;
  lines.forEach((ln: string, i: number) => {
    const ax = align === "center" ? PW / 2 : align === "right" ? x + maxW : x;
    doc.text(ln, ax, y + i * step, { align });
  });
  return y + lines.length * step;
}

/** Height of a wrapped text block without drawing. */
function wh(doc: jsPDF, text: string, maxW: number, size: number, lh = 1.5,
            style: "normal" | "bold" | "italic" = "normal"): number {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(text, maxW) as string[];
  return lines.length * size * 0.3528 * lh;
}

function scColor(score: number): RGB { return score >= 7 ? GREEN : score >= 5 ? GOLD : TERRA; }

function scoreBar(doc: jsPDF, x: number, y: number, w: number, score: number) {
  fc(doc, BORDER); doc.rect(x, y, w, 1.8, "F");
  fc(doc, scColor(score)); doc.rect(x, y, w * (score / 10), 1.8, "F");
}

/** Render label + body theme blocks. Returns y after last block. */
function themeBlocks(
  doc: jsPDF, themes: DimTheme[],
  x: number, y: number, maxW: number,
): number {
  for (const t of themes) {
    y = wt(doc, t.label, x, y, maxW, 8.5, "bold",   GREEN, 1.4);
    y += 0.5;
    y = wt(doc, t.text,  x, y, maxW, 9,   "normal", DARK,  1.55);
    y += 4;
  }
  return y;
}

function themeBlocksH(doc: jsPDF, themes: DimTheme[], maxW: number): number {
  return themes.reduce((a, t) =>
    a + wh(doc, t.label, maxW, 8.5, 1.4, "bold")
      + wh(doc, t.text,  maxW, 9,   1.55)
      + 4.5, 0);
}

// ─── Repeating page elements ───────────────────────────────────

function pageBg(doc: jsPDF) {
  fc(doc, BG); doc.rect(0, 0, PW, PH, "F");
}

function pageFooter(doc: jsPDF, date: string) {
  const fy = PH - FH + 4;
  rule(doc, fy - 2, GOLD, 0.3);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); tc(doc, MUTED);
  doc.text(`Generated ${date}`, ML, fy + 3);
  doc.text("A reflection tool  |  not prediction, not prescription", PW / 2, fy + 3, { align: "center" });
  doc.text("synastry-navy.vercel.app", PW - MR, fy + 3, { align: "right" });
}

/** Draws header bar. Returns starting y for body content. */
function pageHeader(doc: jsPDF, nameA: string, nameB: string): number {
  const hy = 13;
  doc.setFont("helvetica", "bold");   doc.setFontSize(10); tc(doc, GOLD);
  doc.text("* SYNASTRY", ML, hy);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); tc(doc, MUTED);
  doc.text(`${nameA} & ${nameB}`, PW - MR, hy, { align: "right" });
  rule(doc, hy + 3, GOLD, 0.35);
  return hy + 9;
}

/** If `need` mm won't fit, add a new page and return the fresh y. */
function fit(
  doc: jsPDF, y: number, need: number,
  fnA: string, fnB: string, date: string,
): number {
  if (y + need > PH - FH - 4) {
    doc.addPage(); pageBg(doc); pageFooter(doc, date);
    return pageHeader(doc, fnA, fnB);
  }
  return y;
}

// ─── Name helpers ──────────────────────────────────────────────
const firstName = (n: string) => {
  const f = n.trim().split(/\s+/)[0];
  return f.charAt(0).toUpperCase() + f.slice(1).toLowerCase();
};
const titleCase = (n: string) => n.trim().replace(/\b\w/g, c => c.toUpperCase());

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export async function generateSynastryPDF(
  reportData: ReportData,
  freeReport:  FreeReport,
  personA:     { name: string },
  personB:     { name: string },
  stage:       string,
): Promise<void> {

  const doc  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const fnA  = firstName(personA.name);
  const fnB  = firstName(personB.name);
  const fullA = titleCase(personA.name);
  const fullB = titleCase(personB.name);
  const signA = freeReport.pA.sign.name;
  const signB = freeReport.pB.sign.name;
  const elemA = freeReport.pA.sign.element;
  const elemB = freeReport.pB.sign.element;
  const date  = new Date().toLocaleDateString("en-IN",
    { day: "numeric", month: "long", year: "numeric" });

  // ─────────────────────────────────────────────────────────────
  // PAGE 1 — COVER
  // ─────────────────────────────────────────────────────────────
  pageBg(doc);
  pageFooter(doc, date);

  // Gold top bar
  fc(doc, GOLD); doc.rect(0, 0, PW, 4, "F");

  // Brand + URL
  let y = 14;
  doc.setFont("helvetica", "bold");   doc.setFontSize(14); tc(doc, GOLD);
  doc.text("* SYNASTRY", ML, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); tc(doc, MUTED);
  doc.text("synastry-navy.vercel.app", PW - MR, y, { align: "right" });

  // Tagline
  y = 36;
  doc.setFont("helvetica", "bold");   doc.setFontSize(22); tc(doc, DARK);
  doc.text("Relationship Intelligence", PW / 2, y, { align: "center" });
  y += 9;
  doc.setFont("helvetica", "italic"); doc.setFontSize(13); tc(doc, MUTED);
  doc.text("Where Behavioral Science Meets Ancient Wisdom", PW / 2, y, { align: "center" });
  y += 10;

  rule(doc, y, GOLD, 0.4); y += 10;

  // Pair identity
  doc.setFont("helvetica", "bold"); doc.setFontSize(19); tc(doc, DARK);
  doc.text(`${fullA}  *  ${fullB}`, PW / 2, y, { align: "center" }); y += 7;
  doc.setFont("helvetica", "normal"); doc.setFontSize(11); tc(doc, MUTED);
  doc.text(`${signA} (${elemA})  *  ${signB} (${elemB})`, PW / 2, y, { align: "center" }); y += 13;

  // Score
  doc.setFont("helvetica", "bold"); doc.setFontSize(48); tc(doc, GOLD);
  doc.text(`${reportData.avg.toFixed(1)} / 10`, PW / 2, y, { align: "center" }); y += 9;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); tc(doc, MUTED);
  doc.text(
    "Overall Compatibility  *  Astrological  *  Behavioral  *  Psychological",
    PW / 2, y, { align: "center" },
  ); y += 13;

  rule(doc, y, GOLD, 0.4); y += 11;

  // How it works label
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); tc(doc, GOLD);
  doc.text("HOW SYNASTRY WORKS", PW / 2, y, { align: "center" }); y += 9;

  // Three columns
  const steps = [
    { num: "I",   title: "We Surface Your Patterns",  desc: "Astrology and numerology reveal your core signatures" },
    { num: "II",  title: "We Profile Your Behaviour", desc: "A behavioural quiz maps how you actually operate" },
    { num: "III", title: "We Map Your Dynamic",       desc: "We combine both to show how you function as a pair" },
  ];
  const colW = CW / 3;
  const stY  = y;
  steps.forEach((s, i) => {
    const cx = ML + i * colW + colW / 2;
    let cy = stY;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); tc(doc, GOLD);
    doc.text(s.num, cx, cy, { align: "center" }); cy += 7;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); tc(doc, DARK);
    const tl = doc.splitTextToSize(s.title, colW - 6) as string[];
    tl.forEach((l: string, j: number) => doc.text(l, cx, cy + j * 4.5, { align: "center" }));
    cy += tl.length * 4.5 + 2;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); tc(doc, MUTED);
    const dl = doc.splitTextToSize(s.desc, colW - 6) as string[];
    dl.forEach((l: string, j: number) => doc.text(l, cx, cy + j * 4, { align: "center" }));
  });
  y = stY + 42;

  rule(doc, y, GOLD, 0.4); y += 11;

  // About paragraph
  const about =
    "Synastry combines behavioural psychology and psychometric profiling with Vedic astrology " +
    "and numerology — two scientific traditions, Eastern and Western, working together to reveal " +
    "how you and another person function as a pair.";
  doc.setFont("helvetica", "italic"); doc.setFontSize(9); tc(doc, MUTED);
  const aLines = doc.splitTextToSize(about, 150) as string[];
  aLines.forEach((l: string, i: number) => doc.text(l, PW / 2, y + i * 5.2, { align: "center" }));

  // ─────────────────────────────────────────────────────────────
  // PAGE 2 — FIVE DIMENSIONS
  // ─────────────────────────────────────────────────────────────
  doc.addPage(); pageBg(doc); pageFooter(doc, date);
  y = pageHeader(doc, fnA, fnB);

  doc.setFont("helvetica", "bold"); doc.setFontSize(10); tc(doc, GOLD);
  doc.text("FIVE DIMENSIONS", ML, y); y += 4.5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); tc(doc, MUTED);
  doc.text("How you score across the five core areas of compatibility", ML, y); y += 8;

  for (let i = 0; i < reportData.dims.length; i++) {
    const d      = reportData.dims[i];
    const themes = reportData.ctxs[i] || [];
    const need   = 14 + themeBlocksH(doc, themes, CW) + 6;
    y = fit(doc, y, Math.min(need, 60), fnA, fnB, date);

    if (i > 0) { rule(doc, y, BORDER, 0.2); y += 5; }

    // Name + score on same line
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); tc(doc, DARK);
    doc.text(d.name, ML, y);
    tc(doc, scColor(d.score));
    doc.text(d.score.toFixed(1), PW - MR, y, { align: "right" }); y += 4;

    scoreBar(doc, ML, y, CW, d.score); y += 6;
    y = themeBlocks(doc, themes, ML, y, CW);
  }

  // ─────────────────────────────────────────────────────────────
  // PAGE 3 — YOUR DYNAMIC AS A PAIR
  // ─────────────────────────────────────────────────────────────
  doc.addPage(); pageBg(doc); pageFooter(doc, date);
  y = pageHeader(doc, fnA, fnB);

  doc.setFont("helvetica", "bold"); doc.setFontSize(10); tc(doc, GOLD);
  doc.text("YOUR DYNAMIC AS A PAIR", ML, y); y += 8;

  y = wt(doc, reportData.pairFull.opening, ML, y, CW, 9, "normal", DARK, 1.55); y += 7;

  // Complements
  if (reportData.pairFull.complements.length) {
    y = fit(doc, y, 14, fnA, fnB, date);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); tc(doc, GOLD);
    doc.text("WHERE YOU COMPLEMENT EACH OTHER", ML, y); y += 5;
    for (const c of reportData.pairFull.complements) {
      y = fit(doc, y, wh(doc, c, CW, 9, 1.55) + 5, fnA, fnB, date);
      y = wt(doc, c, ML, y, CW, 9, "normal", DARK, 1.55); y += 4;
    }
    y += 3;
  }

  // Frictions
  if (reportData.pairFull.frictions.length) {
    y = fit(doc, y, 14, fnA, fnB, date);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); tc(doc, GOLD);
    doc.text("WHERE FRICTION TENDS TO LIVE", ML, y); y += 5;
    for (const f of reportData.pairFull.frictions) {
      y = fit(doc, y, wh(doc, f, CW, 9, 1.55) + 5, fnA, fnB, date);
      y = wt(doc, f, ML, y, CW, 9, "normal", DARK, 1.55); y += 4;
    }
    y += 3;
  }

  // Watch
  y = fit(doc, y, 16, fnA, fnB, date);
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); tc(doc, GOLD);
  doc.text("THE DYNAMIC TO WATCH", ML, y); y += 5;
  y = wt(doc, reportData.pairFull.watch, ML, y, CW, 9, "normal", DARK, 1.55); y += 7;

  // LP section (optional)
  if (reportData.pairFull.lpSection) {
    y = fit(doc, y, 16, fnA, fnB, date);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); tc(doc, GOLD);
    doc.text("HOW YOUR ORIENTATIONS SHAPE THE DYNAMIC", ML, y); y += 5;
    y = wt(doc, reportData.pairFull.lpSection, ML, y, CW, 9, "normal", DARK, 1.55); y += 7;
  }

  // Core Strength card (left green border)
  const csNeed = 14 + themeBlocksH(doc, reportData.sNarr, CW - 6);
  y = fit(doc, y, Math.min(csNeed, 45), fnA, fnB, date);
  const csY = y - 2;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); tc(doc, GREEN);
  doc.text(`Core Strength: ${reportData.best.name}`, ML + 5, y); y += 6;
  y = themeBlocks(doc, reportData.sNarr, ML + 5, y, CW - 6);
  fc(doc, GREEN); doc.rect(ML, csY, 2, y - csY + 3, "F");
  y += 7;

  // Growth Area card (left terracotta border)
  const gaNeed = 14 + themeBlocksH(doc, reportData.gNarr, CW - 6);
  y = fit(doc, y, Math.min(gaNeed, 45), fnA, fnB, date);
  const gaY = y - 2;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); tc(doc, TERRA);
  doc.text(`Growth Area: ${reportData.worst.name}`, ML + 5, y); y += 6;
  y = themeBlocks(doc, reportData.gNarr, ML + 5, y, CW - 6);
  fc(doc, TERRA); doc.rect(ML, gaY, 2, y - gaY + 3, "F");

  // ─────────────────────────────────────────────────────────────
  // PAGE 4 — INVITATIONS TO TRY + STAGE GUIDANCE + CTA
  // ─────────────────────────────────────────────────────────────
  doc.addPage(); pageBg(doc); pageFooter(doc, date);
  y = pageHeader(doc, fnA, fnB);

  doc.setFont("helvetica", "bold"); doc.setFontSize(10); tc(doc, GOLD);
  doc.text("INVITATIONS TO TRY", ML, y); y += 10;

  reportData.nudges.forEach((n: Nudge, i: number) => {
    const need = 8 + wh(doc, n.title, CW - 9, 11, 1.3, "bold")
               + wh(doc, n.text,  CW - 9, 9,  1.55) + 8;
    y = fit(doc, y, Math.min(need, 55), fnA, fnB, date);

    doc.setFont("helvetica", "bold");   doc.setFontSize(13); tc(doc, GOLD);
    doc.text(`${i + 1}.`, ML, y);
    doc.setFont("helvetica", "bold");   doc.setFontSize(11); tc(doc, DARK);
    // Title — may wrap
    const tLines = doc.splitTextToSize(n.title, CW - 9) as string[];
    tLines.forEach((l: string, j: number) => doc.text(l, ML + 9, y + j * 5.5));
    y += tLines.length * 5.5 + 1;
    y = wt(doc, n.text, ML + 9, y, CW - 9, 9, "normal", MUTED, 1.55); y += 8;
  });

  // Stage guidance block (gold left border)
  const stageLabel = stage === "screening"   ? "INITIAL SIGNALS"
    : stage === "early"      ? "EARLY STAGE PATTERNS"
    : stage === "ongoing"    ? "ESTABLISHED RELATIONSHIP"
    : stage === "premarriage"? "LONG-TERM ALIGNMENT" : "";

  const stageText = stage === "screening"
    ? `These patterns suggest what to explore in early conversations. Pay particular attention to ${reportData.worst.name} — not as a dealbreaker, but as a topic to explore openly before investing further. The strength in ${reportData.best.name} is a genuine positive signal worth noticing.`
    : stage === "early"
    ? `Early patterns often shift as people relax and reveal more of themselves. Your strength in ${reportData.best.name} is likely genuine — lean into it. The gap in ${reportData.worst.name} may narrow as you learn each other's patterns, or it may be a real difference worth understanding now.`
    : stage === "ongoing"
    ? `You've likely already experienced both the strength (${reportData.best.name}) and the friction (${reportData.worst.name}) this analysis describes. The value here is naming these patterns explicitly — so you can work with them intentionally rather than reactively.`
    : stage === "premarriage"
    ? `Before a long-term commitment, the most important conversation is about ${reportData.worst.name}: do you both see it? Are you both willing to work on it? These insights help you ask better questions.`
    : "";

  if (stageLabel && stageText) {
    const sgNeed = 14 + wh(doc, stageText, CW - 6, 9, 1.55) + 8;
    y = fit(doc, y, Math.min(sgNeed, 45), fnA, fnB, date);
    const sgY = y - 2;
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); tc(doc, GOLD);
    doc.text(stageLabel, ML + 5, y); y += 5.5;
    y = wt(doc, stageText, ML + 5, y, CW - 6, 9, "normal", DARK, 1.55);
    fc(doc, GOLD); doc.rect(ML, sgY, 2, y - sgY + 3, "F");
    y += 10;
  }

  // Final CTA panel
  y = fit(doc, y, 32, fnA, fnB, date);
  fc(doc, GOLD); doc.rect(ML, y, CW, 29, "F");
  doc.setFont("helvetica", "normal"); doc.setFontSize(11); tc(doc, DARK);
  doc.text("Know someone who should explore this?", PW / 2, y + 9, { align: "center" });
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); tc(doc, DARK);
  doc.text("synastry-navy.vercel.app", PW / 2, y + 18, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); tc(doc, DARK);
  doc.text("Every reading is unique. Start yours free.", PW / 2, y + 25, { align: "center" });

  // ─── Save ──────────────────────────────────────────────────────
  doc.save(`Synastry_${fnA}_${fnB}.pdf`);
}
