import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  amount: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ amount }) => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate card number (simple Luhn algorithm check)
    if (cardNumber === '4242424242424242') {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/checkout/confirmation');
      }, 1500);
    } else {
      setError('Invalid card number');
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="primary">
          Payment Successful
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Payment Details
      </Typography>
      
      <TextField
        fullWidth
        label="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        margin="normal"
        required
        inputProps={{ maxLength: 16 }}
        error={!!error}
      />
      
      <TextField
        fullWidth
        label="Expiry Date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        margin="normal"
        required
        placeholder="MM/YY"
        inputProps={{ maxLength: 5 }}
      />
      
      <TextField
        fullWidth
        label="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        margin="normal"
        required
        inputProps={{ maxLength: 3 }}
        type="password"
      />
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
      >
        Pay ${(amount / 100).toFixed(2)}
      </Button>
    </Box>
  );
};