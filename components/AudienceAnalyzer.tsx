

import React, { useState } from 'react';
import { runAudienceAnalysis } from '../services/geminiService';
import { generateAudienceProfilePdf } from '../services/pdfService';
import type { AudienceProfileData } from '../types';
import { ChevronLeftIcon, UserGroupIcon, SparklesIcon, LightBulbIcon, DocumentTextIcon, CheckCircleIcon, ArrowTrendingUpIcon, MapIcon, ArrowDownTrayIcon } from './icons';
import type { Language } from '../services/localization';

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-pink-300" />
        {title}
      </h3>
      <div className="flex-grow">{children}</div>
    </div>
);

interface AudienceAnalyzerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const AudienceAnalyzer = ({ onBack, t, language }: AudienceAnalyzerProps) => {
  const [titles, setTitles] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [about, setAbout] = useState('');
  const [result, setResult] = useState<AudienceProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!titles.trim() || !descriptions.trim() || !about.trim()) {
      setError('Please fill in all fields with your channel data.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const auditResult = await runAudienceAnalysis(titles, descriptions, about, language);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadReport = () => {
    if (!result) return;
    generateAudienceProfilePdf(result);
  };

  const resetForm = () => {
    setTitles('');
    setDescriptions('');
    setAbout('');
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
                <ResultCard title="Ideal Viewer Demographics" icon={UserGroupIcon} className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-pink-200 font-bold">Age Range</p>
                            <p className="text-white/90 text-lg font-semibold">{result.viewerSummary.age}</p>
                        </div>
                        <div>
                            <p className="text-sm text-pink-200 font-bold">Gender</p>
                            <p className="text-white/90 text-lg font-semibold">{result.viewerSummary.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-pink-200 font-bold">Country</p>
                            <p className="text-white/90 text-lg font-semibold">{result.viewerSummary.country}</p>
                        </div>
                    </div>
                </ResultCard>
                <ResultCard title="Content Resonance Score" icon={ArrowTrendingUpIcon}>
                    <div className="text-center">
                        <p className={`text-6xl font-bold ${getScoreColor(result.contentResonanceScore)}`}>{result.contentResonanceScore}<span className="text-3xl text-white/50">/100</span></p>
                        <p className="text-white/80 mt-2">How well your content aligns with your audience.</p>
                    </div>
                </ResultCard>
            </div>
            
            <ResultCard title="Psychographics" icon={SparklesIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-pink-200 mb-2">Personality & Values</h4>
                        <ul className="space-y-1 list-disc list-inside text-sm text-white/80">
                            {[...result.psychographics.personalityTraits, ...result.psychographics.values].map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-pink-200 mb-2">Pain Points & Motivations</h4>
                        <ul className="space-y-1 list-disc list-inside text-sm text-white/80">
                            {[...result.psychographics.painPoints, ...result.psychographics.motivations].map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </ResultCard>

            <ResultCard title="Viewer Archetypes" icon={UserGroupIcon}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.viewerArchetypes.map((p, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-lg">
                            <h4 className="font-bold text-white">{p.name}, {p.age}</h4>
                            <p className="text-sm text-pink-200">{p.profession}</p>
                            <p className="text-xs text-white/70 mt-2 italic">Motivation: {p.motivation}</p>
                        </div>
                    ))}
                </div>
            </ResultCard>

            <ResultCard title="Community Hotspots" icon={MapIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {result.communityHotspots.map((h, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-lg text-center">
                             <p className="font-bold text-white">{h.platform}</p>
                             <p className="text-sm text-pink-200">{h.community}</p>
                        </div>
                    ))}
                </div>
            </ResultCard>

            <ResultCard title="Actionable Engagement Tips" icon={LightBulbIcon}>
                <ul className="space-y-3">
                    {result.engagementTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-white/90">{tip}</span>
                        </li>
                    ))}
                </ul>
            </ResultCard>
            
            <div className="flex gap-4 mt-4">
                <button onClick={resetForm} className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors">
                    Analyze Another
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
                <p className="mt-4 text-white/80 font-semibold">Building your audience profile...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Target Audience Analyzer</h2>
            <p className="text-white/80 mb-6">Paste your content to build a detailed audience persona with psychographics and engagement tips.</p>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="videoTitles" className="block text-sm font-medium text-white/90 mb-2">Video Titles (semicolon-separated)</label>
                    <textarea 
                      id="videoTitles"
                      rows={4}
                      value={titles}
                      onChange={e => setTitles(e.target.value)}
                      placeholder="e.g., How I Learned to Code in 6 Months; My First $1,000 as a Freelancer; Top 5 VSCode Extensions"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="videoDescriptions" className="block text-sm font-medium text-white/90 mb-2">Video Descriptions</label>
                    <textarea 
                      id="videoDescriptions"
                      rows={4}
                      value={descriptions}
                      onChange={e => setDescriptions(e.target.value)}
                      placeholder="Paste one or two typical video descriptions here..."
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
                 <div>
                    <label htmlFor="aboutSection" className="block text-sm font-medium text-white/90 mb-2">Channel 'About' Section</label>
                    <textarea 
                      id="aboutSection"
                      rows={4}
                      value={about}
                      onChange={e => setAbout(e.target.value)}
                      placeholder="Paste the full text from your channel's 'About' page here..."
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
            </div>

            {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

            <div className="mt-8 text-right">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !titles || !descriptions || !about}
                    className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    Build Audience Profile
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

export default AudienceAnalyzer;
