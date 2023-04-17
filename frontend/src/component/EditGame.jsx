import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function EditGame () {
  const { id } = useParams(); // get the id parameter from the URL
  const [open, setOpen] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const token = localStorage.getItem('token');
  const [fetchError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fetchNoti, setNoti] = useState(false);
  const [notiMsg, setNotiMsg] = useState('');
  const [quizThumbnail, setThumbnail] = useState('null');
  const [newTitle, setNewTitle] = useState('');

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
        // console.log(data)
        setQuiz(data);
        setNoti(true)
        setNotiMsg('Successfully gathered Game data!');
      } catch (error) {
        setError(true);
        setErrorMsg(error.message);
        console.log(error);
      }
    }
    fetchQuiz();
  }, [id, token, quizThumbnail]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function hideNoti () {
    setError(false);
    setErrorMsg('');
    setNoti(false);
    setNotiMsg('');
  }

  async function handleUploadThumbnail () {
    hideNoti();
    if (!quizThumbnail) {
      console.log('No file selected');
      setError(true);
      setErrorMsg('No file was chosen, please upload a file');
      return;
    }
    try {
      const payload = {
        thumbnail: quizThumbnail,
      }

      const res = await fetch(`http://localhost:5005/admin/quiz/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to upload thumbnail');
      }

      const data = await res.json();
      setThumbnail(data.thumbnailUrl);
      setNoti(true);
      setNotiMsg('Successfully uploaded a new thumbnail!');
    } catch (error) {
      console.log(error);
      console.log('Could not upload thumbnail')
      setError(true);
      setErrorMsg(error.message);
      setNotiMsg('Failed to upload thumbnail');
    }
  }

  function renderThumbnail () {
    const hasThumbnail = quiz && quiz.thumbnail;

    const handleChangeThumbnail = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setThumbnail(reader.result);
      };
    };

    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {hasThumbnail && (
            <Box display="flex" alignItems="flex-start" mr={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={120}
                height={120}
                overflow="hidden"
                borderRadius={8}
              >
                <img src={quiz.thumbnail} alt='Quiz thumbnail' style={{ maxWidth: '100%' }} />
              </Box>
            </Box>
          )}
          {!hasThumbnail && (
            <Box display="flex" alignItems="flex-start" mr={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={120}
                height={120}
                borderRadius={8}
                bgcolor="grey.200"
                color="grey.500"
                fontSize={50}
                textAlign="center"
                lineHeight="normal"
              >
                {/* <span role="img" aria-label="No thumbnail">🖼️</span> */}
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item xs>
          <Typography variant="h5" component="h3" gutterBottom>
            {quiz?.name || 'Untitled Quiz'}
          </Typography>
          {quiz?.id && (
            <Typography variant="body1" component="p" color="textSecondary">
              ID: {quiz.id}
            </Typography>
          )}
          <input accept="image/*" type="file" onChange={handleChangeThumbnail} />
          <Button
            variant="contained"
            style={{ width: '250px' }}
            onClick={handleUploadThumbnail}
          >
            {hasThumbnail ? 'Change thumbnail' : 'Upload thumbnail'}
          </Button>
        </Grid>
      </Grid>
    );
  }

  const handleSubmitTitle = () => {
    // Make a PUT request to update the quiz title
    fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newTitle,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update quiz title');
        }
        handleClose();
        return res.json();
      })
      .catch(error => {
        console.log(error);
        console.log('Could not update quiz title');
      });
  };

  return (
    <>
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
    <Stack spacing={2}>
      <Link to="/home">Back to Dashboard</Link>
      {quiz && (
        <>
          {renderThumbnail()}
          <Typography variant="h4" component="h1">
            {quiz.name} (ID: {id})
            <Button variant="contained" onClick={handleOpen}>
              Change Title
            </Button>
          </Typography>
          <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Change Quiz Title</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a new title for the quiz:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New Quiz Title"
              type="text"
              fullWidth
              variant="standard"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitTitle}>Submit</Button>
          </DialogActions>
          </Dialog>

          <Button variant="contained" onClick={handleOpen}>
            Open Modal
          </Button>
        </>
      )}

      </Stack>
    </>
  );
}
