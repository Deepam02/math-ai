/**
 * Puzzle data for Cross Numbers game.
 * Based on the provided screenshots from MathAI application.
 */

import type { Puzzle } from './types';

/**
 * Q1: Basic Construction - Make any 2 numbers
 */
export const q1: Puzzle = {
  id: 'q1-basic-construction',
  title: 'Q1: Make Any Two Numbers',
  instruction: 'Make any 2 numbers in this cross-number using the digits given below.',
  
  layout: {
    rows: 5,
    cols: 3,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,1': {},
      '3,1': {},
      '2,0': {},
      '2,2': {}
    }
  },
  
  digits: [8, 7, 1, 3, 6, 9],
  
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
  
  constraints: []
};

/**
 * Q2: No Repeating Digits
 */
export const q2: Puzzle = {
  id: 'q2-no-repeat',
  title: 'Q2: No Repeating Digits',
  instruction: 'Make any 2 numbers in the cross-number using the digits given below and satisfy the given condition.',
  
  layout: {
    rows: 5,
    cols: 3,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,1': {},
      '3,1': {},
      '4,1': {},
      '2,0': {},
      '2,2': {}
    }
  },
  
  digits: [1, 4, 5, 4, 5, 7, 8],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,1', '1,1', '2,1', '3,1', '4,1']
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
      type: 'noRepeatAcrossSlots',
      description: 'Do not repeat any digits in both the numbers'
    }
  ]
};

/**
 * Q3: Condition Evaluation - Which conditions are satisfied
 */
export const q3: Puzzle = {
  id: 'q3-condition-evaluation',
  title: 'Q3: Which Conditions Are Satisfied',
  instruction: 'Radha completed a cross-number like this. Select all the conditions she satisfied.',
  
  layout: {
    rows: 5,
    cols: 5,
    cells: {
      '0,2': {},
      '1,2': {},
      '2,2': {},
      '3,2': {},
      '4,2': {},
      '4,1': {},
      '4,3': {},
      '0,4': {},
      '1,4': {},
      '2,4': {}
    }
  },
  
  digits: [],
  mode: 'evaluation',
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,2', '1,2', '2,2', '3,2', '4,2'],
      prefilled: [9, 8, 7, 6, 5]
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['0,4', '1,4', '2,4'],
      prefilled: [1, 0, 0]
    },
    {
      id: 'number3',
      label: 'Number 3',
      cells: ['4,1', '4,2', '4,3'],
      prefilled: [5, 5, 0]
    }
  ],
  
  constraints: [
    {
      id: 'c1',
      type: 'greatestNumber',
      slot: 'number1',
      description: 'Make the greatest 5-digit number without repeating digits'
    },
    {
      id: 'c2',
      type: 'greatestNumber',
      slot: 'number3',
      description: 'Make the greatest 3-digit number without repeating digits'
    },
    {
      id: 'c3',
      type: 'smallestNumber',
      slot: 'number2',
      description: 'Make the smallest 3-digit number'
    }
  ]
};

/**
 * Q4: Greatest and Smallest Numbers
 */
export const q4: Puzzle = {
  id: 'q4-greatest-smallest',
  title: 'Q4: Greatest and Smallest Numbers',
  instruction: 'Make 2 numbers in this cross-number from the digits given below satisfying the given conditions.',
  
  layout: {
    rows: 4,
    cols: 3,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,1': {},
      '3,1': {},
      '2,0': {},
      '2,2': {}
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
      noRepeat: true,
      description: 'Make the smallest 3-digit number without repeating the digits'
    }
  ]
};

/**
 * Q5: Dependent Numbers
 */
export const q5: Puzzle = {
  id: 'q5-dependent-numbers',
  title: 'Q5: Dependent Numbers',
  instruction: 'Make 3 numbers in the cross-number from the digits given below satisfying the given conditions.',
  
  layout: {
    rows: 6,
    cols: 4,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,1': {},
      '3,1': {},
      '4,1': {},
      '2,3': {},
      '3,3': {},
      '4,0': {},
      '4,2': {},
      '4,3': {}
    }
  },
  
  digits: [0, 1, 6, 7, 7, 8, 9, 9],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,1', '1,1', '2,1', '3,1']
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['2,3', '3,3']
    },
    {
      id: 'number3',
      label: 'Number 3',
      cells: ['4,0', '4,1', '4,2', '4,3']
    }
  ],
  
  constraints: [
    {
      id: 'c1',
      type: 'greatestNumber',
      slot: 'number1',
      noRepeat: true,
      description: 'Make the greatest 4-digit number without repeating the digits'
    },
    {
      id: 'c2',
      type: 'sameDigit',
      slot: 'number2',
      description: 'Make a 2-digit number using the same digit in all places'
    },
    {
      id: 'c3',
      type: 'smallestUsingReference',
      slot: 'number3',
      referenceSlot: 'number2',
      description: 'Make the smallest 4-digit number using the greatest 2-digit number'
    }
  ]
};

/**
 * Q7: Sum and Place Value Logic
 */
export const q7: Puzzle = {
  id: 'q7-sum-and-place-value',
  title: 'Q7: Sum and Place Value Logic',
  instruction: 'Make 2 numbers without repeating the digits satisfying all the given conditions.',
  
  layout: {
    rows: 6,
    cols: 3,
    cells: {
      '0,1': {},
      '1,1': {},
      '2,1': {},
      '3,1': {},
      '4,1': {},
      '2,0': {},
      '2,2': {}
    }
  },
  
  digits: [1, 2, 3, 3, 4, 5, 5],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,1', '1,1', '2,1', '3,1', '4,1']
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
      type: 'smallestNumber',
      slot: 'number1',
      sumOfDigits: 15,
      description: 'Make the smallest 5-digit number where the sum of all digits is 15'
    },
    {
      id: 'c2',
      type: 'placeValueDifference',
      slotA: 'number1',
      slotB: 'number2',
      place: 'hundreds',
      difference: 1,
      description: 'Hundreds place of 5-digit number is 100 more than hundreds place of 3-digit number'
    }
  ],
  
  answer: {
    number1: [1, 2, 4, 3, 5],
    number2: [3, 4, 5]
  }
};

/**
 * Q8: Colored Cells - Cell Restrictions
 */
export const q8: Puzzle = {
  id: 'q8-colored-cells',
  title: 'Q8: Cell Restrictions',
  instruction: 'Arrange the digits satisfying all the given conditions.',
  
  layout: {
    rows: 6,
    cols: 4,
    cells: {
      '0,0': { color: 'green' },
      '1,0': { color: 'yellow' },
      '2,0': { color: 'green' },
      '3,0': { color: 'yellow' },
      '4,0': { color: 'green' },
      '1,1': { color: 'green' },
      '1,2': { color: 'yellow' },
      '1,3': { color: 'green' }
    }
  },
  
  digits: [9, 9, 9, 6, 6, 2, 1, 0],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,0', '1,0', '2,0', '3,0', '4,0']
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['1,0', '1,1', '1,2', '1,3']
    }
  ],
  
  constraints: [
    {
      id: 'c1',
      type: 'cellDigitRestriction',
      color: 'green',
      notAllowed: [9],
      description: 'Do not place 9 in any green cell'
    },
    {
      id: 'c2',
      type: 'cellDigitRestriction',
      color: 'yellow',
      allowedRange: [6, 9],
      description: 'Yellow cells should only have digits greater than 5'
    },
    {
      id: 'c3',
      type: 'greatestNumber',
      slot: 'number1',
      description: 'Make the greatest 5-digit number'
    },
    {
      id: 'c4',
      type: 'placeValueDifference',
      slot: 'number1',
      placeA: 'thousands',
      placeB: 'hundreds',
      difference: 3,
      description: 'Difference between thousands and hundreds place should be 3'
    }
  ],
  
  answer: {
    number1: [2, 9, 6, 9, 1],
    number2: [9, 6, 9, 0]
  }
};

/**
 * Q9: Number Relationships - Slot Arithmetic
 */
export const q9: Puzzle = {
  id: 'q9-slot-arithmetic',
  title: 'Q9: Number Relationships',
  instruction: 'Arrange the digits so that they satisfy all the given conditions.',
  
  layout: {
    rows: 5,
    cols: 5,
    cells: {
      '0,1': {},
      '0,2': {},
      '0,3': {},
      '0,4': {},
      '1,1': {},
      '2,1': {},
      '3,1': {},
      '1,3': {},
      '2,3': {},
      '3,3': {}
    }
  },
  
  digits: [0, 0, 1, 1, 1, 2, 2, 3, 4],
  
  slots: [
    {
      id: 'number1',
      label: 'Number 1',
      cells: ['0,1', '0,2', '0,3', '0,4']
    },
    {
      id: 'number2',
      label: 'Number 2',
      cells: ['0,3', '1,3', '2,3']
    },
    {
      id: 'number3',
      label: 'Number 3',
      cells: ['0,1', '1,1', '2,1', '3,1']
    }
  ],
  
  constraints: [
    {
      id: 'c1',
      type: 'placeValueSumEquals',
      slot: 'number1',
      places: ['tens', 'ones'],
      sum: 21,
      description: 'The sum of place values of tens and ones place in the 4-digit number should be 21'
    },
    {
      id: 'c2',
      type: 'slotDifferenceEqualsSlot',
      slotA: 'number1',
      slotB: 'number2',
      resultSlot: 'number3',
      description: 'Difference between number 1 and number 2 should equal number 3'
    }
  ]
};

/**
 * All available puzzles in order
 */
export const puzzles: Puzzle[] = [q8, q2, q3, q4, q5, q7, q8, q9];

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
