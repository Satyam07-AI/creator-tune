
import React, { useState } from 'react';
import { runRetentionAnalysis } from '../services/geminiService';
import { generateRetentionAnalysisPdf } from '../services/pdfService';
import type { RetentionAnalysisData, AudiencePersona, EmotionPoint, PerformanceRating } from '../types';
import { ChevronLeftIcon, ArrowTrendingUpIcon, LightBulbIcon, SparklesIcon, UserGroupIcon, ClockIcon, EyeIcon, ArrowDownTrayIcon, CheckCircleIcon, ChevronUpDownIcon } from './icons';
import type { Language } from '../services/localization';

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Icon className="w-6 h-6 mr-3 text-pink-300" />
        {title}
      </h3>
      <div className="flex-grow">{children}</div>
    </div>
);

const ScoreRing = ({ score, text }: { score: number; text: string; }) => {
    const getScoreColor = (s: number) => s >= 75 ? '#4ade80' : s >= 50 ? '#facc15' : '#f87171';
    const color = getScoreColor(score);
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-white/10" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={color}
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold" style={{ color }}>{score}</span>
                <span className="text-xs font-semibold text-white/80 max-w-[80px] leading-tight">{text}</span>
            </div>
        </div>
    );
};

const AttentionCurveChart = ({ data, chartId }: { data: EmotionPoint[], chartId: string }) => {
    if (!data || data.length < 2) return <div className="text-white/70 text-center py-10">Not enough data for a chart.</div>;

    const width = 500;
    const height = 200;
    const padding = { top: 30, right: 20, bottom: 40, left: 30 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const path = data.map((point, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (point.score / 100) * chartHeight;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    const areaPath = `${path} L ${padding.left + chartWidth},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;
    
    // Create a unique gradient ID for each chart instance
    const lineGradientId = `line-gradient-${chartId}`;
    const areaGradientId = `area-gradient-${chartId}`;

    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[500px]">
                <defs>
                    <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
                    </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map(val => {
                    const y = padding.top + chartHeight - (val / 100) * chartHeight;
                    return (
                        <g key={val}>
                            <line x1={padding.left} x2={width-padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.1)" />
                            <text x={padding.left - 8} y={y} dy="4" textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.5)">{val}</text>
                        </g>
                    )
                })}
                
                <path d={areaPath} fill={`url(#${areaGradientId})`} />
                <path d={path} fill="none" stroke={`url(#${lineGradientId})`} strokeWidth="2.5" strokeLinejoin='round' strokeLinecap='round' />

                {data.map((point, i) => {
                    const x = padding.left + (i / (data.length - 1)) * chartWidth;
                    const y = padding.top + chartHeight - (point.score / 100) * chartHeight;
                    return (
                        <g key={i}>
                            <circle cx={x} cy={y} r="4" fill="#111827" stroke="#ec4899" strokeWidth="2" />
                            <text x={x} y={height - padding.bottom + 15} textAnchor="middle" fontSize="10" fill="white">{point.timestamp}</text>
                            <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="white" className="font-semibold">{point.emotion}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const PerformanceBadge = ({ rating, label }: { rating: PerformanceRating, label: string }) => {
    const getStyles = (r: PerformanceRating) => {
        switch(r) {
            case 'Good': return 'bg-green-400/20 text-green-300';
            case 'Average': return 'bg-yellow-400/20 text-yellow-300';
            case 'Poor': return 'bg-red-400/20 text-red-300';
            default: return 'bg-gray-400/20 text-gray-300';
        }
    };
    const styles = getStyles(rating);
    return (
        <div className={`text-center p-4 rounded-xl ${styles.split(' ')[0]}`}>
            <p className={`font-bold text-lg ${styles.split(' ')[1]}`}>{rating}</p>
            <p className="text-xs font-semibold text-white/70">{label}</p>
        </div>
    );
};

const RetentionHeatmap = ({ timeline }: { timeline: RetentionAnalysisData['retentionTimeline'] }) => {
    const getColor = (risk: 'Low' | 'Medium' | 'High') => {
        switch(risk) {
            case 'Low': return 'bg-green-500';
            case 'Medium': return 'bg-yellow-400';
            case 'High': return 'bg-red-500';
        }
    };

    return (
        <div className="w-full flex h-8 rounded-lg overflow-hidden bg-black/20">
            {timeline.map((segment, index) => (
                <div key={index} className="group relative flex-1 h-full" title={`Risk: ${segment.retentionRisk}`}>
                    <div className={`w-full h-full transition-colors ${getColor(segment.retentionRisk)}`}></div>
                    <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 p-2 text-xs text-white bg-gray-900 rounded-md shadow-lg w-48 text-center">
                        <p className="font-bold">{segment.timestamp}</p>
                        <p>{segment.dropOffCause}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

interface RetentionAnalyzerProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

export const RetentionAnalyzer = ({ onBack, t, language }: RetentionAnalyzerProps) => {
  const [script, setScript] = useState('');
  const [targetAudience, setTargetAudience] = useState<AudiencePersona>('General Audience');
  const [competitorUrl1, setCompetitorUrl1] = useState('');
  const [competitorUrl2, setCompetitorUrl2] = useState('');
  const [result, setResult] = useState<RetentionAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!script.trim()) {
      setError('Please paste your video script to be analyzed.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const competitorUrls = [competitorUrl1, competitorUrl2].filter(url => url.trim() !== '');

    try {
      const auditResult = await runRetentionAnalysis(script, targetAudience, language, competitorUrls);
      setResult(auditResult);
    } catch(e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setScript('');
    setResult(null);
    setError(null);
    setIsLoading(false);
    setTargetAudience('General Audience');
    setCompetitorUrl1('');
    setCompetitorUrl2('');
  };

  const getRiskColorClass = (risk: 'Low' | 'Medium' | 'High', type: 'border' | 'text' = 'border') => {
      const colors = {
        Low: { border: 'border-green-400', text: 'text-green-400' },
        Medium: { border: 'border-yellow-400', text: 'text-yellow-400' },
        High: { border: 'border-red-400', text: 'text-red-400' },
      };
      return colors[risk][type];
  }

  const handleDownloadReport = () => {
    if (!result) return;
    generateRetentionAnalysisPdf(result);
  };

  const renderResult = () => {
    if (!result) return null;
    return (
        <div className="space-y-6 mt-6 animate-fade-in-up">
            <ResultCard title="Performance Summary" icon={SparklesIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <PerformanceBadge rating={result.performanceSummary.hookRetention} label="Hook Retention (0-15s)" />
                        <PerformanceBadge rating={result.performanceSummary.midWatchRetention} label="Mid-Watch Retention" />
                        <PerformanceBadge rating={result.performanceSummary.finalCtaRetention} label="Final CTA Retention" />
                    </div>
                    <div className="text-center md:text-left">
                        <p className="font-bold text-lg text-white/90">Overall Predicted Score: <span className="text-2xl text-pink-300">{result.retentionPredictionScore}/100</span></p>
                        <p className="text-white/80">{result.overallSummary}</p>
                    </div>
                </div>
            </ResultCard>

            <ResultCard title="Attention Curve Insights" icon={ArrowTrendingUpIcon}>
                <AttentionCurveChart data={result.attentionCurve.points} chartId="main-chart" />
                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/90">{result.attentionCurve.summary}</p>
                </div>
            </ResultCard>

            <ResultCard title="Drop-Off Cause Detection" icon={ClockIcon}>
                <RetentionHeatmap timeline={result.retentionTimeline} />
                 <div className="space-y-4 mt-4">
                    {result.retentionTimeline.map((item, i) => (
                        <div key={i} className={`p-4 rounded-lg bg-black/20 border-l-4 ${getRiskColorClass(item.retentionRisk)}`}>
                            <p className={`font-bold ${getRiskColorClass(item.retentionRisk, 'text')}`}>{item.timestamp} - {item.retentionRisk} Risk</p>
                            <p className="text-sm text-white/90 mt-1"><strong>Likely Cause:</strong> {item.dropOffCause}</p>
                            <p className="text-sm text-white/70 italic my-1">"{item.segmentText}"</p>
                        </div>
                    ))}
                 </div>
            </ResultCard>

            <ResultCard title="Retention Boost Tips" icon={LightBulbIcon}>
                 <div className="space-y-4">
                    {result.retentionBoostTips.map((tip, i) => (
                        <div key={i} className="p-4 bg-black/20 rounded-lg">
                            <p className="font-semibold text-white/90">For segment: <span className="text-pink-200">{tip.timestamp}</span></p>
                            <p className="text-purple-300 mt-1">💡 {tip.suggestion}</p>
                            <p className="text-xs text-white/70 italic mt-1">{tip.reason}</p>
                        </div>
                    ))}
                 </div>
            </ResultCard>
            
            {result.competitorAnalysis && result.competitorAnalysis.length > 0 && (
                <ResultCard title="Competitor Comparison" icon={UserGroupIcon}>
                     <div className="space-y-4">
                        {result.competitorAnalysis.map((comp, i) => (
                            <div key={i} className="p-4 bg-black/20 rounded-lg">
                                <h4 className="font-bold text-white truncate">{comp.videoUrl}</h4>
                                <div className="mt-2 space-y-2 text-sm">
                                    <p><strong>Intro:</strong> <span className="text-white/80">{comp.comparison.intro}</span></p>
                                    <p><strong>Mid-roll:</strong> <span className="text-white/80">{comp.comparison.mid}</span></p>
                                    <p><strong>Outro:</strong> <span className="text-white/80">{comp.comparison.end}</span></p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <h5 className="font-semibold text-pink-200 mb-1">Structural Suggestions:</h5>
                                    <ul className="list-disc list-inside text-sm text-white/80">
                                        {comp.structuralSuggestions.map((s, si) => <li key={si}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                     </div>
                </ResultCard>
            )}

            <div className="flex gap-4 mt-6">
                <button
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                    Analyze Another Script
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
                <p className="mt-4 text-white/80 font-semibold">Performing advanced retention analysis...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Advanced Video Retention Analysis</h2>
            <p className="text-white/80 mb-6">Paste your script to find boring parts before you film. Boost your viewer retention proactively.</p>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-white/90 mb-2">Target Audience Persona</label>
                    <div className="relative">
                        <select
                          id="targetAudience"
                          value={targetAudience}
                          onChange={e => setTargetAudience(e.target.value as AudiencePersona)}
                          className="w-full appearance-none bg-white/10 border border-white/30 rounded-lg px-4 py-2 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                        >
                            <option>General Audience</option>
                            <option>Beginners</option>
                            <option>Professionals</option>
                            <option>Creators</option>
                            <option>Gen Z</option>
                            <option>Millennials</option>
                        </select>
                        <ChevronUpDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="script" className="block text-sm font-medium text-white/90 mb-2">Video Script</label>
                    <textarea 
                      id="script"
                      rows={10}
                      value={script}
                      onChange={e => setScript(e.target.value)}
                      placeholder="Paste your full video script here for analysis..."
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Competitor Video URLs (Optional)</label>
                    <div className="space-y-2">
                         <input type="url" value={competitorUrl1} onChange={e => setCompetitorUrl1(e.target.value)} placeholder="https://youtube.com/watch?v=competitor1" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                         <input type="url" value={competitorUrl2} onChange={e => setCompetitorUrl2(e.target.value)} placeholder="https://youtube.com/watch?v=competitor2" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                </div>
            </div>

            {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

            <div className="mt-8 text-right">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !script}
                    className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Analyze Retention
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
