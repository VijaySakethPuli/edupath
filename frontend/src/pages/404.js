import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <Link href="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    </div>
  );
}