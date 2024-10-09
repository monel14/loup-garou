import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Users } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  players: string[];
  status: 'waiting' | 'in-progress' | 'finished';
}

const Lobby: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [newGameName, setNewGameName] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const gamesRef = collection(firestore, 'games');
    const q = query(gamesRef, where('status', '==', 'waiting'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gameList: Game[] = [];
      snapshot.forEach((doc) => {
        gameList.push({ id: doc.id, ...doc.data() } as Game);
      });
      setGames(gameList);
    });

    return () => unsubscribe();
  }, []);

  const createGame = async () => {
    if (newGameName.trim() === '') return;
    try {
      const gameRef = await addDoc(collection(firestore, 'games'), {
        name: newGameName,
        players: [currentUser?.uid],
        status: 'waiting',
        createdAt: new Date(),
      });
      navigate(`/game/${gameRef.id}`);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const joinGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Werewolf Game Lobby</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create a New Game</h2>
        <div className="flex">
          <input
            type="text"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            placeholder="Enter game name"
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={createGame}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Game
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-4">
                <Users className="inline-block mr-2" size={18} />
                {game.players.length} players
              </p>
              <button
                onClick={() => joinGame(game.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Join Game
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lobby;