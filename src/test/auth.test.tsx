import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from '../pages/auth/LoginForm'
import { RegisterForm } from '../pages/auth/RegisterForm'

describe('Authentication', () => {
  describe('Login', () => {
    it('should render login form', () => {
      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      )
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('should handle successful login', async () => {
      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      )
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      })
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/login successful/i)).toBeInTheDocument()
      })
    })
  })

  describe('Registration', () => {
    it('should render registration form', () => {
      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      )
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    })

    it('should handle successful registration', async () => {
      render(
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      )
      
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test User' }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' }
      })
      
      fireEvent.click(screen.getByRole('button', { name: /register/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
      })
    })
  })
})