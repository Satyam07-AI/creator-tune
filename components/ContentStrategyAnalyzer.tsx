

import React, { useState } from 'react';
import { runContentStrategyAudit } from '../services/geminiService';
import { generateContentStrategyPdf } from '../services/pdfService';
import type { ContentStrategyData, VideoIdea, ViralTrigger } from '../types';
import type { Language } from '../services/localization';
import { ChevronLeftIcon, LightBulbIcon, SearchIcon, TagIcon, SparklesIcon, ArrowTrendingUpIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowDownTrayIcon, CalendarDaysIcon, CheckCircleIcon } from './icons';

interface ContentStrategyAnalyzerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-pink-300" />
        {title}
      </h3>
      {children}
    </div>
);

const ScoreDisplay = ({ score, label, colorClass }: { score: number, label: string, colorClass: string }) => (
    <div className="text-center">
        <p className={`font-bold text-4xl ${colorClass}`}>{score}</p>
        <p className="text-xs text-white/60 font-semibold">{label}</p>
    </div>
);

const ContentStrategyAnalyzer = ({ onBack, t, language }: ContentStrategyAnalyzerProps) => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ContentStrategyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError(t('error.url.enter'));
      return;
    }
    try {
        new URL(url);
        if (!url.toLowerCase().includes('youtube.com') && !url.toLowerCase().includes('youtu.be')) {
            throw new Error('Invalid URL');
        }
    } catch(_) {
        setError(t('error.url.valid'));
        return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const auditResult = await runContentStrategyAudit(url, language);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : t('error.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setIsLoading(false);
  }
  
  const handleDownloadReport = () => {
    if (!result) return;
    generateContentStrategyPdf(result, url);
  };


  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full flex flex-col items-center justify-center p-8 bg-white/10 rounded-2xl mt-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p className="mt-4 text-white/80 font-semibold">Generating advanced content strategy...</p>
        </div>
      );
    }

    if (result) {
      return (
        <div className="space-y-6 mt-6 animate-fade-in-up">
            <ResultCard title="Advanced Video Blueprints" icon={SparklesIcon} className="md:col-span-2">
                <ul className="space-y-6">
                    {result.videoIdeas.map((videoIdea: VideoIdea, index: number) => (
                         <li key={index} className="bg-black/20 p-6 rounded-xl border border-white/10">
                            {/* --- HEADER --- */}
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">{videoIdea.idea}</h4>
                                    <span className="bg-pink-400/20 text-pink-200 text-xs font-bold px-2 py-0.5 rounded-full">{videoIdea.formatTag}</span>
                                </div>
                                <div className="flex gap-4 flex-shrink-0">
                                   <ScoreDisplay score={videoIdea.viralScore} label="VIRAL SCORE" colorClass={getScoreColor(videoIdea.viralScore)} />
                                   <ScoreDisplay score={videoIdea.trendScore} label="TREND SCORE" colorClass={getScoreColor(videoIdea.trendScore)} />
                                </div>
                            </div>
                            <p className="text-sm text-white/70 my-4">{videoIdea.reason}</p>
                            
                            {/* --- CLASSIFICATION --- */}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/90 border-t border-b border-white/10 py-3">
                                <span className="font-semibold flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-green-400"/>
                                    {videoIdea.contentType}: <span className="font-normal text-white/70 ml-1">{videoIdea.relevanceLifespan}</span>
                                </span>
                                <span className="font-semibold flex items-center gap-2">
                                     <CalendarDaysIcon className="w-4 h-4 text-yellow-400"/>
                                    Best Day to Post: <span className="font-normal text-white/70 ml-1">{videoIdea.bestDayToPost}</span>
                                </span>
                            </div>

                            {/* --- CREATIVE BREAKDOWN --- */}
                            <div className="py-4 space-y-4">
                                <div className="text-white/90"><strong className="text-pink-200">Hook:</strong> <span className="italic">"{videoIdea.hook}"</span></div>
                                <div className="text-white/90"><strong className="text-purple-300">AI-Powered Twist:</strong> {videoIdea.creativeTwist}</div>
                                <div>
                                    <strong className="text-pink-200 block mb-2">Psychological Triggers:</strong>
                                    <div className="flex flex-wrap gap-2">
                                        {videoIdea.viralTriggers.map((vt: ViralTrigger, i: number) => (
                                            <div key={i} className="bg-gray-700/50 p-2 rounded-lg text-xs">
                                                <p className="font-bold text-white">{vt.trigger}</p>
                                                <p className="text-white/70">{vt.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* --- INSPIRATION --- */}
                            <div className="border-t border-white/10 pt-4">
                                 <strong className="text-pink-200 text-sm block mb-2 flex items-center gap-2"><LightBulbIcon className="w-5 h-5"/> Top Performing Inspiration:</strong>
                                 <div className="space-y-2">
                                     {videoIdea.inspirationVideos.map((vid, i) => (
                                         <div key={i} className="text-sm text-white/90 bg-black/30 p-2 rounded-md">
                                             <p>{vid.title} <span className="font-bold text-purple-300">({vid.views})</span></p>
                                         </div>
                                     ))}
                                 </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </ResultCard>
            
            <div className="flex gap-4 mt-6">
                <button
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                    {t('tool.analyzeAnother')} Channel
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

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Advanced Content Blueprints</h2>
            <p className="text-white/80 mb-6">Get AI-driven ideas with deep strategic analysis to supercharge your channel's growth.</p>

            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/30 p-2 shadow-inner focus-within:ring-2 focus-within:ring-white/80 transition-all">
                <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
                placeholder={t('tool.channelUrl.placeholder')}
                className="flex-grow bg-transparent text-white placeholder-white/70 focus:outline-none px-4 text-lg"
                disabled={isLoading}
                />
                <button
                onClick={handleSubmit}
                disabled={isLoading || !url}
                className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed"
                >
                    <SearchIcon className="w-5 h-5 mr-2" />
                    {t('analyze')}
                </button>
            </div>
            {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}
        </div>
    );
  };


  return (
    <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-semibold transition-colors">
        <ChevronLeftIcon className="w-5 h-5" />
        {t('backToFeatures')}
      </button>
      {renderContent()}
    </div>
  );
};

export default ContentStrategyAnalyzer;
