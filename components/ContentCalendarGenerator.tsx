

import React, { useState } from 'react';
import { runPersonalizedCalendarAudit } from '../services/geminiService';
import { generateCalendarPdf } from '../services/pdfService';
import type { PersonalizedCalendarData, StrategyType, CalendarIdea } from '../types';
import { ChevronLeftIcon, CalendarDaysIcon, ClockIcon, LightBulbIcon, ArrowDownTrayIcon, SparklesIcon, ArrowTrendingUpIcon } from './icons';
import type { Language } from '../services/localization';

interface ContentCalendarGeneratorProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const ContentCalendarGenerator = ({ onBack, t, language }: ContentCalendarGeneratorProps) => {
  const [niche, setNiche] = useState('');
  const [topTitles, setTopTitles] = useState('');
  const [audienceBehavior, setAudienceBehavior] = useState('');
  const [strategyType, setStrategyType] = useState<StrategyType>('Global');
  const [result, setResult] = useState<PersonalizedCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!niche.trim() || !topTitles.trim()) {
      setError('Please fill in both the niche and top titles.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const auditResult = await runPersonalizedCalendarAudit(niche, topTitles, audienceBehavior, strategyType, language);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    generateCalendarPdf(result);
  };

  const resetForm = () => {
    setNiche('');
    setTopTitles('');
    setAudienceBehavior('');
    setStrategyType('Global');
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const getObjectiveColor = (objective: CalendarIdea['objective']) => {
    switch(objective) {
      case 'Grow Subscribers': return 'bg-purple-400/20 text-purple-200';
      case 'Build Trust': return 'bg-blue-400/20 text-blue-200';
      case 'Boost Views': return 'bg-green-400/20 text-green-200';
      case 'Drive Comments': return 'bg-pink-400/20 text-pink-200';
      case 'Engage Community': return 'bg-yellow-400/20 text-yellow-200';
      default: return 'bg-gray-400/20 text-gray-200';
    }
  };

  const renderResult = () => {
    if (!result) return null;
    return (
        <div className="space-y-4 mt-6 animate-fade-in-up">
            {result.calendar.map((dayData, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-pink-300">{dayData.day}</h4>
                        <div className={`text-xs font-bold px-3 py-1 rounded-full ${getObjectiveColor(dayData.objective)}`}>
                            Objective: {dayData.objective}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h5 className="font-semibold text-white/80">Content Idea:</h5>
                                <p className="text-white font-medium text-lg">{dayData.idea}</p>
                                <p className="text-white/80 mt-1"><strong>Title:</strong> <span className="italic">{dayData.title}</span></p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-white/80 mb-2">Viral Hooks:</h5>
                                <ul className="space-y-2">
                                  {dayData.hooks.map((hook, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-white/90 italic">
                                      <SparklesIcon className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0"/> 
                                      <span>"{hook}"</span>
                                    </li>
                                  ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4 bg-black/20 p-4 rounded-lg">
                            <div>
                                <h5 className="font-semibold text-white/80 flex items-center gap-2 mb-1"><CalendarDaysIcon className="w-4 h-4"/> Format</h5>
                                <p className="text-white font-medium">{dayData.format.type}</p>
                                <p className="text-xs text-white/70 italic">{dayData.format.reasoning}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-white/80 flex items-center gap-2 mb-1"><ClockIcon className="w-4 h-4"/> Publish Time</h5>
                                <p className="text-white font-medium">{dayData.publishTime}</p>
                            </div>
                             <div>
                                <h5 className="font-semibold text-white/80 flex items-center gap-2 mb-1"><ArrowTrendingUpIcon className="w-4 h-4"/> Predicted Outcomes</h5>
                                <ul className="text-sm text-white/90 space-y-1">
                                    <li><strong>Reach:</strong> {dayData.predictedOutcomes.reach}</li>
                                    <li><strong>Engagement:</strong> {dayData.predictedOutcomes.engagement}</li>
                                    <li><strong>Subs:</strong> {dayData.predictedOutcomes.subscriberImpact}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
             <div className="flex gap-4 mt-4">
                <button
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                    Create Another Calendar
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
                <p className="mt-4 text-white/80 font-semibold">Generating your advanced content plan...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Advanced 7-Day Content Calendar</h2>
            <p className="text-white/80 mb-6">Get a personalized weekly strategy with varied formats, viral hooks, and predicted outcomes.</p>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="niche" className="block text-sm font-medium text-white/90 mb-2">Channel Niche</label>
                    <input 
                      id="niche"
                      type="text"
                      value={niche}
                      onChange={e => setNiche(e.target.value)}
                      placeholder="e.g., 'Retro Gaming Reviews' or 'Vegan Indian Cooking'"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="topTitles" className="block text-sm font-medium text-white/90 mb-2">Top 5 Video Titles</label>
                    <textarea 
                      id="topTitles"
                      rows={4}
                      value={topTitles}
                      onChange={e => setTopTitles(e.target.value)}
                      placeholder="Paste your 5 most popular video titles, one per line..."
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="audienceBehavior" className="block text-sm font-medium text-white/90 mb-2">Audience Behavior (Optional)</label>
                    <textarea 
                        id="audienceBehavior"
                        rows={3}
                        value={audienceBehavior}
                        onChange={(e) => setAudienceBehavior(e.target.value)}
                        placeholder="e.g., 'Most active on weekday evenings. Love shorts. Respond well to questions in comments.'"
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Strategy Type</label>
                    <div className="flex gap-2 rounded-full bg-black/20 p-1">
                      {(['Global', 'Local (India-based)'] as StrategyType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setStrategyType(type)}
                          className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors duration-200 ${strategyType === type ? 'bg-purple-600 text-white shadow' : 'text-white/70 hover:bg-white/10'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                </div>
            </div>

            {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

            <div className="mt-8 text-right">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !niche || !topTitles}
                    className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                    <CalendarDaysIcon className="w-5 h-5 mr-2" />
                    Generate Calendar
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-8 animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-semibold transition-colors">
        <ChevronLeftIcon className="w-5 h-5" />
        {t('backToFeatures')}
      </button>
      {renderForm()}
      {renderResult()}
    </div>
  );
};

export default ContentCalendarGenerator;
