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
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/40 via-black/60 to-black/70 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in">
        {/* Crown / Celebration */}
        <div className="mb-4 text-6xl animate-bounce-slow">
          👑
        </div>
        
        {/* Happy character */}
        <div className="mb-6">
          <img
            src={`${ASSET_PATHS.icons}character-happy.png`}
            alt="Victory!"
            className="w-24 h-24 drop-shadow-lg"
          />
        </div>
        
        {/* Victory Title */}
        <h1 className="text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-lg mb-2">
          Victory!
        </h1>
        
        <p className="text-white/70 mb-8">
          You conquered all the storms!
        </p>
        
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 min-w-[250px] border border-yellow-500/30">
          {/* Score */}
          <div className="mb-4">
            <div className="text-white/50 text-sm uppercase tracking-wider mb-1">
              Final Score
            </div>
            <div className="text-4xl font-black text-yellow-400">
              {formatScore(score)}
            </div>
          </div>
          
          {/* High Score */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-white/50 text-sm uppercase tracking-wider mb-1">
              Best Score
            </div>
            <div className="text-2xl font-bold text-white">
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
