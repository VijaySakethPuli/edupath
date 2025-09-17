import { useState } from 'react';
import { motion } from 'framer-motion';

const interestQuestions = [
  {
    id: 1,
    text: "I enjoy working with my hands to build or fix things",
    category: "realistic"
  },
  {
    id: 2, 
    text: "I like solving complex problems and puzzles",
    category: "investigative"
  },
  {
    id: 3,
    text: "I enjoy creating art, writing, or performing",
    category: "artistic"
  },
  {
    id: 4,
    text: "I like helping people with their problems",
    category: "social"
  },
  {
    id: 5,
    text: "I enjoy leading groups and making decisions",
    category: "enterprising"
  },
  {
    id: 6,
    text: "I like working with numbers and organizing data",
    category: "conventional"
  }
];

export default function InterestQuiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (rating) => {
    const newAnswers = [...answers, {
      questionId: interestQuestions[currentQuestion].id,
      category: interestQuestions[currentQuestion].category,
      rating
    }];
    
    setAnswers(newAnswers);

    if (currentQuestion < interestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results and complete
      const results = calculateInterestProfile(newAnswers);
      onComplete(results);
    }
  };

  const calculateInterestProfile = (answers) => {
    const categories = {};
    answers.forEach(answer => {
      if (!categories[answer.category]) {
        categories[answer.category] = [];
      }
      categories[answer.category].push(answer.rating);
    });

    const profile = {};
    Object.keys(categories).forEach(category => {
      const scores = categories[category];
      profile[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    return profile;
  };

  if (currentQuestion >= interestQuestions.length) {
    return null;
  }

  const question = interestQuestions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentQuestion + 1} of {interestQuestions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / interestQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">{question.text}</h2>

      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <motion.button
            key={rating}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(rating)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            {rating}
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mt-4">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
    </motion.div>
  );
}