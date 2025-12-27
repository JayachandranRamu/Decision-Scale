export interface Factor {
  id: string;
  description: string;
  weight: number; // Always positive integer
}

export interface Category {
  id: string;
  name: string;
  pros: Factor[];
  cons: Factor[];
}

export interface ScoredCategory extends Category {
  totalPros: number;
  totalCons: number;
  score: number;
}

export interface Profile {
  id: string;
  name: string;
  categories: Category[];
  lastModified: number;
  theme?: 'default' | 'job' | 'food' | 'life';
  starred?: boolean;
}