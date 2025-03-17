import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';

interface HeaderProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount = 0, wishlistItemCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-[var(--color-navy)] text-[var(--color-white)] fixed w-full top-0 z-[var(--z-header)]">
      <div className="container mx-auto px-4 h-[var(--header-height)] flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="ReReadery" className="h-8 w-8" />
          <span className="text-xl font-bold">ReReadery</span>
        </Link>

        {/* Dynamic Middle Section */}
        <div className="hidden md:block flex-1 mx-8">
          {isHomePage ? (
            <div className="max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search for books..."
                className="w-full px-4 py-2 rounded-full bg-[var(--color-gray-100)] text-[var(--color-gray-900)]"
              />
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-center">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
            </h1>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="hover:text-[var(--color-gray-300)]">Orders</Link>
              <Link to="/wishlist" className="hover:text-[var(--color-gray-300)] relative">
                Wishlist
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-olive)] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="hover:text-[var(--color-gray-300)] relative">
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-olive)] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <div className="relative group">
                <button className="hover:text-[var(--color-gray-300)]">
                  Account
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Account Details
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-[var(--color-gray-300)]">Sign In</Link>
              <Link
                to="/signup"
                className="bg-[var(--color-olive)] hover:bg-[var(--color-olive-light)] px-4 py-2 rounded-md transition-colors"
              >
                Create Account
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[var(--header-height)] left-0 right-0 bg-[var(--color-navy)] border-t border-[var(--color-gray-700)]">
            <div className="px-4 py-3">
              <input
                type="search"
                placeholder="Search for books..."
                className="w-full px-4 py-2 rounded-full bg-[var(--color-gray-100)] text-[var(--color-gray-900)]"
              />
            </div>
            <nav className="px-4 py-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="block py-2">Orders</Link>
                  <Link to="/wishlist" className="block py-2 relative">
                    Wishlist
                    {wishlistItemCount > 0 && (
                      <span className="ml-2 bg-[var(--color-olive)] text-xs rounded-full px-2 py-1">
                        {wishlistItemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="block py-2 relative">
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-[var(--color-olive)] text-xs rounded-full px-2 py-1">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/account" className="block py-2">Account Details</Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left py-2 text-[var(--color-gray-300)]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="block py-2">Sign In</Link>
                  <Link
                    to="/signup"
                    className="block py-2 bg-[var(--color-olive)] hover:bg-[var(--color-olive-light)] px-4 rounded-md transition-colors text-center"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
