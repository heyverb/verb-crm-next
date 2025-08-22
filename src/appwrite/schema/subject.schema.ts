import { z } from "zod";
import { SubjectType, SubjectStatus } from "../interface/subject.interface";

export const SubjectSchema = z.object({
  schoolId: z.string(),
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  code: z.string().min(2, "Subject code is required"),
  description: z.string().optional(),
  type: z.nativeEnum(SubjectType),
  credits: z.number().positive("Credits must be positive").optional(),
  isElective: z.boolean().default(false),
  minimumPassMarks: z.number().min(0).max(100, "Pass marks must be between 0 and 100"),
  maximumMarks: z.number().positive("Maximum marks must be positive"),
  status: z.nativeEnum(SubjectStatus).default(SubjectStatus.ACTIVE),
}).refine((data) => data.minimumPassMarks <= data.maximumMarks, {
  message: "Minimum pass marks cannot exceed maximum marks",
  path: ["minimumPassMarks"],
});

export type SubjectModel = z.infer<typeof SubjectSchema>;

export const SubjectDefaultValues: SubjectModel = {
  schoolId: "",
  name: "",
  code: "",
  description: "",
  type: SubjectType.THEORY,
  credits: undefined,
  isElective: false,
  minimumPassMarks: 40,
  maximumMarks: 100,
  status: SubjectStatus.ACTIVE,
};