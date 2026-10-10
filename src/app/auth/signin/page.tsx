'use client';

import React, { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Database,
  NotebookPen,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn('google', { callbackUrl });
    } catch (err) {
      console.error('Sign in error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-lg tracking-tighter">90D</span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to 90DaysOfDevOps
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Sync your 90-day learning progress, study notes, and quiz achievements across all devices.
          </p>
        </div>

        {/* Sign In Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-lg shadow-white/5 hover:shadow-white/10 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            <GoogleIcon />
            <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Secure OAuth Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Secure authentication via Google OAuth 2.0</span>
          </div>

          <div className="relative border-t border-slate-800 pt-5">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 px-3 text-[10px] uppercase font-mono text-slate-500">
              Why Sign In?
            </span>
          </div>

          {/* Value Propositions */}
          <div className="space-y-3 pt-1 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Cloud & SQLite Sync:</strong> Your completed days and streak are preserved permanently.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <NotebookPen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Synced Personal Notes:</strong> Access your commands and takeaways anywhere.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Personalized Certificate:</strong> Receive a verified certificate in your name upon graduation.
              </span>
            </div>
          </div>

          {/* Guest fallback */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <Link
              href={callbackUrl}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>Continue as Guest without signing in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Setup Guide Collapsible */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden text-xs">
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="w-full flex items-center justify-between p-4 text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>How to setup Google Cloud OAuth credentials</span>
            </div>
            {showDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDocs && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-slate-300 space-y-3 leading-relaxed">
              <p className="text-[11px] text-slate-400">
                To connect your Google account to your deployed Vercel platform or local dev server:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-300">
                <li>
                  Go to{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  Click <strong>&quot;Create Credentials&quot;</strong> &rarr; <strong>&quot;OAuth client ID&quot;</strong> (Application type: <em>Web application</em>).
                </li>
                <li>
                  Under <strong>Authorized JavaScript origins</strong>, add:
                  <code className="block mt-1 p-1.5 rounded bg-slate-900 font-mono text-[10px] text-cyan-300">
                    http://localhost:3000<br />
                    https://devops-90days-platform.vercel.app
                  </code>
                </li>
                <li>
                  Under <strong>Authorized redirect URIs</strong>, add:
                  <code className="block mt-1 p-1.5 rounded bg-slate-900 font-mono text-[10px] text-cyan-300">
                    http://localhost:3000/api/auth/callback/google<br />
                    https://devops-90days-platform.vercel.app/api/auth/callback/google
                  </code>
                </li>
                <li>
                  Copy your <strong>Client ID</strong> &amp; <strong>Client Secret</strong> into Vercel Project Settings &rarr; <strong>Environment Variables</strong>:
                  <code className="block mt-1 p-1.5 rounded bg-slate-900 font-mono text-[10px] text-amber-300">
                    AUTH_GOOGLE_ID=your-client-id<br />
                    AUTH_GOOGLE_SECRET=your-client-secret<br />
                    AUTH_SECRET=faf14da9b8a4da30d541f9581c4cf3e4c683fc639567220fed3925d6c9f0b71a<br />
                    AUTH_TRUST_HOST=true
                  </code>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-slate-500">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}
