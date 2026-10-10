'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DayDetail, DayMeta, TrackYear } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';
import { MODULE_QUIZZES } from '@/lib/quizzes';
import { getModulesForTrack } from '@/lib/curriculum';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { NotesDrawer } from '@/components/NotesDrawer';
import { QuizModal } from '@/components/QuizModal';
import { DaySidebar } from '@/components/DaySidebar';
import {
  CheckCircle2,
  Circle,
  Bookmark,
  NotebookPen,
  HelpCircle,
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  Share2,
  Trophy,
  ChevronLeft,
} from 'lucide-react';

interface DayReaderClientProps {
  day: DayDetail;
  allDays: DayMeta[];
  track: TrackYear;
}

export function DayReaderClient({ day, allDays, track }: DayReaderClientProps) {
  const router = useRouter();
  const {
    isDayCompleted,
    isDayBookmarked,
    toggleDayCompleted,
    toggleDayBookmarked,
    fireConfetti,
  } = useProgress();

  const [notesOpen, setNotesOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const completed = isDayCompleted(day.day, track);
  const bookmarked = isDayBookmarked(day.day, track);

  const prevDay = day.day > 1 ? allDays.find((d) => d.day === day.day - 1) : null;
  const nextDay = allDays.find((d) => d.day === day.day + 1);

  const currentMod = getModulesForTrack(track).find((m) => m.number === day.moduleNumber);
  const isLastDayOfModule = currentMod && currentMod.daysRange[1] === day.day;
  const moduleQuiz = MODULE_QUIZZES[day.moduleNumber];

  const handleShare = () => {
    const text = `I'm learning Day ${day.day} (${day.title}) of the #90DaysOfDevOps challenge! 🚀`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex">
      {/* 90-Day Accordion Sidebar */}
      <DaySidebar days={allDays} currentDay={day.day} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Roadmap
          </Link>
          <span>/</span>
          <Link href="/modules" className="hover:text-cyan-400 transition-colors">
            Module {day.moduleNumber}: {day.moduleTitle}
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-mono">Day {day.day}</span>
        </div>

        {/* Day Header Banner */}
        <header className="border-b border-slate-800 pb-8 mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono font-bold text-xs">
                Day {day.day} of {allDays.length}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                Module {day.moduleNumber}: {day.moduleTitle}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{day.estimatedMinutes} min read</span>
              </div>
              <button
                onClick={handleShare}
                className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                title="Tweet your progress"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {day.title}
          </h1>

          {/* Tags */}
          {day.tags && day.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {day.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interactive Learning Toolbar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleDayCompleted(day.day, track)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                  completed
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                    : 'bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200'
                }`}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 fill-emerald-700 text-white" />
                    <span>Completed ✓</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleDayBookmarked(day.day, track)}
                className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  bookmarked
                    ? 'bg-amber-950/60 border-amber-700 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={bookmarked ? 'Remove bookmark' : 'Bookmark this day'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotesOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <NotebookPen className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Notes</span>
              </button>

              {moduleQuiz && (
                <button
                  onClick={() => setQuizOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950 border border-blue-800 hover:bg-blue-900 text-blue-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Module Quiz</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Markdown Content */}
        <article className="prose prose-invert max-w-none mb-12">
          <MarkdownViewer content={day.content} />
        </article>

        {/* End-of-Module Quiz Celebration Banner */}
        {isLastDayOfModule && moduleQuiz && (
          <div className="my-10 p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950 border border-blue-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-950">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Module {day.moduleNumber} Milestone Reached!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  You completed all days in this module. Verify your knowledge with the interactive quiz.
                </p>
              </div>
            </div>

            <button
              onClick={() => setQuizOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-lg shadow-blue-950"
            >
              Take Module Quiz Now
            </button>
          </div>
        )}

        {/* Bottom Pagination */}
        <footer className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
          {prevDay ? (
            <Link
              href={`/${track}/day/${prevDay.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 transition-all max-w-[45%]"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="min-w-0 text-left">
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Previous Day
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  Day {prevDay.day}: {prevDay.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextDay ? (
            <Link
              href={`/${track}/day/${nextDay.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-800 hover:bg-slate-850 text-slate-300 transition-all max-w-[45%] text-right"
            >
              <div className="min-w-0 text-right">
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Next Day
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  Day {nextDay.day}: {nextDay.title}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0" />
            </Link>
          ) : (
            <div />
          )}
        </footer>

        {/* Notes Drawer */}
        <NotesDrawer
          isOpen={notesOpen}
          onClose={() => setNotesOpen(false)}
          dayNumber={day.day}
          dayTitle={day.title}
        />

        {/* Module Quiz Modal */}
        {moduleQuiz && (
          <QuizModal
            quiz={moduleQuiz}
            isOpen={quizOpen}
            onClose={() => setQuizOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
