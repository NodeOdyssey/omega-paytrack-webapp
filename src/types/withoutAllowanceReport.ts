type Deduction = {
  empESI: number;
  empEPF: number;
  adv: number;
  pTax: number;
};

type Other = {
  belt: number;
  boot: number;
  uniform: number;
};

// Define the type for the overall row data
export type WithoutAllowanceRow = {
  empName: string;
  rank: string;
  days: number;
  basicSalary: string;
  extraDuty: number;
  deduction: Deduction;
  other: Other;
  bonus: number;
  otherDeduction: number;
  totalDeduction: number;
  netPay: string;
};
