// Define types for the nested deduction object
type Deduction = {
  empEPF: number;
  pTax: number;
  empESI: number;
  emplrEPF: number;
  emplrESI: number;
};

// Define the type for each DSL report row
export type DSLReportRow = {
  empName: string;
  rank: string;
  days: number;
  eightHourPay: string;
  vda: string;
  uniform: string;
  hra: string;
  total: number;
  extraDuty: number;
  adv: number;
  deduction: Deduction;
  totalDeduction: number;
  netPay: string;
  sign: string;
};
