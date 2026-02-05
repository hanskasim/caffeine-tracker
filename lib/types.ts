export type DrinkType = 'coffee' | 'tea' | 'energy_drink' | 'boba';

export interface Drink {
  id: string;
  type: DrinkType;
  name: string;
  caffeine_mg: number;
  cost: number;
  timestamp: string; // ISO string
  location?: string;
}

export interface DrinkPreset {
  type: DrinkType;
  name: string;
  caffeine_mg: number;
  emoji: string;
}

export interface DailyStats {
  totalCaffeine: number;
  totalSpent: number;
  drinkCount: number;
  drinks: Drink[];
}
