import { useEffect } from 'react';
import { useNutritionStore } from '../store/nutritionStore';

export const useHealthSync = () => {
  const updateDailyGoal = useNutritionStore((state) => state.updateDailyGoal);
  const dailyGoals = useNutritionStore((state) => state.dailyGoals);

  useEffect(() => {
    // Mock polling active calories every 60 seconds
    const interval = setInterval(() => {
      // Simulate walking around and burning 10-20 active calories
      const activeCaloriesBurned = Math.floor(Math.random() * 10) + 10;
      
      // Dynamically adjust daily calorie goal
      const newGoal = dailyGoals.calories + activeCaloriesBurned;
      updateDailyGoal(newGoal);
      
      console.log(`[Health Connect Mock] Synced +${activeCaloriesBurned} active kcal. New Goal: ${newGoal}`);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [dailyGoals.calories, updateDailyGoal]);
};
