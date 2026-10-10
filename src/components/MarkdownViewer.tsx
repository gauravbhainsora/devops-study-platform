'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800/80 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider font-semibold text-slate-300">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-200">
        <code>{codeString}</code>
      </div>
    </div>
  );
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="markdown-body max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className && !String(children).includes('\n');
            if (isInline) {
              return (
                <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-cyan-900/30" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          img({ src, alt, ...props }) {
            const srcStr = typeof src === 'string' ? src : '';
            let finalSrc = srcStr;
            // If relative image path like Images/DayXX.png
            if (finalSrc.startsWith('Images/')) {
              finalSrc = `/${finalSrc}`;
            } else if (finalSrc.startsWith('images/')) {
              finalSrc = `/Images/${finalSrc.replace(/^images\//, '')}`;
            } else if (!finalSrc.startsWith('http') && !finalSrc.startsWith('/')) {
              finalSrc = `/${finalSrc}`;
            }

            return (
              <figure className="my-6">
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={finalSrc}
                    alt={alt || 'DevOps illustration'}
                    className="w-full max-h-[550px] object-contain mx-auto"
                    loading="lazy"
                    {...props}
                  />
                </div>
                {alt && (
                  <figcaption className="text-center text-xs text-slate-400 mt-2 italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 underline font-medium"
                {...props}
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="w-3 h-3 inline-block ml-0.5 opacity-70" />}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-5 pl-4 border-l-4 border-cyan-500 bg-cyan-950/20 py-2 pr-3 rounded-r-lg text-slate-300 italic">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
