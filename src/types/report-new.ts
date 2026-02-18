// View DS Report
export type ViewDSAllowances = {
  kitAllowances: number;
  cityAllowances: number;
  convHra: number;
};

export type ViewDSDeduction = {
  empESI: number;
  empEPF: number;
  adv: number;
  pTax: number;
};

export type ViewDSOther = {
  belt: number;
  boot: number;
  uniform: number;
};

export type DsReportRow = {
  slNo: number;
  empName: string;
  days: number;
  basicSalary: number;
  allowances: ViewDSAllowances;
  grossPay: number;
  extraDuty: number;
  deduction: ViewDSDeduction;
  other: ViewDSOther;
  otherDeduction: number;
  totalDeduction: number;
  netPay: number;
};

export type DsReportDataTableProps = {
  tableData: Array<DsReportRow>;
  selectedPostName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossPay: number;
  totalNetPay: number;
};

// Without Allowance Report
export type WithoutAllowanceDeduction = {
  empESI: number;
  empEPF: number;
  adv: number;
  pTax: number;
};

export type WithoutAllowanceOther = {
  belt: number;
  boot: number;
  uniform: number;
};

export type WithoutAllowanceRow = {
  slNo: number;
  empName: string;
  rank: string;
  days: number;
  basicSalary: number;
  extraDuty: number;
  deduction: WithoutAllowanceDeduction;
  other: WithoutAllowanceOther;
  bonus: number;
  otherDeduction: number;
  totalDeduction: number;
  netPay: number;
};

export type WithoutAllowanceReportTableProps = {
  tableData: Array<WithoutAllowanceRow>;
  selectedPostName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalBasicSalary: number;
  totalNetPay: number;
};

// New Payroll Report
export type NewPayrollDeduction = {
  empEPF: number;
  empESI: number;
  emplrEPF: number;
  emplrESI: number;
};

export type NewPayrollRow = {
  slNo: number;
  empName: string;
  rank: string;
  days: number;
  basicSalary: number;
  uniform: number;
  bonus: number;
  total: number;
  extraDuty: number;
  deduction: NewPayrollDeduction;
  pTax: number;
  otherDeduction: number;
  totalDeduction: number;
  netPay: number;
  sign?: string;
};

export interface NewPayrollReportTableProps {
  tableData: NewPayrollRow[];
  selectedPostName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalBasicSalary: number;
  totalNetPay: number;
}

// DSL Report
export type DSLReportDeduction = {
  empEPF: number;
  empESI: number;
  emplrEPF: number;
  emplrESI: number;
  pTax: number;
  // adv: number;
};

export type DSLReportRow = {
  slNo: number;
  empName: string;
  rank: string;
  days: number;
  eightHourPay: number;
  vda: number;
  uniform: number;
  hra: number;
  total: number;
  extraDuty: number;
  adv: number;
  deduction: DSLReportDeduction;
  totalDeduction: number;
  netPay: number;
  sign?: string;
};

export interface DSLReportTableProps {
  tableData: DSLReportRow[];
  selectedPostName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossPay: number;
  totalNetPay: number;
}

// LNT Report
export type LNTDeduction = {
  empEPF: number;
  empESI: number;
  emplrEPF: number;
  emplrESI: number;
  pTax: number;
  adv: number;
};

export type LNTRow = {
  slNo: number;
  empName: string;
  rank: string;
  days: number;
  eightHourPay: number;
  vda: number;
  uniform: number;
  specialAllowance: number;
  weeklyOff: number;
  total: number;
  extraDuty: number;
  adv: number;
  deduction: LNTDeduction;
  totalDeduction: number;
  netPay: number;
  sign?: string;
};

export interface LNTReportTableProps {
  tableData: LNTRow[];
  selectedPostName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalAllowance: number;
  totalNetPay: number;
}

// Others Report
export type OthersDeduction = {
  empESI: number;
  empEPF: number;
  adv: number;
  pTax: number;
  belt: number;
  Uniform: number;
};

export type OthersAllowance = {
  kitAllowances: number;
  cityAllowances: number;
  convHra: number;
};

export type OthersReportRow = {
  slNo: number;
  empName: string;
  days: number;
  basicSalary: number;
  allowance: OthersAllowance;
  grossPay: number;
  extraDuty: number;
  uniform: number;
  fourHourPay: number;
  specialAllowance: number;
  bonus: number;
  deduction: OthersDeduction;
  netPay: number;
  sign?: string;
};

export interface OthersReportTableProps {
  tableData: OthersReportRow[];
  selectedPostName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossPay: number;
  totalNetPay: number;
}

// EPF Report Types
export type EPFDeduction = {
  empEPF: number;
  emplrEPF: number;
};

export type EPFRow = {
  slNo: number;
  accNo: string;
  empName: string;
  days: number;
  basicSalary: number;
  empEPF: number;
  emplrEPF: number;
  total: number;
};

export interface EPFReportTableProps {
  tableData: EPFRow[];
  periodStartDate: string;
  periodEndDate: string;
  totalBasicSalary: number;
  grandTotalEpf: number;
}

// ESI Report Types
export type ESIRow = {
  slNo: number;
  accNo: string;
  empName: string;
  days: number;
  grossPay: number;
  empESI: number;
  emplrESI: number;
  total: number;
};

export interface ESIReportTableProps {
  tableData: ESIRow[];
  selectedPostName: string | null;
  periodStartDate: string;
  periodEndDate: string;
  totalGrossPay: number;
  grandTotalEsi: number;
}

// PTax Report Types
export interface PTaxRow {
  slNo: number;
  empName: string;
  postName: string;
  basicSalary: number;
  pTax: number;
}

export interface PTaxReportTableProps {
  tableData: PTaxRow[];
  periodStartDate: string;
  periodEndDate: string;
  totalBasicSalary: number;
  grandTotalPtax: number;
}

// Salary Report Types
export interface SalaryRow {
  slNo: number;
  empName: string;
  accountNum: string;
  ifsc: string;
  bankName: string;
  netPay: number;
  postName: string;
}

export interface SalaryReportTableProps {
  tableData: SalaryRow[];
  periodStartDate: string;
  periodEndDate: string;
  totalNetPay: number;
}
