/**
 * Ability Bar Component
 * Shows stored abilities with drag-and-drop support
 */

import { useState, useCallback } from 'react';
import { ASSET_PATHS } from '../../game/constants';
import type { StoredAbility, WaveData } from '../../game/types';

interface AbilityBarProps {
  abilities: StoredAbility[];
  abilityConfigs: WaveData['abilities'] | undefined;
  maxSlots: number;
  onUseAbility: (slot: number) => void;
  onSwapAbilities?: (fromSlot: number, toSlot: number) => void;
  compact?: boolean;
}

export function AbilityBar({ 
  abilities, 
  abilityConfigs, 
  maxSlots, 
  onUseAbility,
  onSwapAbilities,
  compact = false,
}: AbilityBarProps) {
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, slot: number) => {
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slot.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, slot: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(slot);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toSlot: number) => {
    e.preventDefault();
    const fromSlot = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(fromSlot) && fromSlot !== toSlot && onSwapAbilities) {
      onSwapAbilities(fromSlot, toSlot);
    }
    setDraggedSlot(null);
    setDragOverSlot(null);
  }, [onSwapAbilities]);

  const handleDragEnd = useCallback(() => {
    setDraggedSlot(null);
    setDragOverSlot(null);
  }, []);

  // Handle touch events for mobile - prevent propagation to game area
  const handleTouchEnd = useCallback((e: React.TouchEvent, slot: number) => {
    e.preventDefault();
    e.stopPropagation();
    const storedAbility = abilities.find(a => a.slot === slot);
    if (storedAbility) {
      onUseAbility(slot);
    }
  }, [abilities, onUseAbility]);

  const slotSize = compact ? 'w-10 h-10' : 'w-14 h-14';
  const iconSize = compact ? 'w-6 h-6' : 'w-9 h-9';
  const keySize = compact ? 'w-3.5 h-3.5 text-[8px]' : 'w-5 h-5 text-[10px]';

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {Array.from({ length: maxSlots }).map((_, i) => {
        const storedAbility = abilities.find(a => a.slot === i);
        const abilityConfig = storedAbility && abilityConfigs
          ? abilityConfigs[storedAbility.id]
          : null;
        
        const isDragging = draggedSlot === i;
        const isDragOver = dragOverSlot === i;
        
        return (
          <button
            key={i}
            onClick={() => storedAbility && onUseAbility(i)}
            onTouchEnd={(e) => handleTouchEnd(e, i)}
            draggable={!!storedAbility && !!onSwapAbilities}
            onDragStart={(e) => storedAbility && handleDragStart(e, i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={`
              relative ${slotSize} rounded-xl border-2 transition-all duration-150
              flex items-center justify-center
              ${storedAbility 
                ? 'bg-white/10 border-white/30 hover:bg-white/25 hover:scale-110 hover:border-primary/50 cursor-pointer active:scale-95' 
                : 'bg-black/40 border-white/10 cursor-default'
              }
              ${isDragging ? 'opacity-50 scale-90' : ''}
              ${isDragOver ? 'border-primary scale-105 bg-primary/20' : ''}
            `}
            title={abilityConfig ? `${abilityConfig.name} - ${abilityConfig.description}` : `Slot ${i + 1}`}
          >
            {abilityConfig && (
              <img
                src={`${ASSET_PATHS.icons}${abilityConfig.icon}`}
                alt={abilityConfig.name}
                className={`${iconSize} object-contain pointer-events-none`}
                draggable={false}
              />
            )}
            <span className={`absolute -top-1 -left-1 ${keySize} bg-black/70 rounded-full font-bold flex items-center justify-center text-white/70`}>
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}

