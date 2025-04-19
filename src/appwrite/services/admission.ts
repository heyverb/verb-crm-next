import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID, Models } from "../config";
import { CreateAdmissionSchema } from "../schema/admission.schema";
import { z } from "zod";

export interface AdmissionModel
  extends Omit<CreateAdmissionType, keyof Models.Document>,
    Models.Document {}

export interface CreateAdmissionType
  extends z.infer<typeof CreateAdmissionSchema> {
  id?: string;
  $id?: string;
}

export const CreateAdmission = async (data: CreateAdmissionType) => {
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

export const UpdateAdmission = async (data: CreateAdmissionType) => {
  try {
    return (await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!,
      data.$id!,
      data
    )) as AdmissionModel;
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
export const GetAdmissions = async () => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.admissionCollection!
    );
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
