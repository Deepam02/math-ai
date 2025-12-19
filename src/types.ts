/**
 * Core type definitions for the Cross Numbers puzzle game.
 * These types match the frozen puzzle data contract.
 */

/**
 * Cell coordinate in the format "row,col" (0-indexed)
 */
export type CellId = string;

/**
 * Cell properties including optional color
 */
export interface CellProperties {
  color?: 'green' | 'yellow' | 'red' | 'blue';
}

/**
 * Layout configuration for the puzzle grid
 */
export interface PuzzleLayout {
  rows: number;
  cols: number;
  cells: Record<CellId, CellProperties>;
}

/**
 * A slot represents a sequence of cells forming a number
 */
export interface Slot {
  id: string;
  label: string;
  cells: CellId[];
  prefilled?: number[]; // Optional prefilled values for evaluation mode
}

/**
 * Supported constraint types
 */
export type ConstraintType = 
  | 'greatestNumber'
  | 'smallestNumber'
  | 'noRepeatWithinSlot'
  | 'noRepeatAcrossSlots'
  | 'sameDigit'
  | 'smallestUsingReference'
  | 'placeValueSumEquals'
  | 'slotDifferenceEqualsSlot'
  | 'cellDigitRestriction'
  | 'placeValueDifference';

/**
 * Constraint definition for a slot
 */
export interface Constraint {
  id: string;
  type: ConstraintType;
  slot?: string; // Slot ID (optional for global constraints)
  description: string;
  noRepeat?: boolean; // Additional flag for no-repeat constraints
  relatedSlots?: string[]; // For cross-slot constraints
  referenceSlot?: string; // For constraints that reference another slot
  // Place value constraints
  places?: string[]; // Place values like 'tens', 'ones', 'hundreds', 'thousands'
  sum?: number; // Sum value for place value constraints
  sumOfDigits?: number; // Sum of all digits in a number
  // Slot arithmetic constraints
  slotA?: string; // First slot for arithmetic operations
  slotB?: string; // Second slot for arithmetic operations
  resultSlot?: string; // Result slot for arithmetic operations
  // Place value difference constraints
  place?: string; // Single place value
  placeA?: string; // First place value
  placeB?: string; // Second place value
  difference?: number; // Difference value
  // Cell digit restrictions
  color?: 'green' | 'yellow' | 'red' | 'blue'; // Cell color for restrictions
  notAllowed?: number[]; // Digits not allowed in colored cells
  allowedRange?: [number, number]; // Range of allowed digits [min, max]
}

/**
 * Complete puzzle definition
 */
export interface Puzzle {
  id: string;
  title: string;
  instruction: string;
  layout: PuzzleLayout;
  digits: number[];
  slots: Slot[];
  constraints: Constraint[];
  mode?: 'construction' | 'evaluation'; // Optional mode (default: construction)
  answer?: Record<string, number[]>; // Direct answer: slot ID -> digits array (bypasses individual checks)
}

/**
 * Game state for a puzzle in progress
 */
export interface GameState {
  puzzle: Puzzle;
  grid: Map<CellId, number | null>; // Current grid state
  availableDigits: number[]; // Remaining digits to place
  selectedDigit: number | null; // Currently selected digit
  selectedDigitIndex: number | null; // Index of selected digit in pool
  isSubmitted: boolean;
  validationResults: ValidationResult[];
}

/**
 * Result of constraint validation
 */
export interface ValidationResult {
  constraintId: string;
  description: string;
  satisfied: boolean;
  message?: string;
}

/**
 * Parse cell coordinate string to row and column
 */
export function parseCellId(cellId: CellId): { row: number; col: number } {
  const [row, col] = cellId.split(',').map(Number);
  return { row, col };
}

/**
 * Create cell coordinate string from row and column
 */
export function createCellId(row: number, col: number): CellId {
  return `${row},${col}`;
}
