/**
 * Victory Screen Component
 * Shows when player completes all waves
 */

import { ASSET_PATHS } from '../../game/constants';
import { Button } from '../ui/Button';
import { formatScore } from '../../game/utils';

interface VictoryScreenProps {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export function VictoryScreen({
  score,
  highScore,
  onPlayAgain,
  onMainMenu,
}: VictoryScreenProps) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/40 via-black/60 to-black/70 backdrop-blur-sm" />
      
      {/* Content - scales to fit */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-4 sm:py-8 animate-fade-in max-h-full">
        {/* Crown / Celebration */}
        <div className="mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-bounce-slow">
          👑
        </div>
        
        {/* Happy character */}
        <div className="mb-2 sm:mb-4">
          <img
            src={`${ASSET_PATHS.icons}character-happy.png`}
            alt="Victory!"
            className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 drop-shadow-lg"
          />
        </div>
        
        {/* Victory Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-yellow-400 drop-shadow-lg mb-1 sm:mb-2">
          Victory!
        </h1>
        
        <p className="text-xs sm:text-sm md:text-base text-white/70 mb-3 sm:mb-4 md:mb-6">
          You conquered all the storms!
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 w-full max-w-[280px] border border-yellow-500/30">
          {/* Score */}
          <div className="mb-2 sm:mb-3">
            <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
              Final Score
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-2 sm:pt-3 border-t border-white/10">
            <div className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
              Best Score
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {formatScore(highScore)}
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3 w-full max-w-[280px]">
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
