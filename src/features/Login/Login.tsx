import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Button, Grid} from '@material-ui/core'
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {loginTC, setIsLoggedInAC} from "./authReducer";
import {RootStateType} from "../../app/store";
import { Redirect } from 'react-router-dom';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
type LoginPropsType = {
    demo?: boolean
}
export const Login = ({demo = false}: LoginPropsType) => {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector<RootStateType, boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = "Email is required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = "Password is required"
            } else if (values.password.length < 3) {
                errors.password = 'Password is too short'
            }

            return errors;
        },
        onSubmit: values => {
            if(!demo) {
                dispatch(loginTC(values))
                formik.resetForm()
            } else {
                dispatch(setIsLoggedInAC({value: true}))
            }
        }
    })

    if (isLoggedIn) {
        return <Redirect to={"/"}/>
    }

    return <Grid container justify="center">
        <Grid item xs={3}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}>here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            name={"email"}
                            type={"email"}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.email && formik.errors.email ?
                            <div style={{color: "red", textAlign: "center"}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            name={"password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ?
                            <div style={{color: "red", textAlign: "center"}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                name={"rememberMe"}
                                checked={formik.values.rememberMe}
                                onChange={formik.handleChange}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}