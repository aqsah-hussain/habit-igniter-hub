import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHabits } from '@/context/HabitsContext';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_EMOJIS = [
  '💧', '🏃', '📚', '🧘', '💪', '🥗', 
  '😴', '🚶', '💻', '🎨', '🎸', '📝',
  '🦷', '🧴', '🌱', '☀️', '🏠', '❤️'
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose }) => {
  const { addHabit } = useHabits();
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    setIsSubmitting(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addHabit({
      name: habitName.trim(),
      emoji: selectedEmoji
    });

    // Reset form
    setHabitName('');
    setSelectedEmoji('🔥');
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setHabitName('');
      setSelectedEmoji('🔥');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="glass-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-ignite-start" size={24} />
                  <h2 className="text-xl font-bold">Create New Habit</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Habit Name */}
                <div className="space-y-2">
                  <Label htmlFor="habitName" className="text-sm font-medium">
                    What habit do you want to build?
                  </Label>
                  <Input
                    id="habitName"
                    type="text"
                    placeholder="e.g., Drink 8 glasses of water"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    disabled={isSubmitting}
                    className="transition-all duration-300 focus:ring-2 focus:ring-ignite-start/50"
                    autoFocus
                  />
                </div>

                {/* Emoji Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Choose an emoji</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {POPULAR_EMOJIS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        className={`p-3 rounded-lg text-2xl transition-all duration-200 ${
                          selectedEmoji === emoji
                            ? 'bg-gradient-ignite text-white shadow-ignite'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => setSelectedEmoji(emoji)}
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!habitName.trim() || isSubmitting}
                    className="flex-1 btn-ignite"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </motion.div>
                    ) : (
                      'Create Habit'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;