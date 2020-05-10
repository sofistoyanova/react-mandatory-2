import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Auth from './Auth'

export const ProtectedRoute = ({children, ...rest}) => {
    return (
        <Route 
        {...rest} 
        render={props => {
            if(Auth.isAuthenticated()) {
                return children
            } else {
                return (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {
                                from: props.location
                            }
                        }}
                    ></Redirect>
                )
            }
        }} ></Route>
    )
}
