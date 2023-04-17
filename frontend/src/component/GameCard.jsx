// Modified boiler plate code provided from material ui Card components section source: https://mui.com/material-ui/react-card/
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function GameCard (props) {
  const { keyId, title, numQuestions, thumbnail, totalTime, deleteGame, startGame, active, stopGame } = props;

  return (
    <Card key={keyId} sx={{
      maxWidth: 345,
      transition: '0.3s',
      '&:hover': {
        background: '#f5f5f5',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)'
      }
    }}>
      <Link to={`/editGame/${keyId}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          alt={title}
          height="140"
          image={thumbnail}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${numQuestions} questions`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Total time to complete: ${totalTime} minutes`}
          </Typography>
        </CardContent>
      </Link>
      <CardActions>
        {active === null
          ? (
              <Button size="small" onClick={() => startGame(keyId, title)}>Start</Button>
            )
          : (
            <Button size="small" onClick={() => stopGame(keyId, title)}>Stop</Button>
            )
        }
        <Link to={`/editGame/${keyId}`} style={{ textDecoration: 'none' }}>
          <Button size="small">Edit</Button>
        </Link>
        <Button size="small" onClick={() => deleteGame(keyId, title)}>Delete</Button>
      </CardActions>
    </Card>
  );
}
