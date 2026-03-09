import React from 'react';

const CTABanner: React.FC = () => {
  return (
    <div className="w-full px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] rounded-3xl shadow-lg px-12 py-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-white text-4xl font-semibold mb-4">
          Ready to prepare smarter for your next interview?
        </h2>
        <p className="text-white text-lg mb-8 opacity-90">
          Get instant ATS insights, AI-driven resume improvements, and realistic interview practice — all in one place.
        </p>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow">
          Get started with LEX
        </button>
      </div>
    </div>

  );
};

export default CTABanner;