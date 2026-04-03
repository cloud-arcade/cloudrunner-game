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
      
      <div className="relative z-10 flex flex-col items-center px-3" style={{ maxHeight: '100vh' }}>
        {/* Animated character */}
        <div className="mb-2 sm:mb-3 md:mb-4 animate-bounce-slow">
          <img
            src={`${ASSET_PATHS.icons}character-neutral.png`}
            alt="Loading..."
            className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg"
          />
        </div>
        
        {/* Loading text */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3">Loading...</h2>
        
        {/* Progress bar */}
        <div className="w-32 sm:w-36 md:w-44 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: progress !== undefined ? `${progress}%` : '50%' }}
          />
        </div>
        
        {/* Tip */}
        <p className="mt-2 sm:mt-3 md:mt-4 text-white/50 text-[9px] sm:text-[10px] md:text-xs text-center max-w-xs px-2">
          Tip: Collect mystery boxes to gain special abilities!
        </p>
      </div>
    </div>
  );
}
