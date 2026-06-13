import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes';

const BottomNav: React.FunctionComponent = () => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20 flex border-t border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-black/90 backdrop-blur-md">
      {ROUTES.map(route => (
        <NavLink
          key={route.path}
          to={route.path}
          end={route.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
              isActive
                ? 'text-purple-700 dark:text-purple-400'
                : 'text-gray-400 dark:text-zinc-500'
            }`
          }
        >
          {route.icon}
          <span>{route.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
