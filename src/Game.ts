/**
 * Main Game component that orchestrates the entire Cross Numbers puzzle game.
 */

import type { GameState, CellId, Puzzle } from './types';
import { validateConstraints, isPuzzleSolved } from './engine';
import { createGrid, updateGrid } from './Grid';
import { createDigitPool, updateDigitPool } from './DigitPool';
import { createSlotPreview, updateSlotPreview } from './SlotPreview';

export class Game {
  private state: GameState;
  private container: HTMLElement;
  private gridElement: HTMLElement | null = null;
  private digitPoolElement: HTMLElement | null = null;
  private slotPreviewElement: HTMLElement | null = null;
  private submitButton: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  private hoveredSlotId: string | null = null;
  private onComplete: (() => void) | null;

  constructor(puzzle: Puzzle, container: HTMLElement, onComplete?: () => void, initialScore: number = 0, initialHealth: number = 3) {
    this.container = container;
    this.onComplete = onComplete || null;
    this.state = this.initializeState(puzzle, initialScore, initialHealth);
    
    this.render();
  }

  /**
   * Initialize game state from puzzle
   */
  private initializeState(puzzle: Puzzle, initialScore: number = 0, initialHealth: number = 3): GameState {
    const grid = new Map<CellId, number | null>();
    
    // Initialize all cells with null
    Object.keys(puzzle.layout.cells).forEach(cellId => {
      grid.set(cellId, null);
    });

    return {
      puzzle,
      grid,
      availableDigits: [...puzzle.digits],
      selectedDigit: null,
      selectedDigitIndex: null,
      isSubmitted: false,
      validationResults: [],
      health: initialHealth,
      score: initialScore
    };
  }

  /**
   * Play sound effect
   */
  private playSound(type: 'success' | 'error'): void {
    try {
      // Use Web Audio API for instant sound generation
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const context = new AudioContext();
      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      
      if (type === 'success') {
        // Play cheerful ascending notes
        const notes = [
          { freq: 523.25, time: 0, duration: 0.1 },    // C5
          { freq: 659.25, time: 0.1, duration: 0.1 },  // E5
          { freq: 783.99, time: 0.2, duration: 0.15 }, // G5
          { freq: 1046.50, time: 0.35, duration: 0.2 } // C6
        ];
        
        notes.forEach(note => {
          const oscillator = context.createOscillator();
          oscillator.connect(gainNode);
          oscillator.frequency.value = note.freq;
          oscillator.type = 'sine';
          oscillator.start(context.currentTime + note.time);
          oscillator.stop(context.currentTime + note.time + note.duration);
          
          // Fade out
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            context.currentTime + note.time + note.duration
          );
        });
      } else {
        // Play descending error sound
        const oscillator = context.createOscillator();
        oscillator.connect(gainNode);
        oscillator.frequency.setValueAtTime(400, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.3);
        oscillator.type = 'square';
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.3);
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      }
      
      // Clean up
      setTimeout(() => context.close(), 1000);
    } catch (err) {
      console.log('Sound not supported:', err);
    }
  }

  /**
   * Handle digit selection from the pool
   */
  private handleDigitClick = (digit: number, index: number): void => {
    if (this.state.selectedDigitIndex === index) {
      // Deselect if clicking the same digit
      this.state.selectedDigit = null;
      this.state.selectedDigitIndex = null;
    } else {
      // Select the digit
      this.state.selectedDigit = digit;
      this.state.selectedDigitIndex = index;
    }
    
    this.updateDisplay();
  };

  /**
   * Handle cell click on the grid
   */
  private handleCellClick = (cellId: CellId): void => {
    const currentValue = this.state.grid.get(cellId);
    
    if (currentValue !== null && currentValue !== undefined) {
      // Cell is filled - remove the digit and return it to the pool
      this.state.grid.set(cellId, null);
      this.state.availableDigits.push(currentValue);
      
      // Clear selection
      this.state.selectedDigit = null;
      this.state.selectedDigitIndex = null;
      
      // Reset submission state
      this.state.isSubmitted = false;
      this.state.validationResults = [];
    } else if (this.state.selectedDigit !== null && this.state.selectedDigitIndex !== null) {
      // Cell is empty and a digit is selected - place the digit
      this.state.grid.set(cellId, this.state.selectedDigit);
      
      // Remove digit from available pool
      this.state.availableDigits.splice(this.state.selectedDigitIndex, 1);
      
      // Clear selection
      this.state.selectedDigit = null;
      this.state.selectedDigitIndex = null;
      
      // Reset submission state
      this.state.isSubmitted = false;
      this.state.validationResults = [];
    }
    
    this.updateDisplay();
  };

  /**
   * Handle submit button click
   */
  private handleSubmit = (): void => {
    // Check if all digits are placed
    const allPlaced = this.state.availableDigits.length === 0;
    
    if (!allPlaced) {
      this.showMessage('Please place all digits before submitting!', 'warning');
      return;
    }
    
    // Validate constraints
    this.state.validationResults = validateConstraints(this.state);
    this.state.isSubmitted = true;
    
    // Check if puzzle is solved
    const solved = isPuzzleSolved(this.state.validationResults);
    
    if (solved) {
      this.playSound('success');
      this.showMessage('🎉 Congratulations! You solved the puzzle!', 'success');
      
      // Increase score
      this.state.score++;
      
      // Call onComplete callback if provided
      if (this.onComplete) {
        setTimeout(() => {
          this.onComplete!();
        }, 500);
      }
    } else {
      this.playSound('error');
      this.showMessage('❌ Not quite right. Check the conditions and try again!', 'error');
      
      // Decrease health
      this.state.health--;
      
      // Check for game over
      if (this.state.health <= 0) {
        setTimeout(() => {
          this.showGameOver();
        }, 1000);
        return;
      }
    }
    
    this.updateDisplay();
  };

  /**
   * Handle reset button click
   */
  private handleReset = (): void => {
    this.state = this.initializeState(this.state.puzzle, this.state.score, this.state.health);
    this.updateDisplay();
    this.clearMessage();
  };

  /**
   * Handle slot hover for highlighting
   */
  private handleSlotHover = (slotId: string | null): void => {
    this.hoveredSlotId = slotId;
    this.updateDisplay();
  };

  /**
   * Handle drag start from digit pool
   */
  private handleDragStart = (digit: number, index: number): void => {
    this.state.selectedDigit = digit;
    this.state.selectedDigitIndex = index;
  };

  /**
   * Handle drag end
   */
  private handleDragEnd = (): void => {
    // Don't clear selection here - wait for drop or explicit deselection
  };

  /**
   * Handle drop onto grid cell
   */
  private handleDrop = (cellId: CellId, data: { digit: number; index?: number; cellId?: CellId; source: string }): void => {
    if (data.source === 'pool') {
      // Dragging from pool to cell
      const currentValue = this.state.grid.get(cellId);
      
      if (currentValue !== null && currentValue !== undefined) {
        // Cell is already filled - return the old digit to pool
        this.state.availableDigits.push(currentValue);
      }
      
      // Place the new digit
      this.state.grid.set(cellId, data.digit);
      
      // Remove from pool (data.index is the position in available digits)
      if (data.index !== undefined) {
        this.state.availableDigits.splice(data.index, 1);
      }
      
      // Clear selection
      this.state.selectedDigit = null;
      this.state.selectedDigitIndex = null;
      
      // Reset submission state
      this.state.isSubmitted = false;
      this.state.validationResults = [];
      
      this.updateDisplay();
    } else if (data.source === 'cell') {
      // Dragging from one cell to another
      const sourceCellId = data.cellId;
      const currentTargetValue = this.state.grid.get(cellId);
      
      if (sourceCellId && sourceCellId !== cellId) {
        // Swap or move
        if (currentTargetValue !== null && currentTargetValue !== undefined) {
          // Swap values
          this.state.grid.set(sourceCellId, currentTargetValue);
        } else {
          // Just move
          this.state.grid.set(sourceCellId, null);
        }
        
        this.state.grid.set(cellId, data.digit);
        
        // Reset submission state
        this.state.isSubmitted = false;
        this.state.validationResults = [];
        
        this.updateDisplay();
      }
    }
  };

  /**
   * Handle drag from cell (to potentially remove it)
   */
  private handleDragFromCell = (_cellId: CellId): void => {
    // Track which cell is being dragged
    // We'll handle the actual removal in handleDropToPool if needed
  };

  /**
   * Handle drop back to the digit pool
   */
  private handleDropToPool = (data: { digit: number; cellId?: string; source: string }): void => {
    if (data.source === 'cell' && data.cellId) {
      // Remove digit from the cell
      this.state.grid.set(data.cellId, null);
      
      // Add digit back to the pool
      this.state.availableDigits.push(data.digit);
      
      // Reset submission state
      this.state.isSubmitted = false;
      this.state.validationResults = [];
      
      this.updateDisplay();
    }
  };

  /**
   * Get cells to highlight based on hovered slot
   */
  private getHighlightedCells(): CellId[] {
    if (!this.hoveredSlotId) return [];
    
    const slot = this.state.puzzle.slots.find(s => s.id === this.hoveredSlotId);
    return slot ? slot.cells : [];
  }

  /**
   * Show message to user
   */
  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    if (this.messageElement) {
      this.messageElement.textContent = message;
      this.messageElement.className = `message ${type}`;
      this.messageElement.style.display = 'block';
    }
  }

  /**
   * Clear message
   */
  private clearMessage(): void {
    if (this.messageElement) {
      this.messageElement.textContent = '';
      this.messageElement.style.display = 'none';
    }
  }

  /**
   * Get current score
   */
  public getScore(): number {
    return this.state.score;
  }

  /**
   * Get current health
   */
  public getHealth(): number {
    return this.state.health;
  }

  /**
   * Show game over screen
   */
  private showGameOver(): void {
    this.container.innerHTML = '';
    
    const gameOver = document.createElement('div');
    gameOver.className = 'game-over-screen';
    
    const content = document.createElement('div');
    content.className = 'game-over-content';
    
    const title = document.createElement('h1');
    title.className = 'game-over-title';
    title.textContent = 'Game Over';
    
    const message = document.createElement('p');
    message.className = 'game-over-message';
    message.textContent = `Final Score: ${this.state.score}`;
    
    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', () => {
      window.location.reload();
    });
    
    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(restartButton);
    gameOver.appendChild(content);
    this.container.appendChild(gameOver);
  }

  /**
   * Update display with current state
   */
  private updateDisplay(): void {
    // Update health and score display
    const healthContainer = this.container.querySelector('.health-container');
    if (healthContainer) {
      const hearts = healthContainer.querySelectorAll('.heart');
      hearts.forEach((heart, i) => {
        heart.className = i < this.state.health ? 'heart filled' : 'heart empty';
      });
    }
    
    const scoreText = this.container.querySelector('.score-text');
    if (scoreText) {
      scoreText.textContent = `${this.state.score}`;
    }
    
    // Update grid
    if (this.gridElement) {
      updateGrid(this.gridElement, {
        layout: this.state.puzzle.layout,
        gridState: this.state.grid,
        onCellClick: this.handleCellClick,
        highlightedSlotCells: this.getHighlightedCells(),
        onDrop: this.handleDrop,
        onDragFromCell: this.handleDragFromCell,
        slots: this.state.puzzle.slots
      });
    }

    // Update digit pool
    if (this.digitPoolElement) {
      updateDigitPool(this.digitPoolElement, {
        availableDigits: this.state.availableDigits,
        selectedDigitIndex: this.state.selectedDigitIndex,
        onDigitClick: this.handleDigitClick,
        onDragStart: this.handleDragStart,
        onDragEnd: this.handleDragEnd,
        onDropToPool: this.handleDropToPool
      });
    }

    // Update slot preview
    if (this.slotPreviewElement) {
      updateSlotPreview(this.slotPreviewElement, {
        slots: this.state.puzzle.slots,
        gridState: this.state.grid,
        constraints: this.state.puzzle.constraints,
        validationResults: this.state.validationResults,
        isSubmitted: this.state.isSubmitted,
        onSlotHover: this.handleSlotHover
      });
    }
  }

  /**
   * Render the complete game UI
   */
  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'game-container';

    // Header with integrated health and score
    const header = document.createElement('div');
    header.className = 'game-header';
    
    // Health on the left
    const healthContainer = document.createElement('div');
    healthContainer.className = 'health-container';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.className = i < this.state.health ? 'heart filled' : 'heart empty';
      heart.textContent = '♥';
      healthContainer.appendChild(heart);
    }
    header.appendChild(healthContainer);
    
    // Title in the center
    const title = document.createElement('h1');
    title.textContent = this.state.puzzle.title;
    header.appendChild(title);
    
    // Score on the right
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'score-container';
    const star = document.createElement('span');
    star.className = 'star-icon';
    star.textContent = '⭐';
    const scoreText = document.createElement('span');
    scoreText.className = 'score-text';
    scoreText.textContent = `${this.state.score}`;
    scoreContainer.appendChild(star);
    scoreContainer.appendChild(scoreText);
    header.appendChild(scoreContainer);
    
    this.container.appendChild(header);
    
    // Instruction below header
    const instruction = document.createElement('p');
    instruction.className = 'instruction';
    instruction.textContent = this.state.puzzle.instruction;
    this.container.appendChild(instruction);

    // Main content area
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';

    // Grid section
    const gridSection = document.createElement('div');
    gridSection.className = 'grid-section';
    
    this.gridElement = createGrid({
      layout: this.state.puzzle.layout,
      gridState: this.state.grid,
      onCellClick: this.handleCellClick,
      highlightedSlotCells: this.getHighlightedCells(),
      onDrop: this.handleDrop,
      onDragFromCell: this.handleDragFromCell,
      slots: this.state.puzzle.slots
    });
    gridSection.appendChild(this.gridElement);
    
    mainContent.appendChild(gridSection);

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';

    // Digit pool (moved to top)
    this.digitPoolElement = createDigitPool({
      availableDigits: this.state.availableDigits,
      selectedDigitIndex: this.state.selectedDigitIndex,
      onDigitClick: this.handleDigitClick,
      onDragStart: this.handleDragStart,
      onDragEnd: this.handleDragEnd,
      onDropToPool: this.handleDropToPool
    });
    sidebar.appendChild(this.digitPoolElement);

    // Slot Preview / Formed Numbers (moved below)
    this.slotPreviewElement = createSlotPreview({
      slots: this.state.puzzle.slots,
      gridState: this.state.grid,
      constraints: this.state.puzzle.constraints,
      validationResults: this.state.validationResults,
      isSubmitted: this.state.isSubmitted,
      onSlotHover: this.handleSlotHover
    });
    sidebar.appendChild(this.slotPreviewElement);

    mainContent.appendChild(sidebar);
    this.container.appendChild(mainContent);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'actions';

    this.submitButton = document.createElement('button');
    this.submitButton.className = 'submit-button';
    this.submitButton.textContent = 'Submit & Check';
    this.submitButton.addEventListener('click', this.handleSubmit);
    actions.appendChild(this.submitButton);

    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', this.handleReset);
    actions.appendChild(resetButton);

    this.container.appendChild(actions);

    // Message area
    this.messageElement = document.createElement('div');
    this.messageElement.className = 'message';
    this.messageElement.style.display = 'none';
    this.container.appendChild(this.messageElement);
  }

  /**
   * Switch to a different puzzle
   */
  public loadPuzzle(puzzle: Puzzle): void {
    this.state = this.initializeState(puzzle);
    this.render();
  }
}
