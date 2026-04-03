/**
 * Wave Introduction Screen
 * Shows new game elements and tips when they're introduced
 */

import { useEffect, useState } from 'react';
import { ASSET_PATHS } from '../../game/constants';

interface WaveIntroduction {
  title: string;
  items: IntroItem[];
}

interface IntroItem {
  icon: string;
  name: string;
  description: string;
  type: 'collect' | 'avoid' | 'special';
}

// Define what gets introduced at each wave
// Staggered introduction:
// Wave 1: Rain only
// Wave 2: Power Crystals
// Wave 3: Fake Crystals
// Wave 4: Hearts
// Wave 5: Umbrella + Mystery Boxes
// Wave 6: Clear Skies + Golden Hearts
// Wave 7: Acid Rain
// Wave 8: Invincible (legendary)
const WAVE_INTRODUCTIONS: Record<number, WaveIntroduction> = {
  1: {
    title: 'Welcome to Cloud Runner!',
    items: [
      {
        icon: 'drop.png',
        name: 'Raindrops',
        description: 'Avoid these! Each hit costs 1 life.',
        type: 'avoid',
      },
    ],
  },
  2: {
    title: 'Power Crystals!',
    items: [
      {
        icon: 'power.png',
        name: 'Power Crystals',
        description: 'Collect for +25 points! These are safe.',
        type: 'collect',
      },
    ],
  },
  3: {
    title: 'Watch Out for Fakes!',
    items: [
      {
        icon: 'trap-power.png',
        name: 'Fake Crystals',
        description: 'Looks real but damages you! Slightly darker.',
        type: 'avoid',
      },
    ],
  },
  4: {
    title: 'Healing Available!',
    items: [
      {
        icon: 'heart-full.png',
        name: 'Hearts',
        description: 'Collect to restore health! +10 points too.',
        type: 'collect',
      },
    ],
  },
  5: {
    title: 'Special Abilities!',
    items: [
      {
        icon: 'umbrella.png',
        name: 'Umbrella Shield',
        description: 'Become invincible for 8 seconds! Watch the countdown.',
        type: 'special',
      },
      {
        icon: 'random-ability.png',
        name: 'Mystery Box',
        description: 'Grants random abilities based on current wave!',
        type: 'special',
      },
      {
        icon: 'freeze.png',
        name: 'Freeze',
        description: 'Common ability - freezes all items for 3 seconds.',
        type: 'special',
      },
    ],
  },
  6: {
    title: 'More Rare Abilities!',
    items: [
      {
        icon: 'sunny.png',
        name: 'Clear Skies',
        description: 'Rare! Clears ALL items from screen instantly!',
        type: 'special',
      },
      {
        icon: 'doggy-life.png',
        name: 'Golden Heart',
        description: 'Very Rare! Protects from one death. Save it!',
        type: 'special',
      },
    ],
  },
  7: {
    title: 'DANGER: Acid Rain!',
    items: [
      {
        icon: 'acid-rain.png',
        name: 'Acid Rain',
        description: 'DEADLY! Instant death on contact. AVOID!',
        type: 'avoid',
      },
    ],
  },
  8: {
    title: 'LEGENDARY: Invincible!',
    items: [
      {
        icon: 'character-happy.png',
        name: 'Invincible Mode',
        description: 'LEGENDARY! Glowing aura, power crystals attracted to you!',
        type: 'special',
      },
    ],
  },
};

// Get wave name based on wave number
function getWaveName(wave: number): string {
  const names = [
    'Gentle Drizzle', 'Light Rain', 'Steady Showers', 'Heavy Rain', 'Downpour',
    'Torrent', 'Storm', 'Thunder Storm', 'Monsoon', 'Typhoon',
    'Hurricane', 'Cyclone', 'Tempest', 'Deluge', 'Cataclysm',
  ];
  if (wave <= names.length) return names[wave - 1];
  return `${names[names.length - 1]} ${wave - names.length + 1}`;
}

interface WaveIntroScreenProps {
  wave: number;
  onComplete?: () => void;
}

export function WaveIntroScreen({ wave, onComplete }: WaveIntroScreenProps) {
  const introduction = WAVE_INTRODUCTIONS[wave];
  const waveName = getWaveName(wave);
  const hasNewItems = !!introduction;
  
  const [phase, setPhase] = useState<'intro' | 'items' | 'loading'>('intro');
  const [currentItemIndex, setCurrentItemIndex] = useState(introduction ? 1 : 0);
  
  // Auto-advance through phases with snappy timings
  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        if (hasNewItems) {
          setPhase('items');
        } else {
          setPhase('loading');
        }
      }, hasNewItems ? 1500 : 1800);
      return () => clearTimeout(timer);
    }
    
    if (phase === 'items' && introduction) {
      if (currentItemIndex < introduction.items.length) {
        const timer = setTimeout(() => {
          setCurrentItemIndex(prev => prev + 1);
        }, 2200); // Time per item
        return () => clearTimeout(timer);
      } else {
        // After all items shown, wait longer before transitioning
        const timer = setTimeout(() => {
          setPhase('loading');
        }, 2000); // Extended time to keep items visible with "Starting wave"
        return () => clearTimeout(timer);
      }
    }
    
    if (phase === 'loading') {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 800); // Brief loading display
      return () => clearTimeout(timer);
    }
  }, [phase, currentItemIndex, introduction, hasNewItems, onComplete]);
  
  const getTypeColor = (type: IntroItem['type']) => {
    switch (type) {
      case 'collect': return 'from-green-500 to-emerald-600';
      case 'avoid': return 'from-red-500 to-rose-600';
      case 'special': return 'from-purple-500 to-indigo-600';
    }
  };
  
  const getTypeBadge = (type: IntroItem['type']) => {
    switch (type) {
      case 'collect': return { text: 'COLLECT', color: 'bg-green-500' };
      case 'avoid': return { text: 'AVOID', color: 'bg-red-500' };
      case 'special': return { text: 'ABILITY', color: 'bg-purple-500' };
    }
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      {/* Solid background - no blur or pulse */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95" />
      
      {/* Content - scales to fit viewport */}
      <div className="relative z-10 text-center px-4 sm:px-3 py-2 mx-4 sm:mx-auto max-w-sm sm:max-w-md md:max-w-lg w-full flex flex-col justify-center" style={{ maxHeight: '100vh' }}>
        {/* Wave number - always visible */}
        <div className="mb-2 sm:mb-3 md:mb-5">
          <div className="inline-block px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full bg-white/10 border border-white/20 mb-1.5 sm:mb-2 md:mb-3">
            <span className="text-white/60 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest">
              Wave {wave}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
            {waveName}
          </h1>
        </div>
        
        {/* Introduction title */}
        {hasNewItems && introduction && (
          <div className="mb-2 sm:mb-3 md:mb-5">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 drop-shadow-md">
              {introduction.title}
            </h2>
          </div>
        )}
        
        {/* Item introductions - visible in all phases */}
        {introduction && currentItemIndex > 0 && (
          <div className="space-y-1.5 sm:space-y-2">
            {introduction.items.slice(0, currentItemIndex).map((item, index) => {
              const badge = getTypeBadge(item.type);
              const isLatest = index === currentItemIndex - 1;
              
              return (
                <div 
                  key={item.name}
                  className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gradient-to-r ${getTypeColor(item.type)} shadow-lg ${
                    isLatest && phase === 'items' ? 'scale-105' : 'opacity-80'
                  }`}
                  style={{ 
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-md sm:rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={`${ASSET_PATHS.icons}${item.icon}`}
                      alt={item.name}
                      className="w-7 h-7 sm:w-8 md:w-10 sm:h-8 md:h-10 object-contain drop-shadow-md"
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                      <span className="font-bold text-xs sm:text-sm md:text-base text-white">{item.name}</span>
                      <span className={`text-[7px] sm:text-[8px] md:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full ${badge.color} text-white font-bold uppercase`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-white/90">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Loading dots - shown after items or when no new items */}
        {(phase === 'loading' || (phase === 'items' && introduction && currentItemIndex >= introduction.items.length)) && (
          <div className="mt-2 sm:mt-3 md:mt-4 flex justify-center items-center gap-2">
            <span className="text-white/60 text-xs sm:text-sm">Starting wave</span>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div 
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Controls hint for wave 1 */}
        {wave === 1 && phase === 'intro' && (
          <div className="mt-2 sm:mt-3 md:mt-5">
            <div className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20">
              {/* Desktop controls */}
              <div className="hidden sm:flex gap-1">
                <kbd className="px-1 sm:px-1.5 py-0.5 rounded bg-white/20 text-white text-[9px] sm:text-[10px] md:text-xs font-mono">A</kbd>
                <kbd className="px-1 sm:px-1.5 py-0.5 rounded bg-white/20 text-white text-[9px] sm:text-[10px] md:text-xs font-mono">D</kbd>
              </div>
              <span className="hidden sm:inline text-white/70 text-[9px] sm:text-[10px] md:text-xs">or Arrow Keys to move</span>
              {/* Mobile controls */}
              <span className="inline sm:hidden text-white/70 text-[9px]">Drag screen left/right to move</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
