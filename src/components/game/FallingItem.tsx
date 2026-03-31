/**
 * Falling Item Component
 * Renders a single falling item with animation and fade-out near bottom
 */

import { memo } from 'react';
import { ASSET_PATHS, GAME_CONSTANTS } from '../../game/constants';
import type { FallingItem as FallingItemType, WaveData } from '../../game/types';

interface FallingItemProps {
  item: FallingItemType;
  itemConfig: WaveData['itemTypes'][keyof WaveData['itemTypes']] | undefined;
  containerHeight: number;
}

export const FallingItem = memo(function FallingItem({ item, itemConfig, containerHeight }: FallingItemProps) {
  if (!itemConfig) return null;
  
  // Calculate opacity - fade out as item approaches bottom HUD area
  const fadeStartY = containerHeight - GAME_CONSTANTS.BOTTOM_HUD_HEIGHT - GAME_CONSTANTS.ITEM_FADE_ZONE;
  
  let opacity = 1;
  if (item.y > fadeStartY) {
    opacity = Math.max(0, 1 - (item.y - fadeStartY) / GAME_CONSTANTS.ITEM_FADE_ZONE);
  }
  
  return (
    <div
      className="absolute will-change-transform"
      style={{
        transform: `translate(${item.x}px, ${item.y}px)`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        opacity,
        transition: 'opacity 0.1s ease-out',
      }}
    >
      <img
        src={`${ASSET_PATHS.icons}${itemConfig.icon}`}
        alt={itemConfig.name}
        className="w-full h-full object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
});
