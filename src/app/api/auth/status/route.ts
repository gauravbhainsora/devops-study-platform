import { NextResponse } from 'next/server';

export async function GET() {
  const hasGoogleId = Boolean(process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID);
  const hasGoogleSecret = Boolean(process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET);
  const isGoogleConfigured = hasGoogleId && hasGoogleSecret;
  const isSecretConfigured = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);

  return NextResponse.json({
    googleConfigured: isGoogleConfigured,
    secretConfigured: isSecretConfigured,
  });
}
