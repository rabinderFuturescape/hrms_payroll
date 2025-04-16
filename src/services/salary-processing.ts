import { SalaryRule } from "./salary-rules";

interface Employee {
  id: string;
  name: string;
  baseSalary: number;
}

export class SalaryProcessingUseCase {
  constructor() {}

  async processSalary({ employee, salaryRules }: { employee: Employee; salaryRules: SalaryRule[] }): Promise<number> {
    let baseSalary = employee.baseSalary;
    let totalAllowance = 0.0;
    let totalDeduction = 0.0;

    for (const rule of salaryRules) {
      const amount = (rule.percentage / 100) * baseSalary;
      if (rule.type === "allowance") {
        totalAllowance += amount;
      } else if (rule.type === "deduction") {
        totalDeduction += amount;
      }
    }

    const grossSalary = baseSalary + totalAllowance;
    const netSalary = grossSalary - totalDeduction;
    return netSalary;
  }
}
