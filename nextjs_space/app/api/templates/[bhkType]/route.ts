import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { bhkType: string } }
) {
  try {
    const bhkType = params?.bhkType;

    if (!bhkType) {
      return NextResponse.json(
        { error: 'BHK type is required' },
        { status: 400 }
      );
    }

    const template = await prisma?.template?.findFirst?.({
      where: {
        bhkType: bhkType
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}
