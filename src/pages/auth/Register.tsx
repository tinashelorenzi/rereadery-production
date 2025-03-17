import React, { useState } from 'react';
import { TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Box, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { UserRole, RegistrationData } from '../../types/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    shopName: '',
    role: UserRole.INDIVIDUAL_SELLER
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.surname) newErrors.surname = 'Surname is required';

    if (formData.role === UserRole.STORE_OWNER && !formData.shopName) {
      newErrors.shopName = 'Shop name is required for store accounts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await authService.register(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Registration failed. Please try again.'
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof RegistrationData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'var(--white)' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create an Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Account Type</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value={UserRole.INDIVIDUAL_SELLER}
                  control={<Radio />}
                  label="Individual Seller"
                />
                <FormControlLabel
                  value={UserRole.STORE_OWNER}
                  control={<Radio />}
                  label="Store Owner"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              error={!!errors.surname}
              helperText={errors.surname}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            {formData.role === UserRole.STORE_OWNER && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Shop Name"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                error={!!errors.shopName}
                helperText={errors.shopName}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            {errors.submit && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {errors.submit}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: 'var(--dark-green)',
                '&:hover': {
                  backgroundColor: 'var(--dark-olive-green)'
                }
              }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;