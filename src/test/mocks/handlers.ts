import { rest } from 'msw'

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      })
    )
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        message: 'User registered successfully'
      })
    )
  }),

  // Book endpoints
  rest.get('/api/books', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Test Book 1',
          author: 'Author 1',
          price: 29.99,
          condition: 'Good',
          imageUrl: '/images/book1.jpg'
        },
        {
          id: 2,
          title: 'Test Book 2',
          author: 'Author 2',
          price: 19.99,
          condition: 'Like New',
          imageUrl: '/images/book2.jpg'
        }
      ])
    )
  }),

  rest.get('/api/books/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id as string),
        title: 'Test Book Details',
        author: 'Test Author',
        price: 24.99,
        condition: 'Good',
        description: 'A detailed description of the book',
        imageUrl: '/images/book-detail.jpg'
      })
    )
  }),

  // Payment endpoints
  rest.post('/api/payments/create-intent', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        clientSecret: 'mock_client_secret',
        amount: 2499
      })
    )
  }),

  // Order endpoints
  rest.post('/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        orderId: 'order_123',
        status: 'confirmed',
        items: [
          {
            bookId: 1,
            quantity: 1,
            price: 29.99
          }
        ],
        total: 29.99
      })
    )
  })
]