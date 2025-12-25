import React from 'react';

const CTABanner: React.FC = () => {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] rounded-3xl shadow-lg px-12 py-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-white text-4xl font-semibold mb-4">
          Pronto para transformar o seu negócio?
        </h2>
        <p className="text-white text-lg mb-8 opacity-90">
          Agende uma avaliação gratuita e descubra como a Azimute pode<br />ajudar a sua empresa.
        </p>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow">
          Agende já uma avaliação gratuita
        </button>
      </div>
    </div>
  );
};

export default CTABanner;