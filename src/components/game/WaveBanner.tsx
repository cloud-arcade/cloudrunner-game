/**
 * Wave Banner Component
 * Shows wave intro/completion messages
 */

interface WaveBannerProps {
  wave: number;
  name: string;
  type: 'intro' | 'complete';
}

export function WaveBanner({ wave, name, type }: WaveBannerProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 animate-fade-in">
      <div className="text-center animate-scale-in">
        <div className="text-6xl font-black text-white drop-shadow-lg mb-2">
          {type === 'intro' ? `Wave ${wave}` : 'Wave Complete!'}
        </div>
        <div className="text-2xl font-semibold text-white/80">
          {type === 'intro' ? name : `+${wave * 100} bonus`}
        </div>
      </div>
    </div>
  );
}
