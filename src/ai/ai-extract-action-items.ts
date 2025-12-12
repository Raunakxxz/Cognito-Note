'use server';
/**
 * @fileOverview Extracts action items from a note using AI.
 *
 * - extractActionItems - A function that handles the extraction of action items from a note.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActionItemsInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to extract action items from.'),
});
export type ExtractActionItemsInput = z.infer<typeof ExtractActionItemsInputSchema>;

const ExtractActionItemsOutputSchema = z.object({
  actionItems: z.array(z.string()).describe('The action items extracted from the note.'),
});
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;

export async function extractActionItems(input: ExtractActionItemsInput): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: ExtractActionItemsInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `You are extracting action items from a note.\n\nNote content:\n"""\n{{{noteContent}}}\n"""\n\nReturn ONLY a JSON object:\n{
  "actionItems": ["task 1", "task 2", "task 3"]
}\n\nRules:\n- Only include clear action items (verbs like: do, call, email, schedule, research)\n- Rephrase as actionable tasks starting with verbs\n- If no tasks found, return empty array\n- Max 10 tasks`,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
