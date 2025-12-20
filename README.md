# Cross Numbers Puzzle Game

A math puzzle game where players place digits to form numbers that satisfy various mathematical constraints.

**Live Demo:** [https://math-ai-hmzy.vercel.app/](https://math-ai-hmzy.vercel.app/)

## Features

- **Progressive difficulty**: Multiple puzzles with increasing constraint complexity
- **Two game modes**: Construction (place digits) and Evaluation (check prefilled solutions)
- **Health & scoring system**: 3 hearts, lose health on wrong submissions, gain points on success
- **Visual feedback**: Color-coded cells, slot previews, and constraint validation
- **Responsive grid layout**: Dynamic puzzle configurations with custom dimensions
- **Festive landing page**: Animated snowfall effect on start screen

## How to Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will be available at `http://localhost:5173` (default Vite port).

## Puzzle Schema/Format

Each puzzle is a JSON-like object with the following structure:

```typescript
{
  id: string,                    // Unique puzzle identifier
  title: string,                 // Display title
  instruction: string,           // Player instructions
  mode: 'construction' | 'evaluation',  // Play mode (default: construction)
  
  layout: {
    rows: number,                // Grid dimensions
    cols: number,
    cells: Record<CellId, CellProperties>  // Active cells (format: "row,col")
  },
  
  digits: number[],              // Available digits to place
  
  slots: [{
    id: string,                  // Slot identifier
    label: string,               // Display name
    cells: CellId[],             // Ordered cell sequence
    prefilled?: number[]         // Pre-filled values (evaluation mode)
  }],
  
  constraints: [{
    id: string,
    type: ConstraintType,        // e.g., 'greatestNumber', 'noRepeatWithinSlot'
    description: string,
    slot?: string,               // Target slot (if applicable)
    // Additional constraint-specific fields
  }]
}
```

**Constraint Types:** `greatestNumber`, `smallestNumber`, `noRepeatWithinSlot`, `noRepeatAcrossSlots`, `sameDigit`, `placeValueSumEquals`, `slotDifferenceEqualsSlot`, `cellDigitRestriction`, `placeValueDifference`

## Technical Decisions

- **Vite + TypeScript**: Fast dev server, type safety without runtime overhead
- **Vanilla TS (no framework)**: Lightweight, full control over DOM and state management
- **Class-based architecture**: `Game`, `Grid`, `DigitPool`, `SlotPreview` for separation of concerns
- **Canvas rendering for snowfall**: Performance optimization for particle effects
- **Strict TypeScript config**: Enforces best practices (`strict`, `noUnusedLocals`, etc.)
- **Cell ID format**: String-based `"row,col"` for efficient Map lookups and JSON serialization

## Known Limitations

- No undo/redo functionality
- No save/resume - progress resets on page refresh
- Health system doesn't persist between sessions
- Limited mobile touch optimization
- No animation transitions between puzzles
- Constraint validation runs on every placement (not optimized for large grids)
- Snowfall effect only on landing page (removed due to performance on puzzle screens)
