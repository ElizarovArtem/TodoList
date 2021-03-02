import * as appSelectors from "./selectors"
import {AsyncAppActions, slice} from "./appReducer";

const appActions = {
    ...AsyncAppActions,
    ...slice.actions
}

export {
    appSelectors,
    appActions
}