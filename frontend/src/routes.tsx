import React, { ReactElement } from 'react';
import HomePage from './pages/HomePage/HomePage';
import FetchesPage from './pages/FetchesPage/FetchesPage';
import { IconHome, IconClock } from './components/icons';

export interface AppRoute {
  path: string;
  label: string;
  icon: ReactElement;
  element: ReactElement;
  end: boolean;
}

export const ROUTES: AppRoute[] = [
  {
    path: '/',
    label: 'Home',
    icon: <IconHome />,
    element: <HomePage />,
    end: true,
  },
  {
    path: '/fetches',
    label: 'Fetch History',
    icon: <IconClock />,
    element: <FetchesPage />,
    end: false,
  },
];
