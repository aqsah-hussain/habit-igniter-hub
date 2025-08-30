import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitsContext';

const Calendar = () => {
  const { habits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(
    habits.length > 0 ? habits[0].id : null
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectedHabitData = habits.find(h => h.id === selectedHabit);

  // Calendar generation
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateCompleted = (day: number) => {
    if (!selectedHabitData) return false;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    return selectedHabitData.datesCompleted.includes(dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  if (habits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <CalendarIcon size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Habits Yet</h1>
          <p className="text-muted-foreground">
            Create some habits first to see your progress calendar!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 pb-24 md:pb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Habit Calendar</h1>
          <p className="text-muted-foreground">
            Track your consistency and celebrate your streaks! 📅
          </p>
        </div>

        {/* Habit Selector */}
        <motion.div
          className="glass-card p-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold mb-4">Select a habit to view:</h3>
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <Button
                key={habit.id}
                variant={selectedHabit === habit.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedHabit(habit.id)}
                className={selectedHabit === habit.id ? 'btn-ignite' : ''}
              >
                <span className="mr-2">{habit.emoji}</span>
                {habit.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {selectedHabitData && (
          <motion.div
            className="glass-card p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Selected Habit Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedHabitData.emoji}</span>
                <div>
                  <h2 className="text-xl font-semibold">{selectedHabitData.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedHabitData.streak} day streak • {selectedHabitData.datesCompleted.length} total completions
                  </p>
                </div>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft size={16} />
              </Button>
              
              <h3 className="text-lg font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isCompleted = isDateCompleted(day);
                const isToday = isCurrentMonth && day === today.getDate();
                
                return (
                  <motion.div
                    key={day}
                    className={`
                      p-3 rounded-lg text-center text-sm font-medium cursor-pointer transition-all duration-200
                      ${isCompleted 
                        ? 'bg-gradient-success text-white shadow-success' 
                        : 'bg-muted hover:bg-muted/80'
                      }
                      ${isToday ? 'ring-2 ring-ignite-start' : ''}
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (index + firstDayOfMonth) * 0.01 }}
                  >
                    {day}
                    {isCompleted && (
                      <motion.div
                        className="mt-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Month Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const monthCompletions = selectedHabitData.datesCompleted.filter(date => {
                  const completionDate = new Date(date);
                  return completionDate.getMonth() === currentDate.getMonth() &&
                         completionDate.getFullYear() === currentDate.getFullYear();
                }).length;
                
                const completionRate = Math.round((monthCompletions / daysInMonth) * 100);
                
                return [
                  { label: 'This Month', value: monthCompletions, color: 'text-ignite-start' },
                  { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-success-start' },
                  { label: 'Current Streak', value: selectedHabitData.streak, color: 'text-fire-orange' },
                  { label: 'Total Days', value: selectedHabitData.datesCompleted.length, color: 'text-achievement' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 bg-muted/50 rounded-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Calendar;