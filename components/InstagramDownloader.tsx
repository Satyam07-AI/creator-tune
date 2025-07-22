
import React, { useState } from 'react';
import { runInstagramCompetitorEdge } from '../services/geminiService';
import { generateInstagramCompetitorEdgePdf } from '../services/pdfService';
import type { InstagramCompetitorEdgeData } from '../types';
import type { Language } from '../services/localization';
import {
    ChevronLeftIcon,
    CameraIcon,
    SparklesIcon,
    LightBulbIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon
} from './icons';

interface InstagramDownloaderProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col ${className}`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Icon className="w-6 h-6 mr-3 text-pink-300" />
            {title}
        </h3>
        <div className="flex-grow">{children}</div>
    </div>
);

const InstagramDownloader = ({ onBack, t, language }: InstagramDownloaderProps) => {
    const [handle, setHandle] = useState('');
    const [result, setResult] = useState<InstagramCompetitorEdgeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!handle.trim()) {
            setError('Please provide an Instagram handle.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const auditResult = await runInstagramCompetitorEdge(handle, language);
            setResult(auditResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;
        generateInstagramCompetitorEdgePdf(result, handle);
    };

    const resetForm = () => {
        setHandle('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    };
    
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const renderResult = () => {
        if (!result) return null;
        return (
            <div className="space-y-6 mt-6 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ResultCard title="Engagement Score" icon={ArrowTrendingUpIcon} className="lg:col-span-1">
                        <div className="text-center my-auto">
                            <p className={`text-7xl font-bold ${getScoreColor(result.averageEngagement.score)}`}>{result.averageEngagement.score}<span className="text-4xl text-white/50">/100</span></p>
                            <p className="text-white/80 mt-2">{result.averageEngagement.analysis}</p>
                        </div>
                    </ResultCard>
                     <ResultCard title="Content Strategy" icon={SparklesIcon} className="lg:col-span-2">
                        <p className="text-white/90 mb-4">{result.contentStyleSummary}</p>
                        <div className="grid grid-cols-2 gap-4 text-center border-t border-white/10 pt-4">
                            <div>
                                <p className="font-bold text-lg text-pink-200">{result.uploadFrequency}</p>
                                <p className="text-sm text-white/70">Upload Frequency</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-pink-200">{result.averageCaptionLength}</p>
                                <p className="text-sm text-white/70">Avg. Caption Length</p>
                            </div>
                        </div>
                    </ResultCard>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResultCard title="Top Posts" icon={SparklesIcon}>
                        <div className="space-y-3">
                            {result.topPosts.map((post, i) => (
                                <div key={i} className="p-3 bg-black/20 rounded-lg">
                                    <p className="text-white/90">{post.description}</p>
                                    <p className="text-sm font-semibold text-purple-300">{post.metrics}</p>
                                </div>
                            ))}
                        </div>
                    </ResultCard>
                    <ResultCard title="Top Hashtags" icon={SparklesIcon}>
                        <ol className="list-decimal list-inside space-y-2">
                            {result.topHashtags.sort((a,b) => a.rank - b.rank).map(h => (
                                <li key={h.rank} className="font-semibold text-white/90">{h.hashtag}</li>
                            ))}
                        </ol>
                    </ResultCard>
                </div>

                <ResultCard title="Actionable Recommendations" icon={LightBulbIcon}>
                    <ul className="space-y-3">
                        {result.actionableRecommendations.map((tip, i) => (
                             <li key={i} className="flex items-start gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-white/90">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </ResultCard>

                <div className="flex gap-4 mt-6">
                    <button onClick={resetForm} className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors">
                        {t('tool.analyzeAnother')}
                    </button>
                    <button onClick={handleDownloadReport} className="flex-1 flex items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-4 rounded-lg transition-colors">
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
                    <p className="mt-4 text-white/80 font-semibold">Analyzing competitor strategy...</p>
                </div>
            );
        }

        return (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">Competitor Edge AI</h2>
                <p className="text-white/80 mb-6">Analyze a competitor's Instagram strategy to find your edge.</p>
                
                <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/30 p-2 shadow-inner focus-within:ring-2 focus-within:ring-white/80 transition-all">
                    <span className="pl-3 text-lg text-white/60">@</span>
                    <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g., mrbeast"
                        className="flex-grow bg-transparent text-white placeholder-white/70 focus:outline-none px-2 text-lg"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !handle}
                        className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-6 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {t('analyze')}
                    </button>
                </div>

                {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}
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

export default InstagramDownloader;
