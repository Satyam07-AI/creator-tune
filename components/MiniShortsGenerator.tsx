
import React, { useState } from 'react';
import { runMiniShortsGenerator } from '../services/geminiService';
import { generateMiniShortsPdf } from '../services/pdfService';
import type { MiniShortsData, MiniShortsGeneratorOptions } from '../types';
import type { Language } from '../services/localization';
import {
    ChevronLeftIcon, FilmIcon, SparklesIcon, LightBulbIcon, CalendarDaysIcon, ClockIcon, ArrowDownTrayIcon, UserGroupIcon, PaintBrushIcon, ClipboardDocumentListIcon, ChatBubbleOvalLeftEllipsisIcon
} from './icons';

interface MiniShortsGeneratorProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const ResultCard = ({ title, icon: Icon, children, className }: { title: string; icon?: React.FC<{className?:string}>; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col ${className}`}>
      {title && 
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            {Icon && <Icon className="w-6 h-6 mr-3 text-pink-300" />}
            {title}
        </h3>
      }
      <div className="flex-grow">{children}</div>
    </div>
);

const MiniShortsGenerator = ({ onBack, t, language }: MiniShortsGeneratorProps) => {
    const [options, setOptions] = useState<MiniShortsGeneratorOptions>({
        channelUrl: '',
        generateCaption: true,
        captionLanguage: 'English',
        generateVoiceover: false,
        voiceoverLanguage: 'English',
        voiceoverTone: 'Excited',
        applyTheme: true,
        themeVibe: 'Trendy',
        autoHighlights: true,
        addCta: true,
        socialHandle: '',
        suggestSchedule: true,
        exportRatio: '9:16',
        includeWatermark: true,
    });
    
    const [result, setResult] = useState<MiniShortsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOptionChange = (field: keyof MiniShortsGeneratorOptions, value: any) => {
        setOptions(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!options.channelUrl.trim()) {
            setError('Please provide a YouTube channel or video URL.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const auditResult = await runMiniShortsGenerator(options, language);
            setResult(auditResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadReport = () => {
        if (!result) return;
        generateMiniShortsPdf(result, options.channelUrl);
    };

    const resetForm = () => {
        setResult(null);
        setError(null);
        setIsLoading(false);
    };

    const renderResult = () => {
        if (!result) return null;
        return (
             <div className="space-y-6 mt-6 animate-fade-in-up">
                <ResultCard title="🚀 Core Channel Hook">
                    <p className="text-xl italic text-purple-200">"{result.channelHook}"</p>
                </ResultCard>

                {result.dynamicCaption && (
                    <ResultCard title="✍️ Dynamic Caption" icon={ChatBubbleOvalLeftEllipsisIcon}>
                        <p className="text-white/90 whitespace-pre-wrap">{result.dynamicCaption.text}</p>
                        <p className="text-sm text-pink-300 mt-2">{result.dynamicCaption.hashtags.join(' ')}</p>
                    </ResultCard>
                )}

                {result.aiVoiceover && (
                     <ResultCard title="🎙️ AI Voiceover" icon={SparklesIcon}>
                        <p className="text-sm text-white/70"><strong>Language:</strong> {result.aiVoiceover.language}, <strong>Tone:</strong> {result.aiVoiceover.tone}</p>
                        <p className="text-sm text-white/70"><strong>Instructions:</strong> {result.aiVoiceover.instructions}</p>
                        <p className="mt-2 p-3 bg-black/20 rounded-lg text-white/90 italic">"{result.aiVoiceover.script}"</p>
                    </ResultCard>
                )}
                
                {result.themeTemplate && (
                     <ResultCard title="🎨 Theme Template" icon={PaintBrushIcon}>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><strong>Vibe:</strong> <span className="text-white/80">{result.themeTemplate.vibe}</span></div>
                            <div><strong>Font:</strong> <span className="text-white/80">{result.themeTemplate.fontSuggestion}</span></div>
                            <div><strong>Transitions:</strong> <span className="text-white/80">{result.themeTemplate.transitionStyle}</span></div>
                            <div className="flex items-center gap-2"><strong>Colors:</strong> 
                                {result.themeTemplate.colorPalette.map(c => <div key={c} className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: c}}></div>)}
                            </div>
                         </div>
                    </ResultCard>
                )}

                 {result.autoHighlights && (
                     <ResultCard title="✂️ Auto-Reel Highlights" icon={ClipboardDocumentListIcon}>
                         <p><strong>Source:</strong> <span className="text-white/80">{result.autoHighlights.suggestedSource}</span></p>
                         <p><strong>Segment:</strong> <span className="text-white/80">{result.autoHighlights.segmentDescription}</span></p>
                         <p><strong>Edits:</strong> <span className="text-white/80">{result.autoHighlights.editSuggestions.join(', ')}</span></p>
                    </ResultCard>
                )}

                {result.autoSchedule && (
                     <ResultCard title="🗓️ Auto-Schedule Suggestion" icon={CalendarDaysIcon}>
                        <p><strong>Post Time:</strong> <span className="text-white/80">{result.autoSchedule.postTime}</span></p>
                        <p><strong>Description:</strong> <span className="text-white/80">{result.autoSchedule.description}</span></p>
                        <p className="text-sm text-pink-300 mt-2">{result.autoSchedule.hashtags.join(' ')}</p>
                    </ResultCard>
                )}

                <div className="flex gap-4 mt-6">
                    <button onClick={resetForm} className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors">
                        Generate Another
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
                    <p className="mt-4 text-white/80 font-semibold">Generating your viral shorts package...</p>
                </div>
            );
        }

        const Toggle = ({ field, label }: { field: keyof MiniShortsGeneratorOptions, label: string }) => (
            <label htmlFor={field} className="flex items-center justify-between cursor-pointer">
                <span className="text-white/90">{label}</span>
                <div className="relative">
                    <input type="checkbox" id={field} className="sr-only" checked={!!options[field]} onChange={e => handleOptionChange(field, e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition ${options[field] ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${options[field] ? 'translate-x-4' : ''}`}></div>
                </div>
            </label>
        );
        
        return (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">Mini Shorts Generator</h2>
                <p className="text-white/80 mb-6">Generate viral short-form videos from a YouTube channel with powerful AI modules.</p>

                <div className="space-y-6">
                    {/* Core Input */}
                    <div>
                        <label htmlFor="channelUrl" className="block text-sm font-medium text-white/90 mb-2">YouTube Channel or Video URL</label>
                        <input id="channelUrl" type="text" value={options.channelUrl} onChange={e => handleOptionChange('channelUrl', e.target.value)} placeholder="e.g., https://www.youtube.com/c/MKBHD" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>

                    {/* Modules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                            <Toggle field="generateCaption" label="Dynamic Captions" />
                            {options.generateCaption && (
                                <select value={options.captionLanguage} onChange={e => handleOptionChange('captionLanguage', e.target.value)} className="w-full bg-white/10 border-white/30 rounded-md p-2 text-sm">
                                    <option value="English">English</option>
                                    <option value="Hinglish">Hinglish</option>
                                </select>
                            )}
                            <hr className="border-white/10"/>
                             <Toggle field="generateVoiceover" label="AI Voiceover" />
                             {options.generateVoiceover && (
                                <>
                                    <select value={options.voiceoverLanguage} onChange={e => handleOptionChange('voiceoverLanguage', e.target.value)} className="w-full bg-white/10 border-white/30 rounded-md p-2 text-sm">
                                        <option value="English">English VO</option>
                                        <option value="Hinglish">Hinglish VO</option>
                                        <option value="Hindi">Hindi VO</option>
                                    </select>
                                    <select value={options.voiceoverTone} onChange={e => handleOptionChange('voiceoverTone', e.target.value)} className="w-full bg-white/10 border-white/30 rounded-md p-2 text-sm">
                                        <option>Excited</option>
                                        <option>Chill</option>
                                        <option>Premium</option>
                                        <option>Youth-friendly</option>
                                    </select>
                                </>
                             )}
                             <hr className="border-white/10"/>
                             <Toggle field="autoHighlights" label="Auto-Reel Highlights" />
                             <Toggle field="suggestSchedule" label="Auto-Schedule Suggestion" />
                        </div>
                        {/* Column 2 */}
                        <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                             <Toggle field="applyTheme" label="Theme-Based Template" />
                            {options.applyTheme && (
                                 <select value={options.themeVibe} onChange={e => handleOptionChange('themeVibe', e.target.value)} className="w-full bg-white/10 border-white/30 rounded-md p-2 text-sm">
                                    <option>🔥 Trendy</option>
                                    <option>🧠 Educational</option>
                                    <option>💼 Professional</option>
                                 </select>
                            )}
                            <hr className="border-white/10"/>
                            <Toggle field="addCta" label="CTA Add-ons" />
                            {options.addCta && (
                                 <input type="text" value={options.socialHandle} onChange={e => handleOptionChange('socialHandle', e.target.value)} placeholder="IG/Telegram handle (optional)" className="w-full bg-white/10 border-white/30 rounded-md p-2 text-sm" />
                            )}
                             <hr className="border-white/10"/>
                            <div>
                                <label className="block text-sm text-white/90 mb-2">Export Settings</label>
                                <div className="flex gap-2">
                                     <select value={options.exportRatio} onChange={e => handleOptionChange('exportRatio', e.target.value)} className="w-full bg-white/10 border-white/30 rounded-md p-2 text-sm">
                                        <option value="9:16">9:16 (Vertical)</option>
                                        <option value="1:1">1:1 (Square)</option>
                                     </select>
                                     <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.includeWatermark} onChange={e => handleOptionChange('includeWatermark', e.target.checked)} /> Watermark</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

                <div className="mt-8 text-right">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Shorts Package
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

export default MiniShortsGenerator;