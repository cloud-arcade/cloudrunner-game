/**
 * Loading Screen Component
 * Shows while game assets are loading
 */

import { ASSET_PATHS } from '../../game/constants';

interface LoadingScreenProps {
  progress?: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Animated character */}
        <div className="mb-3 sm:mb-4 md:mb-6 animate-bounce-slow">
          <img
            src={`${ASSET_PATHS.icons}character-neutral.png`}
            alt="Loading..."
            className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg"
          />
        </div>
        
        {/* Loading text */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Loading...</h2>
        
        {/* Progress bar */}
        <div className="w-36 sm:w-40 md:w-48 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: progress !== undefined ? `${progress}%` : '50%' }}
          />
        </div>
        
        {/* Tip */}
        <p className="mt-3 sm:mt-4 md:mt-6 text-white/50 text-[10px] sm:text-xs md:text-sm text-center max-w-xs px-2">
          Tip: Collect mystery boxes to gain special abilities!
        </p>
      </div>
    </div>
  );
}
