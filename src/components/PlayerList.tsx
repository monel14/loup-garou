import React from 'react';
import { Users } from 'lucide-react';

interface PlayerListProps {
  players: string[];
  eliminated: string[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players, eliminated }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Users className="mr-2" /> Players
      </h2>
      <ul className="space-y-2">
        {players.map((player) => (
          <li
            key={player}
            className={`${
              eliminated.includes(player) ? 'text-red-500 line-through' : 'text-gray-700'
            }`}
          >
            {player}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;