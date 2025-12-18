/**
 * Puzzle data for Cross Numbers game.
 * Based on the provided screenshots from MathAI application.
 */

import type { Puzzle } from './types';

/**
 * Q1: Simple introductory puzzle
 * Make any 2 numbers using the digits given
 */
export const q1: Puzzle = {
  id: 'q1',
  title: 'Q1',
  instruction: "Let's start with something easy! Make any 2 numbers in the cross-number using the digits given below.",
  
  layout: {
    rows: 5,
    cols: 4,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,0': {},
      '2,1': {},
      '2,2': {},
      '2,3': {},
      '3,1': {},
    }
  },
  
  digits: [1, 3, 6, 9, 8, 7, 2],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,1', '1,1', '2,1', '3,1']
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['2,0', '2,1', '2,2', '2,3']
    }
  ],
  
  constraints: [
    // No constraints for Q1 - just place all digits
  ]
};

/**
 * Q3: Radha's completed puzzle
 * Shows greatest 5-digit, greatest 3-digit, and smallest 4-digit numbers
 */
export const q3: Puzzle = {
  id: 'q3',
  title: 'Q3',
  instruction: "Radha completed a cross-number like this. Select all the conditions she satisfied!",
  
  layout: {
    rows: 5,
    cols: 3,
    cells: {
      '0,0': {},
      '1,0': {},
      '2,0': {},
      '3,0': {},
      '4,0': {},
      '4,1': {},
      '4,2': {},
      '2,1': {},
      '2,2': {},
    }
  },
  
  digits: [9, 8, 7, 6, 5, 5, 1, 0, 0],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,0', '1,0', '2,0', '3,0', '4,0']
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['2,1', '2,2', '2,0']
    },
    {
      id: 'number3',
      label: 'Number 3',
      cells: ['4,0', '4,1', '4,2']
    }
  ],
  
  constraints: [
    {
      id: 'c1',
      type: 'greatestNumber',
      slot: 'number1',
      description: 'Make the greatest 5-digit number without repeating digits',
      noRepeat: true
    },
    {
      id: 'c2',
      type: 'greatestNumber',
      slot: 'number2',
      description: 'Make the greatest 3-digit number without repeating the digits',
      noRepeat: true
    },
    {
      id: 'c3',
      type: 'smallestNumber',
      slot: 'number3',
      description: 'Make the smallest 4-digit number'
    }
  ]
};

/**
 * Q4: Main puzzle from the first screenshot
 * Make greatest 4-digit and smallest 3-digit without repeating
 */
export const q4: Puzzle = {
  id: 'q4',
  title: 'Q4',
  instruction: 'Make 2 numbers in this cross-number from the digits given below satisfying the given conditions.',
  
  layout: {
    rows: 4,
    cols: 3,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,0': {},
      '2,1': {},
      '2,2': {},
      '3,1': {},
    }
  },
  
  digits: [6, 0, 8, 0, 1, 3],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,1', '1,1', '2,1', '3,1']
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['2,0', '2,1', '2,2']
    }
  ],
  
  constraints: [
    {
      id: 'c1',
      type: 'greatestNumber',
      slot: 'number1',
      description: 'Make the greatest 4-digit number'
    },
    {
      id: 'c2',
      type: 'smallestNumber',
      slot: 'number2',
      description: 'Make the smallest 3-digit number without repeating the digits',
      noRepeat: true
    }
  ]
};

/**
 * All available puzzles
 */
export const puzzles: Puzzle[] = [q1, q3, q4];

/**
 * Get a puzzle by ID
 */
export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find(p => p.id === id);
}

/**
 * Get default puzzle (Q4 - the main one from screenshots)
 */
export function getDefaultPuzzle(): Puzzle {
  return q4;
}
