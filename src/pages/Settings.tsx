import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Trash2, Download, Upload, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useHabits } from '@/context/HabitsContext';
import { useTheme } from 'next-themes';

const Settings = () => {
  const { habits, clearAllData } = useHabits();
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportData = () => {
    const data = {
      habits,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ignitofy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.habits && Array.isArray(data.habits)) {
          // Clear existing data and import new data
          clearAllData();
          data.habits.forEach((habit: any) => {
            // Validate habit structure
            if (habit.id && habit.name && habit.emoji) {
              localStorage.setItem('ignitofy-habits', JSON.stringify(data.habits));
              window.location.reload(); // Simple way to refresh the context
            }
          });
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid Ignitofy backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearAllData();
    setShowDeleteConfirm(false);
  };

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          action: (
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          )
        }
      ]
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: Download,
          title: 'Export Data',
          description: 'Download a backup of your habits',
          action: (
            <Button variant="outline" onClick={exportData}>
              Export
            </Button>
          )
        },
        {
          icon: Upload,
          title: 'Import Data',
          description: 'Restore habits from a backup file',
          action: (
            <div>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                Import
              </Button>
            </div>
          )
        }
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        {
          icon: Trash2,
          title: 'Clear All Data',
          description: 'Permanently delete all habits and progress',
          action: (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Clear All
            </Button>
          )
        }
      ]
    }
  ];

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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="text-ignite-start" size={32} />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Customize your Ignitofy experience and manage your data
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemVariants} className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Ignitofy Journey</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-ignite-start mb-1">
                {habits.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Habits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fire-orange mb-1">
                {habits.reduce((sum, habit) => sum + habit.datesCompleted.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Completions</div>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            className="glass-card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon 
                      size={20} 
                      className={section.title === 'Danger Zone' ? 'text-destructive' : 'text-muted-foreground'} 
                    />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Info */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">About Ignitofy</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Version 1.0.0</p>
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p>Your data is stored locally on your device for privacy</p>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          <motion.div
            className="relative glass-card p-6 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center">
              <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Clear All Data?</h3>
              <p className="text-muted-foreground mb-6">
                This will permanently delete all your habits and progress. This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  className="flex-1"
                >
                  Delete All
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;