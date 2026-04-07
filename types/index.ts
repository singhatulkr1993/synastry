export interface ZodiacSign {
  name: string;
  element: string;
  modality: string;
  start: [number, number];
  end: [number, number];
}

export interface SignArchetype {
  title: string;
  core: string;
  inRelationship: string;
  shadow: string;
}

export interface LifePathProfile {
  title: string;
  relStyle: string;
  tension: string;
}

export interface ElementDynamic {
  vibe: string;
  detail: string;
  strength: string;
  risk: string;
}

export interface Stage {
  id: string;
  label: string;
  desc: string;
}

export interface Emotion {
  id: string;
  label: string;
  icon: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
}

export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  themeId?: string;
}

export interface Person {
  name: string;
  dob: string;
  birthTime: string | null;
  birthTimeApprox: string | null;
  birthTimeType: "exact" | "approximate" | null;
}

export interface Profile {
  sign: ZodiacSign;
  lifePath: number;
  expression: number;
  soulUrge: number;
  destiny: number;
  moonSign: string | null;
  venusSign: string | null;
  isApproximate: boolean;
}

export type QuizAnswers = Record<string, number[]>;

export interface DimensionScore {
  name: string;
  key: string;
  score: number;
  rA: number;
  rB: number;
}

export interface Nudge {
  title: string;
  text: string;
}

export interface PostBreakupData {
  reflections: Array<{ title: string; text: string }>;
  questions: string[];
}

export interface PairTeaser {
  narrative: string;
  strength: string;
  friction: string;
}

export interface PairFull {
  opening: string;
  complements: string[];
  frictions: string[];
  watch: string;
  lpSection: string;
}

export interface DimTheme {
  label: string;
  text: string;
}

export interface ReportData {
  dims: DimensionScore[];
  avg: number;
  best: DimensionScore;
  worst: DimensionScore;
  soft: boolean;
  post: boolean;
  sNarr: DimTheme[];
  gNarr: DimTheme[];
  nudges: Nudge[];
  ctxs: DimTheme[][];
  pb: PostBreakupData | null;
  pairFull: PairFull;
}

export interface FreeReport {
  elDyn: ElementDynamic;
  lpA: LifePathProfile;
  lpB: LifePathProfile;
  archA: SignArchetype;
  archB: SignArchetype;
  score: number;
  pA: Profile;
  pB: Profile;
  pairTeaser: PairTeaser;
}
