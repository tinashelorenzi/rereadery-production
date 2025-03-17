import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  genre: string[];
  format: 'hardback' | 'paperback';
  edition: string;
  publicationDate: string;
  condition: string;
  price: number;
  images: string[];
  listingDate: string;
  soldStatus: boolean;
}

interface FilterOptions {
  genre: string[];
  format: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  dateRange: {
    start: string;
    end: string;
  };
  soldStatus: 'all' | 'sold' | 'unsold';
}

const InventoryManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Book>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterOptions>({
    genre: [],
    format: '',
    condition: '',
    minPrice: 0,
    maxPrice: 1000,
    dateRange: {
      start: '',
      end: ''
    },
    soldStatus: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, sortBy, sortOrder, filters]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/books', {
        params: {
          search: searchQuery,
          sortBy,
          sortOrder,
          ...filters
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsSold = async (bookId: string) => {
    try {
      await axios.patch(`/api/books/${bookId}`, { soldStatus: true });
      fetchBooks();
    } catch (error) {
      console.error('Error marking book as sold:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-700">Inventory Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-navy-600 mb-4">Filters</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              multiple
              value={filters.genre}
              onChange={(e) => setFilters({
                ...filters,
                genre: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="sci-fi">Science Fiction</option>
              <option value="romance">Romance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={filters.format}
              onChange={(e) => setFilters({ ...filters, format: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="hardback">Hardback</option>
              <option value="paperback">Paperback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="Poor">Poor</option>
              <option value="Fair">Fair</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.soldStatus}
              onChange={(e) => setFilters({
                ...filters,
                soldStatus: e.target.value as 'all' | 'sold' | 'unsold'
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All</option>
              <option value="sold">Sold</option>
              <option value="unsold">Unsold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">
                <button
                  onClick={() => {
                    setSortBy('title');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="flex items-center gap-1"
                >
                  Title
                  {sortBy === 'title' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">
                <button
                  onClick={() => {
                    setSortBy('author');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="flex items-center gap-1"
                >
                  Author
                  {sortBy === 'author' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">Genre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">Format</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">Condition</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">
                <button
                  onClick={() => {
                    setSortBy('price');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="flex items-center gap-1"
                >
                  Price
                  {sortBy === 'price' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-navy-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">Loading...</td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">No books found</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.genre.join(', ')}</td>
                  <td className="px-4 py-2">{book.format}</td>
                  <td className="px-4 py-2">{book.condition}</td>
                  <td className="px-4 py-2">${book.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${book.soldStatus ? 'bg-olive-100 text-olive-800' : 'bg-navy-100 text-navy-800'}`}
                    >
                      {book.soldStatus ? 'Sold' : 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkAsSold(book.id)}
                        disabled={book.soldStatus}
                        className="px-2 py-1 text-sm bg-olive-600 text-white rounded hover:bg-olive-700 disabled:bg-gray-300"
                      >
                        Mark as Sold
                      </button>
                      <a
                        href={`/dashboard/books/edit/${book.id}`}
                        className="px-2 py-1 text-sm bg-navy-600 text-white rounded hover:bg-navy-700"
                      >
                        Edit
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
