import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export class OrderController {
  // Create a new order
  async createOrder(req: Request, res: Response) {
    try {
      const { books, deliveryMethod, shippingDetails } = req.body;
      const buyerId = req.user?.id;

      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Create order
        const orderId = uuidv4();
        let totalAmount = 0;

        // Calculate total amount and verify book availability
        for (const book of books) {
          const [bookDetails] = await connection.query(
            'SELECT price, seller_id FROM books WHERE book_id = ?',
            [book.bookId]
          );

          if (!bookDetails.length) {
            throw new Error(`Book ${book.bookId} not found`);
          }

          // Check if book is in someone's cart
          const [cartStatus] = await connection.query(
            'SELECT cart_item_id FROM cart_items WHERE book_id = ?',
            [book.bookId]
          );

          if (cartStatus.length > 0) {
            throw new Error(`Book ${book.bookId} is currently in cart`);
          }

          totalAmount += bookDetails[0].price;
        }

        // Insert order
        await connection.query(
          `INSERT INTO orders (
            order_id, buyer_id, seller_id, total_amount,
            payment_status, delivery_method
          ) VALUES (?, ?, ?, ?, 'pending', ?)`,
          [orderId, buyerId, books[0].sellerId, totalAmount, deliveryMethod]
        );

        // Insert order items
        for (const book of books) {
          const orderItemId = uuidv4();
          const collectionCode = Math.random().toString(36).substring(2, 8).toUpperCase();

          await connection.query(
            `INSERT INTO order_items (
              order_item_id, order_id, book_id,
              quantity, price_per_unit, collection_code
            ) VALUES (?, ?, ?, 1, ?, ?)`,
            [orderItemId, orderId, book.bookId, book.price, collectionCode]
          );
        }

        // Add shipping details if delivery method is 'delivery'
        if (deliveryMethod === 'delivery' && shippingDetails) {
          const shippingId = uuidv4();
          await connection.query(
            `INSERT INTO shipping_details (
              shipping_id, order_id, address, city,
              postal_code, contact_number
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              shippingId,
              orderId,
              shippingDetails.address,
              shippingDetails.city,
              shippingDetails.postalCode,
              shippingDetails.contactNumber
            ]
          );
        }

        await connection.commit();
        res.status(201).json({
          message: 'Order created successfully',
          orderId,
          totalAmount
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  // Get buyer's orders
  async getBuyerOrders(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id;
      const { status } = req.query;

      let query = `
        SELECT o.*, oi.collection_code,
          b.title, b.author, b.image,
          u.name as seller_name,
          sd.address, sd.city, sd.postal_code
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN books b ON oi.book_id = b.book_id
        JOIN users u ON o.seller_id = u.user_id
        LEFT JOIN shipping_details sd ON o.order_id = sd.order_id
        WHERE o.buyer_id = ?
      `;

      const params = [buyerId];

      if (status) {
        query += ' AND o.payment_status = ?';
        params.push(status);
      }

      query += ' ORDER BY o.created_at DESC';

      const [orders] = await pool.query(query, params);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching buyer orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get seller's orders
  async getSellerOrders(req: Request, res: Response) {
    try {
      const sellerId = req.user?.id;
      const { status } = req.query;

      let query = `
        SELECT o.*, oi.collection_code,
          b.title, b.author, b.image,
          u.name as buyer_name,
          sd.address, sd.city, sd.postal_code
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN books b ON oi.book_id = b.book_id
        JOIN users u ON o.buyer_id = u.user_id
        LEFT JOIN shipping_details sd ON o.order_id = sd.order_id
        WHERE o.seller_id = ?
      `;

      const params = [sellerId];

      if (status) {
        query += ' AND o.payment_status = ?';
        params.push(status);
      }

      query += ' ORDER BY o.created_at DESC';

      const [orders] = await pool.query(query, params);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      // Verify order ownership
      const [order] = await pool.query(
        'SELECT seller_id FROM orders WHERE order_id = ?',
        [orderId]
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.seller_id !== userId) {
        return res.status(403).json({ message: 'Unauthorized to update this order' });
      }

      await pool.query(
        'UPDATE orders SET payment_status = ? WHERE order_id = ?',
        [status, orderId]
      );

      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get order details
  async getOrderDetails(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const [order] = await pool.query(
        `SELECT o.*, oi.collection_code,
          b.title, b.author, b.image,
          seller.name as seller_name,
          buyer.name as buyer_name,
          sd.address, sd.city, sd.postal_code
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN books b ON oi.book_id = b.book_id
        JOIN users seller ON o.seller_id = seller.user_id
        JOIN users buyer ON o.buyer_id = buyer.user_id
        LEFT JOIN shipping_details sd ON o.order_id = sd.order_id
        WHERE o.order_id = ?
        AND (o.buyer_id = ? OR o.seller_id = ?)`,
        [orderId, userId, userId]
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
