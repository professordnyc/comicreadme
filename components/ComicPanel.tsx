import React from 'react';
import { ComicPanelData } from '../types';
import { IMAGE_GEN_FAILED } from '../constants';

interface ComicPanelProps {
  panel: ComicPanelData;
}

const SpeechBubble: React.FC<{ speech: { character: string, text: string } }> = ({ speech }) => (
    <div className="mb-2">
        <p className="font-bold text-yellow-400 font-bangers tracking-wide text-lg">{speech.character}:</p>
        <p className="pl-4 border-l-2 border-yellow-500 italic">"{speech.text}"</p>
    </div>
);

const ImageErrorState: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 text-red-300 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p className="text-center font-semibold">Image generation failed</p>
    </div>
);

const ImageLoadingState: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Generating image...</div>
    </div>
);

export const ComicPanel: React.FC<ComicPanelProps> = ({ panel }) => {
  return (
    <div className="bg-gray-800 border-4 border-gray-700 rounded-lg shadow-2xl flex flex-col overflow-hidden transition-transform transform hover:scale-105 duration-300 print:shadow-none print:border-2 print:border-black print:break-inside-avoid">
      <div className="aspect-[4/3] bg-gray-900">
        {panel.imageUrl === IMAGE_GEN_FAILED ? (
            <ImageErrorState />
        ) : panel.imageUrl ? (
          <img src={panel.imageUrl} alt={panel.visualDescription} className="w-full h-full object-cover" />
        ) : (
          <ImageLoadingState />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between print:p-2">
        <div>
          <div className="bg-yellow-400 text-black p-3 rounded-t-md shadow-md -mt-12 mx-4 relative print:bg-gray-200 print:p-1 print:-mt-8">
            <p className="font-semibold text-justify">{panel.narration}</p>
          </div>
          <div className="mt-4 px-2 print:mt-2 print:px-1">
            {panel.speech && panel.speech.map((s, i) => <SpeechBubble key={i} speech={s} />)}
          </div>
        </div>
      </div>
    </div>
  );
};