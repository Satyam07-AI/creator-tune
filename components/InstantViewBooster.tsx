

import React, { useState } from 'react';
import { runInstantViewBoost } from '../services/geminiService';
import { generateInstantViewBoostPdf } from '../services/pdfService';
import type { InstantViewBoostData } from '../types';
import type { Language } from '../services/localization';
import {
    ChevronLeftIcon,
    RocketLaunchIcon,
    SparklesIcon,
    LightBulbIcon,
    CalendarDaysIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    ScaleIcon
} from './icons';

interface InstantViewBoosterProps {
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

const InstantViewBooster = ({ onBack, t, language }: InstantViewBoosterProps) => {
    const [channelName, setChannelName] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [thumbnailDescription, setThumbnailDescription] = useState('');
    const [result, setResult] = useState<InstantViewBoostData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!channelName.trim() || !videoTitle.trim() || !thumbnailDescription.trim()) {
            setError('Please fill in all fields for a complete analysis.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const auditResult = await runInstantViewBoost(channelName, videoTitle, thumbnailDescription, language);
            setResult(auditResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;
        generateInstantViewBoostPdf(result, { channelName, videoTitle, thumbnailDescription });
    };

    const resetForm = () => {
        setChannelName('');
        setVideoTitle('');
        setThumbnailDescription('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    };

    const renderResult = () => {
        if (!result) return null;
        return (
            <div className="space-y-6 mt-6 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResultCard title="Click-Through Rate Estimation" icon={ArrowTrendingUpIcon}>
                        <div className="text-center">
                            <p className="text-6xl font-bold text-green-400">{result.clickThroughRateEstimation.score.toFixed(1)}%</p>
                            <p className="text-white/80 mt-2">{result.clickThroughRateEstimation.analysis}</p>
                        </div>
                    </ResultCard>
                     <ResultCard title="Emotional Hook Score" icon={SparklesIcon}>
                         <div className="text-center">
                             <p className="text-6xl font-bold text-pink-300">{result.emotionalHookScore.score}<span className="text-3xl text-white/50">/10</span></p>
                             <p className="text-white/80 mt-2">{result.emotionalHookScore.feedback}</p>
                         </div>
                    </ResultCard>
                </div>
                
                <ResultCard title="Optimization Suggestions" icon={LightBulbIcon}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-pink-200">Title Improvement:</h4>
                            <p className="text-white/90">{result.optimizationSuggestions.title}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-pink-200">Thumbnail Improvement:</h4>
                            <p className="text-white/90">{result.optimizationSuggestions.thumbnail}</p>
                        </div>
                    </div>
                </ResultCard>

                <ResultCard title="A/B Test Variants" icon={ScaleIcon}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-pink-200 mb-2">Optimized Titles</h4>
                            <ul className="space-y-2">
                                {result.abVariants.titles.map((title, i) => (
                                    <li key={i} className="p-3 bg-black/20 rounded-lg text-white/90 italic">"{title}"</li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-bold text-pink-200 mb-2">Optimized Thumbnail Concepts</h4>
                            <ul className="space-y-2">
                                {result.abVariants.thumbnails.map((thumb, i) => (
                                    <li key={i} className="p-3 bg-black/20 rounded-lg text-white/90">{thumb}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </ResultCard>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResultCard title="Trending Format / Hook" icon={ArrowTrendingUpIcon}>
                        <p><strong className="text-pink-200">Format:</strong> {result.trendingFormat.format}</p>
                        <p className="mt-2"><strong className="text-pink-200">Hook:</strong> <span className="italic">"{result.trendingFormat.hook}"</span></p>
                    </ResultCard>
                    <ResultCard title="Best Upload Time" icon={ClockIcon}>
                        <p className="text-2xl font-bold text-white">{result.bestUploadTime.day}, {result.bestUploadTime.time}</p>
                        <p className="text-white/80 mt-1">{result.bestUploadTime.reason}</p>
                    </ResultCard>
                </div>

                <ResultCard title="3-Step Reach Recovery Plan" icon={RocketLaunchIcon}>
                    <ul className="space-y-3">
                        {[result.reachRecoveryPlan.step1, result.reachRecoveryPlan.step2, result.reachRecoveryPlan.step3].map((step, i) => (
                             <li key={i} className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-sm flex-shrink-0">{i+1}</span>
                                <p className="text-white/90">{step}</p>
                            </li>
                        ))}
                    </ul>
                </ResultCard>
                
                <ResultCard title="7-Day Posting Calendar" icon={CalendarDaysIcon}>
                    <div className="space-y-3">
                        {result.postingCalendar.map((item, i) => (
                            <div key={i} className="p-3 bg-black/20 rounded-lg">
                                <p className="font-bold text-white">{item.day}: <span className="font-normal">{item.idea}</span></p>
                                <p className="text-sm text-pink-200">Goal: {item.goal}</p>
                            </div>
                        ))}
                    </div>
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
                    <p className="mt-4 text-white/80 font-semibold">Generating instant growth strategy...</p>
                </div>
            );
        }

        return (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">Boost Your Views Instantly</h2>
                <p className="text-white/80 mb-6">Get a complete growth strategy for your next video by analyzing title, thumbnail, and content ideas.</p>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="channelName" className="block text-sm font-medium text-white/90 mb-2">Channel Name</label>
                        <input id="channelName" type="text" value={channelName} onChange={e => setChannelName(e.target.value)} placeholder="e.g., Everyday Explorers" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                    <div>
                        <label htmlFor="videoTitle" className="block text-sm font-medium text-white/90 mb-2">Video Title</label>
                        <input id="videoTitle" type="text" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} placeholder="e.g., We Cycled Across America in 30 Days" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                    <div>
                        <label htmlFor="thumbDesc" className="block text-sm font-medium text-white/90 mb-2">Thumbnail Description</label>
                        <textarea id="thumbDesc" rows={3} value={thumbnailDescription} onChange={e => setThumbnailDescription(e.target.value)} placeholder="e.g., 'Close up of a tired but happy face, with a map of the USA in the background. Bright, bold text says 'I DID IT!''" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                </div>

                {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

                <div className="mt-8 text-right">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !channelName || !videoTitle || !thumbnailDescription}
                        className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                        <RocketLaunchIcon className="w-5 h-5 mr-2" />
                        Get Instant Boost
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

export default InstantViewBooster;