import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mode = 'Athlete' | 'Strict' | 'Balanced';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealSlot {
  id: string;
  time: string;
  label: string;
  suggestedMacros: Macros;
  suggestedCalories: number;
  suggestedMealText?: string;
}

interface NutritionState {
  dailyGoals: Macros & { calories: number };
  consumedToday: Macros & { calories: number };
  mode: Mode;
  timelineSlots: MealSlot[];
  caloricOvershoot: number;
  
  setMode: (mode: Mode) => void;
  updateConsumed: (macros: Partial<Macros & { calories: number }>) => void;
  rebalanceRemainingMeals: () => void;
  updateDailyGoal: (calories: number) => void;
  applySocialBuffer: () => void;
}

const generateDefaultSlots = (): MealSlot[] => [
  { id: '1', time: '08:00 AM', label: 'Breakfast', suggestedMacros: { protein: 0, carbs: 0, fat: 0 }, suggestedCalories: 0 },
  { id: '2', time: '01:00 PM', label: 'Lunch', suggestedMacros: { protein: 0, carbs: 0, fat: 0 }, suggestedCalories: 0 },
  { id: '3', time: '06:00 PM', label: 'Dinner', suggestedMacros: { protein: 0, carbs: 0, fat: 0 }, suggestedCalories: 0 },
  { id: '4', time: '09:00 PM', label: 'Late Snack', suggestedMacros: { protein: 0, carbs: 0, fat: 0 }, suggestedCalories: 0 },
];

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      dailyGoals: { calories: 2400, protein: 180, carbs: 250, fat: 70 },
      consumedToday: { calories: 1700, protein: 160, carbs: 122, fat: 62 },
      mode: 'Athlete',
      timelineSlots: generateDefaultSlots(),
      caloricOvershoot: 0,

      setMode: (mode) => {
        set({ mode });
        get().rebalanceRemainingMeals();
      },

      updateConsumed: (macros) => {
        set((state) => {
          const nextConsumed = { ...state.consumedToday, ...macros };
          let overshoot = 0;
          if (nextConsumed.calories > state.dailyGoals.calories) {
            overshoot = nextConsumed.calories - state.dailyGoals.calories;
          }
          return {
            consumedToday: nextConsumed,
            caloricOvershoot: overshoot,
          };
        });
        get().rebalanceRemainingMeals();
      },

      updateDailyGoal: (calories) => {
        set((state) => ({
          dailyGoals: { ...state.dailyGoals, calories }
        }));
        get().rebalanceRemainingMeals();
      },

      applySocialBuffer: () => {
        set((state) => {
          if (state.caloricOvershoot > 0) {
            return {
              caloricOvershoot: 0,
              // Deduct 250 from daily goal representing a "spread" over the next days
              dailyGoals: { ...state.dailyGoals, calories: state.dailyGoals.calories - 250 }
            };
          }
          return state;
        });
        get().rebalanceRemainingMeals();
      },

      rebalanceRemainingMeals: () => {
    const { dailyGoals, consumedToday, timelineSlots, mode } = get();
    
    // Calculate remaining
    let remainingCalories = Math.max(0, dailyGoals.calories - consumedToday.calories);
    let remainingProtein = Math.max(0, dailyGoals.protein - consumedToday.protein);
    let remainingCarbs = Math.max(0, dailyGoals.carbs - consumedToday.carbs);
    let remainingFat = Math.max(0, dailyGoals.fat - consumedToday.fat);

    const nowHour = new Date().getHours();
    
    // Temporal Weighting logic: if after 8 PM (20:00), cap carbs to 15% of remaining for the night
    if (nowHour >= 20 && remainingCarbs > 0) {
      remainingCarbs = Math.floor(remainingCarbs * 0.15);
    }

    const unpassedSlots = timelineSlots.filter((slot) => {
      // Very naive time check: assuming time like "08:00 AM" or "09:00 PM"
      const isPM = slot.time.includes('PM');
      let hour = parseInt(slot.time.split(':')[0]);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      return hour >= nowHour;
    });

    if (unpassedSlots.length === 0) return; // No slots left today

    const updatedSlots = timelineSlots.map(slot => {
      if (!unpassedSlots.find(s => s.id === slot.id)) return slot;
      
      let pRatio = 1 / unpassedSlots.length;
      let cRatio = 1 / unpassedSlots.length;
      let fRatio = 1 / unpassedSlots.length;
      let calRatio = 1 / unpassedSlots.length;

      if (mode === 'Athlete' && slot.label === 'Late Snack') {
        pRatio *= 1.5; // More protein late for athletes
      }

      const suggestedCalories = Math.floor(remainingCalories * calRatio);
      
      let suggestedMealText = "Balanced Meal";
      if (suggestedCalories <= 0) {
        suggestedMealText = "Zero Calorie Intake (Water/Tea)";
      } else if (suggestedCalories > 600) {
        suggestedMealText = "Steak, Sweet Potato & Asparagus";
      } else if (suggestedCalories > 300) {
        suggestedMealText = "Grilled Chicken Breast & Quinoa";
      } else {
        suggestedMealText = "Protein Shake & Mixed Greens";
      }

      return {
        ...slot,
        suggestedCalories,
        suggestedMealText,
        suggestedMacros: {
          protein: Math.floor(remainingProtein * pRatio),
          carbs: Math.floor(remainingCarbs * cRatio),
          fat: Math.floor(remainingFat * fRatio)
        }
      };
    });

    set({ timelineSlots: updatedSlots });
  }
}),
  {
    name: 'macro-pilot-storage'
  }
));
