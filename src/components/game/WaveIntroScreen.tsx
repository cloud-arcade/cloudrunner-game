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
  const [phase, setPhase] = useState<'intro' | 'items' | 'loading'>('intro');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  const introduction = WAVE_INTRODUCTIONS[wave];
  const waveName = getWaveName(wave);
  const hasNewItems = !!introduction;
  
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
        const timer = setTimeout(() => {
          setPhase('loading');
        }, 600); // Quick transition to loading
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
      
      {/* Content - scales to fit */}
      <div className="relative z-10 text-center px-4 py-4 sm:py-8 max-w-lg max-h-full flex flex-col justify-center">
        {/* Wave number - always visible */}
        <div className="mb-3 sm:mb-5 md:mb-8">
          <div className="inline-block px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20 mb-2 sm:mb-3 md:mb-4">
            <span className="text-white/60 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest">
              Wave {wave}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
            {waveName}
          </h1>
        </div>
        
        {/* Introduction title */}
        {phase !== 'intro' && hasNewItems && introduction && (
          <div className="mb-3 sm:mb-5 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-md">
              {introduction.title}
            </h2>
          </div>
        )}
        
        {/* Item introductions */}
        {phase === 'items' && introduction && (
          <div className="space-y-2 sm:space-y-3">
            {introduction.items.slice(0, currentItemIndex + 1).map((item, index) => {
              const badge = getTypeBadge(item.type);
              const isLatest = index === currentItemIndex;
              
              return (
                <div 
                  key={item.name}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${getTypeColor(item.type)} shadow-lg ${
                    isLatest ? 'scale-105' : 'opacity-80'
                  }`}
                  style={{ 
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={`${ASSET_PATHS.icons}${item.icon}`}
                      alt={item.name}
                      className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 object-contain drop-shadow-md"
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <span className="font-bold text-sm sm:text-base md:text-lg text-white">{item.name}</span>
                      <span className={`text-[8px] sm:text-[9px] md:text-[10px] px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full ${badge.color} text-white font-bold uppercase`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/90">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Loading dots - shown after items or when no new items */}
        {(phase === 'loading' || (phase === 'items' && introduction && currentItemIndex >= introduction.items.length)) && (
          <div className="mt-3 sm:mt-4 md:mt-6 flex justify-center items-center gap-2">
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
          <div className="mt-4 sm:mt-6 md:mt-8">
            <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 md:gap-4 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full bg-white/10 border border-white/20">
              <div className="flex gap-1">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/20 text-white text-[10px] sm:text-xs md:text-sm font-mono">A</kbd>
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/20 text-white text-[10px] sm:text-xs md:text-sm font-mono">D</kbd>
              </div>
              <span className="text-white/70 text-[10px] sm:text-xs md:text-sm">or Arrow Keys to move</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
