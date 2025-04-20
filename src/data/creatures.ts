import { Creature } from "../types";
import AswangImage from "../assets/Aswang.jpeg";
import ManananggalImage from "../assets/Manananggal.jpeg";
import TikbalangImage from "../assets/Tikbalang.jpeg";
import KapreImage from "../assets/Kapre.jpeg";
import TiyanakImage from "../assets/Tiyanak.jpeg";
import SigbinImage from "../assets/Sigbin.jpeg";
import GabunanImage from "../assets/Gabunan.jpeg";

export const creatures: Creature[] = [
  {
    id: "1",
    name: "Aswang",
    type: "Shapeshifter",
    origin: "Visayas",
    description:
      "The Aswang is a shapeshifting monster in Filipino folklore usually possessing a combination of the traits of either a vampire, a ghoul, a warlock/witch, or different species of werebeast, or even all of them together. It is the subject of a wide variety of myths and stories.",
    abilities: ["Shapeshifting", "Flight", "Enhanced strength", "Invisibility"],
    imageUrl: AswangImage,
  },
  {
    id: "2",
    name: "Manananggal",
    type: "Viscera Sucker",
    origin: "Philippines",
    description:
      "The Manananggal is a vampire-like mythical creature in Filipino folklore that is often described as hideous, usually depicting an older, detached woman capable of severing its upper torso in order to fly into the night with huge bat-like wings to prey on unsuspecting, pregnant women in their homes.",
    abilities: [
      "Body separation",
      "Flight",
      "Elongated proboscis-like tongue",
      "Nocturnal",
    ],
    imageUrl: ManananggalImage,
  },
  {
    id: "3",
    name: "Tikbalang",
    type: "Werebeast",
    origin: "Luzon",
    description:
      "The Tikbalang is a creature of Philippine folklore said to lurk in the mountains and forests. It is generally described as a tall, bony humanoid creature with disproportionately long limbs, the head and hooves of a horse, and a disproportionately thin body. It is sometimes believed to be a transformation of an aborted fetus sent to earth from limbo.",
    abilities: [
      "Invisibility",
      "Shapeshifting",
      "Teleportation",
      "Disorientation of travelers",
    ],
    imageUrl: TikbalangImage,
  },
  {
    id: "4",
    name: "Kapre",
    type: "Giant",
    origin: "Philippines",
    description:
      "The Kapre is a Philippine mythical creature that could be characterized as a tree giant. It is described as being a tall (7 to 9 ft), dark, muscular creature. Kapres are normally described as having a strong smell that would attract human attention.",
    abilities: [
      "Invisibility",
      "Illusion creation",
      "Smoke generation",
      "Tree dwelling",
    ],
    imageUrl: KapreImage,
  },
  {
    id: "5",
    name: "Tiyanak",
    type: "Undead",
    origin: "Philippines",
    description:
      "A Tiyanak is a vampiric creature in Philippine mythology that imitates the form of a child. It usually takes the form of a newborn baby and cries in the jungle to attract unwary travelers. Once it is picked up by an unwary victim, it reverts to its true form and attacks the victim.",
    abilities: ["Mimicry", "Shapeshifting", "Luring", "Enhanced strength"],
    imageUrl: TiyanakImage,
  },
  {
    id: "6",
    name: "Sigbin",
    type: "Chimera",
    origin: "Visayas",
    description:
      "The Sigbin or Sigben is a creature in Philippine mythology said to come out at night to suck the blood of victims from their shadows. It is said to walk backwards with its head lowered between its hind legs, and to have the ability to become invisible to other creatures, especially humans.",
    abilities: [
      "Invisibility",
      "Blood sucking",
      "Shadow manipulation",
      "Backward walking",
    ],
    imageUrl: SigbinImage,
  },
  {
    id: "7",
    name: "Gabunan",
    type: "Aswang Chieftain",
    origin: "Visayas",
    description:
      "The Gabunan is a high-ranking aswang variant, often serving as a chieftain or regional overlord in aswang clans. Unlike common aswang, Gabunans exhibit strategic intelligence, organizing feeding territories (pugad) and enforcing rules among lesser monsters.",
    abilities: [
      "Supreme Shapeshifting",
      "Regional Overlord",
      "Lunar Augmentation",
      "Flesh Divination",
      "Anti-Holy Tactics",
    ],
    imageUrl: GabunanImage,
  },
];
