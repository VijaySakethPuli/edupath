import { useState } from 'react';
import Layout from '../components/Layout';
import InterestQuiz from '../components/InterestQuiz';
import { motion } from 'framer-motion';

export default function Assessment() {
  const [currentStep, setCurrentStep] = useState('interests');
  const [results, setResults] = useState({});

  const steps = [
    { id: 'interests', title: 'Discover Your Interests', component: InterestQuiz },
    { id: 'aptitude', title: 'Aptitude Assessment', component: null },
    { id: 'personality', title: 'Personality Snapshot', component: null }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Let's Discover the Real You! 🎯
            </h1>
            <p className="text-lg text-gray-600">
              Quick assessments to understand your interests, strengths, and personality
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}. {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="max-w-4xl mx-auto">
            {currentStep === 'interests' && (
              <InterestQuiz onComplete={(result) => {
                setResults(prev => ({ ...prev, interests: result }));
                setCurrentStep('aptitude');
              }} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}