/**
 * Game Utilities
 * Helper functions for game logic
 */

import type { FallingItem, ItemType, AbilityType } from './types';
import { GAME_CONSTANTS } from './constants';

/**
 * Generate a unique ID for game entities
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determine item type based on wave spawn rates
 */
export function rollItemType(spawnRates: Record<ItemType, number>): ItemType {
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [type, rate] of Object.entries(spawnRates)) {
    cumulative += rate;
    if (roll <= cumulative) {
      return type as ItemType;
    }
  }
  
  return 'raindrop'; // Fallback
}

/**
 * Check collision between player and falling item using smaller hitbox
 * The hitbox is centered within the player sprite for more accurate collisions
 */
export function checkCollision(
  playerX: number,
  playerWidth: number,
  playerY: number,
  playerHeight: number,
  item: FallingItem
): boolean {
  // Calculate smaller hitbox within player bounds
  const hitboxWidth = playerWidth * GAME_CONSTANTS.HITBOX_WIDTH_RATIO;
  const hitboxHeight = playerHeight * GAME_CONSTANTS.HITBOX_HEIGHT_RATIO;
  const hitboxX = playerX + playerWidth * GAME_CONSTANTS.HITBOX_OFFSET_X;
  const hitboxY = playerY + playerHeight * GAME_CONSTANTS.HITBOX_OFFSET_Y;
  
  // Item hitbox is also slightly smaller (80% of visual size)
  const itemHitboxRatio = 0.8;
  const itemHitboxSize = item.size * itemHitboxRatio;
  const itemHitboxOffset = (item.size - itemHitboxSize) / 2;
  const itemX = item.x + itemHitboxOffset;
  const itemY = item.y + itemHitboxOffset;
  
  const itemRight = itemX + itemHitboxSize;
  const itemBottom = itemY + itemHitboxSize;
  const hitboxRight = hitboxX + hitboxWidth;
  const hitboxBottom = hitboxY + hitboxHeight;
  
  return !(
    itemX > hitboxRight ||
    itemRight < hitboxX ||
    itemY > hitboxBottom ||
    itemBottom < hitboxY
  );
}

/**
 * Check collision along a movement path (for fast-moving objects)
 * Uses swept collision detection
 */
export function checkCollisionSwept(
  prevPlayerX: number,
  currentPlayerX: number,
  playerWidth: number,
  playerY: number,
  playerHeight: number,
  item: FallingItem,
  steps: number = 3
): boolean {
  // Check multiple points along the movement path
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const interpolatedX = prevPlayerX + (currentPlayerX - prevPlayerX) * t;
    if (checkCollision(interpolatedX, playerWidth, playerY, playerHeight, item)) {
      return true;
    }
  }
  return false;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Get random position within container width
 */
export function getRandomSpawnX(containerWidth: number, itemSize: number): number {
  const padding = 10;
  return padding + Math.random() * (containerWidth - itemSize - padding * 2);
}

/**
 * Get a random ability type based on current wave
 * Rarity system:
 * - Freeze: Common (always available from wave 5)
 * - Umbrella: Rare (wave 5+)
 * - Clear Skies (sunny): Rare (wave 6+)
 * - Golden Heart (doggyLife): Very Rare (wave 6+)
 * - Invincible: Legendary (wave 8+)
 */
export function getRandomAbility(currentWave: number = 10): AbilityType {
  // Build available abilities based on wave
  const abilities: { type: AbilityType; weight: number }[] = [];
  
  // Wave 5+: Freeze (Common)
  if (currentWave >= 5) {
    abilities.push({ type: 'freeze', weight: 50 });
  }
  
  // Wave 5+: Umbrella (Rare)
  if (currentWave >= 5) {
    abilities.push({ type: 'umbrella', weight: 25 });
  }
  
  // Wave 6+: Clear Skies (Rare)
  if (currentWave >= 6) {
    abilities.push({ type: 'sunny', weight: 20 });
  }
  
  // Wave 6+: Golden Heart (Very Rare)
  if (currentWave >= 6) {
    abilities.push({ type: 'doggyLife', weight: 10 });
  }
  
  // Wave 8+: Invincible (Legendary)
  if (currentWave >= 8) {
    abilities.push({ type: 'invincible', weight: 5 });
  }
  
  // Fallback if no abilities available yet
  if (abilities.length === 0) {
    return 'freeze';
  }
  
  // Weighted random selection
  const totalWeight = abilities.reduce((sum, a) => sum + a.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const ability of abilities) {
    random -= ability.weight;
    if (random <= 0) {
      return ability.type;
    }
  }
  
  return abilities[0].type;
}

/**
 * Format time in MM:SS format
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format score with commas
 */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/**
 * Calculate fall duration based on wave multiplier
 */
export function calculateFallDuration(baseDuration: number, multiplier: number): number {
  return baseDuration / multiplier;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
