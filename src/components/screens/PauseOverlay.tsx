/**
 * Pause Overlay Component
 * Displayed when game is paused
 */

import { Button } from '../ui/Button';

interface PauseOverlayProps {
  onResume: () => void;
  onMainMenu: () => void;
}

export function PauseOverlay({ onResume, onMainMenu }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-40 animate-fade-in">
      <div className="flex flex-col items-center text-center px-3" style={{ maxHeight: '100vh' }}>
        {/* Pause icon */}
        <div className="mb-2 sm:mb-3 md:mb-4 w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Paused</h2>
        
        <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 w-full max-w-[180px]">
          <Button
            onClick={onResume}
            variant="primary"
            size="large"
            className="w-full"
          >
            Resume
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
        
        <p className="mt-2 sm:mt-3 md:mt-4 text-white/40 text-[10px] sm:text-xs">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
}
