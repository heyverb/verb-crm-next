import { z } from "zod";
import { Gender } from "../interface/user.interface";
import { TeacherStatus, TeacherQualification } from "../interface/teacher.interface";

export const TeacherSchema = z.object({
  userId: z.string(),
  employeeId: z.string().min(1, "Employee ID is required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  gender: z.nativeEnum(Gender),
  qualification: z.nativeEnum(TeacherQualification),
  specialization: z.array(z.string()).min(1, "At least one specialization is required"),
  experience: z.number().min(0, "Experience cannot be negative"),
  joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  aadharNumber: z.string().regex(/^[0-9]{12}$/, "Aadhar must be 12 digits").optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code").optional(),
  salary: z.number().positive("Salary must be positive").optional(),
  isClassTeacher: z.boolean().default(false),
  assignedClassId: z.string().optional(),
  status: z.nativeEnum(TeacherStatus).default(TeacherStatus.ACTIVE),
});

export type TeacherModel = z.infer<typeof TeacherSchema>;

export const TeacherDefaultValues: TeacherModel = {
  userId: "",
  employeeId: "",
  dateOfBirth: "",
  gender: Gender.MALE,
  qualification: TeacherQualification.BACHELOR,
  specialization: [],
  experience: 0,
  joiningDate: new Date().toISOString().split('T')[0],
  address: "",
  aadharNumber: "",
  panNumber: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  salary: undefined,
  isClassTeacher: false,
  assignedClassId: "",
  status: TeacherStatus.ACTIVE,
};