import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { ClassModel, SectionModel } from "../schema/class.schema";
import { ClassStatus } from "../interface/class.interface";

export type ClassInterface = ClassModel & Models.Document;
export type SectionInterface = SectionModel & Models.Document;

const SECTION_COLLECTION = "sections"; // This should be added to appwriteConfig

export const createClass = async (data: ClassModel) => {
  try {
    const classDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.classCollection!,
      ID.unique(),
      data
    );

    return classDoc as ClassInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClasses = async ({
  schoolId,
  academicYearId,
  status = ClassStatus.ACTIVE,
}: {
  schoolId: string;
  academicYearId?: string;
  status?: ClassStatus;
}) => {
  try {
    const queries = [
      Query.equal("schoolId", schoolId),
      Query.equal("status", status),
    ];
    
    if (academicYearId) {
      queries.push(Query.equal("academicYearId", academicYearId));
    }
    
    queries.push(Query.orderAsc("grade"));
    queries.push(Query.orderAsc("section"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.classCollection!,
      queries
    );
    
    return response.documents as ClassInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClassById = async (id: string): Promise<ClassInterface> => {
  try {
    const classDoc = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.classCollection!,
      id
    );
    return classDoc as ClassInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateClass = async (id: string, data: Partial<ClassModel>): Promise<ClassInterface> => {
  try {
    const updatedClass = await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.classCollection!,
      id,
      data
    );
    return updatedClass as ClassInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteClass = async (id: string) => {
  try {
    // Soft delete by updating status
    return await updateClass(id, { status: ClassStatus.INACTIVE });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClassesByGrade = async (schoolId: string, grade: number) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.classCollection!,
      [
        Query.equal("schoolId", schoolId),
        Query.equal("grade", grade),
        Query.equal("status", ClassStatus.ACTIVE),
      ]
    );
    
    return response.documents as ClassInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createSection = async (data: SectionModel) => {
  try {
    const sectionDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      SECTION_COLLECTION,
      ID.unique(),
      data
    );

    return sectionDoc as SectionInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSectionsByClass = async (classId: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      SECTION_COLLECTION,
      [
        Query.equal("classId", classId),
        Query.equal("status", ClassStatus.ACTIVE),
        Query.orderAsc("name"),
      ]
    );
    
    return response.documents as SectionInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateSection = async (id: string, data: Partial<SectionModel>): Promise<SectionInterface> => {
  try {
    const updatedSection = await database.updateDocument(
      appwriteConfig.databaseId!,
      SECTION_COLLECTION,
      id,
      data
    );
    return updatedSection as SectionInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const incrementClassStrength = async (classId: string, sectionId?: string) => {
  try {
    const classDoc = await getClassById(classId);
    await updateClass(classId, {
      currentStrength: classDoc.currentStrength + 1,
    });
    
    if (sectionId) {
      const section = await database.getDocument(
        appwriteConfig.databaseId!,
        SECTION_COLLECTION,
        sectionId
      ) as SectionInterface;
      
      await updateSection(sectionId, {
        currentStrength: section.currentStrength + 1,
      });
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const decrementClassStrength = async (classId: string, sectionId?: string) => {
  try {
    const classDoc = await getClassById(classId);
    if (classDoc.currentStrength > 0) {
      await updateClass(classId, {
        currentStrength: classDoc.currentStrength - 1,
      });
    }
    
    if (sectionId) {
      const section = await database.getDocument(
        appwriteConfig.databaseId!,
        SECTION_COLLECTION,
        sectionId
      ) as SectionInterface;
      
      if (section.currentStrength > 0) {
        await updateSection(sectionId, {
          currentStrength: section.currentStrength - 1,
        });
      }
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};