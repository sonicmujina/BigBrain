import React from 'react';
import Login from './component/login';
import SignUp from './component/signup';
import Home from './component/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App () {
  console.log(localStorage.getItem('token') !== null);

  return (<>
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
