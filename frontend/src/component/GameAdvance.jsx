import React, { useState, useEffect } from 'react';
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
  const [sessionId, setSessionId] = useState('');
  const [advanced, setAdvanced] = useState(false);

  async function getSessionId () {
    if (stopWholeGame === true) {
      return;
    }
    fetch('http://localhost:5005/admin/quiz/' + gameId, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
          setErrorMsg(res.json().error);
          throw new Error(res.json().error);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.active === null) {
          fetchGameStatus();
        } else {
          setSessionId(data.active);
          if (sessionId.length !== 0) {
            fetchGameStatus();
          }
        }
      })
  }

  console.log(sessionId);

  useEffect(() => {
    console.log(stopWholeGame);
    if (stopWholeGame === false) {
      getSessionId();
    }
  }, [stopWholeGame, advanced]);

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
    hideNoti();
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
    hideNoti();
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameId + '/advance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.active === false) {
        setStopWholeGame(true);
        return;
      }
      setError(true);
      setErrorMsg(data.error);
      throw new Error(data.error);
    } else {
      setAdvanced(!advanced);
      setNoti(true);
      setNotiMsg('Advanced to next question');
    }
  }

  async function fetchGameStatus () {
    const res = await fetch('http://localhost:5005/admin/session/' + sessionId + '/status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.active === false) {
        setStopWholeGame(true);
        return;
      }
      setError(true);
      setErrorMsg(data.error);
      throw new Error(data.error);
    } else {
      console.log(data);
      if (data.active === false) {
        setStopWholeGame(true);
      }
      console.log(stopWholeGame);
    }
  }

  /* function calWinner (data) {
    console.log(data);
    return (
      <>{data}</>
    );
  } */

  const GameResult = () => {
    let result;
    fetch('http://localhost:5005/admin/session/' + sessionId + '/results', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
          setErrorMsg(res.json().error);
          throw new Error(res.json().error);
        }
        return res.json()
      })
      .then((data) => {
        console.log(data)
        result = data;
      })
    console.log(result)
    // const Winner = calWinner(data);
    return (
      <>
        <Link to='/home'>
          <Button variant="outlined">Back</Button>
        </Link>
      </>
    );
  }

  function hideNoti () {
    setError(false);
    setErrorMsg('');
    setNoti(false);
    setNotiMsg('');
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
