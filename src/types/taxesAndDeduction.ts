export interface TaxesAndDeduction {
  ID?: number & { __brand: 'unique' };
  taxDeducName: string;
  pTax: number; // Using number to represent Decimal
  esi: number;
  epf: number;
  employerEsi: number;
  employerEpf: number;
  // uniformDeduction: number;
  // otherDeduction: number;
}

export interface TaxDeductionPostRankLink {
  ID?: number & { __brand: 'unique' };
  taxDeductionID: number;
  postRankLinkId: number;
  designation: string;
  taxDeducName: string;
  basicSalary: number;
}
