export enum ClassStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export interface IClass {
  schoolId: string;
  name: string;
  grade: number;
  section?: string;
  academicYearId: string;
  classTeacherId?: string;
  roomNumber?: string;
  maxStrength: number;
  currentStrength: number;
  subjects: string[];
  status: ClassStatus;
}

export interface ISection {
  classId: string;
  name: string;
  maxStrength: number;
  currentStrength: number;
  classTeacherId?: string;
  status: ClassStatus;
}