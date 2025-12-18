/**
 * Cross Numbers Puzzle Game
 * Main entry point
 */

import './style.css'
import { Game } from './Game'
import { getDefaultPuzzle, puzzles, getPuzzleById } from './puzzles'

// Initialize the game with the default puzzle
const appContainer = document.querySelector<HTMLDivElement>('#app')!;
const game = new Game(getDefaultPuzzle(), appContainer);

// Expose game instance globally for debugging and puzzle switching
(window as any).game = game;
(window as any).puzzles = puzzles;
(window as any).loadPuzzle = (id: string) => {
  const puzzle = getPuzzleById(id);
  if (puzzle) {
    game.loadPuzzle(puzzle);
  } else {
    console.error(`Puzzle with id "${id}" not found`);
  }
};

console.log('Cross Numbers Game loaded!');
console.log('Available puzzles:', puzzles.map(p => p.id));
console.log('To switch puzzles, use: loadPuzzle("q1"), loadPuzzle("q3"), or loadPuzzle("q4")');
