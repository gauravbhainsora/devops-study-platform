import { notFound } from 'next/navigation';
import { getDayDetail, getAllDays } from '@/lib/content';
import { DayReaderClient } from '@/app/day/[slug]/DayReaderClient';
import { TrackYear } from '@/lib/types';

interface PageProps {
  params: Promise<{ track: string; slug: string }>;
}

export async function generateStaticParams() {
  const tracks: TrackYear[] = ['2022', '2023', '2024'];
  const paramsList: { track: string; slug: string }[] = [];

  for (const track of tracks) {
    const days = getAllDays(track);
    days.forEach((day) => {
      paramsList.push({
        track,
        slug: day.slug,
      });
    });
  }

  return paramsList;
}

export default async function TrackDayPage({ params }: PageProps) {
  const { track: rawTrack, slug } = await params;

  if (!['2022', '2023', '2024'].includes(rawTrack)) {
    notFound();
  }

  const track = rawTrack as TrackYear;

  const match = slug.match(/(\d+)/);
  if (!match) {
    notFound();
  }

  const dayNumber = parseInt(match[1], 10);
  const day = getDayDetail(dayNumber, track);

  if (!day) {
    notFound();
  }

  const allDays = getAllDays(track);

  return <DayReaderClient day={day} allDays={allDays} track={track} />;
}
