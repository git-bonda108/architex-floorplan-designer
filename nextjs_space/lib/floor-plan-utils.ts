import { Room } from './types';

export function calculateTotalArea(rooms: Room[]): number {
  return rooms?.reduce?.((total, room) => total + (room?.width ?? 0) * (room?.height ?? 0), 0) ?? 0;
}

export function calculateBounds(rooms: Room[]): { width: number; height: number } {
  if (!rooms || rooms?.length === 0) {
    return { width: 0, height: 0 };
  }

  const maxX = Math.max(...rooms?.map?.(r => (r?.x ?? 0) + (r?.width ?? 0)) ?? [0]);
  const maxY = Math.max(...rooms?.map?.(r => (r?.y ?? 0) + (r?.height ?? 0)) ?? [0]);

  return { width: maxX, height: maxY };
}

export function formatArea(area: number, unit: 'meters' | 'feet' = 'meters'): string {
  const unitLabel = unit === 'meters' ? 'm²' : 'sq ft';
  return `${area?.toFixed?.(2) ?? '0.00'} ${unitLabel}`;
}

export function convertUnits(
  value: number,
  from: 'meters' | 'feet',
  to: 'meters' | 'feet'
): number {
  if (from === to) return value;
  if (from === 'meters' && to === 'feet') {
    return value * 3.28084;
  }
  return value / 3.28084;
}

export function getRoomTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    entrance: '#E8F4F8',
    living: '#D4E6F1',
    dining: '#D6EAF8',
    kitchen: '#FCF3CF',
    bedroom: '#E8DAEF',
    bathroom: '#D5F4E6',
    balcony: '#FADBD8',
    study: '#FAD7A0',
    default: '#F0F0F0'
  };

  return colorMap?.[type] ?? colorMap?.['default'] ?? '#F0F0F0';
}
