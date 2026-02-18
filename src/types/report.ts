export enum ReportName {
  NONE = 'None',
  VIEW_DS_REPORT = 'View DS Report',
  ESI_REPORT = 'ESI Report',
  EPF_REPORT = 'EPF Report',
  PTAX_REPORT = 'PTax Report',
  WITHOUT_ALLOWANCE_REPORT = 'Without Allowance Report',
  NEW_PAYROLL_REPORT = 'New Payroll Report',
  DSL_REPORT = 'DSL Report',
  LNT_REPORT = 'LNT Report',
  OTHERS_REPORT = 'Others Report',
  SALARY_REPORT = 'Salary Report',
}

export type ReportType = {
  type: number;
  name: ReportName;
  reportCode: string;
};
