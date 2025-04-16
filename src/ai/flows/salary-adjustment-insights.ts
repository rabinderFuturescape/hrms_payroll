'use server';
/**
 * @fileOverview Provides AI-driven salary adjustment insights based on employee performance data.
 *
 * - getSalaryAdjustmentInsights - A function that retrieves salary adjustment recommendations.
 * - SalaryAdjustmentInput - The input type for the getSalaryAdjustmentInsights function.
 * - SalaryAdjustmentOutput - The return type for the getSalaryAdjustmentInsights function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SalaryAdjustmentInputSchema = z.object({
  employeePerformanceData: z
    .string()
    .describe('Employee performance data including metrics like sales, project completion rate, and feedback scores.'),
});
export type SalaryAdjustmentInput = z.infer<typeof SalaryAdjustmentInputSchema>;

const SalaryAdjustmentOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('AI-driven recommendation for salary adjustment, including percentage increase or decrease and justification.'),
  justification: z
    .string()
    .describe('Detailed explanation of the recommendation based on the provided employee performance data.'),
});
export type SalaryAdjustmentOutput = z.infer<typeof SalaryAdjustmentOutputSchema>;

export async function getSalaryAdjustmentInsights(input: SalaryAdjustmentInput): Promise<SalaryAdjustmentOutput> {
  return salaryAdjustmentInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'salaryAdjustmentInsightsPrompt',
  input: {
    schema: z.object({
      employeePerformanceData: z
        .string()
        .describe('Employee performance data including metrics like sales, project completion rate, and feedback scores.'),
    }),
  },
  output: {
    schema: z.object({
      recommendation: z
        .string()
        .describe('AI-driven recommendation for salary adjustment, including percentage increase or decrease and justification.'),
      justification: z
        .string()
        .describe('Detailed explanation of the recommendation based on the provided employee performance data.'),
    }),
  },
  prompt: `You are an HR compensation expert. Analyze the provided employee performance data and provide a salary adjustment recommendation.

Employee Performance Data: {{{employeePerformanceData}}}

Based on this data, recommend a salary adjustment (percentage increase or decrease) and provide a justification for your recommendation. Be concise and specific.
`,
});

const salaryAdjustmentInsightsFlow = ai.defineFlow<
  typeof SalaryAdjustmentInputSchema,
  typeof SalaryAdjustmentOutputSchema
>(
  {
    name: 'salaryAdjustmentInsightsFlow',
    inputSchema: SalaryAdjustmentInputSchema,
    outputSchema: SalaryAdjustmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
