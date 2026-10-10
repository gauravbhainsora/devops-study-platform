import { NextResponse } from 'next/server';
import { saveDayCompletionInDb, saveDayBookmarkInDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { track, dayNumber, completed, bookmarked } = await req.json();

    if (typeof completed === 'boolean') {
      saveDayCompletionInDb(track || '2022', dayNumber, completed);
    }
    if (typeof bookmarked === 'boolean') {
      saveDayBookmarkInDb(track || '2022', dayNumber, bookmarked);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving day status:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
