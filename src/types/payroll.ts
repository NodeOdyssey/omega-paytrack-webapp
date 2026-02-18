export interface PayrollResponse {
  status: number;
  success: boolean;
  message: string;
  payrolls: Payroll[];
}

export interface Payroll {
  ID: number & { __brand: 'unique' };
  empName: string;
  empId: string;
  post: string;
  rank: string;
  workingDays: number;
  basicSalary: number;
  fourHourPay: number;
  eightHourPay: number;
  extraDuty: number;
  hra: number;
  vda: number;
  conveyance: number;
  uniformAllowance: number;
  kitWashingAllowance: number;
  cityAllowance: number;
  bonus: number;
  otherAllowance: number;
  specialAllowance: number;
  grossPay: number;
  advance: number;
  esi: number;
  epf: number;
  totalDeduction: number;
  otherDeduction: number;
  weeklyOff: number;
  pTax: number;
  netPay: number;
  beltDeduction: number;
  bootDeduction: number;
  uniformDeduction: number;
}

export interface PayrollUpdate {
  ID?: number & { __brand: 'unique' };
  bonus: number;
  extraDuty: number;
  advance: number;
  beltDeduction: number;
  bootDeduction: number;
  specialAllowance: number;
  uniformDeduction: number;
  otherDeduction: number;
  weeklyOff: number;
  esi: number;
  pTax: number;
}

export interface PayrollStatuses {
  // ID?: number & { __brand: 'unique' };
  postId: number;
  postName: string;
  status: string;
}
