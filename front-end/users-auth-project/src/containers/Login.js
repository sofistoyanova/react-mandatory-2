import React, { useState } from 'react'
import {Link, useHistory, useLocation } from "react-router-dom"
import Auth from '../components/Auth'

const Login = (props) => {
  const [errorMessage, setErrorMessage] = useState()
  let history = useHistory()
  let location = useLocation()

  let { from } = location.state || { from: { pathname: "/profile" } }
  

  const requestLogin = (formData) => {
    const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    }

    fetch('http://localhost:9092/users/login', requestOptions)
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
        .catch(err => setErrorMessage('Database error here')) 
  }
  
  const handleFormSubmit = (event) => {
    event.preventDefault()
    const form = document.querySelector('form')
    const formData = Object.fromEntries(new FormData(form).entries())
    const {username, password} = formData
    
    if(username || password) {
      if(username.length < 4) {
        return setErrorMessage('username should be at least 4 characters long')
      } else if(password.length < 7) {
        return setErrorMessage('password should be at least 7 characters long')
      }
      requestLogin(formData)
    } else {
      setErrorMessage('Fill in username and password')
    }
  }

  return (
    <div>
      {errorMessage != '' ? errorMessage : ''}
      <h2>login route</h2>
      <form onSubmit={handleFormSubmit}>
      <input type="text" name="username" value="sofi5" placeholder="username"  required />
      <input type="password" name="password" value="1234567" placeholder="password" required />
      <input type="submit" value="login"></input>
      </form>
      <br></br>
        <Link to='/signup'>Sign up instead?</Link>
    </div>
  )
}

export default Login
