export interface IAcademicYear {
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  HOLIDAY = "HOLIDAY",
  LEAVE = "LEAVE",
  HALF_DAY = "HALF_DAY",
}

export interface IAttendance {
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
}