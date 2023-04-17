import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = ({ message }) => {
  const notify = () => toast(message);

  return (
    <>
      <button onClick={notify}>Notify!</button>
      <ToastContainer />
    </>
  );
};

export default Toast;
