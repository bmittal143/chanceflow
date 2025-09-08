
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getExplanation } from '@/app/actions';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Result = 'Heads' | 'Tails';

export function CoinFlipper() {
  const [result, setResult] = useState<Result | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  const handleFlip = async () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);
    setExplanation(null);

    // Animation duration
    setTimeout(async () => {
      const flipResult: Result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setResult(flipResult);
      setIsFlipping(false);
      
      setIsExplaining(true);
      const res = await getExplanation({
        outcome: flipResult,
        randomizerType: 'coin',
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
    }, 1000); // 1s flip animation
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="w-48 h-48 perspective-1000">
        <div
          className={cn(
            'relative w-full h-full text-center transition-transform duration-1000 preserve-3d',
            isFlipping && 'animate-flip'
          )}
          style={{ transform: result === 'Tails' ? 'rotateY(180deg)' : 'rotateY(0deg)'}}
        >
          {/* Heads side */}
          <div className="absolute w-full h-full backface-hidden rounded-full flex items-center justify-center bg-accent border-4 border-accent-foreground/50">
            <span className="text-3xl font-bold text-accent-foreground">Heads</span>
          </div>
          {/* Tails side */}
          <div className="absolute w-full h-full backface-hidden rounded-full flex items-center justify-center bg-secondary border-4 border-secondary-foreground/20 transform-gpu rotate-y-180">
             <span className="text-3xl font-bold text-secondary-foreground">Tails</span>
          </div>
        </div>
      </div>

      <Button onClick={handleFlip} disabled={isFlipping || isExplaining} size="lg" className="w-48 text-lg">
        {isFlipping ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
        Flip Coin
      </Button>

      {explanation && (
        <Card className="w-full bg-card/80 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{explanation}</p>
          </CardContent>
        </Card>
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
