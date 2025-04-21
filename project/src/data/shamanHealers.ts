import { Shaman } from "../types";

// Import images directly
import babaylanImage from '../assets/Babaylan.jpeg';
import mambabarangImage from '../assets/Mambabarang.jpeg';
import mangkukulamImage from '../assets/Mangkukulam.jpeg';
import albularyoImage from '../assets/Albularyo.jpeg';

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
    description: "A Mangkukulam is a practitioner of kulam, a form of folk witchcraft or sorcery in the Philippines, often associated with casting spells or curses to harm others. Commonly found in various regions of the Philippines, especially in rural provinces where belief in supernatural forces remains strong. Often portrayed as an ordinary person, usually elderly. Sometimes depicted as mysterious, reclusive, or living on the outskirts of the village. Not always visually distinguishable from others.",
    abilities: [
      "Kulam (Cursing)",
      "Remote Attacks",
      "Spirit Manipulation",
      "Healing Knowledge"
    ]
  },
  {
    id: "albularyo",
    name: "Albularyo",
    type: "Healer",
    origin: "Bicol",
    imageUrl: albularyoImage, // Use imported image reference
    description: "An albularyo is a traditional Filipino folk healer or medicine man/woman who uses herbal remedies, prayers (orasyon), rituals, and supernatural insight to diagnose and cure ailments—both physical and spiritual.",
    abilities: [
      "Diagnosis of Illness-Pagtatawas",
      "Herbal Medicine",
      "Spirit Healing",
      "Protection and Counter-Sorcery",
      "Communication with Spirits"
    ]
  },
  // Add more shamans as needed
];