import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bikeType = searchParams.get('bikeType');

    const whereClause = bikeType ? { bikeType } : {};

    const cranksets = await db.crankset.findMany({
      where: whereClause,
      orderBy: [
        { manufacturer: 'asc' },
        { series: 'asc' },
        { model: 'asc' }
      ]
    });

    return NextResponse.json(cranksets);
  } catch (error) {
    console.error('Failed to fetch cranksets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cranksets' },
      { status: 500 }
    );
  }
}