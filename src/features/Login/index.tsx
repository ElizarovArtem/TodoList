import * as authSelectors from "./selectors"
import {Login} from "./Login";
import {AsyncAuthActions, slice} from "./authReducer";

const authActions = {
    ...AsyncAuthActions
}

const authReducer = slice.reducer

export {
    authSelectors,
    Login,
    authActions,
    authReducer
}