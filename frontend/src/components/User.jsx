import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box
} from '@mui/material';
import axios from 'axios';

const User = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  const joinPoll = async () => {
    try {
      const response = await axios.get(`/api/polls/join/${sessionCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPoll(response.data);
    } catch (error) {
      console.error('Error joining poll:', error);
    }
  };

  const submitVote = async (optionIndex) => {
    try {
      await axios.post('/api/polls/vote', {
        pollId: poll._id,
        optionIndex
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>Join Poll</Typography>

      {!poll ? (
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Enter Session Code"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={joinPoll}
            fullWidth
          >
            Join Poll
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5">{poll.title}</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{poll.description}</Typography>
          
          {!voted ? (
            <Box>
              {poll.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 1 }}
                  onClick={() => submitVote(index)}
                >
                  {option.text}
                </Button>
              ))}
            </Box>
          ) : (
            <Typography variant="h6" color="primary">
              Vote submitted successfully!
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default User;