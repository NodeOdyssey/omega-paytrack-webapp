// import { Post, Rank } from './otherModels'; // Assuming you have other models defined

export interface PostRankLink {
  ID?: number;
  postId: number;
  rankId: number;
  designation: string;
  basicSalary?: number;
  kitWashingAllowance?: number;
  cityAllowance?: number;
  conveyance?: number;
  hra?: number;
  vda?: number;
  uniformAllowance?: number;
  otherAllowance?: number;
  taxDeductionId: number;
  taxDeducName: string;
  // added special allowance & weekly off
  specialAllowance?: number;
  weeklyOff?: number;
  // createdAt?: Date;
  // updatedAt?: Date;
  // taxDeducName?: string;
  // taxDeductionPostRankLinkId?: number;
  // Post: Post;
  // Rank: Rank;
  // EmpPostRankLink: EmpPostRankLink[];
  // TaxDeductionPostRankLink: TaxDeductionPostRankLink[];
}
