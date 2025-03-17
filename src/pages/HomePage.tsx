import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-[var(--color-navy)] text-[var(--color-white)]">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        <div className="container mx-auto px-4 h-full flex items-center relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Next Great Read
            </h1>
            <p className="text-xl mb-8">
              Join ReReadery's sustainable reading community. Find pre-loved books and give them a new home.
            </p>
            <Link
              to="/browse"
              className="bg-[var(--color-olive)] hover:bg-[var(--color-olive-light)] px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Browsing
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-[var(--color-gray-100)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN"
                  className="flex-1 px-4 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-olive)]"
                />
                <select className="px-4 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-olive)]">
                  <option value="">All Genres</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="sci-fi">Science Fiction</option>
                </select>
                <button className="bg-[var(--color-olive)] hover:bg-[var(--color-olive-light)] text-white px-6 py-2 rounded-md transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Books */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Recently Added Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Book cards will be dynamically rendered here */}
          </div>
        </div>
      </section>

      {/* Featured & Popular Books */}
      <section className="py-12 bg-[var(--color-gray-100)]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured & Popular Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured book cards will be dynamically rendered here */}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">About ReReadery</h2>
            <p className="text-lg mb-8 text-[var(--color-gray-700)]">
              ReReadery is more than just a bookstore - we're a community dedicated to sustainable reading.
              By giving pre-loved books a second home, we're reducing waste and making literature more
              accessible to everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Sustainable Reading</h3>
                <p>Every book you buy from us helps reduce waste and supports environmental consciousness.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Quality Assured</h3>
                <p>All our books are carefully inspected to ensure they're in good reading condition.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
                <p>Join a community of readers who share your passion for books and sustainability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating System */}
      <section className="py-12 bg-[var(--color-gray-100)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Rating System</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-olive)] rounded-full flex items-center justify-center text-white font-bold">5★</div>
                  <div>
                    <h3 className="font-semibold">Like New</h3>
                    <p className="text-[var(--color-gray-600)]">Minimal to no signs of wear, all pages intact and clean.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-olive)] rounded-full flex items-center justify-center text-white font-bold">4★</div>
                  <div>
                    <h3 className="font-semibold">Very Good</h3>
                    <p className="text-[var(--color-gray-600)]">Minor wear, may have minimal notes or highlighting.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-olive)] rounded-full flex items-center justify-center text-white font-bold">3★</div>
                  <div>
                    <h3 className="font-semibold">Good</h3>
                    <p className="text-[var(--color-gray-600)]">Average wear, all text readable, suitable for reading.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};