# Contributing to ArchitectPro

Thank you for your interest in contributing to ArchitectPro! This document provides guidelines and technical information for developers.

---

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- PostgreSQL 14+ (or Supabase account)
- Git
- Basic understanding of Next.js, React, and TypeScript

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/git-bonda108/architex-floorplan-designer.git
cd architex-floorplan-designer/nextjs_space

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
yarn prisma generate

# Run database migrations
yarn prisma db push

# Seed the database
yarn prisma db seed

# Start development server
yarn dev
```

The app will be available at `http://localhost:3000`

---

## Project Structure

```
nextjs_space/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes
│   │   └── templates/          # Template CRUD endpoints
│   ├── designer/               # Designer page
│   │   └── _components/       # Designer components
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                  # Shared UI components
│   └── ui/                     # shadcn/ui components
├── lib/                         # Utility libraries
│   ├── types.ts                # TypeScript interfaces
│   ├── shape-layout-utils.ts   # Shape generation algorithms
│   ├── floor-plan-utils.ts     # Floor plan utilities
│   ├── architectural-symbols.ts # SVG symbol generators
│   ├── db.ts                   # Prisma client
│   └── utils.ts                # Helper functions
├── prisma/                      # Database schema
│   └── schema.prisma           # Prisma schema
├── scripts/                     # Database scripts
│   ├── seed.ts                 # Legacy seed script
│   └── seed_new.ts             # Current seed script
└── public/                      # Static assets
```

---

## Code Style Guide

### TypeScript

- Use explicit types for function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use enums for fixed sets of values

```typescript
// Good
export interface Room {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Avoid
type Room = {
  id: string;
  // ...
};
```

### React Components

- Use functional components with hooks
- Extract complex logic into custom hooks
- Memoize expensive calculations with `useMemo`

```typescript
// Good
export function FloorPlanCanvas({ rooms, specifications }: Props) {
  const bounds = useMemo(
    () => calculateBounds(rooms),
    [rooms]
  );
  
  return (
    <svg viewBox={`0 0 ${bounds.width} ${bounds.height}`}>
      {/* ... */}
    </svg>
  );
}
```

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `types.ts` or `[feature]-types.ts`
- Tests: `*.test.ts` or `*.test.tsx`

---

## Adding New Features

### Adding a New Shape Type

1. **Update Types** (`lib/types.ts`):

```typescript
export type FloorPlanShape = 
  | 'Regular' 
  | 'L-Shaped' 
  | 'H-Shaped' 
  | 'M-Shaped'
  | 'U-Shaped'; // New shape
```

2. **Implement Section Generator** (`lib/shape-layout-utils.ts`):

```typescript
function generateUShapedSections(
  totalWidth: number,
  totalHeight: number
): Section[] {
  // Define your section layout
  return [
    // Left wing
    {
      id: 'left-wing',
      x: 0,
      y: 0,
      width: totalWidth * 0.25,
      height: totalHeight,
      name: 'Left Wing',
    },
    // Center section
    {
      id: 'center',
      x: totalWidth * 0.25,
      y: totalHeight * 0.4,
      width: totalWidth * 0.5,
      height: totalHeight * 0.6,
      name: 'Center',
    },
    // Right wing
    {
      id: 'right-wing',
      x: totalWidth * 0.75,
      y: 0,
      width: totalWidth * 0.25,
      height: totalHeight,
      name: 'Right Wing',
    },
  ];
}
```

3. **Implement Room Placement**:

```typescript
function placeRoomsUShaped(sections: Section[], startId: number): Room[] {
  const rooms: Room[] = [];
  const padding = 0.5;
  
  // Place rooms in each section
  // Follow the anti-overlap pattern:
  // 1. Calculate available space
  // 2. Allocate percentage-based widths
  // 3. Use Math.min() for dimension clamping
  // 4. Sequential positioning with padding
  
  return rooms;
}
```

4. **Update Switch Statements**:

```typescript
export function generateSections(
  shape: FloorPlanShape,
  totalWidth: number,
  totalHeight: number
): Section[] {
  switch (shape) {
    case 'U-Shaped':
      return generateUShapedSections(totalWidth, totalHeight);
    // ... other cases
  }
}

export function placeRoomsInShape(
  shape: FloorPlanShape,
  sections: Section[],
  totalWidth: number,
  totalHeight: number
): Room[] {
  switch (shape) {
    case 'U-Shaped':
      return placeRoomsUShaped(sections, 1);
    // ... other cases
  }
}
```

5. **Update UI** (`app/designer/_components/controls-panel.tsx`):

```typescript
const shapeOptions: FloorPlanShape[] = [
  'Regular',
  'L-Shaped',
  'H-Shaped',
  'M-Shaped',
  'U-Shaped', // Add to UI
];
```

### Adding New Room Types

1. **Update Types**:

```typescript
export type RoomType = 
  | 'living'
  | 'bedroom'
  | 'kitchen'
  | 'laundry'; // New type
```

2. **Define Requirements**:

```typescript
export const REQUIRED_ROOMS: Record<string, RoomRequirements> = {
  // ... existing rooms
  laundry: {
    name: 'Laundry',
    type: 'laundry',
    minWidth: 2.0,
    minHeight: 2.5,
    preferredAspectRatio: 1.25,
  },
};
```

3. **Add Color Mapping**:

```typescript
export function getRoomTypeColor(type: RoomType): string {
  const colors: Record<RoomType, string> = {
    // ... existing colors
    laundry: '#A7F3D0',
  };
  return colors[type] || '#E5E7EB';
}
```

---

## Testing Guidelines

### Unit Tests

Create tests for utility functions:

```typescript
// lib/__tests__/shape-layout-utils.test.ts
import { generateSections, placeRoomsInShape } from '../shape-layout-utils';

describe('Shape Layout Utils', () => {
  describe('generateSections', () => {
    it('creates correct L-shaped sections', () => {
      const sections = generateSections('L-Shaped', 15, 12);
      
      expect(sections).toHaveLength(2);
      expect(sections[0]).toMatchObject({
        id: 'horizontal',
        width: 15,
        height: 7.2,
      });
      expect(sections[1]).toMatchObject({
        id: 'vertical',
        width: 9,
        height: 4.8,
      });
    });
  });
  
  describe('placeRoomsInShape', () => {
    it('places rooms without overlapping', () => {
      const sections = generateSections('L-Shaped', 15, 12);
      const rooms = placeRoomsInShape('L-Shaped', sections, 15, 12);
      
      // Check no overlaps
      for (let i = 0; i < rooms.length; i++) {
        for (let j = i + 1; j < rooms.length; j++) {
          const room1 = rooms[i];
          const room2 = rooms[j];
          
          const noOverlap = 
            room1.x + room1.width < room2.x ||
            room2.x + room2.width < room1.x ||
            room1.y + room1.height < room2.y ||
            room2.y + room2.height < room1.y;
          
          expect(noOverlap).toBe(true);
        }
      }
    });
  });
});
```

### Integration Tests

Test API endpoints:

```typescript
// app/api/__tests__/templates.test.ts
import { GET } from '../templates/route';

describe('Templates API', () => {
  it('returns filtered templates', async () => {
    const request = new Request('http://localhost:3000/api/templates?bhkType=2BHK');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.templates).toBeInstanceOf(Array);
    expect(data.templates[0].bhkType).toBe('2BHK');
  });
});
```

### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage

# Run specific test file
yarn test shape-layout-utils.test.ts

# Watch mode
yarn test --watch
```

---

## Git Workflow

### Branch Naming

- Feature: `feature/shape-outlines`
- Bug fix: `fix/room-overlap`
- Documentation: `docs/implementation-guide`
- Refactor: `refactor/shape-generation`

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(shapes): add U-shaped floor plan support

Implemented section generation and room placement algorithms
for U-shaped layouts. Added visual rendering with shape outline.

Closes #123
```

```bash
fix(layout): prevent room overlapping in L-shaped plans

Increased padding from 0.3m to 0.5m and added strict boundary
clamping to ensure zero overlaps.

Fixes #45
```

### Pull Request Process

1. Create a feature branch from `master`
2. Make your changes with clear commit messages
3. Write or update tests
4. Update documentation if needed
5. Run tests and linting: `yarn test && yarn lint`
6. Push to your branch
7. Create a pull request with:
   - Clear title and description
   - Screenshots/videos for UI changes
   - Link to related issues
8. Address review feedback
9. Squash commits if requested
10. Maintainer will merge after approval

---

## Performance Optimization

### React Rendering

- Use `React.memo()` for expensive components
- Memoize callbacks with `useCallback`
- Memoize computed values with `useMemo`

```typescript
export const FloorPlanCanvas = React.memo(({ rooms, specifications }: Props) => {
  const bounds = useMemo(() => calculateBounds(rooms), [rooms]);
  const handleClick = useCallback(() => { /* ... */ }, []);
  
  return <svg>{/* ... */}</svg>;
});
```

### Database Queries

- Use Prisma's query optimization
- Index frequently queried fields
- Limit result sets

```typescript
// Good: Indexed query with limit
const templates = await prisma.template.findMany({
  where: { bhkType, propertyType },
  take: 10,
  select: { id: true, name: true, roomsData: true },
});
```

### SVG Rendering

- Minimize DOM nodes
- Use CSS transitions over JavaScript animations
- Cache generated SVG paths

---

## Debugging Tips

### Common Issues

**Issue: Rooms overlapping**
```typescript
// Debug by logging room coordinates
rooms.forEach(room => {
  console.log(`${room.name}: x=${room.x}, y=${room.y}, w=${room.width}, h=${room.height}`);
});
```

**Issue: Shape outline not visible**
```typescript
// Check section generation
console.log('Sections:', JSON.stringify(sections, null, 2));
```

**Issue: Database connection errors**
```bash
# Test connection
yarn prisma db pull

# Reset database
yarn prisma migrate reset
```

### Browser DevTools

1. **React DevTools**: Inspect component props and state
2. **Network Tab**: Monitor API requests
3. **Console**: Check for errors and warnings
4. **Performance Tab**: Profile rendering performance

---

## Documentation Standards

### Code Comments

```typescript
/**
 * Generates sections for a given floor plan shape.
 * 
 * @param shape - The type of floor plan shape
 * @param totalWidth - Total width in meters
 * @param totalHeight - Total height in meters
 * @returns Array of sections with positions and dimensions
 * 
 * @example
 * const sections = generateSections('L-Shaped', 15, 12);
 * // Returns: [
 * //   { id: 'horizontal', x: 0, y: 0, width: 15, height: 7.2 },
 * //   { id: 'vertical', x: 0, y: 7.2, width: 9, height: 4.8 }
 * // ]
 */
export function generateSections(
  shape: FloorPlanShape,
  totalWidth: number,
  totalHeight: number
): Section[] {
  // Implementation
}
```

### README Updates

When adding features, update:
- **README.md**: User-facing feature description
- **BACKEND_ARCHITECTURE.md**: Technical architecture changes
- **SHAPE_IMPLEMENTATION.md**: Algorithm documentation

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Architectural Standards](https://www.neufert.com/)

---

## Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: team@architectpro.dev

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
