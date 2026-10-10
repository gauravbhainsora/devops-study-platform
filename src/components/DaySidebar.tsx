'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DayMeta } from '@/lib/types';
import { getModulesForTrack } from '@/lib/curriculum';
import { useProgress } from '@/context/ProgressContext';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  BookOpen,
} from 'lucide-react';

interface DaySidebarProps {
  days: DayMeta[];
  currentDay: number;
}

export function DaySidebar({ days, currentDay }: DaySidebarProps) {
  const { isDayCompleted, isDayBookmarked, activeTrack } = useProgress();
  
  const modules = getModulesForTrack(activeTrack);
  const currentModule = modules.find(
    (m) => currentDay >= m.daysRange[0] && currentDay <= m.daysRange[1]
  );
  
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({
    [currentModule?.number || 1]: true,
  });

  const toggleModule = (modNum: number) => {
    setOpenModules((prev) => ({ ...prev, [modNum]: !prev[modNum] }));
  };

  return (
    <aside className="w-80 shrink-0 border-r border-slate-800 bg-slate-950/70 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto p-4 hidden lg:block">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{activeTrack} Curriculum</span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {days.length} Days
        </span>
      </div>

      <div className="space-y-3">
        {modules.map((mod) => {
          const isOpen = !!openModules[mod.number];
          const [start, end] = mod.daysRange;
          const modDays = days.filter((d) => d.day >= start && d.day <= end);
          
          let completedInMod = 0;
          modDays.forEach((d) => {
            if (isDayCompleted(d.day, activeTrack)) completedInMod++;
          });

          return (
            <div key={mod.number} className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
              {/* Module Header Button */}
              <button
                onClick={() => toggleModule(mod.number)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-850/60 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-400">
                    <span>Mod {mod.number}</span>
                    <span className="text-[10px] text-slate-500">
                      ({completedInMod}/{modDays.length})
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate mt-0.5">
                    {mod.title}
                  </div>
                </div>

                <div className="shrink-0 text-slate-500">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Day items list */}
              {isOpen && (
                <div className="border-t border-slate-800/60 p-1.5 space-y-1 bg-slate-950/60">
                  {modDays.map((d) => {
                    const isCurrent = d.day === currentDay;
                    const completed = isDayCompleted(d.day, activeTrack);
                    const bookmarked = isDayBookmarked(d.day, activeTrack);

                    return (
                      <Link
                        key={d.id}
                        href={`/${activeTrack}/day/${d.slug}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isCurrent
                            ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800/70'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[11px] shrink-0 text-slate-500">
                            Day {d.day}
                          </span>
                          <span className="truncate">{d.title}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pl-1.5">
                          {bookmarked && (
                            <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                          )}
                          {completed && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
