import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children, title = 'EduPathAI' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered career guidance platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Page background */}
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Top bar */}
        <header className="bg-white border-b">
          <div className="max-w-screen-xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-xl font-bold text-gray-800">EduPathAI</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
                <Link href="/assess" className="text-gray-600 hover:text-blue-600 transition-colors">Assessment</Link>
                <Link href="/streams" className="text-gray-600 hover:text-blue-600 transition-colors">Streams</Link>
                <Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</Link>
                <Link href="/colleges" className="text-gray-600 hover:text-blue-600 transition-colors">Colleges</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content area with bounded width */}
        <main className="flex-1">
          <div className="max-w-screen-xl mx-auto px-4 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-screen-xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} EduPathAI</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-700">Terms</Link>
              <a href="#" className="hover:text-gray-700">Help</a>
            </div>
          </div>
        </footer>

        {/* Bottom nav for small screens */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-screen-sm mx-auto grid grid-cols-4">
            <Link href="/" className="py-2 text-center text-sm">Home</Link>
            <Link href="/assess" className="py-2 text-center text-sm">Assess</Link>
            <Link href="/streams" className="py-2 text-center text-sm">Streams</Link>
            <Link href="/colleges" className="py-2 text-center text-sm">Colleges</Link>
          </div>
        </nav>
      </div>
    </>
  );
}
