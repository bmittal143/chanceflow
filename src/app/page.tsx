import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CircleDollarSign, Dice5, Layers } from 'lucide-react';

const tools = [
  {
    title: 'Flip a Coin',
    description: 'Get a quick Heads or Tails result.',
    href: '/coin',
    icon: <CircleDollarSign className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Roll a Dice',
    description: 'Generate a random number from 1 to 6.',
    href: '/dice',
    icon: <Dice5 className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Draw a Card',
    description: 'Pick a random card from a full deck.',
    href: '/card',
    icon: <Layers className="w-12 h-12 text-primary" />,
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-6xl font-bold font-headline tracking-tight text-foreground">
        Welcome to ChanceFlow
      </h1>
      <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
        Your new favorite spot for quick decisions and a bit of fun. Choose a tool below to get started.
      </p>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href} passHref>
            <Card className="flex flex-col items-center justify-center text-center p-8 h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:border-primary cursor-pointer">
              <CardHeader className="p-0">
                {tool.icon}
                <CardTitle className="mt-4 text-2xl">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        <p>Built for fun. Enjoy responsibly!</p>
      </footer>
    </main>
  );
}
