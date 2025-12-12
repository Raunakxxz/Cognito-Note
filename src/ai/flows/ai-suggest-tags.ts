'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tags for a note.
 *
 * It includes:
 * - `suggestTags`: A function that suggests tags for a given note content.
 * - `SuggestTagsInput`: The input type for the `suggestTags` function.
 * - `SuggestTagsOutput`: The output type for the `suggestTags` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to suggest tags for.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('An array of suggested tags for the note.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are suggesting organizational tags for a note.

Note content:
"""
{{{noteContent}}}
"""

Return ONLY a JSON object:
{
  "suggestedTags": ["tag1", "tag2", "tag3"]
}

Rules:
- Suggest 3-5 relevant tags
- Tags should be lowercase, single words or hyphenated phrases
- Focus on topics, categories, projects
- Don't include overly generic tags like "note" or "text"
- Examples: "meeting", "project-alpha", "research", "client-work"`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
