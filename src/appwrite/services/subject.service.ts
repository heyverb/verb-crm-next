import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { SubjectModel } from "../schema/subject.schema";
import { SubjectStatus } from "../interface/subject.interface";

export type SubjectInterface = SubjectModel & Models.Document;

export const createSubject = async (data: SubjectModel) => {
  try {
    const subjectDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.subjectCollection!,
      ID.unique(),
      data
    );

    return subjectDoc as SubjectInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSubjects = async ({
  schoolId,
  isElective,
  status = SubjectStatus.ACTIVE,
}: {
  schoolId: string;
  isElective?: boolean;
  status?: SubjectStatus;
}) => {
  try {
    const queries = [
      Query.equal("schoolId", schoolId),
      Query.equal("status", status),
    ];
    
    if (isElective !== undefined) {
      queries.push(Query.equal("isElective", isElective));
    }
    
    queries.push(Query.orderAsc("name"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.subjectCollection!,
      queries
    );
    
    return response.documents as SubjectInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSubjectById = async (id: string): Promise<SubjectInterface> => {
  try {
    const subject = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.subjectCollection!,
      id
    );
    return subject as SubjectInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSubjectByCode = async (schoolId: string, code: string): Promise<SubjectInterface | null> => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.subjectCollection!,
      [
        Query.equal("schoolId", schoolId),
        Query.equal("code", code),
        Query.equal("status", SubjectStatus.ACTIVE),
      ]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return response.documents[0] as SubjectInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateSubject = async (id: string, data: Partial<SubjectModel>): Promise<SubjectInterface> => {
  try {
    const updatedSubject = await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.subjectCollection!,
      id,
      data
    );
    return updatedSubject as SubjectInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteSubject = async (id: string) => {
  try {
    // Soft delete by updating status
    return await updateSubject(id, { status: SubjectStatus.INACTIVE });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSubjectsByIds = async (subjectIds: string[]): Promise<SubjectInterface[]> => {
  try {
    const subjects: SubjectInterface[] = [];
    
    // Fetch subjects in batches to avoid query limitations
    const batchSize = 10;
    for (let i = 0; i < subjectIds.length; i += batchSize) {
      const batch = subjectIds.slice(i, i + batchSize);
      const response = await database.listDocuments(
        appwriteConfig.databaseId!,
        appwriteConfig.subjectCollection!,
        [Query.equal("$id", batch)]
      );
      subjects.push(...(response.documents as SubjectInterface[]));
    }
    
    return subjects;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const searchSubjects = async (schoolId: string, searchTerm: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.subjectCollection!,
      [
        Query.equal("schoolId", schoolId),
        Query.equal("status", SubjectStatus.ACTIVE),
        Query.search("name", searchTerm),
      ]
    );
    
    return response.documents as SubjectInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};