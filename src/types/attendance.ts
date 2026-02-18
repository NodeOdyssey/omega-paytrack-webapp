import { ReportName } from './report';

export interface Attendance {
  ID?: number & { __brand: 'unique' };
  empPostRankLinkId: number;
  empId: string;
  empName?: string;
  rank?: string;
  month: number;
  year: number;
  daysPresent: number;
  daysAbsent: number;
  extraDutyFourHr?: number;
  extraDutyEightHr?: number;
}

export interface AttendanceSchedule {
  ID?: number & { __brand: 'unique' };
  empPostRankLinkId: number & { __brand: 'unique' };
  empId: string;
  empName: string;
  rank: string;
  month: number;
  year: number;
  daysPresent: number;
  daysAbsent: number;
  extraDutyFourHr?: number;
  extraDutyEightHr?: number;
}

export interface AttendanceStatuses {
  // ID?: number & { __brand: 'unique' };
  postId: number;
  postName: string;
  status: string;
}
export interface AttendanceDocuments {
  ID?: number & { __brand: 'unique' };
  docAttendance?: string | File;
  postId: number;
  month: number;
  year: number;
}

export interface AttendanceAndPayrollStatuses {
  ID?: number & { __brand: 'unique' };
  postId: number;
  postName: string;
  attendanceStatus: string;
  payrollStatus: string;
  reportName: ReportName;
}
