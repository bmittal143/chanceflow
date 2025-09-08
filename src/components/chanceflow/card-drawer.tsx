
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getExplanation } from '@/app/actions';
import { Loader2, Sparkles, Shuffle, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createDeck, shuffleDeck, Card } from '@/lib/deck';
import PlayingCard from './playing-card';

const DeckIndicator = ({ count }: { count: number }) => (
  <div className="relative w-32 h-48 md:w-40 md:h-60">
    {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
      <div
        key={i}
        className="absolute w-full h-full bg-secondary rounded-lg border-2 shadow-md"
        style={{ transform: `translate(${i * 3}px, ${i * -3}px)` }}
      />
    ))}
    { count > 0 && 
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
        <span className="text-3xl font-bold text-white">{count}</span>
      </div>
    }
  </div>
);


export function CardDrawer() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  const shuffle = () => {
    setExplanation(null);
    setDrawnCard(null);
    setDeck(shuffleDeck(createDeck()));
    toast({ title: "Deck Shuffled", description: "A new 52-card deck is ready." });
  };
  
  useEffect(() => {
    shuffle();
  }, []);

  const handleDraw = async () => {
    if (isDrawing || isExplaining || deck.length === 0) return;
    setIsDrawing(true);
    setExplanation(null);

    setTimeout(async () => {
      const newDeck = [...deck];
      const card = newDeck.pop();
      setDrawnCard(card || null);
      setDeck(newDeck);
      setIsDrawing(false);

      if (card) {
        setIsExplaining(true);
        const res = await getExplanation({
          outcome: `${card.rank} of ${card.suit}`,
          randomizerType: 'card',
        });
        if (res.error) {
          toast({
            variant: "destructive",
            title: "AI Error",
            description: res.error,
          });
        } else {
          setExplanation(res.explanation || null);
        }
        setIsExplaining(false);
      }
    }, 500);
  };
  
  const canDraw = deck.length > 0;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      <div className="flex justify-center items-center gap-4 md:gap-8 min-h-[15rem] md:min-h-[18rem]">
        <div className="flex flex-col items-center gap-2">
          <DeckIndicator count={deck.length} />
          <p className="text-sm text-muted-foreground">Deck</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {drawnCard ? <PlayingCard card={drawnCard} /> : <div className="w-32 h-48 md:w-40 md:h-60 bg-muted rounded-lg animate-pulse" />}
          <p className="text-sm text-muted-foreground">Your Card</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={handleDraw} disabled={!canDraw || isDrawing || isExplaining} size="lg" className="w-48 text-lg">
          {isDrawing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Layers className="mr-2 h-5 w-5" />}
          Draw Card
        </Button>
        <Button onClick={shuffle} disabled={isDrawing || isExplaining} size="lg" variant="outline" className="w-48 text-lg">
          <Shuffle className="mr-2 h-5 w-5" />
          Shuffle
        </Button>
      </div>
      {!canDraw && <p className="text-primary font-semibold">Deck is empty! Please shuffle.</p>}

      {explanation && (
        <UICard className="w-full bg-card/80 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{explanation}</p>
          </CardContent>
        </UICard>
      )}
       {isExplaining && !explanation && (
         <div className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating explanation...
        </div>
      )}
    </div>
  );
}
