import { z } from "zod";
import { ExamType, ExamStatus } from "../interface/exam.interface";

export const ExamSchema = z.object({
  schoolId: z.string(),
  name: z.string().min(3, "Exam name must be at least 3 characters"),
  type: z.nativeEnum(ExamType),
  academicYearId: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  totalMarks: z.number().positive("Total marks must be positive"),
  passingMarks: z.number().min(0, "Passing marks cannot be negative"),
  isPublished: z.boolean().default(false),
  status: z.nativeEnum(ExamStatus).default(ExamStatus.SCHEDULED),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
}).refine((data) => data.passingMarks <= data.totalMarks, {
  message: "Passing marks cannot exceed total marks",
  path: ["passingMarks"],
});

export const ExamScheduleSchema = z.object({
  examId: z.string(),
  classId: z.string(),
  subjectId: z.string(),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
  roomNumber: z.string().optional(),
  invigilatorId: z.string().optional(),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.startTime}`);
  const end = new Date(`2000-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const ResultSchema = z.object({
  studentId: z.string(),
  examId: z.string(),
  subjectId: z.string(),
  marksObtained: z.number().min(0, "Marks cannot be negative"),
  grade: z.string().optional(),
  remarks: z.string().optional(),
  isPass: z.boolean(),
  evaluatedBy: z.string(),
});

export type ExamModel = z.infer<typeof ExamSchema>;
export type ExamScheduleModel = z.infer<typeof ExamScheduleSchema>;
export type ResultModel = z.infer<typeof ResultSchema>;

export const ExamDefaultValues: ExamModel = {
  schoolId: "",
  name: "",
  type: ExamType.UNIT_TEST,
  academicYearId: "",
  startDate: "",
  endDate: "",
  totalMarks: 100,
  passingMarks: 40,
  isPublished: false,
  status: ExamStatus.SCHEDULED,
};

export const ExamScheduleDefaultValues: ExamScheduleModel = {
  examId: "",
  classId: "",
  subjectId: "",
  examDate: "",
  startTime: "",
  endTime: "",
  roomNumber: "",
  invigilatorId: "",
};

export const ResultDefaultValues: ResultModel = {
  studentId: "",
  examId: "",
  subjectId: "",
  marksObtained: 0,
  grade: "",
  remarks: "",
  isPass: false,
  evaluatedBy: "",
};