'use client';

import React from 'react';
import { BADGES } from '@/lib/curriculum';
import { useProgress } from '@/context/ProgressContext';
import {
  Award,
  Footprints,
  Sparkles,
  Code2,
  Terminal,
  Network,
  Cloud,
  GitBranch,
  Box,
  Layers,
  Cpu,
  Sliders,
  Workflow,
  Activity,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Footprints,
  Sparkles,
  Code2,
  Terminal,
  Network,
  Cloud,
  GitBranch,
  Box,
  Layers,
  Cpu,
  Sliders,
  Workflow,
  Activity,
  ShieldCheck,
  Trophy,
};

export default function BadgesPage() {
  const { unlockedBadges, completedCount, fireConfetti } = useProgress();

  const unlockedIds = new Set(unlockedBadges.map((b) => b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/80 text-amber-400 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Gamified Milestones</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learning Achievements & Badges
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Earn badges by conquering each module and maintaining learning momentum across the 90 days.
          </p>
        </div>

        {/* Unlocked Summary Pill */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Badges Unlocked</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {unlockedBadges.length} / {BADGES.length}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {completedCount} Days Completed
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BADGES.map((badge) => {
          const Icon = ICON_MAP[badge.icon] || Award;
          const isUnlocked = unlockedIds.has(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => {
                if (isUnlocked) fireConfetti();
              }}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-600/50 shadow-xl shadow-amber-950/20 hover:scale-102 cursor-pointer'
                  : 'bg-slate-900/30 border-slate-850 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-950'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                Criteria: {badge.criteria}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
