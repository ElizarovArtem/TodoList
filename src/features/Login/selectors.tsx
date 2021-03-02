import {RootStateType} from "../../utils/types";

export const selectIsLoggedIn = (state: RootStateType) => state.auth.isLoggedIn