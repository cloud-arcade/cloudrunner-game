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
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Scrollable Content Container */}
      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-8 sm:px-6 animate-fade-in">
        {/* Sad character */}
        <div className="mb-4 sm:mb-6">
          <img
            src={`${ASSET_PATHS.icons}character-sad.png`}
            alt="Game Over"
            className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg"
          />
        </div>
        
        {/* Game Over Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
          Game Over
        </h1>
        
        {/* Wave reached */}
        <p className="text-sm sm:text-base text-white/60 mb-4 sm:mb-6">
          Reached Wave {waveReached}
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 w-full max-w-[280px]">
          {/* New High Score Badge */}
          {isNewHighScore && (
            <div className="mb-3 px-4 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold animate-pulse">
              NEW HIGH SCORE!
            </div>
          )}
          
          {/* Score */}
          <div className="mb-3 sm:mb-4">
            <div className="text-white/50 text-xs sm:text-sm uppercase tracking-wider mb-1">
              Final Score
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-3 sm:pt-4 border-t border-white/10">
            <div className="text-white/50 text-xs sm:text-sm uppercase tracking-wider mb-1">
              Best Score
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {formatScore(highScore)}
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-[280px]">
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
    </div>
  );
}
