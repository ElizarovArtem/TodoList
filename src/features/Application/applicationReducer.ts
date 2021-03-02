import {authAPI} from "../../api/api-todolist";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkErrorSecond} from "../../utils/error-utils";
import {appCommonActions} from "../CommonActions/App";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const initializedTC = createAsyncThunk("app/initialized", async (arg, thunkAPI) => {
    const res = await authAPI.me()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appCommonActions.setIsLoggedInAC({value: true}))
        }
        return {isInitialized: true}
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
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

export const applicationReducer = slice.reducer

export const {setAppStatusAC, setAppErrorAC} = slice.actions

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
