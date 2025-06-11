import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Real-Time Interactive Polling
        </Typography>
        
        <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary" 
          paragraph
        >
          Create, join, and participate in live polls with instant results
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4} justifyContent="center">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Grid item>
                    <Button 
                      variant="contained" 
                      size="large" 
                      onClick={() => navigate('/admin')}
                    >
                      Create New Poll
                    </Button>
                  </Grid>
                ) : (
                  <Grid item>
                    <Button 
                      variant="contained" 
                      size="large" 
                      onClick={() => navigate('/join')}
                    >
                      Join a Poll
                    </Button>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Grid item>
                  <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Create Polls
              </Typography>
              <Typography>
                Easily create interactive polls with multiple options and set timers for automatic closure.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Real-Time Results
              </Typography>
              <Typography>
                Watch as results update instantly as participants cast their votes.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Easy Participation
              </Typography>
              <Typography>
                Join polls quickly using session codes and vote with a single click.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;