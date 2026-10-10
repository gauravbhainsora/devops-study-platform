import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DayMeta, DayDetail, TrackYear } from './types';
import { getModulesForTrack } from './curriculum';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getModuleForDay(dayNumber: number, track: TrackYear = '2022') {
  const modules = getModulesForTrack(track);
  const found = modules.find(
    (m) => dayNumber >= m.daysRange[0] && dayNumber <= m.daysRange[1]
  );
  if (found) return found;
  return modules[0];
}

export function cleanTitle(rawTitle: string, dayNumber: number): string {
  if (!rawTitle) return `Day ${dayNumber}`;
  let title = rawTitle.trim();
  // Strip markdown hashes if any
  title = title.replace(/^#+\s*/, '');
  // Strip #90DaysOfDevOps -
  title = title.replace(/^#?90DaysOfDevOps\s*[-–—:]\s*/i, '');
  // Strip - Day X at end
  title = title.replace(/\s*[-–—:]\s*Day\s*\d+\s*$/i, '');
  // Strip Day X - at start
  title = title.replace(/^Day\s*\d+\s*[-–—:]\s*/i, '');
  return title.trim() || `Day ${dayNumber}`;
}

export function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const imageCount = (text.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const wordsTime = Math.ceil(words / 180);
  const total = Math.max(3, wordsTime + Math.ceil(imageCount * 0.5));
  return total;
}

export function sanitizeMarkdown(content: string, year: TrackYear): string {
  // Normalize markdown image links:
  // e.g. ![](Images/Day10_Go1.png) -> ![](/Images/Day10_Go1.png)
  // or images/... -> /Images/...
  let result = content;
  
  if (year === '2022') {
    result = result.replace(/!\[(.*?)\]\(Images\/(.*?)\)/g, '![$1](/Images/$2)');
    result = result.replace(/!\[(.*?)\]\(images\/(.*?)\)/g, '![$1](/Images/$2)');
    result = result.replace(/<img([^>]*?)src=["']Images\/(.*?)["'](.*?)>/g, '<img$1src="/Images/$2"$3>');
    result = result.replace(/<img([^>]*?)src=["']images\/(.*?)["'](.*?)>/g, '<img$1src="/Images/$2"$3>');
  } else if (year === '2024') {
    result = result.replace(/!\[(.*?)\]\(Images\/(.*?)\)/g, '![$1](/content/2024/Images/$2)');
    result = result.replace(/!\[(.*?)\]\(images\/(.*?)\)/g, '![$1](/content/2024/Images/$2)');
  }
  
  return result;
}

export function getAllDays(year: TrackYear = '2022'): DayMeta[] {
  const yearDir = path.join(CONTENT_DIR, year);
  if (!fs.existsSync(yearDir)) return [];

  const files = fs.readdirSync(yearDir).filter((f) => f.endsWith('.md'));
  const days: DayMeta[] = [];

  for (const file of files) {
    const match = file.match(/day(\d+)\.md/i);
    if (!match) continue;

    const dayNumber = parseInt(match[1], 10);
    const filePath = path.join(yearDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    let rawTitle = data.title;
    if (!rawTitle) {
      // Find first markdown heading
      const headingMatch = content.match(/^#{1,3}\s+(.+)$/m);
      rawTitle = headingMatch ? headingMatch[1] : `Day ${dayNumber}`;
    }

    const title = cleanTitle(rawTitle, dayNumber);
    const mod = getModuleForDay(dayNumber, year);

    let tags: string[] = [];
    if (typeof data.tags === 'string') {
      tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else if (Array.isArray(data.tags)) {
      tags = data.tags;
    } else {
      tags = [mod.title.split(' ')[0].toLowerCase(), 'devops', `day${dayNumber}`];
    }

    const description =
      data.description ||
      `Day ${dayNumber} of the 90DaysOfDevOps challenge focusing on ${mod.title}: ${title}.`;

    const estimatedMinutes = estimateReadTime(content);

    days.push({
      id: `${year}-${dayNumber}`,
      year,
      day: dayNumber,
      slug: `day-${String(dayNumber).padStart(2, '0')}`,
      rawTitle,
      title,
      description,
      tags,
      moduleNumber: mod.number,
      moduleTitle: mod.title,
      moduleIcon: mod.icon,
      moduleColor: mod.color,
      estimatedMinutes,
      filePath,
    });
  }

  return days.sort((a, b) => a.day - b.day);
}

export function getDayDetail(
  dayNumber: number,
  year: TrackYear = '2022'
): DayDetail | null {
  const pad = String(dayNumber).padStart(2, '0');
  const filePath = path.join(CONTENT_DIR, year, `day${pad}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawFile = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(rawFile);

  let rawTitle = data.title;
  if (!rawTitle) {
    const headingMatch = content.match(/^#{1,3}\s+(.+)$/m);
    rawTitle = headingMatch ? headingMatch[1] : `Day ${dayNumber}`;
  }

  const title = cleanTitle(rawTitle, dayNumber);
  const mod = getModuleForDay(dayNumber, year);

  let tags: string[] = [];
  if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  } else if (Array.isArray(data.tags)) {
    tags = data.tags;
  } else {
    tags = [mod.title.split(' ')[0].toLowerCase(), 'devops', `day${dayNumber}`];
  }

  const description =
    data.description ||
    `Day ${dayNumber} of the 90DaysOfDevOps challenge focusing on ${mod.title}: ${title}.`;

  const estimatedMinutes = estimateReadTime(content);
  const sanitizedContent = sanitizeMarkdown(content, year);

  return {
    id: `${year}-${dayNumber}`,
    year,
    day: dayNumber,
    slug: `day-${pad}`,
    rawTitle,
    title,
    description,
    tags,
    moduleNumber: mod.number,
    moduleTitle: mod.title,
    moduleIcon: mod.icon,
    moduleColor: mod.color,
    estimatedMinutes,
    filePath,
    content: sanitizedContent,
  };
}
