/**
 * SlotPreview component for displaying formed numbers and constraints.
 */

import type { Slot, CellId, Constraint, ValidationResult } from './types';

export interface SlotPreviewProps {
  slots: Slot[];
  gridState: Map<CellId, number | null>;
  constraints: Constraint[];
  validationResults?: ValidationResult[];
  isSubmitted: boolean;
  onSlotHover?: (slotId: string | null) => void;
}

/**
 * Get the number formed by a slot
 */
function getSlotNumber(slot: Slot, gridState: Map<CellId, number | null>): string {
  const digits = slot.cells.map(cellId => {
    const value = gridState.get(cellId);
    return value !== null && value !== undefined ? value.toString() : '_';
  });
  return digits.join('');
}

/**
 * Create and render the slot preview section
 */
export function createSlotPreview(props: SlotPreviewProps): HTMLElement {
  const { slots, gridState, constraints, validationResults = [], isSubmitted, onSlotHover } = props;
  
  const container = document.createElement('div');
  container.className = 'slot-preview';
  
  // Constraints section (moved to top)
  if (constraints.length > 0) {
    const constraintsTitle = document.createElement('h3');
    constraintsTitle.textContent = 'Conditions';
    container.appendChild(constraintsTitle);
    
    const constraintsList = document.createElement('div');
    constraintsList.className = 'constraints-list';
    
    constraints.forEach((constraint, index) => {
      const constraintDiv = document.createElement('div');
      constraintDiv.className = 'constraint-item';
      
      // Add index number
      const indexSpan = document.createElement('span');
      indexSpan.className = 'constraint-index';
      indexSpan.textContent = `${index + 1}`;
      constraintDiv.appendChild(indexSpan);
      
      // Add description
      const descSpan = document.createElement('span');
      descSpan.className = 'constraint-description';
      descSpan.textContent = constraint.description;
      constraintDiv.appendChild(descSpan);
      
      // Add validation status if submitted
      if (isSubmitted) {
        const result = validationResults.find(r => r.constraintId === constraint.id);
        if (result) {
          const statusSpan = document.createElement('span');
          statusSpan.className = 'constraint-status';
          statusSpan.textContent = result.satisfied ? '✓' : '✗';
          constraintDiv.appendChild(statusSpan);
          
          if (result.satisfied) {
            constraintDiv.classList.add('satisfied');
          } else {
            constraintDiv.classList.add('not-satisfied');
          }
        }
      }
      
      constraintsList.appendChild(constraintDiv);
    });
    
    container.appendChild(constraintsList);
  }
  
  // Formed Numbers section (moved to bottom)
  const formedTitle = document.createElement('h3');
  formedTitle.textContent = 'Formed Numbers';
  formedTitle.style.marginTop = '20px';
  container.appendChild(formedTitle);
  
  // Slot numbers
  const slotsContainer = document.createElement('div');
  slotsContainer.className = 'slots-container';
  
  slots.forEach(slot => {
    const slotDiv = document.createElement('div');
    slotDiv.className = 'slot-item';
    
    const slotLabel = document.createElement('span');
    slotLabel.className = 'slot-label';
    slotLabel.textContent = `${slot.label}: `;
    
    const slotValue = document.createElement('span');
    slotValue.className = 'slot-value';
    slotValue.textContent = getSlotNumber(slot, gridState);
    
    slotDiv.appendChild(slotLabel);
    slotDiv.appendChild(slotValue);
    
    // Add hover effect
    if (onSlotHover) {
      slotDiv.addEventListener('mouseenter', () => onSlotHover(slot.id));
      slotDiv.addEventListener('mouseleave', () => onSlotHover(null));
    }
    
    slotsContainer.appendChild(slotDiv);
  });
  
  container.appendChild(slotsContainer);
  
  return container;
}

/**
 * Update the slot preview with new state
 */
export function updateSlotPreview(
  previewElement: HTMLElement,
  props: SlotPreviewProps
): void {
  const { slots, gridState, constraints, validationResults = [], isSubmitted } = props;
  
  // Update slot numbers
  const slotItems = previewElement.querySelectorAll('.slot-item');
  slotItems.forEach((item, index) => {
    const slot = slots[index];
    if (slot) {
      const slotValue = item.querySelector('.slot-value');
      if (slotValue) {
        slotValue.textContent = getSlotNumber(slot, gridState);
      }
    }
  });
  
  // Update constraints
  const constraintItems = previewElement.querySelectorAll('.constraint-item');
  constraintItems.forEach((item, index) => {
    const constraint = constraints[index];
    if (constraint && isSubmitted) {
      const result = validationResults.find(r => r.constraintId === constraint.id);
      
      // Remove old status
      const oldStatus = item.querySelector('.constraint-status');
      if (oldStatus) {
        oldStatus.remove();
      }
      
      item.classList.remove('satisfied', 'not-satisfied');
      
      if (result) {
        const statusSpan = document.createElement('span');
        statusSpan.className = `constraint-status ${result.satisfied ? 'satisfied' : 'not-satisfied'}`;
        statusSpan.textContent = result.satisfied ? '✓' : '✗';
        item.appendChild(statusSpan);
        
        if (result.satisfied) {
          item.classList.add('satisfied');
        } else {
          item.classList.add('not-satisfied');
        }
      }
    } else if (!isSubmitted) {
      // Remove status when not submitted
      const oldStatus = item.querySelector('.constraint-status');
      if (oldStatus) {
        oldStatus.remove();
      }
      item.classList.remove('satisfied', 'not-satisfied');
    }
  });
}
