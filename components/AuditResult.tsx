

import React from 'react';
import type { AuditData } from '../types';
import { generateAuditPdf } from '../services/pdfService';
import {
  CheckCircleIcon,
  XIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  StarIcon,
  ArrowDownTrayIcon,
} from './icons';

interface AuditResultProps {
    data: AuditData;
    channelUrl: string;
    t: (key: string) => string;
}

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.ComponentType<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Icon className="w-6 h-6 mr-3 text-pink-300" />
            {title}
        </h3>
        {children}
    </div>
);

const AuditResult = ({ data, channelUrl, t }: AuditResultProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleDownloadReport = () => {
    generateAuditPdf(data, channelUrl);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score and Niche Focus */}
        <div className="lg:col-span-1 space-y-6">
          <ResultCard title="Overall Channel Score" icon={StarIcon}>
            <div className="text-center">
              <p className={`text-6xl sm:text-7xl font-bold ${getScoreColor(data.overall_score)}`}>{data.overall_score}<span className="text-4xl text-white/50">/100</span></p>
              <p className="text-white/80 mt-2">An assessment of your channel's clarity, consistency, and appeal.</p>
            </div>
          </ResultCard>
          <ResultCard title="Niche Focus Analysis" icon={TagIcon}>
            <p className="text-white/90 leading-relaxed">{data.niche_focus}</p>
          </ResultCard>
        </div>

        {/* Main analysis section */}
        <div className="lg:col-span-2 space-y-6">
          <ResultCard title="Title Analysis" icon={SparklesIcon}>
            <div className="space-y-6">
              {data.title_analysis.map((analysis, index) => (
                <div key={index} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-semibold text-white/90 italic">"{analysis.title}"</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <h4 className="font-bold text-green-300 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {analysis.strengths.map((s, i) => <li key={i} className="flex items-start gap-2"><CheckCircleIcon className="w-4 h-4 mt-1 text-green-300 shrink-0" /> <span className="text-sm text-white/80">{s}</span></li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-300 mb-2">Weaknesses</h4>
                      <ul className="space-y-1">
                        {analysis.weaknesses.map((w, i) => <li key={i} className="flex items-start gap-2"><XIcon className="w-4 h-4 mt-1 text-red-300 shrink-0" /> <span className="text-sm text-white/80">{w}</span></li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3">
                     <h4 className="font-bold text-pink-300 mb-1">Suggestion</h4>
                     <p className="text-sm text-white bg-black/20 p-2 rounded-md">{analysis.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Thumbnail Review" icon={SparklesIcon}>
            <div className="space-y-6">
                {data.thumbnail_review.map((review, index) => (
                    <div key={index} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                        <p className="font-semibold text-white/90 italic">For video: "{review.video_title}"</p>
                        <div className="mt-3 space-y-3">
                            <p><strong className="text-pink-200">Readability Score:</strong> <span className={`${getScoreColor(review.readability_score * 10)} font-bold`}>{review.readability_score}/10</span></p>
                            <p><strong className="text-pink-200">Emotional Impact:</strong> {review.emotional_impact}</p>
                            <p><strong className="text-pink-200">Contrast Feedback:</strong> {review.contrast_feedback}</p>
                            <div>
                                <h4 className="font-bold text-pink-300 mb-2">Suggestions:</h4>
                                <ul className="space-y-1 list-disc list-inside text-white/80">
                                    {review.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </ResultCard>

          <ResultCard title="High-Potential Videos" icon={ArrowTrendingUpIcon}>
             <div className="space-y-4">
                {data.potential_videos.map((video, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-lg">
                        <p className="font-bold text-white">{video.title}</p>
                        <p className="text-sm text-white/70 mt-1"><strong className="text-pink-200">Why it has potential:</strong> {video.reason_for_potential}</p>
                        <p className="text-sm text-white/70 mt-1"><strong className="text-pink-200">Growth strategy:</strong> {video.growth_strategy}</p>
                    </div>
                ))}
             </div>
          </ResultCard>

          <ResultCard title="Sample Content Calendar" icon={CalendarDaysIcon}>
            <div className="space-y-4">
                {data.content_calendar.map((item, index) => (
                    <div key={index} className="bg-black/20 p-4 rounded-lg">
                        <p className="font-bold text-white">{item.day}: {item.idea}</p>
                        <p className="text-sm text-white/70 mt-2"><strong className="text-pink-200">Suggested Title:</strong> {item.suggested_title}</p>
                        <p className="text-sm text-white/70 mt-1"><strong className="text-pink-200">Thumbnail Concept:</strong> {item.thumbnail_concept}</p>
                    </div>
                ))}
             </div>
          </ResultCard>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleDownloadReport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 hover:scale-105"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default AuditResult;
