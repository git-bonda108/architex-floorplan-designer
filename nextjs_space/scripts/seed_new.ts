import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Professional floor plan templates based on architectural standards

// 2 BHK FLOOR PLAN - West Facing (Based on professional standards)
// Total area: ~1200 sq ft (111 sq m)
// Dimensions: 11m x 10m

const twoBHKTemplate = {
  name: '2 BHK West Facing',
  bhkType: '2BHK',
  propertyType: 'Apartment',
  description: 'Modern 2 bedroom apartment with master ensuite, optimized for west-facing orientation',
  
  // Rooms with architectural proportions
  roomsData: [
    {
      id: 'foyer-1',
      name: 'Foyer',
      type: 'entrance',
      x: 0,
      y: 0,
      width: 2,
      height: 2.5,
      color: '#E8F4F8',
      floor: 0
    },
    {
      id: 'living-1',
      name: 'Living Room',
      type: 'living',
      x: 2,
      y: 0,
      width: 5,
      height: 4.5,
      color: '#D4E6F1',
      floor: 0
    },
    {
      id: 'dining-1',
      name: 'Dining',
      type: 'dining',
      x: 7,
      y: 0,
      width: 3.5,
      height: 3,
      color: '#D6EAF8',
      floor: 0
    },
    {
      id: 'kitchen-1',
      name: 'Kitchen',
      type: 'kitchen',
      x: 7,
      y: 3,
      width: 3.5,
      height: 2.5,
      color: '#FCF3CF',
      floor: 0
    },
    {
      id: 'master-bedroom-1',
      name: 'Master Bed',
      type: 'master-bedroom',
      x: 0,
      y: 5.5,
      width: 4.5,
      height: 4,
      color: '#E8DAEF',
      floor: 0
    },
    {
      id: 'master-bathroom-1',
      name: 'M Bath',
      type: 'master-bathroom',
      x: 4.5,
      y: 7,
      width: 2,
      height: 2.5,
      color: '#D5F4E6',
      floor: 0
    },
    {
      id: 'bedroom-2',
      name: 'Bedroom 2',
      type: 'bedroom',
      x: 6.5,
      y: 5.5,
      width: 4,
      height: 3.5,
      color: '#E8DAEF',
      floor: 0
    },
    {
      id: 'bathroom-2',
      name: 'Bathroom',
      type: 'bathroom',
      x: 0,
      y: 2.5,
      width: 2,
      height: 2.5,
      color: '#D5F4E6',
      floor: 0
    },
    {
      id: 'balcony-1',
      name: 'Balcony',
      type: 'balcony',
      x: 10.5,
      y: 0,
      width: 0.5,
      height: 5.5,
      color: '#FADBD8',
      floor: 0
    }
  ],
  
  // Doors with swing directions
  doorsData: [
    // Main entrance
    { id: 'door-main', type: 'single', x: 0.7, y: 0, width: 1, wallSide: 'north', opensInward: true },
    // Living to dining
    { id: 'door-1', type: 'single', x: 6.3, y: 1.5, width: 0.9, wallSide: 'east', opensInward: true },
    // Kitchen door
    { id: 'door-2', type: 'single', x: 7, y: 3.5, width: 0.9, wallSide: 'west', opensInward: true },
    // Master bedroom
    { id: 'door-3', type: 'single', x: 2, y: 5.5, width: 0.9, wallSide: 'north', opensInward: true },
    // Master bathroom
    { id: 'door-4', type: 'single', x: 5, y: 7.5, width: 0.8, wallSide: 'west', opensInward: true },
    // Bedroom 2
    { id: 'door-5', type: 'single', x: 7.5, y: 5.5, width: 0.9, wallSide: 'north', opensInward: true },
    // Common bathroom
    { id: 'door-6', type: 'single', x: 0.5, y: 2.5, width: 0.8, wallSide: 'north', opensInward: true },
    // Balcony sliding door
    { id: 'door-7', type: 'sliding', x: 10.5, y: 2, width: 1.5, wallSide: 'east', opensInward: false }
  ],
  
  // Windows
  windowsData: [
    // Living room windows
    { id: 'win-1', type: 'sliding', x: 3, y: 0, width: 2, wallSide: 'north' },
    // Dining window
    { id: 'win-2', type: 'sliding', x: 8, y: 0, width: 1.5, wallSide: 'north' },
    // Kitchen window
    { id: 'win-3', type: 'casement', x: 9, y: 3, width: 1, wallSide: 'south' },
    // Master bedroom window
    { id: 'win-4', type: 'sliding', x: 1.5, y: 9.5, width: 2, wallSide: 'south' },
    // Bedroom 2 window
    { id: 'win-5', type: 'sliding', x: 8, y: 9, width: 1.8, wallSide: 'south' }
  ],
  
  // Bathroom and kitchen fixtures
  fixturesData: [
    // Master bathroom
    { id: 'fix-1', type: 'toilet', x: 5.3, y: 8.5, rotation: 90 },
    { id: 'fix-2', type: 'sink', x: 5.8, y: 7.5, rotation: 0 },
    { id: 'fix-3', type: 'shower', x: 4.8, y: 8.8, rotation: 0 },
    // Common bathroom
    { id: 'fix-4', type: 'toilet', x: 0.6, y: 4.2, rotation: 90 },
    { id: 'fix-5', type: 'sink', x: 1.3, y: 3, rotation: 0 },
    { id: 'fix-6', type: 'bathtub', x: 0.8, y: 3.5, rotation: 0 },
    // Kitchen
    { id: 'fix-7', type: 'kitchen-sink', x: 8, y: 5, rotation: 180 }
  ],
  
  // Furniture
  furnitureData: [
    // Living room
    { id: 'furn-1', type: 'sofa', x: 3, y: 2, width: 2.5, height: 1, rotation: 0 },
    { id: 'furn-2', type: 'chair', x: 5.7, y: 2.5, width: 0.8, height: 0.8, rotation: 270 },
    // Dining
    { id: 'furn-3', type: 'dining-table', x: 7.5, y: 1, width: 2, height: 1.5, rotation: 0 },
    // Master bedroom
    { id: 'furn-4', type: 'bed', x: 1, y: 6, width: 2, height: 2.2, rotation: 0, label: 'Queen' },
    // Bedroom 2
    { id: 'furn-5', type: 'bed', x: 7, y: 6, width: 1.9, height: 2, rotation: 0, label: 'Queen' },
    { id: 'furn-6', type: 'desk', x: 9, y: 6.5, width: 1.2, height: 0.6, rotation: 0 }
  ]
};

// 3 BHK FLOOR PLAN - Modern Layout
// Total area: ~1600 sq ft (148 sq m)
// Dimensions: 14m x 11m

const threeBHKTemplate = {
  name: '3 BHK Modern Layout',
  bhkType: '3BHK',
  propertyType: 'Apartment',
  description: 'Spacious 3 bedroom apartment with ensuite bathrooms, study room, and large balconies',
  
  // Rooms
  roomsData: [
    {
      id: 'foyer-1',
      name: 'Foyer',
      type: 'foyer',
      x: 0,
      y: 0,
      width: 2.5,
      height: 2,
      color: '#E8F4F8',
      floor: 0
    },
    {
      id: 'living-1',
      name: 'Living Room',
      type: 'living',
      x: 2.5,
      y: 0,
      width: 6,
      height: 5,
      color: '#D4E6F1',
      floor: 0
    },
    {
      id: 'dining-1',
      name: 'Dining',
      type: 'dining',
      x: 8.5,
      y: 0,
      width: 4,
      height: 3.5,
      color: '#D6EAF8',
      floor: 0
    },
    {
      id: 'kitchen-1',
      name: 'Kitchen',
      type: 'kitchen',
      x: 8.5,
      y: 3.5,
      width: 4,
      height: 3,
      color: '#FCF3CF',
      floor: 0
    },
    {
      id: 'utility-1',
      name: 'Utility',
      type: 'utility',
      x: 12.5,
      y: 3.5,
      width: 1.5,
      height: 2,
      color: '#F9E79F',
      floor: 0
    },
    {
      id: 'master-bedroom-1',
      name: 'Master Bed',
      type: 'master-bedroom',
      x: 0,
      y: 5.5,
      width: 5,
      height: 4.5,
      color: '#E8DAEF',
      floor: 0
    },
    {
      id: 'master-bathroom-1',
      name: 'M Bath',
      type: 'master-bathroom',
      x: 5,
      y: 7.5,
      width: 2.5,
      height: 2.5,
      color: '#D5F4E6',
      floor: 0
    },
    {
      id: 'bedroom-2',
      name: 'Bedroom 2',
      type: 'bedroom',
      x: 7.5,
      y: 6.5,
      width: 4,
      height: 3.5,
      color: '#E8DAEF',
      floor: 0
    },
    {
      id: 'bedroom-3',
      name: 'Bedroom 3',
      type: 'bedroom',
      x: 0,
      y: 2,
      width: 2.5,
      height: 3.5,
      color: '#E8DAEF',
      floor: 0
    },
    {
      id: 'bathroom-2',
      name: 'Bathroom 2',
      type: 'bathroom',
      x: 11.5,
      y: 6.5,
      width: 2,
      height: 2.5,
      color: '#D5F4E6',
      floor: 0
    },
    {
      id: 'bathroom-3',
      name: 'Bathroom',
      type: 'bathroom',
      x: 5,
      y: 5,
      width: 2.5,
      height: 2.5,
      color: '#D5F4E6',
      floor: 0
    },
    {
      id: 'study-1',
      name: 'Study',
      type: 'study',
      x: 7.5,
      y: 5,
      width: 3,
      height: 1.5,
      color: '#FAD7A0',
      floor: 0
    },
    {
      id: 'balcony-1',
      name: 'Main Balcony',
      type: 'balcony',
      x: 12.5,
      y: 0,
      width: 1.5,
      height: 3.5,
      color: '#FADBD8',
      floor: 0
    },
    {
      id: 'balcony-2',
      name: 'Bedroom Balcony',
      type: 'balcony',
      x: 13.5,
      y: 6.5,
      width: 0.5,
      height: 3.5,
      color: '#FADBD8',
      floor: 0
    }
  ],
  
  // Doors
  doorsData: [
    // Main entrance
    { id: 'door-main', type: 'single', x: 0.8, y: 0, width: 1, wallSide: 'north', opensInward: true },
    // Living to dining
    { id: 'door-1', type: 'single', x: 8.5, y: 2, width: 0.9, wallSide: 'west', opensInward: true },
    // Kitchen
    { id: 'door-2', type: 'single', x: 9, y: 3.5, width: 0.9, wallSide: 'north', opensInward: true },
    // Master bedroom
    { id: 'door-3', type: 'single', x: 2, y: 5.5, width: 1, wallSide: 'north', opensInward: true },
    // Master bathroom
    { id: 'door-4', type: 'single', x: 5.5, y: 8, width: 0.8, wallSide: 'west', opensInward: true },
    // Bedroom 2
    { id: 'door-5', type: 'single', x: 8.5, y: 6.5, width: 0.9, wallSide: 'north', opensInward: true },
    // Bedroom 3
    { id: 'door-6', type: 'single', x: 1, y: 2, width: 0.8, wallSide: 'north', opensInward: true },
    // Bathroom 2
    { id: 'door-7', type: 'single', x: 12, y: 6.5, width: 0.8, wallSide: 'north', opensInward: true },
    // Common bathroom
    { id: 'door-8', type: 'single', x: 5.5, y: 5, width: 0.8, wallSide: 'north', opensInward: true },
    // Study
    { id: 'door-9', type: 'single', x: 8, y: 5, width: 0.8, wallSide: 'north', opensInward: true },
    // Balcony sliding doors
    { id: 'door-10', type: 'sliding', x: 12.5, y: 1.5, width: 1.5, wallSide: 'east', opensInward: false },
    { id: 'door-11', type: 'sliding', x: 13.5, y: 7.5, width: 0.5, wallSide: 'east', opensInward: false }
  ],
  
  // Windows
  windowsData: [
    // Living room
    { id: 'win-1', type: 'sliding', x: 4, y: 0, width: 2.5, wallSide: 'north' },
    // Dining
    { id: 'win-2', type: 'sliding', x: 10, y: 0, width: 2, wallSide: 'north' },
    // Kitchen
    { id: 'win-3', type: 'casement', x: 10, y: 6.5, width: 1.5, wallSide: 'south' },
    // Master bedroom
    { id: 'win-4', type: 'sliding', x: 1.5, y: 10, width: 2.5, wallSide: 'south' },
    // Bedroom 2
    { id: 'win-5', type: 'sliding', x: 9, y: 10, width: 2, wallSide: 'south' },
    // Bedroom 3
    { id: 'win-6', type: 'casement', x: 0, y: 3.5, width: 1.2, wallSide: 'west' },
    // Study
    { id: 'win-7', type: 'fixed', x: 8.5, y: 6.5, width: 1.5, wallSide: 'south' }
  ],
  
  // Fixtures
  fixturesData: [
    // Master bathroom
    { id: 'fix-1', type: 'toilet', x: 6.5, y: 8.8, rotation: 90 },
    { id: 'fix-2', type: 'sink', x: 6.5, y: 7.8, rotation: 0 },
    { id: 'fix-3', type: 'shower', x: 5.4, y: 8.8, rotation: 0 },
    // Bathroom 2
    { id: 'fix-4', type: 'toilet', x: 12.3, y: 8.2, rotation: 90 },
    { id: 'fix-5', type: 'sink', x: 12.8, y: 7, rotation: 0 },
    { id: 'fix-6', type: 'shower', x: 11.8, y: 8, rotation: 0 },
    // Common bathroom
    { id: 'fix-7', type: 'toilet', x: 6.3, y: 6.5, rotation: 90 },
    { id: 'fix-8', type: 'sink', x: 6.5, y: 5.5, rotation: 0 },
    { id: 'fix-9', type: 'bathtub', x: 5.6, y: 6, rotation: 0 },
    // Kitchen
    { id: 'fix-10', type: 'kitchen-sink', x: 10, y: 6, rotation: 180 }
  ],
  
  // Furniture
  furnitureData: [
    // Living room
    { id: 'furn-1', type: 'sofa', x: 4, y: 2.5, width: 3, height: 1.2, rotation: 0 },
    { id: 'furn-2', type: 'chair', x: 7.2, y: 2.8, width: 0.8, height: 0.8, rotation: 270 },
    // Dining
    { id: 'furn-3', type: 'dining-table', x: 9.5, y: 1.2, width: 2.5, height: 1.8, rotation: 0 },
    // Master bedroom
    { id: 'furn-4', type: 'bed', x: 1.5, y: 6.5, width: 2.2, height: 2.4, rotation: 0, label: 'King' },
    // Bedroom 2
    { id: 'furn-5', type: 'bed', x: 8.2, y: 7, width: 2, height: 2.2, rotation: 0, label: 'Queen' },
    { id: 'furn-6', type: 'desk', x: 10.5, y: 7.5, width: 1.2, height: 0.6, rotation: 0 },
    // Bedroom 3
    { id: 'furn-7', type: 'bed', x: 0.5, y: 2.8, width: 1.5, height: 2, rotation: 0, label: 'Single' },
    // Study
    { id: 'furn-8', type: 'desk', x: 8, y: 5.5, width: 2, height: 0.8, rotation: 0 },
    { id: 'furn-9', type: 'chair', x: 9, y: 5.7, width: 0.6, height: 0.6, rotation: 180 }
  ]
};

async function main() {
  console.log('Starting seed...');
  
  // Clear existing templates
  await prisma.template.deleteMany({});
  console.log('Cleared existing templates');
  
  // Create 2 BHK template
  const template2BHK = await prisma.template.create({
    data: {
      ...twoBHKTemplate,
      roomsData: JSON.parse(JSON.stringify(twoBHKTemplate.roomsData)),
      doorsData: JSON.parse(JSON.stringify(twoBHKTemplate.doorsData)),
      windowsData: JSON.parse(JSON.stringify(twoBHKTemplate.windowsData)),
      fixturesData: JSON.parse(JSON.stringify(twoBHKTemplate.fixturesData)),
      furnitureData: JSON.parse(JSON.stringify(twoBHKTemplate.furnitureData))
    }
  });
  console.log(`Created 2 BHK template: ${template2BHK.id}`);
  
  // Create 3 BHK template
  const template3BHK = await prisma.template.create({
    data: {
      ...threeBHKTemplate,
      roomsData: JSON.parse(JSON.stringify(threeBHKTemplate.roomsData)),
      doorsData: JSON.parse(JSON.stringify(threeBHKTemplate.doorsData)),
      windowsData: JSON.parse(JSON.stringify(threeBHKTemplate.windowsData)),
      fixturesData: JSON.parse(JSON.stringify(threeBHKTemplate.fixturesData)),
      furnitureData: JSON.parse(JSON.stringify(threeBHKTemplate.furnitureData))
    }
  });
  console.log(`Created 3 BHK template: ${template3BHK.id}`);
  
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
