'use client';

import { BHKType, PropertyType, FloorPlanShape } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save, Download, Home, Ruler, Layers, Droplets, Building2, Square } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ControlsPanelProps {
  bhkType: BHKType;
  propertyType: PropertyType;
  shape: FloorPlanShape;
  onBhkTypeChange: (type: BHKType) => void;
  onPropertyTypeChange: (type: PropertyType) => void;
  onShapeChange: (shape: FloorPlanShape) => void;
  specifications: {
    overallWidth: number;
    overallHeight: number;
    wallThickness: number;
    ceilingHeight: number;
    unit: 'meters' | 'feet';
  };
  onSpecificationsChange: (specs: any) => void;
}

export default function ControlsPanel({
  bhkType,
  propertyType,
  shape,
  onBhkTypeChange,
  onPropertyTypeChange,
  onShapeChange,
  specifications,
  onSpecificationsChange
}: ControlsPanelProps) {
  const bhkOptions: BHKType[] = ['Studio', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];
  const propertyOptions: PropertyType[] = ['Apartment', 'Condo', 'Villa', 'Townhouse', 'Duplex', 'Penthouse', 'Bungalow'];
  const shapeOptions: FloorPlanShape[] = ['Regular', 'L-Shaped', 'H-Shaped', 'M-Shaped'];

  return (
    <div className="p-6 space-y-6">
      {/* Property Type Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Property Type</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {propertyOptions.slice(0, 6).map((type) => (
            <Button
              key={type}
              variant={propertyType === type ? 'default' : 'outline'}
              className={propertyType === type ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={() => onPropertyTypeChange(type)}
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <Button
            variant={propertyType === 'Bungalow' ? 'default' : 'outline'}
            className={propertyType === 'Bungalow' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            onClick={() => onPropertyTypeChange('Bungalow')}
            size="sm"
          >
            Bungalow
          </Button>
        </div>
      </div>

      <Separator />

      {/* BHK Type Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Home className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Layout Type</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {bhkOptions.map((type) => (
            <Button
              key={type}
              variant={bhkType === type ? 'default' : 'outline'}
              className={bhkType === type ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={() => onBhkTypeChange(type)}
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Floor Plan Shape Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Square className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Floor Plan Shape</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shapeOptions.map((shapeType) => (
            <Button
              key={shapeType}
              variant={shape === shapeType ? 'default' : 'outline'}
              className={shape === shapeType ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={() => onShapeChange(shapeType)}
              size="sm"
            >
              {shapeType}
            </Button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Complex shapes include Living Room, Kitchen, Maid&apos;s Room, and Garage
        </p>
      </div>

      <Separator />

      {/* Drainage & Sewage */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Drainage & Sewage</Label>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-slate-600">Drainage System</Label>
            <select 
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white"
              defaultValue="gravity"
            >
              <option value="gravity">Gravity Flow</option>
              <option value="pumped">Pumped System</option>
              <option value="combined">Combined System</option>
            </select>
          </div>
          <div>
            <Label className="text-sm text-slate-600">Sewage Outlet</Label>
            <select 
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white"
              defaultValue="municipal"
            >
              <option value="municipal">Municipal Line</option>
              <option value="septic">Septic Tank</option>
              <option value="treatment">Treatment Plant</option>
            </select>
          </div>
          <div>
            <Label className="text-sm text-slate-600">Pipe Diameter</Label>
            <select 
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white"
              defaultValue="100mm"
            >
              <option value="75mm">75mm</option>
              <option value="100mm">100mm (Standard)</option>
              <option value="150mm">150mm</option>
            </select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Dimensions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Ruler className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Overall Dimensions</Label>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="width" className="text-sm text-slate-600">Width ({specifications?.unit ?? 'meters'})</Label>
            <Input
              id="width"
              type="number"
              value={specifications?.overallWidth ?? 12}
              onChange={(e) => onSpecificationsChange?.({ 
                ...specifications, 
                overallWidth: parseFloat(e?.target?.value ?? '12') 
              })}
              step="0.1"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-sm text-slate-600">Length ({specifications?.unit ?? 'meters'})</Label>
            <Input
              id="height"
              type="number"
              value={specifications?.overallHeight ?? 10}
              onChange={(e) => onSpecificationsChange?.({ 
                ...specifications, 
                overallHeight: parseFloat(e?.target?.value ?? '10') 
              })}
              step="0.1"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Wall Specifications */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Wall Specifications</Label>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor="wallThickness" className="text-sm text-slate-600">Wall Thickness (cm)</Label>
            <Input
              id="wallThickness"
              type="number"
              value={specifications?.wallThickness ?? 15}
              onChange={(e) => onSpecificationsChange?.({ 
                ...specifications, 
                wallThickness: parseFloat(e?.target?.value ?? '15') 
              })}
              step="0.5"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ceilingHeight" className="text-sm text-slate-600">Ceiling Height ({specifications?.unit ?? 'meters'})</Label>
            <Input
              id="ceilingHeight"
              type="number"
              value={specifications?.ceilingHeight ?? 3}
              onChange={(e) => onSpecificationsChange?.({ 
                ...specifications, 
                ceilingHeight: parseFloat(e?.target?.value ?? '3') 
              })}
              step="0.1"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Drainage & Sewage (Placeholder for future) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-semibold">Drainage & Sewage</Label>
        </div>
        <p className="text-sm text-slate-500 italic">
          Advanced specifications coming in next update
        </p>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
          <Save className="h-4 w-4 mr-2" />
          Save Design
        </Button>
        <Button variant="outline" className="w-full" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <p className="text-xs text-slate-500 text-center mt-2">
          Save and Export features coming soon
        </p>
      </div>
    </div>
  );
}
