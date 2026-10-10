'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/context/ProgressContext';
import daysIndexData from '@/lib/days-index.json';
import { DayMeta } from '@/lib/types';
import {
  NotebookPen,
  Download,
  Trash2,
  Search,
  ExternalLink,
  Save,
  Check,
} from 'lucide-react';

export default function NotesPage() {
  const { progress, saveDayNote, activeTrack } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const indexRecord = daysIndexData as unknown as Record<string, DayMeta[]>;

  // Collect all notes
  const notesList = Object.entries(progress.notes)
    .filter(([key, content]) => content && content.trim().length > 0)
    .map(([key, content]) => {
      // key format: "2022-1" or "2023-1"
      const parts = key.split('-');
      const year = parts[0] || activeTrack;
      const dayNum = parseInt(parts[parts.length - 1], 10);
      const trackDays = (indexRecord[year] || indexRecord[activeTrack] || []) as DayMeta[];
      const dayMeta = trackDays.find((d) => d.day === dayNum);

      return {
        key,
        year,
        dayNum,
        title: dayMeta?.title || `Day ${dayNum}`,
        slug: dayMeta?.slug || `day-${String(dayNum).padStart(2, '0')}`,
        content,
      };
    })
    .sort((a, b) => a.dayNum - b.dayNum);

  const filteredNotes = notesList.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      String(n.dayNum).includes(q)
    );
  });

  const handleExportAll = () => {
    let combined = `# My 90DaysOfDevOps Learning Notes\n\nExported on ${new Date().toLocaleDateString()}\n\n---\n\n`;
    notesList.forEach((n) => {
      combined += `## Day ${n.dayNum}: ${n.title}\n\n${n.content}\n\n---\n\n`;
    });

    const blob = new Blob([combined], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `90DaysOfDevOps-All-Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = (key: string, content: string) => {
    setEditingKey(key);
    setTempNote(content);
  };

  const handleSaveEdit = (dayNum: number) => {
    saveDayNote(dayNum, tempNote, activeTrack);
    setEditingKey(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/80 text-purple-400 text-xs font-semibold mb-3">
            <NotebookPen className="w-3.5 h-3.5" />
            <span>Personal Notebook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Learning Notes
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            All your notes, code snippets, reflections, and insights recorded across the 90 days in one place.
          </p>
        </div>

        {/* Export Button */}
        {notesList.length > 0 && (
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export All Notes (.md)</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      {notesList.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your saved notes..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Notes List */}
      {notesList.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
          <NotebookPen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No notes saved yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            As you read through each day, click the &quot;My Notes&quot; button in the header to write personal notes, commands, or takeaways.
          </p>
          <Link
            href={`/${activeTrack}/day/day-01`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
          >
            Start Day 1
          </Link>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          No notes match your search &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => {
            const isEditing = editingKey === note.key;

            return (
              <div
                key={note.key}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-lg backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-xs font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/80">
                      Day {note.dayNum}
                    </span>

                    <Link
                      href={`/${note.year}/day/${note.slug}`}
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                    >
                      <span>Open Day</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <h3 className="font-bold text-white text-base mb-3">
                    {note.title}
                  </h3>

                  {isEditing ? (
                    <textarea
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none mb-3"
                    />
                  ) : (
                    <div className="text-xs text-slate-300 font-mono bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mb-3">
                      {note.content}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(note.dayNum)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-850 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(note.key, note.content)}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Edit note
                    </button>
                  )}

                  <button
                    onClick={() => saveDayNote(note.dayNum, '', activeTrack)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
