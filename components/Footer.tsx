import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800/50 mt-12 py-4 text-center text-gray-400 text-sm print:hidden">
      <p>Powered by Google Gemini and Imagen APIs.</p>
      <p className="my-1">
        <a href="https://github.com/professordnyc/comicreadme" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-400 transition-colors">
          https://github.com/professordnyc/comicreadme
        </a>
        <span className="mx-2">·</span>
        <span>Brainstormed with Copilot.</span>
      </p>
      <p>ComicReadMe &copy; {new Date().getFullYear()}. All rights reserved.</p>
    </footer>
  );
};