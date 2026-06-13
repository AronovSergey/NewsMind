import React from 'react';

const STEPS = [
  { label: 'User Question', icon: '💬' },
  { label: 'Embed (text-embedding-3-small)', icon: '🔢' },
  { label: 'Cosine Search (pgvector)', icon: '🔍' },
  { label: 'Top-5 Chunks', icon: '📄' },
  { label: 'GPT-4o-mini', icon: '🤖' },
  { label: 'Answer + Sources', icon: '✅' },
];

const RagPipelineDiagram: React.FunctionComponent = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-zinc-800/60 shadow-sm px-3 py-2.5 text-center min-w-[100px] max-w-[120px]">
            <span className="text-xl leading-none">{step.icon}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-zinc-300 leading-tight">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <span className="text-purple-400 dark:text-purple-600 font-bold text-lg leading-none select-none">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RagPipelineDiagram;
