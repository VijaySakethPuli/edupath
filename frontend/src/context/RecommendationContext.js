import { createContext, useContext, useState } from 'react';

const RecommendationContext = createContext();

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendations must be used within RecommendationProvider');
  }
  return context;
};

export const RecommendationProvider = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  return (
    <RecommendationContext.Provider value={{
      assessmentData,
      setAssessmentData,
      recommendations,
      setRecommendations
    }}>
      {children}
    </RecommendationContext.Provider>
  );
};