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
      
      {/* Content - scales to fit viewport */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 py-2 animate-fade-in w-full" style={{ maxHeight: '100vh' }}>
        {/* Crown / Celebration */}
        <div className="mb-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl animate-bounce-slow">
          👑
        </div>
        
        {/* Happy character */}
        <div className="mb-1 sm:mb-2">
          <img
            src={`${ASSET_PATHS.icons}character-happy.png`}
            alt="Victory!"
            className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 drop-shadow-lg"
          />
        </div>
        
        {/* Victory Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-yellow-400 drop-shadow-lg mb-0.5 sm:mb-1">
          Victory!
        </h1>
        
        <p className="text-[10px] sm:text-xs md:text-sm text-white/70 mb-2 sm:mb-3">
          You conquered all the storms!
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 w-full max-w-[260px] border border-yellow-500/30">
          {/* Score */}
          <div className="mb-1.5 sm:mb-2">
            <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">
              Final Score
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-400">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-1.5 sm:pt-2 border-t border-white/10">
            <div className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5">
              Best Score
            </div>
            <div className="text-base sm:text-lg md:text-xl font-bold text-white">
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
