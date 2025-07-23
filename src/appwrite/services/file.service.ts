import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, storage } from "../config";

export const uploadFile = async (fileId: string, file: File) => {
  const fid = fileId.replace("@", "_").replace(".", "");
  try {
    return await storage.createFile(appwriteConfig.bucketId!, fid, file);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getFile = async (fileId: string) => {
  try {
    return await storage.getFileView(appwriteConfig.bucketId!, fileId);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAllFiles = async () => {
  try {
    return await storage.listFiles(appwriteConfig.bucketId!);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
