import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitsContext';
import HabitCard from '@/components/HabitCard';
import AddHabitModal from '@/components/AddHabitModal';

const Dashboard = () => {
  const { habits, isHabitCompletedToday } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => isHabitCompletedToday(habit.id)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.datesCompleted.length, 0);
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);

  const stats = [
    {
      label: 'Today\'s Progress',
      value: `${completedToday}/${totalHabits}`,
      percentage: completionRate,
      icon: Target,
      color: 'text-ignite-start'
    },
    {
      label: 'Total Completions',
      value: totalCompletions,
      icon: TrendingUp,
      color: 'text-success-start'
    },
    {
      label: 'Best Streak',
      value: longestStreak,
      icon: Trophy,
      color: 'text-fire-orange'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (totalHabits === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            🌱
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4">Ready to Grow?</h1>
          <p className="text-muted-foreground mb-8">
            Your habit garden is empty. Plant your first seed and watch your life transform!
          </p>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-ignite"
            size="lg"
          >
            <Plus size={20} className="mr-2" />
            Plant Your First Habit
          </Button>

          <AddHabitModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 pb-24 md:pb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Habit Dashboard</h1>
            <p className="text-muted-foreground">
              Keep the fire burning! 🔥 {completedToday} of {totalHabits} habits completed today
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-ignite mt-4 md:mt-0"
          >
            <Plus size={18} className="mr-2" />
            Add Habit
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card p-6"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className={stat.color} />
                {stat.percentage !== undefined && (
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.percentage}%
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              
              {stat.percentage !== undefined && (
                <div className="mt-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-ignite"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Habits Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-6">Your Habits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HabitCard habit={habit} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Motivation Section */}
        {completionRate === 100 && totalHabits > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="glass-card p-8 max-w-md mx-auto achievement-glow">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: 3
                }}
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-achievement mb-2">
                Perfect Day!
              </h3>
              <p className="text-muted-foreground">
                You've completed all your habits today. You're unstoppable! 🚀
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </motion.div>
  );
};

export default Dashboard;