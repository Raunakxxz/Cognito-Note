'use server';
/**
 * @fileOverview Extracts action items from a note using AI.
 *
 * - taskExtraction - A function that handles the extraction of action items from a note.
 * - TaskExtractionInput - The input type for the taskExtraction function.
 * - TaskExtractionOutput - The return type for the taskExtraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskExtractionInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to extract action items from.'),
});
export type TaskExtractionInput = z.infer<typeof TaskExtractionInputSchema>;

const TaskExtractionOutputSchema = z.object({
  actionItems: z.array(z.string()).describe('The action items extracted from the note.'),
});
export type TaskExtractionOutput = z.infer<typeof TaskExtractionOutputSchema>;

export async function taskExtraction(input: TaskExtractionInput): Promise<TaskExtractionOutput> {
  return taskExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskExtractionPrompt',
  input: {schema: TaskExtractionInputSchema},
  output: {schema: TaskExtractionOutputSchema},
  prompt: `You are extracting action items from a note.\n\nNote content:\n"""\n{{{noteContent}}}\n"""\n\nReturn ONLY a JSON object:\n{
  "actionItems": ["task 1", "task 2", "task 3"]
}\n\nRules:\n- Only include clear action items (verbs like: do, call, email, schedule, research)\n- Rephrase as actionable tasks starting with verbs\n- If no tasks found, return empty array\n- Max 10 tasks`,
});

const taskExtractionFlow = ai.defineFlow(
  {
    name: 'taskExtractionFlow',
    inputSchema: TaskExtractionInputSchema,
    outputSchema: TaskExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
