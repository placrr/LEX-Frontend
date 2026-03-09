"use client";

import { FC } from "react";

const BuildForEveryoneSection: FC = () => {
  // Just the structure for blank cards
  const cardsRow1 = Array(3).fill({});
  const cardsRow2 = Array(2).fill({});

  return (
    <section className="bg-white py-20 px-6 md:px-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-[50px] md:text-[52px] font-extrabold leading-[1.05] tracking-[-0.04em]">
          Built For Everyone
        </h2>
        <p className="mt-2 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          A platform designed to fit the needs of every employee, manager, and team  
          across your organization seamlessly.
        </p>
      </div>

      {/* Row 1: 3 blank cards */}
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3">
        {cardsRow1.map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg h-48 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300"
          ></div>
        ))}
      </div>

      {/* Row 2: 1 big card + 1 small card */}
      <div className="mt-6 max-w-7xl mx-auto grid gap-6 md:grid-cols-3">
        {/* Big card spanning 2 columns */}
        <div className="md:col-span-2 bg-gray-100 rounded-lg h-48 shadow-sm hover:shadow-md transition-shadow duration-300"></div>

        {/* Small card */}
        <div className="bg-gray-100 rounded-lg h-48 shadow-sm hover:shadow-md transition-shadow duration-300"></div>
      </div>
    </section>
  );
};

export default BuildForEveryoneSection;
