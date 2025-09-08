
import { CardDrawer } from '@/components/chanceflow/card-drawer';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), "absolute top-6 left-6")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Menu
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline">Draw a Card</h1>
        <p className="text-muted-foreground text-lg mt-2">What will you draw from the deck?</p>
      </div>
      <CardDrawer />
    </main>
  );
}
