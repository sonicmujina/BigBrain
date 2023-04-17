import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
import GameCard from './GameCard';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Nav from './Nav';
// import Navbar from './NavBar';

const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: '40px',
    paddingRight: '40px'
  },
});

export default function Home () {
  const token = localStorage.getItem('token');
  const [newGameName, setNewGameName] = useState('');
  const [gamesList, setGamesList] = useState([]);
  const [fetchError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const classes = useStyles();
  // Fetch the list of games on component mount and whenever the token changes or user clicks create new game asubmit btn
  useEffect(() => {
    async function fetchGames () {
      const res = await fetch('http://localhost:5005/admin/quiz', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      const sortedQuizzes = data.quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGamesList(sortedQuizzes);
      // setGamesList(data.quizzes);
    }
    fetchGames();
  }, [token, submitted]);

  // const Nav = () => {
  //   return (
  //     <>
  //       <span><Link to='/' onClick={logout}> Logout</Link></span>
  //       <hr></hr>
  //     </>
  //   )
  // }

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

  // Function to handle creating a new game
  async function createNewGame () {
    try {
      const payload = {
        name: newGameName
      };
      const res = await fetch('http://localhost:5005/admin/quiz/new', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error('Failed to create new game.');
      }
      const data = await res.json();
      const newGame = { id: data.quiz_id, name: newGameName, createdAt: new Date().toISOString() };
      setGamesList(prevGamesList => [...prevGamesList, newGame].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setNewGameName('');
      setSubmitted(true);
      setError(false);
      setErrorMsg('');
    } catch (error) {
      setError(true);
      setErrorMsg(error.message);
    }
  }
  // Memoize GamesList component so that it only re-renders when its dependencies change i.e. gameList
  const MemoizedGamesList = useCallback(({ gamesList }) => {
    if (!gamesList || gamesList.length === 0) {
      return <div>No games yet, create one!</div>;
    }

    return (
      <Grid container spacing={4} className={classes.gridContainer}>
        {gamesList.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={`${game.id}+${game.name}`}>
            <GameCard
              gameId={game.id}
              title={game.name}
              numQuestions={game.questions ? game.questions.length : 0}
              thumbnail={game.thumbnail}
              totalTime={game.total_time}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [gamesList]);

  return (
    <>
      <Nav logout={logout} />
      {fetchError
        ? (<>
          <div style={{ display: 'block', textAlign: 'center', color: 'red' }}>{errorMsg}</div>
        </>
          )
        : (
          <></>
          )
      }
      {/* <Nav isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> */}
      {/* <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} fetchError={fetchError} errorMsg={errorMsg} /> */}
      <div>
        <div>Create new game: <input value={newGameName} onChange={(e) => setNewGameName(e.target.value)} /></div>
        <button onClick={createNewGame}>Submit</button>
      </div>
      <MemoizedGamesList gamesList={gamesList} />
    </>
  )
}
