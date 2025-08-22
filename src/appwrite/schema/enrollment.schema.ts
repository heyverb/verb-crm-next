import { z } from "zod";
import { EnrollmentStatus } from "../interface/enrollment.interface";

export const EnrollmentSchema = z.object({
  studentId: z.string(),
  classId: z.string(),
  academicYearId: z.string(),
  enrollmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  enrollmentStatus: z.nativeEnum(EnrollmentStatus).default(EnrollmentStatus.ACTIVE),
  rollNumber: z.string().optional(),
  sectionId: z.string().optional(),
  subjects: z.array(z.string()).min(1, "At least one subject must be selected"),
});

export type EnrollmentModel = z.infer<typeof EnrollmentSchema>;

export const EnrollmentDefaultValues: EnrollmentModel = {
  studentId: "",
  classId: "",
  academicYearId: "",
  enrollmentDate: new Date().toISOString().split('T')[0],
  enrollmentStatus: EnrollmentStatus.ACTIVE,
  rollNumber: "",
  sectionId: "",
  subjects: [],
};