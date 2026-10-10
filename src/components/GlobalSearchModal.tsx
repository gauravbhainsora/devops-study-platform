'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DayMeta } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
import { Search, X, CheckCircle2, Bookmark, ArrowRight, CornerDownLeft } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: DayMeta[];
}

export function GlobalSearchModal({ isOpen, onClose, days }: GlobalSearchModalProps) {
  const router = useRouter();
  const { isDayCompleted, isDayBookmarked, activeTrack } = useProgress();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global key shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // handled by parent or opened
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter days
  const filteredDays = days.filter((day) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const dayStr = `day ${day.day}`.toLowerCase();
    const dayNum = String(day.day);
    return (
      day.title.toLowerCase().includes(q) ||
      day.description.toLowerCase().includes(q) ||
      day.moduleTitle.toLowerCase().includes(q) ||
      day.tags.some((t) => t.toLowerCase().includes(q)) ||
      dayStr.includes(q) ||
      dayNum === q
    );
  }).slice(0, 10);

  // Handle keyboard navigation inside results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredDays.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredDays.length) % Math.max(1, filteredDays.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredDays[selectedIndex]) {
        handleSelectDay(filteredDays[selectedIndex]);
      }
    }
  };

  const handleSelectDay = (day: DayMeta) => {
    onClose();
    router.push(`/${day.year || activeTrack}/day/${day.slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-950/40">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search all 90 days, topics, modules, or tools (e.g. docker, go, k8s, day 15)..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredDays.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching days found for &quot;<span className="text-slate-300">{query}</span>&quot;.
            </div>
          ) : (
            filteredDays.map((day, idx) => {
              const isSelected = idx === selectedIndex;
              const completed = isDayCompleted(day.day, activeTrack);
              const bookmarked = isDayBookmarked(day.day, activeTrack);

              return (
                <div
                  key={day.id}
                  onClick={() => handleSelectDay(day)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-950/40 border border-cyan-800/60' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        completed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      D{day.day}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-200 truncate">
                          {day.title}
                        </span>
                        {completed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        {bookmarked && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-cyan-400 font-medium">Mod {day.moduleNumber}:</span>
                        <span className="truncate">{day.moduleTitle}</span>
                        <span>•</span>
                        <span>{day.estimatedMinutes}m read</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 shrink-0 pl-3">
                    {isSelected && (
                      <span className="text-xs text-cyan-400 flex items-center gap-1 font-mono">
                        Select <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">↵</kbd> Open</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">esc</kbd> Close</span>
          </div>
          <span>Showing {filteredDays.length} results</span>
        </div>
      </div>
    </div>
  );
}
