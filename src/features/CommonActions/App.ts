import {createAction} from '@reduxjs/toolkit'


const setIsLoggedInAC = createAction<{ value: boolean }>('authAction/setIsLoggedIn')

export const appCommonActions = {
    setIsLoggedInAC
}