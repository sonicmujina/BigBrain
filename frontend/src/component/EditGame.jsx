import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Button, Modal } from '@material-ui/core';
import { Stack } from '@mui/material';

export default function EditGame () {
  const { id } = useParams(); // get the id parameter from the URL
  const [open, setOpen] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const token = localStorage.getItem('token');
  console.log(id);
  console.log(token);
  // const [fetchError, setError] = useState(false);
  // const [errorMsg, setErrorMsg] = useState('');

  // Fetch game data
  useEffect(() => {
    async function fetchQuiz () {
      try {
        const res = await fetch(`http://localhost:5005/admin/quiz/${id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data)
        setQuiz(data);
      } catch (error) {
        // setError(true);
        // setErrorMsg(error.message);
        console.log(error);
      }
    }
    fetchQuiz();
  }, [id, token]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack spacing={2}>
      <Link to="/home">Back to Dashboard</Link>
      <Typography variant="h4" component="h1">
      {quiz && <h3>{quiz.name} (ID: {id})</h3>}
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div>Modal content goes here</div>
      </Modal>
    </Stack>
  );
}
