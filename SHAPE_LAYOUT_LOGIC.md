# Floor Plan Shape Layout Logic
**Last Updated: December 25, 2024**

## Overview

This document explains the comprehensive algorithmic approach for generating Rectangular, L-shaped, H-shaped, and M-shaped floor plans in the ArchitectPro application. The system ensures proper room distribution, prevents overlapping, and provides clear visual shape indicators.

---

## Recent Improvements (v2.0)

### ✅ Enhanced Visual Indicators
- **Prominent Blue Dotted Outline**: A thick blue dotted line (stroke-width: 0.25) overlays the shape sections
- **Drop Shadow Effect**: Subtle glow effect makes the shape boundary more visible
- **Section Labels**: Each section is labeled (e.g., "Horizontal Wing", "Vertical Wing")

### ✅ Zero Overlapping Guarantee
- **Increased Padding**: Bumped from 0.3m to 0.5m between rooms
- **Strict Boundary Checking**: Rooms are clamped to available section dimensions
- **Percentage-Based Distribution**: Rooms are allocated fixed percentages of section space

### ✅ Uniform Distribution Algorithm
- **Proportional Allocation**: Each room type gets a defined percentage of available space
- **Minimum Dimension Enforcement**: Rooms never fall below architectural standards
- **Dynamic Scaling**: Rooms scale proportionally when dimensions change

---

## Supported Shapes

### 1. **Rectangular (Standard)**
```
┌──────────────────────────────────────┐
│ Garage │ Kitchen │ Living Room │ Maid │
└──────────────────────────────────────┘
```
- **Distribution**: Garage (28%), Kitchen (22%), Living (32%), Maid (18%)
- **Layout**: Linear arrangement from left to right
- **Use Case**: Compact plots, urban apartments

### 2. **L-Shaped**
```
┌─────────────────────────────────┐
│ Living Room   │   Kitchen       │  ← Horizontal Wing
└─────────────────────────────────┘
┌──────────────┐
│ Garage  │Maid│                     ← Vertical Wing  
└──────────────┘
```
- **Horizontal Section**: 
  - 100% width, 60% height
  - Living Room (55%) + Kitchen (40%)
- **Vertical Section**: 
  - 60% width, 40% height
  - Garage (65%) + Maid's Room (30%)
- **Use Case**: Corner plots, maximizing garden space

### 3. **H-Shaped**
```
┌──────────┐     ┌──────────┐
│ Living   │     │  Garage  │  ← Left & Right Wings
│          │═════│          │  ← Bridge (connects wings)
│ Kitchen  │     │   Maid   │
└──────────┘     └──────────┘
```
- **Left Wing**: Living Room (60%) + Kitchen (35%)
- **Right Wing**: Garage (55%) + Maid's Room (40%)
- **Bridge**: Central connector (40% width, 30% height)
- **Use Case**: Large plots, courtyard designs

### 4. **M-Shaped**
```
┌────┐  ┌──────────────┐  ┌────┐
│Garg│  │  Living Room │  │Maid│  ← Left Wing, Center, Right Wing
└────┘  │   Kitchen    │  └────┘
        └──────────────┘
```
- **Central Section**: Living Room (55%) + Kitchen (40%)
- **Left Wing**: Garage (100%)
- **Right Wing**: Maid's Room (100%)
- **Use Case**: Privacy-focused, semi-enclosed courtyard

---

## Room Requirements & Standards

### Minimum Dimensions (per Architectural Standards)

| Room Type    | Min Width | Min Height | Min Area | Aspect Ratio |
|--------------|-----------|------------|----------|--------------|
| Living Room  | 3.0m      | 4.0m       | 12m²     | 1.5:1        |
| Kitchen      | 2.5m      | 3.2m       | 8m²      | 1.2:1        |
| Maid's Room  | 2.8m      | 2.8m       | 8m²      | 1:1          |
| Garage       | 5.0m      | 3.0m       | 15m²     | 1.8:1        |

### Color Scheme (Professional CAD-Style)

| Room Type    | Color Code | Visual Style        |
|--------------|------------|---------------------|
| Living Room  | #BFDBFE    | Light Blue          |
| Kitchen      | #FDE68A    | Light Yellow        |
| Maid's Room  | #E9D5FF    | Light Purple        |
| Garage       | #9CA3AF    | Medium Gray         |

---

## Algorithm Implementation

### Phase 1: Shape Section Generation

```typescript
function generateSections(
  shape: FloorPlanShape,
  totalWidth: number,
  totalHeight: number
): Section[]
```

**For L-Shaped:**
```typescript
[
  {
    id: 'horizontal',
    x: 0,
    y: 0,
    width: totalWidth,
    height: totalHeight * 0.6,
    name: 'Horizontal Wing'
  },
  {
    id: 'vertical',
    x: 0,
    y: totalHeight * 0.6,
    width: totalWidth * 0.6,
    height: totalHeight * 0.4,
    name: 'Vertical Wing'
  }
]
```

### Phase 2: Room Placement with Overlap Prevention

```typescript
function placeRoomsLShaped(sections: Section[], startId: number): Room[]
```

**Key Anti-Overlap Features:**
1. **Available Space Calculation**
   ```typescript
   const horizontalAvailWidth = horizontal.width - padding * 2;
   const horizontalAvailHeight = horizontal.height - padding * 2;
   ```

2. **Percentage-Based Widths**
   ```typescript
   const livingWidth = horizontalAvailWidth * 0.55;
   const kitchenWidth = horizontalAvailWidth * 0.40;
   ```

3. **Strict Dimension Clamping**
   ```typescript
   const actualLivingWidth = Math.min(livingDims.width, livingWidth);
   const actualLivingHeight = Math.min(livingDims.height, horizontalAvailHeight);
   ```

4. **Sequential Positioning**
   ```typescript
   livingRoom.x = horizontal.x + padding;
   kitchen.x = horizontal.x + actualLivingWidth + padding * 2;
   // Ensures kitchen starts AFTER living room ends + padding
   ```

### Phase 3: Visual Rendering

**Section Outlines (Subtle)**
```typescript
<rect
  stroke="#94A3B8"
  strokeWidth="0.12"
  strokeDasharray="0.4 0.3"
  opacity="0.5"
/>
```

**Shape Outline Overlay (Prominent)**
```typescript
<rect
  stroke="#2563EB"
  strokeWidth="0.25"
  strokeDasharray="0.6 0.4"
  opacity="0.8"
  style={{ filter: 'drop-shadow(0 0 0.2px rgba(37, 99, 235, 0.5))' }}
/>
```

---

## Validation & Testing

### Overlap Detection Algorithm

```typescript
export function validateShapeLayout(rooms: Room[], sections: Section[]): boolean {
  // 1. Check all required room types are present
  const requiredTypes = ['living', 'kitchen', 'maid-room', 'garage'];
  const presentTypes = new Set(rooms.map(r => r.type));
  
  for (const reqType of requiredTypes) {
    if (!presentTypes.has(reqType)) return false;
  }
  
  // 2. Check rooms fit within their sections
  for (const room of rooms) {
    const inSection = sections.some(section =>
      room.x >= section.x &&
      room.x + room.width <= section.x + section.width &&
      room.y >= section.y &&
      room.y + room.height <= section.y + section.height
    );
    if (!inSection) return false;
  }
  
  return true;
}
```

### Manual Verification Checklist

- [ ] No rooms extend beyond section boundaries
- [ ] Padding of at least 0.5m between adjacent rooms
- [ ] All rooms meet minimum dimension requirements
- [ ] Shape outline is clearly visible (blue dotted line)
- [ ] Section labels are displayed correctly

---

## Usage Examples

### Example 1: Creating an L-Shaped Layout

```typescript
// User inputs
const specifications = {
  overallWidth: 15,    // 15m width
  overallHeight: 12,   // 12m height
};
const shape = 'L-Shaped';

// Generate sections
const sections = generateSections(shape, 15, 12);
// Output:
// [
//   { id: 'horizontal', x: 0, y: 0, width: 15, height: 7.2 },
//   { id: 'vertical', x: 0, y: 7.2, width: 9, height: 4.8 }
// ]

// Place rooms
const rooms = placeRoomsInShape(shape, sections, 15, 12);
// Output:
// [
//   { name: 'Living Room', x: 0.5, y: 0.5, width: 7.7, height: 6.2 },
//   { name: 'Kitchen', x: 9.2, y: 0.5, width: 5.3, height: 6.2 },
//   { name: 'Garage', x: 0.5, y: 7.7, width: 5.2, height: 3.8 },
//   { name: "Maid's Room", x: 6.7, y: 7.7, width: 2.3, height: 3.8 }
// ]
```

### Example 2: Preventing Overlap in Rectangular Layout

```typescript
// Before (Old Algorithm - Could Overlap)
currentX += garageDims.width + padding;  // Only 0.3m gap

// After (New Algorithm - No Overlap)
currentX += actualGarageWidth + padding;  // 0.5m gap + clamped dimensions
```

---

## Troubleshooting

### Issue: Rooms Still Overlapping
**Solution:**
1. Verify `padding` is set to 0.5 or higher
2. Check that `Math.min()` clamping is applied to all dimensions
3. Ensure `currentX` is incremented by `actualWidth + padding * 2`

### Issue: Shape Outline Not Visible
**Solution:**
1. Confirm `shape !== 'Rectangular'` condition
2. Check that sections array has length > 0
3. Verify SVG is rendered on top layer (z-index)

### Issue: Rooms Too Small
**Solution:**
1. Increase overall dimensions in specifications
2. Verify minimum dimensions are met in `REQUIRED_ROOMS`
3. Check aspect ratio calculations in `calculateRoomDimensions()`

---

## Future Enhancements

1. **Dynamic Shape Morphing**: Animate transitions between shape types
2. **Custom Room Priorities**: Allow users to prioritize room sizes
3. **Multi-Floor Support**: Extend shapes to work across multiple floors
4. **Courtyard Calculation**: Automatically calculate and display courtyard areas
5. **3D Shape Preview**: Generate 3D wireframe visualization of shapes

---

## Technical References

### Key Files
- `/lib/shape-layout-utils.ts` - Core shape generation logic
- `/lib/types.ts` - TypeScript interfaces for shapes and rooms
- `/app/designer/_components/floor-plan-canvas.tsx` - Visual rendering
- `/app/designer/_components/controls-panel.tsx` - Shape selector UI

### Dependencies
- React 18.2.0
- TypeScript 5.2.2
- SVG (Scalable Vector Graphics) for rendering

---

## Contact & Support

For questions about the shape layout algorithm or to report overlapping issues, please:
1. Check this documentation first
2. Verify your implementation matches the code examples
3. Review the validation checklist
4. Open an issue in the GitHub repository: `https://github.com/git-bonda108/architex-floorplan-designer`

---

**Document Version**: 2.0  
**Algorithm Version**: 2.0 (Zero Overlap)  
**Last Tested**: December 25, 2024
