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
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in">
        {/* Sad character */}
        <div className="mb-6">
          <img
            src={`${ASSET_PATHS.icons}character-sad.png`}
            alt="Game Over"
            className="w-20 h-20 drop-shadow-lg"
          />
        </div>
        
        {/* Game Over Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
          Game Over
        </h1>
        
        {/* Wave reached */}
        <p className="text-white/60 mb-8">
          Reached Wave {waveReached}
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 min-w-[250px]">
          {/* New High Score Badge */}
          {isNewHighScore && (
            <div className="mb-3 px-4 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold animate-pulse">
              NEW HIGH SCORE!
            </div>
          )}
          
          {/* Score */}
          <div className="mb-4">
            <div className="text-white/50 text-sm uppercase tracking-wider mb-1">
              Final Score
            </div>
            <div className="text-4xl font-black text-white">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-white/50 text-sm uppercase tracking-wider mb-1">
              Best Score
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatScore(highScore)}
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-[250px]">
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
