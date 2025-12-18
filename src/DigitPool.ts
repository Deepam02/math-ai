/**
 * DigitPool component for displaying and selecting available digits.
 */

export interface DigitPoolProps {
  availableDigits: number[];
  selectedDigitIndex: number | null;
  onDigitClick: (digit: number, index: number) => void;
  onDragStart?: (digit: number, index: number) => void;
  onDragEnd?: () => void;
  onDropToPool?: (data: { digit: number; cellId?: string; source: string }) => void;
}

/**
 * Create and render the digit pool
 */
export function createDigitPool(props: DigitPoolProps): HTMLElement {
  const { availableDigits, selectedDigitIndex, onDigitClick } = props;
  
  const container = document.createElement('div');
  container.className = 'digit-pool';
  
  const title = document.createElement('h3');
  title.textContent = 'Available Digits';
  title.className = 'digit-pool-title';
  container.appendChild(title);
  
  const poolContainer = document.createElement('div');
  poolContainer.className = 'digit-pool-container';
  
  // Make pool container a drop zone for returning digits
  poolContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    poolContainer.classList.add('pool-drag-over');
  });
  
  poolContainer.addEventListener('dragleave', (e) => {
    // Only remove if leaving the pool container itself
    if (e.target === poolContainer) {
      poolContainer.classList.remove('pool-drag-over');
    }
  });
  
  poolContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    poolContainer.classList.remove('pool-drag-over');
    
    if (e.dataTransfer) {
      const dataStr = e.dataTransfer.getData('text/plain');
      try {
        const data = JSON.parse(dataStr);
        // Only accept drops from grid cells
        if (data.source === 'cell' && props.onDropToPool) {
          props.onDropToPool(data);
        }
      } catch (err) {
        console.error('Failed to parse drag data:', err);
      }
    }
  });
  
  availableDigits.forEach((digit, index) => {
    const digitElement = document.createElement('button');
    digitElement.className = 'digit-button';
    digitElement.textContent = digit.toString();
    digitElement.draggable = true;
    
    if (selectedDigitIndex === index) {
      digitElement.classList.add('selected');
    }
    
    // Click handler for touch/click interaction
    digitElement.addEventListener('click', () => onDigitClick(digit, index));
    
    // Drag-and-drop handlers
    digitElement.addEventListener('dragstart', (e) => {
      // Hide the element after drag starts (use timeout to ensure drag initiates first)
      setTimeout(() => {
        digitElement.style.visibility = 'hidden';
      }, 0);
      
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ digit, index, source: 'pool' }));
        // Set a custom drag image to make it look like the digit is being dragged
        const dragImage = digitElement.cloneNode(true) as HTMLElement;
        dragImage.style.visibility = 'visible';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 30, 30);
        setTimeout(() => dragImage.remove(), 0);
      }
      if (props.onDragStart) {
        props.onDragStart(digit, index);
      }
    });
    
    digitElement.addEventListener('dragend', () => {
      // Show the element again after drag ends
      digitElement.style.visibility = 'visible';
      if (props.onDragEnd) {
        props.onDragEnd();
      }
    });
    
    poolContainer.appendChild(digitElement);
  });
  
  container.appendChild(poolContainer);
  
  return container;
}

/**
 * Update the digit pool display with new state
 */
export function updateDigitPool(
  poolElement: HTMLElement,
  props: DigitPoolProps
): void {
  const { availableDigits, selectedDigitIndex, onDigitClick } = props;
  
  const poolContainer = poolElement.querySelector('.digit-pool-container');
  if (!poolContainer) return;
  
  // Clear existing buttons (but keep event listeners on container)
  poolContainer.innerHTML = '';
  
  // Recreate all buttons with current state
  availableDigits.forEach((digit, index) => {
    const digitElement = document.createElement('button');
    digitElement.className = 'digit-button';
    digitElement.textContent = digit.toString();
    digitElement.draggable = true;
    
    if (selectedDigitIndex === index) {
      digitElement.classList.add('selected');
    }
    
    // Click handler
    digitElement.addEventListener('click', () => onDigitClick(digit, index));
    
    // Drag-and-drop handlers
    digitElement.addEventListener('dragstart', (e) => {
      setTimeout(() => {
        digitElement.style.visibility = 'hidden';
      }, 0);
      
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ digit, index, source: 'pool' }));
        const dragImage = digitElement.cloneNode(true) as HTMLElement;
        dragImage.style.visibility = 'visible';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 30, 30);
        setTimeout(() => dragImage.remove(), 0);
      }
      if (props.onDragStart) {
        props.onDragStart(digit, index);
      }
    });
    
    digitElement.addEventListener('dragend', () => {
      digitElement.style.visibility = 'visible';
      if (props.onDragEnd) {
        props.onDragEnd();
      }
    });
    
    poolContainer.appendChild(digitElement);
  });
  
  // Re-setup drop zone handlers (in case they were lost)
  // Remove old listeners by cloning and replacing (to avoid duplicates)
  const newPoolContainer = poolContainer.cloneNode(false) as HTMLElement;
  while (poolContainer.firstChild) {
    newPoolContainer.appendChild(poolContainer.firstChild);
  }
  poolContainer.parentNode?.replaceChild(newPoolContainer, poolContainer);
  
  // Add drop zone event listeners
  newPoolContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    newPoolContainer.classList.add('pool-drag-over');
  });
  
  newPoolContainer.addEventListener('dragleave', (e) => {
    if (e.target === newPoolContainer) {
      newPoolContainer.classList.remove('pool-drag-over');
    }
  });
  
  newPoolContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    newPoolContainer.classList.remove('pool-drag-over');
    
    if (e.dataTransfer) {
      const dataStr = e.dataTransfer.getData('text/plain');
      try {
        const data = JSON.parse(dataStr);
        if (data.source === 'cell' && props.onDropToPool) {
          props.onDropToPool(data);
        }
      } catch (err) {
        console.error('Failed to parse drag data:', err);
      }
    }
  });
}
