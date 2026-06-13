import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import Logo from '../Logo/Logo';
import MobileMenu from '../MobileMenu/MobileMenu';

const Header: React.FunctionComponent = () => {
  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200/60 dark:border-zinc-900">
      <div className="w-full px-4 sm:px-8 h-14 flex items-center justify-between">

        <Link to="/">
          <Logo showIcon />
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <MobileMenu />
        </div>

      </div>
    </header>
  );
}

export default Header;
