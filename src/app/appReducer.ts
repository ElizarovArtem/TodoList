import {Dispatch} from "redux";
import {authAPI} from "../api/api-todolist";
import {setIsLoggedInAC} from "../features/Login/authReducer";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}
export const setIsInitializedAC = (isInitialized: boolean) => {
    return {type: 'APP/SET-IS-INITIALIZED', isInitialized} as const
}

// thunks

export const initializedTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            }
            dispatch(setIsInitializedAC(true))
        })
}

// types
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
type ActionsType = SetAppErrorType | SetAppStatusType | ReturnType<typeof setIsInitializedAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
