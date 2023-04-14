// import React from 'react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { Grid } from "@material-ui/core";
import Card from '@mui/material/Card';

function Home () {
  const token = localStorage.getItem('token');
  const [newGameName, setNewGameName] = useState('');
  const [gamesList, setGamesList] = useState([]);
  const [fetchError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  console.log(Array.isArray(gamesList));
  const Nav = () => {
    return (
      <>
        <span><Link to='/' onClick={logout}> Logout</Link></span>
        <hr></hr>
      </>
    )
  }

  const Tooltip = () => (
    <Popup
      trigger={open => (
        <button className="button">{open ? 'Cancel' : 'Create New Game'}</button>
      )}
      position="right"
    >
      <div>
        <div>Name of the game:</div>
        <input value={newGameName} onChange={(e) => setNewGameName(e.target.value)}></input>
        <button onClick = {createNewGame}>Submit</button>
      </div>
    </Popup>
  );

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
        }
      })
    localStorage.removeItem('token');
  }

  async function createNewGame () {
    const payload = {
      name: newGameName
    }
    console.log('creating new game ' + newGameName);

    const res = await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
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
    } else {
      setError(false);
      setErrorMsg('');
    }
  }

  function GamesList ({ gamesList }) {
    console.log(gamesList);
    return (
      <div>
        <h2>Games List</h2>
        {gamesList.map(game => (
          <div key={game.id}>
            {<div>{game.name}</div>}
            <div><img src={game.thumbnail} alt={game.name} /></div>
            {game.questions.length > 0 ? <div>{game.questions.length}</div> : null}
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    async function fetchGames () {
      await fetch('http://localhost:5005/admin/quiz', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .catch((error) => {
          console.log(error);
        })
        .then((res) => {
          if (!res.ok) {
            setError(true);
            setErrorMsg(res.json().error);
          } else {
            setError(false);
            setErrorMsg('');
          }
          return res.json()
        })
        .then(data => {
          console.log('List of quizzes', data.quizzes);
          setGamesList(data.quizzes);
        })
    }
    fetchGames();
  }, [token]);

  return (
    <>
      <Nav />
      {fetchError
        ? (<>
          <div style={{ display: 'block', textAlign: 'center', color: 'red' }}>{errorMsg}</div>
        </>
          )
        : (
          <></>
          )
      }
      <Tooltip />
      <div>
        <div>Create new game: <input value={newGameName} onChange={(e) => setNewGameName(e.target.value)} /></div>
        <button onClick={createNewGame}>Submit</button>
      </div>
      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'block', width: '25%' }}>Name</div>
        <div style={{ display: 'block', width: '25%' }}>questions</div>
        <div style={{ display: 'block', width: '25%' }}>total time</div>
      </div>
      <GamesList gamesList={gamesList} setGamesList={setGamesList} />
      <Grid container> 
        <Card />
      </Grid>
    </>
  )
}

export default Home;
