

import React, { useState } from 'react';
import { runEngagementHacksAudit } from '../services/geminiService';
import { generateEngagementHacksPdf } from '../services/pdfService';
import type { EngagementHacksData, FormatSpecificCTAs } from '../types';
import { ChevronLeftIcon, ChatBubbleOvalLeftEllipsisIcon, SparklesIcon, ArrowTrendingUpIcon, ClockIcon, ClipboardDocumentListIcon, UserGroupIcon, ArrowDownTrayIcon, LightBulbIcon, ChevronUpDownIcon } from './icons';
import type { Language } from '../services/localization';

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon?: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
        {title && (
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                {Icon && <Icon className="w-6 h-6 mr-3 text-pink-300" />}
                {title}
            </h3>
        )}
      <div className="flex-grow">{children}</div>
    </div>
);

interface EngagementHacksAnalyzerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const EngagementHacksAnalyzer = ({ onBack, t, language }: EngagementHacksAnalyzerProps) => {
  const [content, setContent] = useState('');
  const [channelSize, setChannelSize] = useState('1k-10k');
  const [result, setResult] = useState<EngagementHacksData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCtaTab, setActiveCtaTab] = useState<FormatSpecificCTAs['format']>('Long-form Video');

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Please provide some video titles and descriptions.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const auditResult = await runEngagementHacksAudit(content, channelSize, language);
      setResult(auditResult);
      // Set initial tab to the first available format
      if (auditResult.ctaGenerator.length > 0) {
        setActiveCtaTab(auditResult.ctaGenerator[0].format);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    generateEngagementHacksPdf(result);
  };


  const resetForm = () => {
    setContent('');
    setChannelSize('1k-10k');
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;
    return (
      <div className="space-y-8 mt-6 animate-fade-in-up">
        <ResultCard title="Engagement Score Tracker" icon={ArrowTrendingUpIcon}>
            <div className="text-center">
                <p className="text-7xl font-bold text-green-400">
                    +{result.engagementBoostProjection}%
                </p>
                <p className="font-semibold text-white/80">Projected Engagement Boost</p>
                 <p className="text-xs text-white/60 mt-1">If all hacks are applied correctly.</p>
            </div>
        </ResultCard>

        <ResultCard title="AI-Powered CTA Generator" icon={SparklesIcon}>
            <div className="mb-4 border-b border-white/20 flex">
                {result.ctaGenerator.map(({format}) => (
                    <button 
                        key={format}
                        onClick={() => setActiveCtaTab(format)}
                        className={`px-4 py-2 text-sm font-semibold transition-colors ${activeCtaTab === format ? 'text-pink-300 border-b-2 border-pink-300' : 'text-white/70 hover:text-white'}`}
                    >
                        {format}
                    </button>
                ))}
            </div>
            <ul className="space-y-3">
            {result.ctaGenerator.find(g => g.format === activeCtaTab)?.ctas.map((cta, index) => (
                <li key={index} className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                    <SparklesIcon className="w-4 h-4 text-purple-300 mt-1 flex-shrink-0" />
                    <span className="text-white/90 italic">"{cta}"</span>
                </li>
            ))}
            </ul>
        </ResultCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResultCard title="Time-Stamped Engagement Boosts" icon={ClockIcon}>
                <div className="space-y-4">
                    {result.timeStampedBoosts.map((boost, index) => (
                        <div key={index} className="border-l-2 border-purple-400 pl-3">
                            <p className="font-bold text-white">{boost.timestamp}: <span className="font-medium">{boost.hack}</span></p>
                            <p className="text-sm text-white/70 italic">{boost.reason}</p>
                        </div>
                    ))}
                </div>
            </ResultCard>
            <ResultCard title="Comment Trigger Prompts" icon={ChatBubbleOvalLeftEllipsisIcon}>
                <ul className="space-y-3 list-disc list-inside">
                    {result.commentTriggers.map((q, i) => <li className="text-white/90" key={i}>{q}</li>)}
                </ul>
            </ResultCard>
        </div>

        <ResultCard title="Engagement Funnel Blueprint" icon={UserGroupIcon}>
            <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 font-bold text-white text-xs sm:text-base">
                    {result.engagementFunnel.map((stage) => (
                        <div key={stage.stage} className="text-center p-2 sm:p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <p>{stage.stage}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {result.engagementFunnel.map(stage => (
                        <div key={stage.stage} className="bg-black/20 p-4 rounded-lg">
                            <h5 className="font-bold text-white">{stage.stage}</h5>
                            <p className="text-xs text-pink-200 mb-2">Goal: {stage.goal}</p>
                            <ul className="space-y-1 list-disc list-inside text-sm text-white/80">
                                {stage.tactics.map((tactic, i) => <li key={i}>{tactic}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </ResultCard>
        
        <ResultCard title="Community Tab Hack List" icon={ClipboardDocumentListIcon}>
            <div className="space-y-4">
                 {result.communityTabHacks.map((hack, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-lg">
                        <h5 className="font-bold text-white">{hack.type}: <span className="font-normal">{hack.idea}</span></h5>
                        <p className="text-sm text-white/70 italic mt-1">{hack.reason}</p>
                    </div>
                ))}
            </div>
        </ResultCard>
        
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
    );
  };

  const renderForm = () => {
    if (result) return null;
    if (isLoading) {
      return (
        <div className="w-full flex flex-col items-center justify-center p-8 bg-white/10 rounded-2xl mt-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white/80 font-semibold">Generating your engagement blueprint...</p>
        </div>
      );
    }
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">Engagement Growth Blueprint</h2>
        <p className="text-white/80 mb-6">Get an advanced, psychology-driven plan to boost viewer interaction and build community.</p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="channelSize" className="block text-sm font-medium text-white/90 mb-2">Channel Size</label>
            <div className="relative">
                <select
                  id="channelSize"
                  value={channelSize}
                  onChange={(e) => setChannelSize(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/30 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                >
                    <option value="0-1k">Just Starting (0-1k subs)</option>
                    <option value="1k-10k">Growing (1k-10k subs)</option>
                    <option value="10k-100k">Established (10k-100k subs)</option>
                    <option value="100k+">Large (100k+ subs)</option>
                </select>
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white/90 mb-2">Recent Video Titles & Descriptions</label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste 3-5 of your recent video titles and their descriptions here. The more context, the better the blueprint!"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
            />
          </div>
        </div>
        {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}
        <div className="mt-8 text-right">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !content}
            className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Get Engagement Blueprint
          </button>
        </div>
      </div>
    );
  };

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

export default EngagementHacksAnalyzer;
