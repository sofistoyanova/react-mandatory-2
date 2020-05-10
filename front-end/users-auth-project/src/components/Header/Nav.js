import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from '../../containers/Login'
import Signup from '../../containers/Signup'
import Profile from '../../containers/Profile'
import Home from '../../containers/Home'
import { ProtectedRoute } from '../ProtectedRoute'

const Nav = () => {
  const [userId, setUserId] = useState('hi')
  return (
    <div className="Nav">
      <Router>
        <ul>
          <Link to='/home'>home</Link>
          <br></br>
          <Link to='/login'>login</Link>
          <br></br>
          <Link to='/profile'>profile</Link>
        </ul>
        <div>
            <Switch>
                <Route path="/login">
                  <Login setUserId={setUserId} />
                </Route>
                <Route path="/signup">
                  <Signup setUserId={setUserId} />
                </Route> />
                <ProtectedRoute path="/profile">
                  <Profile userId={userId} />
                </ProtectedRoute> />
                <ProtectedRoute path="/home">
                  <Home userId={userId} />  
                </ProtectedRoute> />
            </Switch>
        </div>
      </Router>
    </div>
  );
}

export default Nav;
