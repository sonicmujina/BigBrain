// Modified boiler plate code provided from material ui Dailog components section source: https://mui.com/material-ui/react-dialog/
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function GameStartPop (props) {
  const { title, link } = props;
  const [open, setOpen] = React.useState(false);

  function handleClickOpen () {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Start the game {title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Copy the following link to invite the participant!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Read Only"
            fullWidth
            variant="standard"
            defaultValue={link}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={copyLink}>Copy the link</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
