import type {
  ZodiacSign,
  SignArchetype,
  LifePathProfile,
  ElementDynamic,
  Stage,
  Emotion,
  ThemeDefinition,
  Question,
} from "@/types";

export interface ExpressionProfile { title: string; style: string; }
export interface SoulUrgeProfile { title: string; desire: string; }
export interface LifePathPair { dynamic: string; strength: string; tension: string; tip: string; adjustment: number; }
export interface SignPairDynamic { vibe: string; detail: string; }

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", element: "Fire", modality: "Cardinal", start: [3,21], end: [4,19] },
  { name: "Taurus", element: "Earth", modality: "Fixed", start: [4,20], end: [5,20] },
  { name: "Gemini", element: "Air", modality: "Mutable", start: [5,21], end: [6,20] },
  { name: "Cancer", element: "Water", modality: "Cardinal", start: [6,21], end: [7,22] },
  { name: "Leo", element: "Fire", modality: "Fixed", start: [7,23], end: [8,22] },
  { name: "Virgo", element: "Earth", modality: "Mutable", start: [8,23], end: [9,22] },
  { name: "Libra", element: "Air", modality: "Cardinal", start: [9,23], end: [10,22] },
  { name: "Scorpio", element: "Water", modality: "Fixed", start: [10,23], end: [11,21] },
  { name: "Sagittarius", element: "Fire", modality: "Mutable", start: [11,22], end: [12,21] },
  { name: "Capricorn", element: "Earth", modality: "Cardinal", start: [12,22], end: [1,19] },
  { name: "Aquarius", element: "Air", modality: "Fixed", start: [1,20], end: [2,18] },
  { name: "Pisces", element: "Water", modality: "Mutable", start: [2,19], end: [3,20] },
];

export const SIGN_SYMBOLS: Record<string, string> = {
  Aries:"♈", Taurus:"♉", Gemini:"♊", Cancer:"♋", Leo:"♌", Virgo:"♍",
  Libra:"♎", Scorpio:"♏", Sagittarius:"♐", Capricorn:"♑", Aquarius:"♒", Pisces:"♓"
};

export const SIGN_ARCHETYPES: Record<string, SignArchetype> = {
  Aries: { title: "The Initiator", core: "driven by action, impatient with inertia, and fiercely independent", inRelationship: "brings energy and directness but may struggle with patience when things move slowly", shadow: "can mistake intensity for intimacy, and independence for emotional unavailability" },
  Taurus: { title: "The Anchor", core: "grounded in sensory experience, loyal to the bone, and resistant to change they haven't chosen", inRelationship: "offers steadiness and devotion but may dig in when pushed to shift", shadow: "can confuse comfort with connection, and stubbornness with strength" },
  Gemini: { title: "The Mirror", core: "intellectually restless, socially fluid, and constantly synthesizing new information", inRelationship: "keeps things alive with curiosity and conversation but may struggle with emotional depth under pressure", shadow: "can use wit as a shield and adaptability as avoidance" },
  Cancer: { title: "The Protector", core: "emotionally attuned, fiercely nurturing, and deeply shaped by a sense of home and belonging", inRelationship: "creates deep emotional safety but may withdraw behind walls when hurt", shadow: "can conflate caretaking with control, and vulnerability with weakness" },
  Leo: { title: "The Luminary", core: "warm-hearted, generous with attention, and driven by a need to be seen and valued", inRelationship: "brings warmth and loyalty but needs consistent appreciation to feel secure", shadow: "can mistake admiration for love, and performative gestures for genuine connection" },
  Virgo: { title: "The Analyst", core: "detail-oriented, quietly devoted, and constantly working to improve what they care about", inRelationship: "shows love through acts of service and attention to detail but may over-critique when anxious", shadow: "can express care as criticism, and self-improvement as self-doubt" },
  Libra: { title: "The Harmonizer", core: "attuned to balance, aesthetically driven, and deeply uncomfortable with unresolved conflict", inRelationship: "seeks fairness and beauty in partnership but may avoid hard truths to keep the peace", shadow: "can prioritize appearance of harmony over actual resolution" },
  Scorpio: { title: "The Depth-Seeker", core: "intensely private, emotionally perceptive, and drawn to what lies beneath the surface", inRelationship: "offers transformative depth and loyalty but guards trust with fierce selectivity", shadow: "can weaponize intimacy and mistake control for protection" },
  Sagittarius: { title: "The Explorer", core: "philosophically curious, freedom-loving, and energized by possibility over routine", inRelationship: "brings optimism and adventure but may resist commitment that feels like constraint", shadow: "can confuse restlessness with growth, and bluntness with honesty" },
  Capricorn: { title: "The Builder", core: "ambitious, pragmatic, and deeply invested in legacy and long-term results", inRelationship: "provides stability and structured devotion but may deprioritize emotional expression under pressure", shadow: "can equate productivity with worth, and emotional restraint with maturity" },
  Aquarius: { title: "The Visionary", core: "independently minded, community-oriented, and more comfortable with ideas than intimate emotions", inRelationship: "brings intellectual stimulation and progressive thinking but may create emotional distance without realizing it", shadow: "can intellectualize feelings to avoid experiencing them" },
  Pisces: { title: "The Empath", core: "boundlessly compassionate, intuitively perceptive, and deeply affected by emotional undercurrents", inRelationship: "offers profound emotional attunement but may absorb a partner's emotions at the cost of their own boundaries", shadow: "can lose themselves in another person and mistake merging for love" },
};

export const LIFE_PATH_PROFILES: Record<number, LifePathProfile> = {
  1: { title: "The Independent", relStyle: "values autonomy in partnership, leads naturally, may struggle to yield", tension: "can feel suffocated by too much closeness" },
  2: { title: "The Partner", relStyle: "thrives in collaboration, deeply sensitive to harmony, natural mediator", tension: "may over-accommodate and lose their own voice" },
  3: { title: "The Communicator", relStyle: "expressive, socially energized, brings lightness and creativity to relationships", tension: "may avoid depth by staying in the performative layer" },
  4: { title: "The Foundation", relStyle: "values structure and reliability, shows love through consistency and follow-through", tension: "can prioritize stability over emotional responsiveness" },
  5: { title: "The Free Spirit", relStyle: "needs variety and stimulation, resists routine, brings spontaneity", tension: "may conflate commitment with confinement" },
  6: { title: "The Nurturer", relStyle: "caretaking is their love language, deeply invested in family and home", tension: "can over-give and build resentment when it's not reciprocated" },
  7: { title: "The Seeker", relStyle: "introspective, values intellectual connection, needs significant alone time", tension: "can retreat into their inner world and leave a partner feeling shut out" },
  8: { title: "The Achiever", relStyle: "ambitious and protective, shows love through provision and action", tension: "may struggle to be vulnerable or prioritize emotional over material needs" },
  9: { title: "The Idealist", relStyle: "compassionate and big-picture oriented, drawn to meaningful connection", tension: "can be emotionally generous with the world but unavailable one-on-one" },
  11: { title: "The Intuitive", relStyle: "deeply perceptive and spiritually attuned, seeks transcendent connection", tension: "heightened sensitivity can create emotional volatility" },
  22: { title: "The Master Builder", relStyle: "visionary in partnership, thinks in terms of legacy and long-term impact", tension: "may place the mission above the relationship" },
};

export const ELEMENT_DYNAMICS: Record<string, ElementDynamic> = {
  "Fire-Fire": { vibe: "Passionate and high-energy", detail: "Two fire signs together create intensity — exciting when aligned, combustible when not. Neither tends to back down easily, and both crave being the initiator. The heat is real, but so is the potential for burnout.", strength: "Mutual respect for ambition and directness", risk: "Power struggles and emotional exhaustion from constant intensity" },
  "Fire-Air": { vibe: "Energizing and intellectually alive", detail: "Fire is fueled by Air — ideas turn into action, conversations spark plans. This tends to be a stimulating combination where both feel elevated. The risk is all momentum, no grounding.", strength: "Creative synergy and shared enthusiasm", risk: "May stay in the exciting idea phase without building emotional depth" },
  "Fire-Earth": { vibe: "Challenging but potentially balancing", detail: "Fire wants to move fast; Earth wants to build carefully. This can feel like friction — or like exactly the counterbalance each needs. It works when Fire respects Earth's pace, and Earth appreciates Fire's energy.", strength: "Complementary strengths if both value what the other brings", risk: "Fire feels slowed down, Earth feels destabilized" },
  "Fire-Water": { vibe: "Intense and emotionally complex", detail: "Steam — that's what happens when fire meets water. Deep emotional connection is possible, but the emotional languages are different. Fire expresses outward; Water processes inward. Both feel deeply, but in different directions.", strength: "Potential for profound emotional and physical connection", risk: "Misreading each other's emotional signals" },
  "Air-Air": { vibe: "Mentally stimulating, emotionally light", detail: "Two Air signs can talk forever — ideas, theories, plans, debates. The intellectual connection tends to be strong. The challenge is descending from the conceptual into the emotional.", strength: "Communication flows easily, mutual intellectual respect", risk: "Can live entirely in the head, avoiding emotional vulnerability" },
  "Air-Earth": { vibe: "Different wavelengths, mutual learning", detail: "Air thinks in possibilities; Earth thinks in practicalities. This can feel like speaking different languages — or like a productive partnership where ideas meet execution.", strength: "Air expands Earth's perspective; Earth grounds Air's ideas", risk: "Air feels constrained; Earth feels unmoored by constant change" },
  "Air-Water": { vibe: "Head meets heart", detail: "Air processes through thinking; Water through feeling. When this works, it creates a whole-person dynamic — rational and intuitive. When it doesn't, Air feels overwhelmed by emotion, and Water feels dismissed by logic.", strength: "Balances rational and emotional decision-making", risk: "Water feels unheard; Air feels emotionally pressured" },
  "Earth-Earth": { vibe: "Stable and deeply rooted", detail: "Two Earth signs build together — patiently, practically, with shared values around security. This is often the most enduring combination. The risk is calcification — too much stability becomes stagnation.", strength: "Shared values, mutual reliability, long-term orientation", risk: "Emotional unexpressiveness and resistance to growth" },
  "Earth-Water": { vibe: "Nurturing and complementary", detail: "Earth provides the container; Water fills it with emotional depth. This tends to be one of the most naturally harmonious combinations — grounded and emotionally rich.", strength: "Natural emotional safety with practical stability", risk: "Earth may dismiss Water's emotional needs as excessive" },
  "Water-Water": { vibe: "Deeply emotional and intuitive", detail: "Two Water signs create an ocean of feeling — empathic, intuitive, and profoundly connected. The depth is unmatched. The risk is drowning in shared emotion without anyone steering the ship.", strength: "Unparalleled emotional intimacy and understanding", risk: "Emotional codependency and difficulty with boundaries" },
};

export const STAGES: Stage[] = [
  { id:"screening",   label:"Considering Someone New", desc:"Getting a sense of this person" },
  { id:"early",       label:"Early Days",              desc:"Still finding your rhythm together" },
  { id:"ongoing",     label:"In This Together",        desc:"Building something that lasts" },
  { id:"premarriage", label:"Before Forever",          desc:"Making sure you're building on solid ground" },
  { id:"postbreakup", label:"Processing and Moving Forward", desc:"Making sense of what was, and what comes next" },
];

export const EMOTIONS: Emotion[] = [
  { id:"curious",   label:"Curious",        icon:"" },
  { id:"hopeful",   label:"Hopeful",        icon:"" },
  { id:"anxious",   label:"Unsettled",      icon:"" },
  { id:"uncertain", label:"Uncertain",      icon:"" },
  { id:"exploring", label:"Simply Curious", icon:"" },
];

export const LETTER_VALUES: Record<string, number> = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
export const VOWELS_SET = new Set(['A','E','I','O','U']);

export const THEMES: Record<string, ThemeDefinition> = {
  T1: { id:"T1", name:"Emotional Intensity" },
  T2: { id:"T2", name:"Communication Style" },
  T3: { id:"T3", name:"Independence vs. Attachment" },
  T4: { id:"T4", name:"Conflict Approach" },
  T5: { id:"T5", name:"Stability vs. Change" },
  T6: { id:"T6", name:"Vulnerability & Intimacy" },
  T7: { id:"T7", name:"Values & Life Priorities" },
};

export const TRAIT_LABELS: Record<string, Record<number, string>> = {
  T1: { 4:"emotionally expressive", 3:"emotionally balanced", 2:"internally processing", 1:"emotionally reserved" },
  T2: { 4:"direct communicator", 3:"diplomatic communicator", 2:"indirect communicator", 1:"communication-avoidant" },
  T3: { 4:"togetherness-oriented", 3:"balanced on closeness", 2:"independence-leaning", 1:"strongly independent" },
  T4: { 4:"confronts issues head-on", 3:"strategically raises concerns", 2:"tolerates and lets go", 1:"avoids or suppresses conflict" },
  T5: { 4:"change-embracing", 3:"adaptable", 2:"balance-seeking", 1:"stability-anchored" },
  T6: { 4:"openly vulnerable", 3:"gradually opens up", 2:"guarded", 1:"deeply guarded" },
  T7: { 4:"experience-driven", 3:"growth-oriented", 2:"purpose-driven", 1:"security-focused" },
};

export const QUESTION_BANK: Record<string, Question[]> = {
  T1: [
    { id:"Q1.1", text:"After a rough day, you're most likely to:", options:[
      {text:"Talk it out immediately with someone close", score:4},
      {text:"Need some alone time first, then open up", score:3},
      {text:"Journal or reflect privately — may not bring it up", score:2},
      {text:"Push through it and move on quickly", score:1},
    ]},
    { id:"Q1.2", text:"A close friend shares something painful. Your instinct:", options:[
      {text:"Feel it deeply — their pain genuinely affects my mood", score:4},
      {text:"Listen carefully and offer support, maintain my center", score:3},
      {text:"Jump to problem-solving — I want to help fix it", score:2},
      {text:"Acknowledge it but feel awkward — unsure what to say", score:1},
    ]},
    { id:"Q1.3", text:"In a relationship, feeling emotionally connected means:", options:[
      {text:"Regular deep conversations about feelings, dreams, fears", score:4},
      {text:"Knowing they're there when it matters, even without daily talks", score:3},
      {text:"Shared activities — connection through doing, not talking", score:2},
      {text:"Space to be independent, with emotional check-ins when needed", score:1},
    ]},
  ],
  T2: [
    { id:"Q2.1", text:"You need to tell a partner something they won't want to hear:", options:[
      {text:"Say it directly — honesty matters more than comfort", score:4},
      {text:"Find the right moment and frame it carefully", score:3},
      {text:"Hint at it and hope they pick up on it", score:2},
      {text:"Avoid it unless absolutely necessary", score:1},
    ]},
    { id:"Q2.2", text:"When making a decision together, you prefer to:", options:[
      {text:"Think out loud — talking helps me figure out what I think", score:4},
      {text:"Think first, then share a formed opinion", score:3},
      {text:"Ask what they think first, then respond", score:2},
      {text:"Research alone, then present my view", score:1},
    ]},
    { id:"Q2.3", text:"Your partner goes quiet during a disagreement. Your reaction:", options:[
      {text:"Press for a response — silence feels like avoidance", score:4},
      {text:"Give space but check in after some time", score:3},
      {text:"Match their silence — wait for them to come back", score:2},
      {text:"Assume it's fine and move on", score:1},
    ]},
  ],
  T3: [
    { id:"Q3.1", text:"Your ideal weekend with a partner:", options:[
      {text:"Doing everything together — that's the point", score:4},
      {text:"A mix — some shared time, some solo time", score:3},
      {text:"Mostly independent plans, shared meal or evening", score:2},
      {text:"Depends entirely on my mood that week", score:1},
    ]},
    { id:"Q3.2", text:"For a big personal decision (career, purchase), you:", options:[
      {text:"Discuss with partner first — their input is essential", score:4},
      {text:"Think it through, then share my leaning and hear their view", score:3},
      {text:"Make the decision, then let them know", score:2},
      {text:"Depends on whether it affects them directly", score:1},
    ]},
    { id:"Q3.3", text:"In the first months of dating, you prefer:", options:[
      {text:"Seeing each other frequently — momentum matters", score:4},
      {text:"A steady rhythm — 2-3 times a week feels right", score:3},
      {text:"Keeping it flexible — no set expectations", score:2},
      {text:"I usually let the other person set the pace", score:1},
    ]},
  ],
  T4: [
    { id:"Q4.1", text:"Something your partner did bothered you:", options:[
      {text:"Bring it up right away — better to address it", score:4},
      {text:"Wait for a calm moment, then raise it thoughtfully", score:3},
      {text:"Let it go unless it happens again", score:2},
      {text:"Note it internally but probably never mention it", score:1},
    ]},
    { id:"Q4.2", text:"When a disagreement escalates, you tend to:", options:[
      {text:"Stand my ground firmly — I need to be heard", score:4},
      {text:"Find middle ground quickly", score:3},
      {text:"Shut down or go quiet — I need to withdraw", score:2},
      {text:"Get emotional — tears, raised voice, high intensity", score:1},
    ]},
    { id:"Q4.3", text:"After a fight, who usually initiates making up?", options:[
      {text:"I do — I hate unresolved tension", score:4},
      {text:"We both come around naturally", score:3},
      {text:"I wait for them to come to me", score:2},
      {text:"Sometimes neither of us does for a while", score:1},
    ]},
  ],
  T5: [
    { id:"Q5.1", text:"Your ideal life has:", options:[
      {text:"A solid routine — I like knowing what to expect", score:1},
      {text:"A base routine with room for spontaneity", score:2},
      {text:"Constant variety — routine bores me", score:4},
      {text:"Whatever the current season of life demands", score:3},
    ]},
    { id:"Q5.2", text:"Partner suggests suddenly moving cities for an opportunity:", options:[
      {text:"Exciting — I'd start researching immediately", score:4},
      {text:"Interesting — let's talk through pros and cons", score:3},
      {text:"Anxious — that's a big disruption", score:1},
      {text:"Depends entirely on the specifics", score:2},
    ]},
    { id:"Q5.3", text:"A relationship that stays mostly the same over years is:", options:[
      {text:"Comfortable and stable — that's good", score:1},
      {text:"Fine, but needs occasional reinvention", score:2},
      {text:"Stagnant — growth and change keep it alive", score:4},
      {text:"I haven't thought about this much", score:3},
    ]},
  ],
  T6: [
    { id:"Q6.1", text:"How quickly do you open up emotionally in a new relationship?", options:[
      {text:"Quickly — if I like someone, I'm an open book", score:4},
      {text:"Gradually — I share more as trust builds", score:3},
      {text:"Slowly — I keep my guard up until I'm sure", score:2},
      {text:"Not sure I fully open up even in long relationships", score:1},
    ]},
    { id:"Q6.2", text:"When struggling, asking your partner for help feels:", options:[
      {text:"Natural — that's what partners are for", score:4},
      {text:"Fine, but I usually try to handle it myself first", score:3},
      {text:"Uncomfortable — I don't like feeling like a burden", score:2},
      {text:"Almost impossible — I'd rather figure it alone", score:1},
    ]},
    { id:"Q6.3", text:"In terms of physical affection (holding hands, cuddling):", options:[
      {text:"Love it — physical closeness is how I feel connected", score:4},
      {text:"Enjoy it but don't need it constantly", score:3},
      {text:"Selective — only in private or specific moods", score:2},
      {text:"Not very physically affectionate naturally", score:1},
    ]},
  ],
  T7: [
    { id:"Q7.1", text:"Rank what matters most in the next 5 years:", options:[
      {text:"Financial security and stability", score:1},
      {text:"Personal growth and new experiences", score:3},
      {text:"Deep relationships and family", score:4},
      {text:"Career achievement and recognition", score:2},
    ]},
    { id:"Q7.2", text:"Your ideal lifestyle with a partner:", options:[
      {text:"Settled home, consistent routines, building wealth", score:1},
      {text:"Travel, exploration, flexibility — experiences over assets", score:4},
      {text:"A balance — stable base with regular adventures", score:3},
      {text:"Focused on shared mission — career, cause, creative work", score:2},
    ]},
    { id:"Q7.3", text:"When it comes to money, you and a partner should:", options:[
      {text:"Save and invest — security first", score:1},
      {text:"Enjoy it — life is short, spend on experiences", score:4},
      {text:"Separate finances, minimal joint obligations", score:2},
      {text:"Align on a shared budget and goals", score:3},
    ]},
  ],
};

// ─── Expression & Soul Urge profiles ─────────────────────────
export const EXPRESSION_PROFILES: Record<number, ExpressionProfile> = {
  1:  { title: "The Pioneer",    style: "communicates with authority and directness, often leading the conversation" },
  2:  { title: "The Diplomat",   style: "listens carefully and speaks with sensitivity — a natural mediator in any room" },
  3:  { title: "The Storyteller",style: "expressive, warm, and naturally engaging — brings energy and lightness to conversation" },
  4:  { title: "The Pragmatist", style: "precise and structured, favoring clarity and facts over emotional framing" },
  5:  { title: "The Persuader",  style: "versatile and adaptable, able to shift register and style quickly in conversation" },
  6:  { title: "The Counsellor", style: "warm and supportive, often the emotional anchor — people share things with them easily" },
  7:  { title: "The Analyst",    style: "thoughtful and considered, preferring depth and precision over volume" },
  8:  { title: "The Executive",  style: "confident and authoritative, speaks to influence, move decisions, and achieve results" },
  9:  { title: "The Philosopher",style: "broad-minded and idealistic, drawn to meaning and big-picture thinking over small detail" },
  11: { title: "The Visionary",  style: "inspired and inspiring — speaks from intuition, often ahead of the room" },
  22: { title: "The Architect",  style: "systematic and expansive, communicates with strategic intent and long-term framing" },
};

export const SOUL_URGE_PROFILES: Record<number, SoulUrgeProfile> = {
  1:  { title: "Independence",       desire: "a deep craving to lead, initiate, and feel genuinely autonomous — being directed or overlooked is particularly painful" },
  2:  { title: "Connection",         desire: "a deep need for harmony and partnership — needs to feel genuinely valued, included, and heard to feel secure" },
  3:  { title: "Expression",         desire: "a deep desire for joy, creativity, and authentic self-expression — feeling unseen or uncelebrated is a real wound" },
  4:  { title: "Security",           desire: "a deep craving for stability, order, and solid ground — unpredictability and chaos are genuinely draining" },
  5:  { title: "Freedom",            desire: "a deep restlessness that seeks variety and new experience — commitment that feels like confinement is the core tension" },
  6:  { title: "Harmony & Devotion", desire: "a deep craving to be needed and to nurture — love expressed through care, responsibility, and creating safety for others" },
  7:  { title: "Truth",              desire: "a deep inner drive to understand, analyse, and find meaning — needs significant solitude and intellectual respect to feel fulfilled" },
  8:  { title: "Mastery",            desire: "a deep drive to achieve, build, and be recognised for competence — feeling powerless or underestimated is the core wound" },
  9:  { title: "Purpose",            desire: "a deep need to contribute to something larger — can give generously to the world while being emotionally absent one-on-one" },
  11: { title: "Illumination",       desire: "a soul-level desire to inspire, elevate, and connect — craves transcendence and spiritual depth in relationships" },
  22: { title: "Legacy",             desire: "a deep drive to build something that outlasts them — personal relationships can feel secondary to the mission unless consciously tended" },
};

// ─── Life Path pair dynamics ──────────────────────────────────
export const LIFE_PATH_PAIRS: Record<string, LifePathPair> = {
  "1-2":  { dynamic: "Leader meets partner — natural complementarity when each plays to their strength", strength: "1 provides direction and initiative; 2 provides emotional intelligence and steadiness — together they cover each other's gaps", tension: "1 can override 2's need to be consulted; 2 can accommodate past their own needs and build quiet resentment", tip: "1 should slow down to genuinely ask, not inform; 2 should voice preferences before they become grievances", adjustment: 0.5 },
  "2-6":  { dynamic: "Two nurturers — deep emotional attunement with a real risk of co-dependency", strength: "profound mutual care and a natural shared language of support and service", tension: "both prioritise the other's needs over their own — needs accumulate unvoiced until someone burns out", tip: "build the habit of asking 'what do you actually need today?' — not assuming you already know", adjustment: 0.5 },
  "3-6":  { dynamic: "Creative meets caretaker — warm, expressive, and generative together", strength: "3 brings lightness and spontaneity; 6 brings depth and care — a naturally warm and vibrant combination", tension: "3's social energy can feel draining to 6's more contained nurturing orientation", tip: "6 names when they need quality time over quantity of activity; 3 honours it without taking it personally", adjustment: 0.5 },
  "4-8":  { dynamic: "Builder meets achiever — a shared orientation toward legacy and structure", strength: "both are long-term thinkers who build deliberately — rare alignment around how a life gets constructed", tension: "two strong-willed doers can compete for control over shared plans and decisions", tip: "explicitly divide domains — clarity about who leads what prevents most of the overlap friction", adjustment: 0.5 },
  "5-7":  { dynamic: "Freedom seeker meets depth seeker — intellectual and experiential connection", strength: "both value independence and resist routine in their own ways — respect for each other's space comes naturally", tension: "5 seeks external stimulation; 7 seeks internal understanding — can feel like parallel tracks that don't intersect", tip: "build shared rituals that honour both: explore something new together (5) then reflect on what it meant (7)", adjustment: 0.5 },
  "6-9":  { dynamic: "Nurturer meets idealist — compassionate and values-aligned", strength: "both are oriented toward giving, service, and something larger than themselves — natural shared values", tension: "9's big-picture focus can feel impersonal to 6's one-to-one caregiving orientation", tip: "6 appreciates 9's vision; 9 stays present and available rather than perpetually mission-oriented", adjustment: 0.5 },
  "1-5":  { dynamic: "Two independents — exciting and energising, though neither yields easily", strength: "mutual respect for autonomy and a shared resistance to being controlled — real freedom in the pairing", tension: "neither naturally compromises — both assume their direction is the right one", tip: "build explicit negotiation habits early, before patterns harden — flexibility is a skill, not a personality trait", adjustment: 0.5 },
  "4-5":  { dynamic: "Structure meets freedom — a persistent lifestyle tension", strength: "4 provides the base; 5 provides the aliveness — can genuinely balance each other when the tension is named", tension: "4's need for predictability and 5's need for variety pull in opposite directions on almost every practical decision", tip: "negotiate non-negotiables clearly — 4 names their structure needs, 5 names their flexibility needs, then build the overlap", adjustment: -0.5 },
  "1-8":  { dynamic: "Two dominants — strong-willed and ambitious, with real power-struggle risk", strength: "mutual respect for drive, competence, and directness — neither is intimidated by the other's confidence", tension: "two people who both expect to lead and be heard will clash when decisions need to be made jointly", tip: "agree explicitly on a decision-making protocol rather than assuming — the friction is structural, not personal", adjustment: -0.5 },
  "2-5":  { dynamic: "Attachment meets freedom — a classic pursuer-withdrawer dynamic", strength: "5's independence can feel liberating rather than abandoning to 2 when trust is established", tension: "2's need for closeness and 5's need for space are fundamentally in tension — one pulls in as the other pulls back", tip: "5 gives explicit reassurance that space is temporary; 2 practices trusting that space isn't rejection", adjustment: -0.5 },
  "3-4":  { dynamic: "Spontaneity meets structure — communication and planning friction", strength: "3 keeps the relationship alive and energised; 4 keeps it grounded and functional", tension: "3's improvisational energy and 4's need for order and planning collide regularly in practical decisions", tip: "plan together, then leave room for 3 to add life inside the plan — structure as a container, not a constraint", adjustment: -0.5 },
  "2-8":  { dynamic: "People-pleaser meets provider — a risk of imbalanced dynamic over time", strength: "8 provides direction and security; 2 provides emotional warmth and harmony — complementary on the surface", tension: "8's directive nature meets 2's tendency to accommodate — 2 can shrink, 8 can become the de facto authority", tip: "2 practices advocating for their own preferences rather than adapting; 8 actively invites rather than deciding", adjustment: -0.5 },
};

// ─── Same-element sign-pair dynamics ─────────────────────────
export const SIGN_PAIR_DYNAMICS: Record<string, SignPairDynamic> = {
  // Fire + Fire
  "Aries-Leo":          { vibe: "Natural magnetism and mutual admiration", detail: "Aries and Leo spark each other — there's real chemistry here, and both bring confidence and warmth to the dynamic. The tension is that both want to lead and both need to feel seen. This works beautifully when each has their own domain to shine in; it creates friction when both need the spotlight at the same time." },
  "Aries-Sagittarius":  { vibe: "High energy and shared love of adventure", detail: "Aries and Sagittarius are both propelled forward — by impulse and by vision respectively. The pairing is energising and rarely dull. The risk is that neither naturally wants to slow down enough to build something lasting. Depth requires deliberate effort from both." },
  "Leo-Sagittarius":    { vibe: "Warmth, generosity, and shared optimism", detail: "Leo and Sagittarius are both generous and warm-hearted, drawn to the big and the exciting. The pairing tends to be joyful and expansive. The tension: Leo needs devoted, consistent attention to feel secure, and free-spirited Sagittarius doesn't naturally give it — not from lack of care, but from a different orientation toward freedom." },
  // Earth + Earth
  "Taurus-Virgo":       { vibe: "Deeply practical and mutually reliable", detail: "Taurus and Virgo both value quality, consistency, and building something real. The connection tends to be stable and quietly devoted. The main friction: Virgo's tendency to over-analyse and point out what could be better can feel like criticism to Taurus, who needs their efforts to be received with appreciation, not improvement notes." },
  "Taurus-Capricorn":   { vibe: "One of the most naturally stable pairings", detail: "Taurus and Capricorn share a deep orientation toward security, building, and the long view. The connection is often slow to start and deeply loyal once established. The risk sits on the emotional side — both signs tend toward reserve, which means important feelings can go unspoken for too long." },
  "Virgo-Capricorn":    { vibe: "Ambitious, detail-oriented, and highly functional", detail: "Virgo and Capricorn are both built for quality and results. Together they're a highly productive pairing — goals get set, plans get executed, and neither is careless with commitments. The deliberate effort needed here is toward emotional connection over productivity: the relationship needs to be a place of rest, not just a place of achievement." },
  // Air + Air
  "Gemini-Libra":       { vibe: "Intellectually alive and socially fluid", detail: "Gemini and Libra can talk forever — ideas, aesthetics, people, plans. The intellectual connection tends to be strong and mutually stimulating. The shared challenge is decisiveness: neither naturally pushes through ambiguity toward a clear decision, which can leave things unresolved longer than needed." },
  "Gemini-Aquarius":    { vibe: "Curious, progressive, and intellectually stimulating", detail: "Gemini and Aquarius are both drawn to ideas, novelty, and the unconventional. The pairing tends to be mentally exciting and rarely predictable. Emotional depth requires deliberate attention from both — left to default, the relationship can live entirely in the conceptual without ever descending into genuine vulnerability." },
  "Libra-Aquarius":     { vibe: "Idealistic, fair-minded, and values-driven", detail: "Libra and Aquarius both care deeply about fairness, beauty, and a better world — just differently. Libra seeks personal harmony and aesthetic balance; Aquarius seeks systemic truth and collective progress. These sometimes conflict: Libra wants peace between the two of you; Aquarius wants to be right about the principle, even if it disrupts the peace." },
  // Water + Water
  "Cancer-Scorpio":     { vibe: "Profound emotional depth and fierce mutual loyalty", detail: "Cancer and Scorpio understand each other at a level that can feel almost psychic. Both guard trust carefully, both feel things intensely, and both are deeply loyal once committed. The intensity that makes this pairing profound is also what makes it volatile — when trust is broken here, the wound runs deep and neither forgets easily." },
  "Cancer-Pisces":      { vibe: "Naturally tender and deeply empathic", detail: "Cancer and Pisces create an ocean of feeling between them — nurturing, intuitive, and profoundly kind. The connection can feel effortless in its emotional attunement. The risk is codependency: both are so naturally attuned to each other's emotional state that the boundaries between 'my feeling' and 'your feeling' can dissolve, leaving neither person fully anchored." },
  "Scorpio-Pisces":     { vibe: "Intuitive, deeply connected, almost telepathic", detail: "Scorpio and Pisces operate in depths that most other pairings don't reach. The attunement is almost wordless — at its best, almost psychic. The challenge is that the same dissolution of boundaries that feels beautiful can also feel destabilising. Both need to maintain a sense of individual self within the intensity of the connection." },
};

// ─── Notable cross-element sign pairs (opposite signs etc) ────
export const NOTABLE_CROSS_SIGN_PAIRS: Record<string, string> = {
  "Aries-Libra":      "Opposite signs — the classic attraction of opposites. Aries acts; Libra deliberates. Aries is direct; Libra is diplomatic. At their best, each provides what the other lacks. At their most polarised, Aries finds Libra evasive and Libra finds Aries exhausting.",
  "Taurus-Scorpio":   "Opposite signs — deeply magnetic. Both Fixed, both intensely loyal, and both deeply stubborn. When aligned, almost unshakeable. When in conflict, capable of holding their positions indefinitely — which is the main risk.",
  "Gemini-Sagittarius":"Opposite signs — both love ideas and freedom but express it differently. Gemini explores the details, the data, the different angles. Sagittarius seeks the big picture, the meaning, the adventure. Together: a restless, intellectually alive pairing.",
  "Cancer-Capricorn": "Opposite signs — home meets ambition. Cancer needs emotional safety; Capricorn builds practical stability. Deep complementarity when both value what the other brings. The risk: Capricorn deprioritises emotional needs in favour of external achievement.",
  "Leo-Aquarius":     "Opposite signs — the individual meets the collective. Leo wants personal devotion and recognition; Aquarius wants to contribute to something larger than any one person. Both Fixed, both strong-willed. The central tension: Leo needs to feel like the priority; Aquarius resists making anyone the sole priority.",
  "Virgo-Pisces":     "Opposite signs — analysis meets intuition. Virgo grounds Pisces in reality; Pisces softens Virgo's tendency toward criticism and perfectionism. One of the most naturally complementary opposite pairings when both appreciate what the other brings.",
};

// Helper: get sign-specific pair detail or null
export function getSignPairDetail(signA: string, signB: string): SignPairDynamic | string | null {
  const key = [signA, signB].sort().join("-");
  if (SIGN_PAIR_DYNAMICS[key]) return SIGN_PAIR_DYNAMICS[key];
  if (NOTABLE_CROSS_SIGN_PAIRS[key]) return NOTABLE_CROSS_SIGN_PAIRS[key];
  return null;
}

// Helper: get Life Path pair
export function getLpPair(lpA: number, lpB: number): LifePathPair | null {
  const key = [lpA, lpB].sort().join("-");
  return LIFE_PATH_PAIRS[key] ?? null;
}

// Approximate birth time map
export const APPROX_TIME_MAP: Record<string, string> = {
  "Early Morning": "05:00",
  "Morning": "09:00",
  "Afternoon": "14:00",
  "Evening": "19:00",
  "Night": "23:00",
};

// ─── Expression Number outward profiles ───────────────────────
export interface ExpressionNumberProfile { external: string; inConversation: string; }

export const EXPRESSION_NUMBER_PROFILES: Record<number, ExpressionNumberProfile> = {
  1:  { external: "They lead naturally in conversation — first to frame a problem, first to suggest a direction. Others often defer to their confidence even when they'd prefer not to.", inConversation: "In conversation, they tend to lead — framing the problem, suggesting the direction, and moving things forward." },
  2:  { external: "Warm and attuned in how they engage — they notice what people don't say and tend to respond to the feeling beneath the words. People leave conversations with them feeling genuinely heard.", inConversation: "In conversation, they tune into what's not being said — responding to the feeling beneath the words more than the words themselves." },
  3:  { external: "Expressive and socially magnetic — they can hold a room without trying, and their warmth draws people in. The performance of connection can occasionally substitute for the real thing, but the warmth itself is genuine.", inConversation: "In shared spaces, they tend to draw people in — warm, expressive, and easy to be around without seeming to try." },
  4:  { external: "Precise and direct in communication — they prefer clarity over nuance and facts over impressions. Small talk feels like wasted time, but when precision matters, they're reliable and exacting.", inConversation: "How they come across: direct and precise — they prefer facts over impressions and clarity over nuance." },
  5:  { external: "Versatile and quick-shifting in how they engage — they can match almost any register, which reads as charm but can sometimes feel hard to pin down.", inConversation: "How they come across: fluid and quick-shifting — they can match almost any register, which reads as charm but can feel hard to pin down." },
  6:  { external: "Warm, supportive, and quietly stabilising in social dynamics — people open up to them easily. The flip side is that they tend to absorb others' emotional weight without always noticing the cost.", inConversation: "In conversation, they tend to stabilise — people open up to them easily and often share more than they intended." },
  7:  { external: "Thoughtful and selective in how they engage — they don't speak to fill space, and when they do, what they say tends to carry weight. They're harder to read than most people realise.", inConversation: "In conversation, they're selective — they don't speak to fill space, and when they do, it tends to carry weight." },
  8:  { external: "Confident and outcome-focused in communication — they move conversations toward decisions and results. Small talk is tolerated, not enjoyed. They can read as authoritative or as abrupt depending on the relationship.", inConversation: "How they come across: confident and outcome-focused — they move conversations toward decisions and don't linger in small talk." },
  9:  { external: "Broad, idealistic, and generous in how they engage — they speak in meaning and values rather than tactics. People sense the sincerity and tend to find it either inspiring or slightly impractical.", inConversation: "In conversation, they tend to speak in meaning and values rather than tactics — which people find either inspiring or slightly impractical." },
  11: { external: "Perceptive and charged in how they communicate — they often say the thing that names what everyone else was feeling but couldn't articulate. This is a gift that can feel overwhelming to be on the receiving end of.", inConversation: "In conversation, they tend to name what no one else has said yet — often articulating what others were feeling but couldn't put into words." },
  22: { external: "Strategic and expansive in how they frame things — they think in systems and structures, and their communication reflects that. They can make almost anything sound like part of a larger plan.", inConversation: "How they come across: strategic and expansive — they frame things in systems and structures, and can make almost anything sound like part of a larger plan." },
};

// ─── Life Path pair dynamics (comprehensive) ──────────────────
export interface LPPairDynamic {
  dynamic: string;
  detail: string;
  strength: string;
  watchFor: string;
  takeaway: string;
}

export const LIFE_PATH_PAIR_DYNAMICS: Record<string, LPPairDynamic> = {
  "1-1": {
    dynamic: "Two independent forces building in parallel",
    detail: "Two Life Path 1s bring fierce autonomy and natural leadership to the pairing. Both want to lead, initiate, and have their direction respected — which creates a structural tension when those directions diverge. This works when each has a clear domain of their own; it stalls when both are pushing in different directions with no mechanism to resolve it.",
    strength: "Mutual respect for ambition and confidence — neither is intimidated by the other's drive.",
    watchFor: "Power struggles when there's only one clear path forward and both expect to choose it.",
    takeaway: "Divide domains explicitly and early — who leads on what. Once you have that structure, the respect between two 1s is some of the most genuine you'll find. Without it, the friction is structural and will keep recurring.",
  },
  "1-2": {
    dynamic: "Independent force meets collaborative heart",
    detail: "Life Path 1 brings direction, initiative, and a tendency to move forward without checking in. Life Path 2 brings emotional intelligence, a need for genuine consultation, and deep sensitivity to being bypassed. This can be a complementary dynamic — or a source of quiet resentment if 1 consistently decides and 2 consistently accommodates without naming what they've given up.",
    strength: "Complementary instincts — 1 provides momentum, 2 provides emotional attunement and steadiness.",
    watchFor: "2 shrinking to maintain the peace, building resentment that surfaces much later and confuses 1.",
    takeaway: "Life Path 1 should practice asking before informing — not to abdicate leadership, but because 2 needs to feel genuinely consulted, not updated. Life Path 2 should voice preferences as they form, not after they've calcified into grievances.",
  },
  "1-3": {
    dynamic: "Pioneer meets storyteller — energising but scattered",
    detail: "Life Path 1 wants to build and execute; Life Path 3 wants to explore, express, and keep things alive. Both are naturally confident and bring energy to any dynamic. The challenge is that 3's improvisational quality and 1's need for direction and follow-through can pull in different practical directions — plans get started but not always finished.",
    strength: "High energy and a genuine mutual appreciation for confidence and self-expression — neither needs to dim their presence for the other.",
    watchFor: "The direction-driven partner can grow impatient with the expressive one's tendency to circle; the expressive one can feel controlled by the pressure to close and decide.",
    takeaway: "When the drive to close and decide meets the need to keep exploring, the tension is usually about timing rather than direction — both often want the same outcome. Try naming this explicitly: agree on when a decision needs to land, so the space before it can stay genuinely open and productive for both.",
  },
  "1-4": {
    dynamic: "Initiative meets structure — powerful when aligned",
    detail: "Life Path 1 moves fast and trusts instincts; Life Path 4 builds carefully and trusts process. When they agree on direction, they're formidable. When they disagree on how to get there, neither yields easily. Both have strong opinions about how things should be done — just very different opinions.",
    strength: "Combined ambition and structural thinking — when aligned, a high-functioning and results-oriented pairing.",
    watchFor: "1 overriding 4's careful process; 4 slowing 1 down past their tolerance threshold.",
    takeaway: "Agree explicitly on who sets the pace and how decisions get made before starting any joint project. 1's instinct-led momentum and 4's process-driven approach can coexist — but only inside a shared framework both actually agreed to.",
  },
  "1-5": {
    dynamic: "Two independents — exciting, neither yields easily",
    detail: "Both Life Path 1 and Life Path 5 are oriented toward freedom and initiative in their own ways. 1 leads through willpower; 5 leads through momentum and variety. Neither naturally defers, and neither finds compromise intuitive. The attraction is real — both feel the other's energy — but the structural challenge of two non-yielding people is equally real.",
    strength: "Mutual respect for autonomy — neither is clingy or controlling in the conventional sense.",
    watchFor: "An implicit standoff whenever the relationship requires genuine compromise.",
    takeaway: "Establish a negotiation practice before patterns harden — not because either of you is difficult, but because two people who both instinctively move forward on their own terms need an explicit mechanism to coordinate. Decide who yields on which kinds of decisions, and rotate.",
  },
  "1-6": {
    dynamic: "Drive meets devotion — needs balance of power",
    detail: "Life Path 1 is oriented toward independence and forward momentum; Life Path 6 is oriented toward care, home, and being needed. There's a surface complementarity here, but the long-term risk is imbalance — 1 can consume the attention and direction of the pairing while 6 gives and holds. This only works sustainably if 1 actively makes space for 6's needs and perspective.",
    strength: "1 provides direction and vision; 6 provides warmth, stability, and genuine investment in the relationship's health.",
    watchFor: "An unspoken hierarchy forming where 1's priorities consistently dominate.",
    takeaway: "Life Path 1 should regularly ask what 6 needs — not what 6 needs to give, but what 6 actually needs from the pairing. Life Path 6 should practice naming their own needs before they transform into quiet sacrifice.",
  },
  "1-7": {
    dynamic: "Action meets reflection — different rhythms, genuine complement",
    detail: "Life Path 1 moves forward; Life Path 7 moves inward. 1 trusts action and momentum; 7 trusts analysis and understanding. 1 may feel 7 is overthinking things that simply need to be done; 7 may feel 1 is acting before understanding. The respect is usually genuine — but the rhythms are genuinely different and both require accommodation.",
    strength: "1 gets 7 out of their head and into action; 7 slows 1 down enough to understand what they're actually doing.",
    watchFor: "1 misreading 7's depth as avoidance; 7 experiencing 1's pace as pressure.",
    takeaway: "Build a practice of 'act and reflect' rather than choosing between them. Life Path 1 sets the tempo; Life Path 7 supplies the analysis. Used as a sequence rather than a contest, they're more productive together than either is alone.",
  },
  "1-8": {
    dynamic: "Two dominants — strong-willed and ambitious, power-struggle risk",
    detail: "Both Life Path 1 and Life Path 8 are wired to lead, decide, and be respected for their competence. Neither is intimidated by the other — part of the attraction — but it also means neither yields naturally. The dynamic will produce genuine power struggles when there's only one preferred outcome and both believe they know best how to reach it.",
    strength: "Mutual respect for drive, ambition, and directness — no one is holding back or pretending.",
    watchFor: "Competitiveness bleeding from external contexts into the relationship itself.",
    takeaway: "Agree on a decision-making protocol early: who has the final word on what categories of decision, and how disagreements escalate. This isn't bureaucracy — it's architecture. Without it, the friction is structural and will keep recurring.",
  },
  "1-9": {
    dynamic: "Pioneer meets idealist — personal scale versus larger meaning",
    detail: "Life Path 1 operates at a personal scale — my direction, my goals, my path. Life Path 9 operates at a larger scale — what does this mean, what's the contribution, what matters. These aren't incompatible, but they produce a constant low-level tension: 1 finds 9 abstractly oriented, 9 finds 1 narrowly focused. Both observations are fair.",
    strength: "1's focus and initiative can give 9's idealism practical traction.",
    watchFor: "9 finding 1 too self-focused; 1 finding 9's big-picture orientation impossible to ground.",
    takeaway: "Ask each other regularly what you're actually building — and whether it connects to something the other person cares about. Not every project needs to serve both orientations, but the pairing thrives when each person occasionally sees their work through the other's lens.",
  },
  "1-11": {
    dynamic: "Leadership meets intuition — powerful and demanding",
    detail: "Life Path 1 trusts instinct and action; Life Path 11 trusts intuition and perception. Both are strong-willed, but they operate on different planes. 1's directness can feel blunt to 11's perceptive sensitivity; 11's emotional depth can feel like distraction to 1's forward focus. The intensity is high in both directions.",
    strength: "1 provides grounding and action; 11 provides depth and vision — complementary when respected.",
    watchFor: "1 steamrolling 11's sensitivity; 11 becoming emotionally overwhelmed by 1's pace.",
    takeaway: "Life Path 1 should slow down to hear what 11 is actually saying — not just the words, but the perception underneath. Life Path 11 should learn to make insights concrete enough for 1 to act on. The gap between them is bridgeable.",
  },
  "1-22": {
    dynamic: "Pioneer meets master builder — ambition seeking primacy",
    detail: "Both Life Path 1 and Life Path 22 operate at the ambitious end of the spectrum. 1 drives forward through will; 22 builds through systems and vision. The combination can be remarkable — or a constant negotiation over whose vision structures the shared life.",
    strength: "Combined ambition and structural capacity — genuinely capable of building something significant together.",
    watchFor: "Two strong visions competing for primacy in the shared space.",
    takeaway: "Map whose vision leads in which areas of your life. Both orientations are legitimate; the pairing needs explicit structure to prevent them from colliding. Be clear about who owns what — then execute together.",
  },
  "2-2": {
    dynamic: "Two partners — deep attunement, possible paralysis",
    detail: "Two Life Path 2s create a relationship of extraordinary emotional attunement and mutual consideration. Both prioritise the other's feelings; both are sensitive to harmony; both are excellent at reading the room. The risk is that no one leads — decisions stall, needs go unvoiced because both are too focused on not burdening the other.",
    strength: "Profound emotional attunement and a natural capacity for genuine partnership.",
    watchFor: "Decisions stalling because both are deferring, and needs going unaddressed because neither wants to impose.",
    takeaway: "Build a structure for decision-making where someone actually has to choose. Take turns. Even when neither of you wants to be the one to decide, the relationship functions better when choices get made. Your attunement is a gift — make sure it doesn't become paralysis.",
  },
  "2-3": {
    dynamic: "Partner meets communicator — warmth and expressiveness",
    detail: "Life Path 2 brings sensitivity, attunement, and a deep need for genuine partnership. Life Path 3 brings expressiveness, lightness, and social energy. Together they tend to be warm and communicative. The tension is that 3's social world is expansive and 2 may find themselves accommodating it at the cost of their own more intimate connection needs.",
    strength: "Natural warmth and a shared orientation toward relationship — both value connection.",
    watchFor: "2 quietly retreating as 3's social energy expands to fill available space.",
    takeaway: "Life Path 3 should check in specifically about 2's need for one-on-one time, not assume shared activity counts. Life Path 2 should name when they need quieter, more intimate time — 3 genuinely doesn't always register the difference until it's pointed out.",
  },
  "2-4": {
    dynamic: "Emotional depth meets structural reliability",
    detail: "Life Path 2 orients toward emotional connection and partnership; Life Path 4 orients toward structure, reliability, and careful execution. On paper this can look complementary — and it often is. The gap appears in emotional expression: 4 shows care through what they do, not what they say, and 2 needs to hear it as well as see it.",
    strength: "2 provides emotional warmth; 4 provides reliability and follow-through — a quietly functional pairing.",
    watchFor: "2 feeling emotionally under-served; 4 confused about why acts of service aren't being received as love.",
    takeaway: "Life Path 4 should practice verbal expression alongside their natural mode of action — 'I thought about you' out loud matters to 2, even when 4 thinks the actions already said it. Life Path 2 should translate emotional needs into concrete, specific requests rather than expecting 4 to intuit them.",
  },
  "2-5": {
    dynamic: "Attachment meets freedom — a classic pursuer-withdrawer dynamic",
    detail: "Life Path 2 needs closeness, consistency, and a felt sense of partnership. Life Path 5 needs space, variety, and freedom from anything that feels like confinement. This is one of the highest-tension LP combinations precisely because each person's core need is what the other finds most difficult to provide. It can work with deliberate architecture — not naturally.",
    strength: "5's freedom can feel enlivening rather than destabilising to 2 when a secure base exists; 2's attunement can feel grounding rather than constraining to 5.",
    watchFor: "The classic pursuer-withdrawer spiral — 2 pulls in, 5 backs away, 2 pulls harder, 5 backs further.",
    takeaway: "Life Path 5 must give explicit, specific reassurance that absence is temporary and not withdrawal of care — this is non-negotiable for 2. Life Path 2 must practice tolerating space without interpreting it as rejection. Both of these are skills that require deliberate practice, not personality changes.",
  },
  "2-6": {
    dynamic: "Two nurturers — profound care, co-dependency risk",
    detail: "Both Life Path 2 and Life Path 6 are oriented toward others — toward care, service, and making the people they love feel held. The connection tends to be warm, devoted, and deeply attentive. The risk is that both over-give until they're running on empty, and neither naturally names it because naming a need feels like burdening the other.",
    strength: "Profound mutual care and a naturally shared language of devotion.",
    watchFor: "Accumulated sacrifice on both sides that eventually produces resentment neither person expected.",
    takeaway: "Build a regular check-in practice where both people explicitly name what they need — not what they're willing to give, but what they actually need to receive. The instinct to prioritise the other is beautiful; it needs a counterweight of self-expression to stay sustainable.",
  },
  "2-7": {
    dynamic: "Partner meets seeker — intimacy and solitude in tension",
    detail: "Life Path 2 seeks closeness and ongoing partnership; Life Path 7 seeks truth, depth, and significant amounts of solitude. 7 genuinely needs to withdraw — it's not rejection, it's restoration. But to 2, who reads absence as signal, 7's periodic retreats can feel like abandonment. This misread, more than anything else, defines the pairing's tension.",
    strength: "7's depth and 2's attunement can create a profoundly perceptive pairing when the trust is secure.",
    watchFor: "2 interpreting 7's need for space as emotional withdrawal; 7 feeling suffocated by 2's need for presence.",
    takeaway: "Life Path 7 should actively narrate their withdrawal — 'I need time to think, I'll be back' — so 2 isn't left reading silence. Life Path 2 should practice trusting the return, not just the current distance. The predictability of reconnection is what makes the space safe.",
  },
  "2-8": {
    dynamic: "Emotional warmth meets directive strength — power imbalance risk",
    detail: "Life Path 2 is sensitive, accommodating, and oriented toward partnership. Life Path 8 is directive, results-oriented, and accustomed to having their approach be the default. The surface dynamic can look complementary. The risk is a power imbalance that builds slowly: 8 decides, 2 adapts, until 2 has adapted so far they've lost their own voice.",
    strength: "8's direction and provision paired with 2's emotional attunement creates a stable and functional pairing.",
    watchFor: "A dynamic where 8 leads on everything and 2 has no genuine influence over shared decisions.",
    takeaway: "Life Path 8 should actively invite 2's perspective — not as a courtesy, but as a real input. Life Path 2 should practice advocating for their preferences clearly before accommodating. The dynamic only balances when 2 is willing to be heard and 8 is willing to genuinely listen.",
  },
  "2-9": {
    dynamic: "Partnership meets idealism — present versus horizon",
    detail: "Life Path 2 wants to be deeply seen and partnered in a specific, proximate way — within the relationship itself. Life Path 9 has a generous heart but tends to disperse it widely — to causes, to the world, to people who need them. 9 may genuinely feel they're giving love; 2 may genuinely feel they're not receiving it. Both are right.",
    strength: "2 provides the emotional security that keeps 9 grounded; 9's big-picture orientation adds meaning beyond the couple.",
    watchFor: "2 consistently competing for attention with 9's broader commitments.",
    takeaway: "Life Path 9 should schedule dedicated presence — not just availability, but actual undivided attention — for 2. Life Path 2 should be explicit about what they need and when, rather than hoping 9's generosity naturally flows inward. The relationship needs to be a named priority, not an assumed one.",
  },
  "2-11": {
    dynamic: "Attunement meets intuition — profound and potentially destabilising",
    detail: "Both Life Path 2 and Life Path 11 are highly sensitive to emotional undercurrents. The connection between them can feel uncanny — profoundly understood on both sides. The risk is emotional amplification: both are porous to feeling, and when neither is grounded, they absorb and reflect each other's anxiety rather than steadying each other.",
    strength: "An almost psychic emotional attunement — this pairing tends to understand each other at a level that surprises both.",
    watchFor: "Emotional amplification: both absorb, neither grounds, the intensity escalates.",
    takeaway: "Build a shared grounding practice — something physical, simple, and regular — that neither person skips when the emotional intensity rises. Exercise, walking, cooking together. The relationship needs an anchor outside the emotional plane it naturally inhabits.",
  },
  "2-22": {
    dynamic: "Partnership meets vision — feeling versus building",
    detail: "Life Path 2 orients toward relationship itself as the primary project. Life Path 22 orients toward building something significant — and tends to see the relationship as the foundation that enables that project. These are compatible in theory and sometimes in tension in practice: 2 may feel secondary to 22's mission, while 22 may genuinely believe the mission serves the relationship.",
    strength: "2's emotional care and 22's structural ambition can create a genuinely stable and expansive partnership.",
    watchFor: "2 feeling like the relationship is the context for 22's work rather than a priority in itself.",
    takeaway: "Life Path 22 should regularly name what the relationship specifically means to them — not as a preamble to the next project, but as the point itself. Life Path 2 should engage with 22's vision rather than competing with it — ask how to be part of what they're building.",
  },
  "3-3": {
    dynamic: "Two communicators — expressive and potentially surface-level",
    detail: "Two Life Path 3s bring warmth, creativity, and social energy to the dynamic. The connection tends to be fun, expressive, and rarely dull. The challenge is that both may stay in the lighter register — the one where everything is interesting and nobody is fully seen — and neither naturally pushes the other toward depth when things get hard.",
    strength: "A naturally warm, creative, and expressive pairing — genuinely enjoyable to be around each other.",
    watchFor: "Communicating constantly without actually landing anywhere — engagement as a substitute for depth.",
    takeaway: "Deliberately create space for the harder conversations. Schedule a regular 'what's actually going on' check-in that doesn't allow either of you to deflect with humor or new ideas. The sparkle is real; make sure there's depth beneath it.",
  },
  "3-4": {
    dynamic: "Creativity meets structure — a persistent friction",
    detail: "Life Path 3 is spontaneous, expressive, and energised by improvisation. Life Path 4 plans, executes, and finds unpredictability genuinely draining. Both orientations are valid — but they rub against each other in almost every practical dimension: planning, spending, pace, communication style.",
    strength: "3 prevents 4 from becoming rigid; 4 keeps 3 from spinning without landing.",
    watchFor: "4 experiencing 3 as chronically disorganised; 3 experiencing 4 as controlling or joyless.",
    takeaway: "Build a shared planning ritual that 3 actually participates in willingly — not to clip 3's wings, but to create the structure inside which 3 can improvise freely. Think of it as: here's the map, now let's explore the territory together.",
  },
  "3-5": {
    dynamic: "Two free-spirited communicators — dynamic but unsettled",
    detail: "Life Path 3 and Life Path 5 are both attracted to stimulation, variety, and living at the edge of what's interesting. The connection tends to be alive and rarely boring. The challenge is that neither naturally builds the grounding or continuity that a lasting relationship requires — both are more energised by beginning than by sustaining.",
    strength: "Mutual energy, creativity, and a shared resistance to the mundane.",
    watchFor: "Mistaking momentum for depth — always moving, never quite arrived.",
    takeaway: "Agree on what stays consistent — one or two routines or commitments you'll maintain — and let everything else be as dynamic as it wants. The relationship needs at least one stable anchor to hold its shape.",
  },
  "3-6": {
    dynamic: "Expressive meets nurturing — warmth with different gravitational pulls",
    detail: "Life Path 3 brings expressiveness, lightness, and social energy. Life Path 6 brings care, devotion, and a deep investment in the relationship's health. Together they tend to be warm, creative, and generative. The tension is in orientation: 3 wants to be out in the world exploring; 6 wants to be deeply invested in the home and the people within it.",
    strength: "3's creativity and 6's care produce a genuinely warm and nurturing dynamic.",
    watchFor: "6 quietly investing more than 3 is present enough to receive.",
    takeaway: "Life Path 3 should regularly name what they specifically appreciate about 6's care — concretely and recently, not in general. Life Path 6 should communicate when they need more of 3's presence, not just their energy.",
  },
  "3-7": {
    dynamic: "Expression meets reflection — a productive creative tension",
    detail: "Life Path 3 communicates outwardly and socially; Life Path 7 processes inwardly and philosophically. 3 fills silences; 7 uses them. 3 is energised by connection; 7 is energised by solitude. The gap is real, but so is the complement — 7 grounds 3's expression in something substantive; 3 draws 7 out of isolation.",
    strength: "3 brings 7 out of their head and into engagement; 7 gives 3's expressiveness something real to land on.",
    watchFor: "3 interpreting 7's silence as disapproval; 7 finding 3's energy exhausting rather than enlivening.",
    takeaway: "Life Path 3 should learn to let 7 think without filling the space. Life Path 7 should name their state clearly — 'I'm thinking, not withdrawing' — so 3 isn't left reading ambiguity. Precision about state closes most of the gap.",
  },
  "3-8": {
    dynamic: "Creative expression meets ambitious execution",
    detail: "Life Path 3 is expressive, socially energised, and moves through ideas quickly. Life Path 8 is goal-oriented, authoritative, and focused on results. Both are confident and high-energy. The friction comes from different ideas of what energy is for: 3 disperses it joyfully; 8 concentrates it toward outcomes.",
    strength: "3's creativity and social connection complement 8's strategic drive — they cover different terrain naturally.",
    watchFor: "8 dismissing 3's expressiveness as unserious; 3 experiencing 8 as relentlessly outcome-focused and not present.",
    takeaway: "Make space for both modes in the shared life — projects that let 8's drive find expression, and play that lets 3's creativity breathe. When both modes are legitimate, the friction reduces considerably.",
  },
  "3-9": {
    dynamic: "Communicator meets idealist — creativity and meaning",
    detail: "Life Path 3 is expressive and social; Life Path 9 is idealistic and meaning-driven. Both are generous and warm. The connection tends to feel alive, meaningful, and genuinely engaged. The tension is in focus: 3 disperses warmly in many directions; 9 carries a larger sense of purpose that can sometimes dwarf the immediate connection.",
    strength: "Creative, generous, and genuinely engaged — both bring warmth and intention to the dynamic.",
    watchFor: "3 feeling like 9's sense of purpose makes personal joy seem trivial; 9 finding 3's lightness insufficiently serious.",
    takeaway: "Honour both orientations: the delight in the immediate (3) and the commitment to something larger (9). The pairing is richest when 3's expressiveness serves 9's purpose and 9's meaning gives 3's creativity direction.",
  },
  "3-11": {
    dynamic: "Storyteller meets visionary — inspired and occasionally destabilising",
    detail: "Both Life Path 3 and Life Path 11 are creative and intuitive, but at different registers. 3 works through expression and connection; 11 works through perception and vision. The dynamic is often electric — both bring a quality of aliveness to the pairing that others notice. The risk is that 11's emotional intensity can overwhelm 3's preference for keeping things relatively light.",
    strength: "A genuinely creative and inspired pairing — both bring something alive to the other.",
    watchFor: "11 needing emotional depth that 3 instinctively deflects from; 3 feeling destabilised by 11's intensity.",
    takeaway: "Life Path 3 should practice staying present when 11 goes deeper, rather than deflecting with wit or a new subject. Life Path 11 should calibrate — not every depth needs to be explored immediately. The pairing has real creative potential when both can modulate register.",
  },
  "3-22": {
    dynamic: "Lightness meets magnitude — different scales of ambition",
    detail: "Life Path 3 wants to express, connect, and keep things alive and interesting. Life Path 22 is building something large — systematically, deliberately, over a long time horizon. The gap is in scale: 3 operates joyfully in the near-term; 22's orientation is toward legacy.",
    strength: "3 keeps 22 humanly present and socially connected; 22 gives 3's expression a larger stage and purpose.",
    watchFor: "3 feeling like the relationship's energy is always absorbed by 22's mission; 22 experiencing 3 as distracted from what matters.",
    takeaway: "Make the relationship itself a named, specific project. 22 approaches it like anything else they build — with intention and structure. 3 makes it warm and alive inside that structure. Both contribute; neither role is secondary.",
  },
  "4-4": {
    dynamic: "Two builders — stable but at risk of calcification",
    detail: "Two Life Path 4s share a deep orientation toward structure, reliability, and deliberate building. The foundation they create together is often genuinely solid. The risk is that the stability becomes calcification — too much structure, not enough aliveness. Neither naturally disrupts the routine, and routines left undisturbed can become invisible walls.",
    strength: "Exceptional stability, follow-through, and shared values around reliability.",
    watchFor: "The relationship becoming a well-managed system rather than a living connection.",
    takeaway: "Schedule disruption — a new experience, an unfamiliar setting, a conversation neither of you would normally start. Not because the structure is bad, but because structure without renewal goes stale. Treat it as maintenance, not rebellion.",
  },
  "4-5": {
    dynamic: "Structure meets freedom — a persistent lifestyle tension",
    detail: "Life Path 4 is oriented toward order, consistency, and building carefully. Life Path 5 is oriented toward variety, stimulation, and the freedom to move. These orientations collide on nearly every practical dimension — planning, living arrangements, spending, pace. When both understand the other's genuine need (not preference, need), the tension becomes navigable.",
    strength: "4 provides the stable base; 5 provides the aliveness — a genuine complement when the tension is named.",
    watchFor: "4 experiencing 5 as irresponsible; 5 experiencing 4 as a constraint on their existence.",
    takeaway: "Negotiate non-negotiables clearly: 4 names the structure they actually can't function without, and 5 does the same for flexibility. Then find the overlap. There's usually more than either expects.",
  },
  "4-6": {
    dynamic: "Structure meets devotion — stable and caring",
    detail: "Life Path 4 and Life Path 6 are both oriented toward the long-term: 4 through structure and reliability, 6 through care and devotion. Together they tend to build something genuinely stable. The friction, when it appears, is usually emotional: 4 expresses care through what they do, while 6 needs to hear and feel it more explicitly than action alone delivers.",
    strength: "A genuinely stable pairing with shared values around reliability and long-term commitment.",
    watchFor: "6 feeling emotionally under-served despite 4's consistent actions; 4 not understanding why their efforts aren't being received as love.",
    takeaway: "Life Path 4 should practice naming care verbally and specifically, not just demonstrating it through actions. Life Path 6 should translate emotional needs into concrete requests rather than expecting 4 to intuit them.",
  },
  "4-7": {
    dynamic: "Builder meets seeker — practical versus philosophical",
    detail: "Life Path 4 builds in the concrete world; Life Path 7 explores the inner one. 4 asks 'how do we build this?'; 7 asks 'but what does it mean?'. Both questions are necessary, and neither is more important — but they can feel like they're pulling in different directions. 4 may experience 7 as impractical; 7 may experience 4 as intellectually narrow.",
    strength: "4's execution and 7's understanding create a rare combination of depth and function.",
    watchFor: "4 losing patience with 7's need to understand before acting; 7 finding 4's practicality limiting.",
    takeaway: "Build a practice of 'understand, then act' rather than forcing either mode. Let 7 think it through; then let 4 execute. Used as a sequence, they're more effective together than either is alone.",
  },
  "4-8": {
    dynamic: "Builder meets achiever — shared ambition, potential power tensions",
    detail: "Life Path 4 and Life Path 8 both have long-term orientations and high standards. 4 builds carefully and systemically; 8 pursues results through force of will and authority. The combination can be remarkably effective. The tension is that two strong-willed people with high standards will disagree about process, pace, and control — and neither yields comfortably.",
    strength: "Shared orientation toward building and legacy — this pairing knows how to get things done.",
    watchFor: "Competition for control over shared decisions and plans.",
    takeaway: "Divide domains explicitly: who leads on what. This isn't about hierarchy — it's about avoiding the constant friction of two strong-willed people each believing they know the right approach. Clarity about ownership prevents most of the conflict.",
  },
  "4-9": {
    dynamic: "Pragmatism meets idealism — building on different foundations",
    detail: "Life Path 4 is grounded, practical, and focused on execution. Life Path 9 is idealistic, meaning-oriented, and focused on contribution. The gap is in orientation: 4 asks 'how do we build this?'; 9 asks 'does this matter enough to build?'. Both perspectives are valuable; they can feel like different conversations happening in parallel.",
    strength: "4's grounding can give 9's idealism practical traction; 9's meaning can give 4's structure a larger purpose.",
    watchFor: "4 experiencing 9 as impractical; 9 experiencing 4 as insufficiently principled.",
    takeaway: "Name explicitly what you're building together and why it matters — in both senses. 4's how and 9's why, in the same conversation. The pairing works best when the what is shared even if the motivation differs.",
  },
  "4-11": {
    dynamic: "Foundation meets intuition — structure versus perception",
    detail: "Life Path 4 trusts what can be built and verified; Life Path 11 trusts what can be perceived and felt. 4 is reassured by structure; 11 can find structure constraining. 11 is reassured by depth and connection; 4 can find 11's emotional intensity difficult to act on. The gap is real — but so is the complement when both are genuinely respected.",
    strength: "4's stability and 11's perception together create a pairing that is both grounded and deeply insightful.",
    watchFor: "4 dismissing 11's intuitions as impractical; 11 finding 4's structure emotionally cold.",
    takeaway: "Life Path 4 should treat 11's perceptions as information to be taken seriously, even when they can't be verified immediately. Life Path 11 should learn to translate insights into concrete language that 4 can act on. The bridge is buildable.",
  },
  "4-22": {
    dynamic: "Builder meets master builder — ambition in common, different scales",
    detail: "Life Path 4 and Life Path 22 share a deep orientation toward structure, deliberate building, and the long view. The difference is in scale: 4 builds carefully within practical limits; 22 builds toward something larger than any single project. The tension is that 22's scope can dwarf 4's more measured approach, making 4 feel like they're executing someone else's vision.",
    strength: "Shared orientation toward structure, reliability, and building something real and lasting.",
    watchFor: "22's expanded scope making 4 feel subordinate rather than equal.",
    takeaway: "Name what each person is building and why — not just the shared project, but the individual orientation underneath it. Both deserve to see their own vision reflected in what you're creating together, not just 22's.",
  },
  "5-5": {
    dynamic: "Two free spirits — exciting and potentially rootless",
    detail: "Two Life Path 5s share a deep need for variety, stimulation, and freedom from anything that feels like confinement. The connection is exciting and alive. The challenge is that neither naturally provides the grounding, continuity, or structure that a sustainable relationship requires. Both are energised by beginning and change; sustaining requires something neither instinctively reaches for.",
    strength: "Mutual understanding of the need for freedom — no one is controlling or restricting the other.",
    watchFor: "An implicit competition between personal freedom and shared stability, with neither willing to sacrifice theirs.",
    takeaway: "Decide explicitly what stays consistent — the one or two things that won't change even as everything else moves. Without at least one stable anchor, the pairing risks constant restlessness disguised as aliveness.",
  },
  "5-6": {
    dynamic: "Freedom meets devotion — pull toward different gravitational centres",
    detail: "Life Path 5 needs space, variety, and the freedom to move. Life Path 6 needs to be needed, to care, and to feel the relationship as a primary investment. These orientations pull in different directions on almost every dimension: 5 expands outward, 6 invests inward. When both understand the other's need without pathologising it, the complementarity is real.",
    strength: "6's stability and care can be genuinely grounding for 5; 5's energy and variety can prevent 6 from over-investing to the point of resentment.",
    watchFor: "6 building resentment from over-giving to someone who doesn't slow down long enough to receive it; 5 feeling managed.",
    takeaway: "Life Path 5 should practice genuine arrival — being fully present, not just physically there. Life Path 6 should practice investing in ways that require reciprocal presence, so the giving has a shape 5 can actually respond to.",
  },
  "5-7": {
    dynamic: "Freedom meets depth — independent but in different directions",
    detail: "Life Path 5 seeks freedom and stimulation in the external world. Life Path 7 seeks truth and understanding in the internal world. Both are non-conformist; neither is conventionally needy. The dynamic tends to be spacious. The risk is that the space becomes distance — two people existing alongside each other without genuine intersection.",
    strength: "Mutual respect for independence and a natural absence of the pursuer-withdrawer dynamic.",
    watchFor: "The pairing drifting into parallel tracks that rarely cross — co-existing but not genuinely connecting.",
    takeaway: "Create shared experiences that honour both orientations: go somewhere new together (5) and then take time to discuss what it actually meant (7). The combination of exploration and reflection is uniquely generative for this pairing.",
  },
  "5-8": {
    dynamic: "Freedom meets ambition — electrifying until it isn't",
    detail: "Life Path 5 is energised by variety, freedom, and the resistance to confinement. Life Path 8 is energised by goals, structure, and the drive toward mastery and results. Both are high-energy and neither is passive — but their energies point in different directions. 8's focus can feel like control to 5; 5's freedom can feel like undependability to 8.",
    strength: "Mutual confidence and drive — neither is intimidated by the other's energy.",
    watchFor: "8's structured ambition reading to 5 as constraint; 5's freedom reading to 8 as unreliability.",
    takeaway: "Be explicit about where structure is genuinely needed and where 5's freedom is non-negotiable. Not every dimension of life needs to be managed by 8; not every dimension needs to be open-ended for 5. Find the map of what each of you actually needs where.",
  },
  "5-9": {
    dynamic: "Freedom meets meaning — restlessness in different registers",
    detail: "Life Path 5 seeks stimulation and freedom; Life Path 9 seeks meaning and contribution. Both are drawn to movement — 5 through experience, 9 through engagement with what matters. The pairing tends to be expansive and rarely small. The risk is that neither provides the other with the groundedness or presence that a close relationship requires.",
    strength: "Both are oriented toward something beyond the immediate — shared expansiveness and generosity.",
    watchFor: "Neither being present enough to make the relationship itself a priority.",
    takeaway: "Name the relationship as a specific project that requires attention — not because it competes with 5's freedom or 9's meaning, but because without deliberate attention it gets absorbed by both. Schedule presence, not just availability.",
  },
  "5-11": {
    dynamic: "Stimulation meets perception — intensity in different forms",
    detail: "Life Path 5 moves quickly through varied experience; Life Path 11 perceives deeply and feels intensely. 5's pace can be genuinely exciting — or can feel to 11 like there's never enough time to actually arrive. 11's emotional depth can be genuinely meaningful — or can feel to 5 like a demand for stillness they find impossible.",
    strength: "5's vitality and 11's depth create a pairing that is both alive and perceptive.",
    watchFor: "5 inadvertently bypassing 11's emotional needs in the forward movement; 11 experiencing 5's pace as avoidance.",
    takeaway: "Life Path 5 should practice arriving — not stopping, but being fully present in whatever moment they're in. Life Path 11 should practice naming what they specifically need, not just feeling the absence.",
  },
  "5-22": {
    dynamic: "Explorer meets architect — freedom versus structure",
    detail: "Life Path 5 needs freedom from constraint; Life Path 22 operates by building within intentional structure. These are genuinely opposed orientations. 22's disciplined, long-horizon approach can feel constraining to 5; 5's openness and restlessness can feel like insufficient commitment to 22. The pairing works when each genuinely respects what the other's orientation provides.",
    strength: "5's vitality and 22's structural capacity can create a pairing that is both alive and effective.",
    watchFor: "22's need for commitment and structure feeling like confinement to 5.",
    takeaway: "22 should be explicit about which commitments are genuinely load-bearing versus simply preferred. 5 should be explicit about which freedoms are genuinely necessary versus those they'd willingly give up. Most of the conflict lives in the assumptions, not the actual incompatibility.",
  },
  "6-6": {
    dynamic: "Two nurturers — deeply devoted, co-dependency risk",
    detail: "Two Life Path 6s create a relationship of extraordinary care and mutual devotion. Both are oriented toward the other's wellbeing; both show love through giving and service. The warmth is real and the commitment tends to be deep. The risk is that both over-give to the point of depletion — and when neither names their own needs because doing so feels selfish, the resentment accumulates silently.",
    strength: "Profound mutual care and a naturally shared orientation toward home, devotion, and long-term investment.",
    watchFor: "Both sacrificing without naming it, until the accumulated weight becomes a source of resentment neither expected.",
    takeaway: "Build a regular ritual where both people name what they need — not what they're grateful for, not what they want to give, but what they need to receive. The instinct to prioritise the other is a gift; it needs a counterweight of self-expression to remain sustainable.",
  },
  "6-7": {
    dynamic: "Caretaker meets seeker — different intimacy languages",
    detail: "Life Path 6 shows love through care, proximity, and consistent investment in the relationship. Life Path 7 shows love through respect, independence, and the willingness to let the other be themselves. These are genuine differences in intimacy language. 6 may read 7's need for solitude as indifference; 7 may read 6's need for proximity as a demand.",
    strength: "6's care and 7's depth create a pairing with genuine warmth and intellectual richness.",
    watchFor: "6 interpreting 7's solitude as withdrawal; 7 feeling emotionally pressed by 6's need for closeness.",
    takeaway: "Life Path 7 should actively name their affection — not just feel it, but say it, specifically and recently. Life Path 6 should practice giving 7 the space to return rather than pulling harder when 7 goes quiet. The relationship needs both investment and room to breathe.",
  },
  "6-8": {
    dynamic: "Devotion meets drive — care versus achievement",
    detail: "Life Path 6 is oriented toward care, devotion, and the relationship as a primary project. Life Path 8 is oriented toward achievement, authority, and building in the external world. The dynamic can be complementary or imbalanced: 6 tends the home and relationship while 8 focuses outward. This works only when 8 actively names and honours what 6 is providing.",
    strength: "6's care and 8's provision create a stable and devoted pairing.",
    watchFor: "6 building resentment from being the sole emotional manager of the relationship while 8 focuses outward.",
    takeaway: "Life Path 8 should be explicit about how much they value what 6 brings — not assumed, but stated. Life Path 6 should name when they're over-extending and what they need in return, rather than martyring themselves quietly. The imbalance is fixable when both people are honest about it.",
  },
  "6-9": {
    dynamic: "Nurturer meets idealist — care at different scales",
    detail: "Life Path 6 orients toward specific people — the ones they love, their immediate world, the home. Life Path 9 orients toward something larger — humanity, meaning, contribution. Both are generous; the scale just differs. This can feel like a beautiful complement or like 6 is constantly offering something 9 is too expansive to fully receive.",
    strength: "Shared orientation toward care and giving — both are genuinely oriented toward others.",
    watchFor: "6 feeling that 9's generosity extends to everyone except the people right in front of them.",
    takeaway: "Life Path 9 should be deliberately, specifically present for 6 — which means carving out focused time that isn't shared with causes or communities. Life Path 6 should engage with 9's larger vision rather than competing with it.",
  },
  "6-11": {
    dynamic: "Devotion meets vision — care and deep perception",
    detail: "Life Path 6 invests deeply in care and relationship. Life Path 11 perceives deeply and feels acutely. The connection tends to be emotionally rich. The risk is that 11's emotional intensity requires more management than 6's caregiving can provide — 6 can absorb 11's emotional world until they're running on empty.",
    strength: "6's steadiness and 11's perception create a relationship of genuine depth and care.",
    watchFor: "6 absorbing 11's emotional intensity beyond their own capacity; 11 not registering how much 6 is giving.",
    takeaway: "Life Path 11 should actively check in on 6 — not just receive care, but give it. Life Path 6 should name their limits early, before they hit them. The relationship has real depth; it needs reciprocal investment to stay healthy.",
  },
  "6-22": {
    dynamic: "Caretaker meets architect — personal versus structural",
    detail: "Life Path 6 is oriented toward specific people and the immediate relationship. Life Path 22 is oriented toward building something larger and more enduring. The pairing tends to be stable and well-functioning. The tension is that 22's mission can feel impersonal to 6's deeply relational orientation — even when 22 genuinely means it as service to those they love.",
    strength: "6's care ensures the relationship is genuinely tended; 22's structure gives it security and long-term grounding.",
    watchFor: "6 feeling secondary to 22's mission; 22 not recognising how much the relationship relies on 6's quiet investment.",
    takeaway: "Life Path 22 should make the relationship a named part of the mission, not an assumed background condition. Life Path 6 should engage with 22's vision as something they're building together, not something they're competing with.",
  },
  "7-7": {
    dynamic: "Two seekers — profound depth, occasional abyss",
    detail: "Two Life Path 7s share an orientation toward truth, depth, and inner understanding. The intellectual and philosophical connection tends to be extraordinary — unlike anything either has found elsewhere. The risk is that both withdraw simultaneously, and with no one left to bridge the gap, the connection can go remarkably cold remarkably fast.",
    strength: "Unparalleled intellectual and philosophical depth — both feel genuinely understood at the level they care most about.",
    watchFor: "Both withdrawing simultaneously into their inner worlds with no one left to reconnect.",
    takeaway: "Build an explicit reconnection practice — a set signal or check-in that breaks the withdrawal cycle when both have gone quiet. The depth you can reach together is rare; don't let the symmetry of your solitude erode it.",
  },
  "7-8": {
    dynamic: "Depth meets achievement — understanding versus results",
    detail: "Life Path 7 seeks to understand; Life Path 8 seeks to achieve. 7 asks 'why?'; 8 asks 'how do we win?'. Both are serious and capable; both are somewhat withholding emotionally. The dynamic tends to be productive and mutually respectful. The gap is in what they do with their seriousness: 7 internalises, 8 externalises.",
    strength: "Mutual seriousness, depth of thought, and a shared resistance to the trivial.",
    watchFor: "7 finding 8 insufficiently reflective; 8 finding 7's need to understand everything before acting frustrating.",
    takeaway: "Alternate registers deliberately. Practice asking 'what do you make of that?' (7's language) and 'what should we do about it?' (8's language) in the same conversation. Neither mode should dominate every exchange.",
  },
  "7-9": {
    dynamic: "Seeker meets idealist — two introspective orientations",
    detail: "Life Path 7 seeks truth through internal exploration; Life Path 9 seeks meaning through engagement with the world. Both are thoughtful, non-trivial, and drawn to depth. The pairing tends to be rich and intellectually alive. The risk is that both are more comfortable with ideas than with emotional proximity — the relationship can develop significant intellectual warmth while remaining emotionally quite distant.",
    strength: "A profoundly thoughtful and meaningful pairing — both bring genuine depth and curiosity.",
    watchFor: "Both confusing intellectual intimacy with emotional intimacy — the conversation is rich; the vulnerability is absent.",
    takeaway: "Deliberately introduce emotional vulnerability into the dynamic — not just ideas, but feelings about those ideas, and feelings about each other. The intellectual connection is real; build the emotional one alongside it, not instead of it.",
  },
  "7-11": {
    dynamic: "Analyst meets visionary — complementary and intense",
    detail: "Life Path 7 processes through analysis and logic; Life Path 11 processes through intuition and perception. Both are introspective and non-trivial. The connection can be electric — 11's intuitions illuminated by 7's precision; 7's analysis given vision by 11's perception. The risk is that when both are in a difficult state, 7's withdrawal and 11's emotional amplification become destabilising together.",
    strength: "The analytical and the intuitive together — a genuinely rare and powerful combination when it's working.",
    watchFor: "7's withdrawal combined with 11's emotional intensity creating a destabilising feedback loop.",
    takeaway: "Build explicit check-in signals. Life Path 7 should name their state clearly — 'I need to think, I'm not withdrawing emotionally.' Life Path 11 should distinguish between what they're sensing and what's actually happening, and ask rather than assume.",
  },
  "7-22": {
    dynamic: "Wisdom meets vision — depth and scale",
    detail: "Life Path 7 seeks wisdom through inner exploration; Life Path 22 seeks to build something that embodies that wisdom at scale. The pairing can be profoundly symbiotic: 7 provides the understanding, 22 provides the mechanism to act on it. The tension is that 22's expansive scope can feel to 7 like it bypasses the depth required to do it properly.",
    strength: "The combination of genuine understanding (7) and structural ambition (22) is rare and powerful.",
    watchFor: "7 feeling that 22's scale sacrifices the depth required; 22 losing patience with 7's need to fully understand before acting.",
    takeaway: "Treat each other's orientation as genuinely necessary to the other. 22's vision needs 7's depth to be substantive; 7's understanding needs 22's ambition to become anything beyond insight. Both halves of this dynamic are incomplete without the other.",
  },
  "8-8": {
    dynamic: "Two achievers — powerful, high-stakes, high-risk",
    detail: "Two Life Path 8s bring ambitious drive, authority, and a deep resistance to being subordinate to anyone. The dynamic is high-energy and mutually respectful. The risk is structural competition: two people who both expect to be the authority, both have high standards for how things should be done, and neither naturally yields. The pairing succeeds when both direct their drive externally rather than at each other.",
    strength: "Genuine mutual respect for competence and ambition — neither is intimidated by the other's strength.",
    watchFor: "Structural competition for authority, particularly when both feel strongly about the same decision.",
    takeaway: "Build an explicit protocol for joint decisions before it becomes necessary — who has the final word on what, and how do you escalate disagreements. This isn't a sign of distrust; it's architecture for two people who are both genuinely strong.",
  },
  "8-9": {
    dynamic: "Achiever meets idealist — outcomes versus meaning",
    detail: "Life Path 8 is oriented toward achievement, authority, and measurable results. Life Path 9 is oriented toward meaning, contribution, and what actually matters. Both are ambitious in their own way; the ambitions point in different directions. 8 may find 9 insufficiently focused on results; 9 may find 8 insufficiently focused on whether the results mean anything.",
    strength: "8's execution capacity and 9's sense of purpose create a genuinely impactful pairing.",
    watchFor: "8 dismissing 9's principles as impractical; 9 finding 8's results-focus hollow.",
    takeaway: "Connect 8's outcomes to 9's meaning — what are we achieving, and why does it matter? When 8 can articulate the why and 9 can commit to the how, the pairing becomes both principled and effective.",
  },
  "8-11": {
    dynamic: "Authority meets intuition — strength and perception",
    detail: "Life Path 8 operates through authority, results, and clear power dynamics. Life Path 11 operates through intuition, perception, and emotional depth. 8 tends to trust what can be demonstrated; 11 trusts what can be felt. The gap between these epistemologies is real — and both will sometimes be right in ways the other can't immediately verify.",
    strength: "8's strength and 11's perception create a pairing that is both powerful and wise.",
    watchFor: "8 dismissing 11's intuitions as insufficient evidence; 11 feeling overridden by 8's authority.",
    takeaway: "Life Path 8 should give 11's intuitions genuine consideration even without immediate verification — 11 has a track record of being right in ways that data doesn't explain. Life Path 11 should learn to articulate intuitions in language that 8 can act on, not just feel.",
  },
  "8-22": {
    dynamic: "Two builders of scale — ambition without sufficient intimacy",
    detail: "Life Path 8 and Life Path 22 are both wired for impact at scale. The ambition is matched; the drive is matched; the long-term orientation is matched. The risk is that both of you are so externally focused — on building, achieving, creating — that the relationship itself gets maintained rather than tended. Functional, maybe even impressive — but emotionally thin.",
    strength: "Exceptional combined ambition and structural capacity — this pairing can genuinely build something significant.",
    watchFor: "The relationship becoming a management exercise rather than a genuine emotional connection.",
    takeaway: "Schedule deliberately emotional time — not strategic reviews or project updates, but conversations specifically about how you're each doing inside the relationship. Both of you will find it slightly uncomfortable. That discomfort is the signal that it's necessary.",
  },
  "9-9": {
    dynamic: "Two idealists — meaning-rich but proximally scarce",
    detail: "Two Life Path 9s share a generosity of spirit and a deep orientation toward meaning and contribution. The connection tends to feel profoundly aligned in values and purpose. The risk is proximity — both may give so much outwardly, to causes and people and the world, that the relationship itself never becomes a genuine priority.",
    strength: "Values alignment at the deepest level — both are genuinely invested in the same things.",
    watchFor: "Both being so oriented outward that the relationship exists primarily as context for external contribution.",
    takeaway: "Name the relationship specifically as a project — not just a shared context for other projects. Two people who both care about what matters have the potential for something extraordinary between them; it needs deliberate attention to become that rather than a pleasant background.",
  },
  "9-11": {
    dynamic: "Idealist meets visionary — meaning and perception",
    detail: "Life Path 9 is motivated by contribution and the larger good; Life Path 11 is driven by insight and the desire to illuminate. Both are non-trivial and both are emotionally generous. The pairing tends to be rich, meaningful, and occasionally overwhelming — two people with high sensitivity and strong inner lives, both trying to serve something larger.",
    strength: "Shared depth, generosity, and a genuine orientation toward meaning.",
    watchFor: "Both being so oriented toward the larger picture that neither gives sufficient attention to each other.",
    takeaway: "Be intentional about creating a small, intimate world between you — not just the big shared purpose. The contribution to the world is genuine; so is the need for genuine presence with each other.",
  },
  "9-22": {
    dynamic: "Purpose meets vision — two large-scale orientations",
    detail: "Life Path 9 wants to contribute to something meaningful; Life Path 22 wants to build something enduring. Both are oriented toward impact beyond themselves. The pairing tends to be deeply aligned on values and long-term orientation. The tension is that both can become so invested in their respective missions that the relationship lives in the overlap — supported, respected, but not fully inhabited by either.",
    strength: "Deep values alignment and a shared orientation toward impact and meaning.",
    watchFor: "The relationship becoming primarily a context for two individually large pursuits rather than a genuine connection.",
    takeaway: "Name specifically what you're building together — not just alongside each other. The visions are compatible; make sure there's a shared project that belongs to both of you, not just two parallel ones.",
  },
  "11-11": {
    dynamic: "Two intuitive visionaries — profound and potentially destabilising",
    detail: "Two Life Path 11s create an almost psychic connection — perceiving each other at a level that can feel both miraculous and exposing. Both are emotionally sensitive, intuitively perceptive, and drawn to depth. The risk is amplification: both absorb and reflect each other's emotional states, and when neither is grounded, the combined intensity can become overwhelming.",
    strength: "Unparalleled mutual perception and emotional attunement — a connection that goes deeper than either can fully articulate.",
    watchFor: "Emotional amplification with no grounding mechanism — both are porous, neither is anchored.",
    takeaway: "Both people need independent grounding practices — time, space, and activity that is theirs alone and that exists outside the emotional field of the pairing. The depth between two 11s is extraordinary; it needs each person to be genuinely anchored in themselves to remain sustainable.",
  },
  "11-22": {
    dynamic: "Intuition meets architecture — perception and structure",
    detail: "Life Path 11 perceives what others miss — the emotional undercurrent, the pattern beneath the pattern. Life Path 22 builds systems that embody the best of what they understand. Together, these orientations are genuinely synergistic: 11 provides the vision; 22 provides the structure. The risk is that 22's expansive plans can feel to 11 like they bypass the subtlety required to do it well.",
    strength: "11's perception and 22's structural ambition together can create something genuinely rare.",
    watchFor: "22's pace and scale overwhelming 11's need for depth and subtlety; 11's emotional intensity slowing 22's momentum.",
    takeaway: "Build a practice of deliberate translation between registers: 11 articulates what they perceive in language 22 can act on; 22 slows down enough to receive what 11 is offering. The combination of their respective gifts is genuinely powerful when neither has to sacrifice to accommodate the other.",
  },
  "22-22": {
    dynamic: "Two master builders — extraordinary potential, intimacy risk",
    detail: "Two Life Path 22s are both wired to build at scale — systematically, ambitiously, over long time horizons. The alignment of vision and ambition can feel extraordinary. The risk is that both are so focused on the mission — on building something that lasts — that the relationship itself becomes infrastructure rather than a living thing.",
    strength: "Matched ambition, matched scale, matched orientation toward legacy — rare and powerful.",
    watchFor: "The relationship becoming a shared enterprise managed for optimal output rather than genuinely inhabited.",
    takeaway: "Schedule time that is explicitly not about any project — time that exists only for connection, rest, and the pleasure of each other's company. Both of you know how to build; practice the equally important skill of simply being present together without agenda.",
  },
};

// Helper: get canonical LP pair key (numeric sort — safe for 11 and 22)
export function getLPPairKey(lpA: number, lpB: number): string {
  return [lpA, lpB].sort((a, b) => a - b).join("-");
}

export interface DestinyNumberProfile { title: string; talent: string; tendency: string; }
export const DESTINY_NUMBER_PROFILES: Record<number, DestinyNumberProfile> = {
  1:  { title: "The Initiator",    talent: "Naturally draws others into motion — their presence alone tends to shift a room from waiting to doing.",                                                         tendency: "draw others into motion — their presence alone tends to shift a room from waiting to doing" },
  2:  { title: "The Harmoniser",   talent: "Naturally steadies the energy around them — people feel less alone and more considered in their presence.",                                                     tendency: "steady the energy around them — people feel less alone and more considered in their presence" },
  3:  { title: "The Animator",     talent: "Brings a quality of aliveness into shared spaces — conversations shift, energy lifts, and people engage more openly around them.",                             tendency: "bring a quality of aliveness into shared spaces — conversations shift and people engage more openly around them" },
  4:  { title: "The Anchor",       talent: "Creates a sense of reliability in shared spaces — people feel more willing to commit to things when this person is involved.",                                 tendency: "create a sense of reliability in shared spaces — people feel more willing to commit when they're involved" },
  5:  { title: "The Catalyst",     talent: "Brings an energy that loosens fixed situations — things tend to move, open up, or change shape around them.",                                                 tendency: "loosen fixed situations — things move, open up, and change shape around them" },
  6:  { title: "The Nurturer",     talent: "Makes people feel genuinely cared for without being asked — their attention to others' wellbeing is instinctive and noticeable.",                             tendency: "make people feel genuinely cared for without being asked — their attention to others' wellbeing is instinctive and noticeable" },
  7:  { title: "The Depth-Bringer",talent: "Draws conversations toward meaning — in their presence, surface-level exchange tends to give way to something more substantive.",                             tendency: "draw conversations toward meaning — surface exchange tends to give way to something more substantive in their presence" },
  8:  { title: "The Executor",     talent: "Has a natural command over outcomes — when they commit to something, others tend to believe it will actually happen.",                                         tendency: "command outcomes — when they commit to something, others tend to believe it will actually happen" },
  9:  { title: "The Expander",     talent: "Widens what seems possible in shared spaces — conversations become more generous, more purposeful, and more connected to what actually matters.",             tendency: "widen what seems possible in shared spaces — conversations become more generous and purposeful around them" },
  11: { title: "The Illuminator",  talent: "Brings moments of clarity that feel like the air has shifted — the insight they offer tends to arrive at exactly the right moment.",                         tendency: "bring moments of clarity that feel like the air has shifted — their insights arrive at exactly the right moment" },
  22: { title: "The Architect",    talent: "Makes ambitious things feel achievable — in their presence, people begin to see how things could actually be built.",                                         tendency: "make ambitious things feel achievable — in their presence, people begin to see how things could actually be built" },
};
