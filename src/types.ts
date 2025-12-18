/**
 * Core type definitions for the Cross Numbers puzzle game.
 * These types match the frozen puzzle data contract.
 */

/**
 * Cell coordinate in the format "row,col" (0-indexed)
 */
export type CellId = string;

/**
 * Layout configuration for the puzzle grid
 */
export interface PuzzleLayout {
  rows: number;
  cols: number;
  cells: Record<CellId, Record<string, never>>; // Empty object for each cell
}

/**
 * A slot represents a sequence of cells forming a number
 */
export interface Slot {
  id: string;
  label: string;
  cells: CellId[];
}

/**
 * Supported constraint types
 */
export type ConstraintType = 
  | 'greatestNumber'
  | 'smallestNumber'
  | 'noRepeatWithinSlot'
  | 'noRepeatAcrossSlots';

/**
 * Constraint definition for a slot
 */
export interface Constraint {
  id: string;
  type: ConstraintType;
  slot: string; // Slot ID
  description: string;
  noRepeat?: boolean; // Additional flag for no-repeat constraints
  relatedSlots?: string[]; // For cross-slot constraints
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
