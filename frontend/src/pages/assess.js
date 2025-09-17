import { useEffect, useMemo, useState } from 'react';
import { useRecommendations } from '../context/RecommendationContext';

const interestItems = [
  { id: 'I1', text: 'I enjoy solving puzzles and logic problems.' },
  { id: 'I2', text: 'I like helping people understand new things.' },
  { id: 'I3', text: 'I enjoy building or fixing things with my hands.' },
  { id: 'I4', text: 'I like working with data, numbers, or charts.' },
  { id: 'I5', text: 'I enjoy creative tasks like writing or designing.' },
  { id: 'I6', text: 'I like organizing events or leading teams.' },
];

const aptitudeItems = [
  { id: 'A1', text: 'Mental arithmetic: 27 × 6 = ?', options: ['142', '162', '172', '182'], answer: 1 },
  { id: 'A2', text: 'Spot the pattern: 2, 6, 12, 20, ?', options: ['28', '30', '32', '34'], answer: 0 }, // +4, +6, +8, +10
  { id: 'A3', text: 'Analogies: Hand is to glove as foot is to __', options: ['sock', 'shoe', 'boot', 'lace'], answer: 0 },
  { id: 'A4', text: 'Logic: If all roses are flowers and some flowers fade, then some roses may fade.', options: ['True', 'False'], answer: 0 },
  { id: 'A5', text: 'Spatial: Which net folds into a cube? (assume option C)', options: ['A', 'B', 'C', 'D'], answer: 2 },
];

function Likert({ value, onChange }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[1,2,3,4,5].map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-medium
            ${value === v ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}
            transition-colors`}
          aria-label={`Select ${v}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export default function Assess() {
  const [step, setStep] = useState(1); // 1: Interests, 2: Aptitude, 3: Summary
  const [interests, setInterests] = useState({}); // {I1:1..5}
  const [aptitude, setAptitude] = useState({});  // {index: selectedOptionIndex}

  // Recommendations + loading state (local for summary)
  const [recommendations, setLocalRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  // Context for sharing with Streams/Careers pages
  const { setAssessmentData, setRecommendations } = useRecommendations();

  // Progress
  const interestProgress = Math.round(100 * (Object.keys(interests).length / interestItems.length));
  const aptitudeProgress = Math.round(100 * (Object.keys(aptitude).length / aptitudeItems.length));

  const interestScore = useMemo(() => {
    const vals = Object.values(interests);
    if (!vals.length) return 0;
    const avg = vals.reduce((a,b)=>a+b,0) / (vals.length * 5);
    return Math.round(avg * 100);
  }, [interests]);

  const aptitudeScore = useMemo(() => {
    const correct = Object.entries(aptitude).reduce((acc, [idx, sel]) => {
      const i = Number(idx);
      return acc + (sel === aptitudeItems[i].answer ? 1 : 0);
    }, 0);
    return Math.round((correct / aptitudeItems.length) * 100);
  }, [aptitude]);

  // Simple local persistence so refresh doesn’t wipe progress in dev
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('assessProgress') || '{}');
      if (saved.step) setStep(saved.step);
      if (saved.interests) setInterests(saved.interests);
      if (saved.aptitude) setAptitude(saved.aptitude);
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem('assessProgress', JSON.stringify({ step, interests, aptitude }));
  }, [step, interests, aptitude]);

  // Submit to backend + fetch recommendations + push into context
  async function submitAssessmentAndGetRecs() {
    const payload = {
      interests,
      aptitude,
      scores: { interestPct: interestScore, aptitudePct: aptitudeScore },
      userId: null,
      ts: new Date().toISOString()
    };
    setLoading(true);
    setStep(3); // show summary immediately

    try {
      // Save assessment (fire-and-forget)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Get recommendations (await)
      const rec = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      // Local (for Summary) and Context (for Streams/Careers)
      setLocalRecommendations(rec);
      setAssessmentData(payload);
      setRecommendations(rec);
    } catch (e) {
      alert('Could not get recommendations');
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-screen-lg mx-auto px-4">
        {/* Stepper */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {['Discover Your Interests','Aptitude Assessment','Summary'].map((label, i) => {
            const n = i+1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} className="flex items-center gap-2">
                <div className={`h-9 px-3 rounded-full text-sm font-medium flex items-center
                  ${active ? 'bg-blue-600 text-white' : done ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>
                  <span className="mr-2">{n}</span>{label}
                </div>
                {n < 3 && <div className="w-6 sm:w-10 h-[2px] bg-gray-300 dark:bg-gray-700 rounded" />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/10 p-6 shadow-sm">
            <div className="mb-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded">
                <div className="h-2 bg-blue-600 rounded" style={{ width: `${interestProgress}%` }} />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{interestProgress}% complete</p>
            </div>

            {interestItems.map((q) => (
              <div key={q.id} className="mb-6">
                <p className="font-semibold mb-3">{q.text}</p>
                <Likert
                  value={interests[q.id] || 0}
                  onChange={(v) => setInterests((s) => ({ ...s, [q.id]: v }))}
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Strongly Disagree</span><span>Strongly Agree</span>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Aptitude
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Aptitude */}
        {step === 2 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/10 p-6 shadow-sm">
            <div className="mb-4">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded">
                <div className="h-2 bg-emerald-600 rounded" style={{ width: `${aptitudeProgress}%` }} />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{aptitudeProgress}% complete</p>
            </div>

            <div className="grid gap-5">
              {aptitudeItems.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-gray-200/60 dark:border-white/10 p-4">
                  <p className="font-semibold mb-3">{idx+1}. {q.text}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {q.options.map((opt, i) => {
                      const selected = aptitude[idx] === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setAptitude((s) => ({ ...s, [idx]: i }))}
                          className={`px-3 py-2 rounded-lg text-sm border transition-colors
                            ${selected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={submitAssessmentAndGetRecs}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                See Summary
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-white/10 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Assessment Summary</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200/60 dark:border-white/10 p-4">
                <p className="text-sm text-gray-500">Interest Match</p>
                <p className="text-3xl font-extrabold">{interestScore}%</p>
              </div>
              <div className="rounded-xl border border-gray-200/60 dark:border-white/10 p-4">
                <p className="text-sm text-gray-500">Aptitude Score</p>
                <p className="text-3xl font-extrabold">{aptitudeScore}%</p>
              </div>
            </div>

            <div className="mt-6">
              {loading && <p className="text-sm text-gray-500">Getting your recommendations...</p>}
              {recommendations && (
                <>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Recommended Streams</h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    {recommendations.streams?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Matching Careers</h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    {recommendations.careers?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Retake
              </button>
              <a
                href="/streams"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                View Recommended Streams
              </a>
              <a
                href="/colleges"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Find Colleges
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="h-16 md:h-0" />
    </div>
  );
}