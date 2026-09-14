// Shape layout utility functions for L-shaped, H-shaped, M-shaped floor plans

import { Room, Section, FloorPlanShape } from './types';

interface RoomRequirements {
  name: string;
  type: string;
  minWidth: number;
  minHeight: number;
  preferredAspectRatio: number;
}

// Minimum room requirements based on documentation
export const REQUIRED_ROOMS: Record<string, RoomRequirements> = {
  living: {
    name: 'Living Room',
    type: 'living',
    minWidth: 3,
    minHeight: 4,
    preferredAspectRatio: 1.5,
  },
  kitchen: {
    name: 'Kitchen',
    type: 'kitchen',
    minWidth: 2.5,
    minHeight: 3.2,
    preferredAspectRatio: 1.2,
  },
  maid: {
    name: "Maid's Room",
    type: 'maid-room',
    minWidth: 2.8,
    minHeight: 2.8,
    preferredAspectRatio: 1.0,
  },
  garage: {
    name: 'Garage',
    type: 'garage',
    minWidth: 5,
    minHeight: 3,
    preferredAspectRatio: 1.8,
  },
};

/**
 * Generate sections based on shape type
 */
export function generateSections(
  shape: FloorPlanShape,
  totalWidth: number,
  totalHeight: number
): Section[] {
  switch (shape) {
    case 'Regular':
      return generateRectangularSections(totalWidth, totalHeight);
    case 'L-Shaped':
      return generateLShapedSections(totalWidth, totalHeight);
    case 'H-Shaped':
      return generateHShapedSections(totalWidth, totalHeight);
    case 'M-Shaped':
      return generateMShapedSections(totalWidth, totalHeight);
    default:
      return generateRectangularSections(totalWidth, totalHeight);
  }
}

function generateRectangularSections(
  width: number,
  height: number
): Section[] {
  return [
    {
      id: 'main',
      x: 0,
      y: 0,
      width,
      height,
      name: 'Main Section',
    },
  ];
}

function generateLShapedSections(
  totalWidth: number,
  totalHeight: number
): Section[] {
  // Horizontal section (60% of height)
  const horizontalHeight = totalHeight * 0.6;
  // Vertical section (40% of height, 60% of width)
  const verticalWidth = totalWidth * 0.6;
  const verticalHeight = totalHeight * 0.4;

  return [
    {
      id: 'horizontal',
      x: 0,
      y: 0,
      width: totalWidth,
      height: horizontalHeight,
      name: 'Horizontal Wing',
    },
    {
      id: 'vertical',
      x: 0,
      y: horizontalHeight,
      width: verticalWidth,
      height: verticalHeight,
      name: 'Vertical Wing',
    },
  ];
}

function generateHShapedSections(
  totalWidth: number,
  totalHeight: number
): Section[] {
  const wingWidth = totalWidth * 0.3;
  const bridgeWidth = totalWidth * 0.4;
  const bridgeHeight = totalHeight * 0.3;
  const bridgeOffset = totalHeight * 0.35;

  return [
    {
      id: 'left-wing',
      x: 0,
      y: 0,
      width: wingWidth,
      height: totalHeight,
      name: 'Left Wing',
    },
    {
      id: 'bridge',
      x: wingWidth,
      y: bridgeOffset,
      width: bridgeWidth,
      height: bridgeHeight,
      name: 'Central Bridge',
    },
    {
      id: 'right-wing',
      x: wingWidth + bridgeWidth,
      y: 0,
      width: wingWidth,
      height: totalHeight,
      name: 'Right Wing',
    },
  ];
}

function generateMShapedSections(
  totalWidth: number,
  totalHeight: number
): Section[] {
  const wingWidth = totalWidth * 0.25;
  const centerWidth = totalWidth * 0.5;
  const wingHeight = totalHeight * 0.6;

  return [
    {
      id: 'center',
      x: wingWidth,
      y: 0,
      width: centerWidth,
      height: totalHeight,
      name: 'Central Section',
    },
    {
      id: 'left-wing',
      x: 0,
      y: 0,
      width: wingWidth,
      height: wingHeight,
      name: 'Left Wing',
    },
    {
      id: 'right-wing',
      x: wingWidth + centerWidth,
      y: 0,
      width: wingWidth,
      height: wingHeight,
      name: 'Right Wing',
    },
  ];
}

/**
 * Calculate room dimensions based on available area
 */
export function calculateRoomDimensions(
  roomKey: string,
  availableWidth: number,
  availableHeight: number
): { width: number; height: number; area: number } {
  const requirements = REQUIRED_ROOMS[roomKey];
  if (!requirements) {
    return { width: availableWidth, height: availableHeight, area: 0 };
  }

  const availableArea = availableWidth * availableHeight;
  const minArea = requirements.minWidth * requirements.minHeight;

  // Use minimum dimensions if space is tight
  if (availableArea <= minArea * 1.2) {
    return {
      width: requirements.minWidth,
      height: requirements.minHeight,
      area: minArea,
    };
  }

  // Calculate optimal dimensions based on aspect ratio
  const targetArea = Math.min(availableArea * 0.8, minArea * 1.5);
  let width = Math.sqrt(targetArea * requirements.preferredAspectRatio);
  let height = targetArea / width;

  // Ensure dimensions don't exceed available space
  if (width > availableWidth) {
    width = availableWidth * 0.9;
    height = targetArea / width;
  }
  if (height > availableHeight) {
    height = availableHeight * 0.9;
    width = targetArea / height;
  }

  return {
    width: Math.max(width, requirements.minWidth),
    height: Math.max(height, requirements.minHeight),
    area: width * height,
  };
}

/**
 * Place rooms within sections based on shape type
 */
export function placeRoomsInShape(
  shape: FloorPlanShape,
  sections: Section[],
  totalWidth: number,
  totalHeight: number
): Room[] {
  const rooms: Room[] = [];
  let roomIdCounter = 1;

  switch (shape) {
    case 'Regular':
      return placeRoomsRectangular(sections[0], roomIdCounter);
    case 'L-Shaped':
      return placeRoomsLShaped(sections, roomIdCounter);
    case 'H-Shaped':
      return placeRoomsHShaped(sections, roomIdCounter);
    case 'M-Shaped':
      return placeRoomsMShaped(sections, roomIdCounter);
    default:
      return rooms;
  }
}

function placeRoomsRectangular(section: Section, startId: number): Room[] {
  const rooms: Room[] = [];
  const padding = 0.5;
  const availableWidth = section.width - padding * 2;
  const availableHeight = section.height - padding * 2;
  
  // Calculate room widths as percentages with proper spacing
  const garageWidth = availableWidth * 0.28;
  const kitchenWidth = availableWidth * 0.22;
  const livingWidth = availableWidth * 0.32;
  const maidWidth = availableWidth * 0.18;

  let currentX = section.x + padding;

  // Garage (left side)
  const garageDims = calculateRoomDimensions('garage', garageWidth, availableHeight);
  const actualGarageWidth = Math.min(garageDims.width, garageWidth);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Garage',
    type: 'garage',
    x: currentX,
    y: section.y + padding,
    width: actualGarageWidth,
    height: Math.min(garageDims.height, availableHeight),
    color: '#9CA3AF',
    floor: 1,
  });
  currentX += actualGarageWidth + padding;

  // Kitchen
  const kitchenDims = calculateRoomDimensions('kitchen', kitchenWidth, availableHeight);
  const actualKitchenWidth = Math.min(kitchenDims.width, kitchenWidth);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Kitchen',
    type: 'kitchen',
    x: currentX,
    y: section.y + padding,
    width: actualKitchenWidth,
    height: Math.min(kitchenDims.height, availableHeight),
    color: '#FDE68A',
    floor: 1,
  });
  currentX += actualKitchenWidth + padding;

  // Living Room (central)
  const livingDims = calculateRoomDimensions('living', livingWidth, availableHeight);
  const actualLivingWidth = Math.min(livingDims.width, livingWidth);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Living Room',
    type: 'living',
    x: currentX,
    y: section.y + padding,
    width: actualLivingWidth,
    height: Math.min(livingDims.height, availableHeight),
    color: '#BFDBFE',
    floor: 1,
  });
  currentX += actualLivingWidth + padding;

  // Maid's Room (right side)
  const maidDims = calculateRoomDimensions('maid', maidWidth, availableHeight);
  const actualMaidWidth = Math.min(maidDims.width, maidWidth);
  rooms.push({
    id: `room-${startId++}`,
    name: "Maid's Room",
    type: 'maid-room',
    x: currentX,
    y: section.y + padding,
    width: actualMaidWidth,
    height: Math.min(maidDims.height, availableHeight),
    color: '#E9D5FF',
    floor: 1,
  });

  return rooms;
}

function placeRoomsLShaped(sections: Section[], startId: number): Room[] {
  const rooms: Room[] = [];
  const padding = 0.5;
  const horizontal = sections[0];
  const vertical = sections[1];

  // Calculate available space for each section
  const horizontalAvailWidth = horizontal.width - padding * 2;
  const horizontalAvailHeight = horizontal.height - padding * 2;
  const verticalAvailWidth = vertical.width - padding * 2;
  const verticalAvailHeight = vertical.height - padding * 2;

  // Horizontal section: Living Room + Kitchen (side by side)
  const livingWidth = horizontalAvailWidth * 0.55;
  const kitchenWidth = horizontalAvailWidth * 0.40;
  
  const livingDims = calculateRoomDimensions('living', livingWidth, horizontalAvailHeight);
  const actualLivingWidth = Math.min(livingDims.width, livingWidth);
  const actualLivingHeight = Math.min(livingDims.height, horizontalAvailHeight);
  
  rooms.push({
    id: `room-${startId++}`,
    name: 'Living Room',
    type: 'living',
    x: horizontal.x + padding,
    y: horizontal.y + padding,
    width: actualLivingWidth,
    height: actualLivingHeight,
    color: '#BFDBFE',
    floor: 1,
  });

  const kitchenDims = calculateRoomDimensions('kitchen', kitchenWidth, horizontalAvailHeight);
  const actualKitchenWidth = Math.min(kitchenDims.width, kitchenWidth);
  const actualKitchenHeight = Math.min(kitchenDims.height, horizontalAvailHeight);
  
  rooms.push({
    id: `room-${startId++}`,
    name: 'Kitchen',
    type: 'kitchen',
    x: horizontal.x + actualLivingWidth + padding * 2,
    y: horizontal.y + padding,
    width: actualKitchenWidth,
    height: actualKitchenHeight,
    color: '#FDE68A',
    floor: 1,
  });

  // Vertical section: Garage + Maid's Room (side by side)
  // This ensures no overlap with horizontal section rooms
  const garageWidth = verticalAvailWidth * 0.65;
  const maidWidth = verticalAvailWidth * 0.30;
  
  const garageDims = calculateRoomDimensions('garage', garageWidth, verticalAvailHeight);
  const actualGarageWidth = Math.min(garageDims.width, garageWidth);
  const actualGarageHeight = Math.min(garageDims.height, verticalAvailHeight);
  
  rooms.push({
    id: `room-${startId++}`,
    name: 'Garage',
    type: 'garage',
    x: vertical.x + padding,
    y: vertical.y + padding,
    width: actualGarageWidth,
    height: actualGarageHeight,
    color: '#9CA3AF',
    floor: 1,
  });

  const maidDims = calculateRoomDimensions('maid', maidWidth, verticalAvailHeight);
  const actualMaidWidth = Math.min(maidDims.width, maidWidth);
  const actualMaidHeight = Math.min(maidDims.height, verticalAvailHeight);
  
  rooms.push({
    id: `room-${startId++}`,
    name: "Maid's Room",
    type: 'maid-room',
    x: vertical.x + actualGarageWidth + padding * 2,
    y: vertical.y + padding,
    width: actualMaidWidth,
    height: actualMaidHeight,
    color: '#E9D5FF',
    floor: 1,
  });

  return rooms;
}

function placeRoomsHShaped(sections: Section[], startId: number): Room[] {
  const rooms: Room[] = [];
  const padding = 0.3;
  const leftWing = sections[0];
  const rightWing = sections[2];

  // Left Wing: Living Room + Kitchen
  const livingDims = calculateRoomDimensions('living', leftWing.width - padding * 2, leftWing.height * 0.6);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Living Room',
    type: 'living',
    x: leftWing.x + padding,
    y: leftWing.y + padding,
    width: livingDims.width,
    height: livingDims.height,
    color: '#BFDBFE',
    floor: 1,
  });

  const kitchenDims = calculateRoomDimensions('kitchen', leftWing.width - padding * 2, leftWing.height * 0.35);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Kitchen',
    type: 'kitchen',
    x: leftWing.x + padding,
    y: leftWing.y + livingDims.height + padding * 2,
    width: kitchenDims.width,
    height: kitchenDims.height,
    color: '#FDE68A',
    floor: 1,
  });

  // Right Wing: Garage + Maid's Room
  const garageDims = calculateRoomDimensions('garage', rightWing.width - padding * 2, rightWing.height * 0.55);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Garage',
    type: 'garage',
    x: rightWing.x + padding,
    y: rightWing.y + padding,
    width: garageDims.width,
    height: garageDims.height,
    color: '#9CA3AF',
    floor: 1,
  });

  const maidDims = calculateRoomDimensions('maid', rightWing.width - padding * 2, rightWing.height * 0.4);
  rooms.push({
    id: `room-${startId++}`,
    name: "Maid's Room",
    type: 'maid-room',
    x: rightWing.x + padding,
    y: rightWing.y + garageDims.height + padding * 2,
    width: maidDims.width,
    height: maidDims.height,
    color: '#E9D5FF',
    floor: 1,
  });

  return rooms;
}

function placeRoomsMShaped(sections: Section[], startId: number): Room[] {
  const rooms: Room[] = [];
  const padding = 0.3;
  const center = sections[0];
  const leftWing = sections[1];
  const rightWing = sections[2];

  // Central section: Living Room + Kitchen
  const livingDims = calculateRoomDimensions('living', center.width - padding * 2, center.height * 0.55);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Living Room',
    type: 'living',
    x: center.x + padding,
    y: center.y + padding,
    width: livingDims.width,
    height: livingDims.height,
    color: '#BFDBFE',
    floor: 1,
  });

  const kitchenDims = calculateRoomDimensions('kitchen', center.width - padding * 2, center.height * 0.4);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Kitchen',
    type: 'kitchen',
    x: center.x + padding,
    y: center.y + livingDims.height + padding * 2,
    width: kitchenDims.width,
    height: kitchenDims.height,
    color: '#FDE68A',
    floor: 1,
  });

  // Left Wing: Garage
  const garageDims = calculateRoomDimensions('garage', leftWing.width - padding * 2, leftWing.height - padding * 2);
  rooms.push({
    id: `room-${startId++}`,
    name: 'Garage',
    type: 'garage',
    x: leftWing.x + padding,
    y: leftWing.y + padding,
    width: garageDims.width,
    height: garageDims.height,
    color: '#9CA3AF',
    floor: 1,
  });

  // Right Wing: Maid's Room
  const maidDims = calculateRoomDimensions('maid', rightWing.width - padding * 2, rightWing.height - padding * 2);
  rooms.push({
    id: `room-${startId++}`,
    name: "Maid's Room",
    type: 'maid-room',
    x: rightWing.x + padding,
    y: rightWing.y + padding,
    width: maidDims.width,
    height: maidDims.height,
    color: '#E9D5FF',
    floor: 1,
  });

  return rooms;
}

/**
 * Calculate total area of complex shapes
 */
export function calculateShapeArea(sections: Section[]): number {
  return sections.reduce((total, section) => {
    return total + section.width * section.height;
  }, 0);
}

/**
 * Validate if all required rooms fit within the shape
 */
export function validateShapeLayout(rooms: Room[], sections: Section[]): boolean {
  // Check if all required room types are present
  const requiredTypes: string[] = ['living', 'kitchen', 'maid-room', 'garage'];
  const presentTypes = new Set<string>(rooms.map((r) => r.type));

  for (const reqType of requiredTypes) {
    if (!presentTypes.has(reqType)) {
      return false;
    }
  }

  // Check if rooms don't overlap and fit within sections
  for (const room of rooms) {
    const inSection = sections.some(
      (section) =>
        room.x >= section.x &&
        room.x + room.width <= section.x + section.width &&
        room.y >= section.y &&
        room.y + room.height <= section.y + section.height
    );
    if (!inSection) {
      return false;
    }
  }

  return true;
}
