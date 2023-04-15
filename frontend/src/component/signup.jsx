import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';

function SignUp () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [fetchError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const Nav = () => {
    return (
      <>
        <span><Link to='/signup'> Sign Up</Link></span>
        &nbsp;|&nbsp;
        <span><Link to='/'> Sign In</Link></span>
        <hr></hr>
      </>
    )
  }

  function checkFilled () {
    if (email.length === 0) {
      setErrorMsg('Pleaes input the email');
      setError(true);
      return;
    } else if (password.length === 0) {
      setErrorMsg('Please input the password');
      setError(true);
      return;
    } else if (name.length === 0) {
      setErrorMsg('Please input the name');
      setError(true);
      return;
    }
    submitForm();
  }

  async function submitForm () {
    const payload = {
      email,
      password,
      name
    }

    const res = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
      .catch((error) => {
        if (error.message.includes('Request failed 400')) {
          console.log('bad request');
        }
      })

    const data = await res.json();

    if (!res.ok) {
      console.log(data.error);
      setError(true);
      setErrorMsg(data.error);
      return
    }

    localStorage.setItem('token', data.token);
    location.replace('/Home');
  }

  return (
    <>
    <Nav />
    {fetchError
      ? (<>
          <Alert variant="filled" severity="error">
            {errorMsg}
          </Alert>
      </>
        )
      : (
      <></>
        )
    }
    <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' } }>Sign Up</div>
    <div style={ { display: 'block', textAlign: 'center' } }>
        <div>Email: <input value = {email} onChange={(e) => setEmail(e.target.value)}/></div>
        <div>Password: <input type = "password" value = {password} onChange={(e) => setPassword(e.target.value)}/></div>
        <div>Name: <input value = {name} onChange={(e) => setName(e.target.value)}/></div>
        <button onClick = {checkFilled}>Submit</button>
    </div>
  </>
  );
}

export default SignUp;
