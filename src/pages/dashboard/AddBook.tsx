import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface BookFormData {
  isbn: string;
  title: string;
  author: string;
  genre: string[];
  format: 'hardback' | 'paperback';
  edition: string;
  publicationDate: string;
  condition: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  price: number;
  images: FileList;
}

const AddBook: React.FC = () => {
  const { register, handleSubmit, setValue, watch } = useForm<BookFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleISBNSearch = async (isbn: string) => {
    try {
      setIsLoading(true);
      setError('');
      // TODO: Implement ISBN API integration
      const response = await axios.get(`/api/books/isbn/${isbn}`);
      const bookData = response.data;
      
      // Auto-fill form fields
      setValue('title', bookData.title);
      setValue('author', bookData.author);
      setValue('genre', bookData.genres);
      setValue('publicationDate', bookData.publicationDate);
    } catch (err) {
      setError('Failed to fetch book details. Please enter manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Handle image upload
      const formData = new FormData();
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });

      // Submit book data
      await axios.post('/api/books', {
        ...data,
        images: formData
      });

      // Reset form or redirect
    } catch (err) {
      setError('Failed to add book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-navy-700 mb-6">Add New Book</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ISBN Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              {...register('isbn')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter ISBN"
            />
          </div>
          <button
            type="button"
            onClick={() => handleISBNSearch(watch('isbn'))}
            className="px-4 py-2 bg-olive-600 text-white rounded-md hover:bg-olive-700"
            disabled={isLoading}
          >
            Search ISBN
          </button>
        </div>

        {/* Book Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              {...register('author')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              multiple
              {...register('genre')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="sci-fi">Science Fiction</option>
              <option value="romance">Romance</option>
              {/* Add more genres */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              {...register('format')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="hardback">Hardback</option>
              <option value="paperback">Paperback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edition
            </label>
            <input
              type="text"
              {...register('edition')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Date
            </label>
            <input
              type="date"
              {...register('publicationDate')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              {...register('condition')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Poor">Poor</option>
              <option value="Fair">Fair</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register('images')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-navy-600 text-white rounded-md hover:bg-navy-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;