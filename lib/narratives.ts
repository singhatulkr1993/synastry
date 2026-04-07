import { traitAvg, traitLabel } from "@/lib/scoring";
import { EXPRESSION_PROFILES, getSignPairDetail, ELEMENT_DYNAMICS, LIFE_PATH_PAIR_DYNAMICS, EXPRESSION_NUMBER_PROFILES, DESTINY_NUMBER_PROFILES, getLPPairKey } from "@/lib/constants";
import type { DimensionScore, QuizAnswers, Profile, Nudge, PostBreakupData, PairTeaser, PairFull, SignArchetype, ElementDynamic, DimTheme } from "@/types";
import type { LPPairDynamic } from "@/lib/constants";

// ─── Symbolic helpers ──────────────────────────────────────────

function eRel(eA: string, eB: string): string {
  if (eA === eB) return `Two ${eA} signs`;
  const p = [eA, eB].sort().join("-");
  return ({
    "Fire-Water": "The Fire-Water dynamic between you",
    "Earth-Fire": "The Fire-Earth contrast",
    "Air-Fire":   "The Fire-Air energy between you",
    "Air-Water":  "The Air-Water interplay",
    "Earth-Water":"The Earth-Water pairing",
    "Air-Earth":  "The Air-Earth contrast",
  } as Record<string, string>)[p] ?? "The elemental dynamic between you";
}

function eCompat(eA: string, eB: string): string {
  if (eA === eB) return "speak the same elemental language";
  const p = [eA, eB].sort().join("-");
  return ({
    "Fire-Water": "generate real heat together — though the same chemistry that creates warmth can produce steam",
    "Earth-Fire": "create productive tension: one sparks ideas, the other builds them",
    "Air-Fire":   "feed each other naturally — expansive, mutually stimulating",
    "Air-Water":  "blend imagination with intuition, though can lose ground when abstraction takes over",
    "Earth-Water":"nourish each other naturally — groundedness meeting depth",
    "Air-Earth":  "bring genuine contrast — possibility-thinking meeting practical realism",
  } as Record<string, string>)[p] ?? "bring distinct energies that benefit from conscious bridging";
}

function signEmotionalNote(sign: string, name: string): string {
  return ({
    Pisces:      `${name}'s Pisces nature runs on emotional undercurrents — feeling things deeply before finding words for them`,
    Scorpio:     `${name}'s Scorpio intensity means emotions are processed internally before they surface`,
    Cancer:      `${name}'s Cancer instincts make emotional safety a core need`,
    Aries:       `${name}'s Aries nature processes quickly — feeling something intensely, then moving through it`,
    Leo:         `${name}'s Leo nature needs genuine warmth and reciprocity to feel secure`,
    Sagittarius: `${name}'s Sagittarius optimism keeps the emotional register positive, though depth can take time to arrive`,
    Taurus:      `${name}'s Taurus nature opens slowly but holds steadily once trust is established`,
    Virgo:       `${name}'s Virgo mind tends to analyze feelings rather than simply inhabit them`,
    Capricorn:   `${name}'s Capricorn reserve is practical self-protection, not emotional absence`,
    Gemini:      `${name}'s Gemini curiosity can intellectualize emotion — engaging with it rather than sitting inside it`,
    Libra:       `${name}'s Libra instinct is to smooth emotional waters, sometimes at the cost of their own needs`,
    Aquarius:    `${name}'s Aquarius detachment can read as unavailability, even when they're deeply invested`,
  } as Record<string, string>)[sign] ?? `${name}'s ${sign} nature brings its own emotional texture here`;
}

function signCommNote(sign: string, name: string): string {
  return ({
    Gemini:      `${name}'s Gemini fluency means communication comes naturally — words are rarely the problem`,
    Sagittarius: `${name}'s Sagittarius directness gets to the point quickly, sometimes skipping nuance`,
    Virgo:       `${name}'s Virgo precision means words are chosen carefully — and sometimes too carefully`,
    Libra:       `${name}'s Libra diplomacy softens edges, occasionally to the point of obscuring the actual message`,
    Scorpio:     `${name}'s Scorpio intensity can make conversations feel high-stakes even when they don't need to be`,
    Pisces:      `${name}'s Pisces indirectness often requires reading between the lines`,
    Aries:       `${name}'s Aries bluntness is direct but can arrive before the full thought is formed`,
    Aquarius:    `${name}'s Aquarius style favors ideas over emotional processing — which works well until it doesn't`,
    Taurus:      `${name}'s Taurus deliberateness means responses come after reflection, not in the moment`,
    Cancer:      `${name}'s Cancer sensitivity makes tone as important as content`,
    Leo:         `${name}'s Leo expressiveness can fill the room — and occasionally the conversation`,
    Capricorn:   `${name}'s Capricorn economy with words means less said, more meant`,
  } as Record<string, string>)[sign] ?? `${name}'s ${sign} communication style has its own rhythm`;
}

function modalityNote(mA: string, mB: string): string {
  if (mA !== mB) return "";
  if (mA === "Fixed")    return `As two Fixed signs, you both hold your ground firmly`;
  if (mA === "Cardinal") return `As two Cardinal signs — natural initiators — you can occasionally compete for direction`;
  return `As two naturally flexible signs, you both bring genuine adaptability`;
}

function modalityConflictNote(modality: string, signName: string, name: string): string {
  if (modality === "Cardinal") return `As a Cardinal sign, ${name} tends to initiate — including in conflict. They'd rather address tension directly than let it simmer.`;
  if (modality === "Fixed")    return `As a Fixed sign, ${name} holds their position under pressure. This isn't stubbornness for its own sake — it's a deep need to feel heard before they can shift.`;
  return `Flexible by nature, ${name} tends to adapt — sometimes too quickly, using flexibility as a way to avoid sustained conflict.`;
  void signName;
}

function lpConflictNote(lpA: number, lpB: number, nA: string, nB: string): string {
  if (lpA === lpB) return ` ${nA} and ${nB} share a similar threshold for when friction is worth addressing — which makes it easier to agree on what actually needs attention.`;
  const ind = [1, 5, 7], rel = [2, 6, 9];
  if (ind.includes(lpA) && rel.includes(lpB))
    return ` ${nA}'s independence-oriented nature and ${nB}'s relational instincts can create different timelines for when something feels worth raising.`;
  if (rel.includes(lpA) && ind.includes(lpB))
    return ` ${nB}'s independence-oriented nature and ${nA}'s relational instincts can create different expectations around how quickly something gets resolved.`;
  return "";
}

function lpValuesNote(lpA: number, lpB: number, nA: string, nB: string): string {
  if (lpA === lpB) return ` ${nA} and ${nB} share a deep, sometimes unspoken agreement about what actually matters.`;
  if (Math.abs(lpA - lpB) <= 2) return ` ${nA} and ${nB} share enough common ground that priorities tend to rhyme, even when the specifics differ.`;
  return ` ${nA} and ${nB} approach life from genuinely different orientations — worth naming explicitly rather than assuming away.`;
}

function lpValuesStrengthNote(lpA: number, lpB: number, nA: string, nB: string): string {
  if (lpA === lpB) return ` ${nA} and ${nB} share a core orientation that runs beneath the surface.`;
  if (Math.abs(lpA - lpB) <= 2) return ` ${nA} and ${nB} are close enough in how they approach life that priorities tend to rhyme on the things that count.`;
  return ` Despite coming from different orientations, the behavioral data shows ${nA} and ${nB}'s practical priorities converge where it matters.`;
}

// ─── Same-sign merged notes ───────────────────────────────────

function sameSignEmotionalNote(sign: string, nA: string, nB: string): string {
  return ({
    Pisces:      `Both ${nA} and ${nB} are Pisces — they run on emotional undercurrents and feel things deeply before finding words for them`,
    Scorpio:     `Both ${nA} and ${nB} are Scorpio — they process emotions internally before they surface`,
    Cancer:      `Both ${nA} and ${nB} are Cancer — emotional safety is a core need for both`,
    Aries:       `Both ${nA} and ${nB} are Aries — they process feelings quickly and intensely, then move through them`,
    Leo:         `Both ${nA} and ${nB} are Leo — genuine warmth and reciprocity are essential to feeling secure`,
    Sagittarius: `Both ${nA} and ${nB} are Sagittarius — their emotional register stays positive, though depth can take time to arrive`,
    Taurus:      `Both ${nA} and ${nB} are Taurus — they open slowly but hold steadily once trust is established`,
    Virgo:       `Both ${nA} and ${nB} are Virgo — they tend to analyze feelings rather than simply inhabit them`,
    Capricorn:   `Both ${nA} and ${nB} are Capricorn — their reserve is practical self-protection, not emotional absence`,
    Gemini:      `Both ${nA} and ${nB} are Gemini — they can intellectualize emotion, engaging with it rather than sitting inside it`,
    Libra:       `Both ${nA} and ${nB} are Libra — their instinct is to smooth emotional waters, sometimes at the cost of their own needs`,
    Aquarius:    `Both ${nA} and ${nB} are Aquarius — their detachment can read as unavailability, even when both are deeply invested`,
  } as Record<string, string>)[sign] ?? `Both ${nA} and ${nB} are ${sign} — they share the same emotional texture here`;
}

function sameSignCommNote(sign: string, nA: string, nB: string): string {
  return ({
    Gemini:      `Both ${nA} and ${nB} are Gemini — communication comes naturally to both, and words are rarely the problem`,
    Sagittarius: `Both ${nA} and ${nB} are Sagittarius — they're both direct and get to the point quickly, which creates real clarity`,
    Virgo:       `Both ${nA} and ${nB} are Virgo — they choose words carefully, and sometimes too carefully`,
    Libra:       `Both ${nA} and ${nB} are Libra — they both soften edges, occasionally to the point of obscuring the actual message`,
    Scorpio:     `Both ${nA} and ${nB} are Scorpio — conversations can feel high-stakes for both, even when they don't need to be`,
    Pisces:      `Both ${nA} and ${nB} are Pisces — they both tend toward indirectness, which means reading between the lines matters for both`,
    Aries:       `Both ${nA} and ${nB} are Aries — they're both direct, sometimes before the full thought is formed`,
    Aquarius:    `Both ${nA} and ${nB} are Aquarius — they both favour ideas over emotional processing, which works until it doesn't`,
    Taurus:      `Both ${nA} and ${nB} are Taurus — both respond after reflection, which means conversations move at a similar, considered pace`,
    Cancer:      `Both ${nA} and ${nB} are Cancer — tone matters as much as content for both, which means they're usually attuned to each other`,
    Leo:         `Both ${nA} and ${nB} are Leo — both are expressive, which creates energy, though it can also mean each wants the floor`,
    Capricorn:   `Both ${nA} and ${nB} are Capricorn — economical with words, meaning less said and more meant on both sides`,
  } as Record<string, string>)[sign] ?? `Both ${nA} and ${nB} are ${sign} — they share a similar communication rhythm`;
}

// ─── Element / modality day-to-day feel (used in pair opening) ──

function elementDayToDay(eA: string, eB: string): string {
  if (eA === eB) {
    return ({
      Fire:  `When two people share the same drive and intensity, the connection moves fast — things feel alive and energising almost immediately. The risk is that shared intensity also means shared blind spots, with nobody naturally providing what the other is missing.`,
      Earth: `When both people are grounded in the same element, there is a quiet steadiness from the start — things feel reliable and real. The risk is that both can dig in and resist change in the same ways, with no counterweight.`,
      Air:   `When two minds work in the same register, the connection is often immediate — ideas flow easily and the conversation rarely runs dry. The gap shows up when emotional processing gets left behind.`,
      Water: `When two people share deep emotional sensitivity, the connection runs below the surface from the start. The real challenge is absorbing each other's moods without realising it and losing track of whose feeling belongs to whom.`,
    } as Record<string, string>)[eA] ?? `Sharing the same element means the connection has a native rhythm that does not need translation — and a shared blind spot worth naming.`;
  }
  const key = [eA, eB].sort().join("-");
  return ({
    "Air-Fire":   `The combination of drive and openness creates natural fuel between them — one person's energy finds ready amplification in the other's expansiveness. The challenge is that the combination can lose grounding when both are moving fast.`,
    "Fire-Water": `These two energies create real heat and real feeling — the connection rarely lacks for intensity. The same chemistry that makes this pairing feel alive can also generate friction when one person's pace overwhelms the other's.`,
    "Earth-Fire": `The contrast of drive and patience creates productive tension — one sparks the ideas, the other tests whether they hold up. The challenge is that speed and caution can pull in genuinely different directions.`,
    "Air-Water":  `The combination of conceptual thinking and emotional depth can reach unexpected places. The risk is losing practical ground when both drift toward the abstract and away from what needs to be decided.`,
    "Earth-Water":`These two energies nourish each other in ways that feel natural — groundedness meets depth, and neither has to sacrifice its nature to make room for the other.`,
    "Air-Earth":  `The contrast between possibility-thinking and practical realism is a genuine strength when each respects what the other brings — and a source of friction when either tries to convert the other.`,
  } as Record<string, string>)[key] ?? `The two energies here create a dynamic that benefits from being understood rather than assumed.`;
}

function modalityDayToDay(mA: string, mB: string): string {
  if (mA === mB) {
    return ({
      Fixed:    `Both handle change by holding steady — which creates real staying power and a risk that nobody yields past the point of usefulness.`,
      Cardinal: `Both are natural initiators, which can generate impressive forward momentum — and occasional friction over who sets the direction.`,
      Mutable:  `Both adapt easily and stay flexible — which is a genuine asset and a risk, since without some shared structure, direction can quietly get lost.`,
    } as Record<string, string>)[mA] ?? `Both approach change in a similar way, which creates resonance and the occasional amplified pattern.`;
  }
  const key = [mA, mB].sort().join("-");
  return ({
    "Cardinal-Fixed":   `One person initiates while the other holds steady — a combination that can be both decisive and stable, or stuck in a loop of pushing and resisting when they disagree.`,
    "Fixed-Mutable":    `One anchors while the other adapts — real complementarity, with occasional tension when flexibility meets a position that will not move.`,
    "Cardinal-Mutable": `One initiates and the other adjusts — they can cover a lot of ground together, though pace and direction need to be agreed on explicitly rather than assumed.`,
  } as Record<string, string>)[key] ?? `They approach change and decisions at different speeds, which creates complementarity and the occasional timing gap.`;
}

// ─── dim Context ─────────────────────────────────────────────

export function dimContext(
  d: DimensionScore, nA: string, nB: string,
  pA: Profile, pB: Profile,
  qA: QuizAnswers, qB: QuizAnswers,
  tA: string[], tB: string[],
  soft: boolean
): DimTheme[] {
  void traitLabel; void qA; void qB; void tA; void tB;
  const gap = Math.abs(d.rA - d.rB);
  const er = eRel(pA.sign.element, pB.sign.element);
  const ec = eCompat(pA.sign.element, pB.sign.element);

  const m: Record<string, () => DimTheme[]> = {

    emotional: () => {
      const sameSign = pA.sign.name === pB.sign.name;
      const higher = d.rA >= d.rB ? nA : nB;
      const lower  = d.rA >= d.rB ? nB : nA;
      if (gap < 0.8) {
        const openText = sameSign
          ? `${sameSignEmotionalNote(pA.sign.name, nA, nB)}. You both process feelings at about the same speed.`
          : `${signEmotionalNote(pA.sign.name, nA)}. ${signEmotionalNote(pB.sign.name, nB)}. You both process feelings at about the same speed.`;
        return [
          { label: "What you're working with", text: `${openText} You'll rarely leave each other wondering if the conversation landed.` },
          { label: "Why it matters", text: `${er} — and you actually process emotions the same way. Most couples have to build this from scratch. You already have it.` },
          { label: "Where it can slip", text: `Even easy emotional connection fades if you stop tending to it. Keep checking in — especially when life gets busy.` },
        ];
      }
      const differText = sameSign
        ? `${sameSignEmotionalNote(pA.sign.name, nA, nB)}. Even so, ${higher} moves through emotions faster than ${lower} right now — neither cares less, you just pace things differently.`
        : `${signEmotionalNote(pA.sign.name, nA)}. ${signEmotionalNote(pB.sign.name, nB)}. ${higher} moves through emotions faster than ${lower} does. Neither of you cares less. You just pace things differently.`;
      return [
        { label: "Where you differ", text: differText },
        { label: "What that looks like", text: soft
          ? `When ${lower} goes quiet, ${higher} can read it as distance. That's usually not what's happening.`
          : `${higher} may feel like they're putting in more emotional effort. ${lower} may feel a quiet push to do more than feels natural.` },
        { label: "One thing that helps", text: `Say what you need out loud. "I want to check in tonight" works better than waiting for the right moment to arrive — for both of you.` },
      ];
    },

    communication: () => {
      const sameSign = pA.sign.name === pB.sign.name;
      const direct   = d.rA >= d.rB ? nA : nB;
      const indirect = d.rA >= d.rB ? nB : nA;
      const exprA    = EXPRESSION_PROFILES[pA.expression];
      const exprB    = EXPRESSION_PROFILES[pB.expression];
      const exprNote = exprA && exprB
        ? ` ${nA} shows up in conversation as ${exprA.title.toLowerCase()} — ${exprA.style}. ${nB} comes across as ${exprB.title.toLowerCase()} — ${exprB.style}.`
        : "";
      const signOpenText = sameSign
        ? sameSignCommNote(pA.sign.name, nA, nB)
        : `${signCommNote(pA.sign.name, nA)}. ${signCommNote(pB.sign.name, nB)}`;
      if (gap < 0.8) {
        return [
          { label: "How you each show up", text: `${signOpenText}.${exprNote} You talk in different ways — but it lands in a pretty compatible place.` },
          { label: "Where it works", text: `Everyday logistics, tough conversations, quick decisions — they flow smoothly here. You don't have to work at it the way most couples do.` },
          { label: "Where it gets harder", text: `This ease quietly fades when life gets busy and you stop putting energy into it. It feels like it'll take care of itself. It won't.` },
        ];
      }
      return [
        { label: "How you each show up", text: `${signOpenText}.${exprNote} This is an actual pacing gap, not just a style difference.` },
        { label: "Where it works", text: soft
          ? `${direct} cuts to the chase. ${indirect} takes a wider path. The good news is these can complement each other when there's no rush.`
          : `When things aren't tense, both styles have room. ${direct} gets to the point. ${indirect} brings in the texture around it.` },
        { label: "Where it gets harder", text: `${direct} can read ${indirect}'s approach as dodging. ${indirect} can read ${direct} as blunt. Both of those reads miss what's actually happening.` },
      ];
    },

    conflict: () => {
      const mn  = modalityNote(pA.sign.modality, pB.sign.modality);
      const lpC = lpConflictNote(pA.lifePath, pB.lifePath, nA, nB);
      const modA = modalityConflictNote(pA.sign.modality, pA.sign.name, nA);
      const modB = modalityConflictNote(pB.sign.modality, pB.sign.name, nB);
      const modNote = pA.sign.modality !== pB.sign.modality ? `${modA} ${modB}` : `${modA}`;
      if (d.score >= 7) {
        return [
          { label: "What you've built", text: `${nA} and ${nB} get through tension without it defining the relationship.${mn ? ` ${mn} — that helps a lot when things get hard.` : ""}` },
          { label: "Why it matters", text: `The couples who get pulled under aren't the ones who argue. They're the ones who never fix what's broken. You know how to come back from a rough patch. That's a real advantage.` },
          { label: "Where it can slip", text: `This skill fades if you don't use it — even on small stuff. Keep practicing on the little things so you're not starting from scratch on the big ones.` },
        ];
      }
      if (d.rA < 1.8 && d.rB < 1.8) {
        const avoidNote = mn ? ` ${mn} — but it also makes it easy to work around friction instead of naming it.` : "";
        return [
          { label: "What's happening", text: `Both of you tend to step back from a hard conversation.${avoidNote}` },
          { label: "The quiet risk", text: `Things that don't get said pile up underneath a calm surface. Then one day they come out bigger than they needed to be.` },
          { label: "What to do about it", text: `Name the small stuff early — "this has been on my mind" is not a fight, it's maintenance.${lpC}` },
        ];
      }
      return [
        { label: "The pattern you fall into", text: `${nA} and ${nB} go at tension from opposite directions. One wants to solve it now. The other needs to step back first.${mn ? ` ${mn} — which can smooth over the rough edges more than you realize.` : ""}` },
        { label: "What makes it worse", text: soft
          ? `This is incredibly common. The person pulling back makes the other push harder — which makes them pull back even further.`
          : `The one who wants to solve it pushes. The one who needs space pulls away more. Neither is wrong — they're just caught in a loop.` },
        { label: "One thing to try", text: `Name the pattern before it plays out. ${nA} says when they need space and promises to come back. ${nB} trusts that space doesn't mean avoidance. Agree on this now — not in the middle of something hard.${lpC}` },
      ];
    },

    values: () => {
      const lpV = lpValuesNote(pA.lifePath, pB.lifePath, nA, nB);
      if (gap < 0.8) {
        return [
          { label: "Where you're aligned", text: `${nA} and ${nB} want the same things from life.${lpV}` },
          { label: "Why that matters", text: `Money, lifestyle, where you spend your energy — these things predict long-term success more than chemistry does. You already have good ground to stand on.` },
          { label: "The quiet risk", text: `If you stop checking in and just assume you're still on the same page, things can drift. Keep the conversation going. Especially when life changes.` },
        ];
      }
      return [
        { label: "Where you differ", text: d.score >= 5
          ? `${nA} and ${nB} share some common ground, but there are real differences too.${lpV}`
          : `${nA} and ${nB} approach life from genuinely different directions.${lpV}` },
        { label: "What that looks like", text: soft
          ? `It won't show up as arguments. It'll show up as slow drift — each of you making more independent choices until the picture of what you're building starts to blur.`
          : `This is where long-term friction quietly builds. Not through fights — through each person assuming the other came to the same conclusions on their own.` },
        { label: "What to do about it", text: `Sit down and name your five-year picture. Where do those pictures overlap? Where do they pull apart? The safest trap is assuming you agree when you haven't actually checked.` },
      ];
    },

    intimacy: () => {
      const noteBoth = `Your quiz answers both landed here — at roughly the same comfort level with getting close.`;
      const noteOneA = `Your quiz answers show different comfort levels with closeness — ${nA} leans toward openness, ${nB} takes a slower path.`;
      const noteOneB = `Your quiz answers show different comfort levels with closeness — ${nB} leans toward openness, ${nA} takes a slower path.`;

      if (gap < 0.8) {
        return [
          { label: "Your baseline", text: noteBoth },
          { label: "What you've built", text: `Neither of you is likely to feel pushed or left out. Closeness here feels natural, not forced. That's a real advantage.` },
          { label: "Where it can slip", text: `Once things feel easy, couples stop putting energy in. Small daily gestures keep this alive better than big occasional ones.` },
        ];
      }
      const opener  = d.rA >= d.rB ? nA : nB;
      const guarded = d.rA >= d.rB ? nB : nA;
      return [
        { label: "Where your comfort levels differ", text: opener === nA ? noteOneA : noteOneB },
        { label: "What that looks like", text: soft
          ? `${opener} can feel like they're putting in more. Even when ${guarded} is moving toward them — just slower.`
          : `${opener} may feel quietly rejected. ${guarded} may feel quietly pressured. It's not intentional on either side — the gap just isn't named.` },
        { label: "One thing that helps", text: `${guarded} saying "I'm not closed off, I just need more time" changes everything for ${opener}. It turns silence into a signal.` },
      ];
    },

  };

  return m[d.key]?.() ?? [];
}

// ─── Strength narrative ────────────────────────────────────────

export function strengthNarr(
  d: DimensionScore, nA: string, nB: string,
  pA: Profile, pB: Profile,
  qA: QuizAnswers, qB: QuizAnswers,
  tA: string[], tB: string[]
): DimTheme[] {
  void qA; void qB; void tA; void tB; void eCompat;
  const er  = eRel(pA.sign.element, pB.sign.element);
  const mn  = modalityNote(pA.sign.modality, pB.sign.modality);
  const sameSignS = pA.sign.name === pB.sign.name;
  const emotionalOpenS = sameSignS
    ? sameSignEmotionalNote(pA.sign.name, nA, nB)
    : `${signEmotionalNote(pA.sign.name, nA)}. ${signEmotionalNote(pB.sign.name, nB)}`;

  const n: Record<string, DimTheme[]> = {
    emotional: [
      { label: "What your strength actually looks like", text: `${emotionalOpenS}. You process feelings at about the same pace. ${er} — your shared emotional rhythm is the clearest sign that these two energies work well together.` },
      { label: "What could pull it apart", text: `You're both being genuine here. That kind of natural alignment doesn't arrive on its own — and it doesn't run on autopilot.` },
      { label: "How to keep it strong", text: `Keep checking in even when things feel easy. Life gets busy. Surface-level gets comfortable. Don't stop having the real conversations.` },
    ],

    communication: [
      { label: "What your strength actually looks like", text: `${nA} and ${nB} talk with different rhythms, but they land in a place that works.${mn ? ` ${mn} — that flexibility shows up most when you're under pressure.` : ""} Everyday logistics, tough conversations, quick decisions — they all flow easier here than in most pairings.` },
      { label: "What could pull it apart", text: `This is the kind of strength couples don't realize they're losing until it's already faded. It feels like it'll just keep happening.` },
      { label: "How to keep it strong", text: `Keep listening carefully especially when life gets stressful. That's when good communication habits slip. And that's exactly when you need them most.` },
    ],

    conflict: [
      { label: "What your strength actually looks like", text: `${nA} and ${nB} know how to get through a rough patch and come back.${mn ? ` ${mn} — there's more give than dig-in here.` : ""} That's one of the most underrated things a couple can have.` },
      { label: "What could pull it apart", text: `Couples who struggle aren't usually the ones who argue. They're the ones who don't repair. You have that skill — but it fades if you don't use it consistently, on small things too.` },
      { label: "How to keep it strong", text: `Keep addressing things early. Don't let friction sit. You've built a good habit of not letting things fester — that's worth protecting.` },
    ],

    values: [
      { label: "What your strength actually looks like", text: `${nA} and ${nB} want similar things from life.${lpValuesStrengthNote(pA.lifePath, pB.lifePath, nA, nB)} When money, priorities, and the bigger picture come up — your answers land in the same place.` },
      { label: "What could pull it apart", text: `Connection gets you through the early phase of a relationship. Shared values get you through everything after that. But they only hold if you keep tending to them.` },
      { label: "How to keep it strong", text: `Don't assume you're still aligned — check. Regular conversations about what you're both building toward are what keep this dimension from quietly drifting.` },
    ],

    intimacy: [
      { label: "What your strength actually looks like", text: `Your quiz answers placed you close on how comfortable you are with getting close. Neither of you is likely to feel pushed or left out.` },
      { label: "What could pull it apart", text: `Once closeness feels natural, it's easy to stop putting energy in. It doesn't need grand gestures — but it does need the small ones to keep landing.` },
      { label: "How to keep it strong", text: `Small, daily moments of openness. A text. A shared quiet evening. Consistent attention matters more than the occasional big romantic move.` },
    ],
  };

  return n[d.key] ?? [];
}

// ─── Growth narrative ─────────────────────────────────────────

export function growthNarr(
  d: DimensionScore, nA: string, nB: string,
  pA: Profile, pB: Profile,
  qA: QuizAnswers, qB: QuizAnswers,
  tA: string[], tB: string[],
  soft: boolean
): DimTheme[] {
  void qA; void qB; void tA; void tB;
  const er  = eRel(pA.sign.element, pB.sign.element);
  const ec  = eCompat(pA.sign.element, pB.sign.element);
  const mn  = modalityNote(pA.sign.modality, pB.sign.modality);
  const lpC = lpConflictNote(pA.lifePath, pB.lifePath, nA, nB);
  const sameSignG = pA.sign.name === pB.sign.name;
  const emotionalOpenG = sameSignG
    ? `${sameSignEmotionalNote(pA.sign.name, nA, nB)}. Even with the same sign, you process emotions at different speeds right now.`
    : `${signEmotionalNote(pA.sign.name, nA)}. ${signEmotionalNote(pB.sign.name, nB)}. You process emotions at different speeds.`;
  const commOpenG = sameSignG
    ? `${sameSignCommNote(pA.sign.name, nA, nB)}. Even with that shared style, the quiz shows a real pacing gap.`
    : `${signCommNote(pA.sign.name, nA)}. ${signCommNote(pB.sign.name, nB)}. You don't just talk differently — you actually pace conversations differently.`;

  const n: Record<string, DimTheme[]> = {
    emotional: [
      { label: "What's happening", text: emotionalOpenG },
      { label: "Why it compounds", text: soft
        ? `When the slower person goes quiet, the faster one can read it as distance. It usually isn't — but that misread builds.`
        : `One person may feel under-met over time. The other feels pushed to do more than feels natural. Neither is wrong.` },
      { label: "One thing to try", text: `"I need a check-in tonight" and "I need to unwind first" are both honest. Say them out loud instead of waiting for the right moment.` },
    ],

    communication: [
      { label: "What's happening", text: commOpenG },
      { label: "Why it compounds", text: soft
        ? `This is one of the most workable differences in a relationship. The risk is waiting for the other person to just figure out your rhythm. They won't.`
        : `One reads roundabout as evasion. The other reads direct as pressure. Both of those reads miss the mark. Both feel completely real in the moment.` },
      { label: "One thing to try", text: `Talk about how each of you prefers to handle tough conversations. Not the conversation itself — the format of it. Done once, that changes every conversation after.${lpC}` },
    ],

    conflict: [
      { label: "What's happening", text: `You go at disagreements from different directions.${mn ? ` ${mn}, which makes it harder to tell when a real issue is hiding behind that difference.` : ""}` },
      { label: "Why it compounds", text: d.rA < 1.8 && d.rB < 1.8
        ? soft
          ? `Things you don't say pile up under a calm surface. Then they come out bigger than they should.`
          : `Small friction quietly builds under a calm exterior. When it finally surfaces, it usually arrives amplified.`
        : soft
          ? `The person who wants to talk pushes. The person who needs space pulls. Each one makes the other do it more.`
          : `One pushes harder for resolution. The other pulls away to breathe. The loop tightens with every round.` },
      { label: "One thing to try", text: d.rA < 1.8 && d.rB < 1.8
        ? `Say "this has been on my mind" early. It's not a fight starter — it's maintenance.${lpC}`
        : `Name the pattern before playing it. The person who needs space says so and commits to coming back. That built-in promise changes everything.${lpC}` },
    ],

    values: [
      { label: "What's happening", text: `Your life priorities show meaningful differences.${lpValuesNote(pA.lifePath, pB.lifePath, nA, nB).trim()}` },
      { label: "Why it compounds", text: `This won't sound like an argument. It sounds like slow drift — each of you making more independent calls until the picture of what you're building doesn't look like either plan.` },
      { label: "One thing to try", text: `Name your five-year picture. Where do they overlap? Where do they pull in different directions? Assume nothing. Name it all.` },
    ],

    intimacy: [
      { label: "What's happening", text: `One of you is readier to go deeper than the other.` },
      { label: "Why it compounds", text: soft
        ? `The more open person can start feeling like they're carrying more weight. Even when the other person is genuinely moving — just slower.`
        : `The open one feels quietly rejected. The guarded one feels quietly pushed. It's not intentional — it's just unspoken.` },
      { label: "One thing to try", text: `If you need more time to open up, say so. "I'm not closed, I just need time" is everything the other person needs to hear. It turns silence into a signal.` },
    ],
  };

  return n[d.key] ?? [];
}

// ─── Nudges ───────────────────────────────────────────────────

export function makeNudges(
  dims: DimensionScore[], nA: string, nB: string,
  pA: Profile, pB: Profile,
  qA: QuizAnswers, qB: QuizAnswers,
  tA: string[], tB: string[]
): Nudge[] {
  const sorted = [...dims].sort((a, b) => a.score - b.score);
  const best   = [...dims].sort((a, b) => b.score - a.score)[0];
  const worst  = sorted[0];
  const second = sorted[1];
  void qA; void qB; void tA; void tB;

  const er = eRel(pA.sign.element, pB.sign.element);
  const ec = eCompat(pA.sign.element, pB.sign.element);
  const bothMutable  = pA.sign.modality === "Mutable"  && pB.sign.modality === "Mutable";
  const bothFixed    = pA.sign.modality === "Fixed"    && pB.sign.modality === "Fixed";
  const sameLp       = pA.lifePath === pB.lifePath;
  const twoWater     = pA.sign.element === "Water"     && pB.sign.element === "Water";
  const fireWater    = [pA.sign.element, pB.sign.element].sort().join("-") === "Fire-Water";

  // Always one symbolic nudge tied to this specific pair
  const symbolicNudge: Nudge = (() => {
    if (fireWater) return {
      title: "Navigate the Fire-Water Chemistry",
      text: `${er} creates real intensity — passion, depth, and the occasional heat that turns to steam. The nudge here is directional: let the Fire energy initiate and the Water energy feel through what's being built, rather than one extinguishing the other. When conversations get hot, the Water partner grounds; when one of you retreats into silence, the Fire partner draws them back — gently, not insistently.`,
    };
    if (bothMutable) return {
      title: "Create Some Structure Together",
      text: `${nA} and ${nB} are both naturally flexible and accommodate easily — but two people who bend can drift without realising it, each yielding to the other until neither is being honest about what they want. Create one or two fixed reference points: a regular check-in, a shared decision revisited quarterly. Structure from the outside, since it doesn't come naturally from either of you.`,
    };
    if (bothFixed) return {
      title: "Build In a Way to Yield",
      text: `Two Fixed signs means genuine staying power — and a real risk of both of you holding your ground past the point of usefulness. Agree in advance on a signal for "I'm dug in and I know it" — something that acknowledges the pattern without requiring either of you to immediately back down. Naming it first takes most of the heat out of it.`,
    };
    if (sameLp) return {
      title: `Use Your Shared Orientation`,
      text: `${nA} and ${nB} share the same core life orientation — there's a deep, sometimes unspoken understanding of what drives each other. Make it spoken: "I recognize what you're doing because I do the same thing." That kind of accurate witnessing builds trust faster than most gestures, and it's something only two people wired the same way can offer each other.`,
    };
    if (twoWater) return {
      title: "Track Whose Weather You're Carrying",
      text: `Two Water signs understand emotional depth instinctively — but that shared sensitivity means you can absorb each other's moods without realizing it. Build a habit of checking: "Is this feeling mine or yours right now?" It's a disarming question that prevents one person's difficult day from becoming a shared emotional spiral.`,
    };
    if (Math.abs(pA.expression - pB.expression) >= 3) return {
      title: "Name the Communication Gap",
      text: `${nA} and ${nB} have meaningfully different ways of showing up in conversation — not just style, but rhythm, directness, and what feels natural to say out loud. Rather than assuming the other person operates the same way, try naming it explicitly: "I know I tend to [X] in conversations — what works better for you?" One direct question about communication style does more than a dozen attempts to adjust without knowing what the other person actually needs.`,
    };
    return {
      title: "Say It in Their Language",
      text: `${nA} and ${nB} have different outward styles in conversation — not just in how they talk, but in what feels natural to say out loud. Rather than silently adjusting and hoping the other person catches on, try this one question: "I know I tend to be very direct / take my time / talk it all through — what works better for you?" One honest question about how you communicate does more than a dozen invisible adjustments.`,
    };
  })();

  const dimNudges: Record<string, Nudge> = {
    emotional: {
      title: "The 60-Second Emotional Check-In",
      text: `Once a day — in an unguarded moment, not when something is already wrong — each person shares one word for their current emotional state and one sentence explaining why. Low-pressure enough for the more contained partner, structured enough for the more expressive one. It keeps emotional distance from accumulating silently between real conversations.`,
    },
    communication: {
      title: "Headline First, Then Story",
      text: `When raising something important, lead with a one-line headline: "I want to talk about [X] — is now a good time?" This gives the other person a moment to shift gears rather than feeling ambushed mid-task. Small framing change, outsized impact on how the conversation actually lands.`,
    },
    conflict: {
      title: "Agree on a Reset Protocol Before You Need One",
      text: `Right now, before any tension arises, agree: either person can call a 30-minute pause by saying "I need a reset." The person who calls it is responsible for re-opening the conversation after the pause. This breaks both failure modes — one person keeps pushing, the other keeps pulling away — and both quietly avoiding it — because there's a built-in commitment to return, not just to escape.`,
    },
    values: {
      title: "The Quarterly Picture Check",
      text: `Every three months, each of you independently writes one sentence: "The one thing I most want to be true about our life together in five years is ___." Then compare. Where the answers overlap, you're aligned. Where they diverge, you've found what needs real dialogue — not compromise by default, but honest conversation about what each of you is actually building toward.`,
    },
    intimacy: {
      title: "Graduated Vulnerability Practice",
      text: `For the more guarded partner: share one small thing you'd normally keep to yourself — not something heavy, just a quiet preference, a worry, a hope. For the more open partner: receive it without probing or escalating the emotional stakes. Build this muscle slowly. Small, consistent openings compound into genuine trust faster than any single grand gesture.`,
    },
  };

  const strengthNudge: Nudge = {
    title: `Keep Tending to ${best.name}`,
    text: `Your strongest dimension is ${best.name.toLowerCase()} — and that's exactly where couples stop investing, because it feels like it takes care of itself. It doesn't. ${best.key === "emotional" ? "Keep having the real conversations even when life gets busy and surface-level feels easier." : best.key === "communication" ? "Maintain the openness especially under stress — that's when communication habits erode fastest." : best.key === "values" ? "Keep checking in on your shared picture — alignment can drift without either of you noticing." : best.key === "conflict" ? "Keep addressing things as they come up — that habit of not letting things fester is genuinely valuable." : "Keep the small daily gestures of closeness going — that's what sustained intimacy actually looks like."}`,
  };

  const nudges: Nudge[] = [dimNudges[worst.key]];
  if (second && second.score < 7 && dimNudges[second.key]) nudges.push(dimNudges[second.key]);
  nudges.push(symbolicNudge);
  nudges.push(strengthNudge);

  return nudges;
}

// ─── Post-breakup (unchanged logic, uses profile for reflection) ──

export function makePostBreakup(
  dims: DimensionScore[], nA: string, nB: string,
  pA: Profile, pB: Profile,
  qA: QuizAnswers, qB: QuizAnswers,
  tA: string[], tB: string[]
): PostBreakupData {
  void nB; void pB;
  const w  = [...dims].sort((a, b) => a.score - b.score).slice(0, 2);
  const s  = [...dims].sort((a, b) => b.score - a.score)[0];
  const lA = (t: string) => traitLabel(t, traitAvg(qA, tA, [t]));
  void pA;
  const reflections = [
    { title: "What Worked Between You", text: `Your strongest dynamic was ${s.name.toLowerCase()} (${s.score.toFixed(1)}/10). This wasn't random — it reflects genuine compatibility in ${s.key === "emotional" ? "how you both process and express feelings" : s.key === "communication" ? "how you shared information and navigated decisions" : s.key === "values" ? "what you both prioritized in life" : s.key === "conflict" ? "how you navigated disagreements" : "how you built closeness and trust"}. This pattern tells you something real about what you bring to a relationship and what you respond to in a partner. Carry this self-knowledge forward.` },
    { title: "Where Friction Lived", text: `The areas of most tension were ${w.map(d => d.name.toLowerCase()).join(" and ")}. ${w[0].key === "values" ? "When core life priorities don't align, even strong emotional connection struggles under the weight of practical disagreements about money, lifestyle, and direction." : w[0].key === "communication" ? "Communication mismatches create slow erosion — not dramatic blowups, but a gradual sense of not being heard or understood, conversation after conversation." : w[0].key === "conflict" ? "How two people handle disagreements often determines whether small issues get resolved or calcify into resentment that eventually breaks the surface." : w[0].key === "emotional" ? "When emotional wavelengths don't match, one person often feels like they're giving more than they're getting — even when both are genuinely trying." : "When comfort with closeness differs significantly, one person can feel suffocated while the other feels shut out — and both feel like they're the one making the effort."} Understanding this as a pattern — not a personal failure — is the first step toward choosing differently next time.` },
    { title: "What to Watch For Next Time", text: `Based on your profile — ${lA("T1")}, ${lA("T2")}, tends to be ${lA(tA[2] || "T3")} — you may be drawn to partners who ${traitAvg(qA, tA, ["T1"]) > 3 ? "match your emotional intensity but may not share your practical priorities" : "seem stable and grounding but may not meet your emotional needs over the long term"}. The pattern to examine isn't who you're attracted to initially — it's whether the dimensions that caused friction this time (${w[0].name.toLowerCase()}) are genuinely compatible in the next relationship, or just assumed to be because the other areas feel good.` },
  ];
  const questions = [
    `What did I learn about my own ${w[0].name.toLowerCase()} needs that I wasn't fully aware of before?`,
    `Was the friction in ${w.map(d => d.name.toLowerCase()).join(" and ")} something I noticed early and overlooked, or something that genuinely emerged over time?`,
    `What would I need to see in a future partner's approach to ${w[0].key === "conflict" ? "disagreements" : w[0].key === "communication" ? "sharing and decision-making" : w[0].key === "values" ? "life priorities" : w[0].key === "emotional" ? "emotional expression" : "closeness and vulnerability"} to feel confident about long-term compatibility?`,
    `Did I communicate my needs clearly in this relationship, or did I expect them to be intuited?`,
    `What's the one thing I'd do differently — not about choosing a different person, but about how I showed up?`,
  ];
  return { reflections, questions };
}

// ─── Pair Teaser (free report — "How You Work Together") ──────
export function makePairTeaser(
  pA: Profile, pB: Profile,
  nA: string, nB: string,
  archA: SignArchetype, archB: SignArchetype,
  elDyn: ElementDynamic,
): PairTeaser {
  const eA = pA.sign.element, eB = pB.sign.element;
  const sameEl = eA === eB;
  const signSpecific = getSignPairDetail(pA.sign.name, pB.sign.name);
  // Use sign-specific detail when available, fall back to element-level
  const detailText = typeof signSpecific === "object" && signSpecific !== null && "detail" in signSpecific
    ? signSpecific.detail
    : typeof signSpecific === "string"
      ? signSpecific
      : elDyn.detail;
  const vibeText = typeof signSpecific === "object" && signSpecific !== null && "vibe" in signSpecific
    ? signSpecific.vibe
    : elDyn.vibe;
  void vibeText;
  const narrative = sameEl
    ? `${nA} and ${nB} are both ${eA} signs — ${archA.title.toLowerCase()} meeting ${archB.title.toLowerCase()}. There's an instinctive familiarity here: you tend to speak the same emotional language. But that shared nature can also mean blind spots get reinforced rather than balanced. ${detailText}`
    : `${nA} (${pA.sign.name}, ${eA}) and ${nB} (${pB.sign.name}, ${eB}) bring genuinely different energies into the same space — ${archA.title.toLowerCase()} alongside ${archB.title.toLowerCase()}. ${detailText} This contrast is neither a guarantee of compatibility nor a warning; it's an invitation to understand what the other person's world actually feels like from the inside.`;
  const strength = elDyn.strength;
  const friction = elDyn.risk;
  return { narrative, strength, friction };
}

// ─── Pair Full (paid report — "Your Dynamic as a Pair") ───────
export function makePairDynamic(
  pA: Profile, pB: Profile,
  nA: string, nB: string,
  dims: DimensionScore[],
): PairFull {
  const eA = pA.sign.element, eB = pB.sign.element;
  const mA = pA.sign.modality, mB = pB.sign.modality;
  const lpA = pA.lifePath, lpB = pB.lifePath;
  const sorted = [...dims].sort((a, b) => b.score - a.score);
  const topDim = sorted[0];
  const botDim = sorted[sorted.length - 1];

  // Fix 4 — Opening paragraph: human experience first, no brackets or sign labels
  const sentenceEl  = elementDayToDay(eA, eB);
  const sentenceMod = modalityDayToDay(mA, mB);
  const sentenceBehavioral = `The behavioral data confirms their strongest ground is ${topDim.name.toLowerCase()} and the main area that needs active attention is ${botDim.name.toLowerCase()}.`;
  const opening = `${sentenceEl} ${sentenceMod} ${sentenceBehavioral}`;

  // Fix 5 — Complements: max 2 blocks, one elemental, one behaviorally grounded
  const complements: string[] = [];

  // Block 1: element relationship (always)
  if (["Air-Fire", "Fire-Air", "Earth-Water", "Water-Earth"].includes([eA, eB].sort().join("-"))) {
    complements.push(`The interplay between ${eA.toLowerCase()} and ${eB.toLowerCase()} energy is naturally complementary — each brings something the other needs without either needing to change their fundamental nature.`);
  } else if (eA === eB) {
    complements.push(`Sharing the same elemental energy means ${nA} and ${nB} understand each other's basic emotional rhythm without explanation — there's a native fluency here that doesn't have to be earned.`);
  } else {
    complements.push(`The contrast between ${eA.toLowerCase()} and ${eB.toLowerCase()} energy means ${nA} and ${nB} each bring something the other genuinely lacks — when channelled consciously, that contrast creates more range than either carries alone.`);
  }

  // Block 2: choose the single most specific behaviorally grounded strength (no duplicating block 1)
  if (topDim.score >= 7) {
    complements.push(`${nA} and ${nB}'s ${topDim.name.toLowerCase()} alignment (${topDim.score.toFixed(1)}/10) is a genuine strength — this is where you show up consistently for each other, and it's the dimension worth protecting when other areas create stress.`);
  } else if (lpA === lpB) {
    complements.push(`Sharing a core life orientation means ${nA} and ${nB} likely want similar things at the deepest level — which builds a reliable foundation when surface differences create noise.`);
  } else if (pA.expression === pB.expression) {
    complements.push(`${nA} and ${nB} have the same outward style in conversation — the way you each show up feels natural to the other, without constant negotiation about tone or register.`);
  } else {
    complements.push(`The behavioral data shows genuine alignment in ${topDim.name.toLowerCase()} — not just symbolic compatibility, but confirmed through how ${nA} and ${nB} actually responded under similar conditions.`);
  }

  // Fix 2 — Frictions: no sign-name brackets in opening; describe what it feels like
  const frictions: string[] = [];
  frictions.push(`The main area of friction is ${botDim.name.toLowerCase()} (${botDim.score.toFixed(1)}/10). This doesn't reflect bad intent from either side — it reflects a genuine difference in how ${nA} and ${nB} are wired here, which needs to be named rather than assumed away.`);
  if (mA !== mB) {
    frictions.push(`${nA} and ${nB} approach change and decisions at different speeds — one initiates or pivots while the other ${mB === "Fixed" ? "prefers to build on what's already there" : mB === "Cardinal" ? "wants to set the direction" : "prefers to stay adaptable and course-correct as things evolve"}. This gap shows up most under pressure or transition.`);
  } else {
    frictions.push(`Having the same approach to change is mostly harmonious — but it can also mean ${nA} and ${nB} amplify each other's tendencies: ${mA === "Fixed" ? "both holding position rather than yielding" : mA === "Cardinal" ? "both wanting to lead rather than follow" : "both adapting so much that no clear direction gets set"}.`);
  }

  const watch = `The pattern to watch: when ${botDim.name.toLowerCase()} creates stress, there's a pull toward retreating into ${topDim.name.toLowerCase()} as a comfort zone — using the strongest dimension to avoid addressing the hardest one. Name the friction before defaulting to what feels safe.`;

  // Fix 3 — LP pairing subsection: use detail field only, return empty if not found (UI will hide heading)
  const lpPairDetail = LIFE_PATH_PAIR_DYNAMICS[getLPPairKey(lpA, lpB)];
  const lpSection = lpPairDetail
    ? personalizeLPDetail(lpPairDetail.detail, lpA, lpB, nA, nB)
    : "";

  return { opening, complements, frictions, watch, lpSection };
}

// ─── Free report narrative helpers ────────────────────────────────────────────

function personalizeLPDetail(detail: string, lpA: number, lpB: number, nameA: string, nameB: string): string {
  if (lpA === lpB) {
    let r = detail;
    r = r.replace(new RegExp(`Two Life Path ${lpA}s`, 'g'), `Both ${nameA} and ${nameB}`);
    r = r.replace(new RegExp(`\\btwo ${lpA}s\\b`, 'gi'), `${nameA} and ${nameB}`);
    r = r.replace(new RegExp(`Life Path ${lpA}`, 'g'), `${nameA} and ${nameB}'s shared orientation`);
    r = r.replace(new RegExp(`\\b${lpA}'s\\b`, 'g'), `${nameA} and ${nameB}'s`);
    r = r.replace(new RegExp(`\\b${lpA}\\b`, 'g'), `${nameA} and ${nameB}`);
    return r;
  }
  // Replace longer number string first to prevent partial matches (e.g. "1" inside "11")
  const [firstLP, firstName, secondLP, secondName] = lpA.toString().length >= lpB.toString().length
    ? [lpA, nameA, lpB, nameB] : [lpB, nameB, lpA, nameA];
  let result = detail;
  result = result.replace(new RegExp(`Life Path ${firstLP}`, 'g'), firstName);
  result = result.replace(new RegExp(`Life Path ${secondLP}`, 'g'), secondName);
  result = result.replace(new RegExp(`\\b${firstLP}'s\\b`, 'g'), `${firstName}'s`);
  result = result.replace(new RegExp(`\\b${secondLP}'s\\b`, 'g'), `${secondName}'s`);
  result = result.replace(new RegExp(`\\bto ${firstLP}\\b`, 'g'), `to ${firstName}`);
  result = result.replace(new RegExp(`\\bto ${secondLP}\\b`, 'g'), `to ${secondName}`);
  // Standalone bare numbers — replace longer first to avoid partial matches
  result = result.replace(new RegExp(`\\b${firstLP}\\b`, 'g'), firstName);
  result = result.replace(new RegExp(`\\b${secondLP}\\b`, 'g'), secondName);
  return result;
}

// Exported alias — apply to any LP pair field (strength, watchFor, etc.)
export function personalizePairField(text: string, lpA: number, lpB: number, nameA: string, nameB: string): string {
  return personalizeLPDetail(text, lpA, lpB, nameA, nameB);
}

const LP_WIRED: Record<number, { wired: string; relEffect: string }> = {
  1:  { wired: "autonomy and self-direction",              relEffect: "thrives in partnership that doesn't require surrendering the lead" },
  2:  { wired: "collaboration and emotional attunement",   relEffect: "thrives when they feel genuinely consulted, not just updated" },
  3:  { wired: "expression, connection, and keeping things alive", relEffect: "at their best when there's real room for play and spontaneity" },
  4:  { wired: "structure, reliability, and careful follow-through", relEffect: "shows love through consistency more than words" },
  5:  { wired: "variety, freedom, and forward momentum",  relEffect: "needs space to move — commitment that feels like containment doesn't hold" },
  6:  { wired: "care, devotion, and being genuinely needed", relEffect: "gives most when the relationship has a clear sense of home" },
  7:  { wired: "depth, analysis, and earned solitude",     relEffect: "needs significant alone time to stay fully present in relationship" },
  8:  { wired: "ambition, authority, and concrete results", relEffect: "shows love through provision and protection more than vulnerability" },
  9:  { wired: "meaning, contribution, and the larger picture", relEffect: "most alive when the relationship connects to something beyond itself" },
  11: { wired: "perception, depth, and transcendent connection", relEffect: "needs a partner who can hold emotional intensity without flinching" },
  22: { wired: "legacy, vision, and long-term impact",    relEffect: "in partnership for the long game, not just the present moment" },
};

export function buildNumerologySynthesis(
  name: string, lifePath: number, expression: number, destiny: number
): string {
  const lpWired = LP_WIRED[lifePath];
  const expr = EXPRESSION_NUMBER_PROFILES[expression];
  const dest = DESTINY_NUMBER_PROFILES[destiny];
  const parts: string[] = [];
  if (lpWired) parts.push(`${name} is wired for ${lpWired.wired} — ${lpWired.relEffect}.`);
  if (expr?.inConversation) parts.push(expr.inConversation);
  if (dest?.tendency) parts.push(`${name} tends to ${dest.tendency}.`);
  return parts.join(' ');
}

export function buildPairDynamic(
  nameA: string, profA: Profile,
  nameB: string, profB: Profile,
): string {
  const parts: string[] = [];

  // Layer 1: Element dynamic
  const elA = profA.sign.element;
  const elB = profB.sign.element;
  const elKey = `${elA}-${elB}`;
  const elDyn: ElementDynamic | undefined = ELEMENT_DYNAMICS[elKey] || ELEMENT_DYNAMICS[`${elB}-${elA}`];
  if (elDyn) {
    parts.push(`For ${nameA} and ${nameB}, ${elDyn.detail.charAt(0).toLowerCase() + elDyn.detail.slice(1)}`);
  }

  // Layer 2: LP pair detail
  const lpKey = getLPPairKey(profA.lifePath, profB.lifePath);
  const lpPair: LPPairDynamic | undefined = LIFE_PATH_PAIR_DYNAMICS[lpKey];
  if (lpPair) {
    parts.push(personalizeLPDetail(lpPair.detail, profA.lifePath, profB.lifePath, nameA, nameB));
  }

  // Layer 3: Expression cross
  const exprDiff = Math.abs(profA.expression - profB.expression);
  const exprA = EXPRESSION_NUMBER_PROFILES[profA.expression];
  const exprB = EXPRESSION_NUMBER_PROFILES[profB.expression];
  if (profA.expression === profB.expression && exprA) {
    parts.push(`Both ${nameA} and ${nameB} have the same outward style in conversation — a natural ease in how they show up together, and a shared blind spot worth watching.`);
  } else if (exprDiff <= 2 && exprA && exprB) {
    parts.push(`Their communication styles are close — similar enough to feel natural, different enough to avoid total echo.`);
  } else if (exprA && exprB) {
    parts.push(`Their communication styles differ notably — the way ${nameA} tends to show up in conversation is meaningfully different from ${nameB}'s, which is worth naming explicitly rather than each person silently adjusting.`);
  }

  // Layer 4: Destiny cross
  const destA = DESTINY_NUMBER_PROFILES[profA.destiny];
  const destB = DESTINY_NUMBER_PROFILES[profB.destiny];
  if (profA.destiny === profB.destiny && destA) {
    parts.push(`Both bring the quality of ${destA.title} into shared spaces — the strength and the blind spot of that role are both amplified when they're together.`);
  } else if (destA && destB) {
    parts.push(`${nameA} tends to ${destA.tendency.split('—')[0].trim()}, while ${nameB} tends to ${destB.tendency.split('—')[0].trim()} — roles that tend to complement rather than overlap.`);
  }

  // Closing synthesis
  if (elA === elB) {
    parts.push(`Sharing the same element means the resonance is deep — and so is the risk of amplifying each other's characteristic patterns.`);
  } else if (lpPair) {
    parts.push(`Together, they bring more range than either carries alone — the question is whether they have the patience to let that play out.`);
  }

  return parts.join(' ');
}

export function buildKeyTakeaway(
  nameA: string, profA: Profile,
  nameB: string, profB: Profile,
  lpPairData: LPPairDynamic,
): string {
  const parts: string[] = [];

  // Base: personalized LP takeaway
  parts.push(personalizeLPDetail(lpPairData.takeaway, profA.lifePath, profB.lifePath, nameA, nameB));

  // Expression note if gap is significant
  const exprDiff = Math.abs(profA.expression - profB.expression);
  const exprA = EXPRESSION_NUMBER_PROFILES[profA.expression];
  const exprB = EXPRESSION_NUMBER_PROFILES[profB.expression];
  if (exprDiff >= 3 && exprA && exprB) {
    parts.push(`Worth naming: ${nameA} and ${nameB} communicate in noticeably different registers — what reads as natural to one may take adjustment for the other to receive well.`);
  }

  // "This week" closing with Destiny titles
  const destA = DESTINY_NUMBER_PROFILES[profA.destiny];
  const destB = DESTINY_NUMBER_PROFILES[profB.destiny];
  if (destA && destB) {
    if (profA.destiny === profB.destiny) {
      parts.push(`This week, try one conversation where both of you lean into your shared role as ${destA.title} — notice whether doubling that quality strengthens or collapses the dynamic.`);
    } else {
      parts.push(`This week, try one conversation where ${nameA} leans into their natural role as ${destA.title} and ${nameB} leans into theirs as ${destB.title} — and notice what opens up when both of you are playing to your actual strengths.`);
    }
  }

  return parts.join(' ');
}
