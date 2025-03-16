import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Mall App
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/stores" className="text-gray-600 hover:text-gray-800">
            Stores
          </Link>
          <CartIcon />
        </nav>
      </div>
    </header>
  );
}