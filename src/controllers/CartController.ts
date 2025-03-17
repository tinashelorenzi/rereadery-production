import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export class CartController {
  // Add item to cart
  async addToCart(req: Request, res: Response) {
    try {
      const { bookId } = req.body;
      const userId = req.user?.id;

      // Check if book is available and not in someone else's cart
      const [bookStatus] = await pool.query(
        'SELECT book_id FROM cart_items WHERE book_id = ?',
        [bookId]
      );

      if (bookStatus.length > 0) {
        return res.status(400).json({ message: 'Book is currently in another user\'s cart' });
      }

      const cartItemId = uuidv4();
      await pool.query(
        `INSERT INTO cart_items (
          cart_item_id, user_id, book_id
        ) VALUES (?, ?, ?)`,
        [cartItemId, userId, bookId]
      );

      res.status(201).json({ message: 'Book added to cart successfully' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get user's cart items
  async getCartItems(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const [cartItems] = await pool.query(
        `SELECT c.*, b.* 
        FROM cart_items c
        JOIN books b ON c.book_id = b.book_id
        WHERE c.user_id = ? AND c.timer_status != 'expired'`,
        [userId]
      );

      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Remove item from cart
  async removeFromCart(req: Request, res: Response) {
    try {
      const { cartItemId } = req.params;
      const userId = req.user?.id;

      await pool.query(
        'DELETE FROM cart_items WHERE cart_item_id = ? AND user_id = ?',
        [cartItemId, userId]
      );

      res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update cart timer status
  async updateCartTimer(req: Request, res: Response) {
    try {
      const { cartItemId } = req.params;
      const { timerStatus } = req.body;
      const userId = req.user?.id;

      await pool.query(
        `UPDATE cart_items 
        SET timer_status = ?, last_activity = CURRENT_TIMESTAMP
        WHERE cart_item_id = ? AND user_id = ?`,
        [timerStatus, cartItemId, userId]
      );

      if (timerStatus === 'expired') {
        // Move to wishlist
        const [cartItem] = await pool.query(
          'SELECT book_id FROM cart_items WHERE cart_item_id = ?',
          [cartItemId]
        );

        if (cartItem) {
          const wishlistItemId = uuidv4();
          await pool.query(
            `INSERT INTO wishlist_items (
              wishlist_item_id, user_id, book_id, added_from_cart
            ) VALUES (?, ?, ?, true)`,
            [wishlistItemId, userId, cartItem.book_id]
          );

          await pool.query(
            'DELETE FROM cart_items WHERE cart_item_id = ?',
            [cartItemId]
          );
        }
      }

      res.json({ message: 'Cart timer updated successfully' });
    } catch (error) {
      console.error('Error updating cart timer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Reset cart timer
  async resetCartTimer(req: Request, res: Response) {
    try {
      const { cartItemId } = req.params;
      const userId = req.user?.id;

      await pool.query(
        `UPDATE cart_items 
        SET timer_status = 'active', last_activity = CURRENT_TIMESTAMP
        WHERE cart_item_id = ? AND user_id = ?`,
        [cartItemId, userId]
      );

      res.json({ message: 'Cart timer reset successfully' });
    } catch (error) {
      console.error('Error resetting cart timer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
