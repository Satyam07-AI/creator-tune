
import React from 'react';
import { SparklesIcon, LightBulbIcon, UserGroupIcon, CalendarDaysIcon, PaintBrushIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentListIcon, ScaleIcon, MapIcon, DocumentTextIcon, ArrowTrendingUpIcon } from './icons';

interface BenefitItemProps {
  title: string;
  icon: React.ComponentType<{className?: string}>;
  what: string;
  why: string;
  how: string;
}

const BenefitPoint = ({ label, text }: { label: string; text: string; }) => (
    <div>
        <h4 className="font-bold text-pink-300">{label}</h4>
        <p className="text-white/80">{text}</p>
    </div>
);

const BenefitItem = ({ title, icon: Icon, what, why, how }: BenefitItemProps) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
            <Icon className="w-8 h-8 text-pink-300 flex-shrink-0" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <BenefitPoint label="What it does" text={what} />
            <BenefitPoint label="Why it's useful" text={why} />
            <BenefitPoint label="How it helps" text={how} />
        </div>
    </div>
);

const BenefitsPage = ({ t }: { t: (key: string) => string }) => {
  const benefits = [
    { 
        title: 'Title & Thumbnail Optimizer', icon: SparklesIcon,
        what: 'Analyzes your title and thumbnail combination using AI.',
        why: 'Gives you a CTR (Click-Through Rate) score and identifies weaknesses before you publish.',
        how: 'Higher CTR means more initial views, which tells the YouTube algorithm your video is worth recommending.'
    },
    {
        title: 'Strategic Content Ideas', icon: LightBulbIcon,
        what: 'Generates unique, data-driven video ideas tailored to your niche.',
        why: 'Breaks creative blocks and ensures your ideas have viral potential from the start.',
        how: 'Consistently creating high-potential content leads to faster subscriber growth and authority in your niche.'
    },
    {
        title: 'Target Audience Analysis', icon: UserGroupIcon,
        what: 'Builds a detailed profile of your ideal viewer based on your content.',
        why: 'You\'ll understand your audience\'s psychology, interests, and pain points.',
        how: 'Make content that deeply resonates with your viewers, leading to higher engagement and loyalty.'
    },
    {
        title: '7-Day Content Calendar', icon: CalendarDaysIcon,
        what: 'Creates a personalized weekly content plan with ideas, posting times, and hooks.',
        why: 'Eliminates the stress of planning and ensures a consistent upload schedule.',
        how: 'Consistency is key on YouTube. A structured plan helps you stay on track and keeps your audience coming back.'
    },
    {
        title: 'Channel Branding Review', icon: PaintBrushIcon,
        what: 'Audits your channel\'s name, logo, banner, and overall visual identity.',
        why: 'Identifies branding inconsistencies that might confuse new viewers.',
        how: 'A strong, consistent brand builds trust and makes your channel instantly recognizable.'
    },
    {
        title: 'Audit Channel (\'About\' Section)', icon: DocumentTextIcon,
        what: 'Analyzes your \'About\' section for clarity, tone, and effectiveness.',
        why: 'Your \'About\' page is often visited by potential sponsors and super-fans.',
        how: 'A professional \'About\' section can lead to brand deals and builds deeper trust with your audience.'
    },
    {
        title: 'Engagement Growth Hacks', icon: ChatBubbleOvalLeftEllipsisIcon,
        what: 'Provides tailored strategies to boost likes, comments, and shares.',
        why: 'Explains the psychology behind viewer interaction and gives you ready-to-use examples.',
        how: 'High engagement signals to the algorithm that your content is valuable, leading to more recommendations.'
    },
    {
        title: 'Script & Hook Generator', icon: ClipboardDocumentListIcon,
        what: 'Writes a complete, engaging script with a powerful hook, structured body, and CTA.',
        why: 'Overcomes writer\'s block and structures your video for maximum retention.',
        how: 'Better scripts lead to higher watch time, a crucial metric for the YouTube algorithm.'
    },
    {
        title: 'A/B Title & Thumbnail Tester', icon: ScaleIcon,
        what: 'Compares two title/thumbnail options to predict which will perform better.',
        why: 'Make data-driven creative decisions instead of guessing.',
        how: 'Even a small CTR improvement can lead to thousands of extra views over time.'
    },
    {
        title: 'Video Retention Analysis', icon: ArrowTrendingUpIcon,
        what: 'Analyzes your script to find boring parts *before* you film.',
        why: 'Fix potential viewer drop-off points in the planning stage, saving you time in editing.',
        how: 'Increases average view duration, one of the most important ranking factors on YouTube.'
    },
    {
        title: 'Channel Positioning Map', icon: MapIcon,
        what: 'Gives you a strategic report on your unique place in the YouTube landscape.',
        why: 'Identifies content gaps and shows you how to stand out from competitors.',
        how: 'Dominate a specific niche by being different, which attracts a dedicated and loyal audience.'
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in-up">
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
                {t('header.whatYouGet')}
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                A complete breakdown of every tool on the platform and how it helps you grow.
            </p>
        </div>
        <div className="mt-12 space-y-6">
          {benefits.map(benefit => <BenefitItem key={benefit.title} {...benefit} />)}
        </div>
    </div>
  );
};

export default BenefitsPage;