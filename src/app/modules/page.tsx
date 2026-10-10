'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MODULES_2022 } from '@/lib/curriculum';
import { MODULE_QUIZZES } from '@/lib/quizzes';
import { QuizModal } from '@/components/QuizModal';
import { useProgress } from '@/context/ProgressContext';
import daysIndexData from '@/lib/days-index.json';
import { DayMeta, ModuleQuiz } from '@/lib/types';
import {
  BookOpen,
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
  Clock,
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

export default function ModulesPage() {
  const { isDayCompleted, activeTrack, getModuleQuizScore } = useProgress();
  const [activeQuiz, setActiveQuiz] = useState<ModuleQuiz | null>(null);

  const indexRecord = daysIndexData as unknown as Record<string, DayMeta[]>;
  const days2022 = (indexRecord['2022'] || []) as DayMeta[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Syllabus</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          13 DevOps Curriculum Modules
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Master each domain step-by-step. Each module groups continuous days with dedicated hands-on exercises, real tools, and a knowledge-check quiz.
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {MODULES_2022.map((mod) => {
          const Icon = ICON_MAP[mod.icon] || Layers;
          const [startDay, endDay] = mod.daysRange;
          const modDays = days2022.filter((d) => d.day >= startDay && d.day <= endDay);

          let completedCount = 0;
          modDays.forEach((d) => {
            if (isDayCompleted(d.day, activeTrack)) completedCount++;
          });

          const totalDays = endDay - startDay + 1;
          const percent = Math.round((completedCount / totalDays) * 100);
          const quizResult = getModuleQuizScore(mod.number);
          const quizDef = MODULE_QUIZZES[mod.number];

          return (
            <div
              key={mod.number}
              id={`module-${mod.number}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden shadow-xl"
            >
              {/* Module Header Bar */}
              <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${mod.bgGradient} border ${mod.borderColor} shrink-0`}
                  >
                    <Icon className={`w-7 h-7 ${mod.color}`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        Module {mod.number}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Days {startDay}–{endDay}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mt-1">
                      {mod.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">
                      {completedCount} / {totalDays} Completed
                    </div>
                    <div className="font-mono text-sm font-bold text-cyan-400">
                      {percent}%
                    </div>
                  </div>

                  {quizDef && (
                    <button
                      onClick={() => setActiveQuiz(quizDef)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        quizResult
                          ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-950'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>
                        {quizResult
                          ? `Quiz: ${quizResult.percentage}%`
                          : 'Take Quiz'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Day items within module */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modDays.map((d) => {
                  const completed = isDayCompleted(d.day, activeTrack);

                  return (
                    <Link
                      key={d.id}
                      href={`/${activeTrack}/day/${d.slug}`}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                        completed
                          ? 'bg-emerald-950/30 border-emerald-800/60 hover:border-emerald-600'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-cyan-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            completed
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                              : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'
                          }`}
                        >
                          D{d.day}
                        </span>

                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                            {d.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {d.estimatedMinutes} min
                          </span>
                        </div>
                      </div>

                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
        />
      )}
    </div>
  );
}
