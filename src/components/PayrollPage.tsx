"use client";

import { SalaryProcessingUseCase } from "@/services/salary-processing";
import { SalaryRule } from "@/services/salary-rules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Employee {
  id: string;
  name: string;
  baseSalary: number;
}

const PayrollPage = () => {
  const [netSalary, setNetSalary] = useState<number | null>(null);

  const employee: Employee = {
    id: "emp001",
    name: "John Doe",
    baseSalary: 50000.0,
  };

  const salaryRules: SalaryRule[] = [
    {
      id: "allowance_01",
      name: "House Allowance",
      type: "allowance",
      percentage: 10,
    },
    {
      id: "deduction_01",
      name: "Tax Deduction",
      type: "deduction",
      percentage: 5,
    },
  ];

  const processSalary = async () => {
    const useCase = new SalaryProcessingUseCase();
    const calculatedNetSalary = await useCase.processSalary({ employee, salaryRules });
    setNetSalary(calculatedNetSalary);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Module</CardTitle>
          <CardDescription>Configure salary rules and process employee salary.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Salary Rules:</h2>
            {salaryRules.map((rule) => (
              <div key={rule.id} className="mb-2">
                {rule.name} ({rule.type}): {rule.percentage}%
              </div>
            ))}
          </div>

          <Button onClick={processSalary} className="bg-primary text-primary-foreground hover:bg-primary/80">
            Process Salary
          </Button>

          {netSalary !== null && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Net Salary:</h2>
              <p>{netSalary.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPage;
