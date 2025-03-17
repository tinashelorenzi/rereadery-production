import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { ShoppingCart as CartIcon, Favorite as WishlistIcon } from '@mui/icons-material';

interface Book {
  book_id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  condition_rating: number;
  price: number;
  image: string;
  publication_date: string;
  seller_name: string;
  seller_type: string;
  in_cart: boolean;
}

const BookDetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/books/${bookId}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('/api/cart', { bookId });
      setSnackbar({
        open: true,
        message: 'Book added to cart successfully',
        severity: 'success'
      });
      fetchBookDetails(); // Refresh to update availability status
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to add book to cart',
        severity: 'error'
      });
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post('/api/wishlist', { bookId });
      setSnackbar({
        open: true,
        message: 'Book added to wishlist successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add book to wishlist',
        severity: 'error'
      });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!book) return <Typography>Book not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="500"
              image={book.image || '/placeholder-book.jpg'}
              alt={book.title}
              sx={{ objectFit: 'contain', p: 2 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Chip label={book.genre} color="primary" sx={{ mr: 1 }} />
              <Chip
                label={`Condition: ${book.condition_rating}/5`}
                color="secondary"
              />
            </Box>

            <Typography variant="h5" color="primary" sx={{ my: 2 }}>
              ${book.price.toFixed(2)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                ISBN: {book.isbn}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Publication Date: {new Date(book.publication_date).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Seller: {book.seller_name}
                {book.seller_type === 'store_owner' && ' (Bookstore)'}
              </Typography>
            </Box>

            <Box sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                fullWidth
                onClick={handleAddToCart}
                disabled={book.in_cart}
                sx={{
                  mb: 2,
                  bgcolor: '#1a237e',
                  '&:hover': { bgcolor: '#0d47a1' },
                  color: 'white'
                }}
              >
                {book.in_cart ? 'In Someone\'s Cart' : 'Add to Cart'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<WishlistIcon />}
                fullWidth
                onClick={handleAddToWishlist}
                sx={{ borderColor: '#1a237e', color: '#1a237e' }}
              >
                Add to Wishlist
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as 'success' | 'error'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetailPage;