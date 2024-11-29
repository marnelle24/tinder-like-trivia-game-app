import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { SwipeButtons } from './components/SwipeButtons';
import { toast, Toaster } from 'react-hot-toast'; // You'll need to install this: npm install react-hot-toast

// Add this interface before the App function
interface ProcessedTriviaQuestion {
  id: string;
  question: string;
  isTrue: boolean;
  category: string;
  difficulty: string;
}

// Add this before the App function
async function fetchAndProcessTrivia(): Promise<ProcessedTriviaQuestion[]> {
  const response = await fetch('https://opentdb.com/api.php?amount=50&type=boolean');
  const data = await response.json();
  
  return data.results.map((q: any, index: number) => ({
    id: index.toString(),
    question: decodeHTMLEntities(q.question),
    isTrue: q.correct_answer === "True",
    category: q.category,
    difficulty: q.difficulty
  }));
}

// Add this helper function
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<ProcessedTriviaQuestion[]>([]);
  const [scores, setScores] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    const loadTrivia = async () => {
      try {
        const processedQuestions = await fetchAndProcessTrivia();
        setQuestions(processedQuestions);
      } catch (error) {
        console.error('Failed to load trivia:', error);
      }
    };
    
    loadTrivia();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentQuestion = questions[currentIndex];
    const userAnswer = direction === 'right'; // right = true, left = false
    
    // Check if answer is correct and update scores
    if (userAnswer === currentQuestion.isTrue) {
      toast.success('Correct answer! 🎉');
      setScores(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      toast.error('Wrong answer! 😅');
      setScores(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Move to next question
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleTrue = () => handleSwipe('right');
  const handleFalse = () => handleSwipe('left');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <Toaster position="top-center" />
      <div className="max-w-md mx-auto pt-10">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Trivia Time!</h1>
        
        <div className="relative h-[400px] flex justify-center items-center">
          {questions.length > 0 && currentIndex < questions.length ? (
            <Card
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600">
                {questions.length === 0 ? 'Loading questions...' : 'No more questions!'}
              </p>
            </div>
          )}
        </div>

        {questions.length > 0 && currentIndex < questions.length && (
          <SwipeButtons 
            onLike={handleTrue} 
            onDislike={handleFalse}
            trueLabel="True"
            falseLabel="False"
            scores={scores}
          />
        )}
      </div>
    </div>
  );
}

export default App;