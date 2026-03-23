import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifications } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const history = await db.query.verifications.findMany({
      orderBy: [desc(verifications.createdAt)],
      limit: limit,
    });

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
