// Extended type definitions with architectural elements

export type BHKType = 'Studio' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK+';

export type PropertyType = 
  | 'Apartment' 
  | 'Condo' 
  | 'Villa' 
  | 'Townhouse' 
  | 'Duplex' 
  | 'Penthouse'
  | 'Studio'
  | 'Bungalow';

export type FloorPlanShape = 
  | 'Regular' 
  | 'L-Shaped' 
  | 'H-Shaped' 
  | 'M-Shaped';

export interface Section {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name?: string;
}

export type RoomType = 
  | 'living' 
  | 'bedroom' 
  | 'master-bedroom'
  | 'kitchen' 
  | 'bathroom' 
  | 'master-bathroom'
  | 'balcony' 
  | 'entrance' 
  | 'foyer'
  | 'study' 
  | 'dining' 
  | 'utility'
  | 'corridor'
  | 'storage'
  | 'maid-room'
  | 'garage';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  floor: number;
}

export interface Door {
  id: string;
  type: 'single' | 'double' | 'sliding' | 'bifold' | 'pocket';
  x: number;
  y: number;
  width: number;
  wallSide: 'north' | 'south' | 'east' | 'west';
  opensInward: boolean;
}

export interface Window {
  id: string;
  type: 'fixed' | 'sliding' | 'casement' | 'bay';
  x: number;
  y: number;
  width: number;
  wallSide: 'north' | 'south' | 'east' | 'west';
}

export interface Fixture {
  id: string;
  type: 'toilet' | 'sink' | 'shower' | 'bathtub' | 'kitchen-sink';
  x: number;
  y: number;
  rotation: number;
}

export interface Furniture {
  id: string;
  type: 'bed' | 'sofa' | 'dining-table' | 'desk' | 'chair';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
}

export interface Template {
  id: string;
  name: string;
  bhkType: BHKType;
  propertyType: PropertyType;
  shape: FloorPlanShape;
  description: string;
  sections?: Section[];
  roomsData: Room[];
  doorsData?: Door[];
  windowsData?: Window[];
  fixturesData?: Fixture[];
  furnitureData?: Furniture[];
  totalArea?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Design {
  id: string;
  name: string;
  bhkType: BHKType;
  templateId: string;
  roomsData: Room[];
  doorsData?: Door[];
  windowsData?: Window[];
  fixturesData?: Fixture[];
  furnitureData?: Furniture[];
  overallWidth: number;
  overallHeight: number;
  wallThickness: number;
  ceilingHeight: number;
  unit: 'meters' | 'feet';
  createdAt: Date;
  updatedAt: Date;
}

export interface DesignSpecifications {
  overallWidth: number;
  overallHeight: number;
  wallThickness: number;
  ceilingHeight: number;
  unit: 'meters' | 'feet';
}

export interface Configuration {
  id: string;
  designId: string;
  drainageType?: string;
  sewageType?: string;
  flooringMaterial?: string;
  wallMaterial?: string;
  roofingMaterial?: string;
  additionalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreference {
  id: string;
  userId: string;
  preferredUnit: 'meters' | 'feet';
  defaultWallThickness: number;
  defaultCeilingHeight: number;
  createdAt: Date;
  updatedAt: Date;
}
