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
      
      {/* Content - scales to fit viewport */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 py-2 w-full" style={{ maxHeight: '100vh' }}>
        {/* Logo/Title */}
        <div className="mb-2 sm:mb-3 md:mb-5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg tracking-tight">
            Cloud Runner
          </h1>
          <p className="mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base text-white/70">
            Dodge the rain. Collect power-ups. Survive!
          </p>
        </div>
        
        {/* Character Preview */}
        <div className="mb-2 sm:mb-3 md:mb-5 animate-bounce-slow">
          <img
            src={`${ASSET_PATHS.icons}character-neutral.png`}
            alt="Cloud Runner"
            className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 drop-shadow-2xl"
          />
        </div>
        
        {/* High Score */}
        {highScore > 0 && (
          <div className="mb-1.5 sm:mb-2 md:mb-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/40 backdrop-blur-sm rounded-lg">
            <span className="text-white/60 text-[9px] sm:text-[10px] md:text-xs">High Score: </span>
            <span className="text-white font-bold text-xs sm:text-sm md:text-base">{highScore.toLocaleString()}</span>
          </div>
        )}
        
        {/* Start Button */}
        <Button
          onClick={onStartGame}
          variant="primary"
          size="large"
          className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] text-xs sm:text-sm md:text-base"
        >
          Start Game
        </Button>
        
        {/* Instructions */}
        <div className="mt-2 sm:mt-3 md:mt-5 text-white/50 text-[9px] sm:text-[10px] md:text-xs max-w-xs px-2">
          <p className="mb-2">
            <strong className="text-white/70">Controls:</strong>
          </p>
          <p className="hidden sm:block">Arrow keys or A/D to move</p>
          <p className="hidden sm:block">1-5 keys to use abilities</p>
          <p className="block sm:hidden">Drag left/right to move</p>
          <p className="block sm:hidden">Tap abilities to use them</p>
        </div>
      </div>
    </div>
  );
}
