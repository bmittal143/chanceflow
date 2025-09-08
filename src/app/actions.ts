
'use server';

import { explainOutcome, ExplainOutcomeInput, ExplainOutcomeOutput } from '@/ai/flows/outcome-explanations';

export async function getExplanation(
  input: ExplainOutcomeInput
): Promise<{ explanation?: string; error?: string }> {
  try {
    const result: ExplainOutcomeOutput = await explainOutcome(input);
    return { explanation: result.explanation };
  } catch (e) {
    console.error('Error getting explanation:', e);
    return { error: 'Could not generate an explanation at this time.' };
  }
}
