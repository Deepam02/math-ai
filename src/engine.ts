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
  return state.puzzle.constraints.map(constraint => 
    validateConstraint(constraint, state)
  );
}

/**
 * Validate a single constraint
 */
function validateConstraint(
  constraint: Constraint, 
  state: GameState
): ValidationResult {
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
    
    case 'noRepeatAcrossSlots':
      return validateNoRepeatAcrossSlots(constraint, state);
    
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
 */
function validateNoRepeatAcrossSlots(
  constraint: Constraint,
  state: GameState
): ValidationResult {
  const relatedSlots = constraint.relatedSlots || [constraint.slot];
  const allDigits: number[] = [];
  
  for (const slotId of relatedSlots) {
    const slot = state.puzzle.slots.find(s => s.id === slotId);
    if (slot) {
      const digits = slot.cells.map(cellId => state.grid.get(cellId) ?? null);
      if (digits.some(d => d === null)) {
        return {
          constraintId: constraint.id,
          description: constraint.description,
          satisfied: false,
          message: 'Incomplete'
        };
      }
      allDigits.push(...(digits as number[]));
    }
  }
  
  const uniqueDigits = new Set(allDigits);
  const satisfied = uniqueDigits.size === allDigits.length;
  
  return {
    constraintId: constraint.id,
    description: constraint.description,
    satisfied,
    message: satisfied ? 'No repeated digits across slots' : 'Contains repeated digits across slots'
  };
}

/**
 * Check if the puzzle is fully solved (all constraints satisfied)
 */
export function isPuzzleSolved(validationResults: ValidationResult[]): boolean {
  return validationResults.every(result => result.satisfied);
}
