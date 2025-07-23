import globalReducer from "@/app/redux/reducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({ globalReducer });

export type RootState = ReturnType<typeof rootReducer>;
