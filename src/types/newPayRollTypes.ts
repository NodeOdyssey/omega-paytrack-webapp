type Deduction = {
  empEPF: number;
  empESI: number;
  emplrEPF: number;
  emplrESI: number;
};

// Define the type for each payroll row
export type NewPayrollRow = {
  empName: string;
  rank: string;
  days: number;
  basicSalary: number;
  uniform: number;
  bonus: number;
  total: number;
  extraDuty: number;
  deduction: Deduction;
  pTax: number;
  otherDeduction: number;
  totalDeduction: number;
  netPay: number;
  sign: string;
};
