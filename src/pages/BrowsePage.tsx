import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Card, CardMedia, CardContent, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Book {
  book_id: string;
  title: string;
  author: string;
  genre: string;
  condition_rating: number;
  price: number;
  image: string;
  seller_name: string;
  seller_type: string;
}

const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    minPrice: '',
    maxPrice: '',
    store: '',
    location: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    fetchBooks();
  }, [filters, searchQuery, sortBy, sortOrder]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/books', {
        params: {
          search: searchQuery,
          sortBy,
          sortOrder,
          ...filters
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string) => (event: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search books or authors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={filters.genre}
                label="Genre"
                onChange={handleFilterChange('genre')}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="fiction">Fiction</MenuItem>
                <MenuItem value="non-fiction">Non-Fiction</MenuItem>
                <MenuItem value="mystery">Mystery</MenuItem>
                <MenuItem value="sci-fi">Science Fiction</MenuItem>
                <MenuItem value="romance">Romance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange('minPrice')}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange('maxPrice')}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Location (Postal Code)"
              value={filters.location}
              onChange={handleFilterChange('location')}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="created_at">Newest First</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="condition_rating">Condition</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort Order</InputLabel>
              <Select
                value={sortOrder}
                label="Sort Order"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="ASC">Ascending</MenuItem>
                <MenuItem value="DESC">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item key={book.book_id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
                }}
                onClick={() => navigate(`/books/${book.book_id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.image || '/placeholder-book.jpg'}
                  alt={book.title}
                  sx={{ objectFit: 'contain', p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genre: {book.genre}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${book.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Condition: {book.condition_rating}/5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seller: {book.seller_name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BrowsePage;