import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GameCard from './GameCard';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@mui/material';
import LinkPopup from './LinkPopup';

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
  const [submitted, setSubmitted] = useState(false);
  const [fetchError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fetchNoti, setNoti] = useState(false);
  const [notiMsg, setNotiMsg] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [openLinkPopup, setOpenLinkPopup] = useState(false);
  const classes = useStyles();

  // Fetch the list of games on component mount and whenever the token changes or user clicks create new game submit btn
  useEffect(() => {
    async function fetchGames () {
      console.log(token);
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

      if (!res.ok) {
        setError(true);
        setErrorMsg(data.error);
        throw new Error(data.error);
      }

      getGameDetails(data.quizzes);
    }
    fetchGames();
  }, [token, submitted, gameStarted]);

  const Nav = () => {
    return (
      <>
        <span><Link to='/' onClick={logout}> Logout</Link></span>
        <hr></hr>
      </>
    )
  }

  async function getGameDetails (quizzes) {
    setGamesList([]);
    for (let i = 0; i < quizzes.length; i++) {
      const quizId = quizzes[i].id;
      const res = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      data.id = quizId;

      if (!res.ok) {
        setError(true);
        setErrorMsg(data.error);
        throw new Error(data.error);
      } else {
        setGamesList(prevGamesList => [...prevGamesList, data]);
      }
    }
  }

  // Function to handle creating a new game
  async function createNewGame () {
    hideNoti();
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
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setErrorMsg(data.error);
        throw new Error('Failed to create new game.');
      }
      const newGame = { id: data.quiz_id, name: newGameName, createdAt: new Date().toISOString() };
      setGamesList(prevGamesList => [...prevGamesList, newGame].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setNewGameName('');
      setNoti(true);
      setNotiMsg('Game ' + newGameName + ' has been created');
      setSubmitted(!submitted);
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
      return <div>No game yet, create one!</div>;
    }

    return (
      <Grid container spacing={4} className={classes.gridContainer}>
        {gamesList.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={`${game.id}+${game.name}`}>
            <GameCard
              keyId={game.id}
              title={game.name}
              numQuestions={game.questions ? game.questions.length : 0}
              thumbnail={game.thumbnail}
              totalTime={game.total_time}
              deleteGame={deleteGame}
              startGame={startGame}
              active={game.active}
              stopGame={stopGame}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [gamesList]);

  async function deleteGame (gameID, gameName) {
    hideNoti();
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameID, {
      method: 'DELETE',
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
      setNoti(true);
      setNotiMsg('Game ' + gameName + ' has been deleted');
      setGamesList((prevState) =>
        prevState.filter((prevItem) => prevItem.id !== gameID)
      );
    }
  }

  async function startGame (gameID, title) {
    hideNoti();
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameID + '/start', {
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
      const sessionRes = await fetch('http://localhost:5005/admin/quiz/' + gameID, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const sessionData = await sessionRes.json();
      console.log(sessionData.active);
      if (!res.ok) {
        setError(true);
        setErrorMsg(data.error);
        throw new Error(data.error);
      } else {
        console.log('starting game...');
        console.log(sessionData);
        setGameId(gameID);
        setSessionId(sessionData.active);
        setSessionName(sessionData.name);
        handleOpenLinkPopup();
      }
    }
  }

  async function stopGame (gameID, title) {
    hideNoti();
    const res = await fetch('http://localhost:5005/admin/quiz/' + gameID + '/end', {
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
      setSessionId('');
      setSessionName(title);
      handleOpenLinkPopup();
    }
  }

  const handleOpenLinkPopup = () => {
    console.log('setting status of linkpopup to TRUE');
    setOpenLinkPopup(true);
    setGameStarted(!gameStarted);
  };

  const closeLinkPopup = () => {
    console.log('setting status of linkpop to FALSE');
    setOpenLinkPopup(false);
    setGameStarted(!gameStarted);
  };

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

      <div>
        <div>Create new game: <input value={newGameName} onChange={(e) => setNewGameName(e.target.value)} /></div>
        <button onClick={createNewGame}>Submit</button>
      </div>
      <MemoizedGamesList gamesList={gamesList} />

      {/* NOTE: The popup for the session URL can only be shown once right after clicking start and cannot be shown again if admin closes the popup */}
      {gameStarted && (
      <LinkPopup gameId={gameId} gameTitle={sessionName} sessionId={sessionId} open={openLinkPopup} close={closeLinkPopup} />
      )}
    </>
  )
}
