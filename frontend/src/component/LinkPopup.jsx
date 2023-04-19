// Modified boiler plate code provided from material ui Dialog component section source: https://mui.com/material-ui/react-dialog/
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

// A styled component using custom styles for the Dialog component from Material-UI library.
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogTitle-root': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    padding: theme.spacing(2),
  },
  '& .MuiIconButton-root': {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    backgroundColor: 'pink',
    color: 'white',
  },
}));

const LinkPopup = ({ gameId, gameTitle, sessionId, open, close }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/play/join/${sessionId}`);
    setCopied(true);
  };

  const handleClose = () => {
    setCopied(false);
    close();
  };

  return (
    <>
    {sessionId.length !== 0
      ? (
        <BootstrapDialog open={open}>
          <DialogTitle>
            {gameTitle} | Session ID: {sessionId}
            <IconButton aria-label="close" onClick={handleClose}>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              To join the game, copy the following URL and share it with your friends:
            </Typography>
            <Typography variant="h6">
              {`${window.location.origin}/play/join/${sessionId}`}
            </Typography>
            {copied && <Typography color="success">Link copied to clipboard!</Typography>}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCopyLink}>
              Copy URL
            </Button>
            <Link to={`/advanceGame/${gameId}`} style={{ textDecoration: 'none' }}>
              <Button autoFocus>
                Go to control page
              </Button>
            </Link>
          </DialogActions>
        </BootstrapDialog>
        )
      : (
        <BootstrapDialog open={open}>
        <DialogTitle>
          Game {gameTitle} has been stopped
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Would you like to view the results?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Link to={
            {
              pathname: `/advanceGame/${gameId}`,
              state: `?data=${sessionId}`
            }
            }
            style={{ textDecoration: 'none' }}>
            <Button autoFocus>
              Yes
            </Button>
          </Link>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </BootstrapDialog>
        )
    }
    </>
  );
};

export default LinkPopup;
