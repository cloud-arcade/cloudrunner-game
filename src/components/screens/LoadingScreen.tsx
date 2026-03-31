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
      className="absolute inset-0 flex flex-col items-center justify-center z-50"
      style={{
        backgroundImage: `url(${ASSET_PATHS.background}background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated character */}
        <div className="mb-6 animate-bounce-slow">
          <img
            src={`${ASSET_PATHS.icons}character-neutral.png`}
            alt="Loading..."
            className="w-16 h-16 drop-shadow-lg"
          />
        </div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
        
        {/* Progress bar */}
        <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: progress !== undefined ? `${progress}%` : '50%' }}
          />
        </div>
        
        {/* Tip */}
        <p className="mt-6 text-white/50 text-sm text-center max-w-xs">
          Tip: Collect mystery boxes to gain special abilities!
        </p>
      </div>
    </div>
  );
}
