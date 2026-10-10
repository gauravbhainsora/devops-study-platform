import { NextResponse } from 'next/server';
import { recordQuizScoreInDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { moduleNumber, score, total } = await req.json();
    const percentage = Math.round((score / total) * 100);
    recordQuizScoreInDb(moduleNumber, score, total, percentage);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving quiz score in DB:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
