import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { runYouTubeAudit } from './services/geminiService';
import { saveAuditToHistory } from './services/historyService';
import { getTranslator, detectInitialLanguage, Language } from './services/localization';
import type { AuditData, HistoryItem } from './types';
import AuditResult from './components/AuditResult';
import LoadingSpinner from './components/LoadingSpinner';
import { SearchIcon } from './components/icons';
import HomepageFeatures from './components/HomepageFeatures';
import TitleThumbnailOptimizer from './components/TitleThumbnailOptimizer';
import ContentStrategyAnalyzer from './components/ContentStrategyAnalyzer';
import AudienceAnalyzer from './components/AudienceAnalyzer';
import ContentCalendarGenerator from './components/ContentCalendarGenerator';
import BrandingReviewAnalyzer from './components/BrandingReviewAnalyzer';
import EngagementHacksAnalyzer from './components/EngagementHacksAnalyzer';
import ScriptGenerator from './components/ScriptGenerator';
import ABTester from './components/ABTester';
import { ChannelPositioningMap } from './components/ChannelPositioningMap';
import { RetentionAnalyzer } from './components/RetentionAnalyzer';
import AboutSectionAnalyzer from './components/AboutSectionAnalyzer';
import InstantViewBooster from './components/InstantViewBooster';
import MiniShortsGenerator from './components/MiniShortsGenerator';
import InstagramDownloader from './components/InstagramDownloader';
import HowItWorks from './components/HowItWorks';
import Header from './components/Header';
import FeaturesPage from './components/FeaturesPage';
import PricingPage from './components/PricingPage';
import FAQPage from './components/FAQPage';
import Footer from './components/Footer';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ThankYouPage from './components/ThankYouPage';
import BenefitsPage from './components/BenefitsPage';
import ContactForm from './components/ContactForm';

type View = 'main' | 'features' | 'pricing' | 'faq' | 'tos' | 'privacy' | 'thank-you' | 'what-you-get';

const App = () => {
  const [url, setUrl] = useState<string>('');
  const [auditResult, setAuditResult] = useState<AuditData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [view, setView] = useState<View>('main');

  // Language state
  const [language, setLanguage] = useState<Language>(detectInitialLanguage());
  const t = useMemo(() => getTranslator(language), [language]);

  const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
  const [showContentStrategy, setShowContentStrategy] = useState<boolean>(false);
  const [showAudienceAnalyzer, setShowAudienceAnalyzer] = useState<boolean>(false);
  const [showContentCalendar, setShowContentCalendar] = useState<boolean>(false);
  const [showBrandingReview, setShowBrandingReview] = useState<boolean>(false);
  const [showEngagementHacks, setShowEngagementHacks] = useState<boolean>(false);
  const [showScriptGenerator, setShowScriptGenerator] = useState<boolean>(false);
  const [showABTester, setShowABTester] = useState<boolean>(false);
  const [showPositioningMap, setShowPositioningMap] = useState<boolean>(false);
  const [showRetentionAnalyzer, setShowRetentionAnalyzer] = useState<boolean>(false);
  const [showAboutSectionAnalyzer, setShowAboutSectionAnalyzer] = useState<boolean>(false);
  const [showInstantViewBooster, setShowInstantViewBooster] = useState<boolean>(false);
  const [showMiniShortsGenerator, setShowMiniShortsGenerator] = useState<boolean>(false);
  const [showInstagramDownloader, setShowInstagramDownloader] = useState<boolean>(false);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('creator-tune-language', lang);
  }, []);

  const clearFeatureStates = (isAuditing: boolean = false) => {
    if (!isAuditing) {
        setAuditResult(null);
        setError(null);
        setUrl('');
    }
    setShowOptimizer(false);
    setShowContentStrategy(false);
    setShowAudienceAnalyzer(false);
    setShowContentCalendar(false);
    setShowBrandingReview(false);
    setShowEngagementHacks(false);
    setShowScriptGenerator(false);
    setShowABTester(false);
    setShowPositioningMap(false);
    setShowRetentionAnalyzer(false);
    setShowAboutSectionAnalyzer(false);
    setShowInstantViewBooster(false);
    setShowMiniShortsGenerator(false);
    setShowInstagramDownloader(false);
  };

  const handleAudit = useCallback(async () => {
    if (!url.trim()) {
      setError(t('error.url.enter'));
      return;
    }
    
    try {
        new URL(url);
        if (!url.toLowerCase().includes('youtube.com') && !url.toLowerCase().includes('youtu.be')) {
            throw new Error('Invalid URL');
        }
    } catch(_) {
        setError(t('error.url.valid'));
        return;
    }

    clearFeatureStates(true);
    setIsLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const result = await runYouTubeAudit(url, language);
      setAuditResult(result);
      saveAuditToHistory(url, result);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error.unknown'));
    } finally {
      setIsLoading(false);
    }
  }, [url, language, t]);

  const handleRevisit = useCallback((item: HistoryItem) => {
    clearFeatureStates(true);
    setUrl(item.url);
    setAuditResult(item.data);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoHome = useCallback(() => {
    clearFeatureStates(false);
    setView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShowFeaturesPage = useCallback(() => {
    clearFeatureStates(false);
    setView('features');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShowPricingPage = useCallback(() => {
    clearFeatureStates(false);
    setView('pricing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleShowFAQPage = useCallback(() => {
    clearFeatureStates(false);
    setView('faq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShowTOSPage = useCallback(() => {
    clearFeatureStates(false);
    setView('tos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShowPrivacyPolicyPage = useCallback(() => {
    clearFeatureStates(false);
    setView('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShowThankYouPage = useCallback(() => {
    clearFeatureStates(false);
    setView('thank-you');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  const handleShowWhatYouGetPage = useCallback(() => {
    clearFeatureStates(false);
    setView('what-you-get');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleScrollTo = useCallback((selector: string) => {
    setView('main');
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        handleGoHome();
        setTimeout(() => {
          document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }, 0);
  }, [handleGoHome]);


  const createToolHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return useCallback(() => {
        clearFeatureStates();
        setView('main');
        setter(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [setter]);
  };

  const handleOptimizerClick = createToolHandler(setShowOptimizer);
  const handleContentStrategyClick = createToolHandler(setShowContentStrategy);
  const handleAudienceAnalysisClick = createToolHandler(setShowAudienceAnalyzer);
  const handleContentCalendarClick = createToolHandler(setShowContentCalendar);
  const handleBrandingReviewClick = createToolHandler(setShowBrandingReview);
  const handleEngagementHacksClick = createToolHandler(setShowEngagementHacks);
  const handleScriptGeneratorClick = createToolHandler(setShowScriptGenerator);
  const handleABTesterClick = createToolHandler(setShowABTester);
  const handlePositioningMapClick = createToolHandler(setShowPositioningMap);
  const handleRetentionAnalysisClick = createToolHandler(setShowRetentionAnalyzer);
  const handleAboutSectionAnalyzerClick = createToolHandler(setShowAboutSectionAnalyzer);
  const handleInstantViewBoosterClick = createToolHandler(setShowInstantViewBooster);
  const handleMiniShortsGeneratorClick = createToolHandler(setShowMiniShortsGenerator);
  const handleInstagramDownloaderClick = createToolHandler(setShowInstagramDownloader);
  
  const createBackHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
      return useCallback(() => {
          setter(false);
          setError(null);
      }, [setter]);
  };

  const handleBackFromOptimizer = createBackHandler(setShowOptimizer);
  const handleBackFromContentStrategy = createBackHandler(setShowContentStrategy);
  const handleBackFromAudienceAnalyzer = createBackHandler(setShowAudienceAnalyzer);
  const handleBackFromContentCalendar = createBackHandler(setShowContentCalendar);
  const handleBackFromBrandingReview = createBackHandler(setShowBrandingReview);
  const handleBackFromEngagementHacks = createBackHandler(setShowEngagementHacks);
  const handleBackFromScriptGenerator = createBackHandler(setShowScriptGenerator);
  const handleBackFromABTester = createBackHandler(setShowABTester);
  const handleBackFromPositioningMap = createBackHandler(setShowPositioningMap);
  const handleBackFromRetentionAnalysis = createBackHandler(setShowRetentionAnalyzer);
  const handleBackFromAboutSectionAnalyzer = createBackHandler(setShowAboutSectionAnalyzer);
  const handleBackFromInstantViewBooster = createBackHandler(setShowInstantViewBooster);
  const handleBackFromMiniShortsGenerator = createBackHandler(setShowMiniShortsGenerator);
  const handleBackFromInstagramDownloader = createBackHandler(setShowInstagramDownloader);


  const renderActiveComponent = () => {
    if (showOptimizer) {
      return <TitleThumbnailOptimizer onBack={handleBackFromOptimizer} t={t} language={language} />;
    }
    if (showContentStrategy) {
      return <ContentStrategyAnalyzer onBack={handleBackFromContentStrategy} t={t} language={language} />;
    }
    if (showAudienceAnalyzer) {
        return <AudienceAnalyzer onBack={handleBackFromAudienceAnalyzer} t={t} language={language} />;
    }
    if (showContentCalendar) {
        return <ContentCalendarGenerator onBack={handleBackFromContentCalendar} t={t} language={language} />;
    }
    if (showBrandingReview) {
        return <BrandingReviewAnalyzer onBack={handleBackFromBrandingReview} t={t} language={language} />;
    }
    if (showAboutSectionAnalyzer) {
        return <AboutSectionAnalyzer onBack={handleBackFromAboutSectionAnalyzer} t={t} language={language} />;
    }
    if (showEngagementHacks) {
        return <EngagementHacksAnalyzer onBack={handleBackFromEngagementHacks} t={t} language={language} />;
    }
    if (showScriptGenerator) {
        return <ScriptGenerator onBack={handleBackFromScriptGenerator} t={t} language={language} />;
    }
    if (showABTester) {
        return <ABTester onBack={handleBackFromABTester} t={t} language={language} />;
    }
    if (showRetentionAnalyzer) {
        return <RetentionAnalyzer onBack={handleBackFromRetentionAnalysis} t={t} language={language} />;
    }
    if (showPositioningMap) {
        return <ChannelPositioningMap onBack={handleBackFromPositioningMap} t={t} language={language} />;
    }
    if (showInstantViewBooster) {
        return <InstantViewBooster onBack={handleBackFromInstantViewBooster} t={t} language={language} />;
    }
    if (showMiniShortsGenerator) {
        return <MiniShortsGenerator onBack={handleBackFromMiniShortsGenerator} t={t} language={language} />;
    }
    if (showInstagramDownloader) {
        return <InstagramDownloader onBack={handleBackFromInstagramDownloader} t={t} language={language} />;
    }
    return (
        <HomepageFeatures
            onOptimizerClick={handleOptimizerClick}
            onContentStrategyClick={handleContentStrategyClick}
            onAudienceAnalysisClick={handleAudienceAnalysisClick}
            onContentCalendarClick={handleContentCalendarClick}
            onEngagementHacksClick={handleEngagementHacksClick}
            onMiniShortsGeneratorClick={handleMiniShortsGeneratorClick}
            onInstagramDownloaderClick={handleInstagramDownloaderClick}
            onShowFeaturesPage={handleShowFeaturesPage}
            t={t}
        />
    );
  }

  const renderMainView = () => (
    <>
        <div className="w-full max-w-4xl text-center mt-8 sm:mt-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
            {t('homepage.main.title')}
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {t('homepage.main.subtitle')}
            </p>

            <div className="mt-10 max-w-2xl w-full mx-auto">
            <div className="flex items-center gap-2 rounded-full bg-gray-800/50 border border-gray-700 p-2 shadow-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAudit()}
                placeholder={t('homepage.main.placeholder')}
                className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-4 text-base sm:text-lg"
                disabled={isLoading}
                />
                <button
                onClick={handleAudit}
                disabled={isLoading}
                className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full px-5 py-2.5 sm:px-6 sm:py-3 transition-all duration-300 ease-in-out hover:scale-105 disabled:bg-gray-500/50 disabled:text-white/70 disabled:cursor-not-allowed"
                >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                    <SearchIcon className="w-5 h-5 mr-2" />
                    {t('audit')}
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        
        <div className="w-full mt-6">
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center bg-red-500/50 text-white font-semibold p-4 rounded-xl max-w-md mx-auto">{error}</div>}
            {auditResult && <AuditResult data={auditResult} channelUrl={url} t={t} />}
            {!isLoading && !auditResult && renderActiveComponent()}
        </div>

        <div id="how-it-works">
            <HowItWorks t={t} />
        </div>
    </>
  )
  
  const renderCurrentView = () => {
    const activeToolComponent = [
        showOptimizer, showContentStrategy, showAudienceAnalyzer,
        showContentCalendar, showBrandingReview, showAboutSectionAnalyzer,
        showEngagementHacks, showScriptGenerator, showABTester,
        showPositioningMap, showRetentionAnalyzer, showInstantViewBooster,
        showMiniShortsGenerator, showInstagramDownloader
    ].some(Boolean) ? renderActiveComponent() : null;

    if (view === 'main' && activeToolComponent) {
        return activeToolComponent;
    }
      
    switch (view) {
        case 'main':
            return renderMainView();
        case 'features':
            return (
                <FeaturesPage
                    onOptimizerClick={handleOptimizerClick} 
                    onContentStrategyClick={handleContentStrategyClick}
                    onAudienceAnalysisClick={handleAudienceAnalysisClick}
                    onContentCalendarClick={handleContentCalendarClick}
                    onBrandingReviewClick={handleBrandingReviewClick}
                    onEngagementHacksClick={handleEngagementHacksClick}
                    onScriptGeneratorClick={handleScriptGeneratorClick}
                    onABTesterClick={handleABTesterClick}
                    onRetentionAnalysisClick={handleRetentionAnalysisClick}
                    onPositioningMapClick={handlePositioningMapClick}
                    onInstantViewBoostClick={handleInstantViewBoosterClick}
                    onMiniShortsGeneratorClick={handleMiniShortsGeneratorClick}
                    onInstagramDownloaderClick={handleInstagramDownloaderClick}
                    t={t}
                />
            );
        case 'what-you-get':
            return <BenefitsPage t={t} />;
        case 'pricing':
            return <PricingPage onPaymentSuccess={handleShowThankYouPage} t={t} />;
        case 'faq':
            return <FAQPage t={t} />;
        case 'tos':
            return <TermsOfServicePage t={t} />;
        case 'privacy':
            return <PrivacyPolicyPage t={t} />;
        case 'thank-you':
            return <ThankYouPage onGoHome={handleGoHome} t={t} />;
        default:
            return renderMainView();
    }
  }

  const isLightTheme = view === 'pricing' || view === 'faq' || view === 'tos' || view === 'privacy' || view === 'thank-you';

  const anyToolActive = [
    showOptimizer, showContentStrategy, showAudienceAnalyzer,
    showContentCalendar, showBrandingReview, showAboutSectionAnalyzer,
    showEngagementHacks, showScriptGenerator, showABTester,
    showPositioningMap, showRetentionAnalyzer, showInstantViewBooster,
    showMiniShortsGenerator, showInstagramDownloader
  ].some(Boolean);

  const finalTheme = isLightTheme && !anyToolActive ? 'light' : 'dark';
  const finalBg = finalTheme === 'light' ? 'bg-gray-50' : 'bg-[#111827]';

  return (
    <div className={`min-h-screen w-full text-white flex flex-col transition-colors duration-300 ${finalBg}`}>
      <Header 
        onGoHome={handleGoHome} 
        onShowFeaturesPage={handleShowFeaturesPage} 
        onShowPricingPage={handleShowPricingPage}
        onShowFAQPage={handleShowFAQPage}
        onShowPrivacyPolicyPage={handleShowPrivacyPolicyPage}
        onShowWhatYouGetPage={handleShowWhatYouGetPage}
        onScrollTo={handleScrollTo}
        onRevisit={handleRevisit}
        theme={finalTheme}
        t={t}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <main className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8 flex-grow">
        {renderCurrentView()}
      </main>
      <Footer
        onGoHome={handleGoHome}
        onShowFeaturesPage={handleShowFeaturesPage}
        onShowPricingPage={handleShowPricingPage}
        onShowFAQPage={handleShowFAQPage}
        onShowTOSPage={handleShowTOSPage}
        onShowPrivacyPolicyPage={handleShowPrivacyPolicyPage}
        onShowWhatYouGetPage={handleShowWhatYouGetPage}
        onScrollTo={handleScrollTo}
        t={t}
      />
      <ContactForm t={t} />
    </div>
  );
};

export default App;