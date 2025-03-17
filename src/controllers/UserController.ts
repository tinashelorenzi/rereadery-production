import { Request, Response } from 'express';
import { User, UserRole } from '../types/auth';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class UserController {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // From auth middleware
      const [user] = await pool.query(
        'SELECT user_id, name, surname, email, user_type, profile_image FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, surname, email } = req.body;

      await pool.query(
        'UPDATE users SET name = ?, surname = ?, email = ? WHERE user_id = ?',
        [name, surname, email, userId]
      );

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Create new user
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, name, surname, userType } = req.body;

      // Check if email already exists
      const [existingUser] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create new user
      const userId = uuidv4();
      await pool.query(
        'INSERT INTO users (user_id, email, password_hash, name, surname, user_type) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, email, passwordHash, name, surname, userType]
      );

      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete user account
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);

      res.json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get user's selling statistics
  async getSellerStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const [stats] = await pool.query(
        `SELECT 
          COUNT(DISTINCT o.order_id) as total_orders,
          COUNT(DISTINCT b.book_id) as total_books,
          SUM(o.total_amount) as total_revenue
        FROM users u
        LEFT JOIN books b ON u.user_id = b.seller_id
        LEFT JOIN orders o ON u.user_id = o.seller_id
        WHERE u.user_id = ?`,
        [userId]
      );

      res.json(stats);
    } catch (error) {
      console.error('Error fetching seller stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}