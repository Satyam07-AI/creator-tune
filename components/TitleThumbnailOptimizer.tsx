

import React, { useState, useCallback } from 'react';
import { runTitleThumbnailAudit } from '../services/geminiService';
import { generateTitleThumbnailPdf } from '../services/pdfService';
import type { TitleThumbnailAuditData } from '../types';
import type { Language } from '../services/localization';
import { ChevronLeftIcon, UploadIcon, SparklesIcon, CheckCircleIcon, EyeIcon, DocumentTextIcon, PaintBrushIcon, ArrowTrendingUpIcon, ArrowDownTrayIcon } from './icons';

interface TitleThumbnailOptimizerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const ResultCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center"><SparklesIcon className="w-6 h-6 mr-2 text-pink-300" />{title}</h3>
      {children}
    </div>
);


const TitleThumbnailOptimizer = ({ onBack, t, language }: TitleThumbnailOptimizerProps) => {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<TitleThumbnailAuditData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) {
          setError("Image size should not exceed 4MB.");
          return;
      }
      setImageFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!title.trim() || !imageFile || !imageBase64) {
      setError('Please provide both a title and a thumbnail image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const auditResult = await runTitleThumbnailAudit(title, imageBase64, imageFile.type, language);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setImageFile(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }

  const handleDownloadReport = () => {
    if (!result || !imageBase64) return;
    generateTitleThumbnailPdf(result, title, imageBase64);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up flex flex-col items-center justify-center p-8 bg-white/10 rounded-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white/80 font-semibold">Analyzing your assets...</p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up">
        <div className="space-y-6">
            <ResultCard title="Overall CTR Rating">
                <div className="flex items-baseline gap-2">
                    <p className="text-6xl font-bold text-pink-300">{result.ctrRating}</p>
                    <p className="text-2xl text-white/80">/ 10</p>
                </div>
            </ResultCard>

            <ResultCard title="Analysis">
                <p className="text-white/90 whitespace-pre-wrap">{result.analysis}</p>
            </ResultCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard title="Suggested Title">
                     <p className="text-white/90 font-semibold text-lg">{result.suggestedTitle}</p>
                </ResultCard>
                 <ResultCard title="Advanced Thumbnail Analysis">
                    <div className="space-y-5">
                        <div>
                            <h4 className="flex items-center text-md font-semibold text-pink-200 mb-1">
                                <EyeIcon className="w-5 h-5 mr-2" /> Emotion & Expression
                            </h4>
                            <p className="text-white/90 pl-7">{result.thumbnailSuggestions.emotion_use}</p>
                        </div>
                        <div>
                            <h4 className="flex items-center text-md font-semibold text-pink-200 mb-1">
                                <SparklesIcon className="w-5 h-5 mr-2" /> Clutter & Focus
                            </h4>
                            <p className="text-white/90 pl-7">{result.thumbnailSuggestions.clutter}</p>
                        </div>
                        <div>
                            <h4 className="flex items-center text-md font-semibold text-pink-200 mb-1">
                                <DocumentTextIcon className="w-5 h-5 mr-2" /> Text Readability
                            </h4>
                            <p className="text-white/90 pl-7">{result.thumbnailSuggestions.text_readability}</p>
                        </div>
                         <div>
                            <h4 className="flex items-center text-md font-semibold text-pink-200 mb-1">
                                <PaintBrushIcon className="w-5 h-5 mr-2" /> Color & Contrast
                            </h4>
                            <p className="text-white/90 pl-7">{result.thumbnailSuggestions.color_advice}</p>
                        </div>
                        <div>
                            <h4 className="flex items-center text-md font-semibold text-pink-200 mb-1">
                                <CheckCircleIcon className="w-5 h-5 mr-2" /> Title-Thumbnail Match
                            </h4>
                            <p className="text-white/90 pl-7">{result.thumbnailSuggestions.title_match}</p>
                        </div>
                         <div>
                            <h4 className="flex items-center text-md font-semibold text-pink-200 mb-1">
                                <ArrowTrendingUpIcon className="w-5 h-5 mr-2" /> Predicted CTR
                            </h4>
                            <p className="text-white/90 pl-7 font-semibold">{result.thumbnailSuggestions.ctr_prediction}</p>
                        </div>
                    </div>
                </ResultCard>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                  {t('tool.analyzeAnother')}
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex-1 flex items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download PDF Report
              </button>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-semibold transition-colors">
        <ChevronLeftIcon className="w-5 h-5" />
        {t('backToFeatures')}
      </button>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">Title & Thumbnail Optimizer</h2>
        <p className="text-white/80 mb-6">Get AI feedback on your title and thumbnail to maximize clicks.</p>

        <div className="space-y-6">
          <div>
            <label htmlFor="videoTitle" className="block text-sm font-medium text-white/90 mb-2">Video Title</label>
            <input 
              id="videoTitle"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., I Built a Flying Car in 30 Days!"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Thumbnail Image</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/40 px-6 py-10 bg-white/5 hover:border-white/60 transition relative">
              {imageBase64 ? (
                  <div className="relative group">
                      <img src={imageBase64} alt="Thumbnail preview" className="max-h-48 rounded-md mx-auto" />
                      <label htmlFor="file-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold rounded-md">
                          Change Image
                      </label>
                  </div>
              ) : (
                  <div className="text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-white/50" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-white/80">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-pink-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-pink-200"
                    >
                      <span>Upload a file</span>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-white/60">PNG, JPG, WEBP up to 4MB</p>
                </div>
              )}
               <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isLoading}/>
            </div>
          </div>
        </div>
        
        {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

        <div className="mt-8 text-right">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !title || !imageFile}
            className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Get Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleThumbnailOptimizer;
