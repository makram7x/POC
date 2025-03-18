import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import logo from '../assets/logo.png';

export default function Header() {
  return (
    <header className="bg-[#232f77]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Najaf City Mall Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/stores" className="text-white hover:text-white/80">
            Stores
          </Link>
          <CartIcon />
        </nav>
      </div>
    </header>
  );
}