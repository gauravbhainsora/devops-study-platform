import React from 'react';
import Link from 'next/link';
import { getAllDays } from '@/lib/content';
import { RoadmapMatrix } from '@/components/RoadmapMatrix';
import { ModuleCards } from '@/components/ModuleCards';
import { HeroProgressBanner } from '@/components/HeroProgressBanner';
import {
  Terminal,
  HelpCircle,
  Award,
  NotebookPen,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export default function HomePage() {
  const days = getAllDays('2022');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero & Progress Banner */}
      <HeroProgressBanner firstDaySlug={days[0]?.slug || 'day-01'} />

      {/* Interactive 90-Day Learning Matrix */}
      <section id="matrix">
        <RoadmapMatrix days={days} />
      </section>

      {/* Feature Quick-Access Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/cheatsheet"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850/80 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300">
              DevOps CLI Cheat Sheet
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Linux, Docker, K8s & Terraform commands
            </p>
          </div>
        </Link>

        <Link
          href="/quizzes"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850/80 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-3">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-300">
              Module Quizzes
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Test retention with 13 knowledge checks
            </p>
          </div>
        </Link>

        <Link
          href="/badges"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850/80 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-300">
              Achievements & Badges
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Unlock 16 milestone badges as you learn
            </p>
          </div>
        </Link>

        <Link
          href="/notes"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850/80 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-3">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 group-hover:text-purple-300">
              My Learning Notes
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Access & export notes taken across days
            </p>
          </div>
        </Link>
      </section>

      {/* 13 Structured Modules */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              13 Structured DevOps Modules
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              From culture and programming to containers, orchestration, automation, and observability.
            </p>
          </div>

          <Link
            href="/modules"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold self-start sm:self-auto"
          >
            View Module Details →
          </Link>
        </div>

        <ModuleCards />
      </section>
    </div>
  );
}
