'use client';

import { Room, Door, Window, Fixture, Furniture, Section, FloorPlanShape } from '@/lib/types';
import { calculateTotalArea, calculateBounds, formatArea } from '@/lib/floor-plan-utils';
import { 
  generateDoorSVG, 
  generateWindowSVG, 
  generateFixtureSVG, 
  generateFurnitureSVG,
  generateNorthArrowSVG,
  generateDimensionLineSVG
} from '@/lib/architectural-symbols';
import { Loader2, Home, Ruler } from 'lucide-react';

interface FloorPlanCanvasProps {
  rooms: Room[];
  doors?: Door[];
  windows?: Window[];
  fixtures?: Fixture[];
  furniture?: Furniture[];
  sections?: Section[];
  shape?: FloorPlanShape;
  specifications: {
    overallWidth: number;
    overallHeight: number;
    wallThickness: number;
    ceilingHeight: number;
    unit: 'meters' | 'feet';
  };
  loading: boolean;
}

export default function FloorPlanCanvas({ 
  rooms, 
  doors = [], 
  windows = [], 
  fixtures = [], 
  furniture = [], 
  sections = [],
  shape = 'Regular',
  specifications, 
  loading 
}: FloorPlanCanvasProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading floor plan...</p>
        </div>
      </div>
    );
  }

  if (!rooms || rooms?.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500">
          <Home className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p>No floor plan available</p>
        </div>
      </div>
    );
  }

  const bounds = calculateBounds(rooms);
  const totalArea = calculateTotalArea(rooms);
  
  // Calculate SVG viewBox with padding
  const padding = 1;
  const viewBoxWidth = (bounds?.width ?? 0) + (padding * 2);
  const viewBoxHeight = (bounds?.height ?? 0) + (padding * 2);
  const wallThickness = (specifications?.wallThickness ?? 15) / 100; // Convert cm to meters

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Info Bar */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Total Area:</span>
              <span className="text-sm font-semibold text-blue-600 transition-all duration-300">
                {formatArea(totalArea, specifications?.unit ?? 'meters')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Dimensions:</span>
              <span className="text-sm font-semibold text-slate-900 transition-all duration-300">
                {specifications?.overallWidth?.toFixed?.(1) ?? '0.0'} × {specifications?.overallHeight?.toFixed?.(1) ?? '0.0'} {specifications?.unit ?? 'meters'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Wall Thickness:</span>
              <span className="text-sm font-semibold text-slate-900 transition-all duration-300">
                {specifications?.wallThickness ?? 15} cm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Ceiling Height:</span>
              <span className="text-sm font-semibold text-slate-900 transition-all duration-300">
                {specifications?.ceilingHeight ?? 3} {specifications?.unit ?? 'meters'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          <svg
            viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-auto shadow-lg rounded-lg bg-white"
            style={{ maxHeight: '80vh' }}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern
                id="grid"
                width="1"
                height="1"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 1 0 L 0 0 0 1"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="0.02"
                />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect
              x="0"
              y="0"
              width={bounds?.width ?? 0}
              height={bounds?.height ?? 0}
              fill="url(#grid)"
            />

            {/* Render section outlines for complex shapes */}
            {/* Section outlines removed for clean diagram */}

            {/* Render rooms */}
            {rooms?.map?.((room) => {
              const roomWidth = room?.width ?? 0;
              const roomHeight = room?.height ?? 0;
              const roomX = room?.x ?? 0;
              const roomY = room?.y ?? 0;
              
              // Professional architectural text - small, clean, positioned at top
              const labelFontSize = 0.28; // Fixed small size like real CAD drawings
              const dimFontSize = 0.20;   // Even smaller for dimensions
              
              const roomName = room?.name ?? 'Room';
              
              // Position text at top-center of room (professional style)
              const textX = roomX + (roomWidth / 2);
              const textY = roomY + labelFontSize + 0.15; // Small margin from top
              
              // Only show text if room is wide enough for the label
              const showLabel = roomWidth > 1.5;
              
              // Show dimensions at bottom of room if space permits
              const showDimensions = roomWidth > 2.5 && roomHeight > 2.0;
              const dimY = roomY + roomHeight - 0.35;
              
              return (
                <g key={room?.id ?? 'room'} style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {/* Room fill */}
                  <rect
                    x={roomX}
                    y={roomY}
                    width={roomWidth}
                    height={roomHeight}
                    fill={room?.color ?? '#F0F0F0'}
                    stroke="#334155"
                    strokeWidth={wallThickness}
                    style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  
                  {/* Room label - clean text at top center (professional CAD style) */}
                  {showLabel && (
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      fontSize={labelFontSize}
                      fill="#000000"
                      fontFamily="Arial, sans-serif"
                      fontWeight="normal"
                      style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {roomName}
                    </text>
                  )}
                  
                  {/* Room dimensions at bottom (professional style) */}
                  {showDimensions && (
                    <text
                      x={textX}
                      y={dimY}
                      textAnchor="middle"
                      fontSize={dimFontSize}
                      fill="#666666"
                      fontFamily="Arial, sans-serif"
                      style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {roomWidth?.toFixed?.(1)} × {roomHeight?.toFixed?.(1)} m
                    </text>
                  )}
                  
                  {/* Area at very bottom if room is tall enough */}
                  {showDimensions && roomHeight > 3.0 && (
                    <text
                      x={textX}
                      y={dimY + dimFontSize + 0.15}
                      textAnchor="middle"
                      fontSize={dimFontSize * 0.9}
                      fill="#888888"
                      fontFamily="Arial, sans-serif"
                      style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {formatArea(roomWidth * roomHeight, specifications?.unit ?? 'meters')}
                    </text>
                  )}
                </g>
              );
            }) ?? null}

            {/* Render furniture (below fixtures so fixtures appear on top) */}
            {furniture?.map?.((item) => (
              <g key={item?.id ?? 'furniture'} dangerouslySetInnerHTML={{ 
                __html: generateFurnitureSVG(item) 
              }} />
            )) ?? null}

            {/* Render doors */}
            {doors?.map?.((door) => (
              <g key={door?.id ?? 'door'} dangerouslySetInnerHTML={{ 
                __html: generateDoorSVG(door, wallThickness) 
              }} />
            )) ?? null}

            {/* Render windows */}
            {windows?.map?.((window) => (
              <g key={window?.id ?? 'window'} dangerouslySetInnerHTML={{ 
                __html: generateWindowSVG(window, wallThickness) 
              }} />
            )) ?? null}

            {/* Render fixtures */}
            {fixtures?.map?.((fixture) => (
              <g key={fixture?.id ?? 'fixture'} dangerouslySetInnerHTML={{ 
                __html: generateFixtureSVG(fixture) 
              }} />
            )) ?? null}

            {/* Outer boundary */}
            <rect
              x="0"
              y="0"
              width={bounds?.width ?? 0}
              height={bounds?.height ?? 0}
              fill="none"
              stroke="#0f172a"
              strokeWidth={wallThickness * 1.5}
              style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />

            {/* North arrow */}
            <g dangerouslySetInnerHTML={{ 
              __html: generateNorthArrowSVG((bounds?.width ?? 0) - 1.2, 1.2, 0.8) 
            }} />

            {/* Overall dimension lines */}
            <g dangerouslySetInnerHTML={{ 
              __html: generateDimensionLineSVG(
                0, 0, 
                (bounds?.width ?? 0), 0, 
                `${specifications?.overallWidth?.toFixed?.(1) ?? '0.0'} ${specifications?.unit === 'meters' ? 'm' : 'ft'}`,
                0.5
              ) 
            }} />
            <g dangerouslySetInnerHTML={{ 
              __html: generateDimensionLineSVG(
                0, 0, 
                0, (bounds?.height ?? 0), 
                `${specifications?.overallHeight?.toFixed?.(1) ?? '0.0'} ${specifications?.unit === 'meters' ? 'm' : 'ft'}`,
                0.5
              ) 
            }} />
          </svg>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Room Types</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 'living', label: 'Living Room', color: '#D4E6F1' },
                { type: 'bedroom', label: 'Bedroom', color: '#E8DAEF' },
                { type: 'kitchen', label: 'Kitchen', color: '#FCF3CF' },
                { type: 'bathroom', label: 'Bathroom', color: '#D5F4E6' },
                { type: 'balcony', label: 'Balcony', color: '#FADBD8' },
                { type: 'entrance', label: 'Entrance', color: '#E8F4F8' },
                { type: 'study', label: 'Study', color: '#FAD7A0' },
                { type: 'dining', label: 'Dining', color: '#D6EAF8' },
              ]?.map?.((item) => (
                <div key={item?.type ?? 'type'} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-slate-300"
                    style={{ backgroundColor: item?.color ?? '#F0F0F0' }}
                  />
                  <span className="text-xs text-slate-700">{item?.label ?? 'Room'}</span>
                </div>
              )) ?? null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
