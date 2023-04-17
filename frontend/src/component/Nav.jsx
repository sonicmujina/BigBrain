import React from 'react';
import { Link } from 'react-router-dom';
const Nav = ({ logout }) => {
  return (
    <>
      <span><Link to='/' onClick={logout}>Logout</Link></span>
      <hr />
    </>
  );
};

export default Nav;
