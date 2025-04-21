import { Shaman } from "../types";

// Import images directly
import babaylanImage from '../assets/Babaylan.jpeg';
import mambabarangImage from '../assets/Mambabarang.jpeg';
import mangkukulamImage from '../assets/Mangkukulam.jpeg';

export const shamansHealers: Shaman[] = [
  {
    id: "shaman-babaylan",
    name: "Shaman/Babaylan",
    type: "Spiritual Leader",
    origin: "Visayas",
    imageUrl: babaylanImage, // Use imported image reference
    description: "The Babaylan were the traditional spiritual leaders, healers, and community guides in pre-colonial Philippine societies. They served as intermediaries between the physical and spiritual worlds, performing rituals for healing, harvests, and protection.",
    abilities: [
      "Spiritual healing",
      "Divination",
      "Herbal medicine",
      "Communication with spirits",
      "Ritual leadership"
    ]
  },
  {
    id: "mambabarang",
    name: "Mambabarang",
    type: "Sorcerer",
    origin: "Bicol",
    imageUrl: mambabarangImage, // Use imported image reference
    description: "The Mambabarang is a practitioner of dark magic who uses insects or spirits to inflict harm. Unlike Babaylans who heal, Mambabarangs specialize in curses and revenge magic through their control of elemental spirits.",
    abilities: [
      "Insect control",
      "Curse casting",
      "Spirit binding",
      "Harmful magic"
    ]
  },
  {
    id: "mangkukulam",
    name: "Mangkukulam",
    type: "Priestess",
    origin: "Tagalog",
    imageUrl: mangkukulamImage, // Use imported image reference
    description: "The Catalonan were the Tagalog counterparts to the Visayan Babaylans, serving as priestesses who conducted important community rituals. They preserved oral traditions and mediated between deities (anitos) and people.",
    abilities: [
      "Ancestral communication",
      "Ritual leadership",
      "Cultural preservation",
      "Divine intercession"
    ]
  }
  // Add more shamans as needed
];