import { SchoolAdminModel, SchoolModel } from "@/appwrite/schema/school.schema";
import { GlobalAction, GlobalState, GlobalTypes } from "./types";

const initialState: GlobalState = {
  school: null,
  user: null,
};

const globalReducer = (
  state: GlobalState = initialState,
  action: GlobalAction
): GlobalState => {
  switch (action.type) {
    case GlobalTypes.FETCH_SCHOOL:
      return {
        ...state,
        school: null,
      };

    case GlobalTypes.SET_SCHOOL:
      return {
        ...state,
        school: action.payload as SchoolModel,
      };

    case GlobalTypes.SET_USER:
      return {
        ...state,
        user: action.payload as SchoolAdminModel,
      };

    case GlobalTypes.LOGOUT_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

export default globalReducer;
