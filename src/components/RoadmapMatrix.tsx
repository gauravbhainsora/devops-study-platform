'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DayMeta } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
import { getModulesForTrack, TRACK_INFOS } from '@/lib/curriculum';
import daysIndexData from '@/lib/days-index.json';
import { CheckCircle2, Bookmark, Sparkles, Compass } from 'lucide-react';

interface RoadmapMatrixProps {
  days?: DayMeta[];
}

export function RoadmapMatrix({ days: propDays }: RoadmapMatrixProps) {
  const { isDayCompleted, isDayBookmarked, activeTrack } = useProgress();
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'bookmarked'>('all');
  const [hoveredDay, setHoveredDay] = useState<DayMeta | null>(null);

  // Get active track days dynamically
  const indexRecord = daysIndexData as unknown as Record<string, DayMeta[]>;
  const activeDays = (indexRecord[activeTrack] || indexRecord['2022'] || propDays || []) as DayMeta[];
  const activeModules = getModulesForTrack(activeTrack);
  const trackInfo = TRACK_INFOS[activeTrack] || TRACK_INFOS['2022'];

  const filteredDays = activeDays.filter((d) => {
    if (selectedModule !== 'all' && d.moduleNumber !== selectedModule) return false;
    const completed = isDayCompleted(d.day, activeTrack);
    const bookmarked = isDayBookmarked(d.day, activeTrack);
    if (filterStatus === 'completed' && !completed) return false;
    if (filterStatus === 'pending' && completed) return false;
    if (filterStatus === 'bookmarked' && !bookmarked) return false;
    return true;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold">
              {activeTrack} TRACK
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {trackInfo.focus.slice(0, 60)}...
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {trackInfo.title} Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {trackInfo.subtitle} Click any day to read notes and exercises.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filters */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'all' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'completed' ? 'bg-emerald-950 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'pending' ? 'bg-amber-950 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('bookmarked')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'bookmarked' ? 'bg-purple-950 text-purple-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Saved
            </button>
          </div>

          {/* Module dropdown */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 max-w-[200px] truncate"
          >
            <option value="all">All Modules</option>
            {activeModules.map((m) => (
              <option key={m.number} value={m.number}>
                Mod {m.number}: {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hover preview tooltip bar */}
      <div className="h-10 mb-4 px-4 py-2 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs transition-all">
        {hoveredDay ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="font-mono font-bold text-cyan-400 shrink-0">
              Day {hoveredDay.day}
            </span>
            <span className="text-slate-300 font-medium truncate">
              {hoveredDay.title}
            </span>
            <span className="text-slate-500 shrink-0">•</span>
            <span className="text-slate-400 truncate hidden sm:inline">
              Mod {hoveredDay.moduleNumber}: {hoveredDay.moduleTitle}
            </span>
          </div>
        ) : (
          <span className="text-slate-500 italic">
            Hover over any day square to preview topic and status
          </span>
        )}
      </div>

      {/* Interactive Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-10 lg:grid-cols-15 gap-2">
        {activeDays.map((day) => {
          const completed = isDayCompleted(day.day, activeTrack);
          const bookmarked = isDayBookmarked(day.day, activeTrack);
          const isDimmed =
            (selectedModule !== 'all' && day.moduleNumber !== selectedModule) ||
            (filterStatus === 'completed' && !completed) ||
            (filterStatus === 'pending' && completed) ||
            (filterStatus === 'bookmarked' && !bookmarked);

          return (
            <Link
              key={day.id}
              href={`/${activeTrack}/day/${day.slug}`}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`relative aspect-square rounded-xl p-1.5 flex flex-col justify-between transition-all transform hover:scale-105 hover:z-10 group border ${
                completed
                  ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-600/60 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/50'
              } ${isDimmed ? 'opacity-20 scale-95' : 'opacity-100'}`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[11px] font-mono font-bold ${
                    completed ? 'text-emerald-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                >
                  {day.day}
                </span>
                {completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />
                ) : bookmarked ? (
                  <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400" />
                )}
              </div>

              {/* Module indicator bar at bottom */}
              <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${
                    completed ? 'bg-emerald-400' : 'bg-slate-600 group-hover:bg-cyan-400'
                  }`}
                  style={{ width: '100%' }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-600" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-800" />
            <span>Not Started</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Saved / Bookmarked</span>
          </div>
        </div>

        <div className="font-mono text-slate-400">
          Showing {filteredDays.length} of {activeDays.length} Days ({activeTrack} Track)
        </div>
      </div>
    </div>
  );
}
