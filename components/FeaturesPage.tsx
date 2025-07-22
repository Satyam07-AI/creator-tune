
import React from 'react';
import { SparklesIcon, LightBulbIcon, UserGroupIcon, CalendarDaysIcon, PaintBrushIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentListIcon, ScaleIcon, MapIcon, DocumentTextIcon, ArrowTrendingUpIcon, RocketLaunchIcon, FilmIcon, CameraIcon } from './icons';

interface Feature {
  name: string;
  icon: React.FC<{className?: string}>;
  description: string;
  action: 'optimize' | 'content' | 'audience' | 'calendar' | 'branding' | 'engagement' | 'script' | 'abtest' | 'positioning' | 'about' | 'retention' | 'instantBoost' | 'miniShorts' | 'instagram';
}

const features: Feature[] = [
  {
    name: 'Mini Shorts Generator',
    icon: FilmIcon,
    action: 'miniShorts',
    description: "Generate viral short-form videos (15–30 seconds) from a YouTube channel's content with modular upgrades like AI voiceovers and captions.",
  },
  {
    name: 'Freemium Instagram Downloader',
    icon: CameraIcon,
    action: 'instagram',
    description: "Get a competitive edge by analyzing any public Instagram profile. Receive a detailed PDF report on their content strategy, top posts, and engagement.",
  },
  {
    name: 'Strategic Content Ideas',
    icon: LightBulbIcon,
    action: 'content',
    description: "Break creative blocks. Get 5 unique, data-driven video ideas tailored to your niche with clear reasons for their viral potential.",
  },
  {
    name: 'Boost Your Views Instantly',
    icon: RocketLaunchIcon,
    action: 'instantBoost',
    description: "Get an instant, AI-driven growth plan for your video. Analyzes title, thumbnail, and content strategy to turn an average video into a top-performer.",
  },
  {
    name: 'Script & Hook Generator',
    icon: ClipboardDocumentListIcon,
    action: 'script',
    description: "Conquer the blank page. Get a complete, engaging YouTube script with a powerful hook, structured body, and a compelling CTA.",
  },
  {
    name: 'Video Retention Analysis',
    icon: ArrowTrendingUpIcon,
    action: 'retention',
    description: "Analyze your script to find boring parts before you film. Get a pacing score, hook analysis, and tips to keep viewers watching.",
  },
  {
    name: 'Title & Thumbnail Optimizer',
    icon: SparklesIcon,
    action: 'optimize',
    description: "Stop guessing. Upload your title and thumbnail to get a CTR score, detailed analysis, and actionable suggestions to maximize clicks.",
  },
  {
    name: 'A/B Title & Thumbnail Tester',
    icon: ScaleIcon,
    action: 'abtest',
    description: "Make data-driven decisions. Compare two title & thumbnail combinations to see which will perform better and why.",
  },
  {
    name: 'Target Audience Analysis',
    icon: UserGroupIcon,
    action: 'audience',
    description: "Know your viewers. Paste your content to build a detailed audience persona, including demographics, interests, and engagement tips.",
  },
  {
    name: 'Channel Positioning Map',
    icon: MapIcon,
    action: 'positioning',
    description: "Define your unique space. Get a strategic report on your creator archetype, value proposition, and how to stand out from competitors.",
  },
  {
    name: 'Channel Branding Review',
    icon: PaintBrushIcon,
    action: 'branding',
    description: "Build a memorable brand. Get an expert review of your channel's name, handle, logo, and banner with an overall branding score.",
  },
   {
    name: '7-Day Content Calendar',
    icon: CalendarDaysIcon,
    action: 'calendar',
    description: "Plan for success. Get a personalized 7-day calendar with ideas, posting times, and powerful video hooks based on your niche.",
  },
   {
    name: 'Engagement Growth Hacks',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    action: 'engagement',
    description: "Turn viewers into a community. Our AI provides 5 tailored growth hacks, explaining the psychology and giving practical examples.",
  },
];

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

interface FeaturesPageProps {
    onOptimizerClick: () => void;
    onContentStrategyClick: () => void;
    onAudienceAnalysisClick: () => void;
    onContentCalendarClick: () => void;
    onBrandingReviewClick: () => void;
    onEngagementHacksClick: () => void;
    onScriptGeneratorClick: () => void;
    onABTesterClick: () => void;
    onRetentionAnalysisClick: () => void;
    onPositioningMapClick: () => void;
    onInstantViewBoostClick: () => void;
    onMiniShortsGeneratorClick: () => void;
    onInstagramDownloaderClick: () => void;
    t: (key: string) => string;
}


const FeaturesPage = (props: FeaturesPageProps) => {

    const getClickHandler = (action: Feature['action']) => {
        switch (action) {
            case 'optimize': return props.onOptimizerClick;
            case 'content': return props.onContentStrategyClick;
            case 'audience': return props.onAudienceAnalysisClick;
            case 'calendar': return props.onContentCalendarClick;
            case 'branding': return props.onBrandingReviewClick;
            case 'engagement': return props.onEngagementHacksClick;
            case 'script': return props.onScriptGeneratorClick;
            case 'abtest': return props.onABTesterClick;
            case 'retention': return props.onRetentionAnalysisClick;
            case 'positioning': return props.onPositioningMapClick;
            case 'instantBoost': return props.onInstantViewBoostClick;
            case 'miniShorts': return props.onMiniShortsGeneratorClick;
            case 'instagram': return props.onInstagramDownloaderClick;
            default: return () => {};
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
                Creator Tune Features
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto text-center">
                A complete suite of AI-powered tools designed to help you analyze, strategize, and grow your YouTube channel faster than ever before.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {features.map(feature => (
                    <FeatureCard 
                        key={feature.name} 
                        feature={feature} 
                        onUseTool={getClickHandler(feature.action)}
                        t={props.t}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturesPage;