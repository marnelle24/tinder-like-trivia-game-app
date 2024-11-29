import React from 'react';

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  trueLabel: string;
  falseLabel: string;
  scores: { correct: number; incorrect: number };
}

export function SwipeButtons({ onLike, onDislike, trueLabel, falseLabel, scores }: SwipeButtonsProps) {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex justify-center gap-4">
        <div className="flex flex-col items-center">
          <button
            onClick={onDislike}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors flex flex-col items-center"
          >
            <span>{falseLabel}</span>
          </button>
          <div className="flex flex-col items-center mt-4">
            <span className="text-xs text-gray-500">WRONG</span>
            <span className="text-xl text-gray-800 drop-shadow opacity-90">{scores.incorrect}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={onLike} className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors flex flex-col items-center">
            <span>{trueLabel}</span>
          </button>
          <div className="flex flex-col items-center mt-4">
            <span className="text-xs text-gray-500">CORRECT</span>
            <span className="text-xl text-gray-800 drop-shadow opacity-90">{scores.correct}</span>
          </div>
        </div>
      </div>
    </div>
  );
}