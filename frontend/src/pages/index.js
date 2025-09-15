import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpenIcon, AcademicCapIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [user, setUser] = useState(null);
  const [todayPath, setTodayPath] = useState(null);

  useEffect(() => {
    // Load user and today's path from API
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setTodayPath(userData.todayPath);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to EduPathAI! 🚀
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Discover your perfect career path with AI-powered guidance
            </p>
            {user && (
              <div className="bg-white rounded-lg p-4 shadow-md inline-block">
                <p className="text-lg">Hello, <span className="font-semibold">{user.name}</span>! 👋</p>
                <p className="text-sm text-gray-500">Class {user.class} • Streak: {user.streak} days 🔥</p>
              </div>
            )}
          </motion.div>

          {/* Today's Path */}
          {todayPath && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Today's Path 🎯</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpenIcon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Micro Activity</h3>
                  <p className="text-sm text-gray-600">{todayPath.activity}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">Career Spotlight</h3>
                  <p className="text-sm text-gray-600">{todayPath.career}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <MapPinIcon className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">Stream Insight</h3>
                  <p className="text-sm text-gray-600">{todayPath.insight}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/assess">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Discover Interests</h3>
                <p className="text-gray-600 text-sm">Take fun quizzes to discover what you love</p>
              </motion.div>
            </Link>

            <Link href="/streams">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Explore Streams</h3>
                <p className="text-gray-600 text-sm">Find your perfect academic stream</p>
              </motion.div>
            </Link>

            <Link href="/careers">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Career Library</h3>
                <p className="text-gray-600 text-sm">Explore hundreds of career options</p>
              </motion.div>
            </Link>

            <Link href="/colleges">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Find Colleges</h3>
                <p className="text-gray-600 text-sm">Discover nearby government colleges</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}