'use client';

import React from 'react';
import Link from 'next/link';
import { getModulesForTrack } from '@/lib/curriculum';
import { useProgress } from '@/context/ProgressContext';
import {
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
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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
};

export function ModuleCards() {
  const { isDayCompleted, activeTrack, getModuleQuizScore } = useProgress();
  const modules = getModulesForTrack(activeTrack);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((mod) => {
        const Icon = ICON_MAP[mod.icon] || Layers;
        const [startDay, endDay] = mod.daysRange;
        const totalDays = endDay - startDay + 1;

        let completedInModule = 0;
        for (let d = startDay; d <= endDay; d++) {
          if (isDayCompleted(d, activeTrack)) {
            completedInModule++;
          }
        }

        const percentage = Math.round((completedInModule / totalDays) * 100);
        const isModuleFinished = completedInModule === totalDays;
        const quizResult = getModuleQuizScore(mod.number);

        return (
          <div
            key={mod.number}
            className={`group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-slate-900/50 backdrop-blur-sm ${
              isModuleFinished
                ? 'border-emerald-600/40 shadow-emerald-950/20'
                : 'border-slate-800 hover:border-cyan-600/50'
            }`}
          >
            <div>
              {/* Module Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${mod.bgGradient} border ${mod.borderColor}`}
                  >
                    <Icon className={`w-6 h-6 ${mod.color}`} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Module {mod.number}
                    </span>
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                      {mod.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  Days {startDay}–{endDay}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {mod.description}
              </p>

              {/* Topics Pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mod.topics.slice(0, 3).map((topic, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400"
                  >
                    {topic}
                  </span>
                ))}
                {mod.topics.length > 3 && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-950 text-slate-500">
                    +{mod.topics.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Progress & Actions Footer */}
            <div className="pt-4 border-t border-slate-800/80">
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">
                  {completedInModule} of {totalDays} days
                </span>
                <span className="font-mono font-bold text-cyan-400">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isModuleFinished
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/${activeTrack}/day/day-${String(startDay).padStart(2, '0')}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 text-xs font-semibold transition-colors"
                >
                  <span>Start Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/quizzes?mod=${mod.number}`}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-center transition-colors ${
                    quizResult
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800'
                  }`}
                  title={
                    quizResult
                      ? `Quiz completed: ${quizResult.score}/${quizResult.total} (${quizResult.percentage}%)`
                      : 'Take Module Quiz'
                  }
                >
                  <HelpCircle className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
