import { useHabits } from '@/context/HabitsContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';

const Index = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();

  // Auto-navigate to dashboard if user has habits
  useEffect(() => {
    if (habits.length > 0) {
      // Small delay to show the home page briefly
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [habits.length, navigate]);

  return <Home />;
};

export default Index;
