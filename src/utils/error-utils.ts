import {ResponseType} from "../api/api-todolist"
import {Dispatch} from "redux";
import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from "../app/appReducer";

export const handleServerAppError =
    <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppStatusType | SetAppErrorType>) => {
        if (data.messages.length) {
            dispatch(setAppErrorAC(data.messages[0]))
        } else {
            dispatch(setAppErrorAC("Some error occurred"))
        }
        dispatch(setAppStatusAC("failed"))
    }

export const handleServerNetworkError =
    (err: {message: string}, dispatch: Dispatch<SetAppStatusType | SetAppErrorType>) => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC("failed"))
}