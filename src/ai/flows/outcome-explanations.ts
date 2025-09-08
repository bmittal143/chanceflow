'use server';

/**
 * @fileOverview A flow that provides logical explanations for random outcomes using AI.
 *
 * - explainOutcome - A function that takes a random outcome and provides an explanation.
 * - ExplainOutcomeInput - The input type for the explainOutcome function.
 * - ExplainOutcomeOutput - The return type for the explainOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainOutcomeInputSchema = z.object({
  outcome: z.string().describe('The random outcome to explain (e.g., "Heads", "4", "Ace of Spades").'),
  randomizerType: z.enum(['coin', 'dice', 'card']).describe('The type of randomizer used to generate the outcome.'),
});
export type ExplainOutcomeInput = z.infer<typeof ExplainOutcomeInputSchema>;

const ExplainOutcomeOutputSchema = z.object({
  explanation: z.string().describe('A logical explanation for the given random outcome.'),
});
export type ExplainOutcomeOutput = z.infer<typeof ExplainOutcomeOutputSchema>;

export async function explainOutcome(input: ExplainOutcomeInput): Promise<ExplainOutcomeOutput> {
  return explainOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainOutcomePrompt',
  input: {schema: ExplainOutcomeInputSchema},
  output: {schema: ExplainOutcomeOutputSchema},
  prompt: `You are a rational and logical AI assistant designed to provide explanations for random events. A user has received the following outcome from a randomizer:

Outcome: {{{outcome}}}
Randomizer Type: {{{randomizerType}}}

Explain, in a logical way, why the user received this specific outcome. Provide a unique and plausible explanation that might appeal to a superstitious user, helping them feel more in control. The explanation should be no more than two sentences.
`,
});

const explainOutcomeFlow = ai.defineFlow(
  {
    name: 'explainOutcomeFlow',
    inputSchema: ExplainOutcomeInputSchema,
    outputSchema: ExplainOutcomeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
