import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import { PaymentForm } from '../pages/checkout/PaymentForm'
import { OrderConfirmation } from '../pages/checkout/OrderConfirmation'

describe('Payment Flow', () => {
  describe('Payment Form', () => {
    it('should render payment form', () => {
      render(
        <BrowserRouter>
          <PaymentForm amount={2499} />
        </BrowserRouter>
      )
      expect(screen.getByLabelText(/card number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pay/i })).toBeInTheDocument()
    })

    it('should handle successful payment', async () => {
      render(
        <BrowserRouter>
          <PaymentForm amount={2499} />
        </BrowserRouter>
      )
      
      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4242424242424242' }
      })
      fireEvent.change(screen.getByLabelText(/expiry date/i), {
        target: { value: '12/25' }
      })
      fireEvent.change(screen.getByLabelText(/cvv/i), {
        target: { value: '123' }
      })
      
      fireEvent.click(screen.getByRole('button', { name: /pay/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/payment successful/i)).toBeInTheDocument()
      })
    })

    it('should display error for invalid card', async () => {
      render(
        <BrowserRouter>
          <PaymentForm amount={2499} />
        </BrowserRouter>
      )
      
      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '1111111111111111' }
      })
      fireEvent.change(screen.getByLabelText(/expiry date/i), {
        target: { value: '12/25' }
      })
      fireEvent.change(screen.getByLabelText(/cvv/i), {
        target: { value: '123' }
      })
      
      fireEvent.click(screen.getByRole('button', { name: /pay/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/invalid card number/i)).toBeInTheDocument()
      })
    })
  })

  describe('Order Confirmation', () => {
    it('should display order details after successful payment', async () => {
      render(
        <BrowserRouter>
          <OrderConfirmation orderId="order_123" />
        </BrowserRouter>
      )
      
      await waitFor(() => {
        expect(screen.getByText(/order confirmed/i)).toBeInTheDocument()
        expect(screen.getByText(/order_123/i)).toBeInTheDocument()
        expect(screen.getByText('$29.99')).toBeInTheDocument()
      })
    })
  })
})