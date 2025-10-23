"use client";
import React, { useState, useEffect } from 'react';
import { PiCoinManager } from '../../../../../packages/shared/src/libs/utils/piCoinManager';
import { UserManager } from '../../../../../packages/shared/src/libs/utils/userManager';

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  category: string;
  funFact?: string;
}

interface QuizProps {
  isOffline?: boolean;
}

const QuizMode: React.FC<QuizProps> = ({ isOffline = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [category, setCategory] = useState('sports');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);
  const [piCoinsEarned, setPiCoinsEarned] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showBettingAgreement, setShowBettingAgreement] = useState(false); // State for the betting agreement

  // Prevent multiple awards for the same quiz session
  const [quizSessionId] = useState(() => `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [hasAwardedPiCoins, setHasAwardedPiCoins] = useState(false);


  // Offline questions cache
  const offlineQuestions: Question[] = [
    {
      id: 1,
      question: "Which team won the FIFA World Cup 2022?",
      answers: ["Argentina", "France", "Brazil", "Spain"],
      correctAnswer: 0,
      category: "sports",
      funFact: "Argentina won their third World Cup title!"
    },
    {
      id: 2,
      question: "How many players are on a basketball team on court?",
      answers: ["4", "5", "6", "7"],
      correctAnswer: 1,
      category: "sports",
      funFact: "Each team has 5 players on court at any time."
    },
    {
      id: 3,
      question: "What is the maximum score in Ten-pin bowling?",
      answers: ["200", "250", "300", "350"],
      correctAnswer: 2,
      category: "sports",
      funFact: "A perfect game consists of 12 strikes in a row!"
    },
    {
      id: 4,
      question: "Which country has won the most Olympic gold medals?",
      answers: ["China", "Russia", "Germany", "United States"],
      correctAnswer: 3,
      category: "sports",
      funFact: "The US has won over 1,000 Olympic gold medals!"
    },
    {
      id: 5,
      question: "In which sport is the term 'love' used?",
      answers: ["Golf", "Tennis", "Cricket", "Baseball"],
      correctAnswer: 1,
      category: "sports",
      funFact: "'Love' in tennis means zero points!"
    }
  ];

  useEffect(() => {
    if (isOffline) {
      setQuestions(offlineQuestions);
    } else {
      // Load questions from API or use offline as fallback
      loadQuestions();
    }

    // Award daily login bonus and load balance
    const handleDailyLogin = async () => {
      try {
        // Ensure user is properly initialized before awarding daily login
        let userId = UserManager.getCurrentUserId();
        if (!userId) {
          // Create a temporary user if none exists
          const tempUser = UserManager.createUser('Guest', 'guest@example.com');
          userId = tempUser.id;
        }

        if (userId && userId !== 'undefined' && userId.length > 0) {
          PiCoinManager.awardDailyLogin(userId);
        }
      } catch (error) {
        console.error('Daily login error:', error);
        // Don't throw the error, just log it to prevent component crash
      }
    };

    handleDailyLogin();

    const balance = PiCoinManager.getBalance('default');
    setCurrentBalance(balance.balance);

    // Check if the user has logged in to show the betting agreement
    const currentUser = UserManager.getCurrentUser(); // Assuming this function exists and returns user info or null
    if (currentUser) {
      setShowBettingAgreement(true);
    }
  }, [isOffline, category]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResult]);

  const loadQuestions = async () => {
    try {
      // Try to fetch from API
      const response = await fetch(`/api/quiz/${category}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        throw new Error('API unavailable');
      }
    } catch (error) {
      console.warn('Using offline questions:', error);
      setQuestions(offlineQuestions);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        // Award Pi coins based on performance (only once per session)
        let earnedCoins = 0;
        if (!hasAwardedPiCoins && PiCoinManager?.awardQuizCompletion) {
          earnedCoins = PiCoinManager.awardQuizCompletion('default', score, questions.length);
          if (earnedCoins > 0) {
            setHasAwardedPiCoins(true);
          }
        }
        setPiCoinsEarned(earnedCoins);

        // Update balance
        const newBalance = PiCoinManager.getBalance('default');
        setCurrentBalance(newBalance.balance);

        setQuizComplete(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setTimeLeft(30);
    setPiCoinsEarned(0);
    setHasAwardedPiCoins(false); // Reset the flag for new quiz session
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! 🏆";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Not bad! 📈";
    return "Keep trying! 💪";
  };

  const closeBettingAgreement = () => {
    setShowBettingAgreement(false);
  };

  if (!quizStarted) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '2rem',
            margin: '0',
            background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Quiz Mode - You're Still in the Game! 🎯
          </h2>

          <div style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: '700',
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            π {currentBalance.toLocaleString()} Pi Coins
          </div>
        </div>

        {/* Betting Agreement */}
        {showBettingAgreement && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            color: '#e2e8f0',
            textAlign: 'left',
            position: 'relative'
          }}>
            <button
              onClick={closeBettingAgreement}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <p>
              <strong>Betting Agreement:</strong> You agree to bet responsibly. Please remember to manage your wagers wisely.
            </p>
          </div>
        )}

        {isOffline && (
          <div style={{
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.5)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            color: '#ffd700'
          }}>
            📱 Offline Mode - Play to Earn Points!
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button
            onClick={startQuiz}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
            }}
          >
            🚀 Quick Start
          </button>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '1rem'
            }}
          >
            <option value="sports">🏆 Choose Category - Sports</option>
            <option value="general">🧠 General Knowledge</option>
          </select>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            🎯 Fun Scoreboard
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          border: '2px dashed rgba(255, 255, 255, 0.2)',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
          <h3 style={{ color: '#fff', marginBottom: '12px' }}>Fun Fact of the Day!</h3>
          <p style={{ color: '#d1fae5', fontSize: '1rem' }}>
            Did you know? The fastest recorded tennis serve was 163.7 mph by Sam Groth!
          </p>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px' }}>
          Quiz Complete! 🎉
        </h2>

        <div style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          borderRadius: '16px',
          padding: '24px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
          <div style={{ color: 'white', fontSize: '1.5rem', marginBottom: '8px' }}>
            Score {score}/{questions.length}
          </div>
          <div style={{ color: '#e8f5e8', fontSize: '1.2rem', marginBottom: '8px' }}>
            +{score * 10} points
          </div>

          {/* Pi Coin Reward */}
          <div style={{
            background: 'rgba(255, 215, 0, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            marginTop: '16px'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>π</div>
            <div style={{ color: '#ffd700', fontSize: '1.3rem', fontWeight: '700' }}>
              +{piCoinsEarned} Pi Coins Earned!
            </div>
            <div style={{ color: '#fff', fontSize: '1rem', marginTop: '4px' }}>
              Total: π {currentBalance.toLocaleString()}
            </div>
          </div>
        </div>

        <p style={{ color: '#d1fae5', fontSize: '1.3rem', margin: '20px 0' }}>
          {getScoreMessage()}
        </p>

        <button
          onClick={resetQuiz}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Play Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ color: '#22c55e', fontWeight: '600' }}>
          Question {currentQuestion + 1}/{questions.length}
        </div>
        <div style={{
          background: timeLeft <= 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
          color: timeLeft <= 10 ? '#ef4444' : '#22c55e',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: '600'
        }}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '0', lineHeight: '1.5' }}>
          {currentQ?.question}
        </h3>
      </div>

      {/* Answers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {currentQ?.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            style={{
              background: selectedAnswer === index
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'rgba(255, 255, 255, 0.05)',
              color: selectedAnswer === index ? 'white' : '#d1fae5',
              border: selectedAnswer === index
                ? '2px solid #22c55e'
                : '1px solid rgba(255, 255, 255, 0.2)',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: showResult ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              opacity: showResult && selectedAnswer !== index ? 0.6 : 1
            }}
          >
            Answer {index + 1}: {answer}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {selectedAnswer !== null && !showResult && (
        <button
          onClick={handleNextQuestion}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)'
          }}
        >
          Submit Answer
        </button>
      )}

      {/* Result Display */}
      {showResult && (
        <div style={{
          background: selectedAnswer === currentQ?.correctAnswer
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(239, 68, 68, 0.2)',
          border: selectedAnswer === currentQ?.correctAnswer
            ? '1px solid rgba(34, 197, 94, 0.5)'
            : '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>
            {selectedAnswer === currentQ?.correctAnswer ? '🎉' : '❌'}
          </div>
          <div style={{
            color: selectedAnswer === currentQ?.correctAnswer ? '#22c55e' : '#ef4444',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            {selectedAnswer === currentQ?.correctAnswer ? 'Correct!' : 'Incorrect!'}
          </div>
          {currentQ?.funFact && (
            <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>
              💡 {currentQ.funFact}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizMode;