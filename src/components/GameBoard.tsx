import React, { useState } from 'react';
import { GameState, Player } from '../types';
import { cards } from '../data/cards';
import Card from './Card';
import PlayerList from './PlayerList';

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    phase: 'setup',
    round: 0,
  });

  const [playerName, setPlayerName] = useState('');

  const addPlayer = () => {
    if (playerName.trim() !== '') {
      const newPlayer: Player = {
        id: gameState.players.length + 1,
        name: playerName.trim(),
        card: null,
        isAlive: true,
      };
      setGameState((prevState) => ({
        ...prevState,
        players: [...prevState.players, newPlayer],
      }));
      setPlayerName('');
    }
  };

  const startGame = () => {
    if (gameState.players.length < 5) {
      alert('You need at least 5 players to start the game.');
      return;
    }

    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const assignedPlayers = gameState.players.map((player, index) => ({
      ...player,
      card: shuffledCards[index % shuffledCards.length],
    }));

    setGameState((prevState) => ({
      ...prevState,
      players: assignedPlayers,
      phase: 'night',
      round: 1,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Werewolf Game</h1>
      {gameState.phase === 'setup' ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Setup</h2>
          <div className="flex mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="flex-grow p-2 border rounded-l"
            />
            <button
              onClick={addPlayer}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Add Player
            </button>
          </div>
          <button
            onClick={startGame}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Phase: {gameState.phase.charAt(0).toUpperCase() + gameState.phase.slice(1)}
          </h2>
          <p className="text-xl mb-4">Round: {gameState.round}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PlayerList players={gameState.players} />
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;