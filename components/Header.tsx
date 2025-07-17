
import React from 'react';

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 7.5L4 10L9.5 12.5L12 18L14.5 12.5L20 10L14.5 7.5L12 2Z" />
        <path d="M19 14L18 16L19 18L20 16L21 18L22 16L21 14L20 16L19 14Z" />
        <path d="M4 3L3.5 4L4 5L4.5 4L5 5L5.5 4L5 3L4.5 4L4 3Z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full sticky top-0 z-10 print:hidden">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center">
        <SparkleIcon />
        <h1 className="text-3xl sm:text-4xl font-bangers tracking-wider text-white ml-3">
          ComicReadMe
        </h1>
        <SparkleIcon />
      </div>
    </header>
  );
};
