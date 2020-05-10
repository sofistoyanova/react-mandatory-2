import React, { useEffect, useState } from 'react';

const Profile = (props) => {
  const [firstName, setFirstName] = useState('')
  const userId = (props.userId)
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      }
    }
    fetch(`http://localhost:9092/users/profile/${userId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setFirstName(data.firstName)
      })
  })

  return (
    <div>
        <h2>Hello, { firstName }</h2>
    </div>
  );
}

export default Profile;
