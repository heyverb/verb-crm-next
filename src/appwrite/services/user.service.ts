import { getErrorMessage } from "@/lib/error.helper";
import { account, appwriteConfig, avatars, database, ID } from "../config";
import { SchoolAdminModel } from "../schema/school.schema";
import { Models, Query } from "appwrite";
import { encryptPassword } from "@/lib/utils";

export type SchoolAdminInterface = SchoolAdminModel & Models.Document;

export const CreateUser = async (data: SchoolAdminModel) => {
  const { email, fname, lname, password } = data;
  try {
    const newAccount = await account.create(
      ID.unique(),
      email.toLowerCase(),
      password,
      `${fname + " " + lname}`
    );

    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    const getInitials = await avatars.getInitials(`${fname + " " + lname}`);

    const encryptedPassword = await encryptPassword(password);

    const userRes = (await CreateUserInDb({
      fname,
      lname,
      email,
      password: encryptedPassword,
      avatar: getInitials,
      accountId: newAccount.$id,
    })) as SchoolAdminInterface;

    await signin({ email, password });

    return userRes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const CreateUserInDb = async (data: {
  fname: string;
  lname: string;
  email: string;
  password: string;
  avatar: URL;
  accountId: string;
}) => {
  try {
    return (await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollection!,
      ID.unique(),
      data
    )) as SchoolAdminInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAccount = async (): Promise<any> => {
  try {
    const currentAccount: any = await account.get();

    const currentDbUser: any = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollection!,
      "",
      [Query.equal("accountId", currentAccount.$id)]
    );

    return { session: currentAccount, db: currentDbUser };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateUser = async (data: any) => {
  try {
    const currentUser = await getAccount();
    const updateRes = await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollection!,
      currentUser.db.documents[0].$id,
      data
    );
    return updateRes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetOneUserById = async (id: string) => {
  try {
    return await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollection!,
      id
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const getUser = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollection!,
      "",
      [Query.equal("email", email)]
    );
    return getUser.documents[0];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAllUsers = async () => {
  try {
    return await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollection!
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const signin = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const logoutUser = async () => {
  return await account.deleteSession("current");
};
