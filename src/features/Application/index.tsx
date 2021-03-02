import * as appSelectors from "./selectors"
import {AsyncAppActions, slice} from "./applicationReducer";

const appActions = {
    ...AsyncAppActions,
    ...slice.actions
}

export {
    appSelectors,
    appActions
}