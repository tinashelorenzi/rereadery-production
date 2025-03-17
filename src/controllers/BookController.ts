import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

export class BookController {
  // Get all books with optional filters
  async getBooks(req: Request, res: Response) {
    try {
      const { genre, condition, minPrice, maxPrice, search, store, location, sortBy, sortOrder } = req.query;
      let query = `
        SELECT b.*, u.name as seller_name, u.user_type as seller_type
        FROM books b
        JOIN users u ON b.seller_id = u.user_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (genre) {
        query += ' AND b.genre = ?';
        params.push(genre);
      }

      if (condition) {
        query += ' AND b.condition_rating = ?';
        params.push(condition);
      }

      if (minPrice) {
        query += ' AND b.price >= ?';
        params.push(minPrice);
      }

      if (maxPrice) {
        query += ' AND b.price <= ?';
        params.push(maxPrice);
      }

      if (store) {
        query += ' AND u.user_type = "store_owner" AND u.user_id = ?';
        params.push(store);
      }

      if (location) {
        query += ' AND EXISTS (SELECT 1 FROM shipping_details sd WHERE sd.seller_id = b.seller_id AND sd.postal_code LIKE ?)';
        params.push(`${location}%`);
      }

      if (search) {
        query += ' AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Add sorting
      if (sortBy) {
        const validSortColumns = ['price', 'created_at', 'condition_rating'];
        const sortColumn = validSortColumns.includes(sortBy.toString()) ? sortBy : 'created_at';
        const order = sortOrder?.toString().toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY b.${sortColumn} ${order}`;
      } else {
        query += ' ORDER BY b.created_at DESC';
      }

      const [books] = await pool.query(query, params);
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get a single book by ID with seller information
  async getBookById(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const [book] = await pool.query(
        `SELECT b.*, u.name as seller_name, u.user_type as seller_type,
          EXISTS(SELECT 1 FROM cart_items c WHERE c.book_id = b.book_id) as in_cart
        FROM books b
        JOIN users u ON b.seller_id = u.user_id
        WHERE b.book_id = ?`,
        [bookId]
      );

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      res.json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Create a new book listing
  async createBook(req: Request, res: Response) {
    try {
      const {
        isbn,
        title,
        author,
        genre,
        condition_rating,
        price,
        image,
        publication_date
      } = req.body;
      const seller_id = req.user?.id;

      const book_id = uuidv4();
      await pool.query(
        `INSERT INTO books (
          book_id, isbn, title, author, genre, condition_rating,
          price, image, publication_date, seller_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book_id, isbn, title, author, genre, condition_rating,
          price, image, publication_date, seller_id
        ]
      );

      res.status(201).json({ message: 'Book listed successfully', book_id });
    } catch (error) {
      console.error('Error creating book listing:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update a book listing
  async updateBook(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const {
        isbn,
        title,
        author,
        genre,
        condition_rating,
        price,
        image,
        publication_date
      } = req.body;
      const seller_id = req.user?.id;

      // Verify book ownership
      const [book] = await pool.query(
        'SELECT seller_id FROM books WHERE book_id = ?',
        [bookId]
      );

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      if (book.seller_id !== seller_id) {
        return res.status(403).json({ message: 'Unauthorized to update this book' });
      }

      await pool.query(
        `UPDATE books SET
          isbn = ?, title = ?, author = ?, genre = ?,
          condition_rating = ?, price = ?, image = ?,
          publication_date = ?
        WHERE book_id = ?`,
        [
          isbn, title, author, genre, condition_rating,
          price, image, publication_date, bookId
        ]
      );

      res.json({ message: 'Book updated successfully' });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete a book listing
  async deleteBook(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const seller_id = req.user?.id;

      // Verify book ownership
      const [book] = await pool.query(
        'SELECT seller_id FROM books WHERE book_id = ?',
        [bookId]
      );

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      if (book.seller_id !== seller_id) {
        return res.status(403).json({ message: 'Unauthorized to delete this book' });
      }

      await pool.query('DELETE FROM books WHERE book_id = ?', [bookId]);
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Search books
  async searchBooks(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const searchTerm = `%${query}%`;

      const [books] = await pool.query(
        `SELECT * FROM books
        WHERE title LIKE ?
        OR author LIKE ?
        OR isbn LIKE ?
        OR genre LIKE ?`,
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );

      res.json(books);
    } catch (error) {
      console.error('Error searching books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}