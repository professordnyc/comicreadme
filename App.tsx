
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { ComicPreview } from './components/ComicPreview';
import { Spinner } from './components/Spinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Footer } from './components/Footer';
import { ComicScript } from './types';
import { generateFullComic } from './services/geminiService';
import { ExportButtons } from './components/ExportButtons';

// Critical check for API Key
const isApiKeyMissing = !process.env.API_KEY;

function App() {
  const [comicScript, setComicScript] = useState<ComicScript | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>('');

  const handleGeneration = useCallback(async (content: string) => {
    if (isApiKeyMissing) {
      setError("Cannot generate comic: API Key is missing. Please ensure the API_KEY environment variable is set.");
      return;
    }
    if (!content.trim()) {
      setError("README content is empty. Please provide a valid URL or file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setComicScript(null);
    setReadmeContent(content);

    try {
      const result = await generateFullComic(content);
      setComicScript(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during comic generation.';
      setError(`Failed to generate comic. Please check your API Key and network connection. Details: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setComicScript(null);
    setIsLoading(false);
    setError(null);
    setReadmeContent('');
  };

  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
          <ErrorDisplay message="Configuration Error: The API_KEY environment variable is not set. The application cannot function without it." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col print:bg-white print:text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {!comicScript && !isLoading && (
          <UrlInput onGenerate={handleGeneration} setError={setError} />
        )}

        {isLoading && <Spinner />}
        
        {error && !isLoading && <ErrorDisplay message={error} onClear={() => setError(null)} />}

        {comicScript && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <ExportButtons onReset={handleReset} script={comicScript} />
            <ComicPreview script={comicScript} />
          </div>
        )}

        {!isLoading && !comicScript && !error && (
            <div className="text-center mt-12 text-gray-400 max-w-2xl">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Welcome to ComicReadMe!</h2>
                <p className="text-lg mb-2">
                    Transform any technical README.md into a fun, engaging comic book.
                </p>
                <p>
                    Just paste a GitHub README URL, drop a `.md` file, or its contents above to start the magic. Our AI will analyze the content, create characters, and illustrate a unique comic just for you.
                </p>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;