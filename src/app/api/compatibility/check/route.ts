import { NextRequest, NextResponse } from 'next/server';
import { CompatibilityEngine } from '@/lib/compatibility';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cassette, chain, rearDerailleur, crankset } = body;

    // Validate that we have at least 2 components
    const componentCount = Object.values(body).filter(Boolean).length;
    if (componentCount < 2) {
      return NextResponse.json(
        { error: 'At least 2 components required for compatibility check' },
        { status: 400 }
      );
    }

    // Run compatibility check
    const result = CompatibilityEngine.checkCompatibility({
      cassette,
      chain,
      rearDerailleur,
      crankset
    });

    // Log the compatibility check (optional - for analytics)
    try {
      await db.compatibilityCheck.create({
        data: {
          cassetteId: cassette?.id || null,
          chainId: chain?.id || null,
          rearDerailleurId: rearDerailleur?.id || null,
          cranksetId: crankset?.id || null,
          isCompatible: result.isCompatible,
          warnings: JSON.stringify(result.warnings),
          issues: JSON.stringify(result.issues)
        }
      });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.warn('Failed to log compatibility check:', logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Compatibility check failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}