import { SchoolAdminModel, SchoolModel } from "@/appwrite/schema/school.schema";

export const GlobalTypes = {
  FETCH_SCHOOL: "FETCH_SCHOOL",
  SET_SCHOOL: "SET_SCHOOL",
  SET_USER: "SET_USER",
  LOGOUT_USER: "LOGOUT_USER",
};

export type GlobalState = {
  school: SchoolModel | null;
  user: SchoolAdminModel | null;
};

export type GlobalAction =
  | { type: typeof GlobalTypes.SET_SCHOOL; payload: SchoolModel }
  | { type: typeof GlobalTypes.SET_USER; payload: SchoolAdminModel };
