import {RootStateType} from "./store";

export const selectStatus = (state: RootStateType) => state.app.status
export const selectIsInitialized = (state: RootStateType) => state.app.isInitialized