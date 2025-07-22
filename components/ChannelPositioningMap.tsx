
import React, { useState } from 'react';
import { runAdvancedPositioningAudit, runPositionShiftSimulation } from '../services/geminiService';
import { generateChannelPositioningPdf } from '../services/pdfService';
import type { AdvancedChannelPositioningData, PositionShiftSimulationData, PositionShiftStyle, QuadrantPosition } from '../types';
import { ChevronLeftIcon, MapIcon, LightBulbIcon, SparklesIcon, CheckCircleIcon, UserGroupIcon, EyeIcon, ClipboardDocumentListIcon, ArrowDownTrayIcon, ChevronUpDownIcon } from './icons';
import type { Language } from '../services/localization';

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon?: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 ${className}`}>
      {title && 
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            {Icon && <Icon className="w-6 h-6 mr-3 text-pink-300" />}
            {title}
        </h3>
      }
      <div className="flex-grow">{children}</div>
    </div>
);

const QuadrantMap = ({ mapData }: { mapData: AdvancedChannelPositioningData['positioningMap'] }) => {
    const { xAxisLabel, yAxisLabel, userPosition, competitors } = mapData;
    const [leftX, rightX] = xAxisLabel.split('<->').map(s => s.trim());
    const [bottomY, topY] = yAxisLabel.split('<->').map(s => s.trim());

    const transformCoord = (pos: QuadrantPosition) => ({
        x: 50 + (pos.x / 100) * 45,
        y: 50 - (pos.y / 100) * 45
    });

    const userCoord = transformCoord(userPosition);
    const competitorCoords = competitors.map(c => ({...c, ...transformCoord(c)}));

    return (
        <div className="relative w-full aspect-square max-w-lg mx-auto bg-black/20 rounded-xl p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Grid lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                {/* Axis Labels */}
                <text x="50" y="99" textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.7)">{rightX}</text>
                <text x="50" y="3" textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.7)">{leftX}</text>
                <text x="3" y="50" dy="1" textAnchor="start" fontSize="3" fill="rgba(255,255,255,0.7)" transform="rotate(-90 3 50)">{bottomY}</text>
                <text x="97" y="50" dy="1" textAnchor="end" fontSize="3" fill="rgba(255,255,255,0.7)" transform="rotate(-90 97 50)">{topY}</text>
                
                {/* Points */}
                {competitorCoords.map((c, i) => (
                    <g key={i}>
                        <circle cx={c.x} cy={c.y} r="1.5" fill="rgba(255,255,255,0.5)" />
                        <text x={c.x} y={c.y + 3.5} textAnchor="middle" fontSize="2" fill="rgba(255,255,255,0.6)">{c.name}</text>
                    </g>
                ))}

                <g>
                    <circle cx={userCoord.x} cy={userCoord.y} r="2" fill="#EC4899" stroke="white" strokeWidth="0.5" />
                     <text x={userCoord.x} y={userCoord.y - 3} textAnchor="middle" fontSize="2.5" fill="#EC4899" fontWeight="bold">You</text>
                </g>
            </svg>
        </div>
    );
};


interface ChannelPositioningMapProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

export const ChannelPositioningMap = ({ onBack, t, language }: ChannelPositioningMapProps) => {
    const [niche, setNiche] = useState('');
    const [tone, setTone] = useState('');
    const [about, setAbout] = useState('');
    const [titles, setTitles] = useState('');
    const [sampleComments, setSampleComments] = useState('');
    const [visualsDescription, setVisualsDescription] = useState('');

    const [result, setResult] = useState<AdvancedChannelPositioningData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!niche || !tone || !about || !titles || !visualsDescription) {
            setError('Please fill out all required fields for an accurate analysis.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const auditResult = await runAdvancedPositioningAudit(niche, tone, about, titles, sampleComments, visualsDescription, language);
            setResult(auditResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadReport = () => {
        if (!result) return;
        generateChannelPositioningPdf(result);
    };

    const resetForm = () => {
        setNiche('');
        setTone('');
        setAbout('');
        setTitles('');
        setSampleComments('');
        setVisualsDescription('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    };
    
    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };


    const renderResult = () => {
        if (!result) return null;
        return (
            <div className="space-y-6 mt-6 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResultCard title="Audience Perception Analysis" icon={UserGroupIcon}>
                        <div className="space-y-3">
                            <div><strong className="text-pink-200">Intended:</strong> <span className="text-white/80">{result.audiencePerception.intended}</span></div>
                            <div><strong className="text-pink-200">Actual:</strong> <span className="text-white/80">{result.audiencePerception.actual}</span></div>
                            <div className="p-3 bg-black/20 rounded-lg"><strong className="text-purple-300">Gap Analysis:</strong> <span className="text-white/80">{result.audiencePerception.gapAnalysis}</span></div>
                        </div>
                    </ResultCard>
                    <ResultCard title="Channel Positioning Map" icon={MapIcon}>
                        <QuadrantMap mapData={result.positioningMap} />
                    </ResultCard>
                </div>
                
                <ResultCard title="Content Gap Opportunities" icon={LightBulbIcon}>
                    <div className="space-y-3">
                        {result.contentGaps.map((gap, i) => (
                            <div key={i} className="p-3 bg-black/20 rounded-lg">
                                <p className="font-bold text-white">{gap.angle}</p>
                                <p className="text-sm text-white/70 mt-1">{gap.reason}</p>
                                <p className="text-sm text-pink-200 italic mt-1">Example: "{gap.exampleTitle}"</p>
                            </div>
                        ))}
                    </div>
                </ResultCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <ResultCard title="Brand Archetypes" icon={SparklesIcon}>
                        <div className="space-y-4">
                            {result.brandArchetypes.map((arch, i) => (
                                <div key={i}>
                                    <h4 className="font-bold text-lg text-white">{arch.name}</h4>
                                    <p className="text-sm text-white/80">{arch.description}</p>
                                </div>
                            ))}
                        </div>
                    </ResultCard>
                     <ResultCard title="Visual Differentiation Score" icon={EyeIcon}>
                        <div className="text-center my-auto">
                            <p className={`text-7xl font-bold ${getScoreColor(result.visualDifferentiation.score)}`}>{result.visualDifferentiation.score}<span className="text-4xl text-white/50">/100</span></p>
                            <p className="text-white/80 mt-2">{result.visualDifferentiation.feedback}</p>
                        </div>
                    </ResultCard>
                </div>
                
                <ResultCard title="7-Day Action Plan" icon={ClipboardDocumentListIcon}>
                    <div className="space-y-3">
                        {result.actionPlan.map(item => (
                             <div key={item.day} className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm flex-shrink-0">Day {item.day}</span>
                                <div className="flex-grow">
                                    <p className="font-semibold text-white/90">{item.task}</p>
                                    <p className="text-xs text-white/70 italic">{item.reason}</p>
                                </div>
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
        )
    }

    const renderForm = () => {
        if (result) return null;
        if (isLoading) {
            return (
                <div className="w-full flex flex-col items-center justify-center p-8 bg-white/10 rounded-2xl mt-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    <p className="mt-4 text-white/80 font-semibold">Generating your positioning map...</p>
                </div>
            );
        }

        return (
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">Advanced Channel Positioning Map</h2>
                <p className="text-white/80 mb-6">Define your unique space in the YouTube ecosystem and find content gaps to dominate.</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Channel Niche (e.g., 'DIY Home Automation')" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                        <input value={tone} onChange={e => setTone(e.target.value)} placeholder="Intended Tone (e.g., 'Funny & Educational')" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                    <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Paste your 'About' section here..." rows={3} className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    <textarea value={titles} onChange={e => setTitles(e.target.value)} placeholder="Paste 3-5 of your top video titles..." rows={3} className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    <textarea value={visualsDescription} onChange={e => setVisualsDescription(e.target.value)} placeholder="Describe your thumbnails, colors, fonts..." rows={3} className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    <textarea value={sampleComments} onChange={e => setSampleComments(e.target.value)} placeholder="Paste a few typical audience comments (Optional)..." rows={3} className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                </div>
                {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}
                <div className="mt-8 text-right">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !niche || !tone || !about || !titles || !visualsDescription}
                        className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        <MapIcon className="w-5 h-5 mr-2" />
                        Generate Positioning Report
                    </button>
                </div>
            </div>
        )
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
