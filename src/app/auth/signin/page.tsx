'use client';

import React, { Suspense, useState, useEffect } from 'react';
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
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
  const errorParam = searchParams.get('error');

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [authStatus, setAuthStatus] = useState<{
    googleConfigured: boolean;
    secretConfigured: boolean;
  } | null>(null);

  const [demoName, setDemoName] = useState('Gaurav Bhainsora');
  const [demoEmail, setDemoEmail] = useState('gaurav@devops90.local');
  const [showCustomDemo, setShowCustomDemo] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth-status')
      .then((res) => res.json())
      .then((data) => setAuthStatus(data))
      .catch(() => setAuthStatus({ googleConfigured: false, secretConfigured: false }));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGoogleSignIn = async () => {
    if (authStatus && !authStatus.googleConfigured) {
      setShowDocs(true);
      return;
    }
    try {
      setLoadingGoogle(true);
      await signIn('google', { callbackUrl });
    } catch (err) {
      console.error('Sign in error:', err);
      setLoadingGoogle(false);
    }
  };

  const handleDemoSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoadingDemo(true);
      await signIn('credentials', {
        name: demoName || 'DevOps Explorer',
        email: demoEmail || 'learner@devops90.local',
        callbackUrl,
      });
    } catch (err) {
      console.error('Demo sign in error:', err);
      setLoadingDemo(false);
    }
  };

  const isGoogleAvailable = authStatus?.googleConfigured ?? false;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-lg tracking-tighter">90D</span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to DevOps Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Sync study progress, notes, and graduation certificate across all devices.
          </p>
        </div>

        {/* Error / Status Banner */}
        {errorParam && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-300">
                {errorParam === 'Configuration'
                  ? 'Server Configuration Notice'
                  : 'Authentication Error'}
              </p>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {errorParam === 'Configuration'
                  ? 'Google OAuth credentials have not been configured in your Vercel Project Environment Variables yet. You can sign in immediately below with Instant Demo Login or follow the Google Cloud guide.'
                  : 'Could not complete sign in. Please try again or use Instant Demo Login below.'}
              </p>
            </div>
          </div>
        )}

        {/* Sign In Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Google Sign In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer ${
                isGoogleAvailable
                  ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-white/5 hover:shadow-white/10'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <GoogleIcon />
              <span>
                {loadingGoogle
                  ? 'Connecting to Google...'
                  : isGoogleAvailable
                  ? 'Continue with Google'
                  : 'Continue with Google (Setup Needed)'}
              </span>
            </button>

            {!isGoogleAvailable && authStatus !== null && (
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  Google OAuth keys missing in Vercel
                </span>
                <button
                  type="button"
                  onClick={() => setShowDocs(true)}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Setup Guide &darr;
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative border-t border-slate-800 my-4">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 px-3 text-[10px] uppercase font-mono text-slate-500">
              OR INSTANT ACCESS
            </span>
          </div>

          {/* 1-Click Demo Sign In */}
          <div className="space-y-3">
            <button
              onClick={() => handleDemoSignIn()}
              disabled={loadingDemo}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/60 active:scale-[0.99] cursor-pointer disabled:opacity-70"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>{loadingDemo ? 'Signing in...' : '⚡ Instant 1-Click Sign In (Demo)'}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Sign in as <strong className="text-white">{demoName}</strong></span>
              <button
                type="button"
                onClick={() => setShowCustomDemo(!showCustomDemo)}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                {showCustomDemo ? 'Hide options' : 'Customize profile'}
              </button>
            </div>

            {/* Custom Demo Form */}
            {showCustomDemo && (
              <form
                onSubmit={handleDemoSignIn}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingDemo}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Sign In with Custom Profile
                </button>
              </form>
            )}
          </div>

          {/* Secure OAuth Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Secure session storage & JWT tokens</span>
          </div>

          {/* Value Propositions */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Cloud Sync:</strong> Track progress and 90-day completion streak.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <NotebookPen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Personal Study Notes:</strong> Save command snippets and takeaways.
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Graduation Certificate:</strong> Issued in your name upon course completion.
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
              <span>How to setup Google Cloud OAuth in Vercel</span>
            </div>
            {showDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDocs && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-slate-300 space-y-4 leading-relaxed">
              <p className="text-[11px] text-slate-400">
                To connect real Google accounts on your Vercel deployment and local dev server:
              </p>

              <div className="space-y-3 text-[11px]">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>1. Google Cloud Console Credentials</span>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline inline-flex items-center gap-0.5 font-normal ml-auto"
                    >
                      Open Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <p className="text-slate-400">
                    Create <strong>OAuth Client ID</strong> &rarr; Application Type: <strong>Web application</strong>.
                  </p>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Authorized JavaScript origins:
                    </label>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-300">
                      <span>https://devops-90days-platform.vercel.app</span>
                      <button
                        onClick={() =>
                          handleCopy('https://devops-90days-platform.vercel.app', 'origin')
                        }
                        className="text-slate-400 hover:text-white ml-2"
                        title="Copy"
                      >
                        {copiedKey === 'origin' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Authorized redirect URIs:
                    </label>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-300">
                      <span className="break-all">
                        https://devops-90days-platform.vercel.app/api/auth/callback/google
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            'https://devops-90days-platform.vercel.app/api/auth/callback/google',
                            'callback'
                          )
                        }
                        className="text-slate-400 hover:text-white ml-2 shrink-0"
                        title="Copy"
                      >
                        {copiedKey === 'callback' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <p className="font-semibold text-white">
                    2. Add Environment Variables to Vercel
                  </p>
                  <p className="text-slate-400">
                    In Vercel Dashboard &rarr; Project Settings &rarr; <strong>Environment Variables</strong>:
                  </p>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-950 text-amber-300">
                      <span>AUTH_GOOGLE_ID = &lt;your-google-client-id&gt;</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-950 text-amber-300">
                      <span>AUTH_GOOGLE_SECRET = &lt;your-google-client-secret&gt;</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-950 text-cyan-300">
                      <span className="truncate">
                        AUTH_SECRET = faf14da9b8a4da30d541f9581c4cf3e4c683fc639567220fed3925d6c9f0b71a
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            'faf14da9b8a4da30d541f9581c4cf3e4c683fc639567220fed3925d6c9f0b71a',
                            'secret'
                          )
                        }
                        className="text-slate-400 hover:text-white ml-2 shrink-0"
                        title="Copy Secret"
                      >
                        {copiedKey === 'secret' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    After adding variables in Vercel, trigger a redeploy or push a new commit to apply.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-slate-500">
          Loading sign in...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
