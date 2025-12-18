// src/components/ui/SourceFooter.tsx
import React from 'react';

interface SourceFooterProps {
  source: {
    name: string;
    url: string;
  };
}

export function SourceFooter({ source }: SourceFooterProps) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <p className="text-xs text-gray-400">
        <strong>Source :</strong>{' '}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {source.name}
        </a>
      </p>
    </div>
  );
}
