import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, database } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ref, onValue, push, set } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, MessageCircle } from 'lucide-react';
import Chat from './Chat';
import PlayerList from './PlayerList';
import RoleAssignment from './RoleAssignment';
import VotingSystem from './VotingSystem';

interface GameState {
  id: string;
  name: string;
  players: string[];
  status: 'waiting' | 'in-progress' | 'finished';
  phase: 'day' | 'night';
  round: number;
  roles: Record<string, string>;
  votes: Record<string, string>;
  eliminated: string[];
}

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!gameId) return;

    const gameRef = doc(firestore, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        setGameState(doc.data() as GameState);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  const startGame = async () => {
    if (!gameState || !gameId) return;
    const roles = assignRoles(gameState.players);
    await updateDoc(doc(firestore, 'games', gameId), {
      status: 'in-progress',
      phase: 'night',
      round: 1,
      roles,
    });
  };

  const assignRoles = (players: string[]): Record<string, string> => {
    const roles: Record<string, string> = {};
    const availableRoles = ['werewolf', 'werewolf', 'seer', 'doctor'];
    const remainingRoles = new Array(players.length - availableRoles.length).fill('villager');
    const allRoles = [...availableRoles, ...remainingRoles].sort(() => Math.random() - 0.5);

    players.forEach((player, index) => {
      roles[player] = allRoles[index];
    });

    return roles;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gameState) {
    return <div>Game not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{gameState.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Game Status</h2>
            <p className="text-lg mb-2">
              {gameState.status === 'waiting' ? (
                <span className="text-yellow-500">Waiting for players</span>
              ) : (
                <span className="text-green-500">In progress</span>
              )}
            </p>
            {gameState.status === 'in-progress' && (
              <>
                <p className="text-lg mb-2">
                  Phase: {gameState.phase === 'day' ? <Sun className="inline-block" /> : <Moon className="inline-block" />} {gameState.phase}
                </p>
                <p className="text-lg mb-2">Round: {gameState.round}</p>
              </>
            )}
            {gameState.status === 'waiting' && gameState.players[0] === currentUser?.uid && (
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Start Game
              </button>
            )}
          </div>
          {gameState.status === 'in-progress' && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Game Actions</h2>
              {gameState.roles && gameState.roles[currentUser?.uid || ''] && (
                <RoleAssignment role={gameState.roles[currentUser?.uid || '']} />
              )}
              <VotingSystem gameId={gameId} gameState={gameState} currentUser={currentUser} />
            </div>
          )}
        </div>
        <div>
          <PlayerList players={gameState.players} eliminated={gameState.eliminated} />
          <Chat gameId={gameId} />
        </div>
      </div>
    </div>
  );
};

export default Game;