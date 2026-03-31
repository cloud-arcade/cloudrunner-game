/**
 * Game Engine Hook
 * Core game loop and state management with smooth physics
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  GameEngineState,
  FallingItem,
  WaveData,
  WaveConfig,
  PlayerMood,
  GameEvent,
} from '../game/types';
import {
  GAME_CONSTANTS,
  ASSET_PATHS,
} from '../game/constants';
import {
  generateId,
  rollItemType,
  checkCollisionSwept,
  clamp,
  getRandomSpawnX,
  getRandomAbility,
  calculateFallDuration,
} from '../game/utils';

interface UseGameEngineOptions {
  onEvent?: (event: GameEvent) => void;
}

const createInitialState = (): GameEngineState => ({
  phase: 'idle',
  score: 0,
  lives: 3,
  maxLives: 3,
  currentWave: 0,
  totalWaves: Infinity, // Unlimited waves
  player: {
    x: 0,
    velocityX: 0,
    width: GAME_CONSTANTS.PLAYER_WIDTH,
    height: GAME_CONSTANTS.PLAYER_HEIGHT,
    mood: 'neutral',
    isInvincible: false,
    hasGoldenHeart: false,
  },
  fallingItems: [],
  storedAbilities: [],
  activeEffects: [],
  waveTimeRemaining: 0,
  isPaused: false,
  isFrozen: false,
  specialItemsEnabled: false,
});

/**
 * Generate wave configuration for any wave number (unlimited scaling)
 * Items are staggered per wave:
 * - Wave 1: Raindrops only
 * - Wave 2: + Power Crystals
 * - Wave 3: + Fake Crystals (traps)
 * - Wave 4: + Hearts
 * - Wave 5: + Mystery Boxes (abilities)
 * - Wave 6: All abilities unlocked
 * - Wave 7: + Acid Rain (deadly)
 * - Wave 8+: + Invincible (legendary)
 */
function generateWaveConfig(waveNumber: number, baseWaves: WaveConfig[]): WaveConfig {
  const baseWaveIndex = Math.min(waveNumber - 1, baseWaves.length - 1);
  const baseWave = baseWaves[baseWaveIndex];
  
  // Difficulty scaling factors
  const difficultyMultiplier = 1 + Math.log10(Math.max(1, waveNumber)) * 0.5;
  const spawnMultiplier = Math.max(0.35, 1 - (waveNumber - 1) * 0.025);
  const speedMultiplier = 1 + (waveNumber - 1) * 0.07;
  
  // Staggered item introduction by wave
  let powerRate = 0;
  let healthRate = 0;
  let acidRainRate = 0;
  let abilityRate = 0;
  let trapRate = 0;
  
  // Wave 2+: Power Crystals
  if (waveNumber >= 2) {
    powerRate = Math.min(0.15, 0.06 + (waveNumber - 2) * 0.008);
  }
  
  // Wave 3+: Fake Crystals (traps)
  if (waveNumber >= 3) {
    trapRate = Math.min(0.10, 0.025 + (waveNumber - 3) * 0.01);
  }
  
  // Wave 4+: Hearts
  if (waveNumber >= 4) {
    healthRate = Math.min(0.08, 0.025 + (waveNumber - 4) * 0.004);
  }
  
  // Wave 5+: Mystery Boxes (abilities)
  if (waveNumber >= 5) {
    abilityRate = Math.min(0.10, 0.04 + (waveNumber - 5) * 0.006);
  }
  
  // Wave 7+: Acid Rain (deadly)
  if (waveNumber >= 7) {
    acidRainRate = Math.min(0.10, 0.02 + (waveNumber - 7) * 0.01);
  }
  
  // Raindrops fill the remaining probability
  const raindropRate = Math.max(0.45, 1 - powerRate - healthRate - acidRainRate - abilityRate - trapRate);
  
  return {
    id: waveNumber,
    name: getWaveName(waveNumber),
    spawnInterval: Math.max(100, baseWave.spawnInterval * spawnMultiplier),
    fallSpeedMultiplier: Math.min(3.0, speedMultiplier),
    spawnRates: {
      raindrop: raindropRate,
      power: powerRate,
      health: healthRate,
      acidRain: acidRainRate,
      ability: abilityRate,
      trap: trapRate,
    },
    waveBonus: Math.floor(100 * difficultyMultiplier + waveNumber * 50),
  };
}

function getWaveName(wave: number): string {
  const names = [
    'Gentle Drizzle', 'Light Rain', 'Steady Showers', 'Heavy Rain', 'Downpour',
    'Torrent', 'Storm', 'Thunder Storm', 'Monsoon', 'Typhoon',
    'Hurricane', 'Cyclone', 'Tempest', 'Deluge', 'Cataclysm',
  ];
  if (wave <= names.length) return names[wave - 1];
  return `${names[names.length - 1]} ${wave - names.length + 1}`;
}

export function useGameEngine(options: UseGameEngineOptions = {}) {
  const { onEvent } = options;
  
  const [state, setState] = useState<GameEngineState>(createInitialState());
  const [waveData, setWaveData] = useState<WaveData | null>(null);
  
  // Use refs for container size to avoid re-render cycles
  const containerSizeRef = useRef({ width: 0, height: 0 });
  
  // Refs for game loop
  const gameLoopRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const moodTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPlayerXRef = useRef<number>(0); // Track previous x for swept collision
  const waveEndingRef = useRef<boolean>(false); // Track if wave is in ending phase
  const pendingWaveCompletionRef = useRef<number | null>(null); // Track wave to complete
  const startWaveRef = useRef<(wave: number) => void>(() => {}); // Ref for startWave to avoid circular deps
  const finishWaveCompletionRef = useRef<(wave: number) => void>(() => {}); // Ref for finishWaveCompletion
  const hasInitializedPositionRef = useRef(false); // Track if player has been positioned
  const pendingGameStartRef = useRef(false); // Track if we're waiting to start
  const waveStartTimeRef = useRef<number>(0); // Track when current wave started
  const waveDurationRef = useRef<number>(0); // Store wave duration for countdown
  
  // Input state ref (for smooth movement)
  const inputRef = useRef({ 
    left: false, 
    right: false, 
    touchX: null as number | null,
  });

  // Load wave data
  useEffect(() => {
    fetch(`${ASSET_PATHS.json}waves.json`)
      .then(res => res.json())
      .then((data: WaveData) => {
        setWaveData(data);
      })
      .catch(console.error);
  }, []);

  // Emit event helper
  const emitEvent = useCallback((event: GameEvent) => {
    onEvent?.(event);
  }, [onEvent]);

  // Set player mood with auto-reset
  const setPlayerMood = useCallback((mood: PlayerMood, duration = GAME_CONSTANTS.MOOD_RESET_DELAY) => {
    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current);
    }
    
    setState(prev => ({
      ...prev,
      player: { ...prev.player, mood }
    }));
    
    if (mood !== 'neutral' && mood !== 'protected') {
      moodTimeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          player: { 
            ...prev.player, 
            mood: prev.player.isInvincible ? 'protected' : 'neutral' 
          }
        }));
      }, duration);
    }
  }, []);

  // Calculate spawn interval adjusted for screen size
  const getAdjustedSpawnInterval = useCallback((baseInterval: number) => {
    const widthRatio = containerSizeRef.current.width / GAME_CONSTANTS.BASE_SCREEN_WIDTH;
    const adjustedInterval = baseInterval / (1 + (widthRatio - 1) * GAME_CONSTANTS.SPAWN_DENSITY_FACTOR);
    return Math.max(50, adjustedInterval);
  }, []);

  // Spawn a falling item
  const spawnItem = useCallback(() => {
    if (!waveData) return;
    
    const containerSize = containerSizeRef.current;
    
    setState(prev => {
      if (prev.phase !== 'playing' || prev.isPaused || prev.isFrozen) return prev;
      
      const currentWaveConfig = generateWaveConfig(prev.currentWave, waveData.waves);
      
      const itemType = prev.specialItemsEnabled 
        ? rollItemType(currentWaveConfig.spawnRates)
        : 'raindrop';
      
      const itemConfig = waveData.itemTypes[itemType];
      const fallDuration = calculateFallDuration(
        waveData.config.baseFallDuration,
        currentWaveConfig.fallSpeedMultiplier
      );
      
      const newItem: FallingItem = {
        id: generateId(),
        type: itemType,
        x: getRandomSpawnX(containerSize.width, itemConfig.size),
        y: -itemConfig.size,
        size: itemConfig.size,
        speed: containerSize.height / (fallDuration / 1000) / 60,
        createdAt: Date.now(),
      };
      
      return {
        ...prev,
        fallingItems: [...prev.fallingItems, newItem],
      };
    });
  }, [waveData]);

  // Handle item collision
  const handleItemCollision = useCallback((item: FallingItem) => {
    if (!waveData) return;
    
    const itemConfig = waveData.itemTypes[item.type];
    
    setState(prev => {
      let newState = { ...prev };
      let scoreGain = 0;
      
      switch (itemConfig.effect) {
        case 'damage':
          if (!prev.player.isInvincible) {
            if (prev.player.hasGoldenHeart) {
              newState.player = { ...prev.player, hasGoldenHeart: false };
              setPlayerMood('worried');
            } else {
              const newLives = prev.lives - itemConfig.damage;
              newState.lives = Math.max(0, newLives);
              setPlayerMood('sad');
              emitEvent({ type: 'DAMAGE_TAKEN', amount: itemConfig.damage, newLives: newState.lives });
              
              if (newState.lives <= 0) {
                newState.phase = 'gameOver';
                emitEvent({ 
                  type: 'GAME_OVER', 
                  finalScore: prev.score, 
                  waveReached: prev.currentWave 
                });
              }
            }
          }
          break;
          
        case 'instantKill':
          if (!prev.player.isInvincible) {
            if (prev.player.hasGoldenHeart) {
              newState.player = { ...prev.player, hasGoldenHeart: false };
              newState.lives = Math.max(0, prev.lives - 1);
              setPlayerMood('angry');
              emitEvent({ type: 'DAMAGE_TAKEN', amount: 1, newLives: newState.lives });
              if (newState.lives <= 0) {
                newState.phase = 'gameOver';
                emitEvent({ type: 'GAME_OVER', finalScore: prev.score, waveReached: prev.currentWave });
              }
            } else {
              newState.lives = 0;
              newState.phase = 'gameOver';
              setPlayerMood('sad');
              emitEvent({ type: 'GAME_OVER', finalScore: prev.score, waveReached: prev.currentWave });
            }
          }
          break;
          
        case 'score':
          scoreGain = itemConfig.scoreValue;
          newState.score = prev.score + scoreGain;
          setPlayerMood('happy');
          emitEvent({ type: 'ITEM_COLLECTED', item, score: scoreGain });
          break;
          
        case 'heal':
          if (prev.lives < prev.maxLives) {
            newState.lives = Math.min(prev.maxLives, prev.lives + 1);
          }
          scoreGain = itemConfig.scoreValue;
          newState.score = prev.score + scoreGain;
          setPlayerMood('love');
          emitEvent({ type: 'ITEM_COLLECTED', item, score: scoreGain });
          break;
          
        case 'grantAbility':
          if (prev.storedAbilities.length < GAME_CONSTANTS.MAX_STORED_ABILITIES) {
            const ability = getRandomAbility(prev.currentWave);
            const nextSlot = prev.storedAbilities.length;
            newState.storedAbilities = [
              ...prev.storedAbilities,
              { id: ability, slot: nextSlot }
            ];
            emitEvent({ type: 'ABILITY_GRANTED', ability });
          }
          scoreGain = itemConfig.scoreValue;
          newState.score = prev.score + scoreGain;
          setPlayerMood('happy');
          break;
      }
      
      newState.fallingItems = prev.fallingItems.filter(i => i.id !== item.id);
      
      return newState;
    });
  }, [waveData, emitEvent, setPlayerMood]);

  // Use ability
  const useAbility = useCallback((slot: number) => {
    if (!waveData) return;
    
    setState(prev => {
      const abilitySlot = prev.storedAbilities.find(a => a.slot === slot);
      if (!abilitySlot) return prev;
      
      const ability = abilitySlot.id;
      const abilityConfig = waveData.abilities[ability];
      let newState = { ...prev };
      
      // Remove from stored and reindex
      newState.storedAbilities = prev.storedAbilities
        .filter(a => a.slot !== slot)
        .map((a, i) => ({ ...a, slot: i }));
      
      emitEvent({ type: 'ABILITY_USED', ability });
      
      switch (ability) {
        case 'freeze':
          newState.isFrozen = true;
          newState.activeEffects = [
            ...prev.activeEffects.filter(e => e.type !== 'freeze'),
            { type: 'freeze', expiresAt: Date.now() + abilityConfig.duration }
          ];
          setTimeout(() => {
            setState(s => ({ 
              ...s, 
              isFrozen: false,
              activeEffects: s.activeEffects.filter(e => e.type !== 'freeze')
            }));
          }, abilityConfig.duration);
          break;
          
        case 'sunny':
          newState.fallingItems = [];
          break;
          
        case 'umbrella':
          newState.player = { ...prev.player, isInvincible: true, mood: 'protected' };
          newState.activeEffects = [
            ...prev.activeEffects.filter(e => e.type !== 'umbrella'),
            { type: 'umbrella', expiresAt: Date.now() + abilityConfig.duration }
          ];
          setTimeout(() => {
            setState(s => ({
              ...s,
              player: { ...s.player, isInvincible: false, mood: 'neutral' },
              activeEffects: s.activeEffects.filter(e => e.type !== 'umbrella')
            }));
          }, abilityConfig.duration);
          break;
          
        case 'doggyLife':
          newState.player = { ...prev.player, hasGoldenHeart: true };
          break;
          
        case 'invincible':
          // Legendary ability - invincible with larger hitbox and power magnet
          newState.player = { ...prev.player, isInvincible: true, mood: 'protected' };
          newState.activeEffects = [
            ...prev.activeEffects.filter(e => e.type !== 'invincible'),
            { type: 'invincible', expiresAt: Date.now() + 10000 } // 10 second duration
          ];
          setTimeout(() => {
            setState(s => ({
              ...s,
              player: { ...s.player, isInvincible: false, mood: 'neutral' },
              activeEffects: s.activeEffects.filter(e => e.type !== 'invincible')
            }));
          }, 10000);
          break;
      }
      
      return newState;
    });
  }, [waveData, emitEvent]);

  // Swap abilities (for drag and drop)
  const swapAbilities = useCallback((fromSlot: number, toSlot: number) => {
    setState(prev => {
      const abilities = [...prev.storedAbilities];
      const fromIdx = abilities.findIndex(a => a.slot === fromSlot);
      const toIdx = abilities.findIndex(a => a.slot === toSlot);
      
      if (fromIdx === -1) return prev;
      
      if (toIdx === -1) {
        abilities[fromIdx] = { ...abilities[fromIdx], slot: toSlot };
      } else {
        const temp = abilities[fromIdx].slot;
        abilities[fromIdx] = { ...abilities[fromIdx], slot: abilities[toIdx].slot };
        abilities[toIdx] = { ...abilities[toIdx], slot: temp };
      }
      
      return { ...prev, storedAbilities: abilities };
    });
  }, []);

  // Game loop with smooth physics
  const gameLoop = useCallback((timestamp: number) => {
    const deltaTime = lastUpdateRef.current ? (timestamp - lastUpdateRef.current) / 16.67 : 1;
    lastUpdateRef.current = timestamp;
    
    const containerSize = containerSizeRef.current;
    
    setState(prev => {
      if (prev.phase !== 'playing' || prev.isPaused) return prev;
      
      const input = inputRef.current;
      let newVelocityX = prev.player.velocityX;
      let newPlayerX = prev.player.x;
      
      // Smooth keyboard movement with acceleration
      if (input.left && !input.right) {
        newVelocityX -= GAME_CONSTANTS.PLAYER_ACCELERATION * deltaTime;
      } else if (input.right && !input.left) {
        newVelocityX += GAME_CONSTANTS.PLAYER_ACCELERATION * deltaTime;
      } else {
        // Apply friction when no input
        newVelocityX *= GAME_CONSTANTS.PLAYER_FRICTION;
      }
      
      // Clamp velocity
      newVelocityX = clamp(newVelocityX, -GAME_CONSTANTS.PLAYER_MAX_SPEED, GAME_CONSTANTS.PLAYER_MAX_SPEED);
      
      // Apply friction when no directional input
      if (!input.left && !input.right) {
        newVelocityX *= GAME_CONSTANTS.PLAYER_FRICTION;
      }
      
      // Stop if velocity is very small
      if (Math.abs(newVelocityX) < 0.1) {
        newVelocityX = 0;
      }
      
      // Update position
      newPlayerX += newVelocityX * deltaTime;
      
      // Clamp position with padding and soft bounce
      const minX = GAME_CONSTANTS.PLAYER_EDGE_PADDING;
      const maxX = containerSize.width - prev.player.width - GAME_CONSTANTS.PLAYER_EDGE_PADDING;
      
      if (newPlayerX < minX) {
        newPlayerX = minX;
        newVelocityX = Math.abs(newVelocityX) * 0.3;
      } else if (newPlayerX > maxX) {
        newPlayerX = maxX;
        newVelocityX = -Math.abs(newVelocityX) * 0.3;
      }
      
      // Update falling items
      const playerY = containerSize.height - prev.player.height - GAME_CONSTANTS.PLAYER_BOTTOM_OFFSET;
      let updatedItems = prev.fallingItems;
      const itemsToRemove: string[] = [];
      const collidedItems: FallingItem[] = [];
      
      // Get previous player position for swept collision
      const prevX = prevPlayerXRef.current;
      
      if (!prev.isFrozen) {
        updatedItems = prev.fallingItems.map(item => ({
          ...item,
          y: item.y + item.speed * deltaTime,
        }));
        
        // Items disappear when they reach the HUD zone (not the bottom of screen)
        const removalThreshold = containerSize.height - GAME_CONSTANTS.BOTTOM_HUD_HEIGHT + 20;
        
        updatedItems.forEach(item => {
          if (item.y > removalThreshold) {
            itemsToRemove.push(item.id);
          } else if (checkCollisionSwept(
            prevX,
            newPlayerX,
            prev.player.width,
            playerY,
            prev.player.height,
            item,
            Math.max(3, Math.ceil(Math.abs(newPlayerX - prevX) / 8)) // More steps for faster movement
          )) {
            collidedItems.push(item);
            itemsToRemove.push(item.id);
          }
        });
        
        updatedItems = updatedItems.filter(item => !itemsToRemove.includes(item.id));
      }
      
      // Update previous position for next frame
      prevPlayerXRef.current = newPlayerX;
      
      // Check if wave is ending and all items are cleared
      if (waveEndingRef.current && updatedItems.length === 0) {
        waveEndingRef.current = false;
        pendingWaveCompletionRef.current = prev.currentWave;
      }
      
      // Update wave time remaining
      let newWaveTimeRemaining = prev.waveTimeRemaining;
      if (prev.phase === 'playing' && waveStartTimeRef.current > 0) {
        const elapsed = Date.now() - waveStartTimeRef.current;
        newWaveTimeRemaining = Math.max(0, waveDurationRef.current - elapsed);
      }
      
      // Handle collisions
      collidedItems.forEach(item => {
        handleItemCollision(item);
      });
      
      return {
        ...prev,
        player: { ...prev.player, x: newPlayerX, velocityX: newVelocityX },
        fallingItems: updatedItems,
        waveTimeRemaining: newWaveTimeRemaining,
      };
    });
    
    // Check for pending wave completion outside setState
    if (pendingWaveCompletionRef.current !== null) {
      const waveNum = pendingWaveCompletionRef.current;
      pendingWaveCompletionRef.current = null;
      finishWaveCompletionRef.current(waveNum);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [handleItemCollision]);

  // Start wave
  const startWave = useCallback((waveNumber: number) => {
    if (!waveData) return;
    
    const waveConfig = generateWaveConfig(waveNumber, waveData.waves);
    
    setState(prev => ({
      ...prev,
      phase: 'waveIntro',
      currentWave: waveNumber,
      specialItemsEnabled: false,
    }));
    
    emitEvent({ type: 'WAVE_STARTED', wave: waveNumber, name: waveConfig.name });
    
    setTimeout(() => {
      // Calculate and store wave duration for countdown
      const waveDuration = waveData.config.waveDuration * GAME_CONSTANTS.WAVE_DURATION_MULTIPLIER;
      waveDurationRef.current = waveDuration;
      waveStartTimeRef.current = Date.now();
      
      setState(prev => ({ ...prev, phase: 'playing', waveTimeRemaining: waveDuration }));
      
      setTimeout(() => {
        setState(prev => ({ ...prev, specialItemsEnabled: true }));
      }, waveData.config.specialItemDelay);
      
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      const adjustedInterval = getAdjustedSpawnInterval(waveConfig.spawnInterval);
      spawnIntervalRef.current = setInterval(spawnItem, adjustedInterval);
      
      if (waveTimerRef.current) {
        clearTimeout(waveTimerRef.current);
      }
      waveTimerRef.current = setTimeout(() => {
        initiateWaveEnd(waveNumber);
      }, waveDuration);
      
    }, waveData.config.waveBreakDuration);
  }, [waveData, spawnItem, emitEvent, getAdjustedSpawnInterval]);

  // Keep startWaveRef updated to avoid circular dependency
  useEffect(() => {
    startWaveRef.current = startWave;
  }, [startWave]);

  // Initiate wave end - stop spawning and wait for items to clear
  const initiateWaveEnd = useCallback((waveNumber: number) => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    
    waveEndingRef.current = true;
    
    // Check if items are already cleared
    setState(prev => {
      if (prev.fallingItems.length === 0) {
        waveEndingRef.current = false;
        setTimeout(() => finishWaveCompletionRef.current(waveNumber), 0);
      }
      return prev;
    });
  }, []);

  // Finish wave completion - called when all items are cleared
  const finishWaveCompletion = useCallback((waveNumber: number) => {
    if (!waveData) return;
    
    const waveConfig = generateWaveConfig(waveNumber, waveData.waves);
    const bonus = waveConfig.waveBonus;
    
    setState(prev => ({
      ...prev,
      phase: 'waveComplete',
      score: prev.score + bonus,
    }));
    
    emitEvent({ type: 'WAVE_COMPLETED', wave: waveNumber, bonus });
    
    // Continue to next wave quickly - wave complete banner shows briefly
    setTimeout(() => {
      startWaveRef.current(waveNumber + 1);
    }, 1500); // Short wave complete display (1.5s)
  }, [waveData, emitEvent]);

  // Keep finishWaveCompletionRef updated
  useEffect(() => {
    finishWaveCompletionRef.current = finishWaveCompletion;
  }, [finishWaveCompletion]);

  // Actually start the game once we have valid dimensions
  const doStartGame = useCallback((width: number, _height: number) => {
    if (!waveData) return;
    
    const minX = GAME_CONSTANTS.PLAYER_EDGE_PADDING;
    const maxX = Math.max(minX, width - GAME_CONSTANTS.PLAYER_WIDTH - GAME_CONSTANTS.PLAYER_EDGE_PADDING);
    const initialX = Math.max(minX, Math.min(maxX, width / 2 - GAME_CONSTANTS.PLAYER_WIDTH / 2));
    
    prevPlayerXRef.current = initialX;
    waveEndingRef.current = false;
    pendingWaveCompletionRef.current = null;
    hasInitializedPositionRef.current = true;
    pendingGameStartRef.current = false;
    
    // Reset input state
    inputRef.current = {
      left: false,
      right: false,
      touchX: null,
    };
    
    setState({
      ...createInitialState(),
      player: {
        ...createInitialState().player,
        x: initialX,
        velocityX: 0,
      },
    });
    
    lastUpdateRef.current = 0;
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    startWave(1);
  }, [waveData, gameLoop, startWave]);

  // Start game - may be deferred if container size not ready
  const startGame = useCallback(() => {
    if (!waveData) return;
    
    const containerSize = containerSizeRef.current;
    
    // If we have valid container size, start immediately
    if (containerSize.width > 100 && containerSize.height > 100) {
      doStartGame(containerSize.width, containerSize.height);
    } else {
      // Mark that we want to start, will be picked up by updateContainerSize
      pendingGameStartRef.current = true;
      hasInitializedPositionRef.current = false;
    }
  }, [waveData, doStartGame]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    
    pendingGameStartRef.current = false;
    hasInitializedPositionRef.current = false;
    waveEndingRef.current = false;
    pendingWaveCompletionRef.current = null;
    
    setState(createInitialState());
  }, []);

  // Input handlers
  const handleKeyDown = useCallback((key: string) => {
    if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
      inputRef.current.left = true;
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
      inputRef.current.right = true;
    } else if (key === 'Escape') {
      togglePause();
    } else if (key >= '1' && key <= '5') {
      useAbility(parseInt(key) - 1);
    }
  }, [togglePause, useAbility]);

  const handleKeyUp = useCallback((key: string) => {
    if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
      inputRef.current.left = false;
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
      inputRef.current.right = false;
    }
  }, []);

  const handleTouchMove = useCallback((x: number) => {
    inputRef.current.touchX = x;
  }, []);

  const handleTouchEnd = useCallback(() => {
    inputRef.current.touchX = null;
  }, []);

  // Update container size - use ref to avoid re-render cycles
  const updateContainerSize = useCallback((width: number, height: number) => {
    // Only update if size actually changed
    if (containerSizeRef.current.width === width && containerSizeRef.current.height === height) {
      return;
    }
    
    containerSizeRef.current = { width, height };
    
    // If game is waiting to start and we now have valid size, start it
    if (pendingGameStartRef.current && width > 100 && height > 100) {
      doStartGame(width, height);
      return;
    }
    
    // Calculate valid position range
    const minX = GAME_CONSTANTS.PLAYER_EDGE_PADDING;
    const maxX = Math.max(minX, width - GAME_CONSTANTS.PLAYER_WIDTH - GAME_CONSTANTS.PLAYER_EDGE_PADDING);
    const centeredX = Math.max(minX, Math.min(maxX, width / 2 - GAME_CONSTANTS.PLAYER_WIDTH / 2));
    
    setState(prev => {
      // Only update if in idle phase and position needs to change
      if (prev.phase === 'idle' && Math.abs(prev.player.x - centeredX) > 1) {
        return {
          ...prev,
          player: {
            ...prev.player,
            x: centeredX,
          },
        };
      }
      
      // During gameplay, only clamp if actually out of bounds
      if (prev.phase !== 'idle') {
        const clampedX = Math.max(minX, Math.min(maxX, prev.player.x));
        if (Math.abs(prev.player.x - clampedX) > 1) {
          return {
            ...prev,
            player: {
              ...prev.player,
              x: clampedX,
            },
          };
        }
      }
      
      return prev; // No change needed
    });
  }, [doStartGame]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
      if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    };
  }, []);

  // Get current wave config for display
  const getCurrentWaveConfig = useCallback(() => {
    if (!waveData || state.currentWave === 0) return null;
    return generateWaveConfig(state.currentWave, waveData.waves);
  }, [waveData, state.currentWave]);

  return {
    state,
    waveData,
    containerSize: containerSizeRef.current,
    startGame,
    resetGame,
    togglePause,
    useAbility,
    swapAbilities,
    handleKeyDown,
    handleKeyUp,
    handleTouchMove,
    handleTouchEnd,
    updateContainerSize,
    getCurrentWaveConfig,
    isReady: waveData !== null,
  };
}
