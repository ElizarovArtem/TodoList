import {ResponseType} from "../api/api-todolist";
import {setAppErrorAC, setAppStatusAC} from "../features/Application/applicationReducer";
import {AxiosError} from "axios";

type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}

export const handleServerAppErrorSecond =
    <D>(data: ResponseType<D>, thunkAPI: ThunkAPIType, showError: boolean = true) => {
        if (showError) {
            thunkAPI.dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : "Some error occurred"}))
        }
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue({errors: data.messages, fields: data.fieldsErrors})
    }

export const handleServerNetworkErrorSecond =
    (err: AxiosError, thunkAPI: ThunkAPIType, showError: boolean = true) => {
        if (showError) {
            thunkAPI.dispatch(setAppErrorAC({error: err.message}))
        }
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue({errors: [err.message], fields: undefined})
    }