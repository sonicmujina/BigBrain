import React, { useState, useEffect, useCallback } from 'react';
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
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { v4 as uuidv4 } from 'uuid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  border: '1px solid #bbb'
}));

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
  const [qList, setQList] = useState([]);

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
        // console.log(data.questions);
        setQuiz(data);
        setQList(data.questions);
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
    hideNoti();
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
        setQuiz({ ...quiz, name: newTitle });
        handleClose();
        setNoti(true);
        setNotiMsg('Successfully changed title');
        return res.json();
      })
      .catch(error => {
        console.log(error);
        console.log('Could not update quiz title');
        setError(true);
        setErrorMsg(error.message);
        setNotiMsg('Failed to change title');
      });
  };

  function renderTitle () {
    const quizTitle = quiz.name;
    return (
      <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Typography variant="h4" component="h1">
          {quizTitle} (ID: {id})
        </Typography>
      </Grid>
      <Grid item xs>
        <Button variant="contained" onClick={handleOpen} padding="100px">
            Change Title
          </Button>
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
      </Grid>
    </Grid>
    )
  }

  const addQ = () => {
    hideNoti();
    const newQuestion = { id: uuidv4(), text: 'New Question' }; // Generates a unique id using the uuidv library
    const updatedQList = [...qList, newQuestion];
    fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        questions: updatedQList,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update quiz questions');
        }
        setQList(updatedQList);
        setNoti(true);
        setNotiMsg('Successfully added a question!');
        return res.json();
      })
      .catch(error => {
        console.log(error);
        console.log('Could not update quiz questions');
        setError(true);
        setErrorMsg('Failed to add question');
      });
  };

  // const handleEditQuestion = (index) => {
  //   // TODO: Implement logic for editing question at specified index
  // };

  const handleDeleteQuestion = (index) => {
    hideNoti();
    const newList = [...qList];
    newList.splice(index, 1);
    setQList(newList);

    fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        questions: newList,
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update quiz questions');
        }
        console.log()
        setNoti(true);
        setNotiMsg('Question deleted');
        return res.json();
      })
      .catch(error => {
        console.log(error);
        console.log('Could not update quiz questions');
        setError(true);
        setErrorMsg('Failed to delete question');
      });
  };

  const MemoizedQList = useCallback(({ qList }) => {
    // console.log(qList);
    if (!qList || qList.length === 0) {
      return <div>No questions yet, create one!</div>;
    }

    return (
      <>
      {qList.map((q, i) => (
          <Item key={i}>
            <Typography variant="h6" component="h3" gutterBottom>
              Question {i + 1}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {q.text}
            </Typography>
            {/* <Button variant="outlined" color="primary" onClick={() => handleEditQuestion(i)}>
              Edit
            </Button> */}
            <Link to={`/editQuestion/${id}/${q.id}`} style={{ textDecoration: 'none' }}>
              <Button variant="outlined" color="primary">
                Edit
              </Button>
            </Link>
            <Button variant="outlined" color="secondary" onClick={() => handleDeleteQuestion(i)}>
              Delete
            </Button>
          </Item>
      ))}
      </>
    );
  }, [qList]);

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
      <Link to="/home">
        <Typography>
          Back to Dashboard
        </Typography>
      </Link>
      {quiz && (
        <>
          {renderThumbnail()}
          {renderTitle()}

          <Button variant="contained" onClick={addQ}>
            Create question
          </Button>
        </>
      )}
      <MemoizedQList qList={qList} />
      </Stack>
    </>
  );
}
