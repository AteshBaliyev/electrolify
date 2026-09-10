'use client';

import React, { useState } from 'react';

export default function ProductDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="mt-0.5">
      <p
        className={`text-xs sm:text-sm text-neutral-400 leading-relaxed transition-all duration-200 ${
          isExpanded ? '' : 'line-clamp-2'
        }`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-[11px] sm:text-xs font-semibold text-neutral-400 hover:text-[#FF5B00] inline-flex items-center gap-1 transition-colors cursor-pointer py-0.5"
      >
        <span>{isExpanded ? 'Bağla ▴' : 'Ətraflı Bax ▾'}</span>
      </button>
    </div>
  );
}
