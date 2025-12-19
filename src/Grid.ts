/**
 * Grid component for the Cross Numbers puzzle.
 * Renders the puzzle grid using CSS Grid layout.
 */

import type { PuzzleLayout, CellId, Slot } from './types';

export interface GridProps {
  layout: PuzzleLayout;
  gridState: Map<CellId, number | null>;
  onCellClick: (cellId: CellId) => void;
  highlightedSlotCells?: CellId[];
  onDrop?: (cellId: CellId, data: { digit: number; index: number; source: string }) => void;
  onDragFromCell?: (cellId: CellId) => void;
  slots?: Slot[]; // Add slots to show labels
}

/**
 * Create and render the puzzle grid
 */
export function createGrid(props: GridProps): HTMLElement {
  const { layout, gridState, onCellClick, highlightedSlotCells = [], slots = [] } = props;
  
  // Helper function to find ALL slots where this cell is the first cell
  const getCellSlotLabels = (cellId: CellId): Slot[] => {
    const firstCellSlots: Slot[] = [];
    for (const slot of slots) {
      const cellIndex = slot.cells.indexOf(cellId);
      if (cellIndex === 0) {
        firstCellSlots.push(slot);
      }
    }
    return firstCellSlots;
  };
  
  const gridContainer = document.createElement('div');
  gridContainer.className = 'puzzle-grid';
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;
  gridContainer.style.gap = '2px';
  gridContainer.style.width = 'fit-content';
  gridContainer.style.margin = '0 auto';
  gridContainer.style.position = 'relative';
  
  // Create all cells (including empty spaces)
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const cellId = `${row},${col}`;
      const cellElement = document.createElement('div');
      
      // Check if this cell should be rendered
      if (layout.cells[cellId] !== undefined) {
        cellElement.className = 'grid-cell active';
        cellElement.style.position = 'relative';
        
        // Add color class if cell has a color property
        const cellProps = layout.cells[cellId];
        if (cellProps && cellProps.color) {
          cellElement.classList.add(`color-${cellProps.color}`);
        }
        
        // Add slot labels if this is the first cell of any slot(s)
        const firstCellSlots = getCellSlotLabels(cellId);
        if (firstCellSlots.length > 0) {
          const labelsContainer = document.createElement('div');
          labelsContainer.style.position = 'absolute';
          labelsContainer.style.top = '-12px';
          labelsContainer.style.left = '50%';
          labelsContainer.style.transform = 'translateX(-50%)';
          labelsContainer.style.display = 'flex';
          labelsContainer.style.gap = '4px';
          labelsContainer.style.zIndex = '10';
          labelsContainer.style.pointerEvents = 'none';
          
          firstCellSlots.forEach(slot => {
            const label = document.createElement('div');
            label.className = 'cell-label';
            label.textContent = slot.label;
            labelsContainer.appendChild(label);
          });
          
          cellElement.appendChild(labelsContainer);
        }
        
        // Add highlighted class if this cell is part of the highlighted slot
        if (highlightedSlotCells.includes(cellId)) {
          cellElement.classList.add('highlighted');
        }
        
        const value = gridState.get(cellId);
        if (value !== null && value !== undefined) {
          const valueSpan = document.createElement('span');
          valueSpan.className = 'cell-value';
          valueSpan.textContent = value.toString();
          cellElement.appendChild(valueSpan);
          cellElement.classList.add('filled');
          cellElement.draggable = true;
        }
        
        // Click handler
        cellElement.addEventListener('click', () => onCellClick(cellId));
        
        // Drag-and-drop handlers for dropping onto cells
        cellElement.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
          }
          cellElement.classList.add('drag-over');
        });
        
        cellElement.addEventListener('dragleave', () => {
          cellElement.classList.remove('drag-over');
        });
        
        cellElement.addEventListener('drop', (e) => {
          e.preventDefault();
          cellElement.classList.remove('drag-over');
          
          if (e.dataTransfer) {
            const dataStr = e.dataTransfer.getData('text/plain');
            try {
              const data = JSON.parse(dataStr);
              if (props.onDrop) {
                props.onDrop(cellId, data);
              }
            } catch (err) {
              console.error('Failed to parse drag data:', err);
            }
          }
        });
        
        // Drag start for cells with values (to drag out)
        cellElement.addEventListener('dragstart', (e) => {
          if (value !== null && value !== undefined) {
            // Hide text content while dragging
            cellElement.style.opacity = '0.3';
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', JSON.stringify({ digit: value, cellId, source: 'cell' }));
            }
            if (props.onDragFromCell) {
              props.onDragFromCell(cellId);
            }
          }
        });
        
        cellElement.addEventListener('dragend', () => {
          // Restore opacity
          cellElement.style.opacity = '';
        });
      } else {
        // Empty space in the grid
        cellElement.className = 'grid-cell empty';
      }
      
      gridContainer.appendChild(cellElement);
    }
  }
  
  return gridContainer;
}

/**
 * Update the grid display with new state
 */
export function updateGrid(
  gridElement: HTMLElement, 
  props: GridProps
): void {
  const { layout, gridState, onCellClick, highlightedSlotCells = [], slots = [] } = props;
  
  // Helper function to find ALL slots where this cell is the first cell
  const getCellSlotLabels = (cellId: CellId): Slot[] => {
    const firstCellSlots: Slot[] = [];
    for (const slot of slots) {
      const cellIndex = slot.cells.indexOf(cellId);
      if (cellIndex === 0) {
        firstCellSlots.push(slot);
      }
    }
    return firstCellSlots;
  };
  
  // Clear and recreate all cells to ensure drag handlers work correctly
  gridElement.innerHTML = '';
  
  // Recreate all cells (including empty spaces)
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const cellId = `${row},${col}`;
      const cellElement = document.createElement('div');
      
      // Check if this cell should be rendered
      if (layout.cells[cellId] !== undefined) {
        cellElement.className = 'grid-cell active';
        cellElement.style.position = 'relative';
        
        // Add color class if cell has a color property
        const cellProps = layout.cells[cellId];
        if (cellProps && cellProps.color) {
          cellElement.classList.add(`color-${cellProps.color}`);
        }
        
        // Add slot labels if this is the first cell of any slot(s)
        const firstCellSlots = getCellSlotLabels(cellId);
        if (firstCellSlots.length > 0) {
          const labelsContainer = document.createElement('div');
          labelsContainer.style.position = 'absolute';
          labelsContainer.style.top = '-12px';
          labelsContainer.style.left = '50%';
          labelsContainer.style.transform = 'translateX(-50%)';
          labelsContainer.style.display = 'flex';
          labelsContainer.style.gap = '4px';
          labelsContainer.style.zIndex = '10';
          labelsContainer.style.pointerEvents = 'none';
          
          firstCellSlots.forEach(slot => {
            const label = document.createElement('div');
            label.className = 'cell-label';
            label.textContent = slot.label;
            labelsContainer.appendChild(label);
          });
          
          cellElement.appendChild(labelsContainer);
        }
        
        // Add highlighted class if this cell is part of the highlighted slot
        if (highlightedSlotCells.includes(cellId)) {
          cellElement.classList.add('highlighted');
        }
        
        const value = gridState.get(cellId);
        if (value !== null && value !== undefined) {
          const valueSpan = document.createElement('span');
          valueSpan.className = 'cell-value';
          valueSpan.textContent = value.toString();
          cellElement.appendChild(valueSpan);
          cellElement.classList.add('filled');
          cellElement.draggable = true;
        }
        
        // Click handler
        cellElement.addEventListener('click', () => onCellClick(cellId));
        
        // Drag-and-drop handlers for dropping onto cells
        cellElement.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
          }
          cellElement.classList.add('drag-over');
        });
        
        cellElement.addEventListener('dragleave', () => {
          cellElement.classList.remove('drag-over');
        });
        
        cellElement.addEventListener('drop', (e) => {
          e.preventDefault();
          cellElement.classList.remove('drag-over');
          
          if (e.dataTransfer) {
            const dataStr = e.dataTransfer.getData('text/plain');
            try {
              const data = JSON.parse(dataStr);
              if (props.onDrop) {
                props.onDrop(cellId, data);
              }
            } catch (err) {
              console.error('Failed to parse drag data:', err);
            }
          }
        });
        
        // Drag start for cells with values (to drag out)
        if (value !== null && value !== undefined) {
          cellElement.addEventListener('dragstart', (e) => {
            // Hide text content while dragging
            cellElement.style.opacity = '0.3';
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', JSON.stringify({ digit: value, cellId, source: 'cell' }));
            }
            if (props.onDragFromCell) {
              props.onDragFromCell(cellId);
            }
          });
          
          cellElement.addEventListener('dragend', () => {
            // Restore opacity
            cellElement.style.opacity = '';
          });
        }
      } else {
        // Empty space in the grid
        cellElement.className = 'grid-cell empty';
      }
      
      gridElement.appendChild(cellElement);
    }
  }
}
