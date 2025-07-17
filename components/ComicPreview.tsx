
import React from 'react';
import { ComicScript } from '../types';
import { ComicPanel } from './ComicPanel';

interface ComicPreviewProps {
  script: ComicScript;
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({ script }) => {
  return (
    <div id="comic-output" className="w-full max-w-6xl space-y-8 print:space-y-4">
       <div className="text-center p-4 bg-gray-800 rounded-lg shadow-inner print:hidden">
        <h2 className="text-2xl font-bold font-bangers text-yellow-400">Your Comic is Ready!</h2>
        <p className="text-gray-300">Project Type: <span className="font-semibold text-white">{script.projectType}</span></p>
        <div className="mt-2">
            <h3 className="font-bold text-lg text-yellow-300">Character Cast:</h3>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                {script.characterMap.map(({ feature, character }, index) => (
                    <p key={`${feature}-${index}`}><strong className="text-gray-100">{feature}:</strong> <span className="text-gray-400">{character}</span></p>
                ))}
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
        {script.panels.map((panel, index) => (
          <ComicPanel key={index} panel={panel} />
        ))}
      </div>
    </div>
  );
};