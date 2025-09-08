
import type { FC } from 'react';
import { Card as CardType } from '@/lib/deck';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card: CardType;
}

const suitSymbols: Record<CardType['suit'], string> = {
  Hearts: '♥',
  Diamonds: '♦',
  Clubs: '♣',
  Spades: '♠',
};

const PlayingCard: FC<PlayingCardProps> = ({ card }) => {
  const { rank, suit } = card;
  const color = (suit === 'Hearts' || suit === 'Diamonds') ? 'text-red-500' : 'text-foreground';

  return (
    <div className={cn(
      'bg-card rounded-lg w-32 h-48 md:w-40 md:h-60 p-3 flex flex-col justify-between shadow-lg border-2',
       color
    )}>
      <div className="text-left">
        <div className="text-2xl md:text-3xl font-bold">{rank}</div>
        <div className="text-xl md:text-2xl">{suitSymbols[suit]}</div>
      </div>
      <div className="text-5xl md:text-6xl text-center font-bold">{suitSymbols[suit]}</div>
      <div className="text-right transform rotate-180">
        <div className="text-2xl md:text-3xl font-bold">{rank}</div>
        <div className="text-xl md:text-2xl">{suitSymbols[suit]}</div>
      </div>
    </div>
  );
};

export default PlayingCard;
