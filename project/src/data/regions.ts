import { Region } from '../types';
import LuzonImage from "../assets/Luzon.jpeg";
import VisayasImage from "../assets/Visayas.jpeg";
import MindanaoImage from "../assets/Mindanao.jpeg";

export const regions: Region[] = [
  {
    id: '1',
    name: 'Luzon',
    description: 'The largest and most populous island in the Philippines, home to the capital city of Manila. Luzon has a rich tapestry of folklore, with creatures like the Kapre, Tikbalang, and the White Lady of Balete Drive.',
    imageUrl: LuzonImage
  },
  {
    id: '2',
    name: 'Visayas',
    description: 'The central region of the Philippines, known as the "cradle of Philippine civilization." The Visayas is particularly known for the Aswang mythology, especially in provinces like Capiz which is sometimes referred to as the "Aswang Capital."',
    imageUrl: VisayasImage
  },
  {
    id: '3',
    name: 'Mindanao',
    description: 'The second-largest island in the Philippines with a diverse cultural heritage including Muslim and indigenous influences. Mindanao folklore features unique entities like the Bungisngis (a cyclops-like giant) and the Bakunawa (a moon-eating dragon).',
    imageUrl: MindanaoImage
  }
];