export enum FeeType {
  TUITION = "TUITION",
  ADMISSION = "ADMISSION",
  EXAM = "EXAM",
  TRANSPORT = "TRANSPORT",
  LIBRARY = "LIBRARY",
  LABORATORY = "LABORATORY",
  SPORTS = "SPORTS",
  HOSTEL = "HOSTEL",
  OTHER = "OTHER",
}

export enum FeeFrequency {
  ONE_TIME = "ONE_TIME",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  HALF_YEARLY = "HALF_YEARLY",
  ANNUALLY = "ANNUALLY",
}

export enum PaymentMethod {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  ONLINE = "ONLINE",
  BANK_TRANSFER = "BANK_TRANSFER",
  UPI = "UPI",
  CARD = "CARD",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_PAID = "PARTIALLY_PAID",
}

export interface IFee {
  schoolId: string;
  name: string;
  type: FeeType;
  amount: number;
  frequency: FeeFrequency;
  academicYearId: string;
  classIds: string[];
  dueDate?: string;
  description?: string;
  isActive: boolean;
}

export interface IFeePayment {
  studentId: string;
  feeId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  receiptNumber: string;
  status: PaymentStatus;
  remarks?: string;
  collectedBy: string;
}