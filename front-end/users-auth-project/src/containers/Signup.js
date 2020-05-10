import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom"
import Auth from '../components/Auth'


const Signup = (props) => {
    const [errorMessage, setErrorMessage] = useState('')
    let history = useHistory()
    let location = useLocation()
  
    let { from } = location.state || { from: { pathname: "/profile" } }

    const requestSignup = (formData) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }

        fetch('http://localhost:9092/users/register', requestOptions)
            .then(response => response.json())
            .then(data => {
                props.setUserId(data.userId)
                if(data.status == 200) {
                    return Auth.login(() => {
                        history.replace(from)
                    })
                }
                setErrorMessage(data.message)
            } )
            .catch(err => setErrorMessage('Database error')) 
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()
        const form = document.querySelector('form')
        const formData = Object.fromEntries(new FormData(form).entries())
        const { username, email, password, confirmPassword, firstName, lastName } = formData
            
        if(username || email || password || confirmPassword || firstName || lastName) {
            const emailPattern = /^\S+@\S+\.\S+$/
            const emailPatternMatch = email.match(emailPattern)
            
            if(username.length < 4 ) {
                return setErrorMessage('Username should contain at least 4 characters')
            } else if(firstName.length < 2) {
                return setErrorMessage('First name should contain at lest 2 characters')
            } else if(lastName.length < 2) {
                return setErrorMessage('Last name should contain at lest 2 characters')
            } else if(password.length < 7) {
                return setErrorMessage('Password lenght must be at least 7 characters long')
            } else if (password !== confirmPassword) {
                return setErrorMessage('Passwords did not match')
            } else if(!emailPatternMatch) {
                return setErrorMessage('Email is not in valid format')
            }
            requestSignup(formData)
        } else {
            setErrorMessage('Fillin all details')
        }
    }

    return (
        <div>
            {errorMessage != '' ? errorMessage : ''}
            <h2>Signup route</h2>
                <form onSubmit={handleFormSubmit} >
                <input type="text" name="username" placeholder="username"  required />
                <input type="email" name="email" placeholder="email" required />
                <input type="password" name="password" placeholder="password" required />
                <input type="password" name="confirmPassword" placeholder="confirm password" required />
                <input type="text" name="firstName" placeholder="first name" required />
                <input type="text" name="lastName" placeholder="last name" required />
                <input type="submit" value="signup" />
                {/* <button type="submit" onClick={handleFormSubmit}>signup</button> */}
        </form>
            <br></br>
            <Link to='/login'>Login instead?</Link>
        </div>
    );
}

export default Signup;
