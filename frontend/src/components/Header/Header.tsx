import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle/ThemeToggle';

const Header: React.FunctionComponent = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/60 dark:border-zinc-900">
      <div className="w-full px-8 h-14 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)' }}
          >
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>N</span>
          </div>
          <span className="font-semibold text-sm text-gray-900 dark:text-white">NewsMind</span>
        </Link>

        <ThemeToggle />

      </div>
    </header>
  );
}

export default Header;
