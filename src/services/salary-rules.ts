/**
 * Represents a salary rule with details such as name, type, and percentage.
 */
export interface SalaryRule {
  /**
   * The unique identifier of the salary rule.
   */
  id: string;
  /**
   * The name of the salary rule.
   */
  name: string;
  /**
   * The type of the salary rule, either 'allowance' or 'deduction'.
   */
  type: 'allowance' | 'deduction';
  /**
   * The percentage associated with the salary rule.
   */
  percentage: number;
}

/**
 * Asynchronously retrieves all salary rules.
 *
 * @returns A promise that resolves to an array of SalaryRule objects.
 */
export async function getSalaryRules(): Promise<SalaryRule[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      id: 'allowance_01',
      name: 'House Allowance',
      type: 'allowance',
      percentage: 10,
    },
    {
      id: 'deduction_01',
      name: 'Tax Deduction',
      type: 'deduction',
      percentage: 5,
    },
  ];
}
