import { NextRequest, NextResponse } from 'next/server';

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  category: string;
  funFact?: string;
}

const sportsQuestions: Question[] = [
  {
    id: 1,
    question: "Which team won the FIFA World Cup 2022?",
    answers: ["Argentina", "France", "Brazil", "Spain"],
    correctAnswer: 0,
    category: "sports",
    funFact: "Argentina won their third World Cup title in a dramatic final!"
  },
  {
    id: 2,
    question: "How many players are on a basketball team on court?",
    answers: ["4", "5", "6", "7"],
    correctAnswer: 1,
    category: "sports",
    funFact: "Each team has 5 players on court at any time during play."
  },
  {
    id: 3,
    question: "What is the maximum score in Ten-pin bowling?",
    answers: ["200", "250", "300", "350"],
    correctAnswer: 2,
    category: "sports",
    funFact: "A perfect game consists of 12 consecutive strikes!"
  },
  {
    id: 4,
    question: "Which country has won the most Olympic gold medals?",
    answers: ["China", "Russia", "Germany", "United States"],
    correctAnswer: 3,
    category: "sports",
    funFact: "The US has won over 1,000 Olympic gold medals throughout history!"
  },
  {
    id: 5,
    question: "In tennis, what does 'love' mean?",
    answers: ["1 point", "Zero points", "Match point", "Tie break"],
    correctAnswer: 1,
    category: "sports",
    funFact: "The term 'love' in tennis comes from the French word 'l'oeuf' meaning egg (zero)!"
  },
  {
    id: 6,
    question: "How long is an Olympic swimming pool?",
    answers: ["25 meters", "50 meters", "75 meters", "100 meters"],
    correctAnswer: 1,
    category: "sports",
    funFact: "Olympic pools are exactly 50 meters long, 25 meters wide, and at least 2 meters deep!"
  },
  {
    id: 7,
    question: "Which sport is known as 'The Beautiful Game'?",
    answers: ["Basketball", "Tennis", "Football/Soccer", "Golf"],
    correctAnswer: 2,
    category: "sports",
    funFact: "Football is called 'The Beautiful Game' due to its artistry and global appeal!"
  },
  {
    id: 8,
    question: "In golf, what is a 'birdie'?",
    answers: ["Par score", "One under par", "Two under par", "Hole in one"],
    correctAnswer: 1,
    category: "sports",
    funFact: "A birdie is one stroke under par for a hole - named after the slang term 'bird' meaning excellent!"
  }
];

const generalQuestions: Question[] = [
  {
    id: 1,
    question: "What is the largest planet in our solar system?",
    answers: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 2,
    category: "general",
    funFact: "Jupiter is so large that all other planets could fit inside it!"
  },
  {
    id: 2,
    question: "Who painted the Mona Lisa?",
    answers: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    correctAnswer: 1,
    category: "general",
    funFact: "Da Vinci worked on the Mona Lisa for over 14 years!"
  },
  {
    id: 3,
    question: "What is the capital of Australia?",
    answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    category: "general",
    funFact: "Canberra was purpose-built as Australia's capital city in 1913!"
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    answers: ["Gold", "Oxygen", "Silver", "Iron"],
    correctAnswer: 1,
    category: "general",
    funFact: "Oxygen makes up about 21% of Earth's atmosphere!"
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    let questions: Question[] = [];

    switch (category) {
      case 'sports':
        questions = sportsQuestions;
        break;
      case 'general':
        questions = generalQuestions;
        break;
      default:
        questions = sportsQuestions;
    }

    const shuffled = questions.sort(() => 0.5 - Math.random());
    const quizQuestions = shuffled.slice(0, 5);

    return NextResponse.json(quizQuestions);
  } catch (error) {
    console.error('Quiz API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load quiz questions' },
      { status: 500 }
    );
  }
}
