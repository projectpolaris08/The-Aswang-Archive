import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would send this to an API
    console.log('Submitted email:', email);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Join Our Dark Folklore Community
          </h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter and receive the latest updates on Philippine folklore, 
            invitations to events, and exclusive content about mythical creatures and supernatural tales.
          </p>

          {submitted ? (
            <div className="bg-green-900/50 border border-green-700 rounded-lg py-4 px-6 text-green-400">
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm mt-1">Check your email for a confirmation message.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;