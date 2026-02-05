import { create } from 'zustand';
import { Drink } from './types';
import { getAllDrinks, saveDrink, deleteDrink, generateId } from './storage';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

interface CaffeineStore {
  drinks: Drink[];
  isLoading: boolean;

  loadDrinks: () => Promise<void>;
  addDrink: (drink: Omit<Drink, 'id'>) => Promise<void>;
  removeDrink: (id: string) => Promise<void>;

  getTodayDrinks: () => Drink[];
  getWeekDrinks: () => Drink[];
  getMonthDrinks: () => Drink[];
  getRecentDrinkNames: () => string[];
}

export const useStore = create<CaffeineStore>((set, get) => ({
  drinks: [],
  isLoading: true,

  loadDrinks: async () => {
    set({ isLoading: true });
    const drinks = await getAllDrinks();
    set({ drinks, isLoading: false });
  },

  addDrink: async (drinkData) => {
    const drink: Drink = { ...drinkData, id: generateId() };
    await saveDrink(drink);
    set((state) => ({ drinks: [...state.drinks, drink] }));
  },

  removeDrink: async (id) => {
    await deleteDrink(id);
    set((state) => ({ drinks: state.drinks.filter((d) => d.id !== id) }));
  },

  getTodayDrinks: () => {
    const now = new Date();
    const start = startOfDay(now);
    const end = endOfDay(now);
    return get()
      .drinks.filter((d) => {
        const t = new Date(d.timestamp);
        return t >= start && t <= end;
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  },

  getWeekDrinks: () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return get()
      .drinks.filter((d) => {
        const t = new Date(d.timestamp);
        return t >= start && t <= end;
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  },

  getMonthDrinks: () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return get()
      .drinks.filter((d) => {
        const t = new Date(d.timestamp);
        return t >= start && t <= end;
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  },

  getRecentDrinkNames: () => {
    const drinks = get().drinks;
    const names = drinks.map((d) => d.name);
    // Return unique names, most recent first
    return [...new Set(names.reverse())].slice(0, 10);
  },
}));
