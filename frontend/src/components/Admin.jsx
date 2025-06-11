import React, { useState } from 'react';
import { 
  Container, Typography, Button, Box, TextField, Paper,
  Stepper, Step, StepLabel, Card, CardContent,
  List, Divider, IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Create Poll',
  'Set Authentication',
  'Launch Poll'
];

const Admin = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    authentication: 'code', // 'code' or 'email'
    timer: '',
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const addOption = () => {
    setPollData({
      ...pollData,
      options: [...pollData.options, '']
    });
  };

  const handleLaunch = async () => {
  try {
    // Example API call to save poll data — adjust the URL and payload accordingly
    const response = await fetch('/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include auth token if needed
      },
      body: JSON.stringify(pollData),
    });

    if (!response.ok) {
      throw new Error('Failed to create poll');
    }

    const data = await response.json();
    alert('Poll launched successfully!');
    // Optionally, redirect or reset form:
    // navigate('/somewhere');
  } catch (error) {
    console.error('Error launching poll:', error);
    alert('Error launching poll');
  }
};


  const removeOption = (index) => {
    const newOptions = pollData.options.filter((_, i) => i !== index);
    setPollData({
      ...pollData,
      options: newOptions
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Create your poll
            </Typography>
            <TextField
              fullWidth
              label="Poll Title"
              value={pollData.title}
              onChange={(e) => setPollData({...pollData, title: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={pollData.description}
              onChange={(e) => setPollData({...pollData, description: e.target.value})}
              margin="normal"
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Poll Options
            </Typography>
            {pollData.options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollData.options];
                    newOptions[index] = e.target.value;
                    setPollData({...pollData, options: newOptions});
                  }}
                />
                {index > 1 && (
                  <IconButton onClick={() => removeOption(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addOption}
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Set Authentication Method
            </Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Session Code</Typography>
                <Typography variant="body2" color="text.secondary">
                  Participants join using a unique session code
                </Typography>
              </CardContent>
            </Card>
            <TextField
              fullWidth
              label="Timer (minutes, optional)"
              type="number"
              value={pollData.timer}
              onChange={(e) => setPollData({...pollData, timer: e.target.value})}
              margin="normal"
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review and Launch
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{pollData.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {pollData.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {pollData.options.map((option, index) => (
                  <Typography key={index} variant="body1">
                    • {option}
                  </Typography>
                ))}
              </List>
              {pollData.timer && (
                <Typography variant="body2">
                  Timer: {pollData.timer} minutes
                </Typography>
              )}
            </Paper>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 4 }}>Create New Poll</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleLaunch : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Launch Poll' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin;
