import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { UserProgress } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'platform.db');

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL DEFAULT 'DevOps Engineer',
      current_streak INTEGER NOT NULL DEFAULT 0,
      best_streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS completed_days (
      track TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (track, day_number)
    );

    CREATE TABLE IF NOT EXISTS bookmarked_days (
      track TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      bookmarked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (track, day_number)
    );

    CREATE TABLE IF NOT EXISTS day_notes (
      track TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (track, day_number)
    );

    CREATE TABLE IF NOT EXISTS quiz_scores (
      module_number INTEGER PRIMARY KEY,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO user_profile (id, user_name, current_streak, best_streak, last_active_date)
    VALUES ('default_user', 'DevOps Engineer', 0, 0, '');
  `);
}

export function getFullProgressFromDb(): UserProgress {
  const db = getDb();

  const profile = db
    .prepare('SELECT * FROM user_profile WHERE id = ?')
    .get('default_user') as {
    user_name: string;
    current_streak: number;
    best_streak: number;
    last_active_date: string;
  } | undefined;

  const completedRows = db
    .prepare('SELECT track, day_number FROM completed_days')
    .all() as { track: string; day_number: number }[];

  const completedDays: Record<string, boolean> = {};
  completedRows.forEach((r) => {
    completedDays[`${r.track}-${r.day_number}`] = true;
  });

  const bookmarkedRows = db
    .prepare('SELECT track, day_number FROM bookmarked_days')
    .all() as { track: string; day_number: number }[];

  const bookmarkedDays: Record<string, boolean> = {};
  bookmarkedRows.forEach((r) => {
    bookmarkedDays[`${r.track}-${r.day_number}`] = true;
  });

  const noteRows = db
    .prepare('SELECT track, day_number, content FROM day_notes')
    .all() as { track: string; day_number: number; content: string }[];

  const notes: Record<string, string> = {};
  noteRows.forEach((r) => {
    notes[`${r.track}-${r.day_number}`] = r.content;
  });

  const quizRows = db
    .prepare('SELECT * FROM quiz_scores')
    .all() as {
    module_number: number;
    score: number;
    total: number;
    percentage: number;
    completed_at: string;
  }[];

  const quizScores: Record<
    number,
    { score: number; total: number; percentage: number; completedAt: string }
  > = {};
  quizRows.forEach((r) => {
    quizScores[r.module_number] = {
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      completedAt: r.completed_at,
    };
  });

  return {
    userName: profile?.user_name || 'DevOps Engineer',
    currentStreak: profile?.current_streak || 0,
    bestStreak: profile?.best_streak || 0,
    lastActiveDate: profile?.last_active_date || '',
    completedDays,
    bookmarkedDays,
    notes,
    quizScores,
  };
}

export function saveDayCompletionInDb(track: string, dayNumber: number, completed: boolean) {
  const db = getDb();
  if (completed) {
    db.prepare(`
      INSERT OR REPLACE INTO completed_days (track, day_number, completed_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(track, dayNumber);
  } else {
    db.prepare(`
      DELETE FROM completed_days WHERE track = ? AND day_number = ?
    `).run(track, dayNumber);
  }
}

export function saveDayBookmarkInDb(track: string, dayNumber: number, bookmarked: boolean) {
  const db = getDb();
  if (bookmarked) {
    db.prepare(`
      INSERT OR REPLACE INTO bookmarked_days (track, day_number, bookmarked_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(track, dayNumber);
  } else {
    db.prepare(`
      DELETE FROM bookmarked_days WHERE track = ? AND day_number = ?
    `).run(track, dayNumber);
  }
}

export function saveDayNoteInDb(track: string, dayNumber: number, content: string) {
  const db = getDb();
  if (!content.trim()) {
    db.prepare(`
      DELETE FROM day_notes WHERE track = ? AND day_number = ?
    `).run(track, dayNumber);
  } else {
    db.prepare(`
      INSERT OR REPLACE INTO day_notes (track, day_number, content, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(track, dayNumber, content);
  }
}

export function recordQuizScoreInDb(
  moduleNumber: number,
  score: number,
  total: number,
  percentage: number
) {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO quiz_scores (module_number, score, total, percentage, completed_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(moduleNumber, score, total, percentage);
}

export function updateUserProfileInDb(
  userName: string,
  currentStreak: number,
  bestStreak: number,
  lastActiveDate: string
) {
  const db = getDb();
  db.prepare(`
    UPDATE user_profile
    SET user_name = ?, current_streak = ?, best_streak = ?, last_active_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 'default_user'
  `).run(userName, currentStreak, bestStreak, lastActiveDate);
}

export function syncFullProgressToDb(progress: UserProgress) {
  const db = getDb();
  const tx = db.transaction(() => {
    // Update profile
    updateUserProfileInDb(
      progress.userName || 'DevOps Engineer',
      progress.currentStreak || 0,
      progress.bestStreak || 0,
      progress.lastActiveDate || ''
    );

    // Sync completed days
    const insertCompleted = db.prepare(
      'INSERT OR IGNORE INTO completed_days (track, day_number) VALUES (?, ?)'
    );
    Object.entries(progress.completedDays).forEach(([key, val]) => {
      if (val) {
        const parts = key.split('-');
        const track = parts[0];
        const day = parseInt(parts[parts.length - 1], 10);
        if (track && !isNaN(day)) {
          insertCompleted.run(track, day);
        }
      }
    });

    // Sync bookmarks
    const insertBookmarked = db.prepare(
      'INSERT OR IGNORE INTO bookmarked_days (track, day_number) VALUES (?, ?)'
    );
    Object.entries(progress.bookmarkedDays).forEach(([key, val]) => {
      if (val) {
        const parts = key.split('-');
        const track = parts[0];
        const day = parseInt(parts[parts.length - 1], 10);
        if (track && !isNaN(day)) {
          insertBookmarked.run(track, day);
        }
      }
    });

    // Sync notes
    const insertNote = db.prepare(
      'INSERT OR REPLACE INTO day_notes (track, day_number, content) VALUES (?, ?, ?)'
    );
    Object.entries(progress.notes).forEach(([key, content]) => {
      if (content && content.trim()) {
        const parts = key.split('-');
        const track = parts[0];
        const day = parseInt(parts[parts.length - 1], 10);
        if (track && !isNaN(day)) {
          insertNote.run(track, day, content);
        }
      }
    });

    // Sync quiz scores
    const insertQuiz = db.prepare(
      'INSERT OR REPLACE INTO quiz_scores (module_number, score, total, percentage, completed_at) VALUES (?, ?, ?, ?, ?)'
    );
    Object.entries(progress.quizScores).forEach(([modNum, q]) => {
      insertQuiz.run(
        parseInt(modNum, 10),
        q.score,
        q.total,
        q.percentage,
        q.completedAt || new Date().toISOString()
      );
    });
  });

  tx();
}
