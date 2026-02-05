import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drink } from './types';

const DRINKS_KEY = 'caffeine_tracker_drinks';

export async function getAllDrinks(): Promise<Drink[]> {
  const data = await AsyncStorage.getItem(DRINKS_KEY);
  if (!data) return [];
  return JSON.parse(data) as Drink[];
}

export async function saveDrink(drink: Drink): Promise<void> {
  const drinks = await getAllDrinks();
  drinks.push(drink);
  await AsyncStorage.setItem(DRINKS_KEY, JSON.stringify(drinks));
}

export async function deleteDrink(id: string): Promise<void> {
  const drinks = await getAllDrinks();
  const filtered = drinks.filter((d) => d.id !== id);
  await AsyncStorage.setItem(DRINKS_KEY, JSON.stringify(filtered));
}

export async function getDrinksByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Drink[]> {
  const drinks = await getAllDrinks();
  return drinks.filter((d) => {
    const t = new Date(d.timestamp);
    return t >= startDate && t <= endDate;
  });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
