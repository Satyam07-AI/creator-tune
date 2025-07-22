
export type Language = 'en' | 'hi'; // 'hi' for Hinglish

export const supportedLanguages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hinglish', flag: '🇮🇳' },
];

// Using a simplified key structure for easier management
const translations: Record<string, Record<Language, string>> = {
    // General
    'audit': { en: 'Audit', hi: 'ऑडिट' },
    'downloadReport': { en: 'Download Report', hi: 'रिपोर्ट डाउनलोड करें' },
    'getStarted': { en: 'Get Started', hi: 'शुरू हो जाओ' },
    'backToFeatures': { en: 'Back to Features', hi: 'विशेषताओं पर वापस' },
    'analyze': { en: 'Analyze', hi: 'विश्लेषण' },
    'useTool': { en: 'Use Tool', hi: 'टूल का प्रयोग करें' },
    'submit': { en: 'Submit', hi: 'प्रस्तुत' },
    'sending': { en: 'Sending...', hi: 'भेज रहा है...' },

    // Errors
    'error.url.enter': { en: 'Please enter a YouTube channel URL.', hi: 'कृपया एक यूट्यूब चैनल यूआरएल दर्ज करें।' },
    'error.url.valid': { en: 'Please enter a valid YouTube channel URL.', hi: 'कृपया एक मान्य यूट्यूब चैनल यूआरएल दर्ज करें।' },
    'error.unknown': { en: 'An unknown error occurred.', hi: 'एक अज्ञात त्रुटि हुई।' },
    'error.allFields': { en: 'Please fill out all fields.', hi: 'कृपया सभी फ़ील्ड भरें।' },
    
    // Header
    'header.home': { en: 'Home', hi: 'होम' },
    'header.features': { en: 'Features', hi: 'विशेषताएँ' },
    'header.whatYouGet': { en: 'What You Get', hi: 'आपको क्या मिलता है' },
    'header.thumbnails': { en: 'Thumbnails', hi: 'थंबनेल' },
    'header.howItWorks': { en: 'How It Works', hi: 'यह काम किस प्रकार करता है' },
    'header.pricing': { en: 'Pricing', hi: 'मूल्य-निर्धारण' },
    'header.faq': { en: 'FAQ', hi: 'सामान्य प्रश्न' },

    // Homepage
    'homepage.main.title': { en: 'AI-Powered YouTube Growth Suite', hi: 'एआई-संचालित यूट्यूब ग्रोथ सूट' },
    'homepage.main.subtitle': { en: 'Tune up your YouTube strategy with AI-powered insights.', hi: 'एआई-संचालित अंतर्दृष्टि के साथ अपनी यूट्यूब रणनीति को बेहतर बनाएं।' },
    'homepage.main.placeholder': { en: 'Enter YouTube Channel URL', hi: 'यूट्यूब चैनल यूआरएल दर्ज करें' },
    'homepage.features.header': { en: 'Start Here', hi: 'यहां से शुरू करें' },
    'homepage.features.title': { en: 'Your Core AI Toolkit', hi: 'आपकी कोर एआई टूलकिट' },
    'homepage.features.subtitle': { en: 'Begin with our most popular tools to fast-track your channel\'s growth and engagement.', hi: 'अपने चैनल के विकास और जुड़ाव को तेजी से ट्रैक करने के लिए हमारे सबसे लोकप्रिय टूल के साथ शुरुआत करें।' },
    'homepage.features.viewAll': { en: 'View All Features →', hi: 'सभी सुविधाएँ देखें →' },
    
    // Contact Form
    'contact.title': { en: 'Contact Us', hi: 'संपर्क करें' },
    'contact.subtitle': { en: 'Have a question or suggestion? Drop us a line!', hi: 'कोई प्रश्न या सुझाव है? हमें एक संदेश भेजें!' },
    'contact.name': { en: 'Name', hi: 'नाम' },
    'contact.email': { en: 'Email', hi: 'ईमेल' },
    'contact.message': { en: 'Your message...', hi: 'आपका संदेश...' },
    'contact.success': { en: 'Thanks! BUDDY FOR YOUR SUGGESTION', hi: 'धन्यवाद! आपके सुझाव के लिए दोस्त' },
    'contact.button': { en: 'Contact / Support', hi: 'संपर्क / सहायता' },

    // History Panel
    'history.title': { en: 'Audit History', hi: 'ऑडिट इतिहास' },
    'history.clear': { en: 'Clear History', hi: 'इतिहास साफ़ करें' },
    'history.view': { en: 'View', hi: 'देखें' },
    'history.empty': { en: 'No audit history found.', hi: 'कोई ऑडिट इतिहास नहीं मिला।' },
    'history.confirmClear': { en: 'Are you sure you want to clear your entire audit history? This cannot be undone.', hi: 'क्या आप वाकई अपना पूरा ऑडिट इतिहास साफ़ करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।' },

    // Generic Tool texts
    'tool.channelUrl.placeholder': { en: 'Enter YouTube Channel URL to analyze', hi: 'विश्लेषण करने के लिए यूट्यूब चैनल यूआरएल दर्ज करें' },
    'tool.analyzeAnother': { en: 'Analyze Another', hi: 'दूसरा विश्लेषण करें' },
};

export const getTranslator = (lang: Language) => {
    const t = (key: string): string => {
        if (key in translations) {
            return translations[key][lang] || translations[key]['en'];
        }
        console.warn(`Translation key "${key}" not found.`);
        return key;
    };
    return t;
};

export const detectInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('creator-tune-language');
    if (savedLang && supportedLanguages.some(l => l.code === savedLang)) {
        return savedLang as Language;
    }

    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.some(l => l.code === browserLang)) {
        return browserLang as Language;
    }
    
    return 'en';
};
