import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitsContext';
import AddHabitModal from '@/components/AddHabitModal';
import heroImage from '@/assets/hero-ignite.jpg';

const Home = () => {
  const { habits } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const hasHabits = habits.length > 0;
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.datesCompleted.length, 0);
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);

  const features = [
    {
      icon: Target,
      title: 'Track Your Goals',
      description: 'Set meaningful habits and track your progress daily'
    },
    {
      icon: TrendingUp,
      title: 'Build Streaks',
      description: 'Watch your consistency grow with our streak system'
    },
    {
      icon: Calendar,
      title: 'Visual Progress',
      description: 'See your habit completion patterns with beautiful calendars'
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-ignite-start/5 via-ignite-middle/5 to-ignite-end/5" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-ignite bg-clip-text text-transparent mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={32} className="text-ignite-start" />
              <h1 className="text-6xl md:text-7xl font-bold">
                Ignitofy
              </h1>
            </motion.div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ignite your potential, fuel your habits, and transform your life one day at a time.
            </p>
          </motion.div>

          {hasHabits ? (
            /* Returning User Dashboard Preview */
            <motion.div variants={itemVariants} className="mb-12">
              <div className="glass-card p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Progress</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <motion.div
                      className="text-3xl font-bold text-ignite-start mb-1"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {habits.length}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Active Habits</div>
                  </div>
                  
                  <div className="text-center">
                    <motion.div
                      className="text-3xl font-bold text-fire-orange mb-1 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      {longestStreak}
                      <span className="ml-1 fire-streak">🔥</span>
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/dashboard">
                    <Button className="w-full btn-ignite">
                      View Dashboard
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(true)}
                    className="w-full"
                  >
                    <Plus size={18} className="mr-2" />
                    Add New Habit
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* First Time User CTA */
            <motion.div variants={itemVariants} className="mb-12">
              <div className="glass-card p-8 max-w-md mx-auto">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.div>
                <h2 className="text-2xl font-bold mb-4">Start Your Journey</h2>
                <p className="text-muted-foreground mb-6">
                  Ready to build life-changing habits? Add your first habit and begin your transformation today!
                </p>
                
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="w-full btn-ignite"
                  size="lg"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Habit
                </Button>
              </div>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-ignite mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon size={24} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Home;