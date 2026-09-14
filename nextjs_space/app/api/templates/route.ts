import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Fallback templates when database is not available
const FALLBACK_TEMPLATES = [
  {
    id: 'fallback-2bhk-1',
    name: '2 BHK West Facing',
    bhkType: '2BHK',
    propertyType: 'Apartment',
    description: 'Modern 2 bedroom apartment with master ensuite',
    roomsData: [
      { id: 'foyer-1', name: 'Foyer', type: 'entrance', x: 0, y: 0, width: 2, height: 2.5, color: '#E8F4F8', floor: 0 },
      { id: 'living-1', name: 'Living Room', type: 'living', x: 2, y: 0, width: 5, height: 4.5, color: '#D4E6F1', floor: 0 },
      { id: 'dining-1', name: 'Dining', type: 'dining', x: 7, y: 0, width: 3.5, height: 3, color: '#D6EAF8', floor: 0 },
      { id: 'kitchen-1', name: 'Kitchen', type: 'kitchen', x: 7, y: 3, width: 3.5, height: 2.5, color: '#FCF3CF', floor: 0 },
      { id: 'master-bedroom-1', name: 'Master Bed', type: 'master-bedroom', x: 0, y: 5.5, width: 4.5, height: 4, color: '#E8DAEF', floor: 0 },
      { id: 'master-bathroom-1', name: 'M Bath', type: 'master-bathroom', x: 4.5, y: 7, width: 2, height: 2.5, color: '#D5F4E6', floor: 0 },
      { id: 'bedroom-2', name: 'Bedroom 2', type: 'bedroom', x: 6.5, y: 5.5, width: 4, height: 3.5, color: '#E8DAEF', floor: 0 },
      { id: 'bathroom-2', name: 'Bathroom', type: 'bathroom', x: 0, y: 2.5, width: 2, height: 2.5, color: '#D5F4E6', floor: 0 },
      { id: 'balcony-1', name: 'Balcony', type: 'balcony', x: 10.5, y: 0, width: 0.5, height: 5.5, color: '#FADBD8', floor: 0 }
    ],
    doorsData: [
      { id: 'door-main', type: 'single', x: 0.7, y: 0, width: 1, wallSide: 'north', opensInward: true },
      { id: 'door-1', type: 'single', x: 6.3, y: 1.5, width: 0.9, wallSide: 'east', opensInward: true },
      { id: 'door-2', type: 'single', x: 7, y: 3.5, width: 0.9, wallSide: 'west', opensInward: true },
      { id: 'door-3', type: 'single', x: 2, y: 5.5, width: 0.9, wallSide: 'north', opensInward: true },
      { id: 'door-4', type: 'single', x: 5, y: 7.5, width: 0.8, wallSide: 'west', opensInward: true },
      { id: 'door-5', type: 'single', x: 7.5, y: 5.5, width: 0.9, wallSide: 'north', opensInward: true },
      { id: 'door-6', type: 'single', x: 0.5, y: 2.5, width: 0.8, wallSide: 'north', opensInward: true },
      { id: 'door-7', type: 'sliding', x: 10.5, y: 2, width: 1.5, wallSide: 'east', opensInward: false }
    ],
    windowsData: [
      { id: 'win-1', type: 'sliding', x: 3, y: 0, width: 2, wallSide: 'north' },
      { id: 'win-2', type: 'sliding', x: 8, y: 0, width: 1.5, wallSide: 'north' },
      { id: 'win-3', type: 'casement', x: 9, y: 3, width: 1, wallSide: 'south' },
      { id: 'win-4', type: 'sliding', x: 1.5, y: 9.5, width: 2, wallSide: 'south' },
      { id: 'win-5', type: 'sliding', x: 8, y: 9, width: 1.8, wallSide: 'south' }
    ],
    fixturesData: [
      { id: 'fix-1', type: 'toilet', x: 5.3, y: 8.5, rotation: 90 },
      { id: 'fix-2', type: 'sink', x: 5.8, y: 7.5, rotation: 0 },
      { id: 'fix-3', type: 'shower', x: 4.8, y: 8.8, rotation: 0 },
      { id: 'fix-4', type: 'toilet', x: 0.6, y: 4.2, rotation: 90 },
      { id: 'fix-5', type: 'sink', x: 1.3, y: 3, rotation: 0 },
      { id: 'fix-6', type: 'bathtub', x: 0.8, y: 3.5, rotation: 0 },
      { id: 'fix-7', type: 'kitchen-sink', x: 8, y: 5, rotation: 180 }
    ],
    furnitureData: [
      { id: 'furn-1', type: 'sofa', x: 3, y: 2, width: 2.5, height: 1, rotation: 0 },
      { id: 'furn-2', type: 'chair', x: 5.7, y: 2.5, width: 0.8, height: 0.8, rotation: 270 },
      { id: 'furn-3', type: 'dining-table', x: 7.5, y: 1, width: 2, height: 1.5, rotation: 0 },
      { id: 'furn-4', type: 'bed', x: 1, y: 6, width: 2, height: 2.2, rotation: 0, label: 'Queen' },
      { id: 'furn-5', type: 'bed', x: 7, y: 6, width: 1.9, height: 2, rotation: 0, label: 'Queen' },
      { id: 'furn-6', type: 'desk', x: 9, y: 6.5, width: 1.2, height: 0.6, rotation: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-3bhk-1',
    name: '3 BHK Modern Layout',
    bhkType: '3BHK',
    propertyType: 'Apartment',
    description: 'Spacious 3 bedroom apartment with ensuite bathrooms',
    roomsData: [
      { id: 'foyer-1', name: 'Foyer', type: 'foyer', x: 0, y: 0, width: 2.5, height: 2, color: '#E8F4F8', floor: 0 },
      { id: 'living-1', name: 'Living Room', type: 'living', x: 2.5, y: 0, width: 6, height: 5, color: '#D4E6F1', floor: 0 },
      { id: 'dining-1', name: 'Dining', type: 'dining', x: 8.5, y: 0, width: 4, height: 3.5, color: '#D6EAF8', floor: 0 },
      { id: 'kitchen-1', name: 'Kitchen', type: 'kitchen', x: 8.5, y: 3.5, width: 4, height: 3, color: '#FCF3CF', floor: 0 },
      { id: 'utility-1', name: 'Utility', type: 'utility', x: 12.5, y: 3.5, width: 1.5, height: 2, color: '#F9E79F', floor: 0 },
      { id: 'master-bedroom-1', name: 'Master Bed', type: 'master-bedroom', x: 0, y: 5, width: 5, height: 5, color: '#E8DAEF', floor: 0 },
      { id: 'master-bathroom-1', name: 'M Bath', type: 'master-bathroom', x: 0, y: 10, width: 3, height: 1, color: '#D5F4E6', floor: 0 },
      { id: 'bedroom-2', name: 'Bedroom 2', type: 'bedroom', x: 5, y: 5, width: 4, height: 4, color: '#E8DAEF', floor: 0 },
      { id: 'bedroom-3', name: 'Bedroom 3', type: 'bedroom', x: 9, y: 6.5, width: 3.5, height: 4, color: '#E8DAEF', floor: 0 },
      { id: 'bathroom-2', name: 'Bathroom', type: 'bathroom', x: 5, y: 9, width: 2.5, height: 2, color: '#D5F4E6', floor: 0 },
      { id: 'balcony-1', name: 'Balcony 1', type: 'balcony', x: 12.5, y: 0, width: 1.5, height: 3.5, color: '#FADBD8', floor: 0 },
      { id: 'balcony-2', name: 'Balcony 2', type: 'balcony', x: 12.5, y: 6.5, width: 1.5, height: 4, color: '#FADBD8', floor: 0 }
    ],
    doorsData: [
      { id: 'door-main', type: 'single', x: 0.8, y: 0, width: 1, wallSide: 'north', opensInward: true },
      { id: 'door-1', type: 'single', x: 8, y: 2, width: 0.9, wallSide: 'east', opensInward: true },
      { id: 'door-2', type: 'single', x: 9.5, y: 3.5, width: 0.9, wallSide: 'north', opensInward: true },
      { id: 'door-3', type: 'single', x: 2, y: 5, width: 0.9, wallSide: 'north', opensInward: true },
      { id: 'door-4', type: 'single', x: 1, y: 10, width: 0.8, wallSide: 'north', opensInward: true },
      { id: 'door-5', type: 'single', x: 6.5, y: 5, width: 0.9, wallSide: 'north', opensInward: true },
      { id: 'door-6', type: 'single', x: 10, y: 6.5, width: 0.9, wallSide: 'north', opensInward: true },
      { id: 'door-7', type: 'single', x: 5.5, y: 9, width: 0.8, wallSide: 'north', opensInward: true }
    ],
    windowsData: [
      { id: 'win-1', type: 'sliding', x: 4, y: 0, width: 2.5, wallSide: 'north' },
      { id: 'win-2', type: 'sliding', x: 10, y: 0, width: 2, wallSide: 'north' },
      { id: 'win-3', type: 'casement', x: 11, y: 5, width: 1, wallSide: 'south' },
      { id: 'win-4', type: 'sliding', x: 2, y: 11, width: 2, wallSide: 'south' },
      { id: 'win-5', type: 'sliding', x: 6.5, y: 11, width: 1.8, wallSide: 'south' },
      { id: 'win-6', type: 'sliding', x: 10.5, y: 11, width: 1.5, wallSide: 'south' }
    ],
    fixturesData: [
      { id: 'fix-1', type: 'toilet', x: 1.2, y: 10.3, rotation: 90 },
      { id: 'fix-2', type: 'sink', x: 0.5, y: 10.4, rotation: 180 },
      { id: 'fix-3', type: 'shower', x: 2.3, y: 10.3, rotation: 0 },
      { id: 'fix-4', type: 'toilet', x: 5.7, y: 10.2, rotation: 90 },
      { id: 'fix-5', type: 'sink', x: 6.5, y: 9.4, rotation: 0 },
      { id: 'fix-6', type: 'bathtub', x: 5.5, y: 9.8, rotation: 0 },
      { id: 'fix-7', type: 'kitchen-sink', x: 10, y: 6, rotation: 180 }
    ],
    furnitureData: [
      { id: 'furn-1', type: 'sofa', x: 4, y: 2, width: 3, height: 1.2, rotation: 0 },
      { id: 'furn-2', type: 'chair', x: 7, y: 2.5, width: 0.8, height: 0.8, rotation: 270 },
      { id: 'furn-3', type: 'dining-table', x: 9.5, y: 1, width: 2.5, height: 1.8, rotation: 0 },
      { id: 'furn-4', type: 'bed', x: 1, y: 6, width: 2.2, height: 2.5, rotation: 0, label: 'King' },
      { id: 'furn-5', type: 'bed', x: 5.5, y: 5.5, width: 2, height: 2.2, rotation: 0, label: 'Queen' },
      { id: 'furn-6', type: 'bed', x: 9.5, y: 7, width: 1.5, height: 2, rotation: 0, label: 'Single' },
      { id: 'furn-7', type: 'desk', x: 11, y: 8.5, width: 1.2, height: 0.6, rotation: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request?.nextUrl?.searchParams;
    const bhkType = searchParams?.get('bhkType');
    const propertyType = searchParams?.get('propertyType');

    const whereClause: any = {};
    if (bhkType) whereClause.bhkType = bhkType;
    if (propertyType) whereClause.propertyType = propertyType;

    // Try to fetch from database
    try {
      const templates = await prisma?.template?.findMany?.({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        orderBy: {
          createdAt: 'desc'
        }
      });

      // If database returned data, use it
      if (templates && templates.length > 0) {
        return NextResponse.json(templates);
      }
    } catch (dbError) {
      console.warn('Database not available, using fallback templates:', dbError);
    }

    // Use fallback templates if database fails or returns no data
    let filteredTemplates = FALLBACK_TEMPLATES;
    
    if (bhkType) {
      filteredTemplates = filteredTemplates.filter(t => t.bhkType === bhkType);
    }
    if (propertyType) {
      filteredTemplates = filteredTemplates.filter(t => t.propertyType === propertyType);
    }

    console.log('Using fallback templates:', filteredTemplates.length, 'templates');
    return NextResponse.json(filteredTemplates);

  } catch (error) {
    console.error('Error in templates API:', error);
    // Even if there's an error, return fallback templates
    return NextResponse.json(FALLBACK_TEMPLATES);
  }
}
