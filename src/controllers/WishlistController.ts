import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export class WishlistController {
  // Add item to wishlist
  async addToWishlist(req: Request, res: Response) {
    try {
      const { bookId } = req.body;
      const userId = req.user?.id;

      const wishlistItemId = uuidv4();
      await pool.query(
        `INSERT INTO wishlist_items (
          wishlist_item_id, user_id, book_id
        ) VALUES (?, ?, ?)`,
        [wishlistItemId, userId, bookId]
      );

      res.status(201).json({ message: 'Book added to wishlist successfully' });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get user's wishlist items
  async getWishlistItems(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const [wishlistItems] = await pool.query(
        `SELECT w.*, b.*, 
          EXISTS(SELECT 1 FROM cart_items c WHERE c.book_id = w.book_id) as is_in_cart
        FROM wishlist_items w
        JOIN books b ON w.book_id = b.book_id
        WHERE w.user_id = ?`,
        [userId]
      );

      res.json(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(req: Request, res: Response) {
    try {
      const { wishlistItemId } = req.params;
      const userId = req.user?.id;

      await pool.query(
        'DELETE FROM wishlist_items WHERE wishlist_item_id = ? AND user_id = ?',
        [wishlistItemId, userId]
      );

      res.json({ message: 'Item removed from wishlist successfully' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get similar book recommendations
  async getSimilarBooks(req: Request, res: Response) {
    try {
      const { bookId } = req.params;

      const [recommendations] = await pool.query(
        `SELECT b.*, r.similarity_score
        FROM book_recommendations r
        JOIN books b ON r.recommended_book_id = b.book_id
        WHERE r.book_id = ?
        AND NOT EXISTS (SELECT 1 FROM cart_items c WHERE c.book_id = b.book_id)
        ORDER BY r.similarity_score DESC
        LIMIT 5`,
        [bookId]
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Error fetching similar books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Check availability of wishlist items
  async checkWishlistAvailability(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const [unavailableItems] = await pool.query(
        `SELECT w.*, b.title
        FROM wishlist_items w
        JOIN books b ON w.book_id = b.book_id
        WHERE w.user_id = ?
        AND EXISTS (SELECT 1 FROM cart_items c WHERE c.book_id = w.book_id)`,
        [userId]
      );

      if (unavailableItems.length > 0) {
        // Get recommendations for unavailable items
        const recommendations = await Promise.all(
          unavailableItems.map(async (item: any) => {
            const [similar] = await pool.query(
              `SELECT b.*
              FROM book_recommendations r
              JOIN books b ON r.recommended_book_id = b.book_id
              WHERE r.book_id = ?
              AND NOT EXISTS (SELECT 1 FROM cart_items c WHERE c.book_id = b.book_id)
              ORDER BY r.similarity_score DESC
              LIMIT 1`,
              [item.book_id]
            );
            return { unavailableBook: item, recommendation: similar[0] };
          })
        );

        res.json({
          unavailableItems,
          recommendations
        });
      } else {
        res.json({ message: 'All wishlist items are available' });
      }
    } catch (error) {
      console.error('Error checking wishlist availability:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
