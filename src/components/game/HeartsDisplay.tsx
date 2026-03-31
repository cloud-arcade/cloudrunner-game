/**
 * Hearts Display Component
 * Shows player's remaining lives
 */

import { ASSET_PATHS } from '../../game/constants';

interface HeartsDisplayProps {
  lives: number;
  maxLives: number;
  hasGoldenHeart: boolean;
}

export function HeartsDisplay({ lives, maxLives, hasGoldenHeart }: HeartsDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLives }).map((_, i) => {
        const isFilled = i < lives;
        const isGolden = hasGoldenHeart && i === lives - 1 && isFilled;
        
        return (
          <img
            key={i}
            src={`${ASSET_PATHS.icons}${
              isGolden ? 'gold-heart.png' : isFilled ? 'heart-full.png' : 'heart-empty.png'
            }`}
            alt={isFilled ? 'Life' : 'Empty'}
            className={`w-7 h-7 transition-all duration-200 ${
              !isFilled ? 'opacity-40 grayscale' : ''
            } ${isGolden ? 'animate-pulse scale-110' : ''}`}
          />
        );
      })}
    </div>
  );
}
