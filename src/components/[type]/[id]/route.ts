import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    type: string;
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { type, id } = params;

    let component;

    switch (type) {
      case 'cassette':
        component = await db.cassette.findUnique({
          where: { id }
        });
        break;
      case 'chain':
        component = await db.chain.findUnique({
          where: { id }
        });
        break;
      case 'rearDerailleur':
        component = await db.rearDerailleur.findUnique({
          where: { id }
        });
        break;
      case 'crankset':
        component = await db.crankset.findUnique({
          where: { id }
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid component type' },
          { status: 400 }
        );
    }

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error('Failed to fetch component:', error);
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    );
  }
}