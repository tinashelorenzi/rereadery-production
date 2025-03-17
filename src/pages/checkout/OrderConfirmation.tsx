import { Box, Typography } from '@mui/material';

interface OrderConfirmationProps {
  orderId: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId }) => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, textAlign: 'center' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Order Confirmed
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Order ID: {orderId}
      </Typography>
      
      <Typography variant="body1">
        Total Amount: $29.99
      </Typography>
      
      <Typography variant="body1" sx={{ mt: 4 }}>
        Thank you for your purchase! You will receive a confirmation email shortly.
      </Typography>
    </Box>
  );
};