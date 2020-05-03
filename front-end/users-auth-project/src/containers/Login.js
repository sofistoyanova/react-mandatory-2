import React, { useState } from 'react'
import {Link } from "react-router-dom"
import Signup from './Signup'

function Login() {
  

  return (
    <div>
      <h2>login route</h2>
  
      <br></br>
        <Link to='/signup'>Sign up instead?</Link>
    </div>
  )
}

export default Login
