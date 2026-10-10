'use client';

import React, { useState, useEffect } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { X, Save, NotebookPen, Check, Download } from 'lucide-react';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  dayTitle: string;
}

export function NotesDrawer({ isOpen, onClose, dayNumber, dayTitle }: NotesDrawerProps) {
  const { getDayNote, saveDayNote, activeTrack } = useProgress();
  const [noteContent, setNoteContent] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNoteContent(getDayNote(dayNumber, activeTrack));
      setSavedStatus(false);
    }
  }, [isOpen, dayNumber, activeTrack, getDayNote]);

  const handleSave = () => {
    saveDayNote(dayNumber, noteContent, activeTrack);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([noteContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Day-${dayNumber}-Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <NotebookPen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Personal Notes
              </h3>
              <span className="text-xs text-slate-400 truncate block max-w-[240px]">
                Day {dayNumber}: {dayTitle}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Textarea */}
        <div className="flex-1 p-4 flex flex-col">
          <textarea
            value={noteContent}
            onChange={(e) => {
              setNoteContent(e.target.value);
              // auto-save on typing
              saveDayNote(dayNumber, e.target.value, activeTrack);
            }}
            placeholder="Type your notes, key insights, CLI commands to remember, or questions here (Markdown supported)..."
            className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono resize-none leading-relaxed placeholder:text-slate-600"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            disabled={!noteContent.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium transition-colors"
            title="Download note as markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 transition-colors"
          >
            {savedStatus ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
