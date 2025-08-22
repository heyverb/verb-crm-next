import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { TeacherModel } from "../schema/teacher.schema";
import { TeacherStatus } from "../interface/teacher.interface";
import { CreateNewUser } from "./user.service";
import { UserRole } from "../interface/user.interface";

export type TeacherInterface = TeacherModel & Models.Document;

export const createTeacher = async (data: TeacherModel & { 
  name: string; 
  email: string; 
  password: string; 
  schoolId: string;
  phone: string;
}) => {
  try {
    // First create the user account
    const user = await CreateNewUser({
      email: data.email,
      name: data.name,
      password: data.password,
      confirmPassword: data.password,
      role: UserRole.TEACHER,
      phone: data.phone,
      schoolId: data.schoolId,
    });

    // Then create the teacher profile
    const teacherDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      ID.unique(),
      {
        userId: user.$id,
        employeeId: data.employeeId,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        qualification: data.qualification,
        specialization: data.specialization,
        experience: data.experience,
        joiningDate: data.joiningDate,
        address: data.address,
        aadharNumber: data.aadharNumber,
        panNumber: data.panNumber,
        bankAccountNumber: data.bankAccountNumber,
        bankName: data.bankName,
        ifscCode: data.ifscCode,
        salary: data.salary,
        isClassTeacher: data.isClassTeacher,
        assignedClassId: data.assignedClassId,
        status: data.status || TeacherStatus.ACTIVE,
      }
    );

    return teacherDoc as TeacherInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeachers = async ({
  pageIndex = 0,
  pageSize = 10,
  status = TeacherStatus.ACTIVE,
  isClassTeacher,
}: {
  pageIndex?: number;
  pageSize?: number;
  status?: TeacherStatus;
  isClassTeacher?: boolean;
}) => {
  try {
    const queries = [Query.equal("status", status)];
    
    if (isClassTeacher !== undefined) {
      queries.push(Query.equal("isClassTeacher", isClassTeacher));
    }
    
    queries.push(Query.limit(pageSize));
    queries.push(Query.offset(pageIndex * pageSize));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      queries
    );
    
    return {
      teachers: response.documents as TeacherInterface[],
      total: response.total,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeacherById = async (id: string): Promise<TeacherInterface> => {
  try {
    const teacher = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      id
    );
    return teacher as TeacherInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeacherByUserId = async (userId: string): Promise<TeacherInterface | null> => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      [Query.equal("userId", userId)]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return response.documents[0] as TeacherInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTeacher = async (id: string, data: Partial<TeacherModel>): Promise<TeacherInterface> => {
  try {
    const updatedTeacher = await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      id,
      data
    );
    return updatedTeacher as TeacherInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteTeacher = async (id: string) => {
  try {
    // Soft delete by updating status
    return await updateTeacher(id, { status: TeacherStatus.INACTIVE });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTeachersBySpecialization = async (specialization: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      [
        Query.equal("status", TeacherStatus.ACTIVE),
        Query.search("specialization", specialization),
      ]
    );
    
    return response.documents as TeacherInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAvailableClassTeachers = async () => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.teacherCollection!,
      [
        Query.equal("status", TeacherStatus.ACTIVE),
        Query.equal("isClassTeacher", false),
      ]
    );
    
    return response.documents as TeacherInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const assignClassToTeacher = async (teacherId: string, classId: string) => {
  try {
    return await updateTeacher(teacherId, {
      isClassTeacher: true,
      assignedClassId: classId,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};