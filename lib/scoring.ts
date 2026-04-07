import { TRAIT_LABELS, getLpPair } from "@/lib/constants";
import type { Profile, QuizAnswers, DimensionScore } from "@/types";

export function traitAvg(quiz: QuizAnswers, themes: string[], rel: string[]): number {
  let t=0,c=0;
  rel.forEach(r=>{if(themes.includes(r)&&quiz[r])quiz[r].forEach(s=>{t+=s;c++})});
  return c?t/c:2.5;
}

export function traitLabel(tid: string, avg: number): string {
  const l=TRAIT_LABELS[tid];
  if(!l)return"moderate";
  return l[Math.max(1,Math.min(4,Math.round(avg)))]||"moderate";
}

export function elemScore(a: string, b: string): number {
  const c: Record<string,Record<string,number>>={Fire:{Fire:7,Air:8,Earth:4,Water:5},Air:{Air:7,Fire:8,Earth:5,Water:4},Earth:{Earth:8,Water:8,Fire:4,Air:5},Water:{Water:7,Earth:8,Fire:5,Air:4}};
  return c[a]?.[b]||5;
}

export function calcScores(
  pA: Profile, pB: Profile,
  qA: QuizAnswers, qB: QuizAnswers,
  tA: string[], tB: string[]
): DimensionScore[] {
  const sym=elemScore(pA.sign.element,pB.sign.element);
  const eA=traitAvg(qA,tA,["T1","T6"]),eB=traitAvg(qB,tB,["T1","T6"]);
  const cA=traitAvg(qA,tA,["T2"]),cB=traitAvg(qB,tB,["T2"]);
  const fA=traitAvg(qA,tA,["T4"]),fB=traitAvg(qB,tB,["T4"]);
  const vA=traitAvg(qA,tA,["T7","T5"]),vB=traitAvg(qB,tB,["T7","T5"]);
  const iA=traitAvg(qA,tA,["T6","T3"]),iB=traitAvg(qB,tB,["T6","T3"]);
  const sim=(a: number,b: number)=>Math.max(1,10-Math.abs(a-b)*2.5);
  const thr=(a: number,b: number)=>{const mn=Math.min(a,b),g=Math.abs(a-b);return mn<1.5?Math.max(2,5-g*1.5):Math.max(2,9-g*2)};
  const con=(a: number,b: number)=>{if(a<1.5&&b<1.5)return 3;if(a>3.5&&b>3.5)return 4;const d=Math.abs(a-b);return d>1&&d<3?8:6};
  const cl=(v: number)=>Math.min(10,Math.max(1,Math.round(v*10)/10));
  const lpAdj = getLpPair(pA.lifePath, pB.lifePath)?.adjustment ?? 0;
  return [
    {name:"Emotional Compatibility",key:"emotional",score:cl(sim(eA,eB)*0.7+sym*0.3),rA:eA,rB:eB},
    {name:"Communication Style",key:"communication",score:cl(sim(cA,cB)*0.75+sym*0.25),rA:cA,rB:cB},
    {name:"Conflict Approach",key:"conflict",score:cl(con(fA,fB)*0.7+sym*0.3),rA:fA,rB:fB},
    {name:"Values & Lifestyle",key:"values",score:cl(sim(vA,vB)*0.8+sym*0.2+lpAdj),rA:vA,rB:vB},
    {name:"Intimacy & Affection",key:"intimacy",score:cl(thr(iA,iB)*0.7+sym*0.3),rA:iA,rB:iB},
  ];
}
