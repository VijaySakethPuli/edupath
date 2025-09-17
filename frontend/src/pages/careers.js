import { useEffect, useState } from 'react';
import { useRecommendations } from '../context/RecommendationContext';
import Link from 'next/link';

function CareerCard({ career, fitScore, reasons = [] }) {
  const scoreColor = fitScore >= 80 ? 'text-green-600' : fitScore >= 60 ? 'text-blue-600' : 'text-orange-600';
  const bgColor = fitScore >= 80 ? 'bg-green-50' : fitScore >= 60 ? 'bg-blue-50' : 'bg-orange-50';

  return (
    <div className={`rounded-xl border p-6 ${bgColor} hover:shadow-md transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{career.name}</h3>
          <p className="text-sm text-gray-500">ID: {career.id}</p>
        </div>
        <span className={`text-2xl font-extrabold ${scoreColor}`}>{fitScore}%</span>
      </div>
      
      {reasons.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Why this matches you:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Careers() {
  const { assessmentData } = useRecommendations();
  const [careerRecs, setCareerRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assessmentData) {
      fetchCareerRecommendations();
    }
  }, [assessmentData]);

  const fetchCareerRecommendations = async () => {
    if (!assessmentData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommendations/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: assessmentData.interests,
          aptitude: assessmentData.aptitude,
          class_level: 12
        }),
      });
      const data = await response.json();
      setCareerRecs(data.recommendations || []);
    } catch (e) {
      console.error('Failed to fetch career recommendations:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Complete Your Assessment First</h1>
        <p className="text-gray-600 mb-6 text-center">
          Take the assessment to get personalized career recommendations.
        </p>
        <Link href="/assess" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Take Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Career Recommendations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Career paths that match your profile
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Finding careers that match your profile...</p>
          </div>
        )}

        {!loading && careerRecs.length > 0 && (
          <div className="grid gap-6 mb-8">
            {careerRecs.map((rec, index) => (
              <CareerCard
                key={index}
                career={rec.career}
                fitScore={rec.fit_score}
                reasons={rec.reasons}
              />
            ))}
          </div>
        )}

        {!loading && careerRecs.length === 0 && assessmentData && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No career recommendations available yet.</p>
            <button
              onClick={fetchCareerRecommendations}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/assess" className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Retake Assessment
          </Link>
          <Link href="/streams" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Stream Recommendations
          </Link>
          <Link href="/colleges" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Find Colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
