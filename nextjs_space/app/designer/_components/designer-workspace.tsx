'use client';

import { useState, useEffect, useMemo } from 'react';
import { Room, Door, Window, Fixture, Furniture, BHKType, PropertyType, FloorPlanShape, Section } from '@/lib/types';
import ControlsPanel from './controls-panel';
import FloorPlanCanvas from './floor-plan-canvas';
import { calculateBounds } from '@/lib/floor-plan-utils';
import { generateSections, placeRoomsInShape } from '@/lib/shape-layout-utils';

export default function DesignerWorkspace() {
  const [bhkType, setBhkType] = useState<BHKType>('2BHK');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [shape, setShape] = useState<FloorPlanShape>('Regular');
  const [templateRooms, setTemplateRooms] = useState<Room[]>([]);
  const [templateDoors, setTemplateDoors] = useState<Door[]>([]);
  const [templateWindows, setTemplateWindows] = useState<Window[]>([]);
  const [templateFixtures, setTemplateFixtures] = useState<Fixture[]>([]);
  const [templateFurniture, setTemplateFurniture] = useState<Furniture[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [specifications, setSpecifications] = useState({
    overallWidth: 12,
    overallHeight: 10,
    wallThickness: 15,
    ceilingHeight: 3,
    unit: 'meters' as 'meters' | 'feet'
  });

  // Generate sections when shape or dimensions change
  useEffect(() => {
    const newSections = generateSections(shape, specifications.overallWidth, specifications.overallHeight);
    setSections(newSections);
    
    // Generate rooms based on shape
    const newRooms = placeRoomsInShape(shape, newSections, specifications.overallWidth, specifications.overallHeight);
    setTemplateRooms(newRooms);
  }, [shape, specifications.overallWidth, specifications.overallHeight]);

  useEffect(() => {
    fetchTemplate(bhkType, propertyType);
  }, [bhkType, propertyType]);

  const fetchTemplate = async (bhk: BHKType, property: PropertyType) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/templates?bhkType=${bhk}&propertyType=${property}`);
      if (response?.ok) {
        const templates = await response?.json?.();
        // Get the first matching template or fall back to first available
        const template = templates?.[0];
        if (template?.roomsData) {
          setTemplateRooms(template?.roomsData as Room[]);
          setTemplateDoors((template?.doorsData as Door[]) || []);
          setTemplateWindows((template?.windowsData as Window[]) || []);
          setTemplateFixtures((template?.fixturesData as Fixture[]) || []);
          setTemplateFurniture((template?.furnitureData as Furniture[]) || []);
        }
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate scale factors
  const scaleFactors = useMemo(() => {
    if (!templateRooms || templateRooms?.length === 0) return { scaleX: 1, scaleY: 1 };
    
    const originalBounds = calculateBounds(templateRooms);
    if (!originalBounds) return { scaleX: 1, scaleY: 1 };

    return {
      scaleX: specifications.overallWidth / originalBounds.width,
      scaleY: specifications.overallHeight / originalBounds.height
    };
  }, [templateRooms, specifications.overallWidth, specifications.overallHeight]);

  // Scale rooms dynamically based on specifications
  const scaledRooms = useMemo(() => {
    if (!templateRooms || templateRooms?.length === 0) return [];

    return templateRooms.map((room) => ({
      ...room,
      x: room.x * scaleFactors.scaleX,
      y: room.y * scaleFactors.scaleY,
      width: room.width * scaleFactors.scaleX,
      height: room.height * scaleFactors.scaleY,
    }));
  }, [templateRooms, scaleFactors]);

  // Scale doors
  const scaledDoors = useMemo(() => {
    if (!templateDoors || templateDoors?.length === 0) return [];

    return templateDoors.map((door) => ({
      ...door,
      x: door.x * scaleFactors.scaleX,
      y: door.y * scaleFactors.scaleY,
      width: door.width * Math.min(scaleFactors.scaleX, scaleFactors.scaleY), // Use smaller scale for proportional door width
    }));
  }, [templateDoors, scaleFactors]);

  // Scale windows
  const scaledWindows = useMemo(() => {
    if (!templateWindows || templateWindows?.length === 0) return [];

    return templateWindows.map((window) => ({
      ...window,
      x: window.x * scaleFactors.scaleX,
      y: window.y * scaleFactors.scaleY,
      width: window.width * Math.min(scaleFactors.scaleX, scaleFactors.scaleY),
    }));
  }, [templateWindows, scaleFactors]);

  // Scale fixtures
  const scaledFixtures = useMemo(() => {
    if (!templateFixtures || templateFixtures?.length === 0) return [];

    return templateFixtures.map((fixture) => ({
      ...fixture,
      x: fixture.x * scaleFactors.scaleX,
      y: fixture.y * scaleFactors.scaleY,
    }));
  }, [templateFixtures, scaleFactors]);

  // Scale furniture
  const scaledFurniture = useMemo(() => {
    if (!templateFurniture || templateFurniture?.length === 0) return [];

    return templateFurniture.map((furniture) => ({
      ...furniture,
      x: furniture.x * scaleFactors.scaleX,
      y: furniture.y * scaleFactors.scaleY,
      width: furniture.width * scaleFactors.scaleX,
      height: furniture.height * scaleFactors.scaleY,
    }));
  }, [templateFurniture, scaleFactors]);

  return (
    <div className="h-full flex">
      {/* Controls Panel - Left Side */}
      <div className="w-80 border-r bg-white overflow-y-auto">
        <ControlsPanel
          bhkType={bhkType}
          propertyType={propertyType}
          shape={shape}
          onBhkTypeChange={setBhkType}
          onPropertyTypeChange={setPropertyType}
          onShapeChange={setShape}
          specifications={specifications}
          onSpecificationsChange={setSpecifications}
        />
      </div>

      {/* Floor Plan Canvas - Right Side */}
      <div className="flex-1 overflow-hidden">
        <FloorPlanCanvas
          rooms={scaledRooms}
          doors={scaledDoors}
          windows={scaledWindows}
          fixtures={scaledFixtures}
          furniture={scaledFurniture}
          sections={sections}
          shape={shape}
          specifications={specifications}
          loading={loading}
        />
      </div>
    </div>
  );
}
