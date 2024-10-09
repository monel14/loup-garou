import { Card } from '../types';

export const cards: Card[] = [
  { id: 1, name: 'Werewolf', role: 'Werewolf', description: 'Wake at night and choose a villager to eliminate.' },
  { id: 2, name: 'Villager', role: 'Villager', description: 'Try to identify and eliminate the werewolves.' },
  { id: 3, name: 'Seer', role: 'Villager', description: 'Can check one player\'s identity each night.' },
  { id: 4, name: 'Doctor', role: 'Villager', description: 'Can protect one player each night from elimination.' },
  { id: 5, name: 'Hunter', role: 'Villager', description: 'If eliminated, can choose another player to eliminate.' },
  { id: 6, name: 'Witch', role: 'Villager', description: 'Has one potion to save a player and one to eliminate a player.' },
  { id: 7, name: 'Cupid', role: 'Villager', description: 'Chooses two players to be lovers at the start of the game.' },
  { id: 8, name: 'Bodyguard', role: 'Villager', description: 'Can protect one player each night, including themselves.' },
  { id: 9, name: 'Tanner', role: 'Neutral', description: 'Wins if they are eliminated.' },
  { id: 10, name: 'Alpha Werewolf', role: 'Werewolf', description: 'Can turn a villager into a werewolf once per game.' },
];