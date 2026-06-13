import React from 'react';
import Logo from '../../components/Logo/Logo';
import RagPipelineDiagram from './RagPipelineDiagram';
import SystemArchDiagram from './SystemArchDiagram';

const BACKEND_STACK = [
  'Java 21', 'Spring Boot 3', 'RabbitMQ', 'PostgreSQL', 'pgvector',
  'Redis', 'OpenAI API', 'Flyway',
];

const FRONTEND_STACK = [
  'React 19', 'TypeScript', 'Vite', 'TailwindCSS v4', 'React Query', 'React Router v7',
];

const MICROSERVICES_STACK = [
  'API Gateway', 'RSS Fetcher', 'Embedding Service', 'Query / RAG Service', 'Event-driven (RabbitMQ)', 'Service isolation',
];

const DEPLOY_STACK = [
  'Docker', 'Docker Compose', 'VPS (Ubuntu)', 'Nginx reverse proxy', 'Let\'s Encrypt (HTTPS)',
];

const CICD_STACK = [
  'GitHub Actions', 'Automated build', 'Docker image push', 'SSH deploy on merge',
];

const SectionCard: React.FunctionComponent<{ label: string; delay?: string; children: React.ReactNode }> = ({ label, delay, children }) => (
  <div
    className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-purple-900/60 shadow-sm overflow-hidden nm-fade-up"
    style={delay ? { animationDelay: delay } : undefined}
  >
    <div className="h-[3px] bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500" />
    <div className="px-6 pt-5 pb-1">
      <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
    </div>
    <div className="p-6 pt-4">{children}</div>
  </div>
);

const AboutPage: React.FunctionComponent = () => {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative">
      {/* Purple orb background (dark mode only) */}
      <div className="hidden dark:block pointer-events-none fixed top-0 inset-x-0 h-[60vh] -z-10 overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[110vw] h-full rounded-[50%] blur-[180px] bg-purple-600/[0.06]" />
        <div className="absolute -top-1/3 left-1/2 -translate-x-[40%] w-[70vw] h-3/4 rounded-[50%] blur-[140px] bg-violet-400/[0.03]" />
      </div>

      <div className="space-y-6">
        {/* Hero */}
        <div className="text-center py-6 nm-fade-up">
          <div className="mb-4">
            <Logo size="lg" showIcon />
          </div>
          <p className="text-gray-500 dark:text-zinc-400 text-base mt-3">
            Ask anything. Get sourced answers from today's news.
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            NewsMind is a distributed news intelligence platform built as a full-stack portfolio project.
            It ingests live RSS feeds every hour, stores vector embeddings in PostgreSQL, and answers
            natural-language questions using a RAG pipeline backed by GPT-4o mini.
          </p>
        </div>

        {/* How It Works */}
        <SectionCard label="How It Works" delay="0.05s">
          <RagPipelineDiagram />
        </SectionCard>

        {/* System Architecture */}
        <SectionCard label="System Architecture" delay="0.1s">
          <SystemArchDiagram />
        </SectionCard>

        {/* Tech Stack */}
        <SectionCard label="Tech Stack" delay="0.15s">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-3">Backend</p>
              <div className="flex flex-wrap gap-2">
                {BACKEND_STACK.map((tech) => (
                  <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 text-purple-800 dark:text-purple-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-3">Frontend</p>
              <div className="flex flex-wrap gap-2">
                {FRONTEND_STACK.map((tech) => (
                  <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-3">Microservices</p>
              <div className="flex flex-wrap gap-2">
                {MICROSERVICES_STACK.map((tech) => (
                  <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 text-teal-800 dark:text-teal-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-3">Deploy</p>
              <div className="flex flex-wrap gap-2">
                {DEPLOY_STACK.map((tech) => (
                  <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 text-amber-800 dark:text-amber-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-3">CI / CD</p>
              <div className="flex flex-wrap gap-2">
                {CICD_STACK.map((tech) => (
                  <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 text-rose-800 dark:text-rose-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Builder */}
        <SectionCard label="About the Builder" delay="0.2s">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              SA
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-zinc-100 text-base">Sergey Aronov</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">Full-Stack Engineer</p>
              <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed mb-4">
                An experienced Full Stack Engineer with over 5 years of experience building scalable
                applications in dynamic startup environments. Proficient in both Front-End (React, TypeScript)
                and Back-End (Node.js, Kotlin) development.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:aronovsergeyy@gmail.com"
                  className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/sergey-aronov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/AronovSergey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
};

export default AboutPage;
