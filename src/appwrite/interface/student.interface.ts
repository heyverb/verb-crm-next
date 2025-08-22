import { Gender, BloodGroup } from "./user.interface";

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  GRADUATED = "GRADUATED",
  TRANSFERRED = "TRANSFERRED",
  DROPPED = "DROPPED",
}

export interface IStudent {
  userId: string;
  admissionNumber: string;
  rollNumber?: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContact: string;
  currentClassId: string;
  sectionId?: string;
  admissionDate: string;
  previousSchool?: string;
  aadharNumber?: string;
  status: StudentStatus;
}