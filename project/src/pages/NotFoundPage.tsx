import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-serif text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-300 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;