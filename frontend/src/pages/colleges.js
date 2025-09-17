import Layout from '../components/Layout';
import dynamic from 'next/dynamic';

const CollegeSearch = dynamic(() => import('../components/CollegeSearch.js'), { ssr: false });

export default function Colleges() {
  return (
    <Layout title="Find Colleges">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Government Colleges Near You</h1>
          <CollegeSearch />
        </div>
      </div>
    </Layout>
  );
}
