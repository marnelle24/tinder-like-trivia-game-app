import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface CardProps {
  question: {
    question: string;
    category: string;
    difficulty: string;
  };
  onSwipe: (direction: 'left' | 'right') => void;
}

export function Card({ question, onSwipe }: CardProps) {
  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }));

  const [{ likeOpacity }, likeApi] = useSpring(() => ({
    likeOpacity: 0,
  }));

  const [{ dislikeOpacity }, dislikeApi] = useSpring(() => ({
    dislikeOpacity: 0,
  }));

  const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2;
    const dir = xDir < 0 ? -1 : 1;

    if (!down && trigger) {
      onSwipe(dir === 1 ? 'right' : 'left');
    }

    // Update opacities based on drag position
    const opacity = Math.min(Math.abs(mx) / 100, 1);
    likeApi.start({ likeOpacity: mx > 0 ? opacity : 0 });
    dislikeApi.start({ dislikeOpacity: mx < 0 ? opacity : 0 });

    api.start({
      x: down ? mx : 0,
      rotate: down ? mx / 20 : 0,
      immediate: down,
    });
  });

  return (
    <div className="absolute w-[90%] h-full">
      <animated.div
        {...bind()}
        style={{
          x,
          rotate,
          touchAction: 'none',
        }}
        className="bg-white rounded-xl p-6 shadow-xl w-full h-full cursor-grab active:cursor-grabbing"
      >
        <animated.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 right-16 z-10 transform rotate-12"
        >
          <div className="border-4 border-green-500 rounded-lg px-4 py-1">
            <span className="text-green-500 font-bold text-2xl">TRUE</span>
          </div>
        </animated.div>

        <animated.div
          style={{ opacity: dislikeOpacity }}
          className="absolute top-8 left-16 z-10 transform -rotate-12"
        >
          <div className="border-4 border-red-500 rounded-lg px-4 py-1">
            <span className="text-red-500 font-bold text-2xl">FALSE</span>
          </div>
        </animated.div>

        <div className="flex flex-col h-full">
          <div className="flex">
            <span className="text-sm text-white mb-2 bg-blue-500/80 border shadow-md border-blue-500 rounded-full inline-block px-4 py-1.5">{question.category}</span>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl text-center">{question.question}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-white bg-orange-300 border shadow-md border-orange-300 rounded-full inline-block px-4 py-1.5">Difficulty: {question.difficulty}</span>
          </div>
        </div>
      </animated.div>
    </div>
  );
}