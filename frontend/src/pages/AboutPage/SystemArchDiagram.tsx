import React from 'react';

interface IServiceBoxProps {
  label: string;
  sublabel?: string;
  accent: string;
}

const ServiceBox: React.FunctionComponent<IServiceBoxProps> = ({ label, sublabel, accent }) => (
  <div className={`rounded-xl border ${accent} px-4 py-2.5 text-center min-w-[120px]`}>
    <span className="text-xs font-semibold text-gray-800 dark:text-zinc-100 leading-tight block">{label}</span>
    {sublabel && <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 block">{sublabel}</span>}
  </div>
);

const Connector: React.FunctionComponent<{ label?: string }> = ({ label }) => (
  <div className="flex flex-col items-center">
    <div className="w-px h-4 bg-purple-200 dark:bg-purple-800" />
    {label && (
      <span className="text-[10px] text-gray-400 dark:text-zinc-500 px-1 bg-transparent">{label}</span>
    )}
    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-purple-300 dark:border-t-purple-700" />
  </div>
);

const SystemArchDiagram: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col items-center gap-0 overflow-x-auto py-2">
      {/* Frontend */}
      <ServiceBox
        label="React Frontend"
        sublabel="Vite · TypeScript · TailwindCSS"
        accent="border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-900/10"
      />

      <Connector label="REST" />

      {/* API Gateway */}
      <ServiceBox
        label="Spring Boot API Gateway"
        sublabel="Java 21 · port 8080"
        accent="border-violet-200 dark:border-violet-800/60 bg-violet-50/60 dark:bg-violet-900/10"
      />

      <Connector />

      {/* RabbitMQ Bus */}
      <div className="w-full max-w-lg border border-orange-200 dark:border-orange-700/60 rounded-full bg-orange-50 dark:bg-orange-900/15 text-center py-1.5 px-4">
        <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">RabbitMQ</span>
        <span className="text-[10px] text-orange-400 dark:text-orange-600 ml-1">async message bus</span>
      </div>

      {/* Fan-out connectors */}
      <div className="flex items-start justify-center gap-16 sm:gap-24">
        <Connector />
        <Connector />
        <Connector />
      </div>

      {/* Microservices */}
      <div className="flex flex-wrap justify-center gap-3">
        <ServiceBox
          label="RSS Fetcher"
          sublabel="port 8081"
          accent="border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10"
        />
        <ServiceBox
          label="Embedding Service"
          sublabel="port 8082"
          accent="border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10"
        />
        <ServiceBox
          label="Query / RAG Service"
          sublabel="port 8083"
          accent="border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10"
        />
      </div>

      {/* Connectors to data layer */}
      <div className="flex items-start justify-center gap-20 sm:gap-32">
        <Connector />
        <Connector />
      </div>

      {/* Data layer */}
      <div className="flex flex-wrap justify-center gap-3">
        <ServiceBox
          label="PostgreSQL + pgvector"
          sublabel="articles · chunks · embeddings"
          accent="border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-900/10"
        />
        <ServiceBox
          label="Redis"
          sublabel="query cache · 30 min TTL"
          accent="border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-900/10"
        />
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {[
          { color: 'bg-indigo-200 dark:bg-indigo-700', label: 'Frontend' },
          { color: 'bg-violet-200 dark:bg-violet-700', label: 'API Layer' },
          { color: 'bg-orange-200 dark:bg-orange-700', label: 'Message Bus' },
          { color: 'bg-teal-200 dark:bg-teal-700', label: 'Microservices' },
          { color: 'bg-amber-200 dark:bg-amber-700', label: 'Data Layer' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            <span className="text-[10px] text-gray-400 dark:text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemArchDiagram;
