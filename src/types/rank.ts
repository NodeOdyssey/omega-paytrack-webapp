export interface Rank {
  ID?: number & { __brand: 'unique' };
  designation: string;
  basicSalary: number;
  kitWashingAllowance?: number;
  cityAllowance?: number;
  conveyance?: number;
  hra?: number;
  vda?: number;
  uniformAllowance?: number;
  otherAllowance?: number;
  // added special allowance & weekly off
  specialAllowance?: number;
  weeklyOff?: number;
}
