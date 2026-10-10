'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { UserProgress, Badge, TrackYear } from '@/lib/types';
import { BADGES } from '@/lib/curriculum';

interface ProgressContextType {
  progress: UserProgress;
  activeTrack: TrackYear;
  setActiveTrack: (track: TrackYear) => void;
  isDayCompleted: (dayNumber: number, year?: TrackYear) => boolean;
  isDayBookmarked: (dayNumber: number, year?: TrackYear) => boolean;
  toggleDayCompleted: (dayNumber: number, year?: TrackYear) => void;
  toggleDayBookmarked: (dayNumber: number, year?: TrackYear) => void;
  getDayNote: (dayNumber: number, year?: TrackYear) => string;
  saveDayNote: (dayNumber: number, note: string, year?: TrackYear) => void;
  recordQuizScore: (moduleNumber: number, score: number, total: number) => void;
  getModuleQuizScore: (moduleNumber: number) => { score: number; total: number; percentage: number; completedAt: string } | null;
  completedCount: number;
  progressPercentage: number;
  unlockedBadges: Badge[];
  setUserName: (name: string) => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  fireConfetti: () => void;
  dbSyncStatus: 'synced' | 'saving' | 'offline';
  forceSyncDb: () => Promise<void>;
}

const STORAGE_KEY = '90daysofdevops_user_progress_v2';
const TRACK_STORAGE_KEY = '90daysofdevops_active_track';

const initialProgress: UserProgress = {
  completedDays: {},
  bookmarkedDays: {},
  notes: {},
  quizScores: {},
  userName: 'DevOps Engineer',
  lastActiveDate: '',
  currentStreak: 0,
  bestStreak: 0,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [activeTrack, setActiveTrackState] = useState<TrackYear>('2022');
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');

  // Load from localStorage & merge with SQLite DB on mount
  useEffect(() => {
    let localData = initialProgress;
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        localData = JSON.parse(savedProgress);
        setProgress(localData);
      }
      const savedTrack = localStorage.getItem(TRACK_STORAGE_KEY) as TrackYear;
      if (savedTrack && ['2022', '2023', '2024'].includes(savedTrack)) {
        setActiveTrackState(savedTrack);
      }
    } catch (e) {
      console.error('Failed to parse saved local progress', e);
    } finally {
      setIsLoaded(true);
    }

    // Fetch from SQLite database backend
    fetch('/api/progress')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const dbData = res.data as UserProgress;
          // Merge dbData with localData
          const merged: UserProgress = {
            userName: dbData.userName || localData.userName || 'DevOps Engineer',
            currentStreak: Math.max(dbData.currentStreak || 0, localData.currentStreak || 0),
            bestStreak: Math.max(dbData.bestStreak || 0, localData.bestStreak || 0),
            lastActiveDate: dbData.lastActiveDate || localData.lastActiveDate || '',
            completedDays: { ...localData.completedDays, ...dbData.completedDays },
            bookmarkedDays: { ...localData.bookmarkedDays, ...dbData.bookmarkedDays },
            notes: { ...localData.notes, ...dbData.notes },
            quizScores: { ...localData.quizScores, ...dbData.quizScores },
          };
          setProgress(merged);
          setDbSyncStatus('synced');

          // If local data had newer changes, sync merged back to DB
          const hasMoreLocal =
            Object.keys(localData.completedDays).length > Object.keys(dbData.completedDays).length ||
            Object.keys(localData.notes).length > Object.keys(dbData.notes).length;

          if (hasMoreLocal) {
            fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(merged),
            }).catch(() => {});
          }
        }
      })
      .catch((err) => {
        console.warn('SQLite backend unreachable, using localStorage', err);
        setDbSyncStatus('offline');
      });
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress locally', e);
    }
  }, [progress, isLoaded]);

  const setActiveTrack = (track: TrackYear) => {
    setActiveTrackState(track);
    try {
      localStorage.setItem(TRACK_STORAGE_KEY, track);
    } catch (e) {
      console.error('Failed to save active track', e);
    }
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  };

  const getDayKey = (dayNumber: number, year: TrackYear = activeTrack) => `${year}-${dayNumber}`;

  const isDayCompleted = (dayNumber: number, year: TrackYear = activeTrack) => {
    return !!progress.completedDays[getDayKey(dayNumber, year)];
  };

  const isDayBookmarked = (dayNumber: number, year: TrackYear = activeTrack) => {
    return !!progress.bookmarkedDays[getDayKey(dayNumber, year)];
  };

  const updateStreak = (current: UserProgress): { currentStreak: number; bestStreak: number; lastActiveDate: string } => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = current.lastActiveDate;

    if (!lastActive) {
      return {
        currentStreak: 1,
        bestStreak: Math.max(1, current.bestStreak),
        lastActiveDate: today,
      };
    }

    if (lastActive === today) {
      return {
        currentStreak: current.currentStreak,
        bestStreak: current.bestStreak,
        lastActiveDate: today,
      };
    }

    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const newStreak = current.currentStreak + 1;
      return {
        currentStreak: newStreak,
        bestStreak: Math.max(newStreak, current.bestStreak),
        lastActiveDate: today,
      };
    } else {
      return {
        currentStreak: 1,
        bestStreak: current.bestStreak,
        lastActiveDate: today,
      };
    }
  };

  const toggleDayCompleted = (dayNumber: number, year: TrackYear = activeTrack) => {
    const key = getDayKey(dayNumber, year);
    const willBeCompleted = !progress.completedDays[key];

    if (willBeCompleted) {
      fireConfetti();
    }

    setDbSyncStatus('saving');

    setProgress((prev) => {
      const nextCompleted = { ...prev.completedDays };
      if (willBeCompleted) {
        nextCompleted[key] = true;
      } else {
        delete nextCompleted[key];
      }

      const streakData = willBeCompleted ? updateStreak(prev) : {
        currentStreak: prev.currentStreak,
        bestStreak: prev.bestStreak,
        lastActiveDate: prev.lastActiveDate,
      };

      const updated = {
        ...prev,
        completedDays: nextCompleted,
        ...streakData,
      };

      // Persist to SQLite Database via API
      fetch('/api/progress/day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: year,
          dayNumber,
          completed: willBeCompleted,
        }),
      })
        .then(() => setDbSyncStatus('synced'))
        .catch(() => setDbSyncStatus('offline'));

      return updated;
    });
  };

  const toggleDayBookmarked = (dayNumber: number, year: TrackYear = activeTrack) => {
    const key = getDayKey(dayNumber, year);
    const willBeBookmarked = !progress.bookmarkedDays[key];

    setDbSyncStatus('saving');

    setProgress((prev) => {
      const nextBookmarked = { ...prev.bookmarkedDays };
      if (nextBookmarked[key]) {
        delete nextBookmarked[key];
      } else {
        nextBookmarked[key] = true;
      }

      // Persist to SQLite Database
      fetch('/api/progress/day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: year,
          dayNumber,
          bookmarked: willBeBookmarked,
        }),
      })
        .then(() => setDbSyncStatus('synced'))
        .catch(() => setDbSyncStatus('offline'));

      return {
        ...prev,
        bookmarkedDays: nextBookmarked,
      };
    });
  };

  const getDayNote = (dayNumber: number, year: TrackYear = activeTrack) => {
    return progress.notes[getDayKey(dayNumber, year)] || '';
  };

  const saveDayNote = (dayNumber: number, note: string, year: TrackYear = activeTrack) => {
    const key = getDayKey(dayNumber, year);
    setDbSyncStatus('saving');

    setProgress((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: note,
      },
    }));

    // Debounced or direct API call to SQLite
    fetch('/api/progress/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track: year,
        dayNumber,
        content: note,
      }),
    })
      .then(() => setDbSyncStatus('synced'))
      .catch(() => setDbSyncStatus('offline'));
  };

  const recordQuizScore = (moduleNumber: number, score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 80) {
      fireConfetti();
    }

    setDbSyncStatus('saving');

    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [moduleNumber]: {
          score,
          total,
          percentage,
          completedAt: new Date().toISOString(),
        },
      },
    }));

    // Persist to SQLite Database
    fetch('/api/progress/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleNumber,
        score,
        total,
      }),
    })
      .then(() => setDbSyncStatus('synced'))
      .catch(() => setDbSyncStatus('offline'));
  };

  const getModuleQuizScore = (moduleNumber: number) => {
    return progress.quizScores[moduleNumber] || null;
  };

  const setUserName = (name: string) => {
    setProgress((prev) => {
      const updated = { ...prev, userName: name };
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
      return updated;
    });
  };

  const forceSyncDb = async () => {
    setDbSyncStatus('saving');
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress),
      });
      if (res.ok) {
        setDbSyncStatus('synced');
      } else {
        setDbSyncStatus('offline');
      }
    } catch {
      setDbSyncStatus('offline');
    }
  };

  const resetProgress = () => {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to reset all your learning progress?')) {
      setProgress(initialProgress);
      localStorage.removeItem(STORAGE_KEY);
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialProgress),
      }).catch(() => {});
    }
  };

  const exportData = () => {
    return JSON.stringify(progress, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data && typeof data === 'object') {
        setProgress(data);
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).catch(() => {});
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Derived counts for active track
  const completedCount = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= 90; d++) {
      if (progress.completedDays[getDayKey(d, activeTrack)]) {
        count++;
      }
    }
    return count;
  }, [progress.completedDays, activeTrack]);

  const progressPercentage = Math.round((completedCount / 90) * 100);

  // Unlocked badges
  const unlockedBadges = useMemo(() => {
    return BADGES.filter((badge) => {
      if (badge.requiredCount) {
        return completedCount >= badge.requiredCount;
      }
      if (badge.requiredDays) {
        return badge.requiredDays.every((d) => isDayCompleted(d, '2022'));
      }
      return false;
    });
  }, [completedCount, progress.completedDays]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        activeTrack,
        setActiveTrack,
        isDayCompleted,
        isDayBookmarked,
        toggleDayCompleted,
        toggleDayBookmarked,
        getDayNote,
        saveDayNote,
        recordQuizScore,
        getModuleQuizScore,
        completedCount,
        progressPercentage,
        unlockedBadges,
        setUserName,
        resetProgress,
        exportData,
        importData,
        fireConfetti,
        dbSyncStatus,
        forceSyncDb,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
