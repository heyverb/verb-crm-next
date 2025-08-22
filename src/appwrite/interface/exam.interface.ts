export enum ExamType {
  UNIT_TEST = "UNIT_TEST",
  MID_TERM = "MID_TERM",
  FINAL = "FINAL",
  PRACTICAL = "PRACTICAL",
}

export enum ExamStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IExam {
  schoolId: string;
  name: string;
  type: ExamType;
  academicYearId: string;
  startDate: string;
  endDate: string;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  status: ExamStatus;
}

export interface IExamSchedule {
  examId: string;
  classId: string;
  subjectId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomNumber?: string;
  invigilatorId?: string;
}

export interface IResult {
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  isPass: boolean;
  evaluatedBy: string;
}