import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Moon, Sun, Palette, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSettings = ({ isOpen, onClose }) => {
  const { theme, setTheme, accentColor, setAccentColor, background, setBackground } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface relative w-full max-w-md rounded-2xl p-6 shadow-2xl border border-border"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="mb-6 text-2xl font-bold text-foreground">Theme Settings</h2>

          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                Appearance
              </h3>
              <div className="flex rounded-xl bg-background p-1 border border-border">
                {['light', 'dark'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all ${
                      theme === t
                        ? 'bg-surface text-primary-600 shadow-sm border border-border'
                        : 'text-gray-500 hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Selection */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Palette className="h-4 w-4" />
                Accent Color
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'teal', color: 'bg-[#14b8a6]' },
                  { id: 'blue', color: 'bg-[#3b82f6]' },
                  { id: 'purple', color: 'bg-[#a855f7]' },
                  { id: 'orange', color: 'bg-[#f97316]' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setAccentColor(c.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                      accentColor === c.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-border bg-surface hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full ${c.color} shadow-sm`} />
                    <span className="text-xs font-medium text-foreground capitalize">{c.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Animated Background */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <ImageIcon className="h-4 w-4" />
                Animated Background
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'none', label: 'None (Solid Color)' },
                  { id: 'waves', label: 'Big Waves' },
                  { id: 'fluid', label: 'Fluid Gradient' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackground(bg.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      background === bg.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-border bg-surface text-foreground hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ThemeSettings;
