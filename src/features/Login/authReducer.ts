import {setAppStatusAC} from '../../app/appReducer'
import {authAPI, RequestLoginType} from "../../api/api-todolist";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const loginTC = createAsyncThunk<
    undefined,
    RequestLoginType,
    {
        rejectValue: { errors: Array<string>; fields?: Array<{ field: string, error: string }> }
    }>("auth/login", async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fields: res.data.fieldsErrors})
        }
    } catch (err) {
        let error: AxiosError = err
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fields: undefined})
    }
})
export const logoutTC = createAsyncThunk("auth/logout", async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            thunkAPI.rejectWithValue("")
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        thunkAPI.rejectWithValue("")
    }
})

export const AsyncAuthActions = {
    loginTC,
    logoutTC
}

export const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false
        })
    }
})

export const authReducer = slice.reducer

// actions
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
