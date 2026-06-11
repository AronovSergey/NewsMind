import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FunctionComponent = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="w-full px-8 h-14 flex items-center">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-slate-900">NewsMind</span>
        </Link>

      </div>
    </header>
  );
}

export default Header;
