import {ResponseType} from "../api/api-todolist"
import {Dispatch} from "redux";
import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from "../app/appReducer";
import {AxiosError} from "axios";

export const handleServerAppError =
    <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppStatusType | SetAppErrorType>, showError: boolean = true) => {
        if (showError) {
            dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : "Some error occurred"}))
        }
        dispatch(setAppStatusAC({status: "failed"}))
    }

export const handleServerNetworkError =
    (err: { message: string }, dispatch: Dispatch<SetAppStatusType | SetAppErrorType>, showError: boolean = true) => {
        if (showError) {
            dispatch(setAppErrorAC({error: err.message}))
        }
        dispatch(setAppStatusAC({status: "failed"}))
    }

export const handleServerAppErrorSecond =
    <D>(data: ResponseType<D>, thunkAPI: any, showError: boolean = true) => {
        if (showError) {
            thunkAPI.dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : "Some error occurred"}))
        }
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue({errors: data.messages, fields: data.fieldsErrors})
    }

export const handleServerNetworkErrorSecond =
    (err: AxiosError, thunkAPI: any, showError: boolean = true) => {
        if (showError) {
            thunkAPI.dispatch(setAppErrorAC({error: err.message}))
        }
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue({errors: [err.message], fields: undefined})
    }