export interface Employee {
  ID?: number & { __brand: 'unique' };
  empId: string;
  empName: string;
  fatherName?: string;
  motherName?: string;
  gender: string;
  dob: string | null;
  phoneNum: string;
  altPhoneNum?: string;
  villTown: string;
  postOffice: string;
  policeStation: string;
  district: string;
  pinCode: string;
  state: string;
  qualification: string;
  height?: number;
  idMark?: string;
  bankName: string;
  accNum: string;
  ifsc: string;
  epfNo?: string;
  esiNo?: string;
  pan: string;
  aadhaarNo: string;
  dateOfJoining: string | null;
  bloodGroup?: string | null;
  dateOfRejoining: string | null;
  remarks?: string;
  // empStatus?: EmployeeStatus;
  isPosted: boolean;
  profilePhoto?: string | File;
}

export interface EmployeeDocuments {
  ID?: number & { __brand: 'unique' };
  empName?: string;
  profilePhoto?: string | File;
  docContract?: string | File;
  docResume?: string | File;
  docPan?: string | File;
  docOther?: string | File;
  docAadhaar?: string | File;
}

export interface EmployeeTable {
  ID?: number & { __brand: 'unique' };
  empId: string;
  empName: string;
  postName: string;
  rank: string;
  gender: string;
  phoneNum: string;
  empStatus?: EmployeeStatus;
  postRankLinkId?: number;
  dateOfPosting?: Date | null;
  dateOfRejoining?: Date | null;
  dateOfResignation: Date | null;
  dateOfAbsconding: Date | null;
  dateOfDischarge: Date | null;
  dob?: string | null;
  fatherName?: string;
  profilePhoto?: string | File;
  bloodGroup?: string;
  idMark?: string;
  salaryAdvance?: number;
  noOfAdvancePayments?: number;
  advanceDetails?: {
    amount: number;
    paidOn: string;
    recordedAt: string;
  }[];
  // validFrom?: Date | null;
  // validTill: Date | null;
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ABSCONDED = 'Absconded',
  RESIGNED = 'Resigned',
  TRANSFERRED = 'Transferred',
  DISCHARGED = 'Discharged',
}

// export interface EmployeePostingHistoryType {
//   ID?: number;
//   postRankLinkId?: number;
//   postName?: string;
//   rank?: string;
//   dateOfPosting?: string;
//   dateOfTransfer?: string | null;
//   dateOfDischarge?: string | null;
//   dateOfResignation?: string | null;
//   dateOfAbsconding?: string | null;
// }

export type EmployeeSchedule = {
  ID?: number & { __brand: 'unique' };
  postRankLinkId: number;
  postName: string;
  rankName: string;
  status?: EmployeeStatus;
  dateOfPosting?: Date | null;
  dateOfTransfer?: Date | null;
  dateOfDischarge?: Date | null;
  dateOfResignation?: Date | null;
  dateOfAbsconding?: Date | null;
  dateOfRejoining?: Date | null;
};

export type EmployeeIdCardData = {
  empName: string;
  empId: string;
  rank: string;
  dob?: string;
  phoneNum?: string;
  fatherName?: string;
  profilePhoto?: string;
};
