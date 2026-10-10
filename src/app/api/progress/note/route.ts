import { NextResponse } from 'next/server';
import { saveDayNoteInDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { track, dayNumber, content } = await req.json();
    saveDayNoteInDb(track || '2022', dayNumber, content || '');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving note in DB:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
