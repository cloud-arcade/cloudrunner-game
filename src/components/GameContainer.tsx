/**
 * Game Container Component
 * Main container that orchestrates game screens and the game engine
 */

import { useCallback, useEffect, useState } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { useCloudArcade } from '../hooks/useCloudArcade';
import { 
  LoadingScreen, 
  MenuScreen, 
  GameScreen, 
  GameOverScreen, 
  VictoryScreen,
  PauseOverlay 
} from './screens';
import type { GameEvent } from '../game/types';

type ScreenState = 'loading' | 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';

export function GameContainer() {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [highScore, setHighScore] = useState(0);
  const [lastGameScore, setLastGameScore] = useState(0);
  const [lastWaveReached, setLastWaveReached] = useState(0);
  
  const { 
    startSession, 
    endSession, 
    submitScore, 
    gameOver: reportGameOver 
  } = useCloudArcade({ debug: import.meta.env.DEV });
  
  // Handle game events
  const handleGameEvent = useCallback((event: GameEvent) => {
    switch (event.type) {
      case 'GAME_OVER':
        setLastGameScore(event.finalScore);
        setLastWaveReached(event.waveReached);
        if (event.finalScore > highScore) {
          setHighScore(event.finalScore);
        }
        submitScore(event.finalScore, { wave: event.waveReached });
        reportGameOver(event.finalScore, true, { wave: event.waveReached });
        setScreen('gameover');
        break;
        
      case 'VICTORY':
        setLastGameScore(event.finalScore);
        setLastWaveReached(10); // All waves completed
        if (event.finalScore > highScore) {
          setHighScore(event.finalScore);
        }
        submitScore(event.finalScore, { wave: 10, victory: true });
        reportGameOver(event.finalScore, true, { wave: 10, victory: true });
        setScreen('victory');
        break;
        
      case 'WAVE_COMPLETED':
        // Could report wave progress here
        break;
    }
  }, [highScore, submitScore, reportGameOver]);
  
  const {
    state: gameState,
    waveData,
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
    isReady,
  } = useGameEngine({ onEvent: handleGameEvent });
  
  // Show menu when wave data is loaded
  useEffect(() => {
    if (isReady && screen === 'loading') {
      setScreen('menu');
    }
  }, [isReady, screen]);
  
  // Handle pause state
  useEffect(() => {
    if (gameState.isPaused && screen === 'playing') {
      setScreen('paused');
    } else if (!gameState.isPaused && screen === 'paused') {
      setScreen('playing');
    }
  }, [gameState.isPaused, screen]);
  
  const handleStartGame = useCallback(() => {
    startSession({ gameMode: 'classic' });
    startGame();
    setScreen('playing');
  }, [startSession, startGame]);
  
  const handlePlayAgain = useCallback(() => {
    resetGame();
    handleStartGame();
  }, [resetGame, handleStartGame]);
  
  const handleMainMenu = useCallback(() => {
    resetGame();
    endSession();
    setScreen('menu');
  }, [resetGame, endSession]);
  
  const handleResume = useCallback(() => {
    togglePause();
  }, [togglePause]);
  
  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {screen === 'loading' && <LoadingScreen progress={isReady ? 100 : 50} />}
      
      {screen === 'menu' && (
        <MenuScreen
          onStartGame={handleStartGame}
          highScore={highScore}
        />
      )}
      
      {(screen === 'playing' || screen === 'paused') && (
        <>
          <GameScreen
            state={gameState}
            waveData={waveData}
            currentWaveConfig={getCurrentWaveConfig()}
            onPause={togglePause}
            onUseAbility={useAbility}
            onSwapAbilities={swapAbilities}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onResize={updateContainerSize}
          />
          {screen === 'paused' && (
            <PauseOverlay
              onResume={handleResume}
              onMainMenu={handleMainMenu}
            />
          )}
        </>
      )}
      
      {screen === 'gameover' && (
        <GameOverScreen
          score={lastGameScore}
          highScore={highScore}
          waveReached={lastWaveReached}
          isNewHighScore={lastGameScore >= highScore && lastGameScore > 0}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
      
      {screen === 'victory' && (
        <VictoryScreen
          score={lastGameScore}
          highScore={highScore}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}
