import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Calendar, 
  Settings, 
  Flame 
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: Flame, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/statistics', icon: BarChart3, label: 'Stats' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto">
      <div className="glass-card m-4 p-2 md:p-4">
        <div className="flex justify-around md:justify-center md:space-x-8">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            
            return (
              <Link key={path} to={path} className="relative">
                <motion.div
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-ignite"
                      layoutId="activeNavBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <Icon size={20} className={isActive ? 'text-white' : ''} />
                    <span className="text-xs mt-1 font-medium">{label}</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;