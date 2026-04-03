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
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}wave-1.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Content - scales to fit */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-4 sm:py-8 max-h-full">
        {/* Logo/Title */}
        <div className="mb-3 sm:mb-5 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg tracking-tight">
            Cloud Runner
          </h1>
          <p className="mt-1.5 sm:mt-2 md:mt-3 text-sm sm:text-base md:text-lg text-white/70">
            Dodge the rain. Collect power-ups. Survive!
          </p>
        </div>
        
        {/* Character Preview */}
        <div className="mb-3 sm:mb-5 md:mb-8 animate-bounce-slow">
          <img
            src={`${ASSET_PATHS.icons}character-neutral.png`}
            alt="Cloud Runner"
            className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 drop-shadow-2xl"
          />
        </div>
        
        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-2 sm:mb-3 md:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/40 backdrop-blur-sm rounded-lg">
            <span className="text-white/60 text-[10px] sm:text-xs md:text-sm">High Score: </span>
            <span className="text-white font-bold text-sm sm:text-base md:text-lg">{highScore.toLocaleString()}</span>
          </div>
        )}
        
        {/* Start Button */}
        <Button
          onClick={onStartGame}
          variant="primary"
          size="large"
          className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] text-sm sm:text-base md:text-lg"
        >
          Start Game
        </Button>
        
        {/* Instructions */}
        <div className="mt-3 sm:mt-5 md:mt-8 text-white/50 text-[10px] sm:text-xs md:text-sm max-w-xs px-2">
          <p className="mb-2">
            <strong className="text-white/70">Controls:</strong>
          </p>
          <p>Arrow keys or A/D to move</p>
          <p>Touch and drag on mobile</p>
          <p>1-5 keys to use abilities</p>
        </div>
      </div>
    </div>
  );
}
