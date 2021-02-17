import {Dispatch} from "redux";
import {authAPI} from "../api/api-todolist";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state,action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state,action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setIsInitializedAC: (state,action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer

export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions


// thunks

export const initializedTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
            }
            dispatch(setIsInitializedAC({isInitialized: true}))
        })
}

// types
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
