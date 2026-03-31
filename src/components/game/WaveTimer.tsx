/**
 * Wave Timer Component
 * Clean countdown timer showing time remaining in the current wave
 */

interface WaveTimerProps {
  timeRemaining: number; // milliseconds
  waveDuration: number;  // total wave duration in milliseconds
}

export function WaveTimer({ timeRemaining, waveDuration }: WaveTimerProps) {
  const seconds = Math.ceil(timeRemaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  // Progress percentage (inverted - fills up as time passes)
  const progress = Math.max(0, Math.min(100, ((waveDuration - timeRemaining) / waveDuration) * 100));
  
  // Color changes as time runs low
  const isLow = seconds <= 10;
  const isCritical = seconds <= 5;
  
  const getTimeColor = () => {
    if (isCritical) return 'text-red-400';
    if (isLow) return 'text-yellow-400';
    return 'text-white';
  };
  
  const getBarColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isLow) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };
  
  const formatTime = () => {
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Timer icon */}
      <div className={`transition-colors duration-300 ${isCritical ? 'animate-pulse' : ''}`}>
        <svg 
          className={`w-4 h-4 ${getTimeColor()} transition-colors duration-300`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      {/* Time display */}
      <div className="flex flex-col gap-1 min-w-[60px]">
        <div className={`text-sm font-bold tabular-nums ${getTimeColor()} transition-colors duration-300 ${isCritical ? 'animate-pulse' : ''}`}>
          {formatTime()}
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBarColor()} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
