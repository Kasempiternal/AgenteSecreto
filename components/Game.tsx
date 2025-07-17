'use client';

import { useState, useEffect } from 'react';
import { GameState, Team, GameMode } from '@/lib/types';
import { generateCards, getRandomStartingTeam, checkWinner, getRemainingCards } from '@/lib/gameLogic';
import GameGrid from './GameGrid';
import Scoreboard from './Scoreboard';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const startingTeam = getRandomStartingTeam();
    return {
      cards: generateCards(startingTeam),
      currentTeam: startingTeam,
      redScore: 0,
      blueScore: 0,
      phase: 'start',
      winner: null,
      startingTeam,
      showingLeaderView: false,
      gameMode: 'normal'
    };
  });

  const [showEmergencyColors, setShowEmergencyColors] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [assassinFlash, setAssassinFlash] = useState(false);

  const startNewGame = () => {
    const startingTeam = getRandomStartingTeam();
    setGameState({
      cards: generateCards(startingTeam),
      currentTeam: startingTeam,
      redScore: 0,
      blueScore: 0,
      phase: 'start',
      winner: null,
      startingTeam,
      showingLeaderView: false,
      gameMode: 'normal'
    });
    setShowEmergencyColors(false);
    setAssassinFlash(false);
  };

  const selectGameMode = (mode: GameMode) => {
    setGameState(prev => ({ ...prev, gameMode: mode, phase: 'mode-selection' }));
  };

  const showLeaderView = () => {
    if (gameState.gameMode === 'two-player') {
      setGameState(prev => ({ ...prev, phase: 'two-player-red-view', showingLeaderView: false }));
    } else {
      setGameState(prev => ({ ...prev, phase: 'leader-view', showingLeaderView: false }));
    }
  };

  const showBlueTeamView = () => {
    setGameState(prev => ({ ...prev, phase: 'two-player-blue-view', showingLeaderView: false }));
  };

  const startPlaying = () => {
    setGameState(prev => ({ ...prev, phase: 'playing', showingLeaderView: true }));
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showingLeaderView: false }));
    }, 100);
  };

  const handleCardReveal = (index: number) => {
    if (gameState.phase !== 'playing') return;

    const card = gameState.cards[index];
    if (card.revealed) return;

    const newCards = [...gameState.cards];
    newCards[index] = { ...card, revealed: true };

    let newRedScore = gameState.redScore;
    let newBlueScore = gameState.blueScore;

    if (card.type === 'red') {
      newRedScore++;
    } else if (card.type === 'blue') {
      newBlueScore++;
    }

    if (card.type === 'assassin') {
      // Trigger flash effect
      setAssassinFlash(true);
      setTimeout(() => setAssassinFlash(false), 1500);
      
      // Add a short delay to show the death animation before game over
      setTimeout(() => {
        setGameState({
          ...gameState,
          cards: newCards,
          phase: 'game-over',
          winner: gameState.currentTeam === 'red' ? 'blue' : 'red'
        });
      }, 1500);
      
      setGameState({
        ...gameState,
        cards: newCards
      });
      return;
    }

    const winner = checkWinner(newCards);
    
    setGameState({
      ...gameState,
      cards: newCards,
      currentTeam: gameState.currentTeam, // Keep the same team
      redScore: newRedScore,
      blueScore: newBlueScore,
      phase: winner ? 'game-over' : 'playing',
      winner
    });
  };

  const handleEmergencyColors = () => {
    if (confirm('¿Estás seguro de que quieres ver los colores? Esta acción es solo para líderes de equipo.')) {
      setShowEmergencyColors(true);
      setTimeout(() => setShowEmergencyColors(false), 5000);
    }
  };

  const redTotal = gameState.startingTeam === 'red' ? 9 : 8;
  const blueTotal = gameState.startingTeam === 'blue' ? 9 : 8;

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden main-container ${isLandscape ? 'landscape-container' : ''} ${assassinFlash ? 'assassin-flash' : ''}`}>
      {gameState.phase === 'start' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-8 spy-title">AGENTE SECRETO</h1>
            <div className="space-y-4">
              <button
                onClick={() => selectGameMode('normal')}
                className="block w-full px-8 py-4 rounded-lg text-xl spy-button"
              >
                MODO NORMAL
              </button>
              <button
                onClick={() => selectGameMode('two-player')}
                className="block w-full px-8 py-4 rounded-lg text-xl spy-button"
              >
                MODO DOS JUGADORES
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.phase === 'mode-selection' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="spy-modal rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {gameState.gameMode === 'two-player' ? 'MODO DOS JUGADORES' : 'MODO NORMAL'}
            </h2>
            <p className="text-center mb-6 text-gray-300">
              {gameState.gameMode === 'two-player' 
                ? 'PROTOCOLO DE SEGURIDAD: Primero el agente rojo accederá a la información clasificada, luego el agente azul.'
                : 'PROTOCOLO ESTÁNDAR: Los jefes de operaciones de ambas agencias accederán simultáneamente a los archivos clasificados.'}
            </p>
            <button
              onClick={showLeaderView}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      )}

      {gameState.phase === 'leader-view' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="spy-modal rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">VISTA DE LÍDERES</h2>
            <p className="text-center mb-6">
              Al hacer clic en OK, los líderes verán los colores de las cartas. 
              Tomen una foto o captura de pantalla antes de continuar.
            </p>
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Equipo que empieza:</p>
              <p className={`text-2xl font-bold ${gameState.startingTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
                {gameState.startingTeam === 'red' ? 'ROJO (9 cartas)' : 'AZUL (9 cartas)'}
              </p>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, showingLeaderView: true }))}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              OK - VER COLORES
            </button>
          </div>
        </div>
      )}

      {gameState.phase === 'leader-view' && gameState.showingLeaderView && (
        <div className="flex-1 flex flex-col p-2 relative">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-300">ARCHIVO CLASIFICADO - CAPTURA AUTORIZADA</p>
            <p className={`text-lg font-bold ${gameState.startingTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
              Empieza: {gameState.startingTeam === 'red' ? 'ROJO' : 'AZUL'}
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-y-auto min-h-0">
            <GameGrid
              cards={gameState.cards}
              onCardReveal={() => {}}
              showColors={true}
              disabled={true}
            />
          </div>

          <div className="sticky bottom-0 p-4" style={{paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'}}>
            <button
              onClick={startPlaying}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              EMPEZAR JUEGO
            </button>
          </div>
        </div>
      )}

      {/* Two-player mode: Red team view */}
      {gameState.phase === 'two-player-red-view' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="spy-modal rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">JUGADOR ROJO</h2>
            <p className="text-center mb-6 text-gray-300">
              ACCESO RESTRINGIDO: Solo el agente ROJO autorizado. 
              Al confirmar, se revelarán los objetivos clasificados.
            </p>
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Equipo que empieza:</p>
              <p className={`text-2xl font-bold ${gameState.startingTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
                {gameState.startingTeam === 'red' ? 'ROJO (9 cartas)' : 'AZUL (9 cartas)'}
              </p>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, showingLeaderView: true }))}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              OK - VER MIS CARTAS ROJAS
            </button>
          </div>
        </div>
      )}

      {gameState.phase === 'two-player-red-view' && gameState.showingLeaderView && (
        <div className="flex-1 flex flex-col p-2 relative">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold uppercase tracking-wider team-red-indicator">TERMINAL DEL AGENTE ROJO</p>
            <p className={`text-lg font-bold ${gameState.startingTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
              Empieza: {gameState.startingTeam === 'red' ? 'ROJO' : 'AZUL'}
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-y-auto min-h-0">
            <GameGrid
              cards={gameState.cards.map(card => ({
                ...card,
                type: card.type === 'red' || card.type === 'assassin' ? card.type : 'neutral'
              }))}
              onCardReveal={() => {}}
              showColors={true}
              disabled={true}
            />
          </div>

          <div className="sticky bottom-0 p-4">
            <button
              onClick={showBlueTeamView}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              CONTINUAR AL JUGADOR AZUL
            </button>
          </div>
        </div>
      )}

      {/* Two-player mode: Blue team view */}
      {gameState.phase === 'two-player-blue-view' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="spy-modal rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">JUGADOR AZUL</h2>
            <p className="text-center mb-6 text-gray-300">
              ACCESO RESTRINGIDO: Solo el agente AZUL autorizado. 
              Al confirmar, se revelarán los objetivos clasificados.
            </p>
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Equipo que empieza:</p>
              <p className={`text-2xl font-bold ${gameState.startingTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
                {gameState.startingTeam === 'red' ? 'ROJO (9 cartas)' : 'AZUL (9 cartas)'}
              </p>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, showingLeaderView: true }))}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              OK - VER MIS CARTAS AZULES
            </button>
          </div>
        </div>
      )}

      {gameState.phase === 'two-player-blue-view' && gameState.showingLeaderView && (
        <div className="flex-1 flex flex-col p-2 relative">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold uppercase tracking-wider team-blue-indicator">TERMINAL DEL AGENTE AZUL</p>
            <p className={`text-lg font-bold ${gameState.startingTeam === 'red' ? 'team-red-indicator' : 'team-blue-indicator'}`}>
              Empieza: {gameState.startingTeam === 'red' ? 'ROJO' : 'AZUL'}
            </p>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-y-auto min-h-0">
            <GameGrid
              cards={gameState.cards.map(card => ({
                ...card,
                type: card.type === 'blue' || card.type === 'assassin' ? card.type : 'neutral'
              }))}
              onCardReveal={() => {}}
              showColors={true}
              disabled={true}
            />
          </div>

          <div className="sticky bottom-0 p-4" style={{paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'}}>
            <button
              onClick={startPlaying}
              className="w-full px-6 py-3 rounded-lg spy-button"
            >
              EMPEZAR JUEGO
            </button>
          </div>
        </div>
      )}

      {(gameState.phase === 'playing' || gameState.phase === 'game-over') && (
        <>
          <div className="flex-1 flex flex-col p-2 relative">
            <Scoreboard
              redScore={gameState.redScore}
              blueScore={gameState.blueScore}
              currentTeam={gameState.currentTeam}
              redTotal={redTotal}
              blueTotal={blueTotal}
            />
            
            <div className="flex-1 flex items-center justify-center overflow-y-auto min-h-0">
              <GameGrid
                cards={gameState.cards}
                onCardReveal={handleCardReveal}
                showColors={gameState.showingLeaderView || showEmergencyColors}
                disabled={gameState.phase === 'game-over'}
              />
            </div>

            <div className="sticky bottom-0 flex justify-center space-x-2 p-2" style={{paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'}}>
              {gameState.phase === 'playing' && (
                <button
                  onClick={handleEmergencyColors}
                  className="px-3 py-2 rounded text-xs spy-button"
                >
                  COLORES
                </button>
              )}
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className="px-3 py-2 rounded text-xs spy-button"
              >
                ROTAR
              </button>
              <button
                onClick={startNewGame}
                className="px-3 py-2 rounded text-xs spy-button"
              >
                NUEVO
              </button>
            </div>
          </div>

          {gameState.phase === 'game-over' && gameState.winner && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className={`spy-modal rounded-lg p-8 max-w-sm w-full text-center win-celebration`}>
                <h2 className="text-3xl font-bold mb-4 spy-title">MISIÓN COMPLETADA</h2>
                <p className="text-xl mb-2 text-gray-400">AGENTE VICTORIOSO:</p>
                <p className="text-3xl mb-6">
                  <span className={`font-bold ${gameState.winner === 'red' ? 'team-red-indicator' : 'team-blue-indicator'} uppercase tracking-wider`}>
                    {gameState.winner === 'red' ? 'EQUIPO ROJO' : 'EQUIPO AZUL'}
                  </span>
                </p>
                <button
                  onClick={startNewGame}
                  className="px-6 py-3 rounded-lg spy-button"
                >
                  JUGAR DE NUEVO
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {gameState.showingLeaderView && gameState.phase === 'playing' && (
        <div className="fixed bottom-4 right-4 spy-button px-4 py-2 rounded-lg shadow-lg animate-pulse">
          MODO LÍDER ACTIVO
        </div>
      )}
    </div>
  );
}