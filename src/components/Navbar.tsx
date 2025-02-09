import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Plus, List, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => 
    location.pathname === path ? 'bg-indigo-700' : '';

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="w-6 h-6" />
            <span className="font-bold text-lg">Anime Admin</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors ${isActive('/')}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/add"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors ${isActive('/add')}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Anime</span>
            </Link>
            
            <Link
              to="/list"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors ${isActive('/list')}`}
            >
              <List className="w-4 h-4" />
              <span>Anime List</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;