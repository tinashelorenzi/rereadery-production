import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface YocoPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata: {
    order_id: string;
  };
  success_url: string;
  failure_url: string;
  redirect_url: string;
}

interface CreatePaymentParams {
  amount: number;
  orderId: string;
  frontendUrl: string;
}

class PaymentService {
  private readonly apiUrl = 'https://payments.yoco.com/api';
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.NODE_ENV === 'production'
      ? process.env.YOCO_LIVE_SECRET_KEY || ''
      : process.env.YOCO_TEST_SECRET_KEY || '';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.secretKey}`
    };
  }

  async createPaymentIntent({ amount, orderId, frontendUrl }: CreatePaymentParams): Promise<YocoPaymentIntent> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/checkouts`,
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'ZAR',
          metadata: { order_id: orderId },
          success_url: `${frontendUrl}/payment/success?order_id=${orderId}`,
          failure_url: `${frontendUrl}/payment/failure?order_id=${orderId}`
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Yoco payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async verifyPayment(paymentIntentId: string): Promise<YocoPaymentIntent> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/checkouts/${paymentIntentId}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error verifying Yoco payment:', error);
      throw new Error('Failed to verify payment');
    }
  }

  generateCollectionCode(): string {
    // Generate a 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export const paymentService = new PaymentService();