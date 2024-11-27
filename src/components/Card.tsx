import React, { useMemo } from 'react';
import { animated, useSpring, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import clsx from 'clsx';

interface Record {
  id: number;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  genre: string;
}

interface CardProps {
  record: Record;
  onSwipe: (direction: 'left' | 'right') => void;
}

export function Card({ record, onSwipe }: CardProps) {
  const [{ x, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = Math.abs(mx) > 100 || vx > 0.3;
      const dir = xDir < 0 ? -1 : 1;

      if (!active && trigger) {
        api.start({
          x: dir * window.innerWidth * 1.5,
          rotate: dir * 50,
          scale: 0.8,
          config: { tension: 200, friction: 30 },
          onRest: () => onSwipe(dir === 1 ? 'right' : 'left'),
        });
      } else {
        api.start({
          x: active ? mx : 0,
          rotate: active ? mx / 15 : 0,
          scale: active ? 1.05 : 1,
          config: { tension: 300, friction: 20 },
        });
      }
    },
    { axis: 'x' }
  );

  const likeOpacity = useMemo(
    () => to([x], (x) => (x >= 0 ? Math.min(1, x / 100) : 0)),
    []
  );

  const dislikeOpacity = useMemo(
    () => to([x], (x) => (x <= 0 ? Math.min(1, Math.abs(x) / 100) : 0)),
    []
  );

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        rotate,
        scale,
        touchAction: 'none',
      }}
      className="absolute w-full will-change-transform"
    >
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm mx-auto">
        <animated.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 right-8 z-10 transform rotate-12"
        >
          <div className="border-4 border-green-500 rounded-lg px-4 py-1">
            <span className="text-green-500 font-bold text-2xl">LIKE</span>
          </div>
        </animated.div>
        
        <animated.div
          style={{ opacity: dislikeOpacity }}
          className="absolute top-8 left-8 z-10 transform -rotate-12"
        >
          <div className="border-4 border-red-500 rounded-lg px-4 py-1">
            <span className="text-red-500 font-bold text-2xl">NOPE</span>
          </div>
        </animated.div>

        <img
          src={record.imageUrl}
          alt={record.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{record.title}</h2>
          <p className="text-gray-600 mb-2">{record.artist}</p>
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {record.genre}
            </span>
            <span className="text-gray-500">{record.year}</span>
          </div>
        </div>
      </div>
    </animated.div>
  );
}