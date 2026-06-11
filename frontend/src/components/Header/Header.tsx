import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import Logo from '../Logo/Logo';

const Header: React.FunctionComponent = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/60 dark:border-zinc-900">
      <div className="w-full px-8 h-14 flex items-center justify-between">

        <Link to="/">
          <Logo showIcon />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/fetches"
            className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Fetch History
          </Link>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}

export default Header;
