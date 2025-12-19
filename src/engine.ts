/**
 * Constraint validation engine for Cross Numbers puzzle.
 * 
 * This module evaluates whether puzzle constraints are satisfied
 * based on the current grid state.
 */

import type { Constraint, GameState, ValidationResult } from './types';

/**
 * Validate all constraints for the current game state
 */
export function validateConstraints(state: GameState): ValidationResult[] {
  // If puzzle has a direct answer, check if current state matches it
  if (state.puzzle.answer) {
    const matchesAnswer = checkDirectAnswer(state);
    if (matchesAnswer) {
      // If answer matches, mark all constraints as satisfied
      return state.puzzle.constraints.map(constraint => ({
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: true,
        message: 'Correct answer!'
      }));
    }
  }
  
  // Otherwise, validate each constraint individually
  return state.puzzle.constraints.map(constraint => 
    validateConstraint(constraint, state)
  );
}

/**
 * Check if current grid state matches the direct answer
 */
function checkDirectAnswer(state: GameState): boolean {
  if (!state.puzzle.answer) return false;
  
  // Check each slot in the answer
  for (const [slotId, expectedDigits] of Object.entries(state.puzzle.answer)) {
    const slot = state.puzzle.slots.find(s => s.id === slotId);
    if (!slot) continue;
    
    // Get actual digits from grid
    const actualDigits = slot.cells.map(cellId => state.grid.get(cellId));
    
    // Check if any cell is empty
    if (actualDigits.some(d => d === null || d === undefined)) {
      return false;
    }
    
    // Check if digits match
    if (actualDigits.length !== expectedDigits.length) {
      return false;
    }
    
    for (let i = 0; i < actualDigits.length; i++) {
      if (actualDigits[i] !== expectedDigits[i]) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Validate a single constraint
 */
function validateConstraint(
  constraint: Constraint, 
  state: GameState
): ValidationResult {
  // Handle constraints that apply to all slots (no specific slot)
  if (constraint.type === 'noRepeatAcrossSlots') {
    return validateNoRepeatAcrossSlots(constraint, state);
  }
  
  // Handle constraints that involve multiple slots
  if (constraint.type === 'placeValueDifference' && constraint.slotA && constraint.slotB) {
    return validatePlaceValueDifferenceBetweenSlots(constraint, state);
  }
  
  if (constraint.type === 'slotDifferenceEqualsSlot') {
    return validateSlotDifferenceEqualsSlot(constraint, state);
  }
  
  if (constraint.type === 'cellDigitRestriction') {
    return validateCellDigitRestriction(constraint, state);
  }
  
  const slot = state.puzzle.slots.find(s => s.id === constraint.slot);
  
  if (!slot) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Slot not found'
    };
  }

  // Extract digits from the slot
  const digits = slot.cells.map(cellId => state.grid.get(cellId) ?? null);
  
  // Check if all cells are filled
  if (digits.some(d => d === null)) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Incomplete'
    };
  }

  // All cells are filled, validate the constraint type
  const filledDigits = digits as number[];

  switch (constraint.type) {
    case 'greatestNumber':
      return validateGreatestNumber(constraint, filledDigits, state);
    
    case 'smallestNumber':
      return validateSmallestNumber(constraint, filledDigits, state);
    
    case 'noRepeatWithinSlot':
      return validateNoRepeatWithinSlot(constraint, filledDigits);
    
    case 'placeValueSumEquals':
      return validatePlaceValueSumEquals(constraint, filledDigits, slot);
    
    case 'placeValueDifference':
      return validatePlaceValueDifferenceWithinSlot(constraint, filledDigits);
    
    default:
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: 'Unknown constraint type'
      };
  }
}

/**
 * Validate that the slot contains the greatest possible number
 */
function validateGreatestNumber(
  constraint: Constraint,
  digits: number[],
  state: GameState
): ValidationResult {
  const currentNumber = parseInt(digits.join(''));
  
  // Get all digits used in this slot
  const usedDigits = [...digits];
  
  // Check for no-repeat constraint
  if (constraint.noRepeat) {
    const hasRepeat = new Set(usedDigits).size !== usedDigits.length;
    if (hasRepeat) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: 'Cannot repeat digits'
      };
    }
  }
  
  // Sort digits in descending order to get the greatest number
  const sortedDigits = [...usedDigits].sort((a, b) => b - a);
  const greatestNumber = parseInt(sortedDigits.join(''));
  
  const satisfied = currentNumber === greatestNumber;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? `${currentNumber} is the greatest` : `${currentNumber} is not the greatest (${greatestNumber})`
  };
}

/**
 * Validate that the slot contains the smallest possible number
 */
function validateSmallestNumber(
  constraint: Constraint,
  digits: number[],
  state: GameState
): ValidationResult {
  const currentNumber = parseInt(digits.join(''));
  
  // Get all digits used in this slot
  const usedDigits = [...digits];
  
  // Check for sum of digits constraint
  if (constraint.sumOfDigits !== undefined) {
    const actualSum = usedDigits.reduce((sum, d) => sum + d, 0);
    if (actualSum !== constraint.sumOfDigits) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: `Sum of digits is ${actualSum}, not ${constraint.sumOfDigits}`
      };
    }
  }
  
  // Check for no-repeat constraint
  if (constraint.noRepeat) {
    const hasRepeat = new Set(usedDigits).size !== usedDigits.length;
    if (hasRepeat) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: 'Cannot repeat digits'
      };
    }
  }
  
  // Sort digits in ascending order to get the smallest number
  // Special handling: don't put 0 first if it would create leading zero
  const sortedDigits = [...usedDigits].sort((a, b) => a - b);
  
  // If first digit is 0 and there are more digits, swap with next smallest
  if (sortedDigits[0] === 0 && sortedDigits.length > 1) {
    // Find first non-zero digit
    const firstNonZeroIndex = sortedDigits.findIndex(d => d !== 0);
    if (firstNonZeroIndex > 0) {
      [sortedDigits[0], sortedDigits[firstNonZeroIndex]] = 
        [sortedDigits[firstNonZeroIndex], sortedDigits[0]];
    }
  }
  
  const smallestNumber = parseInt(sortedDigits.join(''));
  
  const satisfied = currentNumber === smallestNumber;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? `${currentNumber} is the smallest` : `${currentNumber} is not the smallest (${smallestNumber})`
  };
}

/**
 * Validate that digits within a slot don't repeat
 */
function validateNoRepeatWithinSlot(
  constraint: Constraint,
  digits: number[]
): ValidationResult {
  const uniqueDigits = new Set(digits);
  const satisfied = uniqueDigits.size === digits.length;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? 'No repeated digits' : 'Contains repeated digits'
  };
}

/**
 * Validate that digits don't repeat across multiple slots
 * This checks that each slot has no repeating digits within itself
 */
function validateNoRepeatAcrossSlots(
  constraint: Constraint,
  state: GameState
): ValidationResult {
  // Check each slot individually for internal repeats
  for (const slot of state.puzzle.slots) {
    const digits = slot.cells.map(cellId => state.grid.get(cellId) ?? null);
    
    // If any slot is incomplete, we can't validate yet
    if (digits.some(d => d === null)) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: 'Incomplete'
      };
    }
    
    const filledDigits = digits as number[];
    const uniqueDigits = new Set(filledDigits);
    
    // If this slot has repeating digits, constraint is not satisfied
    if (uniqueDigits.size !== filledDigits.length) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: `${slot.label} has repeated digits`
      };
    }
  }
  
  // All slots have unique digits within themselves
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied: true,
    message: 'No repeated digits in any number'
  };
}

/**
 * Check if the puzzle is fully solved (all constraints satisfied)
 */
export function isPuzzleSolved(validationResults: ValidationResult[]): boolean {
  return validationResults.every(result => result.satisfied);
}

/**
 * Helper function to get digit at a specific place value position
 * @param digits Array of digits from left to right (most significant to least)
 * @param place Place name like 'ones', 'tens', 'hundreds', 'thousands'
 * @returns The digit at that place, or null if not found
 */
function getDigitAtPlace(digits: number[], place: string): number | null {
  const length = digits.length;
  const placeIndex = {
    'ones': length - 1,
    'tens': length - 2,
    'hundreds': length - 3,
    'thousands': length - 4,
    'tenThousands': length - 5
  }[place];
  
  if (placeIndex === undefined || placeIndex < 0) {
    return null;
  }
  
  return digits[placeIndex] ?? null;
}

/**
 * Validate place value sum equals constraint
 * Example: sum of tens and ones place should equal 21 (means digit_tens*10 + digit_ones*1 = 21)
 */
function validatePlaceValueSumEquals(
  constraint: Constraint,
  digits: number[],
  slot: import('./types').Slot
): ValidationResult {
  if (!constraint.places || constraint.sum === undefined) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Invalid constraint configuration'
    };
  }
  
  let totalSum = 0;
  
  for (const place of constraint.places) {
    const digit = getDigitAtPlace(digits, place);
    if (digit === null) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: `Place ${place} not found`
      };
    }
    
    // Calculate place value (digit * place multiplier)
    const placeMultiplier = {
      'ones': 1,
      'tens': 10,
      'hundreds': 100,
      'thousands': 1000,
      'tenThousands': 10000
    }[place] ?? 1;
    
    totalSum += digit * placeMultiplier;
  }
  
  const satisfied = totalSum === constraint.sum;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? `Sum equals ${constraint.sum}` : `Sum is ${totalSum}, not ${constraint.sum}`
  };
}

/**
 * Validate place value difference between two slots
 * Example: hundreds place of slotA is 1 more than hundreds place of slotB
 */
function validatePlaceValueDifferenceBetweenSlots(
  constraint: Constraint,
  state: GameState
): ValidationResult {
  if (!constraint.slotA || !constraint.slotB || !constraint.place || constraint.difference === undefined) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Invalid constraint configuration'
    };
  }
  
  const slotA = state.puzzle.slots.find(s => s.id === constraint.slotA);
  const slotB = state.puzzle.slots.find(s => s.id === constraint.slotB);
  
  if (!slotA || !slotB) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Slot not found'
    };
  }
  
  const digitsA = slotA.cells.map(cellId => state.grid.get(cellId) ?? null);
  const digitsB = slotB.cells.map(cellId => state.grid.get(cellId) ?? null);
  
  if (digitsA.some(d => d === null) || digitsB.some(d => d === null)) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Incomplete'
    };
  }
  
  const digitA = getDigitAtPlace(digitsA as number[], constraint.place);
  const digitB = getDigitAtPlace(digitsB as number[], constraint.place);
  
  if (digitA === null || digitB === null) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: `Place ${constraint.place} not found`
    };
  }
  
  const actualDifference = digitA - digitB;
  const satisfied = actualDifference === constraint.difference;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? `Difference is ${constraint.difference}` : `Difference is ${actualDifference}, not ${constraint.difference}`
  };
}

/**
 * Validate place value difference within a single slot
 * Example: difference between thousands and hundreds place should be 3
 */
function validatePlaceValueDifferenceWithinSlot(
  constraint: Constraint,
  digits: number[]
): ValidationResult {
  if (!constraint.placeA || !constraint.placeB || constraint.difference === undefined) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Invalid constraint configuration'
    };
  }
  
  const digitA = getDigitAtPlace(digits, constraint.placeA);
  const digitB = getDigitAtPlace(digits, constraint.placeB);
  
  if (digitA === null || digitB === null) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: `Place not found`
    };
  }
  
  const actualDifference = Math.abs(digitA - digitB);
  const satisfied = actualDifference === constraint.difference;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? `Difference is ${constraint.difference}` : `Difference is ${actualDifference}, not ${constraint.difference}`
  };
}

/**
 * Validate slot arithmetic: slotA - slotB = resultSlot
 */
function validateSlotDifferenceEqualsSlot(
  constraint: Constraint,
  state: GameState
): ValidationResult {
  if (!constraint.slotA || !constraint.slotB || !constraint.resultSlot) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Invalid constraint configuration'
    };
  }
  
  const slotA = state.puzzle.slots.find(s => s.id === constraint.slotA);
  const slotB = state.puzzle.slots.find(s => s.id === constraint.slotB);
  const resultSlot = state.puzzle.slots.find(s => s.id === constraint.resultSlot);
  
  if (!slotA || !slotB || !resultSlot) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Slot not found'
    };
  }
  
  const digitsA = slotA.cells.map(cellId => state.grid.get(cellId) ?? null);
  const digitsB = slotB.cells.map(cellId => state.grid.get(cellId) ?? null);
  const digitsResult = resultSlot.cells.map(cellId => state.grid.get(cellId) ?? null);
  
  if (digitsA.some(d => d === null) || digitsB.some(d => d === null) || digitsResult.some(d => d === null)) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Incomplete'
    };
  }
  
  const numberA = parseInt((digitsA as number[]).join(''));
  const numberB = parseInt((digitsB as number[]).join(''));
  const numberResult = parseInt((digitsResult as number[]).join(''));
  
  const expectedResult = numberA - numberB;
  const satisfied = numberResult === expectedResult;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? `${numberA} - ${numberB} = ${numberResult}` : `${numberA} - ${numberB} = ${expectedResult}, not ${numberResult}`
  };
}

/**
 * Validate cell digit restrictions based on color
 */
function validateCellDigitRestriction(
  constraint: Constraint,
  state: GameState
): ValidationResult {
  if (!constraint.color) {
    return {
      constraintId: constraint.id,
      description: constraint.description,
      satisfied: false,
      message: 'Invalid constraint configuration'
    };
  }
  
  // Find all cells with the specified color
  const coloredCells: string[] = [];
  Object.entries(state.puzzle.layout.cells).forEach(([cellId, cellProps]) => {
    if (cellProps.color === constraint.color) {
      coloredCells.push(cellId);
    }
  });
  
  // Check each colored cell
  for (const cellId of coloredCells) {
    const digit = state.grid.get(cellId);
    
    if (digit === null || digit === undefined) {
      continue; // Skip empty cells
    }
    
    // Check notAllowed constraint
    if (constraint.notAllowed && constraint.notAllowed.includes(digit)) {
      return {
        constraintId: constraint.id,
        description: constraint.description,
        satisfied: false,
        message: `Digit ${digit} is not allowed in ${constraint.color} cells`
      };
    }
    
    // Check allowedRange constraint
    if (constraint.allowedRange) {
      const [min, max] = constraint.allowedRange;
      if (digit < min || digit > max) {
        return {
          constraintId: constraint.id,
          description: constraint.description,
          satisfied: false,
          message: `Digit ${digit} is not in allowed range [${min}-${max}] for ${constraint.color} cells`
        };
      }
    }
  }
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied: true,
    message: `All ${constraint.color} cells satisfy restrictions`
  };
}
