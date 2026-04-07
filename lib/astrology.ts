import { ZODIAC_SIGNS, LETTER_VALUES, VOWELS_SET, QUESTION_BANK } from "@/lib/constants";
import type { ZodiacSign, Profile, Question } from "@/types";

export function getZodiacSign(m: number, d: number): ZodiacSign {
  for (const s of ZODIAC_SIGNS) {
    const [sm,sd]=s.start, [em,ed]=s.end;
    if (sm===em) { if (m===sm && d>=sd && d<=ed) return s; }
    else if (sm>em) { if ((m===sm && d>=sd)||(m===em && d<=ed)) return s; }
    else { if ((m===sm && d>=sd)||(m===em && d<=ed)) return s; }
  }
  return ZODIAC_SIGNS[0];
}

export function reduce(n: number): number {
  while(n>9&&n!==11&&n!==22) n=String(n).split('').reduce((a,b)=>a+parseInt(b),0);
  return n;
}

export function calcLP(dob: string): number {
  return reduce(dob.replace(/-/g,'').split('').map(Number).reduce((a,b)=>a+b,0));
}

export function calcExpr(name: string): number {
  const l=name.toUpperCase().replace(/[^A-Z]/g,'').split('');
  return l.length?reduce(l.reduce((a,c)=>a+(LETTER_VALUES[c]||0),0)):1;
}

export function calcSU(name: string): number {
  const v=name.toUpperCase().replace(/[^A-Z]/g,'').split('').filter(c=>VOWELS_SET.has(c));
  return v.length?reduce(v.reduce((a,c)=>a+(LETTER_VALUES[c]||0),0)):1;
}

export function calcDestiny(dob: string): number {
  const day = dob.split('-')[2];
  return reduce(day.split('').map(Number).reduce((a, b) => a + b, 0));
}

export function makeProfile(name: string, dob: string): Profile {
  const [y,m,d]=dob.split('-').map(Number);
  void y;
  return {sign:getZodiacSign(m,d),lifePath:calcLP(dob),expression:calcExpr(name),soulUrge:calcSU(name),destiny:calcDestiny(dob),moonSign:null,venusSign:null,isApproximate:false};
}

const WATER_SIGNS = new Set(["Cancer","Scorpio","Pisces"]);
const EARTH_SIGNS = new Set(["Taurus","Virgo","Capricorn"]);

export function makeThemes(p: Profile): string[] {
  const s: Record<string,number>={T1:0,T2:0,T3:0,T4:0,T5:0,T6:0,T7:0};
  if(p.sign.element==="Fire"){s.T1+=3;s.T2+=2}if(p.sign.element==="Water"){s.T1+=3;s.T6+=3}
  if(p.sign.element==="Air"){s.T2+=3;s.T5+=1}if(p.sign.element==="Earth"){s.T5+=3;s.T7+=2}
  if(p.sign.modality==="Cardinal"){s.T4+=2;s.T2+=1}if(p.sign.modality==="Fixed"){s.T4+=1;s.T5+=2}if(p.sign.modality==="Mutable"){s.T5+=1;s.T4+=1}
  if([1,5,7].includes(p.lifePath))s.T3+=3;if([2,4,6].includes(p.lifePath)){s.T3+=1;s.T6+=1}
  if([2,6,9].includes(p.lifePath)){s.T1+=2;s.T6+=2}if([4,8].includes(p.lifePath))s.T7+=2;
  if([1,3,5].includes(p.expression))s.T2+=2;if([2,6].includes(p.expression))s.T6+=1;
  if([2,6,9].includes(p.soulUrge)){s.T1+=1;s.T6+=1}
  // Moon and Venus influence on themes
  if(p.moonSign){if(WATER_SIGNS.has(p.moonSign)){s.T1+=2;s.T6+=2}else if(EARTH_SIGNS.has(p.moonSign)){s.T1+=1;s.T6+=1}}
  if(p.venusSign&&(WATER_SIGNS.has(p.venusSign)||EARTH_SIGNS.has(p.venusSign)))s.T6+=2;
  return Object.entries(s).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id])=>id);
}

export function getQuestions(themes: string[]): Question[] {
  const q: Question[]=[];
  themes.forEach(t=>{if(QUESTION_BANK[t])q.push(...QUESTION_BANK[t].map(qq=>({...qq,themeId:t})))});
  return q;
}
