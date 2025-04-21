// src/data/shamansHealers.ts
import { Shaman } from "../types";
import BabaylanImage from "../assets/Babaylan.jpeg";
import MambabarangImage from "../assets/Mambabarang.jpeg";
import MangkukulamImage from "../assets/Mangkukulam.jpeg";

export const shamansHealers: Shaman[] = [
  {
    id: "1",
    name: "Babaylan",
    type: "Spiritual Leader",
    origin: "Visayas",
    description:
      "The Babaylan were the traditional spiritual leaders, healers, and community guides in pre-colonial Philippine societies. They served as intermediaries between the physical and spiritual worlds, performing rituals for healing, harvests, and protection.",
    abilities: [
      "Spirit communication",
      "Herbal medicine",
      "Divination",
      "Ritual healing",
      "Community guidance",
    ],
    imageUrl: BabaylanImage,
  },
  {
    id: "2",
    name: "Mambabarang",
    type: "Sorcerer",
    origin: "Bicol",
    description:
      "The Mambabarang is a practitioner of dark magic who uses insects or spirits to inflict harm. Unlike Babaylans who heal, Mambabarangs specialize in curses and revenge magic through their control of elemental spirits.",
    abilities: [
      "Insect control",
      "Spirit summoning",
      "Curse casting",
      "Elemental manipulation",
      "Poison crafting",
    ],
    imageUrl: MambabarangImage,
  },
  {
    id: "3",
    name: "Mangkukulam",
    type: "Priestess",
    origin: "Tagalog",
    description:
      "The Catalonan were the Tagalog counterparts to the Visayan Babaylans, serving as priestesses who conducted important community rituals. They preserved oral traditions and mediated between deities (anitos) and people.",
    abilities: [
      "Ritual performance",
      "Ancestral communication",
      "Sacred chant mastery",
      "Omen interpretation",
      "Ceremonial leadership",
    ],
    imageUrl: MangkukulamImage,
  },
  // Add more entries as needed
];
