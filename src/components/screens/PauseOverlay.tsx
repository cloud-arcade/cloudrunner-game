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
      <div className="flex flex-col items-center text-center px-6">
        {/* Pause icon */}
        <div className="mb-6 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-8">Paused</h2>
        
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
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
        
        <p className="mt-6 text-white/40 text-sm">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
}
