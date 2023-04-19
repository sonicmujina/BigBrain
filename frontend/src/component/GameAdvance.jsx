import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';

export default function GameAdvance (props) {
  const { gameId } = useParams();
  const token = localStorage.getItem('token');
  const [stopWholeGame, setStopWholeGame] = useState(false);
  const [fetchError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fetchNoti, setNoti] = useState(false);
  const [notiMsg, setNotiMsg] = useState('');

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
          throw new Error(res.json().error);
        }
      })
      .catch((error) => {
        if (error.message.includes('Request failed 403')) {
          console.log('403');
        }
      })
    localStorage.removeItem('token');
  }

  const Nav = () => {
    return (
      <>
        <span><Link to='/' onClick={logout}> Logout</Link></span>
        <hr></hr>
      </>
    )
  }

  const Options = () => {
    return (
      <>
        <Button variant="outlined" onClick={stopGame}>End the whole game</Button>
        <Button variant="outlined" onClick={advance}>Advance to next question</Button>
        <br></br>
        <Link to='/home'>
          <Button variant="outlined">Back</Button>
        </Link>
      </>
    )
  }

  async function stopGame () {
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameId + '/end', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      setError(true);
      setErrorMsg(data.error === 'Quiz already has active session' ? 'Game is already in progress' : data.error);
      throw new Error(data.error);
    } else {
      setNoti(true);
      setNotiMsg('game has been stopped.')
      setStopWholeGame(true);
    }
  }

  async function advance () {
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameId + '/advance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      setError(true);
      setErrorMsg(data.error);
      throw new Error(data.error);
    }
  }

  async function getSessionId () {
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameId, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setErrorMsg(data.error);
      throw new Error(data.error);
    } else {
      if (data.active === null) {
        setError(true);
        setErrorMsg('No such event at the moment');
      } else {
        return data.active;
      }
    }
  }

  async function fetchGameStatus () {
    const sessionId = getSessionId;
    const res = await fetch('http://localhost:5005/admin/session/' + sessionId + '/status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setErrorMsg(data.error);
      throw new Error(data.error);
    } else {
      return data;
    }
  }

  async function fetchGameResult () {
    const sessionId = getSessionId;
    const res = await fetch('http://localhost:5005/admin/session/' + sessionId + '/results', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setErrorMsg(data.error);
      throw new Error(data.error);
    } else {
      return data;
    }
  }

  const GameResult = () => {
    const data = fetchGameResult();
    return (
      <></>
    );
  }

  return (
    <>
      <Nav />
      {fetchNoti
        ? (<>
          <Alert variant="filled" severity="success">
            {notiMsg}
          </Alert>
        </>
          )
        : (
          <></>
          )
      }
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
      {stopWholeGame
        ? (<>
            <GameResult />
          </>
          )
        : (
          <Options />
          )
      }
    </>
  );
}
