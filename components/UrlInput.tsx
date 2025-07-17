import React, { useState, useCallback } from 'react';

interface UrlInputProps {
  onGenerate: (content: string) => void;
  setError: (error: string | null) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onGenerate, setError }) => {
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fetchReadme = async (readmeUrl: string) => {
    setError(null);
    // Use a CORS proxy. Public proxies can be unreliable.
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${readmeUrl}`;
    
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`The proxy server returned an error. Status: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      if (!text) {
          throw new Error("Received empty content from the URL. The file might be empty or the proxy failed silently.");
      }
      onGenerate(text);
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown fetch error.';
      setError(`Could not fetch the README from the URL. This can happen if the URL is incorrect, the CORS proxy is down, or due to network issues.

**Suggestion:** The most reliable methods are to upload the .md file directly or to paste its raw content in the text area below.

Details: ${errorMessage}`);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
          setError('For best results, please use the "Raw" URL for the GitHub README file.');
          return;
      }
      fetchReadme(url);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualContent.trim()) {
      setError(null);
      onGenerate(manualContent);
    } else {
      setError('Please paste the README content into the text area first.');
    }
  };


  const handleFile = (file: File) => {
    setError(null);
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onGenerate(content);
      };
      reader.onerror = () => {
        setError('Failed to read the uploaded file.');
      };
      reader.readAsText(file);
    } else {
      setError('Please drop or select a valid .md file.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl my-8 print:hidden space-y-8">
      {/* --- FILE UPLOAD --- */}
      <div 
        className={`relative text-center border-4 border-dashed rounded-lg p-8 transition-all duration-300 ${isDragging ? 'border-yellow-400 bg-gray-700' : 'border-gray-600'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <h3 className="text-xl font-bold text-white mb-2">Upload a File (Recommended)</h3>
        <p className="text-gray-400">Drop a <code className="bg-gray-700 px-1 rounded">.md</code> file here, or click to browse.</p>
        <input 
          type="file" 
          accept=".md,text/markdown"
          onChange={handleFileChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload a .md file"
        />
      </div>

      <div className="relative flex items-center justify-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-400 font-bold">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      {/* --- URL INPUT --- */}
      <form onSubmit={handleUrlSubmit} className="space-y-3">
        <label htmlFor="url-input" className="block text-xl font-bold text-white">Paste a URL</label>
        <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://raw.githubusercontent.com/.../README.md"
              className="flex-grow bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
            >
              Generate from URL
            </button>
        </div>
      </form>

      {/* --- MANUAL TEXT INPUT --- */}
       <form onSubmit={handleManualSubmit} className="space-y-3">
        <label htmlFor="manual-content-input" className="block text-xl font-bold text-white">Paste README Content</label>
         <textarea
            id="manual-content-input"
            value={manualContent}
            onChange={(e) => setManualContent(e.target.value)}
            placeholder="Paste the raw text of your README.md file here..."
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all h-48 resize-y"
         />
         <button
           type="submit"
           className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
         >
           Generate from Pasted Text
         </button>
       </form>
    </div>
  );
};