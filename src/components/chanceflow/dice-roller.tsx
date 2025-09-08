
"use client";

import { useState, useEffect, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getExplanation } from '@/app/actions';
import { Loader2, Dices, Sparkles, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { LucideProps } from 'lucide-react';


type Result = 1 | 2 | 3 | 4 | 5 | 6;

const diceIcons: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>[] = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const DiceFace = ({ value }: { value: Result }) => {
  const Icon = diceIcons[value - 1];
  return <Icon className="w-32 h-32 md:w-40 md:h-40 text-primary animate-in fade-in zoom-in-75 duration-300" strokeWidth={1.5} />;
};

export function DiceRoller() {
  const [result, setResult] = useState<Result | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Start with a non-null result to show a die initially
    setResult(6);
  }, []);

  const handleRoll = () => {
    if (isRolling || isExplaining) return;
    setIsRolling(true);
    setExplanation(null);

    const rollInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1 as Result);
    }, 75);

    setTimeout(async () => {
      clearInterval(rollInterval);
      const rollResult = (Math.floor(Math.random() * 6) + 1) as Result;
      setResult(rollResult);
      setIsRolling(false);
      
      setIsExplaining(true);
      const res = await getExplanation({
        outcome: rollResult.toString(),
        randomizerType: 'dice',
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
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="w-40 h-40 flex items-center justify-center">
        {result ? <DiceFace value={result} /> : <div className="w-40 h-40 bg-muted rounded-2xl animate-pulse" />}
      </div>
      
      <Button onClick={handleRoll} disabled={isRolling || isExplaining} size="lg" className="w-48 text-lg">
        {isRolling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Dices className="mr-2 h-5 w-5" />}
        Roll Dice
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
