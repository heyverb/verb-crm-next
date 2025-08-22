import { z } from "zod";
import { Gender, BloodGroup } from "../interface/user.interface";
import { StudentStatus } from "../interface/student.interface";

export const StudentSchema = z.object({
  userId: z.string(),
  admissionNumber: z.string().min(1, "Admission number is required"),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  gender: z.nativeEnum(Gender),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  parentName: z.string().min(2, "Parent name is required"),
  parentPhone: z.string().regex(/^[0-9]{10}$/, "Parent phone must be 10 digits"),
  parentEmail: z.string().email("Please enter a valid email").optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().regex(/^[0-9]{10}$/, "Guardian phone must be 10 digits").optional(),
  emergencyContact: z.string().regex(/^[0-9]{10}$/, "Emergency contact must be 10 digits"),
  currentClassId: z.string(),
  sectionId: z.string().optional(),
  admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  previousSchool: z.string().optional(),
  aadharNumber: z.string().regex(/^[0-9]{12}$/, "Aadhar must be 12 digits").optional(),
  status: z.nativeEnum(StudentStatus).default(StudentStatus.ACTIVE),
});

export type StudentModel = z.infer<typeof StudentSchema>;

export const StudentDefaultValues: StudentModel = {
  userId: "",
  admissionNumber: "",
  rollNumber: "",
  dateOfBirth: "",
  gender: Gender.MALE,
  bloodGroup: undefined,
  address: "",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  guardianName: "",
  guardianPhone: "",
  emergencyContact: "",
  currentClassId: "",
  sectionId: "",
  admissionDate: new Date().toISOString().split('T')[0],
  previousSchool: "",
  aadharNumber: "",
  status: StudentStatus.ACTIVE,
};