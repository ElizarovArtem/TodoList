import {Dispatch} from "redux";
import {authAPI} from "../api/api-todolist";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../utils/error-utils";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const initializedTC = createAsyncThunk("app/initialized", async (arg, thunkAPI) => {
    const res = await authAPI.me()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: true}))
        }
        return {isInitialized: true}
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const AsyncAppActions = {
    initializedTC
}

export const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        }
    },
    extraReducers: builder => {
        builder.addCase(initializedTC.fulfilled, (state, action) => {
            state.isInitialized = action.payload.isInitialized
        })
    }
})

export const appReducer = slice.reducer

export const {setAppStatusAC, setAppErrorAC} = slice.actions

// types
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
