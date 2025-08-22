import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { EnrollmentModel } from "../schema/enrollment.schema";
import { EnrollmentStatus } from "../interface/enrollment.interface";
import { incrementClassStrength, decrementClassStrength } from "./class.service";

export type EnrollmentInterface = EnrollmentModel & Models.Document;

const ENROLLMENT_COLLECTION = "enrollments"; // This should be added to appwriteConfig

export const createEnrollment = async (data: EnrollmentModel) => {
  try {
    const enrollmentDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      ENROLLMENT_COLLECTION,
      ID.unique(),
      data
    );

    // Increment class strength when student is enrolled
    await incrementClassStrength(data.classId, data.sectionId);

    return enrollmentDoc as EnrollmentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getEnrollments = async ({
  studentId,
  classId,
  academicYearId,
  status,
}: {
  studentId?: string;
  classId?: string;
  academicYearId?: string;
  status?: EnrollmentStatus;
}) => {
  try {
    const queries = [];
    
    if (studentId) {
      queries.push(Query.equal("studentId", studentId));
    }
    
    if (classId) {
      queries.push(Query.equal("classId", classId));
    }
    
    if (academicYearId) {
      queries.push(Query.equal("academicYearId", academicYearId));
    }
    
    if (status) {
      queries.push(Query.equal("enrollmentStatus", status));
    }
    
    queries.push(Query.orderDesc("enrollmentDate"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      ENROLLMENT_COLLECTION,
      queries
    );
    
    return response.documents as EnrollmentInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getEnrollmentById = async (id: string): Promise<EnrollmentInterface> => {
  try {
    const enrollment = await database.getDocument(
      appwriteConfig.databaseId!,
      ENROLLMENT_COLLECTION,
      id
    );
    return enrollment as EnrollmentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentEnrollment = async (studentId: string, academicYearId: string): Promise<EnrollmentInterface | null> => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      ENROLLMENT_COLLECTION,
      [
        Query.equal("studentId", studentId),
        Query.equal("academicYearId", academicYearId),
        Query.equal("enrollmentStatus", EnrollmentStatus.ACTIVE),
      ]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return response.documents[0] as EnrollmentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateEnrollment = async (id: string, data: Partial<EnrollmentModel>): Promise<EnrollmentInterface> => {
  try {
    const updatedEnrollment = await database.updateDocument(
      appwriteConfig.databaseId!,
      ENROLLMENT_COLLECTION,
      id,
      data
    );
    return updatedEnrollment as EnrollmentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const transferStudent = async (
  enrollmentId: string,
  newClassId: string,
  newSectionId?: string
) => {
  try {
    const enrollment = await getEnrollmentById(enrollmentId);
    
    // Decrement strength from old class
    await decrementClassStrength(enrollment.classId, enrollment.sectionId);
    
    // Update enrollment with new class
    const updatedEnrollment = await updateEnrollment(enrollmentId, {
      classId: newClassId,
      sectionId: newSectionId,
    });
    
    // Increment strength in new class
    await incrementClassStrength(newClassId, newSectionId);
    
    return updatedEnrollment;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const completeEnrollment = async (enrollmentId: string) => {
  try {
    const enrollment = await getEnrollmentById(enrollmentId);
    
    // Update enrollment status
    const updatedEnrollment = await updateEnrollment(enrollmentId, {
      enrollmentStatus: EnrollmentStatus.COMPLETED,
    });
    
    // Decrement class strength
    await decrementClassStrength(enrollment.classId, enrollment.sectionId);
    
    return updatedEnrollment;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const dropStudent = async (enrollmentId: string) => {
  try {
    const enrollment = await getEnrollmentById(enrollmentId);
    
    // Update enrollment status
    const updatedEnrollment = await updateEnrollment(enrollmentId, {
      enrollmentStatus: EnrollmentStatus.DROPPED,
    });
    
    // Decrement class strength
    await decrementClassStrength(enrollment.classId, enrollment.sectionId);
    
    return updatedEnrollment;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClassEnrollmentCount = async (classId: string, academicYearId: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      ENROLLMENT_COLLECTION,
      [
        Query.equal("classId", classId),
        Query.equal("academicYearId", academicYearId),
        Query.equal("enrollmentStatus", EnrollmentStatus.ACTIVE),
      ]
    );
    
    return response.total;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};