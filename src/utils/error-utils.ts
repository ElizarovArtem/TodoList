import {ResponseType} from "../api/api-todolist"
import {Dispatch} from "redux";
import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from "../app/appReducer";

export const handleServerAppError =
    <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppStatusType | SetAppErrorType>) => {
    debugger
        if (data.messages.length) {
            dispatch(setAppErrorAC({error:  data.messages[0]}))
        } else {
            dispatch(setAppErrorAC({error: "Some error occurred"}))
        }
        dispatch(setAppStatusAC({status: "failed"}))
    }

export const handleServerNetworkError =
    (err: {message: string}, dispatch: Dispatch<SetAppStatusType | SetAppErrorType>) => {
        dispatch(setAppErrorAC({error: err.message}))
        dispatch(setAppStatusAC({status: "failed"}))
}