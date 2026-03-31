/**
 * Wave Transition Component
 * Simple diagonal swipe from right to left revealing the new wave background
 * Diagonal edge goes from top-right to bottom-left
 * Sits behind ground layer for clean visual
 */

import { useState, useEffect } from 'react';
import { ASSET_PATHS } from '../../game/constants';

// Maximum wave-specific background number
const MAX_WAVE_BACKGROUND = 7;

function getWaveBackground(wave: number): string {
  const bgNumber = Math.min(Math.max(1, wave), MAX_WAVE_BACKGROUND);
  return `${ASSET_PATHS.background}wave-${bgNumber}.png`;
}

interface WaveTransitionProps {
  fromWave: number;
  toWave: number;
  onComplete: () => void;
}

export function WaveTransition({ fromWave, onComplete }: WaveTransitionProps) {
  const [progress, setProgress] = useState(0); // 0 to 100
  
  const oldBackground = getWaveBackground(fromWave);
  
  useEffect(() => {
    // Smooth animation from 0 to 100 over 1.2 seconds
    const duration = 1200;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Ease-in-out for smooth feel
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const newProgress = eased * 100;
      setProgress(newProgress);
      
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }, [onComplete]);
  
  // Calculate diagonal clip path
  // Old background shrinks from right to left with diagonal edge (top-right to bottom-left)
  const rightEdgeTop = 100 - progress; // Top of diagonal
  const rightEdgeBottom = 100 - progress - 12; // Bottom of diagonal (12% offset for angle)
  
  // Don't render if complete
  if (progress >= 100) return null;
  
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      {/* Old background sliding away to the left with diagonal edge */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${oldBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          clipPath: `polygon(0 0, ${rightEdgeTop}% 0, ${rightEdgeBottom}% 100%, 0 100%)`,
        }}
      >
        {/* Edge highlight gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to left, rgba(255,255,255,0.3) 0%, transparent 3%)`,
          }}
        />
      </div>
    </div>
  );
}
