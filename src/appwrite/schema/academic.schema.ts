import { z } from "zod";
import { AttendanceStatus } from "../interface/academic.interface";

export const AcademicYearSchema = z.object({
  schoolId: z.string(),
  name: z.string().min(3, "Academic year name must be at least 3 characters"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  isCurrent: z.boolean().default(false),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const AttendanceSchema = z.object({
  studentId: z.string(),
  classId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().optional(),
  markedBy: z.string(),
});

export type AcademicYearModel = z.infer<typeof AcademicYearSchema>;
export type AttendanceModel = z.infer<typeof AttendanceSchema>;

export const AcademicYearDefaultValues: AcademicYearModel = {
  schoolId: "",
  name: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

export const AttendanceDefaultValues: AttendanceModel = {
  studentId: "",
  classId: "",
  date: new Date().toISOString().split('T')[0],
  status: AttendanceStatus.PRESENT,
  remarks: "",
  markedBy: "",
};