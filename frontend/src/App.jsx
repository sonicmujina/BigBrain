import React from 'react';
import Login from './component/login';
import SignUp from './component/signup';
import Home from './component/home';
import EditGame from './component/EditGame';
import GameAdvance from './component/GameAdvance';
import EditQuestion from './component/EditQuestion';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App () {
  console.log(localStorage.getItem('token') !== null);

  return (<>
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/editGame/:id" element={<EditGame />} />
          <Route path="/advanceGame/:gameId" element={<GameAdvance />} />
          <Route path="/editQuestion/:id/:qid" element={<EditQuestion />} />
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
