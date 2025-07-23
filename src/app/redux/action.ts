import { GlobalTypes } from "./types";
import { SchoolAdminModel, SchoolModel } from "@/appwrite/schema/school.schema";

export const fetchSchool = (data: SchoolModel) => {
  return {
    type: GlobalTypes.FETCH_SCHOOL,
    payload: data,
  };
};

export const saveSchool = (data: SchoolModel) => {
  return {
    type: GlobalTypes.SET_SCHOOL,
    payload: data,
  };
};

export const saveUser = (data: SchoolAdminModel) => {
  return {
    type: GlobalTypes.SET_USER,
    payload: data,
  };
};

export const logutUser = () => {
  return {
    type: GlobalTypes.LOGOUT_USER,
  };
};
