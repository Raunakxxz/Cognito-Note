'use server';

/**
 * @fileOverview A flow that summarizes a note using AI.
 *
 * - summarizeNote - A function that summarizes the note content.
 * - SummarizeNoteInput - The input type for the summarizeNote function.
 * - SummarizeNoteOutput - The return type for the summarizeNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeNoteInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to summarize.'),
});

export type SummarizeNoteInput = z.infer<typeof SummarizeNoteInputSchema>;

const SummarizeNoteOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the note content.'),
  keyInsights: z.array(z.string()).describe('Key insights extracted from the note.'),
});

export type SummarizeNoteOutput = z.infer<typeof SummarizeNoteOutputSchema>;

export async function summarizeNote(input: SummarizeNoteInput): Promise<SummarizeNoteOutput> {
  return summarizeNoteFlow(input);
}

const summarizeNotePrompt = ai.definePrompt({
  name: 'summarizeNotePrompt',
  input: {schema: SummarizeNoteInputSchema},
  output: {schema: SummarizeNoteOutputSchema},
  prompt: `You are analyzing a user\'s note. Provide a concise summary and extract key insights.

Note content:
"""
{{{noteContent}}}
"""

Return ONLY a JSON object with this structure:
{
  "summary": "1-2 sentence summary",
  "keyInsights": ["insight 1", "insight 2", "insight 3"]
}

Rules:
- Summary must be under 50 words
- Key insights: 3-5 bullet points
- Extract what\'s actually written, don\'t invent
- Be concise and clear`,
});

const summarizeNoteFlow = ai.defineFlow(
  {
    name: 'summarizeNoteFlow',
    inputSchema: SummarizeNoteInputSchema,
    outputSchema: SummarizeNoteOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotePrompt(input);
    return output!;
  }
);
