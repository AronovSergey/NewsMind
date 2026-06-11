import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { IconBars } from '../icons';

interface IProps {}

const Sidebar: React.FunctionComponent<IProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`sticky top-14 h-[calc(100vh-3.5rem)] flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden transition-[width] duration-200 ${isOpen ? 'w-52' : 'w-14'}`}
    >
      <button
        onClick={() => setIsOpen(o => !o)}
        className="h-14 flex items-center px-4 gap-3 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors border-b border-gray-100 dark:border-zinc-800/60"
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <IconBars />
        {isOpen && (
          <span className="text-sm font-medium whitespace-nowrap">Menu</span>
        )}
      </button>

      <nav className="flex-1 py-2">
        {ROUTES.map(route => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.end}
            className={({ isActive }) =>
              `flex items-center h-10 px-4 gap-3 text-sm transition-colors ${
                isActive
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900'
              }`
            }
          >
            {route.icon}
            {isOpen && (
              <span className="whitespace-nowrap">{route.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
