import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { paymentService } from '../services/payment';

export class PaymentController {
  // Create payment intent and initialize order
  async createPayment(req: Request, res: Response) {
    try {
      const { cartItems, shippingDetails, totalAmount } = req.body;
      const userId = req.user?.id;

      // Create order record
      const orderId = uuidv4();
      await pool.query(
        `INSERT INTO orders (
          order_id, user_id, total_amount, shipping_details,
          status, created_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [orderId, userId, totalAmount, JSON.stringify(shippingDetails), 'pending']
      );

      // Create order items
      for (const item of cartItems) {
        const orderItemId = uuidv4();
        const collectionCode = paymentService.generateCollectionCode();
        await pool.query(
          `INSERT INTO order_items (
            order_item_id, order_id, book_id, price,
            collection_code, status
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [orderItemId, orderId, item.book_id, item.price, collectionCode, 'pending']
        );
      }

      // Create Yoco payment intent
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const paymentIntent = await paymentService.createPaymentIntent({
        amount: totalAmount,
        orderId,
        frontendUrl
      });

      // Clear cart items
      await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      res.json({
        paymentUrl: paymentIntent.redirect_url,
        orderId
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(req: Request, res: Response) {
    try {
      const { order_id, payment_intent_id } = req.query;

      // Verify payment status with Yoco
      const paymentIntent = await paymentService.verifyPayment(payment_intent_id as string);

      if (paymentIntent.status === 'succeeded') {
        // Update order status
        await pool.query(
          'UPDATE orders SET status = ? WHERE order_id = ?',
          ['completed', order_id]
        );

        // Update order items status
        await pool.query(
          'UPDATE order_items SET status = ? WHERE order_id = ?',
          ['ready_for_collection', order_id]
        );

        // Get order details for email
        const [orderItems] = await pool.query(
          `SELECT oi.*, b.title, b.author
          FROM order_items oi
          JOIN books b ON oi.book_id = b.book_id
          WHERE oi.order_id = ?`,
          [order_id]
        );

        // TODO: Send confirmation email with collection codes

        res.redirect(`/dashboard/orders/${order_id}`);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      res.redirect('/payment/error');
    }
  }

  // Handle failed payment
  async handlePaymentFailure(req: Request, res: Response) {
    try {
      const { order_id } = req.query;

      // Update order status
      await pool.query(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        ['failed', order_id]
      );

      // Update order items status
      await pool.query(
        'UPDATE order_items SET status = ? WHERE order_id = ?',
        ['cancelled', order_id]
      );

      res.redirect(`/payment/failure?order_id=${order_id}`);
    } catch (error) {
      console.error('Error handling payment failure:', error);
      res.redirect('/payment/error');
    }
  }

  // Get order status
  async getOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const [order] = await pool.query(
        `SELECT o.*, oi.*
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.order_id = ? AND o.user_id = ?`,
        [orderId, userId]
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
