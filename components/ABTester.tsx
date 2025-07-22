

import React, { useState } from 'react';
import { runABTestAudit } from '../services/geminiService';
import { generateABTestPdf } from '../services/pdfService';
import type { ABTestData, ABTestOptionAnalysis } from '../types';
import { ChevronLeftIcon, UploadIcon, ScaleIcon, CheckCircleIcon, LightBulbIcon, SparklesIcon, EyeIcon, ArrowTrendingUpIcon, UserGroupIcon, ArrowDownTrayIcon } from './icons';
import type { Language } from '../services/localization';

const OptionInput = ({
    optionLabel,
    title,
    onTitleChange,
    imageBase64,
    onFileChange,
    isLoading
}: {
    optionLabel: string;
    title: string;
    onTitleChange: (value: string) => void;
    imageBase64: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
}) => (
    <div className="flex-1 min-w-[280px] w-full">
        <h3 className="text-xl font-bold text-white mb-4">Option {optionLabel}</h3>
        <div className="space-y-4">
            <div>
                <label htmlFor={`videoTitle${optionLabel}`} className="block text-sm font-medium text-white/90 mb-2">Video Title</label>
                <input 
                  id={`videoTitle${optionLabel}`}
                  type="text"
                  value={title}
                  onChange={e => onTitleChange(e.target.value)}
                  placeholder={`Title for Option ${optionLabel}`}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  disabled={isLoading}
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Thumbnail Image</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/40 px-6 py-10 bg-white/5 hover:border-white/60 transition relative">
                  {imageBase64 ? (
                      <div className="relative group">
                          <img src={imageBase64} alt={`Thumbnail preview ${optionLabel}`} className="max-h-36 rounded-md mx-auto" />
                          <label htmlFor={`file-upload-${optionLabel}`} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold rounded-md">
                              Change Image
                          </label>
                      </div>
                  ) : (
                      <div className="text-center">
                      <UploadIcon className="mx-auto h-10 w-10 text-white/50" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-white/80 justify-center">
                        <label
                          htmlFor={`file-upload-${optionLabel}`}
                          className="relative cursor-pointer rounded-md font-semibold text-pink-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-pink-200"
                        >
                          <span>Upload a file</span>
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-white/60">PNG, JPG up to 4MB</p>
                    </div>
                  )}
                   <input id={`file-upload-${optionLabel}`} name={`file-upload-${optionLabel}`} type="file" className="sr-only" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" disabled={isLoading}/>
                </div>
              </div>
        </div>
    </div>
);

const CTRMeter = ({ percentage }: { percentage: number }) => {
    const getColor = (p: number) => {
        if (p < 3) return 'bg-red-500';
        if (p < 7) return 'bg-yellow-400';
        return 'bg-green-500';
    };
    // Cap visual representation at 12% CTR for better differentiation at lower, more common values.
    const barWidth = Math.min((percentage / 12) * 100, 100);

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className={`font-bold text-lg ${getColor(percentage).replace('bg','text')}`}>{percentage.toFixed(1)}%</span>
                <span className="text-xs text-white/70">Predicted CTR</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
                <div className={`${getColor(percentage)} h-2.5 rounded-full`} style={{ width: `${barWidth}%`, transition: 'width 0.5s ease-out' }}></div>
            </div>
        </div>
    )
};


const OptionResult = ({ option, title, image, optionData, isWinner }: {
    option: 'A' | 'B';
    title: string;
    image: string;
    optionData: ABTestOptionAnalysis;
    isWinner: boolean;
}) => (
    <div className={`flex-1 min-w-[280px] w-full bg-black/20 p-6 rounded-2xl border-2 ${isWinner ? 'border-green-400' : 'border-transparent'}`}>
         <h3 className={`text-2xl font-bold ${isWinner ? 'text-green-300' : 'text-white'}`}>Option {option} {isWinner && '(Predicted Winner)'}</h3>
         <div className="relative my-4">
             <img src={image} alt={`Thumbnail ${option}`} className="w-full aspect-video object-cover rounded-lg" />
             <img src={`data:image/png;base64,${optionData.attentionHeatmap}`} alt="Attention Heatmap" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
         </div>
         <p className="font-semibold italic text-white/90">"{title}"</p>

         <div className="my-6">
            <CTRMeter percentage={optionData.ctrPrediction.percentage} />
         </div>
         
         <div className="space-y-4">
             <div>
                <h4 className="font-bold text-pink-200 text-sm">Psychological Triggers</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {optionData.psychologicalTriggers.map((t, i) => <span key={i} className="text-xs bg-gray-700/50 px-2 py-1 rounded-full">{t}</span>)}
                </div>
            </div>
             <div>
                <h4 className="font-bold text-pink-200 text-sm">Audience Fit Score</h4>
                <p className="text-lg font-bold">{optionData.audienceFitScore} / 100</p>
            </div>
             <div>
                <h4 className="font-bold text-pink-200 text-sm">Suggested Title Variations</h4>
                <ul className="list-disc list-inside text-sm text-white/80 mt-1">
                    <li>{optionData.titleSuggestions.shortVersion}</li>
                    <li>{optionData.titleSuggestions.longVersion}</li>
                </ul>
            </div>
         </div>
    </div>
);

const ABTestResult = ({ result, inputs, onReset, onDownload, t }: {
    result: ABTestData;
    inputs: { titleA: string; imageA: string; titleB: string; imageB: string };
    onReset: () => void;
    onDownload: () => void;
    t: (key: string) => string;
}) => (
    <div className="space-y-6 mt-6 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-2">A/B Test Results</h2>
            <p className="text-white/80">{result.overallReasoning}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <OptionResult option="A" title={inputs.titleA} image={inputs.imageA} optionData={result.optionA} isWinner={result.winner === 'A'}/>
            <OptionResult option="B" title={inputs.titleB} image={inputs.imageB} optionData={result.optionB} isWinner={result.winner === 'B'}/>
        </div>
        
        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
             <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><LightBulbIcon className="w-6 h-6 text-pink-300"/> Viral Video References</h3>
             <div className="space-y-3">
                 {result.viralVideoReferences.map((ref, i) => (
                    <div key={i} className="bg-black/20 p-3 rounded-lg">
                        <p className="font-semibold text-white/90">{ref.title} <span className="font-normal text-purple-300">({ref.stats})</span></p>
                        <p className="text-sm text-white/70 italic mt-1">{ref.reasonForRelevance}</p>
                    </div>
                 ))}
             </div>
        </div>

        <div className="flex gap-4 mt-4">
            <button
                onClick={onReset}
                className="flex-1 flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
                {t('tool.analyzeAnother')}
            </button>
             <button
                onClick={onDownload}
                className="flex-1 flex items-center justify-center gap-2 text-white bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download PDF Report
            </button>
        </div>
    </div>
);

interface ABTesterProps {
    onBack: () => void;
    t: (key: string) => string;
    language: Language;
}

const ABTester = ({ onBack, t, language }: ABTesterProps) => {
    // Input state
    const [titleA, setTitleA] = useState('');
    const [imageFileA, setImageFileA] = useState<File | null>(null);
    const [imageBase64A, setImageBase64A] = useState<string | null>(null);

    const [titleB, setTitleB] = useState('');
    const [imageFileB, setImageFileB] = useState<File | null>(null);
    const [imageBase64B, setImageBase64B] = useState<string | null>(null);
    
    const [targetAudience, setTargetAudience] = useState('');

    // API state
    const [result, setResult] = useState<ABTestData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (setterFile: React.Dispatch<React.SetStateAction<File | null>>, setterBase64: React.Dispatch<React.SetStateAction<string | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                setError("Image size should not exceed 4MB.");
                return;
            }
            setterFile(file);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setterBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async () => {
        if (!titleA || !imageBase64A || !imageFileA || !titleB || !imageBase64B || !imageFileB || !targetAudience) {
            setError('Please provide titles, thumbnails, and a target audience for both options.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const auditResult = await runABTestAudit(titleA, imageBase64A, imageFileA.type, titleB, imageBase64B, imageFileB.type, targetAudience, language);
            setResult(auditResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setTitleA(''); setImageFileA(null); setImageBase64A(null);
        setTitleB(''); setImageFileB(null); setImageBase64B(null);
        setTargetAudience('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    }
    
    const handleDownload = () => {
        if (!result || !imageBase64A || !imageBase64B) return;
        generateABTestPdf(result, imageBase64A, imageBase64B);
    }

    if (isLoading) {
        return (
          <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up flex flex-col items-center justify-center p-8 bg-white/10 rounded-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
              <p className="mt-4 text-white/80 font-semibold">Running advanced A/B test...</p>
          </div>
        )
    }
    
    if(result && imageBase64A && imageBase64B) {
        return <ABTestResult result={result} inputs={{ titleA, imageA: imageBase64A, titleB, imageB: imageBase64B }} onReset={resetForm} onDownload={handleDownload} t={t} />
    }

    return (
        <div className="w-full max-w-6xl mx-auto my-8 animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-semibold transition-colors">
                <ChevronLeftIcon className="w-5 h-5" />
                {t('backToFeatures')}
            </button>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">A/B Title & Thumbnail Tester</h2>
                <p className="text-white/80 mb-6">Compare two combinations to see which will perform better and why.</p>
                
                 <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <OptionInput optionLabel="A" title={titleA} onTitleChange={setTitleA} imageBase64={imageBase64A} onFileChange={handleFileChange(setImageFileA, setImageBase64A)} isLoading={isLoading} />
                    <div className="w-full md:w-px bg-white/20 my-4 md:my-0"></div>
                    <OptionInput optionLabel="B" title={titleB} onTitleChange={setTitleB} imageBase64={imageBase64B} onFileChange={handleFileChange(setImageFileB, setImageBase64B)} isLoading={isLoading} />
                 </div>
                 
                 <div className="pt-6 border-t border-white/20">
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2"><UserGroupIcon className="w-5 h-5" /> Target Audience</label>
                    <input 
                      id="targetAudience"
                      type="text"
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      placeholder="e.g., 'Gamers aged 18-25 interested in RPGs'"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      disabled={isLoading}
                    />
                 </div>

                {error && <div className="mt-4 text-center bg-red-500/50 text-white font-semibold p-3 rounded-lg">{error}</div>}

                <div className="mt-8 text-right">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !titleA || !imageBase64A || !titleB || !imageBase64B || !targetAudience}
                        className="flex items-center justify-center bg-[#7b2ff7] text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-[#7b2ff7] disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                        <ScaleIcon className="w-5 h-5 mr-2" />
                        Run A/B Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ABTester;