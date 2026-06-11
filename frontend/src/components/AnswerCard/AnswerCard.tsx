import React from 'react';

interface IProps {
  answer: string;
}

const AnswerCard: React.FunctionComponent<IProps> = ({ answer }) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/40">
        <svg className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-widest">AI Answer</span>
      </div>
      <div className="p-6">
        <p className="text-gray-800 dark:text-zinc-100 text-base leading-relaxed whitespace-pre-wrap">{answer}</p>
      </div>
    </div>
  );
}

export default AnswerCard;
