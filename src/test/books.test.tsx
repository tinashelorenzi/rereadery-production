import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BookList } from '../pages/BrowsePage'
import { BookDetail } from '../pages/BookDetailPage'

describe('Book Features', () => {
  describe('Book Listing', () => {
    it('should render book list', async () => {
      render(
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Test Book 1')).toBeInTheDocument()
        expect(screen.getByText('Test Book 2')).toBeInTheDocument()
      })
    })

    it('should display book prices correctly', async () => {
      render(
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('$29.99')).toBeInTheDocument()
        expect(screen.getByText('$19.99')).toBeInTheDocument()
      })
    })

    it('should show book conditions', async () => {
      render(
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Good')).toBeInTheDocument()
        expect(screen.getByText('Like New')).toBeInTheDocument()
      })
    })
  })

  describe('Book Details', () => {
    it('should render book details', async () => {
      render(
        <BrowserRouter>
          <BookDetail bookId="1" />
        </BrowserRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Test Book Details')).toBeInTheDocument()
        expect(screen.getByText('Test Author')).toBeInTheDocument()
        expect(screen.getByText('$24.99')).toBeInTheDocument()
        expect(screen.getByText('A detailed description of the book')).toBeInTheDocument()
      })
    })

    it('should display book image', async () => {
      render(
        <BrowserRouter>
          <BookDetail bookId="1" />
        </BrowserRouter>
      )
      
      await waitFor(() => {
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', '/images/book-detail.jpg')
        expect(image).toHaveAttribute('alt', 'Test Book Details')
      })
    })
  })
})