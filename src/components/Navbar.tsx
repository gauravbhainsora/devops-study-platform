'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import { TrackYear } from '@/lib/types';
import {
  Flame,
  Search,
  BookOpen,
  Layers,
  HelpCircle,
  Terminal,
  Award,
  NotebookPen,
  Menu,
  X,
  CheckCircle2,
  Database,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const {
    activeTrack,
    setActiveTrack,
    completedCount,
    progressPercentage,
    progress,
    dbSyncStatus,
    forceSyncDb,
  } = useProgress();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Roadmap', icon: Layers },
    { href: '/modules', label: 'Modules', icon: BookOpen },
    { href: '/quizzes', label: 'Quizzes', icon: HelpCircle },
    { href: '/cheatsheet', label: 'CLI Cheat Sheet', icon: Terminal },
    { href: '/badges', label: 'Badges', icon: Award },
    { href: '/notes', label: 'My Notes', icon: NotebookPen },
  ];

  const tracks: { id: TrackYear; label: string; desc: string; days: number }[] = [
    { id: '2022', label: '2022 DevOps Foundations', desc: 'Core 90 Days Curriculum', days: 90 },
    { id: '2023', label: '2023 DevSecOps Track', desc: 'Security & Deep Dives', days: 90 },
    { id: '2024', label: '2024 Community Edition', desc: '91 Community Sessions', days: 91 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-white text-base tracking-tighter">90D</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-100 text-lg tracking-tight group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  90DaysOfDevOps
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-medium">
                    {activeTrack}
                  </span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Interactive Learning Platform
                </span>
              </div>
            </Link>

            {/* Track Switcher */}
            <div className="relative hidden lg:block">
              <select
                value={activeTrack}
                onChange={(e) => setActiveTrack(e.target.value as TrackYear)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium cursor-pointer hover:bg-slate-800/80 transition-colors"
                aria-label="Select Track"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.days} Days)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors group cursor-pointer"
              title="Search curriculum (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="hidden sm:inline">Search Days...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* SQLite Database Sync Badge */}
            <button
              onClick={() => forceSyncDb()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-colors cursor-pointer group"
              title={
                dbSyncStatus === 'synced'
                  ? 'All progress & notes saved in SQLite database'
                  : dbSyncStatus === 'saving'
                  ? 'Saving changes to SQLite database...'
                  : 'Operating locally (Click to retry SQLite sync)'
              }
            >
              <Database
                className={`w-3.5 h-3.5 ${
                  dbSyncStatus === 'synced'
                    ? 'text-emerald-400'
                    : dbSyncStatus === 'saving'
                    ? 'text-cyan-400 animate-spin'
                    : 'text-amber-400'
                }`}
              />
              <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200">
                {dbSyncStatus === 'synced'
                  ? 'SQLite DB'
                  : dbSyncStatus === 'saving'
                  ? 'Saving...'
                  : 'Offline DB'}
              </span>
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-900/40 text-amber-400 text-xs font-semibold"
              title={`Current Learning Streak: ${progress.currentStreak} days`}
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{progress.currentStreak}d</span>
            </div>

            {/* Overall Progress Pill */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-800 transition-colors"
              title={`${completedCount} of 90 days completed`}
            >
              <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, progressPercentage))}%` }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-slate-300">
                {progressPercentage}%
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-3">
          <div className="pb-2 border-b border-slate-800">
            <label className="text-xs text-slate-400 block mb-1">Select Track</label>
            <select
              value={activeTrack}
              onChange={(e) => setActiveTrack(e.target.value as TrackYear)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.days} Days)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800'
                      : 'bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span>Overall Progress:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {completedCount} / 90 days ({progressPercentage}%)
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
