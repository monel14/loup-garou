import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-2">{card.name}</h3>
      <p className="text-sm text-gray-600 mb-2">Role: {card.role}</p>
      <p className="text-sm">{card.description}</p>
    </div>
  );
};

export default Card;