import React from 'react';

interface VisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive, isSpeaking }) => {
  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-16 w-full bg-slate-800/50 rounded-lg border border-slate-700">
        <span className="text-slate-500 text-sm">Agent Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-16 w-full bg-brand-dark rounded-lg border border-brand-accent/30 relative overflow-hidden">
      <div className="flex items-center gap-1">
        {/* Animated bars simulation */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 bg-brand-accent rounded-full transition-all duration-150 ease-in-out ${
              isSpeaking ? 'animate-pulse' : ''
            }`}
            style={{
              height: isSpeaking ? `${Math.random() * 24 + 12}px` : '4px',
              opacity: isSpeaking ? 1 : 0.5,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      {isSpeaking && (
        <div className="absolute inset-0 bg-brand-accent/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
