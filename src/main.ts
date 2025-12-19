/**
 * Cross Numbers Puzzle Game
 * Main entry point
 */

import './style.css'
import { Game } from './Game'
import { puzzles } from './puzzles'
import { createSnowfall } from './Snowfall'

const appContainer = document.querySelector<HTMLDivElement>('#app')!;
let currentPuzzleIndex = 0;
let gameInstance: Game | null = null;
let snowfallInstance: any = null;
let globalScore = 0;
let globalHealth = 3;

// Create landing page
function createLandingPage(): HTMLElement {
  const landing = document.createElement('div');
  landing.className = 'landing-page';
  
  // Add snowfall ONLY to landing page
  snowfallInstance = createSnowfall(landing);
  
  const content = document.createElement('div');
  content.className = 'landing-content';
  
  const title = document.createElement('h1');
  title.className = 'landing-title';
  title.textContent = 'Cross Numbers';
  
  const subtitle = document.createElement('p');
  subtitle.className = 'landing-subtitle';
  subtitle.textContent = 'Place digits to form numbers that satisfy all conditions';
  
  const startButton = document.createElement('button');
  startButton.className = 'landing-start-button';
  startButton.textContent = 'Start';
  
  startButton.addEventListener('click', () => {
    // Remove snowfall when leaving landing page
    if (snowfallInstance) {
      snowfallInstance.parentElement?.removeChild(snowfallInstance);
      snowfallInstance = null;
    }
    landing.style.display = 'none';
    currentPuzzleIndex = 0;
    globalScore = 0;
    globalHealth = 3;
    loadPuzzle(currentPuzzleIndex);
  });
  
  content.appendChild(title);
  content.appendChild(subtitle);
  content.appendChild(startButton);
  landing.appendChild(content);
  
  return landing;
}

// Load puzzle by index
function loadPuzzle(index: number) {
  if (index >= puzzles.length) {
    // All puzzles completed!
    showCompletionScreen();
    return;
  }
  
  const puzzle = puzzles[index];
  appContainer.innerHTML = '';
  
  gameInstance = new Game(puzzle, appContainer, () => {
    // Callback when puzzle is solved
    // Save current score and health
    globalScore = gameInstance!.getScore();
    globalHealth = gameInstance!.getHealth();
    showNextButton();
  }, globalScore, globalHealth);
  
  // Expose for debugging
  (window as any).game = gameInstance;
}

// Show next button after puzzle is solved
function showNextButton() {
  const nextButton = document.createElement('button');
  nextButton.className = 'next-puzzle-button';
  nextButton.textContent = currentPuzzleIndex < puzzles.length - 1 ? 'Next Puzzle' : 'Finish';
  
  nextButton.addEventListener('click', () => {
    currentPuzzleIndex++;
    loadPuzzle(currentPuzzleIndex);
  });
  
  appContainer.appendChild(nextButton);
}

// Show completion screen
function showCompletionScreen() {
  appContainer.innerHTML = '';
  
  const completion = document.createElement('div');
  completion.className = 'completion-screen';
  
  const content = document.createElement('div');
  content.className = 'completion-content';
  
  const title = document.createElement('h1');
  title.className = 'completion-title';
  title.textContent = '🎉 Congratulations!';
  
  const message = document.createElement('p');
  message.className = 'completion-message';
  message.textContent = `You've completed all ${puzzles.length} puzzles!`;
  
  const restartButton = document.createElement('button');
  restartButton.className = 'landing-start-button';
  restartButton.textContent = 'Play Again';
  
  restartButton.addEventListener('click', () => {
    currentPuzzleIndex = 0;
    globalScore = 0;
    globalHealth = 3;
    loadPuzzle(currentPuzzleIndex);
  });
  
  content.appendChild(title);
  content.appendChild(message);
  content.appendChild(restartButton);
  completion.appendChild(content);
  appContainer.appendChild(completion);
}

// Show landing page on load
appContainer.appendChild(createLandingPage());

// Expose puzzle loading for debugging
(window as any).puzzles = puzzles;
(window as any).loadPuzzle = (index: number) => loadPuzzle(index);
