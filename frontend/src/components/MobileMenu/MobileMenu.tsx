import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { IconBars } from '../icons';

const MobileMenu: React.FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="sm:hidden p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <IconBars />
        )}
      </button>

      {open && (
        <nav className="sm:hidden absolute top-14 left-0 right-0 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
          {ROUTES.map(route => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-gray-50 dark:border-zinc-900 transition-colors ${
                  isActive
                    ? 'text-purple-700 dark:text-purple-400 bg-purple-50/60 dark:bg-purple-900/10'
                    : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                }`
              }
            >
              {route.icon}
              {route.label}
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
};

export default MobileMenu;
