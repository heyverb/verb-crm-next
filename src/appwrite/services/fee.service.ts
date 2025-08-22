import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { FeeModel, FeePaymentModel } from "../schema/fee.schema";
import { PaymentStatus } from "../interface/fee.interface";

export type FeeInterface = FeeModel & Models.Document;
export type FeePaymentInterface = FeePaymentModel & Models.Document;

const FEE_COLLECTION = "fees"; // This should be added to appwriteConfig
const FEE_PAYMENT_COLLECTION = "feePayments"; // This should be added to appwriteConfig

export const createFee = async (data: FeeModel) => {
  try {
    const feeDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      FEE_COLLECTION,
      ID.unique(),
      data
    );

    return feeDoc as FeeInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getFees = async ({
  schoolId,
  academicYearId,
  type,
  isActive = true,
}: {
  schoolId: string;
  academicYearId?: string;
  type?: string;
  isActive?: boolean;
}) => {
  try {
    const queries = [
      Query.equal("schoolId", schoolId),
      Query.equal("isActive", isActive),
    ];
    
    if (academicYearId) {
      queries.push(Query.equal("academicYearId", academicYearId));
    }
    
    if (type) {
      queries.push(Query.equal("type", type));
    }
    
    queries.push(Query.orderAsc("name"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      FEE_COLLECTION,
      queries
    );
    
    return response.documents as FeeInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getFeeById = async (id: string): Promise<FeeInterface> => {
  try {
    const fee = await database.getDocument(
      appwriteConfig.databaseId!,
      FEE_COLLECTION,
      id
    );
    return fee as FeeInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getFeesByClass = async (classId: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      FEE_COLLECTION,
      [
        Query.equal("isActive", true),
        Query.search("classIds", classId),
      ]
    );
    
    return response.documents as FeeInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateFee = async (id: string, data: Partial<FeeModel>): Promise<FeeInterface> => {
  try {
    const updatedFee = await database.updateDocument(
      appwriteConfig.databaseId!,
      FEE_COLLECTION,
      id,
      data
    );
    return updatedFee as FeeInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteFee = async (id: string) => {
  try {
    // Soft delete by marking as inactive
    return await updateFee(id, { isActive: false });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createFeePayment = async (data: FeePaymentModel) => {
  try {
    // Generate receipt number
    const timestamp = Date.now();
    const receiptNumber = data.receiptNumber || `RCP-${timestamp}`;
    
    const paymentDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      FEE_PAYMENT_COLLECTION,
      ID.unique(),
      {
        ...data,
        receiptNumber,
      }
    );

    return paymentDoc as FeePaymentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getFeePayments = async ({
  studentId,
  feeId,
  status,
  startDate,
  endDate,
}: {
  studentId?: string;
  feeId?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queries = [];
    
    if (studentId) {
      queries.push(Query.equal("studentId", studentId));
    }
    
    if (feeId) {
      queries.push(Query.equal("feeId", feeId));
    }
    
    if (status) {
      queries.push(Query.equal("status", status));
    }
    
    if (startDate) {
      queries.push(Query.greaterThanEqual("paymentDate", startDate));
    }
    
    if (endDate) {
      queries.push(Query.lessThanEqual("paymentDate", endDate));
    }
    
    queries.push(Query.orderDesc("paymentDate"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      FEE_PAYMENT_COLLECTION,
      queries
    );
    
    return response.documents as FeePaymentInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getFeePaymentById = async (id: string): Promise<FeePaymentInterface> => {
  try {
    const payment = await database.getDocument(
      appwriteConfig.databaseId!,
      FEE_PAYMENT_COLLECTION,
      id
    );
    return payment as FeePaymentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateFeePayment = async (id: string, data: Partial<FeePaymentModel>): Promise<FeePaymentInterface> => {
  try {
    const updatedPayment = await database.updateDocument(
      appwriteConfig.databaseId!,
      FEE_PAYMENT_COLLECTION,
      id,
      data
    );
    return updatedPayment as FeePaymentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentDueFees = async (studentId: string, classId: string) => {
  try {
    // Get all fees applicable to the student's class
    const classFees = await getFeesByClass(classId);
    
    // Get all payments made by the student
    const payments = await getFeePayments({
      studentId,
      status: PaymentStatus.COMPLETED,
    });
    
    // Calculate due fees
    const dueFees = classFees.filter(fee => {
      const paidAmount = payments
        .filter(payment => payment.feeId === fee.$id)
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      return paidAmount < fee.amount;
    });
    
    return dueFees;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentPaymentHistory = async (studentId: string) => {
  try {
    return await getFeePayments({
      studentId,
      status: PaymentStatus.COMPLETED,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const calculateTotalFeesCollected = async (schoolId: string, startDate?: string, endDate?: string) => {
  try {
    const payments = await getFeePayments({
      status: PaymentStatus.COMPLETED,
      startDate,
      endDate,
    });
    
    return payments.reduce((total, payment) => total + payment.amount, 0);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const refundPayment = async (paymentId: string, remarks: string) => {
  try {
    return await updateFeePayment(paymentId, {
      status: PaymentStatus.REFUNDED,
      remarks,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};