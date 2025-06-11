import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Container, Paper, Typography } from '@mui/material';
import io from 'socket.io-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = ({ pollId }) => {
  const [pollData, setPollData] = useState(null);
  
  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('voteUpdate', (updatedPoll) => {
      setPollData(updatedPoll);
    });

    return () => socket.disconnect();
  }, []);

  const chartData = {
    labels: pollData?.options.map(opt => opt.text) || [],
    datasets: [
      {
        label: 'Votes',
        data: pollData?.options.map(opt => opt.votes) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, my: 4 }}>
        {pollData ? (
          <>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {pollData.title} - Live Results
            </Typography>
            <Bar data={chartData} />
          </>
        ) : (
          <Typography>Loading results...</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Results;