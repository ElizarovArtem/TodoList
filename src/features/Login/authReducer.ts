import {setAppStatusAC} from '../Application/applicationReducer'
import {authAPI, RequestLoginType} from "../../api/api-todolist";
import {
    handleServerAppErrorSecond,
    handleServerNetworkErrorSecond
} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AsyncActionsRejectedValueType} from "../../utils/types";
import {appCommonActions} from "../CommonActions/App";

export const loginTC = createAsyncThunk<
    void,
    RequestLoginType,
    AsyncActionsRejectedValueType>("auth/login", async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            return handleServerAppErrorSecond(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
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
            return handleServerAppErrorSecond(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkErrorSecond(err, thunkAPI)
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
    reducers: {},
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false
        })
        builder.addCase(appCommonActions.setIsLoggedInAC, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
    }
})

export const authReducer = slice.reducer
