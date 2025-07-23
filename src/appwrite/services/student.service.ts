import { Query, QueryTypes } from "appwrite";
import { appwriteConfig, database } from "../config";
import { AdmissionStatusEnum } from "../interface/admission.interface";
import { getErrorMessage } from "@/lib/error.helper";
import { AdmissionModel } from "../schema/admission.schema";

export const GetStudents = async ({
  pageIndex,
  pageSize,
}: {
  pageIndex: string;
  pageSize: string;
}) => {
  const query: QueryTypes[] = [];

  if (pageSize) {
    query.push(Query.limit(parseInt(pageSize)));
  }
  if (pageIndex) {
    const offset = parseInt(pageIndex) * parseInt(pageIndex);
    query.push(Query.offset(offset));
  }

  try {
    const students = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      [
        Query.equal("status", AdmissionStatusEnum.ACCEPTED),
        ...query.map(String),
      ]
    );
    return students.documents;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetStudentByEmail = async (email: string) => {
  try {
    return await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      "",
      [Query.equal("email", email)]
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetStudentById = async (id: string) => {
  try {
    return await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      id
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const UpdateStudent = async (id: string, data: AdmissionModel) => {
  try {
    return await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      id,
      data
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const DeleteStudent = async (id: string) => {
  try {
    return await database.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      id
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
