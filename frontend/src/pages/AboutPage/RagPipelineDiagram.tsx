import React from 'react';

const STEPS = [
  { label: 'User Question', icon: '💬' },
  { label: 'Embed (text-embedding-3-small)', icon: '🔢' },
  { label: 'Cosine Search (pgvector)', icon: '🔍' },
  { label: 'Top-5 Chunks', icon: '📄' },
  { label: 'GPT-4o-mini', icon: '🤖' },
  { label: 'Answer + Sources', icon: '✅' },
];

const StepCard: React.FunctionComponent<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-white dark:bg-zinc-800/60 shadow-sm px-3 py-2.5 text-center">
    <span className="text-xl leading-none">{icon}</span>
    <span className="text-xs font-medium text-gray-700 dark:text-zinc-300 leading-tight">{label}</span>
  </div>
);

const RagPipelineDiagram: React.FunctionComponent = () => {
  return (
    <>
      {/* Mobile: vertical stack */}
      <div className="flex flex-col items-center gap-1 sm:hidden">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.label}>
            <StepCard icon={step.icon} label={step.label} />
            {i < STEPS.length - 1 && (
              <span className="text-purple-400 dark:text-purple-600 font-bold text-base leading-none select-none">↓</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop: horizontal row */}
      <div className="hidden sm:flex items-center justify-center gap-2 flex-wrap">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className="min-w-[100px] max-w-[120px]">
              <StepCard icon={step.icon} label={step.label} />
            </div>
            {i < STEPS.length - 1 && (
              <span className="text-purple-400 dark:text-purple-600 font-bold text-lg leading-none select-none">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default RagPipelineDiagram;
