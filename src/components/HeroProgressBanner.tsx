'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useProgress } from '@/context/ProgressContext';
import { TRACK_INFOS } from '@/lib/curriculum';
import { Play, Flame, CheckCircle2, Trophy, Compass } from 'lucide-react';

interface HeroProgressBannerProps {
  firstDaySlug: string;
}

export function HeroProgressBanner({ firstDaySlug }: HeroProgressBannerProps) {
  const {
    progress,
    activeTrack,
    completedCount,
    progressPercentage,
    isDayCompleted,
  } = useProgress();

  const trackInfo = TRACK_INFOS[activeTrack] || TRACK_INFOS['2022'];

  // Find next uncompleted day
  const nextDayNumber = useMemo(() => {
    const total = trackInfo.totalDays || 90;
    for (let d = 1; d <= total; d++) {
      if (!isDayCompleted(d, activeTrack)) {
        return d;
      }
    }
    return total;
  }, [isDayCompleted, activeTrack, trackInfo.totalDays]);

  const nextSlug = `day-${String(nextDayNumber).padStart(2, '0')}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-8 sm:p-10 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{trackInfo.title} • {trackInfo.totalDays} Days</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {activeTrack === '2023' ? (
              <>Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-amber-400">DevSecOps</span> in 90 Days</>
            ) : activeTrack === '2024' ? (
              <>DevOps <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Community Edition</span> (91 Sessions)</>
            ) : (
              <>Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">DevOps</span> in 90 Days</>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {trackInfo.subtitle} Focus areas: {trackInfo.focus}.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/${activeTrack}/day/${nextSlug}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/50 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {completedCount === 0
                  ? 'Start Day 1'
                  : `Resume Day ${nextDayNumber}`}
              </span>
            </Link>

            <a
              href="#matrix"
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              Explore 90-Day Matrix
            </a>
          </div>
        </div>

        {/* Live Progress Stats Box */}
        <div className="w-full lg:w-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Momentum
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{progress.currentStreak} Day Streak</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold font-mono text-cyan-400">
                {completedCount}
                <span className="text-lg text-slate-500 font-normal"> / 90</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {progressPercentage}% Done
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(4, progressPercentage)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
              <div className="text-base font-bold font-mono text-emerald-400">
                {Object.keys(progress.quizScores).length}/13
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                Quizzes Taken
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-850">
              <div className="text-base font-bold font-mono text-amber-400">
                {Object.keys(progress.bookmarkedDays).length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                Saved Days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
