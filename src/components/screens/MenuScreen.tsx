/**
 * Menu Screen Component
 * Main menu with game title and start button
 */

import { ASSET_PATHS } from '../../game/constants';
import { Button } from '../ui/Button';

interface MenuScreenProps {
  onStartGame: () => void;
  highScore: number;
}

export function MenuScreen({ onStartGame, highScore }: MenuScreenProps) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}wave-1.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Scrollable Content Container */}
      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-8 sm:px-6">
        {/* Logo/Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-lg tracking-tight">
            Cloud Runner
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-white/70">
            Dodge the rain. Collect power-ups. Survive!
          </p>
        </div>
        
        {/* Character Preview */}
        <div className="mb-6 sm:mb-8 animate-bounce-slow">
          <img
            src={`${ASSET_PATHS.icons}character-neutral.png`}
            alt="Cloud Runner"
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-2xl"
          />
        </div>
        
        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-4 sm:mb-6 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg">
            <span className="text-white/60 text-xs sm:text-sm">High Score: </span>
            <span className="text-white font-bold text-base sm:text-lg">{highScore.toLocaleString()}</span>
          </div>
        )}
        
        {/* Start Button */}
        <Button
          onClick={onStartGame}
          variant="primary"
          size="large"
          className="min-w-[180px] sm:min-w-[200px] text-base sm:text-lg"
        >
          Start Game
        </Button>
        
        {/* Instructions */}
        <div className="mt-6 sm:mt-8 text-white/50 text-xs sm:text-sm max-w-xs px-2">
          <p className="mb-2">
            <strong className="text-white/70">Controls:</strong>
          </p>
          <p>Arrow keys or A/D to move</p>
          <p>Touch and drag on mobile</p>
          <p>1-5 keys to use abilities</p>
        </div>
        </div>
      </div>
    </div>
  );
}
