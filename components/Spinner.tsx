
import React from 'react';

const loadingTexts = [
    "Inking the panels...",
    "Coloring the action...",
    "Lettering the speech bubbles...",
    "Consulting the comic masters...",
    "Adding 'POW!' and 'BAM!'...",
    "Assembling the hero squad...",
    "Designing the villain's lair..."
];

export const Spinner: React.FC = () => {
    const [text, setText] = React.useState(loadingTexts[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setText(prevText => {
                const currentIndex = loadingTexts.indexOf(prevText);
                const nextIndex = (currentIndex + 1) % loadingTexts.length;
                return loadingTexts[nextIndex];
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-16 text-center print:hidden">
      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-yellow-400"></div>
      <p className="text-xl font-semibold text-gray-300 transition-opacity duration-500">{text}</p>
    </div>
  );
};
