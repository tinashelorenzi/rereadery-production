# ReReadery API Documentation

## Overview
This documentation provides comprehensive details about the ReReadery API endpoints, authentication processes, and integration guidelines for developing companion applications.

## Base URL
```
http://localhost:3000/api
```

## Authentication

### JWT Authentication
ReReadery uses JWT (JSON Web Token) for authentication. Tokens are valid for 24 hours.

#### Obtaining a Token
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Test User"
  }
}
```

### Rate Limiting
- General API endpoints: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 attempts per hour per IP

## User Management Endpoints

### Register New User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### Update User Profile
```http
PUT /auth/users/{userId}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Add User Address
```http
POST /auth/users/{userId}/addresses
```

**Request Body:**
```json
{
  "street": "123 Main St",
  "city": "Example City",
  "state": "State",
  "postalCode": "12345",
  "country": "Country"
}
```

## Book Management Endpoints

### List Books
```http
GET /books
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): Sort field (e.g., 'price', 'title')
- `order` (optional): Sort order ('asc' or 'desc')

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Test Book 1",
      "author": "Author 1",
      "price": 29.99,
      "condition": "Good",
      "imageUrl": "/images/book1.jpg"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Get Book Details
```http
GET /books/{id}
```

**Response:**
```json
{
  "id": 1,
  "title": "Test Book Details",
  "author": "Test Author",
  "price": 24.99,
  "condition": "Good",
  "description": "A detailed description of the book",
  "imageUrl": "/images/book-detail.jpg"
}
```

## Order Processing Endpoints

### Create Order
```http
POST /orders
```

**Request Body:**
```json
{
  "items": [
    {
      "bookId": 1,
      "quantity": 1
    }
  ],
  "shippingAddressId": 1
}
```

**Response:**
```json
{
  "orderId": "order_123",
  "status": "confirmed",
  "items": [
    {
      "bookId": 1,
      "quantity": 1,
      "price": 29.99
    }
  ],
  "total": 29.99
}
```

## Payment Integration Endpoints

### Create Payment Intent
```http
POST /payments/create-intent
```

**Request Body:**
```json
{
  "amount": 2499,
  "currency": "ZAR",
  "orderId": "order_123"
}
```

**Response:**
```json
{
  "clientSecret": "mock_client_secret",
  "amount": 2499
}
```

## Error Handling

The API uses standard HTTP response codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Common Use Cases

### User Registration and Login Flow
1. Register new user
2. Login to obtain JWT token
3. Use token in Authorization header for subsequent requests

### Book Search and Purchase Flow
1. Search books using filters
2. Get detailed information for specific book
3. Create order with selected books
4. Create payment intent
5. Complete payment using Yoco integration

### Inventory Management Flow
1. Authenticate as seller
2. List available books
3. Add new books to inventory
4. Update book details and stock levels

## Security Considerations
- All endpoints require HTTPS
- Sensitive data should be transmitted securely
- JWT tokens must be included in Authorization header
- Input validation follows strict patterns for email, username, and other fields