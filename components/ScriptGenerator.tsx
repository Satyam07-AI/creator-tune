

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { runAdvancedScriptGeneration, runScriptRewrite } from '../services/geminiService';
import type { AdvancedScriptData, RewrittenOptions, ScriptSection, ScriptTone, PlatformFormat, ScriptEmotion } from '../types';
import { ChevronLeftIcon, ClipboardDocumentListIcon, SparklesIcon, ArrowTrendingUpIcon, LightBulbIcon, ClockIcon, XIcon, ArrowDownTrayIcon, ChevronUpDownIcon } from './icons';
import type { Language } from '../services/localization';

const emotionStyles: Record<ScriptEmotion, { icon: string; color: string; }> = {
    'Humor': { icon: '😂', color: 'border-yellow-400' },
    'Tension': { icon: '😨', color: 'border-red-400' },
    'Inspiration': { icon: '💡', color: 'border-purple-400' },
    'Excitement': { icon: '🎉', color: 'border-pink-400' },
    'Sadness': { icon: '😢', color: 'border-blue-400' },
    'Curiosity': { icon: '🤔', color: 'border-green-400' },
    'Neutral': { icon: '😐', color: 'border-gray-500' },
};

const RewriteModal = ({
    isOpen,
    onClose,
    isLoading,
    options,
    onApply,
}: {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    options: RewrittenOptions | null;
    onApply: (newText: string) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 border border-purple-500 rounded-2xl p-6 shadow-2xl max-w-lg w-full mx-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Rewrite Options</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : options ? (
                    <div className="space-y-4">
                        {(Object.keys(options) as (keyof RewrittenOptions)[]).map(key => (
                            <div key={key} className="bg-gray-900/50 p-4 rounded-lg">
                                <p className="font-semibold text-purple-300 capitalize">{key.replace('_', ' ')}</p>
                                <p className="text-white/90 mt-1">"{options[key]}"</p>
                                <button onClick={() => onApply(options[key])} className="text-sm bg-white/10 hover:bg-white/20 text-white font-semibold py-1 px-3 rounded-md transition-colors mt-2">
                                    Use this version
                                </button>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-white/70">No options available.</p>}
            </div>
        </div>
    );
};

interface ScriptGeneratorProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const ScriptGenerator = ({ onBack, t, language }: ScriptGeneratorProps) => {
    const [topic, setTopic] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState<ScriptTone>('Casual & Witty');
    const [platform, setPlatform] = useState<PlatformFormat>('YouTube Long-form');
    
    const [result, setResult] = useState<AdvancedScriptData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Rewrite state
    const [isRewriteModalOpen, setIsRewriteModalOpen] = useState(false);
    const [rewriteLoading, setRewriteLoading] = useState(false);
    const [rewriteOptions, setRewriteOptions] = useState<RewrittenOptions | null>(null);
    const [rewriteTarget, setRewriteTarget] = useState<{ text: string; sectionIndex: number } | null>(null);
    const [rewriteButtonPos, setRewriteButtonPos] = useState<{ top: number, left: number } | null>(null);
    const scriptContainerRef = useRef<HTMLDivElement>(null);


    const handleSubmit = async () => {
        if (!topic.trim() || !audience.trim()) {
            setError('Please provide both a video topic and a target audience.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const auditResult = await runAdvancedScriptGeneration(topic, audience, tone, platform, language);
            setResult(auditResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;
        
        let content = `Advanced Script Report for Topic: ${topic}\n`;
        content += '============================================\n\n';
        
        result.script_sections.forEach(section => {
            content += `## ${section.section_title} (Emotion: ${section.emotion}) ##\n`;
            content += `${section.text}\n\n`;
            if (section.pacing_feedback) {
                content += `Pacing Tip: ${section.pacing_feedback}\n\n`;
            }
            if (section.viral_trigger) {
                content += `Viral Trigger: ${section.viral_trigger.technique} - ${section.viral_trigger.reason}\n\n`;
            }
        });

        content += '## Optimized Call to Action ##\n';
        content += `Style: ${result.optimized_cta.style}\n`;
        content += `Placement: ${result.optimized_cta.placement}\n`;
        content += `Text: "${result.optimized_cta.text}"\n\n`;
        
        content += '## Voiceover-Ready Script ##\n';
        content += `${result.voice_over_annotations}\n`;

        downloadAsText(content, 'creator_tune_script.txt');
    };
    
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>, sectionIndex: number) => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 5) {
            const selectedText = selection.toString().trim();
            setRewriteTarget({ text: selectedText, sectionIndex });

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = scriptContainerRef.current?.getBoundingClientRect();

            if (containerRect) {
                setRewriteButtonPos({
                    top: rect.top - containerRect.top + window.scrollY,
                    left: rect.right - containerRect.left + 10,
                });
            }
        } else {
            setRewriteButtonPos(null);
        }
    };

    const handleRewriteClick = async () => {
        if (!rewriteTarget) return;

        setRewriteLoading(true);
        setRewriteOptions(null);
        setIsRewriteModalOpen(true);
        setRewriteButtonPos(null);

        try {
            const options = await runScriptRewrite(rewriteTarget.text, tone, language);
            setRewriteOptions(options);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to rewrite text.');
            setIsRewriteModalOpen(false);
        } finally {
            setRewriteLoading(false);
        }
    };
    
    const handleApplyRewrite = (newText: string) => {
        if (!result || rewriteTarget === null) return;

        const newSections = [...result.script_sections];
        const targetSection = newSections[rewriteTarget.sectionIndex];
        
        // Ensure the replacement is safe and handles potential regex issues
        const replacedText = targetSection.text.replace(rewriteTarget.text, newText);
        newSections[rewriteTarget.sectionIndex] = { ...targetSection, text: replacedText };
        
        // Also update the voiceover annotations
        const newVoiceOverText = result.voice_over_annotations.replace(rewriteTarget.text, newText);

        setResult({ ...result, script_sections: newSections, voice_over_annotations: newVoiceOverText });

        setIsRewriteModalOpen(false);
        setRewriteTarget(null);
    };


    const resetForm = () => {
        setTopic('');
        setAudience('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = () => setRewriteButtonPos(null);
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderResult = () => {
        if (!result) return null;
        return (
            <div className="space-y-6 mt-6 animate-fade-in-up">
                <div ref={scriptContainerRef} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 space-y-8">
                    {result.script_sections.map((section, index) => (
                        <div key={index} className="space-y-3" onMouseUp={(e) => handleMouseUp(e, index)}>
                            <div className={`flex items-center gap-3 border-l-4 pl-3 ${emotionStyles[section.emotion].color}`}>
                                <span className="text-2xl">{emotionStyles[section.emotion].icon}</span>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{section.section_title}</h4>
                                    <p className="text-sm text-white/70 font-semibold">{section.emotion}</p>
                                </div>
                            </div>
                            
                            <p className="text-white/90 whitespace-pre-wrap leading-relaxed pl-12 selection:bg-purple-500/50">{section.text}</p>
                            
                            {section.pacing_feedback && (
                                <div className="pl-12 flex items-start gap-2 text-sm text-yellow-300/80">
                                    <ArrowTrendingUpIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span><strong>Pacing Tip:</strong> {section.pacing_feedback}</span>
                                </div>
                            )}

                             {section.viral_trigger && (
                                <div className="pl-12 flex items-start gap-2 text-sm text-pink-300/90 bg-black/20 p-3 rounded-lg ml-10">
                                    <LightBulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <strong>Viral Trigger:</strong> {section.viral_trigger.technique}
                                        <p className="text-xs text-white/70 italic mt-1">{section.viral_trigger.reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {rewriteButtonPos && (
                        <button 
                          onClick={handleRewriteClick}
                          onMouseDown={(e) => e.stopPropagation()} // Prevent document listener from hiding it
                          className="absolute flex items-center gap-2 bg-purple-600 text-white font-bold px-3 py-1.5 rounded-full text-sm shadow-lg hover:scale-105 transition-transform"
                          style={{ top: `${rewriteButtonPos.top}px`, left: `${rewriteButtonPos.left}px` }}
                        >
                          <SparklesIcon className="w-4 h-4" /> Rewrite
                        </button>
                    )}
                </div>

                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                     <h3 className="text-xl font-bold text-white mb-3">🚀 Optimized Call to Action</h3>
                     <p><strong>Style:</strong> {result.optimized_cta.style}</p>
                     <p><strong>Placement:</strong> {result.optimized_cta.placement}</p>
                     <p className="mt-2 text-purple-300 italic">"{result.optimized_cta.text}"</p>
                </div>
                 <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                     <h3 className="text-xl font-bold text-white mb-3">🎙️ Voiceover-Ready Script</h3>
                     <p className="text-sm text-white/70 mb-3">A version of your script with annotations for easy recording.</p>
                     <button
                        onClick={() => navigator.clipboard.writeText(result.voice_over_annotations)}
                        className="w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                     >
                        Copy to Clipboard
                     </button>
                </div>

                 <div className="flex gap-4 mt-4">
                    <button onClick={resetForm} className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors">
                        Generate Another Script
                    </button>
                     <button
                        onClick={handleDownloadReport}
                        className="flex-1 flex items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download Script (.txt)
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
                    <p className="mt-4 text-white/80 font-semibold">Writing your advanced script...</p>
                </div>
            );
        }

        return (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 shadow-lg border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">Advanced Script Generator</h2>
                <p className="text-white/80 mb-6">Get a complete script with emotional analysis, viral triggers, and a powerful CTA.</p>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-white/90 mb-2">Video Topic</label>
                        <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'How to make the perfect sourdough bread'" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                    <div>
                        <label htmlFor="audience" className="block text-sm font-medium text-white/90 mb-2">Target Audience</label>
                        <input id="audience" type="text" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., 'Beginner bakers in their 20s and 30s'" className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/80 transition" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label htmlFor="tone" className="block text-sm font-medium text-white/90 mb-2">Script Tone</label>
                             <div className="relative">
                                 <select id="tone" value={tone} onChange={e => setTone(e.target.value as ScriptTone)} className="w-full appearance-none bg-white/10 border border-white/30 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-white/80 transition">
                                    <option>Casual & Witty</option>
                                    <option>Professional</option>
                                    <option>Gen Z</option>
                                    <option>Kid-Friendly</option>
                                    <option>Storyteller</option>
                                 </select>
                                 <ChevronUpDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                             </div>
                        </div>
                        <div>
                             <label htmlFor="platform" className="block text-sm font-medium text-white/90 mb-2">Platform Format</label>
                             <div className="relative">
                                 <select id="platform" value={platform} onChange={e => setPlatform(e.target.value as PlatformFormat)} className="w-full appearance-none bg-white/10 border border-white/30 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-white/80 transition">
                                    <option>YouTube Long-form</option>
                                    <option>YouTube Short / Reel</option>
                                 </select>
                                 <ChevronUpDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                             </div>
                        </div>
                    </div>
                </div>

                {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

                <div className="mt-8 text-right">
                    <button onClick={handleSubmit} disabled={isLoading || !topic || !audience} className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Script
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
            <RewriteModal 
                isOpen={isRewriteModalOpen}
                onClose={() => setIsRewriteModalOpen(false)}
                isLoading={rewriteLoading}
                options={rewriteOptions}
                onApply={handleApplyRewrite}
            />
        </div>
    );
};

export default ScriptGenerator;