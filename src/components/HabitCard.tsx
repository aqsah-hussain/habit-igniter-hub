import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Calendar, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitsContext';
import type { Habit } from '@/context/HabitsContext';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { markHabitComplete, deleteHabit, isHabitCompletedToday } = useHabits();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const isCompleted = isHabitCompletedToday(habit.id);
  const completionRate = Math.min((habit.datesCompleted.length / 30) * 100, 100);

  const handleComplete = () => {
    markHabitComplete(habit.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    deleteHabit(habit.id);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-achievement';
    if (streak >= 14) return 'text-fire-orange';
    if (streak >= 7) return 'text-fire-red';
    return 'text-muted-foreground';
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '✨';
    return '💫';
  };

  return (
    <motion.div
      className="habit-card group relative"
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: isDeleting ? 0.8 : 1, 
        opacity: isDeleting ? 0 : 1 
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      {/* Actions Menu */}
      <motion.div
        className="absolute top-4 right-4 z-10 flex space-x-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showActions ? 1 : 0, 
          scale: showActions ? 1 : 0.8 
        }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground"
          onClick={() => {/* Edit functionality */}}
        >
          <Edit3 size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white/10 hover:bg-red-500/20 text-muted-foreground hover:text-red-500"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={14} />
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="flex items-start justify-between">
        {/* Habit Info */}
        <div className="flex items-start space-x-4 flex-1">
          {/* Emoji */}
          <motion.div
            className="text-4xl"
            animate={isCompleted ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {habit.emoji}
          </motion.div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
              {habit.name}
            </h3>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-success"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {habit.datesCompleted.length} days completed
              </p>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <motion.span
                  className="text-lg"
                  animate={habit.streak > 0 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  {getStreakBadge(habit.streak)}
                </motion.span>
                <span className={`font-bold ${getStreakColor(habit.streak)}`}>
                  {habit.streak}
                </span>
                <span className="text-sm text-muted-foreground">
                  day{habit.streak !== 1 ? 's' : ''} streak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="mt-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleComplete}
            disabled={isDeleting}
            className={`w-full font-semibold transition-all duration-300 ${
              isCompleted
                ? 'btn-success'
                : 'btn-ignite'
            }`}
          >
          <motion.div
            className="flex items-center justify-center space-x-2"
            animate={isCompleted ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Check 
              size={18} 
              className={isCompleted ? 'text-white' : 'text-white'} 
            />
            <span>
              {isCompleted ? 'Completed Today!' : 'Mark Complete'}
            </span>
          </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Achievement Glow Effect */}
      {habit.streak >= 7 && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-ignite opacity-10 -z-10"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default HabitCard;