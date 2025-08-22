import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { StudentModel } from "../schema/student.schema";
import { StudentStatus } from "../interface/student.interface";
import { CreateNewUser } from "./user.service";
import { UserRole } from "../interface/user.interface";

export type StudentInterface = StudentModel & Models.Document;

const STUDENT_COLLECTION = "students"; // This should be added to appwriteConfig

export const createStudent = async (data: StudentModel & { 
  name: string; 
  email: string; 
  password: string; 
  schoolId: string 
}) => {
  try {
    // First create the user account
    const user = await CreateNewUser({
      email: data.email,
      name: data.name,
      password: data.password,
      confirmPassword: data.password,
      role: UserRole.STUDENT,
      phone: data.parentPhone,
      schoolId: data.schoolId,
    });

    // Then create the student profile
    const studentDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      ID.unique(),
      {
        userId: user.$id,
        admissionNumber: data.admissionNumber,
        rollNumber: data.rollNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        emergencyContact: data.emergencyContact,
        currentClassId: data.currentClassId,
        sectionId: data.sectionId,
        admissionDate: data.admissionDate,
        previousSchool: data.previousSchool,
        aadharNumber: data.aadharNumber,
        status: data.status || StudentStatus.ACTIVE,
      }
    );

    return studentDoc as StudentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudents = async ({
  pageIndex = 0,
  pageSize = 10,
  classId,
  sectionId,
  status = StudentStatus.ACTIVE,
}: {
  pageIndex?: number;
  pageSize?: number;
  classId?: string;
  sectionId?: string;
  status?: StudentStatus;
}) => {
  try {
    const queries = [Query.equal("status", status)];
    
    if (classId) {
      queries.push(Query.equal("currentClassId", classId));
    }
    
    if (sectionId) {
      queries.push(Query.equal("sectionId", sectionId));
    }
    
    queries.push(Query.limit(pageSize));
    queries.push(Query.offset(pageIndex * pageSize));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      queries
    );
    
    return {
      students: response.documents as StudentInterface[],
      total: response.total,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentById = async (id: string): Promise<StudentInterface> => {
  try {
    const student = await database.getDocument(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      id
    );
    return student as StudentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentByUserId = async (userId: string): Promise<StudentInterface | null> => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      [Query.equal("userId", userId)]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return response.documents[0] as StudentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateStudent = async (id: string, data: Partial<StudentModel>): Promise<StudentInterface> => {
  try {
    const updatedStudent = await database.updateDocument(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      id,
      data
    );
    return updatedStudent as StudentInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteStudent = async (id: string) => {
  try {
    // Soft delete by updating status
    return await updateStudent(id, { status: StudentStatus.INACTIVE });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentsByClass = async (classId: string, sectionId?: string) => {
  try {
    const queries = [
      Query.equal("currentClassId", classId),
      Query.equal("status", StudentStatus.ACTIVE),
    ];
    
    if (sectionId) {
      queries.push(Query.equal("sectionId", sectionId));
    }
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      queries
    );
    
    return response.documents as StudentInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const searchStudents = async (searchTerm: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      STUDENT_COLLECTION,
      [
        Query.equal("status", StudentStatus.ACTIVE),
        Query.search("admissionNumber", searchTerm),
      ]
    );
    
    return response.documents as StudentInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};