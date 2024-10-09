import React, { useState } from 'react';
import { firestore } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface VotingSystemProps {
  gameId: string;
  gameState: {
    phase: string;
    players: string[];
    votes: Record<string, string>;
    eliminated: string[];
  };
  currentUser: User | null;
}

const VotingSystem: React.FC<VotingSystemProps> = ({ gameId, gameState, currentUser }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const castVote = async () => {
    if (!selectedPlayer || !currentUser) return;

    const gameRef = doc(firestore, 'games', gameId);
    const votes = { ...gameState.votes, [currentUser.uid]: selectedPlayer };

    await updateDoc(gameRef, { votes });

    if (Object.keys(votes).length === gameState.players.length) {
      const voteCounts: Record<string, number> = {};
      Object.values(votes).forEach((vote) => {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
      });

      const eliminatedPlayer = Object.entries(voteCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      await updateDoc(gameRef, {
        eliminated: arrayUnion(eliminatedPlayer),
        votes: {},
        phase: gameState.phase === 'day' ? 'night' : 'day',
        round: gameState.phase === 'night' ? gameState.round + 1 : gameState.round,
      });
    }
  };

  if (gameState.eliminated.includes(currentUser?.uid || '')) {
    return <p>You have been eliminated from the game.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Cast Your Vote</h3>
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
        className="block w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select a player</option>
        {gameState.players
          .filter((player) => player !== currentUser?.uid && !gameState.eliminated.includes(player))
          .map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
      </select>
      <button
        onClick={castVote}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Cast Vote
      </button>
    </div>
  );
};

export default VotingSystem;