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
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/40 via-black/60 to-black/70 backdrop-blur-sm" />
      
      {/* Scrollable Content Container */}
      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-8 sm:px-6 animate-fade-in">
        {/* Crown / Celebration */}
        <div className="mb-3 text-4xl sm:text-6xl animate-bounce-slow">
          👑
        </div>
        
        {/* Happy character */}
        <div className="mb-4 sm:mb-6">
          <img
            src={`${ASSET_PATHS.icons}character-happy.png`}
            alt="Victory!"
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg"
          />
        </div>
        
        {/* Victory Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-lg mb-2">
          Victory!
        </h1>
        
        <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6">
          You conquered all the storms!
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 w-full max-w-[280px] border border-yellow-500/30">
          {/* Score */}
          <div className="mb-3 sm:mb-4">
            <div className="text-white/50 text-xs sm:text-sm uppercase tracking-wider mb-1">
              Final Score
            </div>
            <div className="text-3xl sm:text-4xl font-black text-yellow-400">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-3 sm:pt-4 border-t border-white/10">
            <div className="text-white/50 text-xs sm:text-sm uppercase tracking-wider mb-1">
              Best Score
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
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
