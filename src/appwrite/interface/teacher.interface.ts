import { Gender } from "./user.interface";

export enum TeacherStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  RESIGNED = "RESIGNED",
}

export enum TeacherQualification {
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  PHD = "PHD",
  DIPLOMA = "DIPLOMA",
  BED = "B.ED",
  MED = "M.ED",
  OTHER = "OTHER",
}

export interface ITeacher {
  userId: string;
  employeeId: string;
  dateOfBirth: string;
  gender: Gender;
  qualification: TeacherQualification;
  specialization: string[];
  experience: number;
  joiningDate: string;
  address: string;
  aadharNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  salary?: number;
  isClassTeacher: boolean;
  assignedClassId?: string;
  status: TeacherStatus;
}