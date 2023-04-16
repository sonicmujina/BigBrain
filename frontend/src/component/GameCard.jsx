// Modified boiler plate code provided from material ui Card components section source: https://mui.com/material-ui/react-card/
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function GameCard (props) {
  const { keyId, title, numQuestions, thumbnail, totalTime, deleteGame } = props;

  return (
    <Card key={keyId} sx={{ maxWidth: 345 }}>
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
      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small" onClick={() => deleteGame(keyId, title)}>Delete</Button>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
