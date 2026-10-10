'use client';

import React, { useState } from 'react';
import { CHEATSHEET_COMMANDS } from '@/lib/cheatsheet';
import { Terminal, Search, Copy, Check, Filter, ExternalLink } from 'lucide-react';

export default function CheatSheetPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Linux',
    'Docker',
    'Kubernetes',
    'Git',
    'Terraform',
    'Ansible',
    'Networking',
    'Monitoring',
    'CI/CD',
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = CHEATSHEET_COMMANDS.filter((cmd) => {
    if (selectedCategory !== 'All' && cmd.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cmd.command.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      (cmd.example && cmd.example.toLowerCase().includes(q)) ||
      cmd.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Quick Reference Database</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          DevOps CLI Cheat Sheet
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          The essential terminal commands for day-to-day DevOps work: Linux administration, container runtime, Kubernetes management, Terraform workflows, and debugging.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands, flags, tools, or keywords..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white font-semibold shadow-md shadow-cyan-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommands.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-500 text-sm">
            No commands found matching &quot;<span className="text-slate-300">{searchQuery}</span>&quot;.
          </div>
        ) : (
          filteredCommands.map((item) => {
            const isCopied = copiedId === item.id;
            const targetText = item.example || item.command;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-850"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Command Block with Copy Button */}
                <div className="rounded-xl bg-slate-950 border border-slate-850 p-3 font-mono text-xs flex items-center justify-between gap-3 group">
                  <code className="text-cyan-300 truncate font-semibold">
                    {item.command}
                  </code>

                  <button
                    onClick={() => handleCopy(item.id, targetText)}
                    className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Copy command"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
