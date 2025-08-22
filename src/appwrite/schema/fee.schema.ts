import { z } from "zod";
import { FeeType, FeeFrequency, PaymentMethod, PaymentStatus } from "../interface/fee.interface";

export const FeeSchema = z.object({
  schoolId: z.string(),
  name: z.string().min(3, "Fee name must be at least 3 characters"),
  type: z.nativeEnum(FeeType),
  amount: z.number().positive("Amount must be positive"),
  frequency: z.nativeEnum(FeeFrequency),
  academicYearId: z.string(),
  classIds: z.array(z.string()).min(1, "At least one class must be selected"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const FeePaymentSchema = z.object({
  studentId: z.string(),
  feeId: z.string(),
  amount: z.number().positive("Amount must be positive"),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  transactionId: z.string().optional(),
  receiptNumber: z.string().min(1, "Receipt number is required"),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  remarks: z.string().optional(),
  collectedBy: z.string(),
});

export type FeeModel = z.infer<typeof FeeSchema>;
export type FeePaymentModel = z.infer<typeof FeePaymentSchema>;

export const FeeDefaultValues: FeeModel = {
  schoolId: "",
  name: "",
  type: FeeType.TUITION,
  amount: 0,
  frequency: FeeFrequency.MONTHLY,
  academicYearId: "",
  classIds: [],
  dueDate: "",
  description: "",
  isActive: true,
};

export const FeePaymentDefaultValues: FeePaymentModel = {
  studentId: "",
  feeId: "",
  amount: 0,
  paymentDate: new Date().toISOString().split('T')[0],
  paymentMethod: PaymentMethod.CASH,
  transactionId: "",
  receiptNumber: "",
  status: PaymentStatus.PENDING,
  remarks: "",
  collectedBy: "",
};