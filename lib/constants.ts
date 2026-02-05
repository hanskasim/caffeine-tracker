import { DrinkPreset, DrinkType } from './types';

export const DAILY_CAFFEINE_LIMIT = 400; // mg, recommended for adults
export const LATE_CAFFEINE_HOUR = 18; // 6 PM

export const DRINK_TYPE_EMOJI: Record<DrinkType, string> = {
  coffee: '☕',
  tea: '🍵',
  energy_drink: '⚡',
  boba: '🧋',
};

export const DRINK_TYPE_LABELS: Record<DrinkType, string> = {
  coffee: 'Coffee',
  tea: 'Tea',
  energy_drink: 'Energy Drink',
  boba: 'Boba',
};

export const DRINK_PRESETS: DrinkPreset[] = [
  // Coffee
  { type: 'coffee', name: 'Espresso', caffeine_mg: 63, emoji: '☕' },
  { type: 'coffee', name: 'Americano', caffeine_mg: 95, emoji: '☕' },
  { type: 'coffee', name: 'Latte', caffeine_mg: 150, emoji: '☕' },
  { type: 'coffee', name: 'Iced Latte', caffeine_mg: 150, emoji: '☕' },
  { type: 'coffee', name: 'Cappuccino', caffeine_mg: 150, emoji: '☕' },
  { type: 'coffee', name: 'Cold Brew', caffeine_mg: 200, emoji: '☕' },
  { type: 'coffee', name: 'Drip Coffee', caffeine_mg: 95, emoji: '☕' },
  { type: 'coffee', name: 'Flat White', caffeine_mg: 130, emoji: '☕' },
  { type: 'coffee', name: 'Mocha', caffeine_mg: 150, emoji: '☕' },
  { type: 'coffee', name: 'Macchiato', caffeine_mg: 75, emoji: '☕' },

  // Tea
  { type: 'tea', name: 'Matcha', caffeine_mg: 70, emoji: '🍵' },
  { type: 'tea', name: 'Green Tea', caffeine_mg: 28, emoji: '🍵' },
  { type: 'tea', name: 'Black Tea', caffeine_mg: 47, emoji: '🍵' },
  { type: 'tea', name: 'Chai Latte', caffeine_mg: 50, emoji: '🍵' },
  { type: 'tea', name: 'Earl Grey', caffeine_mg: 40, emoji: '🍵' },
  { type: 'tea', name: 'Oolong Tea', caffeine_mg: 38, emoji: '🍵' },

  // Energy Drinks
  { type: 'energy_drink', name: 'Red Bull', caffeine_mg: 80, emoji: '⚡' },
  { type: 'energy_drink', name: 'Monster', caffeine_mg: 160, emoji: '⚡' },
  { type: 'energy_drink', name: 'Celsius', caffeine_mg: 200, emoji: '⚡' },
  { type: 'energy_drink', name: 'Bang', caffeine_mg: 300, emoji: '⚡' },
  { type: 'energy_drink', name: 'Yerba Mate', caffeine_mg: 85, emoji: '⚡' },

  // Boba
  { type: 'boba', name: 'Milk Tea Boba', caffeine_mg: 50, emoji: '🧋' },
  { type: 'boba', name: 'Taro Milk Tea', caffeine_mg: 25, emoji: '🧋' },
  { type: 'boba', name: 'Matcha Boba', caffeine_mg: 70, emoji: '🧋' },
  { type: 'boba', name: 'Thai Tea Boba', caffeine_mg: 40, emoji: '🧋' },
  { type: 'boba', name: 'Brown Sugar Boba', caffeine_mg: 50, emoji: '🧋' },
];
