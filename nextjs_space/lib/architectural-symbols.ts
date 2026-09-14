// Architectural Symbols Library for Floor Plans
// Based on professional CAD standards and architectural drawing conventions

export type DoorType = 'single' | 'double' | 'sliding' | 'bifold' | 'pocket';
export type WindowType = 'fixed' | 'sliding' | 'casement' | 'bay';
export type FixtureType = 'toilet' | 'sink' | 'shower' | 'bathtub' | 'kitchen-sink';
export type FurnitureType = 'bed' | 'sofa' | 'dining-table' | 'desk' | 'chair';

export interface Door {
  id: string;
  type: DoorType;
  x: number;
  y: number;
  width: number;
  wallSide: 'north' | 'south' | 'east' | 'west';
  opensInward: boolean;
}

export interface Window {
  id: string;
  type: WindowType;
  x: number;
  y: number;
  width: number;
  wallSide: 'north' | 'south' | 'east' | 'west';
}

export interface Fixture {
  id: string;
  type: FixtureType;
  x: number;
  y: number;
  rotation: number;
}

export interface Furniture {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
}

/**
 * Generate SVG path for a single hinged door with swing arc
 * @param door Door configuration
 * @param wallThickness Wall thickness in meters
 * @returns SVG group element as string
 */
export function generateDoorSVG(door: Door, wallThickness: number): string {
  const { x, y, width, wallSide, opensInward } = door;
  const doorThickness = wallThickness * 0.8;
  
  let doorPath = '';
  let arcPath = '';
  
  switch (wallSide) {
    case 'north':
      // Door opening on top wall
      doorPath = `M ${x} ${y} L ${x + width} ${y}`;
      if (opensInward) {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 1 ${x + width} ${y + width} L ${x + width} ${y}`;
      } else {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 0 ${x + width} ${y - width} L ${x + width} ${y}`;
      }
      break;
    case 'south':
      // Door opening on bottom wall
      doorPath = `M ${x} ${y} L ${x + width} ${y}`;
      if (opensInward) {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 0 ${x + width} ${y - width} L ${x + width} ${y}`;
      } else {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 1 ${x + width} ${y + width} L ${x + width} ${y}`;
      }
      break;
    case 'east':
      // Door opening on right wall
      doorPath = `M ${x} ${y} L ${x} ${y + width}`;
      if (opensInward) {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 0 ${x - width} ${y + width} L ${x} ${y + width}`;
      } else {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 1 ${x + width} ${y + width} L ${x} ${y + width}`;
      }
      break;
    case 'west':
      // Door opening on left wall
      doorPath = `M ${x} ${y} L ${x} ${y + width}`;
      if (opensInward) {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 1 ${x + width} ${y + width} L ${x} ${y + width}`;
      } else {
        arcPath = `M ${x} ${y} A ${width} ${width} 0 0 0 ${x - width} ${y + width} L ${x} ${y + width}`;
      }
      break;
  }
  
  return `
    <g class="door" style="transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
      <!-- Door opening -->
      <path d="${doorPath}" stroke="#FFFFFF" stroke-width="${doorThickness}" fill="none" />
      <!-- Door swing arc -->
      <path d="${arcPath}" stroke="#94A3B8" stroke-width="0.02" fill="none" stroke-dasharray="0.1 0.05" />
    </g>
  `;
}

/**
 * Generate SVG for a window
 * @param window Window configuration
 * @param wallThickness Wall thickness in meters
 * @returns SVG group element as string
 */
export function generateWindowSVG(window: Window, wallThickness: number): string {
  const { x, y, width, wallSide, type } = window;
  const glassThickness = wallThickness * 0.3;
  const frameThickness = 0.05;
  
  let windowPath = '';
  
  switch (wallSide) {
    case 'north':
    case 'south':
      // Horizontal window
      windowPath = `
        <rect x="${x}" y="${y - glassThickness/2}" width="${width}" height="${glassThickness}" 
              fill="#E0F2FE" stroke="#334155" stroke-width="${frameThickness}" />
        ${type === 'sliding' ? `<line x1="${x + width/2}" y1="${y - glassThickness/2}" x2="${x + width/2}" y2="${y + glassThickness/2}" stroke="#334155" stroke-width="${frameThickness}" />` : ''}
      `;
      break;
    case 'east':
    case 'west':
      // Vertical window
      windowPath = `
        <rect x="${x - glassThickness/2}" y="${y}" width="${glassThickness}" height="${width}" 
              fill="#E0F2FE" stroke="#334155" stroke-width="${frameThickness}" />
        ${type === 'sliding' ? `<line x1="${x - glassThickness/2}" y1="${y + width/2}" x2="${x + glassThickness/2}" y2="${y + width/2}" stroke="#334155" stroke-width="${frameThickness}" />` : ''}
      `;
      break;
  }
  
  return `
    <g class="window" style="transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
      ${windowPath}
    </g>
  `;
}

/**
 * Generate SVG for a bathroom/kitchen fixture
 * @param fixture Fixture configuration
 * @returns SVG group element as string
 */
export function generateFixtureSVG(fixture: Fixture): string {
  const { x, y, type, rotation } = fixture;
  let fixturePath = '';
  
  switch (type) {
    case 'toilet':
      fixturePath = `
        <g transform="translate(${x},${y}) rotate(${rotation})">
          <ellipse cx="0" cy="-0.15" rx="0.25" ry="0.35" fill="#FFFFFF" stroke="#64748B" stroke-width="0.02" />
          <rect x="-0.2" y="0.15" width="0.4" height="0.25" rx="0.05" fill="#FFFFFF" stroke="#64748B" stroke-width="0.02" />
        </g>
      `;
      break;
    case 'sink':
    case 'kitchen-sink':
      const sinkWidth = type === 'kitchen-sink' ? 0.8 : 0.5;
      fixturePath = `
        <g transform="translate(${x},${y}) rotate(${rotation})">
          <rect x="${-sinkWidth/2}" y="-0.3" width="${sinkWidth}" height="0.6" rx="0.05" 
                fill="#FFFFFF" stroke="#64748B" stroke-width="0.02" />
          <ellipse cx="0" cy="0" rx="${sinkWidth * 0.3}" ry="0.2" fill="#E2E8F0" stroke="#64748B" stroke-width="0.02" />
        </g>
      `;
      break;
    case 'shower':
      fixturePath = `
        <g transform="translate(${x},${y}) rotate(${rotation})">
          <rect x="-0.45" y="-0.45" width="0.9" height="0.9" fill="#F1F5F9" stroke="#64748B" stroke-width="0.02" />
          <circle cx="0" cy="-0.3" r="0.08" fill="#94A3B8" />
          <line x1="-0.05" y1="-0.25" x2="0.05" y2="-0.15" stroke="#94A3B8" stroke-width="0.02" />
          <line x1="0.05" y1="-0.25" x2="-0.05" y2="-0.15" stroke="#94A3B8" stroke-width="0.02" />
        </g>
      `;
      break;
    case 'bathtub':
      fixturePath = `
        <g transform="translate(${x},${y}) rotate(${rotation})">
          <rect x="-0.4" y="-0.85" width="0.8" height="1.7" rx="0.1" 
                fill="#FFFFFF" stroke="#64748B" stroke-width="0.03" />
          <ellipse cx="0" cy="0.6" rx="0.1" ry="0.15" fill="#94A3B8" />
        </g>
      `;
      break;
  }
  
  return `
    <g class="fixture" style="transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
      ${fixturePath}
    </g>
  `;
}

/**
 * Generate SVG for furniture
 * @param furniture Furniture configuration
 * @returns SVG group element as string
 */
export function generateFurnitureSVG(furniture: Furniture): string {
  const { x, y, width, height, type, rotation, label } = furniture;
  let furniturePath = '';
  
  switch (type) {
    case 'bed':
      furniturePath = `
        <g transform="translate(${x + width/2},${y + height/2}) rotate(${rotation})">
          <!-- Mattress -->
          <rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" 
                fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.03" rx="0.05" />
          <!-- Pillows -->
          <rect x="${-width/2 + 0.1}" y="${-height/2 + 0.1}" width="${width * 0.35}" height="${height * 0.2}" 
                fill="#E2E8F0" stroke="#94A3B8" stroke-width="0.02" rx="0.03" />
          <rect x="${width/2 - width * 0.35 - 0.1}" y="${-height/2 + 0.1}" width="${width * 0.35}" height="${height * 0.2}" 
                fill="#E2E8F0" stroke="#94A3B8" stroke-width="0.02" rx="0.03" />
        </g>
      `;
      break;
    case 'sofa':
      furniturePath = `
        <g transform="translate(${x + width/2},${y + height/2}) rotate(${rotation})">
          <!-- Sofa back -->
          <rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height * 0.2}" 
                fill="#CBD5E1" stroke="#94A3B8" stroke-width="0.03" />
          <!-- Sofa seat -->
          <rect x="${-width/2}" y="${-height/2 + height * 0.2}" width="${width}" height="${height * 0.8}" 
                fill="#E2E8F0" stroke="#94A3B8" stroke-width="0.03" />
        </g>
      `;
      break;
    case 'dining-table':
      furniturePath = `
        <g transform="translate(${x + width/2},${y + height/2}) rotate(${rotation})">
          <rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" 
                fill="#F8FAFC" stroke="#94A3B8" stroke-width="0.03" rx="0.08" />
        </g>
      `;
      break;
    case 'desk':
      furniturePath = `
        <g transform="translate(${x + width/2},${y + height/2}) rotate(${rotation})">
          <rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" 
                fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.03" />
        </g>
      `;
      break;
    case 'chair':
      furniturePath = `
        <g transform="translate(${x + width/2},${y + height/2}) rotate(${rotation})">
          <rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height * 0.2}" 
                fill="#CBD5E1" stroke="#94A3B8" stroke-width="0.02" />
          <rect x="${-width/2}" y="${-height/2 + height * 0.2}" width="${width}" height="${height * 0.8}" 
                fill="#E2E8F0" stroke="#94A3B8" stroke-width="0.02" />
        </g>
      `;
      break;
  }
  
  return `
    <g class="furniture" style="transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
      ${furniturePath}
      ${label ? `
        <text x="${x + width/2}" y="${y + height/2}" 
              text-anchor="middle" font-size="0.15" fill="#64748B" dominant-baseline="middle">
          ${label}
        </text>
      ` : ''}
    </g>
  `;
}

/**
 * Generate SVG for north arrow/direction indicator
 * @param x X position
 * @param y Y position
 * @param size Arrow size
 * @returns SVG group element as string
 */
export function generateNorthArrowSVG(x: number, y: number, size: number = 0.8): string {
  return `
    <g class="north-arrow" transform="translate(${x},${y})">
      <!-- Circle background -->
      <circle cx="0" cy="0" r="${size/2}" fill="#FFFFFF" stroke="#334155" stroke-width="0.04" />
      <!-- North arrow -->
      <path d="M 0,${-size/2.5} L ${-size/6},${size/6} L 0,${-size/8} L ${size/6},${size/6} Z" 
            fill="#EF4444" stroke="#991B1B" stroke-width="0.02" />
      <!-- South triangle -->
      <path d="M 0,${size/2.5} L ${-size/6},${-size/6} L 0,${size/8} L ${size/6},${-size/6} Z" 
            fill="#F1F5F9" stroke="#334155" stroke-width="0.02" />
      <!-- N label -->
      <text x="0" y="${-size/1.5}" text-anchor="middle" font-size="0.3" 
            font-weight="bold" fill="#1E293B" dominant-baseline="middle">
        N
      </text>
    </g>
  `;
}

/**
 * Generate SVG for dimension line with arrows and text
 * @param x1 Start X
 * @param y1 Start Y
 * @param x2 End X
 * @param y2 End Y
 * @param label Dimension label
 * @param offset Offset from the measured line
 * @returns SVG group element as string
 */
export function generateDimensionLineSVG(
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  label: string,
  offset: number = 0.3
): string {
  const isHorizontal = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  if (isHorizontal) {
    const dimY = y1 - offset;
    return `
      <g class="dimension-line">
        <!-- Extension lines -->
        <line x1="${x1}" y1="${y1}" x2="${x1}" y2="${dimY - 0.1}" 
              stroke="#64748B" stroke-width="0.01" stroke-dasharray="0.05 0.05" />
        <line x1="${x2}" y1="${y2}" x2="${x2}" y2="${dimY - 0.1}" 
              stroke="#64748B" stroke-width="0.01" stroke-dasharray="0.05 0.05" />
        <!-- Dimension line -->
        <line x1="${x1}" y1="${dimY}" x2="${x2}" y2="${dimY}" 
              stroke="#64748B" stroke-width="0.02" />
        <!-- Arrows -->
        <path d="M ${x1},${dimY} l 0.1,-0.05 l 0,0.1 Z" fill="#64748B" />
        <path d="M ${x2},${dimY} l -0.1,-0.05 l 0,0.1 Z" fill="#64748B" />
        <!-- Label -->
        <text x="${midX}" y="${dimY - 0.15}" text-anchor="middle" 
              font-size="0.18" fill="#1E293B" font-weight="500">
          ${label}
        </text>
      </g>
    `;
  } else {
    const dimX = x1 - offset;
    return `
      <g class="dimension-line">
        <!-- Extension lines -->
        <line x1="${x1}" y1="${y1}" x2="${dimX - 0.1}" y2="${y1}" 
              stroke="#64748B" stroke-width="0.01" stroke-dasharray="0.05 0.05" />
        <line x1="${x2}" y1="${y2}" x2="${dimX - 0.1}" y2="${y2}" 
              stroke="#64748B" stroke-width="0.01" stroke-dasharray="0.05 0.05" />
        <!-- Dimension line -->
        <line x1="${dimX}" y1="${y1}" x2="${dimX}" y2="${y2}" 
              stroke="#64748B" stroke-width="0.02" />
        <!-- Arrows -->
        <path d="M ${dimX},${y1} l -0.05,0.1 l 0.1,0 Z" fill="#64748B" />
        <path d="M ${dimX},${y2} l -0.05,-0.1 l 0.1,0 Z" fill="#64748B" />
        <!-- Label -->
        <text x="${dimX - 0.25}" y="${midY}" text-anchor="middle" 
              font-size="0.18" fill="#1E293B" font-weight="500" 
              transform="rotate(-90 ${dimX - 0.25} ${midY})">
          ${label}
        </text>
      </g>
    `;
  }
}
