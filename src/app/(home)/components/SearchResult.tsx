'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WordCard } from './WordCard';
import type { WordDefinition } from '@/types/dictionary';

interface SearchResultProps {
  isLoading?: boolean;
  data?: WordDefinition;
}

export function SearchResult({ isLoading, data }: SearchResultProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-6 grid-cols-1"
        >
          <div className="p-6 rounded-xl bg-white/50 dark:bg-neutral-800/50 animate-pulse">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-7 w-32 bg-blue-100 dark:bg-blue-900/30 rounded" />
                  <div className="h-4 w-20 bg-blue-100/50 dark:bg-blue-900/20 rounded" />
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full bg-blue-100/50 dark:bg-blue-900/20 rounded" />
                <div className="h-4 w-5/6 bg-blue-100/50 dark:bg-blue-900/20 rounded" />
                <div className="h-4 w-4/6 bg-blue-100/50 dark:bg-blue-900/20 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      ) : data ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <WordCard data={data} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
} 