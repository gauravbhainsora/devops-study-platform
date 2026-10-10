'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MODULE_QUIZZES } from '@/lib/quizzes';
import { MODULES_2022 } from '@/lib/curriculum';
import { QuizModal } from '@/components/QuizModal';
import { useProgress } from '@/context/ProgressContext';
import { ModuleQuiz } from '@/lib/types';
import {
  HelpCircle,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Award,
} from 'lucide-react';

function QuizzesContent() {
  const searchParams = useSearchParams();
  const modParam = searchParams.get('mod');
  const { getModuleQuizScore } = useProgress();
  const [activeQuiz, setActiveQuiz] = useState<ModuleQuiz | null>(null);

  // If mod param present, open quiz modal automatically
  useEffect(() => {
    if (modParam) {
      const modNum = parseInt(modParam, 10);
      if (MODULE_QUIZZES[modNum]) {
        setActiveQuiz(MODULE_QUIZZES[modNum]);
      }
    }
  }, [modParam]);

  const quizList = Object.values(MODULE_QUIZZES);

  let totalScore = 0;
  let totalQuestions = 0;
  let completedQuizzesCount = 0;

  quizList.forEach((q) => {
    const res = getModuleQuizScore(q.moduleNumber);
    if (res) {
      totalScore += res.score;
      totalQuestions += res.total;
      completedQuizzesCount++;
    }
  });

  const overallAverage =
    totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/80 text-blue-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Knowledge Checks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            DevOps Module Quizzes
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Validate what you learn with curated technical questions for each module. Earn mastery badges and track your retention.
          </p>
        </div>

        {/* Aggregate Stats Card */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Quizzes Completed</div>
            <div className="text-xl font-bold font-mono text-white">
              {completedQuizzesCount} / {quizList.length}
            </div>
            {totalQuestions > 0 && (
              <div className="text-xs text-emerald-400 font-mono mt-0.5">
                {overallAverage}% Avg Score
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizList.map((quiz) => {
          const modInfo = MODULES_2022.find((m) => m.number === quiz.moduleNumber);
          const scoreData = getModuleQuizScore(quiz.moduleNumber);
          const isPassed = scoreData && scoreData.percentage >= 80;

          return (
            <div
              key={quiz.moduleNumber}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all bg-slate-900/50 backdrop-blur-sm ${
                isPassed
                  ? 'border-emerald-600/40 shadow-emerald-950/20'
                  : scoreData
                  ? 'border-amber-600/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Module {quiz.moduleNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {quiz.questions.length} Questions
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-2">
                  {modInfo?.title || quiz.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-5 leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                {scoreData ? (
                  <div className="flex items-center justify-between mb-4 bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
                    <div className="flex items-center gap-2">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      )}
                      <span className="text-xs font-semibold text-slate-300">
                        {isPassed ? 'Passed' : 'Needs Review'}
                      </span>
                    </div>

                    <div className="font-mono text-xs font-bold text-cyan-400">
                      {scoreData.score}/{scoreData.total} ({scoreData.percentage}%)
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 mb-4 italic">
                    Not attempted yet
                  </div>
                )}

                <button
                  onClick={() => setActiveQuiz(quiz)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    scoreData
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950'
                  }`}
                >
                  {scoreData ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Quiz</span>
                    </>
                  )}
                </button>
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

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 text-slate-400">Loading quizzes...</div>}>
      <QuizzesContent />
    </Suspense>
  );
}
