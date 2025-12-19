/**
 * Snowfall effect using canvas
 */

export function createSnowfall(container: HTMLElement): void {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9998';
  
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
  }
  
  const snowflakes: Snowflake[] = [];
  const numberOfSnowflakes = 150;
  
  // Create snowflakes
  for (let i = 0; i < numberOfSnowflakes; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      wind: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.6 + 0.4
    });
  }
  
  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snowflakes.forEach(flake => {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.fill();
      
      // Update position
      flake.y += flake.speed;
      flake.x += flake.wind;
      
      // Reset if snowflake goes off screen
      if (flake.y > canvas.height) {
        flake.y = -10;
        flake.x = Math.random() * canvas.width;
      }
      
      if (flake.x > canvas.width) {
        flake.x = 0;
      } else if (flake.x < 0) {
        flake.x = canvas.width;
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
