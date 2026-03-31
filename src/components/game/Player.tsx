/**
 * Player Component
 * Renders the player character with mood-based sprites and hit feedback
 */

import { ASSET_PATHS, PLAYER_MOOD_ICONS, GAME_CONSTANTS } from '../../game/constants';
import type { PlayerMood, ActiveEffect } from '../../game/types';

interface PlayerProps {
  x: number;
  mood: PlayerMood;
  hasGoldenHeart: boolean;
  activeEffects?: ActiveEffect[];
}

// Moods that indicate damage/negative state
const DAMAGE_MOODS: PlayerMood[] = ['sad', 'angry', 'worried'];

export function Player({ x, mood, hasGoldenHeart, activeEffects = [] }: PlayerProps) {
  const isHit = DAMAGE_MOODS.includes(mood);
  
  // Check for active shield effects
  const umbrellaEffect = activeEffects.find(e => e.type === 'umbrella');
  const invincibleEffect = activeEffects.find(e => e.type === 'invincible');
  const isShielded = !!umbrellaEffect || !!invincibleEffect;
  const isInvincibleMode = !!invincibleEffect;
  
  // Calculate remaining time for countdown
  const getTimeRemaining = (effect: ActiveEffect | undefined) => {
    if (!effect) return 0;
    return Math.max(0, Math.ceil((effect.expiresAt - Date.now()) / 1000));
  };
  
  const shieldTimeRemaining = umbrellaEffect ? getTimeRemaining(umbrellaEffect) : 0;
  const invincibleTimeRemaining = invincibleEffect ? getTimeRemaining(invincibleEffect) : 0;
  
  // When shielded, always show umbrella icon. Otherwise use mood.
  const iconFile = isShielded 
    ? 'character-umbrella.png' 
    : (PLAYER_MOOD_ICONS[mood] || PLAYER_MOOD_ICONS.neutral);
  
  return (
    <div
      className={`absolute will-change-transform z-30 ${isHit ? 'animate-hit' : ''}`}
      style={{ 
        transform: `translateX(${x}px)`,
        width: '48px',
        height: '48px',
        bottom: `${GAME_CONSTANTS.PLAYER_BOTTOM_OFFSET}px`,
      }}
    >
      {/* Invincible glowing ring effect */}
      {isInvincibleMode && (
        <>
          <div 
            className="absolute -inset-4 rounded-full animate-pulse pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 50%, transparent 70%)',
              animation: 'pulse 0.8s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              border: '2px solid rgba(255,215,0,0.8)',
              boxShadow: '0 0 15px rgba(255,215,0,0.6), inset 0 0 10px rgba(255,215,0,0.3)',
              animation: 'spin 3s linear infinite',
            }}
          />
        </>
      )}
      
      {/* Umbrella shield glow */}
      {umbrellaEffect && !isInvincibleMode && (
        <div 
          className="absolute -inset-2 rounded-full animate-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(100,180,255,0.3) 0%, transparent 70%)',
          }}
        />
      )}
      
      <img
        src={`${ASSET_PATHS.icons}${iconFile}`}
        alt="Player"
        className={`w-full h-full object-contain drop-shadow-lg transition-all duration-100 ${
          isHit ? 'brightness-150 saturate-50' : ''
        } ${isInvincibleMode ? 'brightness-125' : ''}`}
        draggable={false}
      />
      
      {/* Shield countdown timer */}
      {(shieldTimeRemaining > 0 || invincibleTimeRemaining > 0) && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full">
          {isInvincibleMode ? (
            <span className="text-xs font-bold text-yellow-400">{invincibleTimeRemaining}s</span>
          ) : (
            <span className="text-xs font-bold text-blue-300">{shieldTimeRemaining}s</span>
          )}
        </div>
      )}
      
      {hasGoldenHeart && (
        <div className="absolute -top-2 -right-2 w-5 h-5 animate-pulse">
          <img
            src={`${ASSET_PATHS.icons}gold-heart.png`}
            alt="Golden Heart"
            className="w-full h-full"
          />
        </div>
      )}
      
      {/* Hit flash effect */}
      {isHit && (
        <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping pointer-events-none" />
      )}
    </div>
  );
}
