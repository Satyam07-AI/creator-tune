

import React, { useState } from 'react';
import { runBrandingReview } from '../services/geminiService';
import { generateBrandingReviewPdf } from '../services/pdfService';
import type { BrandingReviewData } from '../types';
import { ChevronLeftIcon, TagIcon, PaintBrushIcon, CheckCircleIcon, LightBulbIcon, ArrowDownTrayIcon } from './icons';
import type { Language } from '../services/localization';

const ResultCard = ({ title, icon: Icon, children, className }: { title:string; icon: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
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

interface BrandingReviewAnalyzerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const BrandingReviewAnalyzer = ({ onBack, t, language }: BrandingReviewAnalyzerProps) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [pfpDescription, setPfpDescription] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [aboutSection, setAboutSection] = useState('');
  const [videoTitles, setVideoTitles] = useState('');

  const [result, setResult] = useState<BrandingReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !handle.trim() || !pfpDescription.trim() || !bannerDescription.trim() || !aboutSection.trim() || !videoTitles.trim()) {
      setError('Please fill in all fields to get a complete branding review.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const auditResult = await runBrandingReview(name, handle, pfpDescription, bannerDescription, aboutSection, videoTitles, language);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    generateBrandingReviewPdf(result);
  };

  const resetForm = () => {
    setName('');
    setHandle('');
    setPfpDescription('');
    setBannerDescription('');
    setAboutSection('');
    setVideoTitles('');
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;
    return (
        <div className="space-y-6 mt-6 animate-fade-in-up">
            <ResultCard title="Overall Branding Score" icon={PaintBrushIcon}>
                <div className="flex items-baseline gap-2">
                    <p className="text-6xl font-bold text-pink-300">{result.rating}</p>
                    <p className="text-2xl text-white/80">/ 10</p>
                </div>
            </ResultCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard title="Branding Strengths" icon={CheckCircleIcon}>
                    <BulletList items={result.strengths} />
                </ResultCard>
                <ResultCard title="Branding Weaknesses" icon={CheckCircleIcon}>
                    <BulletList items={result.weaknesses} />
                </ResultCard>
            </div>
            
            <ResultCard title="Actionable Suggestions" icon={LightBulbIcon}>
                <BulletList items={result.suggestions} />
            </ResultCard>
            
            <div className="flex gap-4 mt-4">
                <button
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                    Review Another Brand
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
                <p className="mt-4 text-white/80 font-semibold">Reviewing your brand identity...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Channel Branding Review</h2>
            <p className="text-white/80 mb-6">Get an expert review of your channel's branding consistency and appeal.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label htmlFor="channelName" className="block text-sm font-medium text-white/90 mb-2">Channel Name</label>
                    <input id="channelName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Pixel Pioneers" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
                <div>
                    <label htmlFor="channelHandle" className="block text-sm font-medium text-white/90 mb-2">Channel Handle</label>
                    <input id="channelHandle" type="text" value={handle} onChange={e => setHandle(e.target.value)} placeholder="e.g., @PixelPioneers" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="pfp" className="block text-sm font-medium text-white/90 mb-2">Profile Picture Description</label>
                    <input id="pfp" type="text" value={pfpDescription} onChange={e => setPfpDescription(e.target.value)} placeholder="e.g., 'Pixelated heart logo with a controller inside'" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="banner" className="block text-sm font-medium text-white/90 mb-2">Banner Text & Layout</label>
                    <textarea id="banner" rows={3} value={bannerDescription} onChange={e => setBannerDescription(e.target.value)} placeholder="e.g., 'Channel name on left, tagline 'Level Up Your Nostalgia' on right. Upload schedule below.'" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="about" className="block text-sm font-medium text-white/90 mb-2">About Section</label>
                    <textarea id="about" rows={4} value={aboutSection} onChange={e => setAboutSection(e.target.value)} placeholder="Paste the text from your channel's 'About' page..." className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="titles" className="block text-sm font-medium text-white/90 mb-2">Example Video Titles</label>
                    <textarea id="titles" rows={3} value={videoTitles} onChange={e => setVideoTitles(e.target.value)} placeholder="Paste 3-5 typical video titles, separated by commas..." className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
            </div>

            {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

            <div className="mt-8 text-right">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !name || !handle || !pfpDescription || !bannerDescription || !aboutSection || !videoTitles}
                    className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                    <TagIcon className="w-5 h-5 mr-2" />
                    Review Branding
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

export default BrandingReviewAnalyzer;
