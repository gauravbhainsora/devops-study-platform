'use client';

import React, { useState } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { X, Printer, Award, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const { progress, setUserName, completedCount } = useProgress();
  const [nameInput, setNameInput] = useState(progress.userName || 'DevOps Engineer');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveName = () => {
    setUserName(nameInput);
  };

  const verificationCode = `90D-${Math.abs(
    nameInput.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase()}-2026`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Recipient Name:</span>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleSaveName}
              className="bg-slate-900 border border-slate-700 text-slate-100 px-3 py-1 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
              placeholder="Your Full Name"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col items-center text-center relative border-8 border-slate-800/80 m-4 rounded-2xl print:border-4 print:m-0 print:p-8">
          {/* Subtle Decorative Corners */}
          <div className="absolute top-4 left-4 text-cyan-500/40 font-mono text-xs">◆ ◆ ◆</div>
          <div className="absolute top-4 right-4 text-cyan-500/40 font-mono text-xs">◆ ◆ ◆</div>
          <div className="absolute bottom-4 left-4 text-cyan-500/40 font-mono text-xs">◆ ◆ ◆</div>
          <div className="absolute bottom-4 right-4 text-cyan-500/40 font-mono text-xs">◆ ◆ ◆</div>

          {/* Logo / Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-950 mb-6">
            <Award className="w-9 h-9" />
          </div>

          <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
            Certificate of Completion
          </h2>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 font-serif">
            90 Days of DevOps
          </h1>

          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            This certifies that
          </p>

          <div className="text-2xl sm:text-3xl font-bold text-cyan-300 border-b-2 border-cyan-500/40 pb-2 px-8 mb-6 font-serif">
            {nameInput || 'DevOps Engineer'}
          </div>

          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            has demonstrated dedication and technical proficiency across all 13 core disciplines:
            Linux Administration, Networking, Go Programming, Docker Containers, Kubernetes Orchestration,
            Terraform IaC, Ansible Configuration, CI/CD Pipelines, Prometheus & Grafana Observability, and Data Protection.
          </p>

          <div className="w-full flex items-center justify-between text-left text-xs pt-6 border-t border-slate-800 text-slate-400">
            <div>
              <div className="font-semibold text-slate-200">90DaysOfDevOps Platform</div>
              <div className="text-[10px] text-slate-500">Curriculum by Michael Cade</div>
            </div>

            <div className="text-center">
              <div className="font-mono font-bold text-emerald-400">{completedCount}/90 Days</div>
              <div className="text-[10px] text-slate-500">Progress Verified</div>
            </div>

            <div className="text-right">
              <div className="font-mono text-slate-400 text-[11px]">{verificationCode}</div>
              <div className="text-[10px] text-slate-500">Credential ID</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
