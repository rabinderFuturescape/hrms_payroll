# **App Name**: HR Payroll Pilot

## Core Features:

- Salary Rule Configuration: Define salary rules with allowances and deductions as percentages of base salary.
- Salary Processing: Process an employee's salary based on their base salary and configured salary rules.
- Salary Rule Form: Display a form for configuring salary rules, including fields for allowances and deductions.
- Net Salary Display: Show the calculated net salary after processing.
- AI-Driven Salary Insights: Use an AI tool to provide recommendations for salary adjustments based on employee performance metrics (mock data).

## Style Guidelines:

- Primary color: Teal (#008080) for a professional and trustworthy feel.
- Secondary color: Light Gray (#F0F0F0) for backgrounds and neutral elements.
- Accent: Gold (#FFD700) for highlighting important actions and information.
- Clean and readable sans-serif fonts for all text elements.
- Use simple and professional icons for actions and information.
- Clear and organized layout with sufficient spacing for readability.

## Original User Request:
An app module for HRMS System that calculates payroll, on TDD principles and methodology.
Payroll Module – Salary Rules Configuration and Salary Processing

1. Define the Domain Layer

Task:
Write a failing unit test for the salary processing use case. The test should cover:
	•	The creation and application of multiple salary rules (for example, basic pay, deductions, allowances).
	•	Correct processing of an employee’s salary based on their salary structure and the configured rules.
	•	Handling edge cases (e.g., negative values, missing data).

Test Prompt:

File: test/domain/usecases/salary_processing_usecase_test.dart

Content:
import 'package:flutter_test/flutter_test.dart';
import 'package:hrms_app/domain/entities/salary_rule.dart';
import 'package:hrms_app/domain/entities/employee.dart';
import 'package:hrms_app/domain/usecases/salary_processing_usecase.dart';

void main() {
  group('SalaryProcessingUseCase', () {
    test('should process salary applying all configured rules and produce correct net salary', () async {
      // Arrange:
      // Create a sample employee
      final employee = Employee(
        id: 'emp001',
        name: 'John Doe',
        baseSalary: 50000.0,
      );

      // Define salary rules
      // Example: 10% allowance, 5% deduction for tax
      final salaryRules = <SalaryRule>[
        SalaryRule(
          id: 'allowance_01',
          name: 'House Allowance',
          type: SalaryRuleType.allowance,
          percentage: 10, // 10%
        ),
        SalaryRule(
          id: 'deduction_01',
          name: 'Tax Deduction',
          type: SalaryRuleType.deduction,
          percentage: 5, // 5%
        ),
      ];

      // Create use case instance with a stubbed repository (or dummy repository implementation)
      final useCase = SalaryProcessingUseCase(/* inject dummy repository or leave as is for now */);

      // Act: Process salary
      final netSalary = await useCase.processSalary(employee: employee, salaryRules: salaryRules);

      // Expected calculation:
      // Gross Salary = baseSalary + allowance (10% of 50000 = 5000) = 55000
      // Net Salary = Gross Salary - deduction (5% of 50000 = 2500) = 55000 - 2500 = 52500

      // Assert: Check that netSalary equals 52500
      expect(netSalary, equals(52500.0));
    });
  });
}
Note: At this point, this test should fail because the implementation for SalaryProcessingUseCase does not exist or returns unexpected results.

⸻

2. Implement the Domain Entities and Use Case

Task:
Create the domain entities for SalaryRule and Employee along with an enumeration for the type of salary rule (allowance vs. deduction). Then, create the skeleton for the SalaryProcessingUseCase with an interface method processSalary.

Files and Prompts:

File: lib/domain/entities/employee.dart

Content:
class Employee {
  final String id;
  final String name;
  final double baseSalary;

  Employee({
    required this.id,
    required this.name,
    required this.baseSalary,
  });
}
File: lib/domain/entities/salary_rule.dart

Content:
enum SalaryRuleType {
  allowance,
  deduction,
}

class SalaryRule {
  final String id;
  final String name;
  final SalaryRuleType type;
  final double percentage;

  SalaryRule({
    required this.id,
    required this.name,
    required this.type,
    required this.percentage,
  });
}
File: lib/domain/usecases/salary_processing_usecase.dart

Content (Initial stub):
import '../entities/employee.dart';
import '../entities/salary_rule.dart';

class SalaryProcessingUseCase {
  // You can later inject a repository if you decide to persist or retrieve salary configurations.
  SalaryProcessingUseCase();

  /// Process employee salary based on their baseSalary and salary rules.
  /// Returns the calculated net salary.
  Future<double> processSalary({
    required Employee employee,
    required List<SalaryRule> salaryRules,
  }) async {
    // Temporarily, just return employee.baseSalary to fail the test.
    return employee.baseSalary;
  }
}
Note: Running tests now should fail, confirming TDD principles.

⸻

3. Develop Business Logic for Salary Processing

Task:
Update the processSalary method to implement the calculation as per the test requirements:
	•	Calculate the allowance: add a percentage of the base salary.
	•	Calculate deductions: subtract a percentage of the base salary.
	•	Return the net salary.

Development Prompt:

File: lib/domain/usecases/salary_processing_usecase.dart

Updated Content:
import '../entities/employee.dart';
import '../entities/salary_rule.dart';

class SalaryProcessingUseCase {
  SalaryProcessingUseCase();

  Future<double> processSalary({
    required Employee employee,
    required List<SalaryRule> salaryRules,
  }) async {
    double baseSalary = employee.baseSalary;
    double totalAllowance = 0.0;
    double totalDeduction = 0.0;

    // Iterate over each salary rule and apply it
    for (var rule in salaryRules) {
      double amount = (rule.percentage / 100) * baseSalary;
      if (rule.type == SalaryRuleType.allowance) {
        totalAllowance += amount;
      } else if (rule.type == SalaryRuleType.deduction) {
        totalDeduction += amount;
      }
    }

    double grossSalary = baseSalary + totalAllowance;
    double netSalary = grossSalary - totalDeduction;
    return netSalary;
  }
}
flutter test
The salary processing test should now pass.

⸻

4. Create Widget Tests for Payroll UI (Using bdd_widget_test)

Task:
Write a BDD-style widget test for the Payroll module’s salary processing screen. The widget should allow HR to configure salary rules and trigger salary processing. Start by writing failing tests that expect:
	•	A form to configure salary rules.
	•	A submission button that triggers processing.
	•	Display of calculated net salary.

Test Prompt:

File: test/presentation/widgets/payroll_widget_test.dart

Content:
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bdd_widget_test/bdd_widget_test.dart';
import 'package:hrms_app/presentation/pages/payroll_page.dart';

void main() {
  group('Payroll Module Widget Tests', () {
    testWidgets('should display form for salary rules configuration and show processed salary', (tester) async {
      // Arrange: load the PayrollPage widget in the test harness.
      await tester.pumpWidget(
        MaterialApp(
          home: PayrollPage(),
        ),
      );

      // Act & Assert:
      // Check for a text field or drop-down for each salary rule
      expect(find.text('House Allowance'), findsOneWidget);
      expect(find.text('Tax Deduction'), findsOneWidget);

      // Simulate tapping a "Process Salary" button
      final processButton = find.byKey(const Key('processSalaryButton'));
      expect(processButton, findsOneWidget);
      await tester.tap(processButton);
      await tester.pumpAndSettle();

      // Check that the processed salary is displayed (as net salary)
      // Since business logic is now implemented, we expect a net salary value, e.g., 'Net Salary: 52500.0'
      expect(find.textContaining('Net Salary:'), findsOneWidget);
    });
  });
}
Note: At this point, the widget test should fail because PayrollPage hasn’t been implemented yet.

⸻

5. Implement the PayrollPage and Related Widgets

Task:
Based on the test expectations, create a new page (e.g., PayrollPage) under the presentation layer. The page should:
	•	Show configurable fields for salary rules (you may use pre-populated configurations).
	•	Provide a submit/process button.
	•	Display the calculated net salary once processed.
	•	Integrate the SalaryProcessingUseCase.

Development Prompt:

File: lib/presentation/pages/payroll_page.dart

Initial Content:
import 'package:flutter/material.dart';
import 'package:hrms_app/domain/entities/employee.dart';
import 'package:hrms_app/domain/entities/salary_rule.dart';
import 'package:hrms_app/domain/usecases/salary_processing_usecase.dart';

class PayrollPage extends StatefulWidget {
  const PayrollPage({Key? key}) : super(key: key);

  @override
  State<PayrollPage> createState() => _PayrollPageState();
}

class _PayrollPageState extends State<PayrollPage> {
  final SalaryProcessingUseCase _useCase = SalaryProcessingUseCase();
  double? _netSalary;

  // Hard-coded employee data and salary rules for demo purposes.
  final Employee _employee = Employee(id: 'emp001', name: 'John Doe', baseSalary: 50000.0);
  final List<SalaryRule> _salaryRules = [
    SalaryRule(
      id: 'allowance_01',
      name: 'House Allowance',
      type: SalaryRuleType.allowance,
      percentage: 10,
    ),
    SalaryRule(
      id: 'deduction_01',
      name: 'Tax Deduction',
      type: SalaryRuleType.deduction,
      percentage: 5,
    ),
  ];

  void _processSalary() async {
    final result = await _useCase.processSalary(employee: _employee, salaryRules: _salaryRules);
    setState(() {
      _netSalary = result;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payroll Module')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Configure Salary Rules:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            // For demonstration, display rule names
            ..._salaryRules.map((rule) => Text(rule.name)).toList(),
            const SizedBox(height: 16),
            ElevatedButton(
              key: const Key('processSalaryButton'),
              onPressed: _processSalary,
              child: const Text('Process Salary'),
            ),
            const SizedBox(height: 16),
            if (_netSalary != null)
              Text('Net Salary: $_netSalary', style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
Note: Implement the UI so that it meets the expectations from the widget test. Once the code is in place, run your tests with:
flutter test
Confirm that the payroll widget test now passes.

⸻

6. Continuous Integration and Further Development

Task:
	•	Integrate with your CI pipeline to ensure tests run on each commit.
	•	Refactor code as necessary to adhere to clean architecture principles: separate the presentation logic (maybe using a BLoC or Provider) from the UI code, and keep the domain layer isolated.
	•	Eventually, implement a dynamic form or configuration screen for HR users to add/edit salary rules instead of hard-coding. This can follow the same TDD steps:
	•	Write failing widget and unit tests.
	•	Create domain entities and repository functions.
	•	Implement the UI integration.

⸻

Final Recommendations
	•	Iterative Development:
Follow the TDD loop: write a failing test, implement minimal logic, run tests, refactor, and repeat for each new feature.
	•	Focus on Clean Architecture:
Keep your business logic (salary processing) within the domain and use cases, isolated from the UI.
	•	UX Enhancements:
Later integrate animated transitions for error messages or results display using animated_text_kit once the module’s functionality is stable.
  