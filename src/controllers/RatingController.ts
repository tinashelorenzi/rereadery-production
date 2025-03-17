import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export class RatingController {
  // Submit a rating
  async submitRating(req: Request, res: Response) {
    try {
      const { orderId, rateeId, ratingScore, reviewText, ratingType } = req.body;
      const raterId = req.user?.id;

      // Verify order completion and rating eligibility
      const [order] = await pool.query(
        'SELECT payment_status, buyer_id, seller_id FROM orders WHERE order_id = ?',
        [orderId]
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.payment_status !== 'paid') {
        return res.status(400).json({ message: 'Order must be completed before rating' });
      }

      // Verify user's role in the transaction
      if (ratingType === 'buyer_to_seller' && order.buyer_id !== raterId) {
        return res.status(403).json({ message: 'Only the buyer can rate the seller' });
      }

      if (ratingType === 'seller_to_buyer' && order.seller_id !== raterId) {
        return res.status(403).json({ message: 'Only the seller can rate the buyer' });
      }

      // Check if rating already exists
      const [existingRating] = await pool.query(
        'SELECT rating_id FROM ratings WHERE order_id = ? AND rating_type = ?',
        [orderId, ratingType]
      );

      if (existingRating.length > 0) {
        return res.status(400).json({ message: 'Rating already submitted for this order' });
      }

      // Create rating
      const ratingId = uuidv4();
      await pool.query(
        `INSERT INTO ratings (
          rating_id, order_id, rater_id, ratee_id,
          rating_score, review_text, rating_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ratingId, orderId, raterId, rateeId, ratingScore, reviewText, ratingType]
      );

      res.status(201).json({ message: 'Rating submitted successfully' });
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get user's trust score
  async getTrustScore(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const [trustScore] = await pool.query(
        `SELECT 
          average_rating,
          total_ratings,
          positive_ratings,
          negative_ratings
        FROM user_trust_scores
        WHERE user_id = ?`,
        [userId]
      );

      if (!trustScore) {
        return res.status(404).json({ message: 'Trust score not found' });
      }

      res.json(trustScore);
    } catch (error) {
      console.error('Error fetching trust score:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get user's ratings
  async getUserRatings(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { type } = req.query; // 'received' or 'given'

      let query = `
        SELECT r.*, 
          o.order_id,
          rater.name as rater_name,
          ratee.name as ratee_name
        FROM ratings r
        JOIN orders o ON r.order_id = o.order_id
        JOIN users rater ON r.rater_id = rater.user_id
        JOIN users ratee ON r.ratee_id = ratee.user_id
        WHERE ${type === 'given' ? 'r.rater_id' : 'r.ratee_id'} = ?
        ORDER BY r.created_at DESC
      `;

      const [ratings] = await pool.query(query, [userId]);
      res.json(ratings);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get order ratings
  async getOrderRatings(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      // Verify user's involvement in the order
      const [order] = await pool.query(
        'SELECT buyer_id, seller_id FROM orders WHERE order_id = ?',
        [orderId]
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.buyer_id !== userId && order.seller_id !== userId) {
        return res.status(403).json({ message: 'Unauthorized to view these ratings' });
      }

      const [ratings] = await pool.query(
        `SELECT r.*, 
          rater.name as rater_name,
          ratee.name as ratee_name
        FROM ratings r
        JOIN users rater ON r.rater_id = rater.user_id
        JOIN users ratee ON r.ratee_id = ratee.user_id
        WHERE r.order_id = ?`,
        [orderId]
      );

      res.json(ratings);
    } catch (error) {
      console.error('Error fetching order ratings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}