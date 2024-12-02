import React from 'react';

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  onReset: () => void;
  trueLabel: string;
  falseLabel: string;
  scores: { correct: number; incorrect: number };
}

export function SwipeButtons({ onReset, scores }: SwipeButtonsProps) {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex justify-evenly items-end gap-4">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xs text-gray-500">WRONG</span>
            <span className="text-xl text-gray-800 drop-shadow opacity-90">{scores.incorrect}</span>
          </div>
        </div>

        <button onClick={onReset} className="bg-green-200 hover:bg-green-300 transition-colors rounded-full p-3 mb-2 border-1 border-green-500 duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mt-4">
            <span className="text-xs text-gray-500">CORRECT</span>
            <span className="text-xl text-gray-800 drop-shadow opacity-90">{scores.correct}</span>
          </div>
        </div>
      </div>
    </div>
  );
}