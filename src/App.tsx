import React, { useState } from 'react';
import { Card } from './components/Card';
import { SwipeButtons } from './components/SwipeButtons';

const mockRecords = [
  {
    id: 1,
    title: "Dark Side of the Moon",
    artist: "Pink Floyd",
    year: 1973,
    imageUrl: "https://picsum.photos/400/600",
    genre: "Progressive Rock"
  },
  {
    id: 2,
    title: "Kind of Blue",
    artist: "Miles Davis",
    year: 1959,
    imageUrl: "https://picsum.photos/400/601",
    genre: "Jazz"
  },
  {
    id: 3,
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    imageUrl: "https://picsum.photos/400/602",
    genre: "Rock"
  },
  {
    id: 4,
    title: "Two Less Lonely People",
    artist: "The Beatles",
    year: 1969,
    imageUrl: "https://picsum.photos/400/602",
    genre: "Rock"
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on ${mockRecords[currentIndex].title}`);
    if (currentIndex < mockRecords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleLike = () => handleSwipe('right');
  const handleDislike = () => handleSwipe('left');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Record Finder
        </h1>
        
        <div className="relative h-[600px]">
          {currentIndex < mockRecords.length ? (
            <Card
              key={mockRecords[currentIndex].id}
              record={mockRecords[currentIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600">No more records to show!</p>
            </div>
          )}
        </div>

        {currentIndex < mockRecords.length && (
          <SwipeButtons onLike={handleLike} onDislike={handleDislike} />
        )}
      </div>
    </div>
  );
}

export default App;