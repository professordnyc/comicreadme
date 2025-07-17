
import React from 'react';
import { ComicScript, PanelType } from '../types';

interface ExportButtonsProps {
    onReset: () => void;
    script: ComicScript;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onReset, script }) => {
    const handlePrint = () => {
        const originalTitle = document.title;
        // Find the title from the first panel's narration to use as the PDF filename.
        const comicTitle = script.panels.find(p => p.type === PanelType.TITLE)?.narration || 'My ComicReadMe Comic';
        
        document.title = comicTitle;
        window.print();
        // Restore the original title after the print dialog is closed.
        document.title = originalTitle;
    };

    return (
        <div className="w-full max-w-6xl flex flex-col items-center gap-2 mb-8 print:hidden">
            <div className="flex justify-center gap-4">
                <button
                    onClick={handlePrint}
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-transform transform hover:scale-105"
                >
                    Export as PDF
                </button>
                <button
                    onClick={onReset}
                    className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-transform transform hover:scale-105"
                >
                    Start Over
                </button>
            </div>
             <p className="text-sm text-gray-400">
                Tip: In the print dialog, choose "Save as PDF" as the destination.
            </p>
        </div>
    );
};