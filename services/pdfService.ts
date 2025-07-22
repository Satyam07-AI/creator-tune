


import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { 
    AuditData,
    TitleThumbnailAuditData,
    ContentStrategyData,
    AudienceProfileData,
    PersonalizedCalendarData,
    BrandingReviewData,
    EngagementHacksData,
    AdvancedScriptData,
    ABTestData,
    AdvancedChannelPositioningData,
    RetentionAnalysisData,
    AboutSectionAnalysisData,
    InstantViewBoostData,
    MiniShortsData,
    InstagramCompetitorEdgeData
} from '../types';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

// --- PDF STYLING & HELPERS ---

const docOptions = {
    margins: { top: 25, bottom: 20, left: 15, right: 15 },
    brandColor: '#8B5CF6', // purple-500
    accentColor: '#EC4899', // pink-500
    textColor: '#1F2937', // gray-800
    subtleTextColor: '#6B7281', // gray-500
    lineHeight: 1.5,
};

let pageNumber = 1;
let totalPages = 1;

const addHeader = (doc: jsPDF, title: string) => {
    pageNumber = 1;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(docOptions.brandColor);
    doc.text('Creator Tune', docOptions.margins.left, 18);
    
    doc.setFontSize(12);
    doc.setTextColor(docOptions.textColor);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });
};

const addFooter = (doc: jsPDFWithAutoTable) => {
    totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const text = `Report generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`;
        doc.setFontSize(8);
        doc.setTextColor(docOptions.subtleTextColor);
        doc.text(text, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
};

const addSectionTitle = (doc: jsPDF, title: string, y: number) => {
    if (y > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = docOptions.margins.top;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(docOptions.accentColor);
    doc.text(title, docOptions.margins.left, y);
    doc.setDrawColor(docOptions.accentColor);
    doc.line(docOptions.margins.left, y + 2, docOptions.margins.left + 50, y + 2);
    return y + 10;
};

const addBodyText = (doc: jsPDF, text: string | string[], y: number) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(docOptions.textColor);
    const textToSplit = Array.isArray(text) ? text.join('\n') : text;
    const splitText = doc.splitTextToSize(textToSplit, doc.internal.pageSize.getWidth() - docOptions.margins.left - docOptions.margins.right);
    
    if (y + (splitText.length * 5) > doc.internal.pageSize.getHeight() - docOptions.margins.bottom) {
        doc.addPage();
        y = docOptions.margins.top;
    }
    
    doc.text(splitText, docOptions.margins.left, y);
    return y + (splitText.length * 5) + 5;
};

const getScoreColor = (score: number, maxScore = 100): [number, number, number] => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return [74, 222, 128]; // green-400
    if (percentage >= 50) return [250, 204, 21]; // yellow-400
    return [248, 113, 113]; // red-400
};

const autoTableStyles = {
    headStyles: { fillColor: docOptions.brandColor },
    alternateRowStyles: { fillColor: '#F3F4F6' }, // gray-100
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.5 },
};

const createDoc = (): jsPDFWithAutoTable => {
    return new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }) as jsPDFWithAutoTable;
};


// --- EXPORTED PDF GENERATION FUNCTIONS ---

export const generateAuditPdf = (data: AuditData, channelUrl: string) => {
    const doc = createDoc();
    addHeader(doc, `Full Channel Audit Report`);
    let y = docOptions.margins.top;

    y = addBodyText(doc, `Channel: ${channelUrl}`, y);
    y += 5;

    // Overall Score
    y = addSectionTitle(doc, 'Overall Score', y);
    doc.setFontSize(36);
    doc.setTextColor(...getScoreColor(data.overall_score));
    doc.text(`${data.overall_score}/100`, docOptions.margins.left, y + 5);
    y += 15;

    // Niche Focus
    y = addSectionTitle(doc, 'Niche Focus', y);
    y = addBodyText(doc, data.niche_focus, y);

    // Title Analysis
    y = addSectionTitle(doc, 'Title Analysis', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Title', 'Strengths', 'Weaknesses', 'Suggestion']],
        body: data.title_analysis.map(item => [item.title, item.strengths.join('\n'), item.weaknesses.join('\n'), item.suggestion]),
        ...autoTableStyles,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    // Thumbnail Review
    y = addSectionTitle(doc, 'Thumbnail Review', y);
     (doc as any).autoTable({
        startY: y,
        head: [['Video Title', 'Readability', 'Emotional Impact', 'Suggestions']],
        body: data.thumbnail_review.map(item => [item.video_title, `${item.readability_score}/10`, item.emotional_impact, item.suggestions.join('\n')]),
        ...autoTableStyles
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    // Content Calendar
    y = addSectionTitle(doc, 'Sample Content Calendar', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Day', 'Idea', 'Suggested Title', 'Thumbnail Concept']],
        body: data.content_calendar.map(item => [item.day, item.idea, item.suggested_title, item.thumbnail_concept]),
        ...autoTableStyles,
        });

    addFooter(doc);
    doc.save(`CreatorTune_Audit_${channelUrl.split('/').pop()}.pdf`);
};

export const generateTitleThumbnailPdf = (data: TitleThumbnailAuditData, title: string, imageBase64: string) => {
    const doc = createDoc();
    addHeader(doc, 'Title & Thumbnail Optimizer Report');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Your Assets', y);
    doc.addImage(imageBase64, 'JPEG', docOptions.margins.left, y, 80, 45);
    y = addBodyText(doc, `Original Title: "${title}"`, y + 50);

    y = addSectionTitle(doc, 'AI Analysis', y);
    doc.setFontSize(24);
    doc.setTextColor(...getScoreColor(data.ctrRating, 10));
    doc.text(`CTR Rating: ${data.ctrRating}/10`, docOptions.margins.left, y);
    y = addBodyText(doc, data.analysis, y + 10);
    
    y = addSectionTitle(doc, 'Suggestions', y);
    y = addBodyText(doc, `Suggested Title: ${data.suggestedTitle}`, y);

    (doc as any).autoTable({
        startY: y,
        head: [['Thumbnail Element', 'Suggestion']],
        body: [
            ['Emotion & Expression', data.thumbnailSuggestions.emotion_use],
            ['Clutter & Focus', data.thumbnailSuggestions.clutter],
            ['Text Readability', data.thumbnailSuggestions.text_readability],
            ['Color & Contrast', data.thumbnailSuggestions.color_advice],
            ['Title Match', data.thumbnailSuggestions.title_match],
            ['CTR Prediction', data.thumbnailSuggestions.ctr_prediction]
        ],
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Title_Thumbnail_Report.pdf');
};

export const generateContentStrategyPdf = (data: ContentStrategyData, channelUrl: string) => {
    const doc = createDoc();
    addHeader(doc, `Advanced Content Strategy for ${channelUrl.split('/').pop()}`);
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Niche & Themes', y);
    y = addBodyText(doc, `Core Niche: ${data.niche.core}\nSub-Niche: ${data.niche.sub}\nThemes: ${data.themes.join(', ')}`, y);

    y = addSectionTitle(doc, 'Trend & Competitor Analysis', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Trend/Competitor', 'Analysis/Opportunity']],
        body: [
            ...data.trendAnalysis.map(t => [`Trend: ${t.trend}`, `Source: ${t.source}`]),
            ...data.competitorAnalysis.map(c => [`Competitor: ${c.competitor}`, `Opportunity: ${c.opportunity}`])
        ],
        ...autoTableStyles,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, 'Advanced Video Blueprints', y);
    data.videoIdeas.forEach(idea => {
        if (y > doc.internal.pageSize.getHeight() - 60) {
            doc.addPage();
            y = docOptions.margins.top;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(docOptions.textColor);
        doc.text(`💡 ${idea.idea} [Viral Score: ${idea.viralScore}]`, docOptions.margins.left, y);
        y += 6;
        y = addBodyText(doc, `Title: ${idea.suggestedTitle}\nHook: "${idea.hook}"`, y);
        y += 5;
    });

    addFooter(doc);
    doc.save('CreatorTune_Content_Strategy.pdf');
};

export const generateAudienceProfilePdf = (data: AudienceProfileData) => {
    const doc = createDoc();
    addHeader(doc, 'Target Audience Profile');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Viewer Summary', y);
    doc.setFontSize(24);
    doc.setTextColor(...getScoreColor(data.contentResonanceScore));
    doc.text(`Resonance Score: ${data.contentResonanceScore}/100`, doc.internal.pageSize.getWidth() - docOptions.margins.right, y, { align: 'right'});
    y = addBodyText(doc, `Age: ${data.viewerSummary.age}\nGender: ${data.viewerSummary.gender}\nCountry: ${data.viewerSummary.country}`, y);

    y = addSectionTitle(doc, 'Psychographics', y);
    (doc as any).autoTable({
        startY: y,
        body: [
            { a: 'Personality Traits', b: data.psychographics.personalityTraits.join(', ') },
            { a: 'Values', b: data.psychographics.values.join(', ') },
            { a: 'Pain Points', b: data.psychographics.painPoints.join(', ') },
            { a: 'Motivations', b: data.psychographics.motivations.join(', ') },
        ],
        columns: [{ header: 'Category', dataKey: 'a' }, { header: 'Details', dataKey: 'b' }],
        ...autoTableStyles,
        didParseCell: (hookData: any) => {
            if (hookData.section === 'body' && hookData.column.dataKey === 'a') {
                hookData.cell.styles.fontStyle = 'bold';
            }
        }
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, 'Viewer Archetypes', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Name', 'Details']],
        body: data.viewerArchetypes.map(p => [p.name, `Age: ${p.age}, ${p.profession}\nMotivation: ${p.motivation}`]),
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Audience_Profile.pdf');
};

export const generateCalendarPdf = (data: PersonalizedCalendarData) => {
    const doc = createDoc();
    addHeader(doc, 'Advanced 7-Day Content Calendar');
    let y = docOptions.margins.top;

    (doc as any).autoTable({
        startY: y,
        head: [['Day', 'Objective', 'Publish Time', 'Format', 'Idea & Title', 'Hooks']],
        body: data.calendar.map(item => [
            item.day,
            item.objective,
            item.publishTime,
            `${item.format.type}\n(${item.format.reasoning})`,
            `${item.idea}\n\nTitle: ${item.title}`,
            item.hooks.join('\n')
        ]),
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Content_Calendar.pdf');
};

export const generateBrandingReviewPdf = (data: BrandingReviewData) => {
    const doc = createDoc();
    addHeader(doc, 'Channel Branding Review');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Overall Branding Score', y);
    doc.setFontSize(36);
    doc.setTextColor(...getScoreColor(data.rating, 10));
    doc.text(`${data.rating}/10`, docOptions.margins.left, y + 5);
    y += 15;

    y = addSectionTitle(doc, 'Analysis', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Strengths', 'Weaknesses', 'Suggestions']],
        body: [[data.strengths.join('\n'), data.weaknesses.join('\n'), data.suggestions.join('\n')]],
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Branding_Review.pdf');
};

export const generateEngagementHacksPdf = (data: EngagementHacksData) => {
    const doc = createDoc();
    addHeader(doc, 'Engagement Growth Blueprint');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Engagement Boost Projection', y);
    doc.setFontSize(36);
    doc.setTextColor(docOptions.brandColor);
    doc.text(`+${data.engagementBoostProjection}%`, docOptions.margins.left, y + 5);
    y += 15;

    y = addSectionTitle(doc, 'AI-Powered CTA Generator', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Format', 'CTA Suggestions']],
        body: data.ctaGenerator.map(item => [item.format, item.ctas.join('\n')]),
        ...autoTableStyles
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, 'Engagement Funnel Blueprint', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Stage', 'Goal', 'Tactics']],
        body: data.engagementFunnel.map(item => [item.stage, item.goal, item.tactics.join('\n')]),
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Engagement_Hacks.pdf');
};

export const generateScriptPdf = (data: AdvancedScriptData, topic: string) => {
    const doc = createDoc();
    addHeader(doc, `Advanced Script for "${topic}"`);
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Script Breakdown', y);
    data.script_sections.forEach(section => {
        if (y > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); y = docOptions.margins.top; }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`🎬 ${section.section_title} (Emotion: ${section.emotion})`, docOptions.margins.left, y);
        y = addBodyText(doc, section.text, y + 5);
        if (section.pacing_feedback) y = addBodyText(doc, `Pacing Tip: ${section.pacing_feedback}`, y);
        y += 3;
    });

    y = addSectionTitle(doc, 'Optimized Call to Action', y);
    y = addBodyText(doc, `Style: ${data.optimized_cta.style}\nPlacement: ${data.optimized_cta.placement}\nText: "${data.optimized_cta.text}"`, y);

    addFooter(doc);
    doc.save('CreatorTune_Script.pdf');
};

export const generateABTestPdf = (data: ABTestData, imageA: string, imageB: string) => {
    const doc = createDoc();
    addHeader(doc, 'A/B Test Report');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Winner & Reasoning', y);
    y = addBodyText(doc, `Predicted Winner: Option ${data.winner}\nReason: ${data.overallReasoning}`, y);

    const processOption = (option: 'A' | 'B', image: string) => {
        const optionData = option === 'A' ? data.optionA : data.optionB;
        y = addSectionTitle(doc, `Option ${option} Analysis`, y);
        if (y > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); y = docOptions.margins.top; }
        doc.addImage(image, 'JPEG', docOptions.margins.left, y, 60, 33.75);
        doc.addImage(`data:image/png;base64,${optionData.attentionHeatmap}`, 'PNG', docOptions.margins.left, y, 60, 33.75);
        y += 40;
        (doc as any).autoTable({
            startY: y,
            body: [
                ['CTR Prediction', `${optionData.ctrPrediction.percentage}%`],
                ['Audience Fit Score', `${optionData.audienceFitScore}/100`],
                ['Psychological Triggers', optionData.psychologicalTriggers.join(', ')],
                ['Title Suggestions', `Short: ${optionData.titleSuggestions.shortVersion}\nLong: ${optionData.titleSuggestions.longVersion}`],
            ],
            ...autoTableStyles,
            showHead: false
        });
        y = (doc as any).lastAutoTable.finalY + 10;
    };
    
    processOption('A', imageA);
    processOption('B', imageB);

    addFooter(doc);
    doc.save('CreatorTune_AB_Test_Report.pdf');
};

export const generateChannelPositioningPdf = (data: AdvancedChannelPositioningData) => {
    const doc = createDoc();
    addHeader(doc, 'Advanced Channel Positioning Report');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Audience Perception', y);
    y = addBodyText(doc, `Intended: ${data.audiencePerception.intended}\nActual: ${data.audiencePerception.actual}\nGap: ${data.audiencePerception.gapAnalysis}`, y);

    y = addSectionTitle(doc, '7-Day Action Plan', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Day', 'Task', 'Reason']],
        body: data.actionPlan.map(item => [item.day, item.task, item.reason]),
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Positioning_Report.pdf');
};

export const generateRetentionAnalysisPdf = (data: RetentionAnalysisData) => {
    const doc = createDoc();
    addHeader(doc, 'Video Retention Analysis');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Performance Summary', y);
    doc.setFontSize(24);
    doc.setTextColor(...getScoreColor(data.retentionPredictionScore));
    doc.text(`Score: ${data.retentionPredictionScore}/100`, docOptions.margins.left, y);
    y = addBodyText(doc, data.overallSummary, y + 10);
    
    y = addSectionTitle(doc, 'Drop-Off Timeline', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Timestamp', 'Risk', 'Potential Cause', 'Segment Text']],
        body: data.retentionTimeline.map(item => [item.timestamp, item.retentionRisk, item.dropOffCause, `"${item.segmentText}"`]),
        ...autoTableStyles
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    y = addSectionTitle(doc, 'Retention Boost Tips', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Timestamp', 'Suggestion', 'Reason']],
        body: data.retentionBoostTips.map(item => [item.timestamp, item.suggestion, item.reason]),
        ...autoTableStyles
    });

    addFooter(doc);
    doc.save('CreatorTune_Retention_Analysis.pdf');
};

export const generateAboutSectionPdf = (data: AboutSectionAnalysisData) => {
    const doc = createDoc();
    addHeader(doc, 'About Section Analysis');
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Analysis', y);
    y = addBodyText(doc, `Tone: ${data.toneAnalysis}\nNiche Alignment: ${data.alignmentWithNiche}`, y);

    y = addSectionTitle(doc, 'Suggestions', y);
    y = addBodyText(doc, data.clarityAndBrandingSuggestions.join('\n'), y);
    
    y = addSectionTitle(doc, 'Optimized Version', y);
    y = addBodyText(doc, data.optimizedVersion, y);

    addFooter(doc);
    doc.save('CreatorTune_About_Section_Analysis.pdf');
};

export const generateInstantViewBoostPdf = (data: InstantViewBoostData, inputs: any) => {
    const doc = createDoc();
    addHeader(doc, `Instant View Boost for "${inputs.videoTitle}"`);
    let y = docOptions.margins.top;
    
    y = addSectionTitle(doc, 'Key Metrics', y);
    (doc as any).autoTable({
        startY: y,
        body: [
            ['CTR Estimation', `${data.clickThroughRateEstimation.score.toFixed(1)}% (${data.clickThroughRateEstimation.analysis})`],
            ['Emotional Hook Score', `${data.emotionalHookScore.score}/10 (${data.emotionalHookScore.feedback})`],
            ['Best Upload Time', `${data.bestUploadTime.day} at ${data.bestUploadTime.time}`]
        ],
        ...autoTableStyles,
        showHead: false,
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    y = addSectionTitle(doc, 'Optimization & A/B Tests', y);
     (doc as any).autoTable({
        startY: y,
        body: [
            ['Title Suggestion', data.optimizationSuggestions.title],
            ['Thumbnail Suggestion', data.optimizationSuggestions.thumbnail],
            ['A/B Titles', data.abVariants.titles.join('\n\n')],
            ['A/B Thumbnails', data.abVariants.thumbnails.join('\n\n')],
        ],
        ...autoTableStyles,
        showHead: false,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, '7-Day Posting Calendar', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Day', 'Idea', 'Goal']],
        body: data.postingCalendar.map(item => [item.day, item.idea, item.goal]),
        ...autoTableStyles,
    });

    addFooter(doc);
    doc.save('CreatorTune_Instant_View_Boost.pdf');
};

export const generateMiniShortsPdf = (data: MiniShortsData, channelUrl: string) => {
    const doc = createDoc();
    addHeader(doc, `Mini Shorts Plan for ${channelUrl.split('/').pop()}`);
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, '🚀 Core Channel Hook', y);
    y = addBodyText(doc, `"${data.channelHook}"`, y);

    if (data.dynamicCaption) {
        y = addSectionTitle(doc, '✍️ Dynamic Caption', y);
        y = addBodyText(doc, `Text: ${data.dynamicCaption.text}\nHashtags: ${data.dynamicCaption.hashtags.join(' ')}`, y);
    }

    if (data.aiVoiceover) {
        y = addSectionTitle(doc, '🎙️ AI Voiceover', y);
        y = addBodyText(doc, `Script: "${data.aiVoiceover.script}"\nLanguage: ${data.aiVoiceover.language}\nTone: ${data.aiVoiceover.tone}\nInstructions: ${data.aiVoiceover.instructions}`, y);
    }
    
    if (data.themeTemplate) {
        y = addSectionTitle(doc, '🎨 Theme Template', y);
         (doc as any).autoTable({
            startY: y,
            body: [
                ['Vibe', data.themeTemplate.vibe],
                ['Color Palette', data.themeTemplate.colorPalette.join(', ')],
                ['Font Suggestion', data.themeTemplate.fontSuggestion],
                ['Transition Style', data.themeTemplate.transitionStyle],
            ],
            ...autoTableStyles,
            showHead: false
        });
        y = (doc as any).lastAutoTable.finalY + 10;
    }
    
    if (data.autoHighlights) {
        y = addSectionTitle(doc, '✂️ Auto-Reel Highlights', y);
        y = addBodyText(doc, `Source: ${data.autoHighlights.suggestedSource}\nSegment: ${data.autoHighlights.segmentDescription}\nEdits: ${data.autoHighlights.editSuggestions.join(', ')}`, y);
    }
    
    if (data.ctaAddon) {
        y = addSectionTitle(doc, '📢 CTA Add-on', y);
        y = addBodyText(doc, `Type: ${data.ctaAddon.type}\nText: "${data.ctaAddon.text}"\nAnimation: ${data.ctaAddon.animationSuggestion}`, y);
    }
    
    if (data.autoSchedule) {
        y = addSectionTitle(doc, '🗓️ Auto-Schedule Suggestion', y);
        y = addBodyText(doc, `Post Time: ${data.autoSchedule.postTime}\nDescription: ${data.autoSchedule.description}\nHashtags: ${data.autoSchedule.hashtags.join(' ')}`, y);
    }

    addFooter(doc);
    doc.save('CreatorTune_Mini_Shorts_Plan.pdf');
};

export const generateInstagramCompetitorEdgePdf = (data: InstagramCompetitorEdgeData, handle: string) => {
    const doc = createDoc();
    addHeader(doc, `Competitor Edge Report for @${handle}`);
    let y = docOptions.margins.top;

    y = addSectionTitle(doc, 'Engagement Overview', y);
    doc.setFontSize(24);
    doc.setTextColor(...getScoreColor(data.averageEngagement.score));
    doc.text(`Score: ${data.averageEngagement.score}/100`, docOptions.margins.left, y);
    y = addBodyText(doc, data.averageEngagement.analysis, y + 10);

    y = addSectionTitle(doc, 'Content Strategy', y);
    (doc as any).autoTable({
        startY: y,
        body: [
            ['Style Summary', data.contentStyleSummary],
            ['Upload Frequency', data.uploadFrequency],
            ['Avg. Caption Length', data.averageCaptionLength],
        ],
        ...autoTableStyles,
        showHead: false,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, 'Top Posts', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Post Description', 'Estimated Metrics']],
        body: data.topPosts.map(p => [p.description, p.metrics]),
        ...autoTableStyles,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, 'Top Hashtags', y);
    (doc as any).autoTable({
        startY: y,
        head: [['Rank', 'Hashtag']],
        body: data.topHashtags.sort((a,b) => a.rank - b.rank).map(h => [h.rank, h.hashtag]),
        ...autoTableStyles,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
    
    y = addSectionTitle(doc, 'Actionable Recommendations', y);
    y = addBodyText(doc, data.actionableRecommendations.map(r => `• ${r}`), y);

    addFooter(doc);
    doc.save(`CreatorTune_Instagram_Report_${handle}.pdf`);
};