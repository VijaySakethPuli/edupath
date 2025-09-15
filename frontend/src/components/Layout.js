import Head from 'next/head';
import Link from 'next/link';
import { HomeIcon, BookOpenIcon, AcademicCapIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

export default function Layout({ children, title = 'EduPathAI' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered career guidance platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">EduPathAI</span>
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                  Home
                </Link>
                <Link href="/assess" className="text-gray-600 hover:text-blue-500 transition-colors">
                  Assessment
                </Link>
                <Link href="/streams" className="text-gray-600 hover:text-blue-500 transition-colors">
                  Streams
                </Link>
                <Link href="/careers" className="text-gray-600 hover:text-blue-500 transition-colors">
                  Careers
                </Link>
                <Link href="/colleges" className="text-gray-600 hover:text-blue-500 transition-colors">
                  Colleges
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0">
          <div className="flex">
            <Link href="/" className="flex-1 py-2 px-1 text-center">
              <HomeIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/assess" className="flex-1 py-2 px-1 text-center">
              <BookOpenIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Assess</span>
            </Link>
            <Link href="/streams" className="flex-1 py-2 px-1 text-center">
              <AcademicCapIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Streams</span>
            </Link>
            <Link href="/colleges" className="flex-1 py-2 px-1 text-center">
              <BuildingLibraryIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Colleges</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}