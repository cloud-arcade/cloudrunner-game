/**
 * Game Constants
 * Centralized configuration values
 */

export const GAME_CONSTANTS = {
  // Player
  PLAYER_WIDTH: 48,
  PLAYER_HEIGHT: 48,
  PLAYER_BOTTOM_OFFSET: 140, // More space above bottom HUD overlay
  PLAYER_EDGE_PADDING: 16, // Padding from screen edges
  
  // HUD
  BOTTOM_HUD_HEIGHT: 120, // Height of the bottom HUD area where items fade
  ITEM_FADE_ZONE: 60, // Zone above HUD where items start fading
  
  // Movement physics
  PLAYER_ACCELERATION: 0.6,
  PLAYER_MAX_SPEED: 6,
  PLAYER_FRICTION: 0.88,
  TOUCH_SMOOTHING: 0.08,
  
  // Collision - hitbox is smaller than visual sprite
  HITBOX_WIDTH_RATIO: 0.5,   // 50% of player width
  HITBOX_HEIGHT_RATIO: 0.6,  // 60% of player height
  HITBOX_OFFSET_X: 0.25,     // Center the hitbox horizontally
  HITBOX_OFFSET_Y: 0.2,      // Offset slightly from top
  
  // Wave timing
  WAVE_DURATION_MULTIPLIER: 1.6, // Make waves longer
  
  // Abilities
  MAX_STORED_ABILITIES: 5,
  
  // Scoring
  COMBO_THRESHOLD: 3,
  COMBO_MULTIPLIER: 1.5,
  
  // Timing
  MOOD_RESET_DELAY: 2000,
  
  // Animation
  FALL_ANIMATION_FPS: 60,
  
  // Screen scaling
  BASE_SCREEN_WIDTH: 480, // Reference width for spawn rate calculations
  SPAWN_DENSITY_FACTOR: 0.8, // Higher = more items on larger screens
} as const;

// Use Vite's BASE_URL for correct asset paths in production (GitHub Pages)
const BASE_URL = import.meta.env.BASE_URL || '/';

export const ASSET_PATHS = {
  icons: `${BASE_URL}assets/icons/`,
  background: `${BASE_URL}assets/background/`,
  json: `${BASE_URL}assets/json/`,
} as const;

export const PLAYER_MOOD_ICONS: Record<string, string> = {
  neutral: 'character-neutral.png',
  happy: 'character-happy.png',
  sad: 'character-sad.png',
  love: 'character-love.png',
  angry: 'character-angry.png',
  worried: 'character-worried.png',
  protected: 'character-umbrella.png',
};

