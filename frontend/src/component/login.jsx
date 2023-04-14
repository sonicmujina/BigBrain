import React from 'react';
import { Link } from 'react-router-dom';
// import Popup from 'reactjs-popup';

function Login () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
    }
    submitForm();
  }

  async function submitForm () {
    const payload = {
      email,
      password
    }

    const res = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
      .catch((error) => {
        console.log(error);
      })

    const data = await res.json();

    if (!res.ok) {
      console.log(data.error);
      setError(true);
      setErrorMsg(data.error);
      return;
    }

    localStorage.setItem('token', data.token);
    location.replace('/Home');
  }

  return (
      <>
      <Nav />
      <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' } }>Sign in</div>
      {fetchError
        ? (<>
          <div style={ { display: 'block', textAlign: 'center', color: 'red' } }>{errorMsg}</div>
        </>
          )
        : (
        <></>
          )
      }
      <div style={ { display: 'block', textAlign: 'center' } }>
        <div>Email: <input value={email} onChange={(e) => setEmail(e.target.value)}/></div>
        <div>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/></div>
        <button onClick={checkFilled}>Submit</button>
      </div>
  </>
  );
}

export default Login;
