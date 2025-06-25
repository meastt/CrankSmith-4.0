import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CompatibilityEngine } from '@/lib/compatibility';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bikeType, cassette, chain, rearDerailleur, crankset } = body;

    // Validate required fields
    if (!name || !bikeType) {
      return NextResponse.json(
        { error: 'Name and bike type are required' },
        { status: 400 }
      );
    }

    // Run final compatibility check
    const compatibilityResult = CompatibilityEngine.checkCompatibility({
      cassette,
      chain,
      rearDerailleur,
      crankset
    });

    // Calculate gear analysis if we have cassette and crankset
    let gearRatioMin, gearRatioMax, gearRatioRange;
    if (compatibilityResult.gearAnalysis) {
      gearRatioMin = compatibilityResult.gearAnalysis.minRatio;
      gearRatioMax = compatibilityResult.gearAnalysis.maxRatio;
      gearRatioRange = compatibilityResult.gearAnalysis.range;
    }

    // Create build in database
    const build = await db.build.create({
      data: {
        name,
        bikeType,
        cassetteId: cassette?.id || null,
        chainId: chain?.id || null,
        rearDerailleurId: rearDerailleur?.id || null,
        cranksetId: crankset?.id || null,
        compatibilityScore: compatibilityResult.compatibilityScore,
        gearRatioMin,
        gearRatioMax,
        gearRatioRange
      },
      include: {
        cassette: true,
        chain: true,
        rearDerailleur: true,
        crankset: true
      }
    });

    return NextResponse.json(build);
  } catch (error) {
    console.error('Failed to save build:', error);
    return NextResponse.json(
      { error: 'Failed to save build' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const builds = await db.build.findMany({
      include: {
        cassette: true,
        chain: true,
        rearDerailleur: true,
        crankset: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(builds);
  } catch (error) {
    console.error('Failed to fetch builds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}