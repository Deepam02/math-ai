# Cross Numbers Puzzle Schema Guide

This document explains how to create puzzles for the Cross Numbers game.

---

## Basic Structure

Every puzzle is a JavaScript/TypeScript object with these main parts:

```typescript
{
  id: "unique-puzzle-id",
  title: "Puzzle Title Shown to Player",
  instruction: "Instructions explaining what the player needs to do",
  mode: "construction",  // or "evaluation"
  
  layout: { /* grid structure */ },
  digits: [ /* available digits */ ],
  slots: [ /* number slots */ ],
  constraints: [ /* rules to satisfy */ ]
}
```

---

## 1. Basic Information

### `id` (string, required)
Unique identifier for the puzzle.
```typescript
id: "q1-basic-construction"
```

### `title` (string, required)
Title shown to the player.
```typescript
title: "Q1: Make Any Two Numbers"
```

### `instruction` (string, required)
Instructions explaining the goal.
```typescript
instruction: "Make any 2 numbers in this cross-number using the digits given below."
```

### `mode` (string, optional)
Game mode - defaults to `"construction"` if not specified.
- **`"construction"`** - Player places all digits
- **`"evaluation"`** - Digits are prefilled, player checks if constraints are satisfied

```typescript
mode: "construction"  // or "evaluation"
```

---

## 2. Layout - Grid Structure

Defines the grid dimensions and which cells are active.

```typescript
layout: {
  rows: 5,        // Number of rows
  cols: 3,        // Number of columns
  cells: {
    "0,1": {},    // Active cell at row 0, column 1
    "1,1": {},    // Active cell at row 1, column 1
    "2,0": {},    // Active cell at row 2, column 0
    "2,1": {},
    "2,2": {}
  }
}
```

### Cell ID Format
- Format: `"row,col"` (both zero-indexed)
- Example: `"0,1"` = row 0, column 1
- Example: `"2,0"` = row 2, column 0

### Cell Properties (optional)
You can add a color to cells:
```typescript
cells: {
  "0,1": { color: "blue" },
  "1,1": { color: "blue" },
  "2,0": { color: "red" }
}
```

Available colors: `"red"`, `"blue"`, `"green"`, `"yellow"`, `"purple"`, `"orange"`

---

## 3. Digits - Available Numbers

Array of digits the player can use (in construction mode).

```typescript
digits: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Notes:**
- Can include duplicate digits: `[1, 4, 5, 4, 5, 7, 8]`
- In evaluation mode, this can be empty: `[]`

---

## 4. Slots - Number Definitions

Slots define the numbers formed by sequences of cells.

```typescript
slots: [
  {
    id: "number1",
    label: "Number 1",
    cells: ["0,1", "1,1", "2,1", "3,1"]
  },
  {
    id: "number2",
    label: "Number 2",
    cells: ["2,0", "2,1", "2,2"]
  }
]
```

### Slot Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the slot |
| `label` | string | ✅ | Display label (e.g., "Number 1", "A", "B") |
| `cells` | string[] | ✅ | Ordered array of cell IDs forming the number |
| `prefilled` | number[] | ❌ | Pre-filled digits (evaluation mode only) |

### Example with Prefilled Digits (Evaluation Mode)
```typescript
{
  id: "number1",
  label: "A",
  cells: ["0,1", "1,1", "2,1"],
  prefilled: [5, 2, 7]  // The number 527 is already placed
}
```

---

## 5. Constraints - Rules to Satisfy

Constraints are the mathematical rules the puzzle must satisfy.

### Basic Constraint Structure
```typescript
{
  id: "c1",
  type: "greatestNumber",
  description: "Number 1 should be the greatest number possible",
  slot: "number1"
}
```

---

## Constraint Types

### 1. Greatest Number
The slot should form the greatest possible number from available digits.

```typescript
{
  id: "c1",
  type: "greatestNumber",
  description: "Number 1 should be the greatest number possible",
  slot: "number1"
}
```

### 2. Smallest Number
The slot should form the smallest possible number from available digits.

```typescript
{
  id: "c2",
  type: "smallestNumber",
  description: "Number 2 should be the smallest number possible",
  slot: "number2"
}
```

### 3. No Repeat Within Slot
No digit should repeat within a single number.

```typescript
{
  id: "c3",
  type: "noRepeatWithinSlot",
  description: "No repeating digits in Number 1",
  slot: "number1"
}
```

### 4. No Repeat Across Slots
No digit should repeat across all numbers (all slots must use different digits).

```typescript
{
  id: "c4",
  type: "noRepeatAcrossSlots",
  description: "All digits must be different across both numbers"
  // No slot property needed - applies to all slots
}
```

### 5. Same Digit
Digits at specific positions in different slots should be the same.

```typescript
{
  id: "c5",
  type: "sameDigit",
  description: "The overlapping digits should be the same"
  // Automatically detects overlapping cells
}
```

### 6. Place Value Sum Equals
The sum of digits at a specific place value should equal a target.

```typescript
{
  id: "c6",
  type: "placeValueSumEquals",
  description: "The ones place should be 5",
  slot: "number1",
  targetSum: 5
}
```

### 7. Slot Difference Equals Slot
The difference between two slots should equal another slot.

```typescript
{
  id: "c7",
  type: "slotDifferenceEqualsSlot",
  description: "Number 1 - Number 2 = Number 3",
  slotA: "number1",      // Minuend
  slotB: "number2",      // Subtrahend
  resultSlot: "number3"  // Difference
}
```

### 8. Cell Digit Restriction
A specific cell can only contain certain digits.

```typescript
{
  id: "c8",
  type: "cellDigitRestriction",
  description: "The center cell can only be 2, 4, or 6",
  cellId: "2,2",
  allowedDigits: [2, 4, 6]
}
```

### 9. Place Value Difference
The difference between digits at specific place values in two slots.

```typescript
{
  id: "c9",
  type: "placeValueDifference",
  description: "Hundreds place of A minus tens place of B equals 3",
  slotA: "number1",
  slotB: "number2",
  placeValueA: 2,           // Index 2 = hundreds place
  placeValueB: 1,           // Index 1 = tens place
  expectedDifference: 3
}
```

---

## Complete Example Puzzle

```typescript
{
  id: "example-puzzle",
  title: "Example: Greatest and Smallest",
  instruction: "Create two numbers: one greatest, one smallest.",
  mode: "construction",
  
  layout: {
    rows: 5,
    cols: 3,
    cells: {
      "0,1": {},
      "1,1": {},
      "2,1": {},
      "2,0": {},
      "2,2": {},
      "3,1": {},
      "4,1": {}
    }
  },
  
  digits: [9, 8, 7, 1, 2, 3],
  
  slots: [
    {
      id: "vertical",
      label: "Number 1",
      cells: ["0,1", "1,1", "2,1", "3,1", "4,1"]
    },
    {
      id: "horizontal",
      label: "Number 2",
      cells: ["2,0", "2,1", "2,2"]
    }
  ],
  
  constraints: [
    {
      id: "c1",
      type: "greatestNumber",
      description: "Number 1 should be the greatest",
      slot: "vertical"
    },
    {
      id: "c2",
      type: "smallestNumber",
      description: "Number 2 should be the smallest",
      slot: "horizontal"
    },
    {
      id: "c3",
      type: "sameDigit",
      description: "The overlapping digit should match"
    }
  ]
}
```

**Solution:** 
- Number 1 (vertical): 98712 (greatest possible)
- Number 2 (horizontal): 127 (smallest possible using the overlapping 1)

---

## Tips for Creating Puzzles

1. **Start Simple**: Begin with basic constraints, then add complexity
2. **Test Manually**: Verify your puzzle has a valid solution
3. **Clear Instructions**: Make sure players understand what they need to do
4. **Constraint Order**: List constraints in logical order (general to specific)
5. **Cell Overlap**: When slots share cells, ensure constraints are compatible
6. **Evaluation Mode**: Use for checking understanding, not for digit placement

---

## Quick Reference

### Constraint Properties Quick Guide

| Constraint Type | Required Properties |
|----------------|-------------------|
| `greatestNumber` | `slot` |
| `smallestNumber` | `slot` |
| `noRepeatWithinSlot` | `slot` |
| `noRepeatAcrossSlots` | (none) |
| `sameDigit` | (none - auto-detects) |
| `placeValueSumEquals` | `slot`, `targetSum` |
| `slotDifferenceEqualsSlot` | `slotA`, `slotB`, `resultSlot` |
| `cellDigitRestriction` | `cellId`, `allowedDigits` |
| `placeValueDifference` | `slotA`, `slotB`, `placeValueA`, `placeValueB`, `expectedDifference` |
