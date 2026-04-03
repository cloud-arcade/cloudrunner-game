/**
 * Game Screen Component
 * Main gameplay area with game canvas and bottom control bar
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { ASSET_PATHS, GAME_CONSTANTS } from '../../game/constants';
import type { GameEngineState, WaveData, WaveConfig } from '../../game/types';
import { Player, FallingItem, GameHUD, AbilityBar, WaveIntroScreen, WaveTransition } from '../game';
import { formatScore } from '../../game/utils';

// Maximum wave-specific background number available (wave-1 through wave-7)
const MAX_WAVE_BACKGROUND = 7;

// Get the background image for the current wave
function getWaveBackground(wave: number): string {
  // Use wave-specific backgrounds (wave-1 through wave-7)
  // Beyond wave 7, continue using wave-7 (nighttime)
  const bgNumber = Math.min(Math.max(1, wave), MAX_WAVE_BACKGROUND);
  return `${ASSET_PATHS.background}wave-${bgNumber}.png`;
}

// Calculate night overlay opacity based on wave (progressive darkness)
function getNightOverlayOpacity(wave: number): number {
  // Wave 1: 0% (full day)
  // Wave 2-6: gradual increase
  // Wave 7+: 35% (night time, not too dark)
  if (wave <= 1) return 0;
  if (wave >= 7) return 0.35;
  // Linear interpolation from wave 2 (0.05) to wave 6 (0.28)
  return 0.05 + ((wave - 2) / 5) * 0.3;
}

interface GameScreenProps {
  state: GameEngineState;
  waveData: WaveData | null;
  currentWaveConfig: WaveConfig | null;
  onPause: () => void;
  onUseAbility: (slot: number) => void;
  onSwapAbilities: (from: number, to: number) => void;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onTouchStart: (x: number) => void;
  onTouchMove: (x: number) => void;
  onTouchEnd: () => void;
  onResize: (width: number, height: number) => void;
}

export function GameScreen({
  state,
  waveData,
  currentWaveConfig,
  onPause,
  onUseAbility,
  onSwapAbilities,
  onKeyDown,
  onKeyUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onResize,
}: GameScreenProps) {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const [showTransition, setShowTransition] = useState(false);
  const [transitionWaves, setTransitionWaves] = useState({ from: 0, to: 0 });
  const prevWaveRef = useRef(0);
  
  // Memoize background based on wave to avoid flicker
  const currentBackground = useMemo(() => {
    return getWaveBackground(Math.max(1, state.currentWave));
  }, [state.currentWave]);
  
  // Calculate night overlay opacity for current wave
  const nightOverlayOpacity = useMemo(() => {
    return getNightOverlayOpacity(state.currentWave);
  }, [state.currentWave]);
  
  // Wave duration for timer display
  const waveDuration = useMemo(() => {
    if (!waveData) return 40000; // default
    return waveData.config.waveDuration * GAME_CONSTANTS.WAVE_DURATION_MULTIPLIER;
  }, [waveData]);
  
  // Handle wave transitions
  useEffect(() => {
    // Trigger transition when wave changes (but not on initial load or wave 1)
    if (state.currentWave > 1 && prevWaveRef.current > 0 && state.currentWave !== prevWaveRef.current) {
      // Check if backgrounds are different
      const prevBg = getWaveBackground(prevWaveRef.current);
      const newBg = getWaveBackground(state.currentWave);
      if (prevBg !== newBg) {
        setTransitionWaves({ from: prevWaveRef.current, to: state.currentWave });
        setShowTransition(true);
      }
    }
    prevWaveRef.current = state.currentWave;
  }, [state.currentWave]);
  
  // Handle resize of game area - use ref for callback to break re-render cycle
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;
  
  useEffect(() => {
    const handleResize = () => {
      if (gameAreaRef.current) {
        const { width, height } = gameAreaRef.current.getBoundingClientRect();
        
        // Only update if size actually changed (avoid infinite loops)
        if (lastSizeRef.current.width !== width || lastSizeRef.current.height !== height) {
          lastSizeRef.current = { width, height };
          onResizeRef.current(width, height);
          setContainerHeight(height);
        }
      }
    };
    
    // Initial measurement
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Also observe for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (gameAreaRef.current) {
      resizeObserver.observe(gameAreaRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []); // Empty deps - we use refs for the callback
  
  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'A', 'D', 'w', 's', 'W', 'S', 'Escape', '1', '2', '3', '4', '5'];
      if (keys.includes(e.key)) {
        e.preventDefault();
        onKeyDown(e.key);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      onKeyUp(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyDown, onKeyUp]);
  
  // Touch input
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only handle touch if it's not on an interactive element (buttons, etc.)
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return; // Let button handle it
    }
    
    if (e.touches.length > 0) {
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.touches[0].clientX - rect.left;
        onTouchStart(x);
      }
    }
  }, [onTouchStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.touches[0].clientX - rect.left;
        onTouchMove(x);
      }
    }
  }, [onTouchMove]);
  
  return (
    <div className="absolute inset-0 bg-zinc-900">
      {/* Full-screen Game Area */}
      <div 
        ref={gameAreaRef}
        className="absolute inset-0 touch-none select-none overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {/* Wave-specific Sky Background - full screen */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: `url(${currentBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Progressive night overlay - gets darker as waves progress */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            backgroundColor: `rgba(10, 15, 30, ${nightOverlayOpacity})`,
          }}
        />
        
        {/* Ground layer at the bottom - simple, clean */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none"
          style={{
            height: '220px',
            backgroundImage: `url(${ASSET_PATHS.background}ground-only.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Frozen overlay */}
        {state.isFrozen && (
          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] z-30 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="text-4xl font-black text-blue-200 animate-pulse tracking-wider">
                ❄️ FROZEN ❄️
              </div>
            </div>
          </div>
        )}
        
        {/* HUD */}
        <GameHUD
          score={state.score}
          wave={state.currentWave}
          totalWaves={state.totalWaves}
          lives={state.lives}
          maxLives={state.maxLives}
          hasGoldenHeart={state.player.hasGoldenHeart}
          waveTimeRemaining={state.waveTimeRemaining}
          waveDuration={waveDuration}
          onPause={onPause}
        />
        
        {/* Falling items */}
        {state.fallingItems.map(item => (
          <FallingItem
            key={item.id}
            item={item}
            itemConfig={waveData?.itemTypes[item.type]}
            containerHeight={containerHeight}
          />
        ))}
        
        {/* Player - high z-index to be above HUD */}
        <Player
          x={state.player.x}
          mood={state.player.mood}
          hasGoldenHeart={state.player.hasGoldenHeart}
          activeEffects={state.activeEffects}
        />
        
        {/* Wave intro screen with detailed introductions */}
        {state.phase === 'waveIntro' && (
          <WaveIntroScreen wave={state.currentWave} />
        )}
        
        {/* Wave complete banner - brief celebration */}
        {state.phase === 'waveComplete' && currentWaveConfig && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40">
            <div className="text-center">
              <div className="text-5xl font-black text-green-400 drop-shadow-lg mb-4">
                Wave Complete!
              </div>
              <div className="text-2xl font-semibold text-yellow-400">
                +{currentWaveConfig.waveBonus} Bonus Points!
              </div>
            </div>
          </div>
        )}
        
        {/* Wave transition slider - shown between waves with different backgrounds */}
        {showTransition && transitionWaves.from > 0 && (
          <WaveTransition 
            fromWave={transitionWaves.from}
            toWave={transitionWaves.to}
            onComplete={() => setShowTransition(false)}
          />
        )}
        
        {/* Bottom Control Bar - Overlaid on ground */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-20"
          style={{ height: `${GAME_CONSTANTS.BOTTOM_HUD_HEIGHT}px` }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {/* Subtle gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
              {/* Wave Info - Left */}
              <div className="hidden sm:flex flex-col items-start min-w-[100px]">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Wave</span>
                <span className="text-lg font-bold text-white drop-shadow-md">
                  {state.currentWave}
                </span>
              </div>
              
              {/* Abilities - Center */}
              <div className="flex-1 flex justify-center">
                <AbilityBar
                  abilities={state.storedAbilities}
                  abilityConfigs={waveData?.abilities}
                  maxSlots={GAME_CONSTANTS.MAX_STORED_ABILITIES}
                  onUseAbility={onUseAbility}
                  onSwapAbilities={onSwapAbilities}
                />
              </div>
              
              {/* Score - Right */}
              <div className="hidden sm:flex flex-col items-end min-w-[100px]">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Score</span>
                <span className="text-lg font-bold text-primary tabular-nums drop-shadow-md">
                  {formatScore(state.score)}
                </span>
              </div>
            </div>
            
            {/* Mobile compact info */}
            <div className="sm:hidden flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-white/70">Wave {state.currentWave}</span>
              <span className="text-xs font-semibold text-primary">{formatScore(state.score)}</span>
            </div>
            
            {/* Instructions hint */}
            <div className="text-center mt-2">
              <span className="text-[10px] text-white/40">
                Click or drag abilities • Arrow keys or A/D to move • ESC to pause
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
