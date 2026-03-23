import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifications } from '@/lib/schema';
import { count, gte } from 'drizzle-orm';

export async function GET() {
  try {
    // Total count
    const totalCountRes = await db.select({ value: count() }).from(verifications);
    const totalCount = totalCountRes[0]?.value ?? 0;

    // Count this hour
    const oneHourAgo = new Date(Date.now() - 3600000);
    const hourCountRes = await db.select({ value: count() })
      .from(verifications)
      .where(gte(verifications.createdAt, oneHourAgo));
    const hourCount = hourCountRes[0]?.value ?? 0;

    return NextResponse.json({ totalCount, hourCount });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
