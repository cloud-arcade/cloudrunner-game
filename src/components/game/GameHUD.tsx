/**
 * Game HUD Component
 * Displays score, wave, and other game info
 */

import { HeartsDisplay } from './HeartsDisplay';
import { WaveTimer } from './WaveTimer';
import { formatScore } from '../../game/utils';

interface GameHUDProps {
  score: number;
  wave: number;
  totalWaves: number;
  lives: number;
  maxLives: number;
  hasGoldenHeart: boolean;
  waveTimeRemaining: number;
  waveDuration: number;
  onPause: () => void;
}

export function GameHUD({ 
  score, 
  wave, 
  totalWaves, 
  lives, 
  maxLives, 
  hasGoldenHeart,
  waveTimeRemaining,
  waveDuration,
  onPause 
}: GameHUDProps) {
  return (
    <div 
      className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-10"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Left side - Wave info & Timer */}
      <div className="flex flex-col gap-2">
        <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
          <span className="text-xs text-white/60 uppercase tracking-wider">Wave</span>
          <span className="ml-2 text-lg font-bold text-white">
            {totalWaves === Infinity ? wave : `${wave}/${totalWaves}`}
          </span>
        </div>
        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg">
          <WaveTimer timeRemaining={waveTimeRemaining} waveDuration={waveDuration} />
        </div>
      </div>
      
      {/* Center - Score */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="text-xs text-white/60 uppercase tracking-wider">Score</div>
        <div className="text-2xl font-bold text-white tabular-nums">
          {formatScore(score)}
        </div>
      </div>
      
      {/* Right side - Lives & Pause */}
      <div className="flex items-center gap-3">
        <HeartsDisplay 
          lives={lives} 
          maxLives={maxLives} 
          hasGoldenHeart={hasGoldenHeart} 
        />
        <button
          onClick={onPause}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPause();
          }}
          className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg hover:bg-black/60 transition-colors"
          aria-label="Pause"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
