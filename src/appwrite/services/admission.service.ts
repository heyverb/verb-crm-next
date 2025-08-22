import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { AdmissionModel } from "../schema/admission.schema";
import { Query, QueryTypes } from "appwrite";

export const CreateAdmission = async (data: AdmissionModel) => {
  try {
    return (await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      ID.unique(),
      data
    )) as AdmissionModel;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const UpdateAdmission = async (data: AdmissionModel) => {
  try {
    const studentres = (await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      data.$id!,
      data
    )) as AdmissionModel;

    return studentres;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
export const DeleteAdmission = async (id: string) => {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      id
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
export const GetAdmissions = async ({
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
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      [...query.map(String)]
    );
    console.log("response", response);
    return response.documents;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
export const GetOneAdmission = async (id: string) => {
  try {
    const response = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      id
    );
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
