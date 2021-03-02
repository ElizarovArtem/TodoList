import {FieldsErrorsResponseType} from "../api/api-todolist";
import {store} from "../app/store";

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch
export type AsyncActionsRejectedValueType = {rejectValue: {errors: Array<string>, fields?: Array<FieldsErrorsResponseType>}}
