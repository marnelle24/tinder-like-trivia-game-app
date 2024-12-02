import { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { SwipeButtons } from './components/SwipeButtons';
import { toast, Toaster } from 'react-hot-toast'; // You'll need to install this: npm install react-hot-toast
import { Modal } from './components/Modal';

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

// Add this to your existing MODAL_MESSAGES array or create a new one for milestones
const MILESTONE_MESSAGES = [
  "Great job! You've completed 4 more questions! 🎯",
  "4 questions down! Keep up the momentum! 🚀",
  "You're on fire! Another 4 questions completed! 🔥",
  // "Hey Jannybab! Let's play some trivia! 🎉",
  // "Shoutout to Jan Megan Villarmia! Let's play some trivia! 🧠",
  "Fantastic progress! Ready for the next round? ⭐",
  "4 more in the bag! You're getting smarter! 🧠"
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<ProcessedTriviaQuestion[]>([]);
  const [scores, setScores] = useState({ correct: 0, incorrect: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const newCorrectScore = scores.correct + 1;
      setScores(prev => ({ ...prev, correct: newCorrectScore }));
      
      // Show milestone modal every 4 correct answers
      if (newCorrectScore % 4 === 0) {
        setIsModalOpen(true);
      }
    } else {
      toast.error('Wrong answer! 😅');
      setScores(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Move to next question immediately
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleTrue = () => handleSwipe('right');
  const handleFalse = () => handleSwipe('left');

  const handleReset = async () => {
    try {
      // Show loading state
      toast.loading('Loading new questions...', { id: 'loading' });
      
      // Fetch new questions
      const newQuestions = await fetchAndProcessTrivia();
      
      // Reset states
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setScores({ correct: 0, incorrect: 0 });
      
      // Show success message
      toast.success('New questions loaded!', {
        id: 'loading',
        duration: 2000
      });
    } catch (error) {
      // Show error message
      toast.error('Failed to load new questions. Try again!', {
        id: 'loading'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 pb-16 relative">
      <Toaster position="top-center" />
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        message={MILESTONE_MESSAGES[Math.floor(Math.random() * MILESTONE_MESSAGES.length)]} 
      />
      <div className="max-w-md mx-auto pt-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">TriviaLation</h1>
        <p className="text-center text-gray-500 text-sm font-light mb-4">
          Answering trivia is more fun than swiping Tinder
        </p>
        
        <div className="relative h-[50vh] flex justify-center items-center">
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
            onReset={handleReset}
            trueLabel="True"
            falseLabel="False"
            scores={scores}
          />
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-600/80 py-3 text-center">
        <p className="text-gray-200/80 text-[14px] font-light drop-shadow-sm drop-shadow-dark">
          Developed by: <span className="text-green-400">Sage Technology AI</span>
        </p>
      </footer>
    </div>
  );
}

export default App;