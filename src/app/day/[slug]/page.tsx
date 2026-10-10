import { redirect } from 'next/navigation';
import { TrackYear } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ track?: string }>;
}

export default async function DayPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const track = (sp.track && ['2022', '2023', '2024'].includes(sp.track))
    ? (sp.track as TrackYear)
    : '2022';

  redirect(`/${track}/day/${slug}`);
}
