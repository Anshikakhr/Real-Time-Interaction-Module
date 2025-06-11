import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''  // Special code for admin registration
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin already exists
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await axios.get('/api/auth/check-admin');
      if (response.data.exists) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('/api/auth/admin-setup', {
        ...formData,
        role: 'admin'
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Admin setup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Admin Account Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            This is a one-time setup for the admin account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Username"
              name="username"
              margin="normal"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              margin="normal"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type="password"
              margin="normal"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <TextField
              fullWidth
              required
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              margin="normal"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            <TextField
              fullWidth
              required
              label="Admin Setup Code"
              name="adminCode"
              margin="normal"
              onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Create Admin Account
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminSetup;