
import React from 'react';
import { SparklesIcon, LightBulbIcon, UserGroupIcon, CalendarDaysIcon, DocumentTextIcon, ChatBubbleOvalLeftEllipsisIcon, FilmIcon, CameraIcon } from './icons';

interface Feature {
  name: string;
  icon: React.FC<{className?: string}>;
  description: string;
  action: 'optimize' | 'content' | 'audience' | 'calendar' | 'engagement' | 'miniShorts' | 'instagram';
}

const FeatureCard = ({ feature, onUseTool, t }: { feature: Feature; onUseTool: () => void; t: (key: string) => string; }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10 flex flex-col transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
            <div className="flex-grow">
                <feature.icon className="w-8 h-8 text-pink-300 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                <p className="text-white/70 text-base leading-relaxed">{feature.description}</p>
            </div>
            <div className="mt-6">
                <button
                    onClick={onUseTool}
                    className="w-full text-center bg-white/10 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    {t('useTool')}
                </button>
            </div>
        </div>
    );
};

const homepageFeatures: Feature[] = [
    {
        name: 'Mini Shorts Generator',
        icon: FilmIcon,
        action: 'miniShorts',
        description: "Generate viral short-form videos from a channel's content with modular upgrades like AI voiceovers and captions.",
    },
    {
        name: 'Freemium Instagram Downloader',
        icon: CameraIcon,
        action: 'instagram',
        description: "Get a competitive edge by analyzing any public Instagram profile's content strategy, top posts, and engagement.",
    },
    {
        name: 'Strategic Content Ideas',
        icon: LightBulbIcon,
        action: 'content',
        description: "Break creative blocks. Get 5 unique, data-driven video ideas tailored to your niche with clear reasons for their viral potential.",
    },
    {
        name: 'Title & Thumbnail Optimizer',
        icon: SparklesIcon,
        action: 'optimize',
        description: "Stop guessing. Upload your title and thumbnail to get a CTR score, detailed analysis, and actionable suggestions to maximize clicks.",
    },
    {
        name: '7-Day Content Calendar',
        icon: CalendarDaysIcon,
        action: 'calendar',
        description: "Plan for success. Get a personalized 7-day calendar with ideas, posting times, and powerful video hooks based on your niche.",
    },
    {
        name: 'Target Audience Analysis',
        icon: UserGroupIcon,
        action: 'audience',
        description: "Know your viewers. Paste your content to build a detailed audience persona, including demographics, interests, and engagement tips.",
    },
];

interface HomepageFeaturesProps {
    onOptimizerClick: () => void;
    onContentStrategyClick: () => void;
    onAudienceAnalysisClick: () => void;
    onContentCalendarClick: () => void;
    onEngagementHacksClick: () => void;
    onMiniShortsGeneratorClick: () => void;
    onInstagramDownloaderClick: () => void;
    onShowFeaturesPage: () => void;
    t: (key: string) => string;
}

const HomepageFeatures = (props: HomepageFeaturesProps) => {
    const { t } = props;
    const getClickHandler = (action: Feature['action']) => {
        switch (action) {
            case 'optimize': return props.onOptimizerClick;
            case 'content': return props.onContentStrategyClick;
            case 'audience': return props.onAudienceAnalysisClick;
            case 'calendar': return props.onContentCalendarClick;
            case 'engagement': return props.onEngagementHacksClick;
            case 'miniShorts': return props.onMiniShortsGeneratorClick;
            case 'instagram': return props.onInstagramDownloaderClick;
            default: return () => {};
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto my-12 text-center animate-fade-in-up" id="features" style={{ animationDelay: '100ms' }}>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#e9d5ff' }}>
                {t('homepage.features.header')}
            </h3>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 mb-4 text-shadow-lg">
                {t('homepage.features.title')}
            </h2>
            <p className="mt-4 mb-10 text-lg text-white/80 max-w-2xl mx-auto">
                {t('homepage.features.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homepageFeatures.map(feature => (
                    <FeatureCard 
                        key={feature.name} 
                        feature={feature} 
                        onUseTool={getClickHandler(feature.action)}
                        t={t}
                    />
                ))}
            </div>

            <div className="mt-12">
                <button
                    onClick={props.onShowFeaturesPage}
                    className="inline-flex items-center gap-3 rounded-lg bg-white/10 border border-white/30 backdrop-blur-md px-8 py-3 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20"
                >
                    {t('homepage.features.viewAll')}
                </button>
            </div>
        </div>
    );
};

export default HomepageFeatures;