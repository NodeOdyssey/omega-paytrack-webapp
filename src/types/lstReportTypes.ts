// Define types for the nested deduction object
type Deduction = {
  empEPF: number;
  pTax: number;
  empESI: number;
  emplrEPF: number;
  emplrESI: number;
};

// Define the type for each LST report row
export type LSTReportRow = {
  empName: string;
  rank: string;
  days: number;
  eightHourPay: string;
  vda: string;
  uniform: string;
  specialAllowance: string;
  weeklyOff: string;
  total: number;
  extraDuty: number;
  adv: number;
  deduction: Deduction;
  totalDeduction: number;
  netPay: string;
  sign: string;
};
