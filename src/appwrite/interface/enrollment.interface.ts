export enum EnrollmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED",
  TRANSFERRED = "TRANSFERRED",
}

export interface IEnrollment {
  studentId: string;
  classId: string;
  academicYearId: string;
  enrollmentDate: string;
  enrollmentStatus: EnrollmentStatus;
  rollNumber?: string;
  sectionId?: string;
  subjects: string[];
}