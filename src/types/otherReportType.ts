type Allowance = {
  kitAllowances: number;
  cityAllowances: number;
  convHra: number;
};

type Deduction = {
  empEPF: number;
  empESI: number;
  belt: number;
  adv: number;
  pTax: number;
  Uniform: number;
};

// Define the type for each report row
export type OtherReportRow = {
  empName: string;
  days: number;
  basicSalary: number;
  allowance: Allowance;
  grossPay: string;
  extraDuty: number;
  uniform: number;
  fourHourPay: number;
  specialAllowance: number;
  bonus: number;
  deduction: Deduction;
  netPay: string;
  sign: string;
};
