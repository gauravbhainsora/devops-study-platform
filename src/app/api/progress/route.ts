import { NextResponse } from 'next/server';
import { getFullProgressFromDb, syncFullProgressToDb, updateUserProfileInDb } from '@/lib/db';
import { UserProgress } from '@/lib/types';

export async function GET() {
  try {
    const progress = getFullProgressFromDb();
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error('Failed to load progress from DB:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UserProgress;
    syncFullProgressToDb(body);
    const updated = getFullProgressFromDb();
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to sync progress to DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync' },
      { status: 500 }
    );
  }
}
