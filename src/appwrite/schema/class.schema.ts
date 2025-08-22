import { z } from "zod";
import { ClassStatus } from "../interface/class.interface";

export const ClassSchema = z.object({
  schoolId: z.string(),
  name: z.string().min(1, "Class name is required"),
  grade: z.number().min(1).max(12, "Grade must be between 1 and 12"),
  section: z.string().optional(),
  academicYearId: z.string(),
  classTeacherId: z.string().optional(),
  roomNumber: z.string().optional(),
  maxStrength: z.number().positive("Maximum strength must be positive"),
  currentStrength: z.number().min(0, "Current strength cannot be negative").default(0),
  subjects: z.array(z.string()).default([]),
  status: z.nativeEnum(ClassStatus).default(ClassStatus.ACTIVE),
});

export const SectionSchema = z.object({
  classId: z.string(),
  name: z.string().min(1, "Section name is required"),
  maxStrength: z.number().positive("Maximum strength must be positive"),
  currentStrength: z.number().min(0, "Current strength cannot be negative").default(0),
  classTeacherId: z.string().optional(),
  status: z.nativeEnum(ClassStatus).default(ClassStatus.ACTIVE),
});

export type ClassModel = z.infer<typeof ClassSchema>;
export type SectionModel = z.infer<typeof SectionSchema>;

export const ClassDefaultValues: ClassModel = {
  schoolId: "",
  name: "",
  grade: 1,
  section: "",
  academicYearId: "",
  classTeacherId: "",
  roomNumber: "",
  maxStrength: 40,
  currentStrength: 0,
  subjects: [],
  status: ClassStatus.ACTIVE,
};

export const SectionDefaultValues: SectionModel = {
  classId: "",
  name: "",
  maxStrength: 40,
  currentStrength: 0,
  classTeacherId: "",
  status: ClassStatus.ACTIVE,
};