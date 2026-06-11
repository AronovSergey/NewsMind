import React from 'react';

interface IProps {
  size?: 'sm' | 'lg';
  showIcon?: boolean;
}

const Logo: React.FunctionComponent<IProps> = ({ size = 'sm', showIcon = false }) => {
  const large = size === 'lg';

  return (
    <div className={`inline-flex items-center ${large ? 'gap-3' : 'gap-2'}`}>
      {showIcon && (
        <div
          className={`${large ? 'w-14 h-14 rounded-2xl' : 'w-7 h-7 rounded-lg'} flex items-center justify-center shrink-0`}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
            ...(large && { boxShadow: '0 4px 28px rgba(124,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.15)' }),
          }}
        >
          <span
            className={`text-white font-bold ${large ? 'text-2xl' : 'text-sm'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            N
          </span>
        </div>
      )}
      <span className={large ? 'text-4xl sm:text-5xl font-bold tracking-tight' : 'font-semibold text-sm'}>
        <span className="text-purple-700 dark:text-purple-400">News</span>
        <span className="text-gray-900 dark:text-white">Mind</span>
      </span>
    </div>
  );
}

export default Logo;
