


interface TitleAnalysis {
  title: string;
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
}

interface ThumbnailReview {
  video_title: string;
  readability_score: number;
  emotional_impact: string;
  contrast_feedback: string;
  suggestions: string[];
}

interface PotentialVideo {
  title: string;
  reason_for_potential: string;
  growth_strategy: string;
}

interface ContentCalendarItem {
  day: string;
  idea: string;
  suggested_title: string;
  thumbnail_concept: string;
}

export interface AuditData {
  overall_score: number;
  title_analysis: TitleAnalysis[];
  thumbnail_review: ThumbnailReview[];
  niche_focus: string;
  potential_videos: PotentialVideo[];
  content_calendar: ContentCalendarItem[];
}

export interface HistoryItem {
  id: string;
  url: string;
  data: AuditData;
  timestamp: string; // ISO string
}

export interface CreatorInfo {
  logoBase64?: string;
  name: string;
  handle: string;
}


export interface AdvancedThumbnailSuggestions {
  emotion_use: string;
  clutter: string;
  text_readability: string;
  color_advice: string;
  title_match: string;
  ctr_prediction: 'Low' | 'Medium' | 'High';
}

export interface TitleThumbnailAuditData {
  ctrRating: number;
  analysis: string;
  suggestedTitle: string;
  thumbnailSuggestions: AdvancedThumbnailSuggestions;
}

export interface PredictedComment {
  username: string;
  comment: string;
}

export interface ViralTrigger {
    trigger: string;
    explanation: string;
}

export interface InspirationVideo {
    title: string;
    views: string;
}

export interface VideoIdea {
  idea: string;
  formatTag: string;
  reason: string;
  hook: string;
  suggestedTitle: string;
  thumbnailConcept: string;
  viralScore: number;
  viralScoreReason: string;
  predictedComments: PredictedComment[];
  // New advanced fields
  viralTriggers: ViralTrigger[];
  trendScore: number;
  bestDayToPost: string;
  contentType: 'Evergreen' | 'Trending';
  relevanceLifespan: string;
  creativeTwist: string;
  inspirationVideos: InspirationVideo[];
}

export interface TrendAnalysis {
    trend: string;
    source: string; // e.g., 'Google Trends', 'YouTube Trending'
}

export interface CompetitorAnalysis {
    competitor: string; // e.g., 'Competitor Channel Name'
    analysis: string;
    opportunity: string;
}

export interface ContentStrategyData {
  niche: {
    core: string;
    sub: string;
  };
  themes: string[];
  trendAnalysis: TrendAnalysis[];
  competitorAnalysis: CompetitorAnalysis[];
  videoIdeas: VideoIdea[];
}

export interface Psychographics {
  personalityTraits: string[];
  values: string[];
  painPoints: string[];
  motivations: string[];
}

export interface ViewerArchetype {
  name: string;
  age: number;
  profession: string;
  interests: string[];
  motivation: string;
}

export interface CompetitorAudience {
  channelName: string;
  similarities: string[];
  differences: string[];
}

export interface CommunityHotspot {
    platform: string;
    community: string;
    reason: string;
}

export interface AudienceProfileData {
  viewerSummary: {
    age: string;
    gender: string;
    country: string;
  };
  contentResonanceScore: number;
  psychographics: Psychographics;
  sentimentAndEmotion: {
    emotionalTriggers: string[];
    toneAlignment: string;
  };
  communityHotspots: CommunityHotspot[];
  behavioralPredictions: {
    activeHours: string;
    ctaResponsiveness: string;
    preferredFormats: string[];
  };
  viewerArchetypes: ViewerArchetype[];
  competitorAudienceOverlap: CompetitorAudience[];
  engagementTips: string[];
}


export type StrategyType = 'Global' | 'Local (India-based)';

export interface CalendarIdea {
    day: string;
    objective: 'Grow Subscribers' | 'Build Trust' | 'Boost Views' | 'Drive Comments' | 'Engage Community';
    publishTime: string;
    format: {
        type: 'Long-form Video' | 'YouTube Short' | 'Live Stream' | 'Community Post' | 'Poll';
        reasoning: string;
    };
    idea: string;
    hooks: string[];
    predictedOutcomes: {
        reach: string;
        engagement: string;
        subscriberImpact: string;
    };
    title: string;
}

export interface PersonalizedCalendarData {
    strategyType: StrategyType;
    calendar: CalendarIdea[];
}


export interface BrandingReviewData {
  rating: number;
  strengths: string[];
  weaknesses:string[];
  suggestions: string[];
}

export interface FormatSpecificCTAs {
    format: 'YouTube Short' | 'Long-form Video' | 'Live Stream';
    ctas: string[];
}

export interface TimeStampedBoost {
    timestamp: string; // e.g. "First 10 Seconds", "70% Watch Time"
    hack: string;
    reason: string;
}

export interface CommunityTabHack {
    type: 'Poll' | 'Image Teaser' | 'Question' | 'Behind The Scenes' | 'Meme';
    idea: string;
    reason: string;
}

export interface EngagementFunnelStage {
    stage: 'Watcher' | 'Commenter' | 'Subscriber' | 'Sharer';
    goal: string;
    tactics: string[];
}

export interface EngagementHacksData {
    engagementBoostProjection: number;
    ctaGenerator: FormatSpecificCTAs[];
    commentTriggers: string[];
    timeStampedBoosts: TimeStampedBoost[];
    communityTabHacks: CommunityTabHack[];
    engagementFunnel: EngagementFunnelStage[];
    retentionTips: string[];
}


export type ScriptEmotion = 'Neutral' | 'Humor' | 'Tension' | 'Inspiration' | 'Excitement' | 'Sadness' | 'Curiosity';
export type PlatformFormat = 'YouTube Long-form' | 'YouTube Short / Reel';
export type ScriptTone = 'Professional' | 'Casual & Witty' | 'Gen Z' | 'Kid-Friendly' | 'Storyteller';

export type AudiencePersona = 'Beginners' | 'Professionals' | 'Creators' | 'General Audience' | 'Gen Z' | 'Millennials';
export type ScriptStructure = 'Hook + Problem + Tease Solution' | 'Story-Based Script with Emotional Climax';

export interface ScriptSection {
    section_title: string;
    emotion: ScriptEmotion;
    text: string;
    pacing_feedback?: string;
    viral_trigger?: {
        technique: string;
        reason: string;
    };
}

export interface OptimizedCTA {
    style: string;
    placement: string;
    text: string;
}

export interface AdvancedScriptData {
    script_sections: ScriptSection[];
    optimized_cta: OptimizedCTA;
    voice_over_annotations: string;
}

export interface RewrittenOptions {
    shorter: string;
    more_professional: string;
    funnier: string;
}


export interface CTRPrediction {
    percentage: number;
}

export interface TitleSuggestions {
    shortVersion: string;
    longVersion: string;
}

export interface ABTestOptionAnalysis {
    ctrPrediction: CTRPrediction;
    psychologicalTriggers: string[];
    attentionHeatmap: string; // Base64 encoded PNG image string
    audienceFitScore: number;
    titleSuggestions: TitleSuggestions;
    formattingImprovements: string[];
}

export interface ViralVideoReference {
    title: string;
    stats: string;
    reasonForRelevance: string;
}

export interface ABTestData {
    winner: 'A' | 'B' | 'Neither';
    overallReasoning: string;
    optionA: ABTestOptionAnalysis;
    optionB: ABTestOptionAnalysis;
    viralVideoReferences: ViralVideoReference[];
}


export interface QuadrantPosition {
    name: string;
    x: number; // -100 to 100
    y: number; // -100 to 100
}

export interface BrandArchetype {
    name: string;
    description: string;
    strategy: string;
    references: string[];
}

export interface ContentGap {
    angle: string;
    reason: string;
    exampleTitle: string;
}

export interface HeatmapCell {
    angle: string;
    density: number; // 0-100
    opportunity: 'Low' | 'Medium' | 'High';
}

export interface ActionPlanItem {
    day: number;
    task: string;
    reason: string;
}

export interface AdvancedChannelPositioningData {
    audiencePerception: {
        intended: string;
        actual: string;
        gapAnalysis: string;
    };
    positioningMap: {
        xAxisLabel: string; // e.g., 'Entertainment <-> Education'
        yAxisLabel: string; // e.g., 'Beginner Focus <-> Expert Focus'
        userPosition: QuadrantPosition;
        competitors: QuadrantPosition[];
    };
    contentGaps: ContentGap[];
    brandArchetypes: BrandArchetype[];
    visualDifferentiation: {
        score: number; // 0-100
        feedback: string;
        suggestions: string[];
    };
    competitiveHeatmap: HeatmapCell[];
    actionPlan: ActionPlanItem[];
}

export type PositionShiftStyle = 'More Edgy & Controversial' | 'More Educational & In-Depth' | 'More Entertaining & Humorous' | 'More Polished & Professional';

export interface PositionShiftSimulationData {
    newTitleTone: string;
    thumbnailStyleSuggestion: string;
    videoHookExamples: string[];
}


export type EmotionPoint = {
    timestamp: string; // "0:00", "0:15", "0:30"
    emotion: 'Excitement' | 'Curiosity' | 'Humor' | 'Tension' | 'Informative' | 'Neutral';
    score: number; // 0-100
};

export type PerformanceRating = 'Good' | 'Average' | 'Poor';

export type PerformanceSummary = {
    hookRetention: PerformanceRating;      // 0-15s
    midWatchRetention: PerformanceRating;   // 1-4 mins
    finalCtaRetention: PerformanceRating;   // last 30s
};

export type TimelineSegment = {
    timestamp: string; // e.g., "0:30-0:45"
    retentionRisk: 'Low' | 'Medium' | 'High'; // Maps to green, yellow, red
    dropOffCause: string; // e.g., "Sudden pacing change", "Unclear message"
    segmentText: string;
};

export type RetentionBoostTip = {
    timestamp: string; // The weak zone this tip applies to
    suggestion: string; // e.g., "Add B-roll of...", "Shorten this section by 5 seconds"
    reason: string; // Why this change will help
};

export type CompetitorRetentionAnalysis = {
    videoUrl: string;
    comparison: {
        intro: string; // e.g., "User's hook is stronger, but competitor has better pacing."
        mid: string;
        end: string;
    };
    structuralSuggestions: string[];
};

export interface RetentionAnalysisData {
    retentionPredictionScore: number;
    performanceSummary: PerformanceSummary;
    attentionCurve: {
        points: EmotionPoint[];
        summary: string; // The "Attention Curve Insights" summary
    };
    retentionTimeline: TimelineSegment[];
    retentionBoostTips: RetentionBoostTip[];
    competitorAnalysis?: CompetitorRetentionAnalysis[];
    audiencePersonaMatch: {
        matchScore: number; // 0-100
        feedback: string;
    };
    overallSummary: string;
}


export interface AboutSectionAnalysisData {
  toneAnalysis: string;
  clarityAndBrandingSuggestions: string[];
  alignmentWithNiche: string;
  missingElements: string[];
  optimizedVersion: string;
}

export interface InstantViewBoostData {
    clickThroughRateEstimation: {
        score: number;
        analysis: string;
    };
    emotionalHookScore: {
        score: number;
        feedback: string;
    };
    optimizationSuggestions: {
        title: string;
        thumbnail: string;
    };
    abVariants: {
        titles: string[];
        thumbnails: string[];
    };
    trendingFormat: {
        format: string;
        hook: string;
    };
    bestUploadTime: {
        day: string;
        time: string;
        reason: string;
    };
    reachRecoveryPlan: {
        step1: string;
        step2: string;
        step3: string;
    };
    postingCalendar: {
        day: string;
        idea: string;
        goal: string;
    }[];
}

export interface MiniShortsGeneratorOptions {
  channelUrl: string;
  generateCaption: boolean;
  captionLanguage: 'English' | 'Hinglish';
  generateVoiceover: boolean;
  voiceoverLanguage: 'Hindi' | 'Hinglish' | 'English';
  voiceoverTone: 'Excited' | 'Chill' | 'Premium' | 'Youth-friendly';
  applyTheme: boolean;
  themeVibe: 'Trendy' | 'Educational' | 'Professional';
  autoHighlights: boolean;
  addCta: boolean;
  socialHandle?: string;
  suggestSchedule: boolean;
  exportRatio: '1:1' | '9:16';
  includeWatermark: boolean;
}

export interface MiniShortsData {
    channelHook: string;
    dynamicCaption?: {
        text: string;
        hashtags: string[];
    };
    aiVoiceover?: {
        script: string;
        language: string;
        tone: string;
        instructions: string;
    };
    themeTemplate?: {
        vibe: string;
        colorPalette: string[];
        fontSuggestion: string;
        transitionStyle: string;
    };
    autoHighlights?: {
        segmentDescription: string;
        suggestedSource: string;
        subtitles: string;
        editSuggestions: string[];
    };
    ctaAddon?: {
        type: string;
        text: string;
        animationSuggestion: string;
    };
    exportFormat?: {
        ratio: string;
        watermark: string;
    };
    autoSchedule?: {
        postTime: string;
        description: string;
        hashtags: string[];
    };
}

export interface TopPost {
    description: string;
    metrics: string;
}

export interface TopHashtag {
    hashtag: string;
    rank: number;
}

export interface InstagramCompetitorEdgeData {
    contentStyleSummary: string;
    uploadFrequency: string;
    averageCaptionLength: string;
    averageEngagement: {
        score: number;
        analysis: string;
    };
    topPosts: TopPost[];
    topHashtags: TopHashtag[];
    actionableRecommendations: string[];
}


// Add Razorpay to the window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}