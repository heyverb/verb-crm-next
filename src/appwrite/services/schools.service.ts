import { Models, Query } from "appwrite";
import { z } from "zod";
import { SchoolSchema } from "../schema/school.schema";
import { appwriteConfig, database, ID } from "../config";
import { getErrorMessage } from "@/lib/error.helper";

export interface SchoolModel
  extends Omit<z.infer<typeof SchoolSchema>, keyof Models.Document>,
    Models.Document {}

export interface SchoolModelType extends z.infer<typeof SchoolSchema> {
  id?: string;
  $id?: string;
}

export const CreateSchool = async (data: SchoolModel) => {
  try {
    return (await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.schoolCollection!,
      ID.unique(),
      data
    )) as SchoolModel;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetSchoolByUserId = async (data: { id: string }) => {
  try {
    return (await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.schoolCollection!,
      "",
      [Query.equal("user", data.id)]
    )) as SchoolModel;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
