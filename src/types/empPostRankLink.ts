export type EmpPostRankLink = {
  ID?: number & { __brand: 'unique' };
  empTableId: number;
  postRankLinkId: number;
  dateOfPosting: Date | null;
  status?: Status;
  dateOfDischarge?: Date | null;
  transferredFrom?: string;
  dateOfTransfer?: Date;
  transferredTo?: string;
  // reApplyDate?: Date;
  // dateOfRehire?: Date;
  // CreatedAt?: Date;
  // UpdatedAt?: Date;
};

export enum Status {
  // Active = 'Active',
  INACTIVE = 'Inactive',
  ACTIVE = 'Active',
  DISCHARGED = 'Discharged',
  ABSCONDED = 'Absconded',
  RESIGNED = 'Resigned',
  // DISCHARGED = 'Discharged',
}
