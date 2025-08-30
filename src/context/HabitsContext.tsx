import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  datesCompleted: string[];
  createdAt: string;
  color?: string;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'datesCompleted' | 'createdAt'>) => void;
  markHabitComplete: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  editHabit: (habitId: string, updates: Partial<Habit>) => void;
  clearAllData: () => void;
  isHabitCompletedToday: (habitId: string) => boolean;
  getHabitCompletionRate: (habitId: string, days: number) => number;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsProvider: React.FC<HabitsProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('ignitofy-habits');
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error('Error loading habits from localStorage:', error);
      }
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('ignitofy-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'datesCompleted' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      streak: 0,
      datesCompleted: [],
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const markHabitComplete = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      // Check if already completed today
      if (habit.datesCompleted.includes(today)) {
        // Unmark - remove today and recalculate streak
        const newDatesCompleted = habit.datesCompleted.filter(date => date !== today);
        return {
          ...habit,
          datesCompleted: newDatesCompleted,
          streak: calculateStreak(newDatesCompleted)
        };
      } else {
        // Mark complete - add today and recalculate streak
        const newDatesCompleted = [...habit.datesCompleted, today].sort();
        return {
          ...habit,
          datesCompleted: newDatesCompleted,
          streak: calculateStreak(newDatesCompleted)
        };
      }
    }));
  };

  const calculateStreak = (datesCompleted: string[]): number => {
    if (datesCompleted.length === 0) return 0;
    
    const sortedDates = datesCompleted.sort().reverse(); // Most recent first
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const completedDate of sortedDates) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (completedDate === dateStr) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const editHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  };

  const clearAllData = () => {
    setHabits([]);
    localStorage.removeItem('ignitofy-habits');
  };

  const isHabitCompletedToday = (habitId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.datesCompleted.includes(today) : false;
  };

  const getHabitCompletionRate = (habitId: string, days: number): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    let completedDays = 0;
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habit.datesCompleted.includes(dateStr)) {
        completedDays++;
      }
    }
    
    return (completedDays / days) * 100;
  };

  const value: HabitsContextType = {
    habits,
    addHabit,
    markHabitComplete,
    deleteHabit,
    editHabit,
    clearAllData,
    isHabitCompletedToday,
    getHabitCompletionRate
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};