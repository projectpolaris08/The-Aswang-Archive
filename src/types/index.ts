export interface Creature {
  id: string;
  name: string;
  type: string;
  origin: string;
  description: string;
  abilities: string[];
  imageUrl: string;
}

export interface Shaman {
  id: string;
  name: string;
  type: string;
  origin: string;
  imageUrl: string;
  tribe?: string;
  rank?: string;
  description: string;
  abilities: string[];
  spiritualConnections?: string[];
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  region: string;
  imageUrl: string;
  featured: boolean;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}
