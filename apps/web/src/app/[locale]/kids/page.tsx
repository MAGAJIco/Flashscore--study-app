
"use client";

import React, { useState } from 'react';
import { Trophy, Star, BookOpen, Award, Sparkles } from 'lucide-react';
import { useKidsMode } from '@/app/hooks/useKidsMode';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  funFact: string;
  sport: string;
}

const sportsQuizzes: QuizQuestion[] = [
  {
    id: '1',
    question: 'How many players are on a basketball team on the court?',
    options: ['4 players', '5 players', '6 players', '7 players'],
    correctAnswer: 1,
    funFact: 'Basketball was invented by Dr. James Naismith in 1891!',
    sport: 'basketball'
  },
  {
    id: '2',
    question: 'What is a "home run" in baseball?',
    options: ['Running to first base', 'Running all the way around the bases', 'Hitting the ball far', 'Catching the ball'],
    correctAnswer: 1,
    funFact: 'The longest home run ever was 575 feet by Mickey Mantle!',
    sport: 'baseball'
  },
  {
    id: '3',
    question: 'How many points is a touchdown in football?',
    options: ['3 points', '6 points', '7 points', '10 points'],
    correctAnswer: 1,
    funFact: 'Football fields are exactly 100 yards long!',
    sport: 'football'
  },
  {
    id: '4',
    question: 'What do you call it when you score in soccer?',
    options: ['Point', 'Goal', 'Basket', 'Run'],
    correctAnswer: 1,
    funFact: 'Soccer is called "football" in most countries around the world!',
    sport: 'soccer'
  }
];

export default function KidsModePage() {
  const { isKidsModeEnabled } = useKidsMode();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === sportsQuizzes[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setTotalPoints(totalPoints + 10);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < sportsQuizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getSportEmoji = (sport: string) => {
    const emojis: { [key: string]: string } = {
      basketball: '🏀',
      baseball: '⚾',
      football: '🏈',
      soccer: '⚽'
    };
    return emojis[sport] || '⚽';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-6">
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 mb-6 border-4 border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🌈 Kids Sports Fun! 🌈
            </h1>
            <p className="text-white/90 text-lg">Learn about sports in a fun way!</p>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalPoints}</div>
            <div className="text-sm text-white/80">Points ⭐</div>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border-4 border-white/30">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">Sports Quiz</h2>
        </div>

        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm">
              Question {currentQuestion + 1} of {sportsQuizzes.length}
            </span>
            <span className="text-4xl">{getSportEmoji(sportsQuizzes[currentQuestion].sport)}</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-6">
            {sportsQuizzes[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {sportsQuizzes[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                  showResult
                    ? index === sportsQuizzes[currentQuestion].correctAnswer
                      ? 'bg-green-500 text-white'
                      : index === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-white/50 text-gray-700'
                    : 'bg-white/70 hover:bg-white text-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 space-y-4">
              <div className={`p-4 rounded-xl ${
                selectedAnswer === sportsQuizzes[currentQuestion].correctAnswer
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-orange-500/20 border-2 border-orange-500'
              }`}>
                <p className="text-white font-bold text-lg mb-2">
                  {selectedAnswer === sportsQuizzes[currentQuestion].correctAnswer
                    ? '🎉 Awesome! You got it right! 🎉'
                    : '💪 Good try! Keep learning! 💪'}
                </p>
                <p className="text-white/90 text-sm">
                  💡 {sportsQuizzes[currentQuestion].funFact}
                </p>
              </div>

              <button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                {currentQuestion < sportsQuizzes.length - 1 ? 'Next Question 👉' : 'Start Over 🔄'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Your Score:</span>
            <span className="text-2xl font-bold text-white">{score} / {sportsQuizzes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
