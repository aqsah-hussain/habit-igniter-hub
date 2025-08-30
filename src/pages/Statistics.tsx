import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Trophy } from 'lucide-react';
import { useHabits } from '@/context/HabitsContext';

const Statistics = () => {
  const { habits } = useHabits();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  if (habits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <TrendingUp size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Data Yet</h1>
          <p className="text-muted-foreground">
            Start tracking habits to see your amazing statistics and insights!
          </p>
        </motion.div>
      </div>
    );
  }

  // Generate weekly data for the last 7 days
  const generateWeeklyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completedHabits = habits.filter(habit => 
        habit.datesCompleted.includes(dateStr)
      ).length;
      
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedHabits,
        total: habits.length,
        rate: habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0
      });
    }
    
    return data;
  };

  // Generate monthly data for the last 30 days
  const generateMonthlyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completedHabits = habits.filter(habit => 
        habit.datesCompleted.includes(dateStr)
      ).length;
      
      data.push({
        date: i === 0 ? 'Today' : `${i}d ago`,
        completed: completedHabits,
        total: habits.length,
        rate: habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0
      });
    }
    
    return data.filter((_, index) => index % (selectedPeriod === 'month' ? 5 : 1) === 0);
  };

  // Habit performance data
  const generateHabitPerformance = () => {
    return habits.map(habit => ({
      name: `${habit.emoji} ${habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name}`,
      completions: habit.datesCompleted.length,
      streak: habit.streak,
      rate: Math.round((habit.datesCompleted.length / 30) * 100)
    })).sort((a, b) => b.completions - a.completions);
  };

  // Best days analysis
  const getBestDays = () => {
    const dayStats = {
      Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
      Thursday: 0, Friday: 0, Saturday: 0
    };
    
    habits.forEach(habit => {
      habit.datesCompleted.forEach(dateStr => {
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        dayStats[dayName as keyof typeof dayStats]++;
      });
    });
    
    const dayData = Object.entries(dayStats).map(([day, count]) => ({
      day: day.substring(0, 3),
      completions: count
    }));
    
    const bestDay = Object.entries(dayStats).reduce((a, b) => 
      dayStats[a[0] as keyof typeof dayStats] > dayStats[b[0] as keyof typeof dayStats] ? a : b
    )[0];
    
    return { dayData, bestDay };
  };

  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  const habitPerformance = generateHabitPerformance();
  const { dayData, bestDay } = getBestDays();
  
  const data = selectedPeriod === 'week' ? weeklyData : monthlyData;
  
  // Overall stats
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.datesCompleted.length, 0);
  const averageStreak = habits.length > 0 ? Math.round(habits.reduce((sum, habit) => sum + habit.streak, 0) / habits.length) : 0;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const todayCompletions = habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    return habit.datesCompleted.includes(today);
  }).length;

  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="min-h-screen p-4 pb-24 md:pb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistics & Insights</h1>
          <p className="text-muted-foreground">
            Discover your patterns and celebrate your progress! 📊
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Habits', value: habits.length, icon: Target, color: 'text-ignite-start' },
            { label: 'Today\'s Progress', value: `${todayCompletions}/${habits.length}`, icon: Calendar, color: 'text-success-start' },
            { label: 'Longest Streak', value: longestStreak, icon: Trophy, color: 'text-fire-orange' },
            { label: 'Total Completions', value: totalCompletions, icon: TrendingUp, color: 'text-achievement' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Completion Trend Chart */}
        <motion.div variants={itemVariants} className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Completion Trend</h2>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPeriod === 'week' 
                    ? 'bg-gradient-ignite text-white' 
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPeriod === 'month' 
                    ? 'bg-gradient-ignite text-white' 
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ff6b6b', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#4ecdc4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Habit Performance */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Habit Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="completions" fill="url(#habitGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="habitGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ff6b6b" />
                      <stop offset="100%" stopColor="#4ecdc4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Best Days Analysis */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Best Days of Week</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="completions" fill="url(#dayGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#45b7d1" />
                      <stop offset="100%" stopColor="#96ceb4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Insight:</strong> You're most consistent on {bestDay}s! 
                Try scheduling important habits on this day.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Motivation Message */}
        {totalCompletions > 0 && (
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 mt-8 text-center"
          >
            <motion.div
              className="text-4xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <h3 className="text-xl font-bold text-ignite-start mb-2">
              Amazing Progress!
            </h3>
            <p className="text-muted-foreground">
              You've completed <span className="font-bold text-foreground">{totalCompletions}</span> habits 
              and built an average streak of <span className="font-bold text-foreground">{averageStreak}</span> days. 
              Keep up the fantastic work! 🚀
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Statistics;