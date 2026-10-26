import type { VoiceParams } from "../lib/audio";

export type PersonaId = "child" | "beginner" | "home" | "stage";
export type SeriesId = "portable" | "home" | "premium" | "grand";

export interface Product {
  id: string;
  name: string;
  series: SeriesId;
  seriesLabel: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  keyboard: string;
  keyScore: number;
  soundEngine: string;
  soundScore: number;
  polyphony: string;
  tones: number;
  speakers: string;
  powerW: number;
  weight: number;
  dims: [number, number, number];
  bluetooth: boolean;
  personas: PersonaId[];
  features: string[];
  voice: VoiceParams;
  voiceName: string;
}

// Prices and product details are sample data for this portfolio concept.
export const PRODUCTS: Product[] = [
  {
    id: "fp-10", name: "FP-10", series: "portable", seriesLabel: "Portable · FP",
    tagline: "A compact starting point for piano practice",
    description: "A portable digital piano concept with a weighted keyboard, built-in speakers and a headphone-friendly practice flow.",
    price: 24999, image: "/img/fp10.jpg", keyboard: "PHA-4 Standard, weighted", keyScore: 7.2,
    soundEngine: "SuperNATURAL Piano", soundScore: 7.0, polyphony: "96 voices", tones: 15,
    speakers: "2 × 6 W", powerW: 12, weight: 12.3, dims: [1284, 258, 140], bluetooth: false,
    personas: ["child", "beginner"],
    features: ["Twin Piano practice mode", "Ivory-feel key surface", "Metronome and built-in tones", "USB connection for the Piano App"],
    voice: { brightness: 0.52, decay: 0.8, body: 0.35 }, voiceName: "Clean and focused",
  },
  {
    id: "fp-30x", name: "FP-30X", series: "portable", seriesLabel: "Portable · FP-X",
    tagline: "A flexible home piano that can travel",
    description: "A portable model concept with Bluetooth audio, built-in speakers and a weighted keyboard for home practice or rehearsals.",
    price: 37421, image: "/img/fp30x.jpg", keyboard: "PHA-4 Standard, weighted", keyScore: 7.6,
    soundEngine: "SuperNATURAL Piano", soundScore: 7.8, polyphony: "256 voices", tones: 56,
    speakers: "2 × 11 W", powerW: 22, weight: 14.8, dims: [1300, 284, 151], bluetooth: true,
    personas: ["child", "beginner", "home"],
    features: ["Bluetooth audio and MIDI", "256-voice polyphony in the sample spec", "Optional stand with three pedals", "Recording and lessons through an app"],
    voice: { brightness: 0.6, decay: 0.9, body: 0.5 }, voiceName: "Warm with a little character",
  },
  {
    id: "rp107", name: "RP107", series: "home", seriesLabel: "Home · RP",
    tagline: "A cabinet-style piano for the living room",
    description: "A home piano concept with a sliding key cover, three pedals and a furniture-inspired cabinet.",
    price: 49999, image: "/img/rp107.jpg", keyboard: "PHA-4 Standard, weighted", keyScore: 7.4,
    soundEngine: "SuperNATURAL Piano", soundScore: 7.6, polyphony: "256 voices", tones: 324,
    speakers: "2 × 8 W", powerW: 16, weight: 37, dims: [1378, 410, 982], bluetooth: true,
    personas: ["child", "home"],
    features: ["Sliding key cover", "Headphone ambience mode", "Sample tone library", "Three-pedal setup"],
    voice: { brightness: 0.5, decay: 0.95, body: 0.55 }, voiceName: "Soft home profile",
  },
  {
    id: "f107", name: "F107", series: "home", seriesLabel: "Home · F",
    tagline: "A slim cabinet for modern interiors",
    description: "A compact home piano concept with a shallow cabinet and a sliding cover.",
    price: 58992, image: "/img/f107.jpg", keyboard: "PHA-4 Standard, weighted", keyScore: 7.5,
    soundEngine: "SuperNATURAL Piano", soundScore: 7.7, polyphony: "256 voices", tones: 324,
    speakers: "2 × 8 W", powerW: 16, weight: 34.5, dims: [1360, 345, 778], bluetooth: true,
    personas: ["beginner", "home"],
    features: ["Slim cabinet profile", "Sliding key cover", "Bluetooth MIDI and audio", "Twin Piano practice mode"],
    voice: { brightness: 0.54, decay: 0.92, body: 0.5 }, voiceName: "Bright and open",
  },
  {
    id: "rp701", name: "RP701", series: "home", seriesLabel: "Home · RP",
    tagline: "A full-size centerpiece for a shared home",
    description: "A cabinet piano concept with an expanded speaker setup, built-in tones and practice features.",
    price: 67999, image: "/img/rp701.jpg", keyboard: "PHA-4 Standard, weighted", keyScore: 7.8,
    soundEngine: "SuperNATURAL Piano", soundScore: 8.2, polyphony: "256 voices", tones: 324,
    speakers: "2 × 12 W", powerW: 24, weight: 46, dims: [1366, 463, 1027], bluetooth: true,
    personas: ["child", "home", "beginner"],
    features: ["Cabinet-style design", "Built-in practice pieces", "USB recording in the sample spec", "Multiple finish options"],
    voice: { brightness: 0.56, decay: 1, body: 0.6 }, voiceName: "Deep living-room profile",
  },
  {
    id: "fp-90x", name: "FP-90X", series: "portable", seriesLabel: "Portable · FP-X",
    tagline: "A portable format for stage and home",
    description: "A premium portable piano concept with a hybrid keyboard, Bluetooth and a more detailed sound profile.",
    price: 109999, image: "/img/fp90x.jpg", keyboard: "PHA-50, wood and composite", keyScore: 9.2,
    soundEngine: "PureAcoustic Piano Modeling", soundScore: 9.3, polyphony: "Modelled", tones: 362,
    speakers: "2 × 25 W + 2 × 5 W", powerW: 60, weight: 23.6, dims: [1340, 354, 148], bluetooth: true,
    personas: ["stage", "home"],
    features: ["Modelled piano sound in this concept data", "Hybrid keyboard construction", "Mic input with effects", "Stage-oriented presets"],
    voice: { brightness: 0.68, decay: 1.05, body: 0.7 }, voiceName: "Bright concert profile",
  },
  {
    id: "hp704", name: "HP704", series: "premium", seriesLabel: "Premium · HP",
    tagline: "A premium cabinet piano concept",
    description: "A home instrument concept pairing a hybrid keyboard with a multi-speaker cabinet design.",
    price: 129999, image: "/img/hp704.jpg", keyboard: "PHA-50, wood and composite", keyScore: 9.0,
    soundEngine: "SuperNATURAL Piano Modeling", soundScore: 9.1, polyphony: "Modelled", tones: 324,
    speakers: "2 × 25 W + 2 × 5 W", powerW: 60, weight: 61, dims: [1377, 468, 957], bluetooth: true,
    personas: ["home", "stage"],
    features: ["Piano Designer controls", "Cabinet speaker projection", "Hybrid keyboard concept", "Sample premium configuration"],
    voice: { brightness: 0.6, decay: 1.15, body: 0.75 }, voiceName: "Rich and spacious",
  },
  {
    id: "lx708", name: "LX708", series: "premium", seriesLabel: "Premium · LX",
    tagline: "A tall cabinet with a concert-piano presence",
    description: "A premium upright-style concept with a longer keyboard action and a multi-speaker layout.",
    price: 224999, image: "/img/lx708.jpg", keyboard: "Hybrid Grand, extended keys", keyScore: 9.8,
    soundEngine: "PureAcoustic Piano Modeling", soundScore: 9.7, polyphony: "Modelled", tones: 324,
    speakers: "4-way, 74 W", powerW: 74, weight: 110.5, dims: [1395, 502, 1253], bluetooth: true,
    personas: ["home", "stage"],
    features: ["Extended-key concept", "Polished cabinet finish", "Headphone ambience mode", "Sample acoustic profiles"],
    voice: { brightness: 0.62, decay: 1.3, body: 0.85 }, voiceName: "Large-room profile",
  },
  {
    id: "gp-6", name: "GP-6", series: "grand", seriesLabel: "Digital grand · GP",
    tagline: "A digital grand piano concept for the home",
    description: "A grand-piano silhouette concept with an open lid and a sound projection layout designed around the cabinet.",
    price: 424999, image: "/img/gp6.jpg", keyboard: "PHA-50, wood and composite", keyScore: 9.4,
    soundEngine: "Piano Reality Modeling", soundScore: 9.9, polyphony: "Modelled", tones: 324,
    speakers: "Piano Reality Projection, 100 W", powerW: 100, weight: 91, dims: [1442, 949, 1017], bluetooth: true,
    personas: ["home", "stage"],
    features: ["Open-lid cabinet concept", "Progressive damper pedal idea", "Polished grand-piano silhouette", "Sample room-fit visualization"],
    voice: { brightness: 0.58, decay: 1.45, body: 0.9 }, voiceName: "Long-tail grand profile",
  },
];

export const productById = (id: string) => PRODUCTS.find((product) => product.id === id)!;

export const fmt = (amount: number) => `${amount.toLocaleString("en-GB")} ₴`;
export const monthly = (price: number, months: number) => Math.ceil(price / months);
export const perDay = (price: number, months: number) => Math.max(1, Math.round(price / months / 30));

export interface Persona {
  id: PersonaId;
  title: string;
  text: string;
  image: string;
  pick: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "child",
    title: "For a young student",
    text: "Explore sample models with weighted keys and practice-oriented features.",
    image: "/img/fp10.jpg",
    pick: "FP-10 · RP107 · RP701",
  },
  {
    id: "beginner",
    title: "For a new hobby",
    text: "Compare compact models and try the guided product finder.",
    image: "/img/fp30x.jpg",
    pick: "FP-30X · F107",
  },
  {
    id: "home",
    title: "For a living room",
    text: "Browse cabinet-style instruments and preview their dimensions.",
    image: "/img/rp701.jpg",
    pick: "HP704 · LX708 · GP-6",
  },
  {
    id: "stage",
    title: "For stage and studio",
    text: "Explore portable models in this sample catalog.",
    image: "/img/fp90x.jpg",
    pick: "FP-90X",
  },
];

export const FAQS: Array<{ q: string; a: string }> = [
  { q: "Is this an official Roland store?", a: "No. This is an independent portfolio concept and is not affiliated with or endorsed by Roland Corporation." },
  { q: "Are the prices and product details real?", a: "No. Prices, specifications, promotions and other catalog values are sample data for the interface demo." },
  { q: "Can I place an order or send my contact details?", a: "No. The cart is simulated. This site does not submit orders, emails or personal information." },
  { q: "Are these official piano recordings?", a: "No. The sound controls use a simple browser-generated synthesizer to demonstrate interaction." },
];
