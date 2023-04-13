import React from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

function Home () {
  const token = localStorage.getItem('token');
  const [newGameName, setNewGameName] = React.useState('');
  const [fetchError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
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
    console.log(newGameName);

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

  /* const GameList = () => {
    let quizesData;
    fetch('http://localhost:5005/admin/quiz', {
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
        const final = data.map((metaQuizes) => {
          fetch('http://localhost:5005/admin/quiz', {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(metaQuizes.id.json)
          })
            .then((quizGame) => {
              const quizData = quizGame.json()
              if (!quizGame.ok) {
                console.log(quizData.error);
                return;
              }
              quizesData += quizData.map((quiz) => {
                return (
                  <div>
                    <div><img src={quiz.thumbnail}></img></div>
                    <div>{quiz.name}</div>
                    <div>{quiz.questions.length}</div>
                  </div>
                )
              })
            })
        })
      })
    return (
      <>
        <div>{final}</div>
      </>
    )
  } */

  return (
    <>
      <Nav />
      {fetchError
        ? (<>
          <div style={ { display: 'block', textAlign: 'center', color: 'red' } }>{errorMsg}</div>
        </>
          )
        : (
        <></>
          )
      }
      <Tooltip />
      <div>
        <div>Create new game: <input value={newGameName} onChange={(e) => setNewGameName(e.target.value)}/></div>
        <button onClick={createNewGame}>Submit</button>
      </div>
      <div style={ { display: 'flex', textAlign: 'center', justifyContent: 'center' } }>
        <div style={ { display: 'block', width: '25%' } }>Name</div>
        <div style={ { display: 'block', width: '25%' } }>questions</div>
        <div style={ { display: 'block', width: '25%' } }>total time</div>
      </div>
    </>
  )
}

export default Home;
