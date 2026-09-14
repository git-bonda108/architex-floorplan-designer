import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Professional floor plan templates based on architectural standards

interface Room {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

const twoBHKRooms: Room[] = [
  {
    id: 'foyer-1',
    name: 'Foyer',
    type: 'entrance',
    x: 0,
    y: 0,
    width: 2.5,
    height: 2,
    color: '#E8F4F8'
  },
  {
    id: 'living-1',
    name: 'Living Room',
    type: 'living',
    x: 0,
    y: 2,
    width: 5,
    height: 4.5,
    color: '#D4E6F1'
  },
  {
    id: 'kitchen-1',
    name: 'Kitchen',
    type: 'kitchen',
    x: 5,
    y: 0,
    width: 3,
    height: 3,
    color: '#FCF3CF'
  },
  {
    id: 'bedroom-1',
    name: 'Master Bedroom',
    type: 'bedroom',
    x: 5,
    y: 3,
    width: 4,
    height: 3.5,
    color: '#E8DAEF'
  },
  {
    id: 'bedroom-2',
    name: 'Bedroom 2',
    type: 'bedroom',
    x: 0,
    y: 6.5,
    width: 3.5,
    height: 3,
    color: '#E8DAEF'
  },
  {
    id: 'bathroom-1',
    name: 'Bathroom 1',
    type: 'bathroom',
    x: 9,
    y: 3,
    width: 2,
    height: 2,
    color: '#D5F4E6'
  },
  {
    id: 'bathroom-2',
    name: 'Bathroom 2',
    type: 'bathroom',
    x: 3.5,
    y: 6.5,
    width: 1.5,
    height: 2,
    color: '#D5F4E6'
  },
  {
    id: 'balcony-1',
    name: 'Balcony',
    type: 'balcony',
    x: 5,
    y: 6.5,
    width: 4,
    height: 1.5,
    color: '#FADBD8'
  }
];

const threeBHKRooms: Room[] = [
  {
    id: 'foyer-1',
    name: 'Foyer',
    type: 'entrance',
    x: 0,
    y: 0,
    width: 3,
    height: 2.5,
    color: '#E8F4F8'
  },
  {
    id: 'living-1',
    name: 'Living Room',
    type: 'living',
    x: 0,
    y: 2.5,
    width: 6,
    height: 5,
    color: '#D4E6F1'
  },
  {
    id: 'dining-1',
    name: 'Dining Area',
    type: 'dining',
    x: 6,
    y: 2.5,
    width: 3.5,
    height: 3,
    color: '#D6EAF8'
  },
  {
    id: 'kitchen-1',
    name: 'Kitchen',
    type: 'kitchen',
    x: 6,
    y: 0,
    width: 3.5,
    height: 2.5,
    color: '#FCF3CF'
  },
  {
    id: 'bedroom-1',
    name: 'Master Bedroom',
    type: 'bedroom',
    x: 9.5,
    y: 0,
    width: 4.5,
    height: 4,
    color: '#E8DAEF'
  },
  {
    id: 'bedroom-2',
    name: 'Bedroom 2',
    type: 'bedroom',
    x: 0,
    y: 7.5,
    width: 4,
    height: 3.5,
    color: '#E8DAEF'
  },
  {
    id: 'bedroom-3',
    name: 'Bedroom 3',
    type: 'bedroom',
    x: 4,
    y: 7.5,
    width: 3.5,
    height: 3.5,
    color: '#E8DAEF'
  },
  {
    id: 'study-1',
    name: 'Study',
    type: 'study',
    x: 9.5,
    y: 5.5,
    width: 2.5,
    height: 2.5,
    color: '#FAD7A0'
  },
  {
    id: 'bathroom-1',
    name: 'Master Bathroom',
    type: 'bathroom',
    x: 9.5,
    y: 4,
    width: 2.5,
    height: 1.5,
    color: '#D5F4E6'
  },
  {
    id: 'bathroom-2',
    name: 'Bathroom 2',
    type: 'bathroom',
    x: 7.5,
    y: 7.5,
    width: 2,
    height: 2,
    color: '#D5F4E6'
  },
  {
    id: 'bathroom-3',
    name: 'Common Bathroom',
    type: 'bathroom',
    x: 12,
    y: 4,
    width: 2,
    height: 1.5,
    color: '#D5F4E6'
  },
  {
    id: 'balcony-1',
    name: 'Balcony 1',
    type: 'balcony',
    x: 6,
    y: 5.5,
    width: 3.5,
    height: 1.5,
    color: '#FADBD8'
  },
  {
    id: 'balcony-2',
    name: 'Balcony 2',
    type: 'balcony',
    x: 9.5,
    y: 8,
    width: 4.5,
    height: 1.5,
    color: '#FADBD8'
  }
];

async function main() {
  console.log('Starting database seed...');

  // Clear existing templates
  await prisma.template.deleteMany({});
  console.log('Cleared existing templates');

  // Create 2 BHK Template
  const twoBHK = await prisma.template.create({
    data: {
      name: '2 BHK Standard',
      bhkType: '2BHK',
      description: 'Standard 2 bedroom apartment with living room, kitchen, 2 bathrooms and balcony',
      roomsData: twoBHKRooms as any
    }
  });
  console.log('Created 2 BHK template:', twoBHK.id);

  // Create 3 BHK Template
  const threeBHK = await prisma.template.create({
    data: {
      name: '3 BHK Deluxe',
      bhkType: '3BHK',
      description: 'Deluxe 3 bedroom apartment with living room, dining area, kitchen, study, 3 bathrooms and 2 balconies',
      roomsData: threeBHKRooms as any
    }
  });
  console.log('Created 3 BHK template:', threeBHK.id);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
