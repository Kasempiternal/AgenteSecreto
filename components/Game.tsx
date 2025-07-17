'use client';

import { useState, useEffect } from 'react';
import { GameState, Team } from '@/lib/types';
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
      showingLeaderView: false
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
      showingLeaderView: false
    });
    setShowEmergencyColors(false);
    setAssassinFlash(false);
  };

  const showLeaderView = () => {
    setGameState(prev => ({ ...prev, phase: 'leader-view', showingLeaderView: false }));
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
    <div className={`h-screen w-screen flex flex-col bg-gray-100 overflow-hidden ${isLandscape ? 'landscape-container' : ''} ${assassinFlash ? 'assassin-flash' : ''}`}>
      {gameState.phase === 'start' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">AGENTE SECRETO</h1>
            <button
              onClick={showLeaderView}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600 active:scale-95 transition-all"
            >
              ¡EMPEZAR JUEGO!
            </button>
          </div>
        </div>
      )}

      {gameState.phase === 'leader-view' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">VISTA DE LÍDERES</h2>
            <p className="text-center mb-6">
              Al hacer clic en OK, los líderes verán los colores de las cartas. 
              Tomen una foto o captura de pantalla antes de continuar.
            </p>
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Equipo que empieza:</p>
              <p className={`text-2xl font-bold ${gameState.startingTeam === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                {gameState.startingTeam === 'red' ? 'ROJO (9 cartas)' : 'AZUL (9 cartas)'}
              </p>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, showingLeaderView: true }))}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 active:scale-95 transition-all"
            >
              OK - VER COLORES
            </button>
          </div>
        </div>
      )}

      {gameState.phase === 'leader-view' && gameState.showingLeaderView && (
        <div className="flex-1 flex flex-col p-2 relative">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold">VISTA DE LÍDER - Toma una foto ahora</p>
            <p className={`text-lg font-bold ${gameState.startingTeam === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
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

          <div className="sticky bottom-0 bg-gray-100 p-4">
            <button
              onClick={startPlaying}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 active:scale-95 transition-all"
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

            <div className="sticky bottom-0 bg-gray-100 flex justify-center space-x-2 p-2">
              {gameState.phase === 'playing' && (
                <button
                  onClick={handleEmergencyColors}
                  className="bg-yellow-500 text-white px-3 py-2 rounded text-xs font-bold hover:bg-yellow-600 active:scale-95 transition-all"
                >
                  COLORES
                </button>
              )}
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className="bg-purple-500 text-white px-3 py-2 rounded text-xs font-bold hover:bg-purple-600 active:scale-95 transition-all"
              >
                ROTAR
              </button>
              <button
                onClick={startNewGame}
                className="bg-gray-500 text-white px-3 py-2 rounded text-xs font-bold hover:bg-gray-600 active:scale-95 transition-all"
              >
                NUEVO
              </button>
            </div>
          </div>

          {gameState.phase === 'game-over' && gameState.winner && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center win-celebration`}>
                <h2 className="text-3xl font-bold mb-4">¡JUEGO TERMINADO!</h2>
                <p className="text-2xl mb-6">
                  Ganador: 
                  <span className={`font-bold ${gameState.winner === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                    {' '}{gameState.winner === 'red' ? 'EQUIPO ROJO' : 'EQUIPO AZUL'}
                  </span>
                </p>
                <button
                  onClick={startNewGame}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 active:scale-95 transition-all"
                >
                  JUGAR DE NUEVO
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {gameState.showingLeaderView && gameState.phase === 'playing' && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Vista de Líder Activa
        </div>
      )}
    </div>
  );
}