import React from 'react';
import { Link } from 'react-router-dom';

function Home () {
  const token = localStorage.getItem('token');
  console.log(token);
  const Nav = () => {
    return (
      <>
        <span><Link to='/' onClick={logout}> Logout</Link></span>
        <hr></hr>
      </>
    )
  }

  async function logout () {
    console.log(token);
    await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          console.log('403');
        }
      })
      .catch((error) => {
        if (error.message.includes('Request failed 403')) {
          console.log('403');
          /* setErrorMsg('Invalid Token');
          setError(true); */
        }
      })
    localStorage.removeItem('token');
  }

  return (
    <>
      <Nav />
      Welcome back,
    </>
  )
}

export default Home;
