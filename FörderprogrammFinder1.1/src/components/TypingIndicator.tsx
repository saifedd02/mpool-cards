"use client";

import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-4 px-1 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-blue-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-blue-400 rounded-full typing-dot" />
        </div>
        <span className="text-xs text-gray-400 ml-1">Analysiere Programme...</span>
      </div>
    </div>
  );
}
