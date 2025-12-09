"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onSearchDebouncedChange: (value: string) => void;
}

export function SearchBar({ value, onSearchDebouncedChange }: SearchBarProps) {
  const [input, setInput] = useState(value);

  // Sync from filters BUT only if different (avoid rollback bug)
  useEffect(() => {
    if (value !== input) {
      setInput(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Single debounce source of truth
 useEffect(() => {
  const id = setTimeout(() => {
    onSearchDebouncedChange(input.trim());
  }, 400);

  return () => clearTimeout(id);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [input]);


  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search events, categories, or locations..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </motion.div>
  );
}
