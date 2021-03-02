import * as authSelectors from "./selectors"
import {Login} from "./Login";
import {AsyncAuthActions, slice} from "./authReducer";

const authActions = {
    ...AsyncAuthActions,
    ...slice.actions
}

export {
    authSelectors,
    Login,
    authActions
}