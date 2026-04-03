/**
 * Game Over Screen Component
 * Shows final score and options to play again
 */

import { ASSET_PATHS } from '../../game/constants';
import { Button } from '../ui/Button';
import { formatScore } from '../../game/utils';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  waveReached: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function GameOverScreen({
  score,
  highScore,
  waveReached,
  isNewHighScore,
  onPlayAgain,
  onMainMenu,
}: GameOverScreenProps) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Content - scales to fit viewport */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 py-2 animate-fade-in w-full" style={{ maxHeight: '100vh' }}>
        {/* Sad character */}
        <div className="mb-1 sm:mb-2">
          <img
            src={`${ASSET_PATHS.icons}character-sad.png`}
            alt="Game Over"
            className="w-10 h-10 sm:w-12 md:w-16 sm:h-12 md:h-16 drop-shadow-lg"
          />
        </div>
        
        {/* Game Over Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg mb-0.5 sm:mb-1">
          Game Over
        </h1>
        
        {/* Wave reached */}
        <p className="text-[10px] sm:text-xs md:text-sm text-white/60 mb-2 sm:mb-3">
          Reached Wave {waveReached}
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 w-full max-w-[260px]">
          {/* New High Score Badge */}
          {isNewHighScore && (
            <div className="mb-1 sm:mb-2 px-2 sm:px-3 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] sm:text-xs font-semibold animate-pulse">
              NEW HIGH SCORE!
            </div>
          )}
          
          {/* Score */}
          <div className="mb-1.5 sm:mb-2">
            <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">
              Final Score
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-1.5 sm:pt-2 border-t border-white/10">
            <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">
              Best Score
            </div>
            <div className="text-base sm:text-lg md:text-xl font-bold text-primary">
              {formatScore(highScore)}
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 w-full max-w-[260px]">
          <Button
            onClick={onPlayAgain}
            variant="primary"
            size="large"
            className="w-full"
          >
            Play Again
          </Button>
          <Button
            onClick={onMainMenu}
            variant="secondary"
            size="medium"
            className="w-full"
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
