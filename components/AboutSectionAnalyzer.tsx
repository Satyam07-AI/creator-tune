

import React, { useState } from 'react';
import { runAboutSectionAnalysis } from '../services/geminiService';
import { generateAboutSectionPdf } from '../services/pdfService';
import type { AboutSectionAnalysisData } from '../types';
import { ChevronLeftIcon, DocumentTextIcon, SparklesIcon, CheckCircleIcon, LightBulbIcon, ArrowDownTrayIcon } from './icons';
import type { Language } from '../services/localization';

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-pink-300" />
        {title}
      </h3>
      {children}
    </div>
);

const BulletList = ({ items }: { items: string[] }) => (
    <ul className="space-y-3">
        {items.map((item, index) => (
        <li key={index} className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-pink-300 mr-3 mt-1 flex-shrink-0" />
            <span className="text-white/90">{item}</span>
        </li>
        ))}
    </ul>
);

interface AboutSectionAnalyzerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const AboutSectionAnalyzer = ({ onBack, t, language }: AboutSectionAnalyzerProps) => {
  const [aboutText, setAboutText] = useState('');
  const [result, setResult] = useState<AboutSectionAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptimized, setShowOptimized] = useState(false);

  const handleSubmit = async () => {
    if (!aboutText.trim()) {
      setError('Please paste your "About" section text.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowOptimized(false);

    try {
      const auditResult = await runAboutSectionAnalysis(aboutText, language);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAboutText('');
    setResult(null);
    setError(null);
    setIsLoading(false);
    setShowOptimized(false);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    generateAboutSectionPdf(result);
  };

  const renderResult = () => {
    if (!result) return null;
    return (
        <div className="space-y-6 mt-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard title="Tone Analysis" icon={SparklesIcon}>
                    <p className="text-white/90">{result.toneAnalysis}</p>
                </ResultCard>
                <ResultCard title="Niche Alignment" icon={CheckCircleIcon}>
                    <p className="text-white/90">{result.alignmentWithNiche}</p>
                </ResultCard>
            </div>
            
            <ResultCard title="Clarity & Branding Suggestions" icon={LightBulbIcon}>
                <BulletList items={result.clarityAndBrandingSuggestions} />
            </ResultCard>

             <ResultCard title="Missing Elements" icon={LightBulbIcon}>
                <BulletList items={result.missingElements} />
            </ResultCard>

            <ResultCard title="Optimized Version" icon={DocumentTextIcon}>
                <div className="space-y-4">
                    <p className="text-white/90 italic p-4 bg-black/20 rounded-lg whitespace-pre-wrap">{result.optimizedVersion}</p>
                    <button
                        onClick={() => navigator.clipboard.writeText(result.optimizedVersion)}
                        className="w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Copy Optimized Text
                    </button>
                </div>
            </ResultCard>

             <div className="flex gap-4 mt-4">
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
    );
  }

  const renderForm = () => {
    if (result) return null;

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-8 bg-white/10 rounded-2xl mt-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                <p className="mt-4 text-white/80 font-semibold">Analyzing your 'About' section...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Channel 'About' Section Analyzer</h2>
            <p className="text-white/80 mb-6">Optimize your channel's first impression. Get feedback on tone, clarity, and branding to build trust instantly.</p>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="aboutText" className="block text-sm font-medium text-white/90 mb-2">Your 'About' Section Text</label>
                    <textarea 
                      id="aboutText"
                      rows={8}
                      value={aboutText}
                      onChange={e => setAboutText(e.target.value)}
                      placeholder="Paste the full text from your channel's 'About' page here..."
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
            </div>

            {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

            <div className="mt-8 text-right">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !aboutText}
                    className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Analyze 'About' Section
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-semibold transition-colors">
        <ChevronLeftIcon className="w-5 h-5" />
        {t('backToFeatures')}
      </button>
      {renderForm()}
      {renderResult()}
    </div>
  );
};

export default AboutSectionAnalyzer;