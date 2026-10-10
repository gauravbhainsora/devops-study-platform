'use client';

import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ProgressProvider, useProgress } from '@/context/ProgressContext';
import { Navbar } from './Navbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { CertificateModal } from './CertificateModal';
import daysIndexData from '@/lib/days-index.json';
import { DayMeta, TrackYear } from '@/lib/types';
import { Heart, GitBranch, Award, ExternalLink } from 'lucide-react';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { activeTrack } = useProgress();
  const [searchOpen, setSearchOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  const indexRecord = daysIndexData as unknown as Record<string, DayMeta[]>;
  const daysForTrack = (indexRecord[activeTrack] || indexRecord['2022'] || []) as DayMeta[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">{children}</main>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        days={daysForTrack}
      />

      <CertificateModal
        isOpen={certOpen}
        onClose={() => setCertOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Built for DevOps learners worldwide. Content by</span>
            <a
              href="https://github.com/MichaelCade/90DaysOfDevOps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
            >
              Michael Cade <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCertOpen(true)}
              className="text-slate-400 hover:text-cyan-400 font-medium flex items-center gap-1 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Completion Certificate</span>
            </button>

            <a
              href="https://github.com/MichaelCade/90DaysOfDevOps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProgressProvider>
        <LayoutInner>{children}</LayoutInner>
      </ProgressProvider>
    </SessionProvider>
  );
}
