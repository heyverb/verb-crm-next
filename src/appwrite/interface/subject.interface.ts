export enum SubjectType {
  THEORY = "THEORY",
  PRACTICAL = "PRACTICAL",
  BOTH = "BOTH",
}

export enum SubjectStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ISubject {
  schoolId: string;
  name: string;
  code: string;
  description?: string;
  type: SubjectType;
  credits?: number;
  isElective: boolean;
  minimumPassMarks: number;
  maximumMarks: number;
  status: SubjectStatus;
}