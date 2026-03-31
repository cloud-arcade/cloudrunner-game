/**
 * Cloud Runner Game Types
 * Core type definitions for the game
 */

// ============================================
// Wave Configuration Types
// ============================================

export interface GameConfig {
  baseFallDuration: number;
  waveDuration: number;
  waveBreakDuration: number;
  specialItemDelay: number;
  playerSpeed: number;
  baseScorePerWave: number;
}

export interface AbilityConfig {
  id: AbilityType;
  name: string;
  description: string;
  duration: number;
  icon: string;
}

export interface ItemTypeConfig {
  id: ItemType;
  name: string;
  icon: string;
  size: number;
  damage: number;
  scoreValue: number;
  effect: ItemEffect;
}

export interface WaveConfig {
  id: number;
  name: string;
  spawnInterval: number;
  fallSpeedMultiplier: number;
  spawnRates: Record<ItemType, number>;
  waveBonus: number;
}

export interface WaveData {
  config: GameConfig;
  abilities: Record<AbilityType, AbilityConfig>;
  itemTypes: Record<ItemType, ItemTypeConfig>;
  waves: WaveConfig[];
}

// ============================================
// Game Entity Types
// ============================================

export type ItemType = 'raindrop' | 'power' | 'health' | 'acidRain' | 'ability' | 'trap';
export type ItemEffect = 'damage' | 'score' | 'heal' | 'instantKill' | 'grantAbility';
export type AbilityType = 'freeze' | 'sunny' | 'umbrella' | 'doggyLife' | 'invincible';

export type PlayerMood = 
  | 'neutral' 
  | 'happy' 
  | 'sad' 
  | 'love' 
  | 'angry' 
  | 'worried' 
  | 'protected';

export interface FallingItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  size: number;
  speed: number;
  createdAt: number;
}

export interface Player {
  x: number;
  velocityX: number; // For smooth movement
  width: number;
  height: number;
  mood: PlayerMood;
  isInvincible: boolean;
  hasGoldenHeart: boolean;
}

export interface StoredAbility {
  id: AbilityType;
  slot: number;
}

// ============================================
// Game State Types
// ============================================

export type GamePhase = 
  | 'idle'           // Before game starts
  | 'waveIntro'      // Showing wave title
  | 'playing'        // Active gameplay
  | 'waveComplete'   // Wave transition
  | 'gameOver'       // Player lost
  | 'victory';       // All waves complete

export interface GameEngineState {
  phase: GamePhase;
  score: number;
  lives: number;
  maxLives: number;
  currentWave: number;
  totalWaves: number;
  player: Player;
  fallingItems: FallingItem[];
  storedAbilities: StoredAbility[];
  activeEffects: ActiveEffect[];
  waveTimeRemaining: number;
  isPaused: boolean;
  isFrozen: boolean;
  specialItemsEnabled: boolean;
}

export interface ActiveEffect {
  type: AbilityType;
  expiresAt: number;
}

// ============================================
// Input Types
// ============================================

export interface InputState {
  left: boolean;
  right: boolean;
  touchX: number | null;
}

// ============================================
// Event Types
// ============================================

export type GameEvent = 
  | { type: 'ITEM_COLLECTED'; item: FallingItem; score: number }
  | { type: 'DAMAGE_TAKEN'; amount: number; newLives: number }
  | { type: 'ABILITY_GRANTED'; ability: AbilityType }
  | { type: 'ABILITY_USED'; ability: AbilityType }
  | { type: 'WAVE_STARTED'; wave: number; name: string }
  | { type: 'WAVE_COMPLETED'; wave: number; bonus: number }
  | { type: 'GAME_OVER'; finalScore: number; waveReached: number }
  | { type: 'VICTORY'; finalScore: number };
