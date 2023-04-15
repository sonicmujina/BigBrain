import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Button, Modal } from '@material-ui/core';
import { Stack } from '@mui/material';

export default function EditGame () {
  const { id } = useParams(); // get the id parameter from the URL
  const [open, setOpen] = useState(false);

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
        Game Title (ID: {id})
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
