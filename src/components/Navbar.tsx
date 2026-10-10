'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import { TrackYear } from '@/lib/types';
import { useSession, signOut } from 'next-auth/react';
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
  Database,
  LogIn,
  LogOut,
  ChevronDown,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { href: '/', label: 'Roadmap', icon: Layers },
    { href: '/modules', label: 'Modules', icon: BookOpen },
    { href: '/quizzes', label: 'Quizzes', icon: HelpCircle },
    { href: '/cheatsheet', label: 'Cheatsheet', icon: Terminal },
    { href: '/badges', label: 'Badges', icon: Award },
    { href: '/notes', label: 'Notes', icon: NotebookPen },
  ];

  const tracks: { id: TrackYear; label: string; desc: string; days: number }[] = [
    { id: '2022', label: '2022 Foundations', desc: 'Core 90 Days Curriculum', days: 90 },
    { id: '2023', label: '2023 DevSecOps', desc: 'Security & Deep Dives', days: 90 },
    { id: '2024', label: '2024 Community', desc: '91 Community Sessions', days: 91 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand + Sleek Track Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-white text-xs tracking-tighter">90D</span>
              </div>
              <span className="font-bold text-slate-100 text-sm sm:text-base tracking-tight group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                90DaysOfDevOps
              </span>
            </Link>

            {/* Compact Track Switcher Pill */}
            <div className="relative inline-flex items-center shrink-0">
              <select
                value={activeTrack}
                onChange={(e) => setActiveTrack(e.target.value as TrackYear)}
                className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-mono font-bold text-xs rounded-full pl-2.5 pr-6 py-0.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all shadow-sm"
                aria-label="Select Track"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200 font-sans">
                    {t.id} Track ({t.days}d)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-1.5 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 p-2 xl:px-2.5 xl:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors group cursor-pointer shrink-0"
              title="Search curriculum (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
              <span className="hidden 2xl:inline text-xs">Search</span>
              <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* SQLite Database Sync Badge */}
            <button
              onClick={() => forceSyncDb()}
              className="hidden sm:flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-colors cursor-pointer group shrink-0"
              title={
                dbSyncStatus === 'synced'
                  ? 'SQLite DB Synced'
                  : dbSyncStatus === 'saving'
                  ? 'Saving changes to SQLite...'
                  : 'Offline (Click to retry SQLite sync)'
              }
            >
              <Database
                className={`w-3.5 h-3.5 shrink-0 ${
                  dbSyncStatus === 'synced'
                    ? 'text-emerald-400'
                    : dbSyncStatus === 'saving'
                    ? 'text-cyan-400 animate-spin'
                    : 'text-amber-400'
                }`}
              />
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-900/40 text-amber-400 text-xs font-semibold shrink-0"
              title={`Current Learning Streak: ${progress.currentStreak} days`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse shrink-0" />
              <span className="font-mono text-xs">{progress.currentStreak}d</span>
            </div>

            {/* User Authentication Profile */}
            {session?.user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full border border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer shrink-0"
                  title={session.user.name || session.user.email || 'My Profile'}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">
                        {session.user.name || 'DevOps Learner'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950/50 transition-colors cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-3">
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

          {/* Mobile User Profile Section */}
          <div className="pt-2 border-t border-slate-800">
            {session?.user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 text-xs font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with Google</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
